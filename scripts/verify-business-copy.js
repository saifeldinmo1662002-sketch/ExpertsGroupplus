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

// Layout and bilingual regression checks for the compact homepage / portrait BPO cards.
assert(visible.includes('id="home-advantages"'),'Missing compact home advantages');
assert(visible.includes('id="bpo-highlights"'),'Missing compact BPO summary');
assert(visible.includes('id="bpo-plan-grid"'),'Missing BPO plan grid');
assert(visible.includes('grid-cols-1 md:grid-cols-2 lg:grid-cols-3'),'BPO plans must stack on phones and show portrait columns on desktop');
for(const name of ['professional','premium','ultimate']){
  assert(visible.includes('data-bpo-plan="'+name+'"'),'Missing BPO option '+name);
}
assert.equal((visible.match(/data-bpo-plan="/g)||[]).length,3,'Exactly three BPO options expected');
assert(visible.includes('@media (min-width: 1700px)'),'Responsive ultra-wide layout rule missing');
assert(visible.includes('#view-home .max-w-7xl'),'Wide view should remain scoped to homepage');
assert(!visible.includes('Priority 48-hour onboarding launch'),'Unverified fixed onboarding promise reappeared');
assert(!visible.includes('Most Popular'),'Unverified most-popular claim reappeared');
for(const key of [
 'Featured','Priority onboarding planning','Dedicated team lead & quality oversight',
 'Agreed service levels & email/chat coverage','Ultimate','All of Professional, plus:','All of Premium, plus:',
 'Relevant experience and feedback checked before we recommend a specialist.',
 'Complementary expertise, brought together under one coordinated service.',
 'A tailored quotation prepared within 24 hours of your request.',
 'One relationship, coordinated execution and reviewed deliverables.'
]){
  assert(translations[key],'Missing Arabic translation for '+key);
  assert.equal(embedded[key],translations[key],'Embedded translation not in sync: '+key);
}
assert.equal((visible.match(/<div(?:\\s|>)/g)||[]).length,(visible.match(/<\\/div>/g)||[]).length,'Unbalanced static div elements');
assert.equal((visible.match(/<article(?:\\s|>)/g)||[]).length,(visible.match(/<\\/article>/g)||[]).length,'Unbalanced article elements');

console.log('BUSINESS_COPY_VALIDATED');
