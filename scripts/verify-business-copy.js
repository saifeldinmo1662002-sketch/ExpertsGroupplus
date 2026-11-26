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
  '3-Month Notice'
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
assert(visible.includes('id="bpo-highlights"'),'Missing compact BPO contract note');
assert(!visible.includes('grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-6xl mx-auto mb-9 sm:mb-11'),'Old BPO statistic cards unexpectedly remain');
for(const phrase of ['Build your BPO package','Recruitment, training &amp; HR included','CRM','Calendar','Advanced analytics','Get a Quote','Quote + Meeting'])assert(visible.includes(phrase),'Missing BPO quote content: '+phrase);
assert(visible.includes('id="bpo-quote-builder"'),'Missing BPO quote builder');
assert(visible.includes('id="bpo-quote-form"'),'Missing quotation form');
assert(!visible.includes('data-bpo-plan='),'Obsolete fixed packages remain');
assert(visible.includes('lg:grid-cols-[minmax(215px,.65fr)_minmax(0,2fr)]'),'Quote builder needs responsive columns');
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
assert.equal(visible.split('<div').length-1,visible.split('</div>').length-1,'Unbalanced static div elements');
assert.equal(visible.split('<article').length-1,visible.split('</article>').length-1,'Unbalanced article elements');


// Service pages must flow directly from their hero into real page content.
assert(!visible.includes('data-service-badge='),'Obsolete service badge wrapper remains');
for (const service of ['training','consultation','operations','bpo']) {
  assert(visible.includes('class="service-hero-container" data-service="'+service+'"'),'Missing hero for '+service);
}
for (const label of [
  'Tailored Training','Right-Fit Advisory','Matched Specialists','Managed BPO',
  'Training Tailored to Your Workforce','The Right Advisory Expertise',
  'One Project, The Right Specialists','Managed Service and Clear Accountability'
]) {
  assert(!visible.includes(label),'Unnecessary callout label remains: '+label);
}
assert(visible.includes('data-service="training"></div>\n      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10"'),'Training section spacing is wrong');
assert(visible.includes('data-service="consultation"></div>\n      <div class="pt-8 sm:pt-10 pb-12'),'Consultation section spacing is wrong');
assert(visible.includes('data-service="operations"></div>\n      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10"'),'Operations section spacing is wrong');
assert(visible.includes('data-service="bpo"></div>\n      <div id="bpo-service-overview"'),'BPO overview must follow hero');
assert(visible.indexOf('id="bpo-service-overview"')<visible.indexOf('id="bpo-quote-builder"'),'Service overview must precede builder');
for(const phrase of ['Your outsourcing partner','Flexible BPO service models','Professional','Premium','Ultimate','Customize your package'])assert(visible.includes(phrase),'Missing BPO overview: '+phrase);
console.log('BUSINESS_COPY_VALIDATED');
