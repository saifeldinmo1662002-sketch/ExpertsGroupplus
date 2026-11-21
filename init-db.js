require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const seed = require('./seed-content.json');
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_favicon_asset (id INTEGER PRIMARY KEY CHECK(id=1),mime_type TEXT NOT NULL,file_data BYTEA NOT NULL);
    CREATE TABLE IF NOT EXISTS site_preferences (key TEXT PRIMARY KEY,value TEXT NOT NULL DEFAULT '');
    CREATE TABLE IF NOT EXISTS seo_page_settings (id BIGSERIAL PRIMARY KEY,page_key TEXT NOT NULL,language TEXT NOT NULL CHECK(language IN ('en','ar')),seo_title TEXT NOT NULL,meta_description TEXT NOT NULL,focus_keyword TEXT NOT NULL DEFAULT '',additional_keywords TEXT NOT NULL DEFAULT '',canonical_url TEXT,robots_directive TEXT NOT NULL DEFAULT 'index,follow,max-image-preview:large',social_title TEXT NOT NULL DEFAULT '',social_description TEXT NOT NULL DEFAULT '',social_image TEXT,seo_notes TEXT NOT NULL DEFAULT '',updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(page_key,language));
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
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS event_label TEXT;
     ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS duration_ms INTEGER;
    ALTER TABLE analytics_visitors ADD COLUMN IF NOT EXISTS browser_language TEXT;
    ALTER TABLE analytics_visitors ADD COLUMN IF NOT EXISTS timezone_name TEXT;
    ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS browser_language TEXT;
    ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS timezone_name TEXT;
    CREATE INDEX IF NOT EXISTS analytics_sessions_source_idx ON analytics_sessions(source,medium,started_at DESC);
    CREATE INDEX IF NOT EXISTS analytics_sessions_device_idx ON analytics_sessions(device_category,started_at DESC);
    CREATE INDEX IF NOT EXISTS analytics_events_type_created_idx ON analytics_events(event_name,created_at DESC);
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
    CREATE TABLE IF NOT EXISTS profile_download_assets (
      profile_key TEXT PRIMARY KEY, page_key TEXT NOT NULL,
      language TEXT NOT NULL CHECK (language IN ('en','ar')),
      file_name TEXT NOT NULL, mime_type TEXT NOT NULL DEFAULT 'application/pdf',
      file_size INTEGER NOT NULL, file_data BYTEA NOT NULL,
      uploaded_by BIGINT REFERENCES admins(id) ON DELETE SET NULL,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS profile_download_requests (
      id BIGSERIAL PRIMARY KEY, profile_key TEXT NOT NULL, page_key TEXT NOT NULL,
      language TEXT NOT NULL CHECK (language IN ('en','ar')),
      full_name TEXT NOT NULL, company_name TEXT NOT NULL,
      email TEXT NOT NULL, phone_number TEXT NOT NULL,
      file_name TEXT NOT NULL, file_size INTEGER NOT NULL,
      requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS profile_download_requests_requested_idx ON profile_download_requests(requested_at DESC);
    CREATE INDEX IF NOT EXISTS profile_download_requests_profile_idx ON profile_download_requests(profile_key,requested_at DESC);
  `);
  // One-time, non-destructive favicon update: apply the approved brand icon now,
  // while preserving any future favicon changed through the SEO admin interface.
  await pool.query(`
    WITH applied AS (
      INSERT INTO site_preferences(key,value) VALUES ('egp_favicon_diamonds_2026_applied','1')
      ON CONFLICT(key) DO NOTHING RETURNING key
    )
    INSERT INTO site_preferences(key,value)
    SELECT 'search_favicon_url','https://www.expertsgp.com/assets/egp-favicon.png' FROM applied
    ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value;
  `);
  for (const [type, rows] of Object.entries({review:seed.reviews, operation:seed.operations, consultation:seed.consultation})) {
    for (let i=0;i<rows.length;i++) {
      const row=rows[i]; const key=String(row.id || `${type}-${i+1}`);
      const sortOrder=type==='operation'&&key==='crm-platform'?-1:i;
      await pool.query(`INSERT INTO content_items(content_type,item_key,data,sort_order) VALUES($1,$2,$3,$4) ON CONFLICT(content_type,item_key) DO NOTHING`,[type,key,row,sortOrder]);
    }
  }
  // Redirect the originally seeded CRM card to our company domain while
  // keeping any later administrator-customized destinations unchanged.
  await pool.query(`UPDATE content_items SET data=jsonb_set(data,'{externalUrl}',to_jsonb($1::text),true)
    WHERE content_type='operation' AND item_key='crm-platform' AND data->>'externalUrl'=$2`,
    ['https://www.expertsgp.com/CRM','https://crm-web-production-943c6485.up.railway.app/']);
  // Seed optimized bilingual SEO only where no settings exist or the legacy default title is unchanged.
  const seoSeed=[["home","en","Business Consulting, Training & BPO | Experts Group Plus","Grow your business with corporate training, strategic consulting, outsourced operations and BPO services from Experts Group Plus.","business consulting","corporate training, business consulting services, business process outsourcing, BPO services, outsourced operations","Experts Group Plus | Managed Business Services"],["about","en","About Experts Group Plus | Business Services Partner","Discover how Experts Group Plus supports organizations through practical training, business consulting, operations and outsourcing services.","business services","about Experts Group Plus, business consulting company, corporate services, business solutions","About Experts Group Plus | Our Company"],["training","en","Corporate Training & Employee Development | Experts Group Plus","Build employee and leadership capabilities with practical corporate training programs designed around your team's needs and business goals.","corporate training","employee development, leadership training, management training, staff training programs","Corporate Training Services | Experts Group Plus"],["consultation","en","Business Consulting & Strategic Advisory | Experts Group Plus","Improve business performance with management consulting, strategic planning, operational reviews and practical advisory support.","business consulting","management consulting, strategic advisory, business strategy, operational improvement","Business Consultation & Strategy | Experts Group Plus"],["operations","en","Outsourced Business Operations | Experts Group Plus","Access flexible business operations support across marketing, creative, technology and corporate functions, tailored to your organization.","outsourced business operations","business operations support, outsourced operations, marketing operations, technology services","Business Operations Services | Experts Group Plus"],["bpo","en","BPO & Business Process Outsourcing | Experts Group Plus","Explore business process outsourcing for customer support, sales support and back-office operations with Experts Group Plus.","business process outsourcing","BPO services, customer support outsourcing, sales support outsourcing, back office outsourcing","Business Process Outsourcing | Experts Group Plus"],["contact","en","Contact Experts Group Plus | Schedule a Consultation","Speak with Experts Group Plus about corporate training, business consulting, outsourced operations or BPO. Schedule a conversation.","contact Experts Group Plus","schedule a consultation, business services inquiry, contact business consultants","Contact Experts Group Plus | Start a Conversation"],["home","ar","خدمات الأعمال والاستشارات والتعهيد | خبراء جروب بلس","نساعد الشركات على تطوير أعمالها من خلال التدريب المؤسسي والاستشارات الإدارية وخدمات التشغيل وتعهيد العمليات، بحلول تناسب احتياجات كل شركة.","خدمات الأعمال","استشارات إدارية، تدريب الشركات، خدمات التعهيد، تشغيل الأعمال، حلول الأعمال","خبراء جروب بلس | حلول متكاملة للأعمال"],["about","ar","من نحن | خبراء جروب بلس لخدمات الأعمال","تعرّف على خبراء جروب بلس وكيف نساعد الشركات في التدريب وتطوير الأداء والاستشارات الإدارية وتشغيل الأعمال وخدمات التعهيد.","خبراء جروب بلس","من نحن، شركة خدمات أعمال، حلول للشركات، استشارات وتدريب","من نحن | خبراء جروب بلس"],["training","ar","تدريب الشركات وتطوير الموظفين | خبراء جروب بلس","برامج تدريب عملي للشركات والموظفين والمديرين، مصممة لتطوير المهارات ورفع كفاءة الفرق وتحسين الأداء في بيئة العمل.","تدريب الشركات","تطوير الموظفين، تدريب المديرين، برامج تدريب مؤسسي، تطوير المهارات","التدريب المؤسسي | خبراء جروب بلس"],["consultation","ar","استشارات إدارية وتطوير الأعمال | خبراء جروب بلس","استشارات إدارية واستراتيجية لمساعدة الشركات على تقييم الأداء وتطوير خطط العمل وتحسين العمليات واتخاذ قرارات أفضل.","استشارات إدارية","استشارات للشركات، تطوير الأعمال، التخطيط الاستراتيجي، تحسين العمليات","الاستشارات الإدارية والاستراتيجية | خبراء جروب بلس"],["operations","ar","خدمات تشغيل وإدارة الأعمال | خبراء جروب بلس","دعم مرن لتشغيل الأعمال في التسويق والتصميم والتقنية والوظائف الإدارية، بما يتناسب مع طبيعة شركتك واحتياجاتها.","تشغيل الأعمال","إدارة العمليات، خدمات تشغيل للشركات، دعم الأعمال، خدمات التسويق والتقنية","خدمات العمليات | خبراء جروب بلس"],["bpo","ar","تعهيد العمليات وخدمات BPO للشركات | خبراء جروب بلس","حلول تعهيد العمليات للشركات تشمل دعم العملاء ومساندة المبيعات والأعمال المكتبية والإدارية، مع مرونة تناسب حجم العمل.","تعهيد العمليات","خدمات BPO، تعهيد خدمة العملاء، دعم المبيعات، تعهيد الأعمال الإدارية","خدمات تعهيد العمليات التجارية | خبراء جروب بلس"],["contact","ar","تواصل معنا واحجز استشارة | خبراء جروب بلس","تواصل مع فريق خبراء جروب بلس لمناقشة احتياجات شركتك في التدريب والاستشارات الإدارية والتشغيل وخدمات تعهيد العمليات.","تواصل معنا","احجز استشارة، التواصل مع خبراء جروب بلس، استفسارات خدمات الشركات","تواصل مع خبراء جروب بلس"]];
  for(const [page,lang,title,description,keyword,keywords,legacyTitle] of seoSeed){
    await pool.query(`INSERT INTO seo_page_settings(page_key,language,seo_title,meta_description,focus_keyword,additional_keywords,social_title,social_description)
      VALUES($1,$2,$3,$4,$5,$6,$3,$4)
      ON CONFLICT(page_key,language) DO UPDATE SET
      seo_title=EXCLUDED.seo_title,meta_description=EXCLUDED.meta_description,
      focus_keyword=EXCLUDED.focus_keyword,additional_keywords=EXCLUDED.additional_keywords,
      social_title=EXCLUDED.social_title,social_description=EXCLUDED.social_description,updated_at=NOW()
      WHERE seo_page_settings.seo_title=$7`,[page,lang,title,description,keyword,keywords,legacyTitle]);
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
