'use strict';
const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const {createBpoProfile}=require('./bpo-profile-generator');
(async()=>{
  const outputDir=process.env.BPO_PDF_OUTPUT_DIR;
  for(const lang of ['en','ar']){
    const pdf=await createBpoProfile(lang);
    assert(Buffer.isBuffer(pdf),'Generator must return PDF Buffer');
    assert(pdf.length>5000&&pdf.length<5*1024*1024,'PDF outside expected size range');
    assert.equal(pdf.subarray(0,5).toString('ascii'),'%PDF-','Wrong PDF header');
    assert(pdf.includes(Buffer.from('/Type /Page')),'PDF pages missing');
    if(outputDir){fs.mkdirSync(outputDir,{recursive:true});fs.writeFileSync(path.join(outputDir,'BPO_'+lang+'.pdf'),pdf)}
    console.log('BPO_PDF_OK',lang,pdf.length);
  }
})().catch(e=>{console.error(e);process.exit(1)});
