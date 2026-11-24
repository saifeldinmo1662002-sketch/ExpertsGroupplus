'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'public-site.html'),'utf8');
const translations=JSON.parse(fs.readFileSync(path.join(root,'public/ar-translations.json'),'utf8'));
const anchor='    const EG_AR = ';
const split=html.indexOf(anchor);
assert(split>=0,'Embedded Arabic dictionary should exist');
const visible=html.slice(0,split);
const dictLine=html.slice(split+anchor.length).split('\n')[0].replace(/;$/,'');
const embedded=JSON.parse(dictLine);
const required=[
  'Why Choose Experts Group Plus?',
  'Expertise Vetted Beforehand',
  'Best Fit for Every Deliverable',
  'Quotations in 24 Hours',
  'One Accountable Provider',
  'What are your BPO contract terms?',
  'How do BPO renewals work?',
  'How is BPO quality monitored?',
  '6-Month Minimum',
  '3-Month Notice',
  'One Project, The Right Specialists'
];
for (const value of required) {
  assert(visible.includes(value),'Missing English website copy: '+value);
  assert(translations[value],'Missing Arabic translation: '+value);
  assert.equal(embedded[value],translations[value],'Embedded translation out of sync: '+value);
}
for(const phrase of ['zero lock-in','zero contract lock-in','98% CSAT','55% Close','60% Conv.','15% goodwill','15% refund']) {
  assert(!visible.toLowerCase().includes(phrase.toLowerCase()),'Misleading or private public copy: '+phrase);
}
assert.equal(visible.split('<section ').length-1,visible.split('</section>').length-1,'Unclosed section tag');
assert.equal(html.split('<script').length-1,html.split('</script>').length-1,'Unclosed script tag');
assert(visible.includes('renew automatically'),'Missing BPO renewal rule');
assert(visible.includes('six-month minimum'),'Missing BPO six-month commitment');
assert(visible.includes('three months’ termination notice'),'Missing BPO notice rule');
console.log('BUSINESS_COPY_VALIDATED');
