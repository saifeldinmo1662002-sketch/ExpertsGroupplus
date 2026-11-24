'use strict';
const pool=require('../db');
const {createBpoProfile}=require('./bpo-profile-generator');
const ID='bpo_service_tiers_2026_11_24';
const specs=[
  {key:'bpo_en',language:'en',file:'Experts_Group_Plus_BPO_Solutions_EN_Updated.pdf'},
  {key:'bpo_ar',language:'ar',file:'Experts_Group_Plus_BPO_Solutions_AR_Updated.pdf'}
];
// One-time update of existing download slots. Preserve historical downloads
// and back up prior PDF bytes. Future admin uploads remain in control.
async function sync(){
  const docs=await Promise.all(specs.map(async spec=>{
    const pdf=await createBpoProfile(spec.language);
    if(!Buffer.isBuffer(pdf)||pdf.length<5000||pdf.subarray(0,5).toString('ascii')!=='%PDF-')
      throw new Error('Invalid generated BPO PDF: '+spec.key);
    return {...spec,pdf};
  }));
  const conn=await pool.connect();
  try {
    await conn.query('BEGIN');
    await conn.query('SELECT pg_advisory_xact_lock(hashtext($1))',[ID]);
    await conn.query('CREATE TABLE IF NOT EXISTS profile_pdf_content_migrations(migration_id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
    await conn.query('CREATE TABLE IF NOT EXISTS profile_download_asset_backups(migration_id TEXT NOT NULL, profile_key TEXT NOT NULL, original_file_name TEXT, original_mime_type TEXT, original_file_size INTEGER, original_file_data BYTEA, original_uploaded_at TIMESTAMPTZ, saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(migration_id,profile_key))');
    const done=await conn.query('SELECT 1 FROM profile_pdf_content_migrations WHERE migration_id=$1',[ID]);
    if(done.rows.length){
      await conn.query('COMMIT');
      console.log('BPO profiles already updated by migration',ID);
      return;
    }
    for (const doc of docs){
      const old=await conn.query('SELECT file_name,mime_type,file_size,file_data,uploaded_at FROM profile_download_assets WHERE profile_key=$1 FOR UPDATE',[doc.key]);
      if(old.rows.length){
        const o=old.rows[0];
        await conn.query('INSERT INTO profile_download_asset_backups(migration_id,profile_key,original_file_name,original_mime_type,original_file_size,original_file_data,original_uploaded_at) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING',
          [ID,doc.key,o.file_name,o.mime_type,o.file_size,o.file_data,o.uploaded_at]);
      }
      await conn.query("INSERT INTO profile_download_assets(profile_key,page_key,language,file_name,mime_type,file_size,file_data,uploaded_by,uploaded_at) VALUES($1,'bpo',$2,$3,'application/pdf',$4,$5,NULL,NOW()) ON CONFLICT(profile_key) DO UPDATE SET page_key='bpo',language=EXCLUDED.language,file_name=EXCLUDED.file_name,mime_type=EXCLUDED.mime_type,file_size=EXCLUDED.file_size,file_data=EXCLUDED.file_data,uploaded_by=NULL,uploaded_at=NOW()",
         [doc.key,doc.language,doc.file,doc.pdf.length,doc.pdf]);
    }
    await conn.query('INSERT INTO profile_pdf_content_migrations(migration_id) VALUES($1)',[ID]);
    await conn.query('COMMIT');
    console.log('BPO EN/AR profile download assets updated; originals backed up where present.');
  }catch(err){
    await conn.query('ROLLBACK').catch(()=>{});
    throw err;
  }finally{conn.release()}
}
sync().catch(e=>{console.error('BPO PDF synchronization failed:',e);process.exitCode=1})
.finally(()=>pool.end());
