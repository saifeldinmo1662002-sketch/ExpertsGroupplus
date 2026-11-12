require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const seed = require('./seed-content.json');
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id BIGSERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT 'Administrator', role TEXT NOT NULL DEFAULT 'admin',
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
      approved_by BIGINT REFERENCES admins(id), approved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_login TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS content_items (
      id BIGSERIAL PRIMARY KEY, content_type TEXT NOT NULL CHECK (content_type IN ('review','operation','consultation')),
      item_key TEXT NOT NULL, data JSONB NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(content_type,item_key)
    );
    CREATE TABLE IF NOT EXISTS site_links (
      link_key TEXT PRIMARY KEY, label TEXT NOT NULL, url TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT,
      scope TEXT, message TEXT, preferred_contact TEXT, language TEXT DEFAULT 'en',
      status TEXT NOT NULL DEFAULT 'new', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS contact_submissions_created_idx ON contact_submissions(created_at DESC);
    CREATE TABLE IF NOT EXISTS analytics_visitors(visitor_id TEXT PRIMARY KEY,first_seen TIMESTAMPTZ NOT NULL,last_seen TIMESTAMPTZ NOT NULL,first_path TEXT,first_referrer TEXT,country_code TEXT,device_category TEXT,browser TEXT,operating_system TEXT);
    CREATE TABLE IF NOT EXISTS analytics_sessions(session_id TEXT PRIMARY KEY,visitor_id TEXT NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,started_at TIMESTAMPTZ NOT NULL,last_seen TIMESTAMPTZ NOT NULL,landing_page TEXT,referrer TEXT,source TEXT,medium TEXT,campaign TEXT,country_code TEXT,device_category TEXT,browser TEXT,operating_system TEXT);
    CREATE TABLE IF NOT EXISTS analytics_events(id BIGSERIAL PRIMARY KEY,session_id TEXT NOT NULL REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,visitor_id TEXT NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,event_name TEXT NOT NULL,page_path TEXT,referrer TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events(created_at DESC);
    CREATE INDEX IF NOT EXISTS analytics_events_page_idx ON analytics_events(page_path,created_at DESC);
    CREATE INDEX IF NOT EXISTS analytics_sessions_started_idx ON analytics_sessions(started_at DESC);
    CREATE INDEX IF NOT EXISTS content_items_type_order_idx ON content_items(content_type,sort_order);
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notification_status TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notification_id TEXT;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notification_error TEXT;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS apollo_sync_status TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS apollo_sync_error TEXT;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS apollo_contact_id TEXT;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS apollo_deal_id TEXT;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS apollo_task_id TEXT;
    ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS apollo_synced_at TIMESTAMPTZ;
  `);
  for (const [type, rows] of Object.entries({review:seed.reviews, operation:seed.operations, consultation:seed.consultation})) {
    for (let i=0;i<rows.length;i++) {
      const row=rows[i]; const key=String(row.id || `${type}-${i+1}`);
      await pool.query(`INSERT INTO content_items(content_type,item_key,data,sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(content_type,item_key) DO NOTHING`,[type,key,row,i]);
    }
  }
  const email=(process.env.ADMIN_EMAIL||'').trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD||'';
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in Railway before starting.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('ADMIN_EMAIL must be a valid email address.');
  if (password.length < 14) throw new Error('ADMIN_PASSWORD must be at least 14 characters.');
  const hash=await bcrypt.hash(password,12);
  await pool.query(`INSERT INTO admins(email,password_hash,display_name,role,status) VALUES($1,$2,'Platform Owner','owner','approved') ON CONFLICT(email) DO NOTHING`,[email,hash]);
  console.log('Database schema and seed content are ready.');
  await pool.end();
})().catch(async e=>{console.error(e);await pool.end();process.exit(1)});
