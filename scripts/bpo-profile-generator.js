'use strict';
/**
 * Generated customer-facing BPO profiles (English and Arabic).
 * No supplier identity, internal margins or discretionary goodwill rules.
 * Uses PDFKit vector layout and the open-source Noto Kufi Arabic font.
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const C = { navy:'#071326', panel:'#102547', blue:'#154695', gold:'#C2A74D', ink:'#15243C',
  muted:'#59667C', pale:'#F2F6FB', white:'#FFFFFF', line:'#D8E1EE' };
const PAGE = { w:595.28, h:841.89, m:44 };

function findArabicFont(weight) {
  const folder = path.join(__dirname,'..','node_modules','@fontsource','noto-kufi-arabic','files');
  const files = fs.readdirSync(folder);
  const preferred = files.find(f => f.includes('-arabic-'+weight+'-normal.woff')) ||
    files.find(f => f.includes('-arabic-'+weight+'-normal.woff2')) ||
    files.find(f => f.includes('-'+weight+'-normal.woff'));
  if (!preferred) throw new Error('Arabic font weight '+weight+' not installed in '+folder);
  return path.join(folder, preferred);
}

const WORDS={
en:{
  brand:'EXPERTS GROUP PLUS', label:'MANAGED BUSINESS OUTSOURCING',
  title:'BPO SOLUTIONS', subtitle:'The people, systems and management your operations need.',
  strap:'One accountable partner. Three levels of operational support.',
  summary:'We recruit, train and administer your outsourced team. Choose whether you supply the software, we supply the technology and SOPs, or we add dedicated leadership and performance quality control.',
  p1:'PROFESSIONAL',p2:'PREMIUM',p3:'ULTIMATE',
  p1Short:'Your tools. Our team.',p2Short:'Our team. Our technology. Client-approved SOP.',p3Short:'Full-service performance management.',
  coverFooter:'RECRUITMENT  /  TRAINING  /  HR & PAYROLL  /  TECHNOLOGY  /  QUALITY',
  section2:'WHAT WE MANAGE',sec2sub:'Structured outsourcing with one commercial relationship',
  intro:'Experts Group Plus is your contracted BPO provider. We manage the agreed outsourced team and coordinate service delivery, while you remain informed through your Account Manager. Coverage, languages, staffing and performance expectations are defined in your proposal.',
  service1:'CUSTOMER SUPPORT',desc1:'Customer inquiries, live chat and support channels within the agreed scope.',
  service2:'SALES SUPPORT',desc2:'Qualified-lead follow-up, sales conversations and customer-facing outreach.',
  service3:'APPOINTMENT SETTING',desc3:'Scheduling and confirmation of meetings and appointments.',
  service4:'BACK-OFFICE PROCESSES',desc4:'Defined administrative workflows, billing support and other recurring tasks.',
  serviceFoot:'The exact processes, team roles and service levels are confirmed in the signed agreement.',
  tierTitle:'THREE SERVICE PACKAGES',tierSub:'Each level builds on the preceding level.',
  t1Desc:'We hire, onboard, train and administratively manage the outsourced team using your existing tools.',
  t1a:'Recruitment and hiring for agreed roles',t1b:'Role-specific onboarding and training',t1c:'HR, payroll and workforce billing administration',t1d:'Work in the client CRM, dialer and other approved systems',
  t2Desc:'All Professional services, plus the technology supplied by Experts Group Plus and standard processes approved by your team.',
  t2a:'We supply the agreed CRM, dialer and software stack',t2b:'Written SOPs reviewed and approved by the client',t2c:'System setup, access and workflow configuration',t2d:'Documentation and reporting aligned to scope',
  t3Desc:'All Premium services, plus a dedicated Team Leader, quality controls and an improvement program.',
  t3a:'Dedicated Team Leader managing daily performance',t3b:'Quality monitoring and targeted coaching',t3c:'KPI follow-up, issue investigation and corrective action',t3d:'Performance reviews and continuous improvement',
  flowTitle:'FROM BRIEF TO ACTIVE DELIVERY',flowSub:'A consistent process, adapted to each engagement.',
  f1:'DISCOVER',f1d:'Agree on the functions, workload, headcount, channels, languages and service hours.',
  f2:'PROPOSE',f2d:'Receive an agreed scope and quotation within 24 hours of your request.',
  f3:'CONTRACT & PAY',f3d:'Confirm the applicable contract, service conditions and recurring billing schedule.',
  f4:'RECRUIT & TRAIN',f4d:'We select, hire and train your assigned team for its defined responsibilities.',
  f5:'CONFIGURE TOOLS',f5d:'Professional uses your tools. Premium and Ultimate include our agreed technology stack.',
  f6:'START & IMPROVE',f6d:'Launch with agreed service expectations, performance reviews and issue escalation.',
  sopTitle:'STANDARD OPERATING PROCEDURES',sopText:'From Premium onward, Experts Group Plus documents the work process in a standard operating procedure (SOP). The client reviews and approves the SOP before it is adopted as the working procedure.',
  controlTitle:'ACCOUNTABILITY, QUALITY & COMMERCIAL TERMS',
  own:'ONE ACCOUNTABLE PROVIDER',ownD:'You work with Experts Group Plus directly; we coordinate delivery and remain responsible for the contracted service.',
  quality:'QUALITY AND FEEDBACK',qualityD:'We gather client feedback quarterly. Ultimate adds dedicated Team Leader supervision, quality control, targeted coaching and continuous improvement.',
  terms:'CONTRACT STRUCTURE',termsD:'Standard BPO terms are annual (12 months). Exceptional six-month agreements may be approved. There is a six-month minimum commitment, three-month termination notice and automatic renewal unless valid notice is received.',
  renewal:'RENEWAL REVIEW',renewD:'We contact the client approximately three months before the scheduled contract end date to discuss continuation. The exact renewal period and other terms follow the signed agreement.',
  scope:'WHAT WE CONFIRM BEFORE LAUNCH',scopeD:'Scope and exclusions, team roles, hours, coverage, languages, client or supplied tools, data access, SOP approval (where applicable), KPIs, reporting, fees and contractual conditions.',
  cta:'LET US DESIGN YOUR BPO TEAM',ctaSub:'Schedule a discovery call to define the team, tools and management level that fit your business.',
  note:'Service availability, software, staffing, pricing, performance targets and contractual terms are governed by your accepted proposal and signed agreement.',
  site:'www.expertsgp.com'
},
ar:{
  brand:'EXPERTS GROUP PLUS',label:'حلول تعهيد الأعمال والخدمات',
  title:'حلول تعهيد العمليات',subtitle:'الفريق والتقنية والإدارة المناسبة لاحتياجات شركتك',
  strap:'شريك واحد مسؤول، وثلاثة مستويات من الدعم التشغيلي.',
  summary:'نتولى اختيار فريق التعهيد وتوظيفه وتدريبه وإدارة شؤونه. وتختار شركتك استخدام أنظمتها الحالية، أو توفير التقنية والإجراءات من جانبنا، أو إضافة قيادة مخصصة ومتابعة متقدمة للجودة والأداء.',
  p1:'PROFESSIONAL',p2:'PREMIUM',p3:'ULTIMATE',
  p1Short:'فريقنا يعمل على أنظمتك',p2Short:'فريقنا وتقنيتنا وإجراءات تعتمدها شركتك',p3Short:'إدارة متكاملة للأداء والجودة',
  coverFooter:'التوظيف  /  التدريب  /  شؤون العاملين والرواتب  /  التقنية  /  الجودة',
  section2:'ما الذي نتولى إدارته؟',sec2sub:'تعهيد منظم بعلاقة تعاقدية واحدة',
  intro:'تتعاقد شركتك مباشرة مع خبراء جروب بلس لتقديم خدمة التعهيد. ونتولى إدارة الفريق المتفق عليه وتنسيق التنفيذ، مع استمرار التواصل عبر مدير حسابك. ويحدد عرض الخدمة عدد الأفراد والمهام واللغات وساعات التغطية ومؤشرات الأداء.',
  service1:'خدمة العملاء',desc1:'الرد على الاستفسارات والمحادثات المباشرة وقنوات الدعم المتفق عليها.',
  service2:'مساندة المبيعات',desc2:'متابعة فرص البيع والمحادثات البيعية والتواصل مع العملاء المحتملين.',
  service3:'تحديد المواعيد',desc3:'تنسيق الاجتماعات والمواعيد وتأكيدها وفق آلية العمل.',
  service4:'الأعمال المكتبية',desc4:'المهام الإدارية المتكررة ودعم الفوترة والعمليات المحددة في الاتفاق.',
  serviceFoot:'تُحدد العمليات والأدوار ومستويات الخدمة بدقة في الاتفاق الموقع.',
  tierTitle:'ثلاث باقات لخدمات التعهيد',tierSub:'كل باقة تتضمن مزايا الباقة السابقة.',
  t1Desc:'نتولى توظيف الفريق وتهيئته وتدريبه وإدارة شؤونه، مع استخدام أنظمتكم الحالية.',
  t1a:'استقطاب وتوظيف الأفراد للأدوار المتفق عليها',t1b:'تهيئة الفريق والتدريب المتخصص على مهام العمل',t1c:'إدارة شؤون العاملين والرواتب وفوترة الفريق',t1d:'استخدام نظام العملاء وبرنامج الاتصال والأدوات المعتمدة لدى شركتك',
  t2Desc:'تتضمن جميع مزايا الباقة الاحترافية، بالإضافة إلى التقنية التي نوفرها وإجراءات تشغيل تعتمدها شركتك.',
  t2a:'توفير أنظمة العملاء والاتصال والبرامج المتفق عليها',t2b:'إجراءات تشغيل قياسية مكتوبة يراجعها العميل ويعتمدها',t2c:'تهيئة الأنظمة والصلاحيات ومسارات العمل',t2d:'توثيق العمليات وإعداد التقارير حسب النطاق',
  t3Desc:'تتضمن مزايا الباقة المتميزة مع قائد فريق مخصص ومراقبة الجودة وخطة لتحسين الأداء.',
  t3a:'قائد فريق مخصص لمتابعة الأداء اليومي',t3b:'مراقبة الجودة والتوجيه المستهدف لتحسين التنفيذ',t3c:'متابعة المؤشرات والتحقيق في المشكلات والإجراءات التصحيحية',t3d:'مراجعات الأداء والتحسين المستمر',
  flowTitle:'من تحديد الاحتياجات إلى بدء التنفيذ',flowSub:'خطوات واضحة تتناسب مع كل اتفاق.',
  f1:'فهم الاحتياجات',f1d:'تحديد العمليات وحجم العمل وعدد الأفراد والقنوات واللغات وساعات التغطية.',
  f2:'إعداد العرض',f2d:'تجهيز النطاق وعرض السعر خلال 24 ساعة من طلب عرض السعر.',
  f3:'العقد والدفع',f3d:'الاتفاق على الشروط ومدد التعاقد وجدول المدفوعات الدورية.',
  f4:'توظيف الفريق وتدريبه',f4d:'اختيار أعضاء الفريق وتوظيفهم وتدريبهم على المسؤوليات المحددة.',
  f5:'تجهيز الأنظمة',f5d:'نستخدم أنظمتكم في الاحترافية، ونوفر التقنية المتفق عليها في المتميزة والشاملة.',
  f6:'بدء العمل والتطوير',f6d:'بدء التنفيذ وفق توقعات متفق عليها، ومتابعة الأداء والتصعيد عند الحاجة.',
  sopTitle:'إجراءات التشغيل القياسية',sopText:'من الباقة المتميزة فصاعدًا، نوثق خطوات العمل في إجراءات تشغيل قياسية. ويراجع العميل تلك الإجراءات ويعتمدها قبل استخدامها كمرجع رسمي للتنفيذ.',
  controlTitle:'المسؤولية والجودة والشروط التجارية',
  own:'جهة واحدة مسؤولة',ownD:'تتعامل شركتك مباشرة مع خبراء جروب بلس، ونتولى تنسيق التنفيذ ونبقى مسؤولين عن الخدمة المتعاقد عليها.',
  quality:'الجودة وآراء العملاء',qualityD:'نجمع ملاحظات العملاء كل ربع سنة. وتضيف الباقة الشاملة قائد فريق مخصص ومراقبة للجودة وتوجيهًا وتحسينًا مستمرًا.',
  terms:'مدد التعاقد والإلغاء',termsD:'العقد المعتاد للتعهيد مدته 12 شهرًا، وقد تتاح عقود ستة أشهر استثنائيًا. الحد الأدنى للالتزام ستة أشهر، مع إشعار إنهاء قبل ثلاثة أشهر وتجديد تلقائي ما لم يصل إشعار صحيح.',
  renewal:'مراجعة الاستمرار',renewD:'نتواصل مع العميل قبل نهاية مدة العقد بنحو ثلاثة أشهر لمناقشة الاستمرار. وتخضع مدة التجديد وباقي التفاصيل للعقد الموقع.',
  scope:'ما نتفق عليه قبل بدء العمل',scopeD:'نطاق العمل والاستثناءات والأدوار وساعات العمل واللغات والأنظمة والصلاحيات واعتماد الإجراءات عند الحاجة والمؤشرات والتقارير والرسوم والشروط.',
  cta:'لنبنِ فريق التعهيد المناسب لشركتك',ctaSub:'احجز مكالمة للتعرف على احتياجاتك وتحديد الفريق والأنظمة ومستوى الإدارة المناسب.',
  note:'تُحدد الموارد والبرمجيات والأسعار والمؤشرات والشروط التعاقدية وفق عرض الخدمة المقبول والاتفاق الموقع.',
  site:'www.expertsgp.com'
}
};

function createBpoProfile(language='en') {
 const ar=language==='ar', T=WORDS[ar?'ar':'en'], chunks=[];
 const doc=new PDFDocument({size:'A4',margin:0,compress:true,autoFirstPage:false,info:{Title:'Experts Group Plus | BPO Solutions ('+language.toUpperCase()+')',Author:'Experts Group Plus',Subject:'BPO services and three cumulative engagement packages'}});
 doc.on('data',chunk=>chunks.push(chunk));
 const result=new Promise((resolve,reject)=>{doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);});
 if(ar){doc.registerFont('AR',findArabicFont('400'));doc.registerFont('ARB',findArabicFont('700'));}
 const font=(bold=false)=>ar?(bold?'ARB':'AR'):(bold?'Helvetica-Bold':'Helvetica');
 const txt=(str,x,y,w,opts={})=>{
   const {size=11,color=C.ink,bold=false,align=(ar?'right':'left'),height=80}=opts;
   // Arabic webfont is an Arabic-only subset; Latin tier names, page numbers
   // and company wordmark must use the built-in Latin font to avoid empty glyphs.
   const useLatin=ar && /^[\x00-\x7F]+$/.test(String(str));
   const chosen=useLatin ? (bold?'Helvetica-Bold':'Helvetica') : font(bold);
   doc.fillColor(color).font(chosen).fontSize(size).text(str,x,y,{
     width:w,height,align,lineGap:ar?4:3,breakLine:false,features:ar?['rtla']:[],ellipsis:false});
 };
 const rrect=(x,y,w,h,fill,r=12,stroke=null)=>{
   doc.roundedRect(x,y,w,h,r).fillColor(fill).fill();
   if(stroke)doc.roundedRect(x,y,w,h,r).lineWidth(.8).strokeColor(stroke).stroke();
 };
 const brand=(dark=false)=>{
   const sx=ar?488:45,sy=38,s=11;
   [[0,-1,C.gold],[0,1,C.gold],[-1,0,C.blue],[1,0,C.blue]].forEach(([a,b,col])=>{
     doc.save().translate(sx+a*16,sy+b*16).rotate(45).rect(-s/2,-s/2,s,s).fillColor(col).fill().restore();
   });
   txt(T.brand,ar?260:84,25,ar?240:290,{size:14,bold:true,color:dark?C.white:C.blue,height:34,align:ar?'right':'left'});
 };
 const footer=(num,dark=false)=>{
   doc.moveTo(44,798).lineTo(551,798).strokeColor(dark?'#4A6284':C.line).lineWidth(.6).stroke();
   txt('EXPERTS GROUP PLUS',44,804,230,{size:8,bold:true,color:dark?'#BBC7DA':C.blue,align:'left',height:18});
   txt(String(num).padStart(2,'0'),520,804,32,{size:8,bold:true,color:dark?'#BBC7DA':C.blue,align:'right',height:18});
 };
 const regular=(n,title,subtitle)=>{
   doc.addPage();
   doc.rect(0,0,PAGE.w,PAGE.h).fillColor(C.white).fill();
   doc.rect(0,0,PAGE.w,6).fillColor(C.gold).fill();
   brand(false);
   doc.moveTo(44,82).lineTo(551,82).strokeColor(C.line).lineWidth(.7).stroke();
   txt(title,44,100,507,{size:ar?23:22,bold:true,color:C.ink,height:65});
   txt(subtitle,44,158,507,{size:ar?10.7:11,color:C.muted,height:62});
   footer(n);
 };
 const block=(x,y,w,h,title,description,light=false)=>{
   rrect(x,y,w,h,light?C.pale:C.white,12,C.line);
   doc.rect(ar?x+w-5:x,y,5,h).fillColor(light?C.gold:C.blue).fill();
   txt(title,x+16,y+18,w-32,{size:ar?12:11,bold:true,color:C.blue,height:31});
   txt(description,x+16,y+55,w-32,{size:ar?9.1:9.5,color:C.muted,height:h-63});
 };
 const bullet=(label,x,y,w)=>{
   const dotX=ar?x+w-7:x+7;
   doc.circle(dotX,y+6,3).fillColor(C.gold).fill();
   txt(label,x+(ar?0:18),y-1,w-18,{size:ar?8.7:9.2,color:C.ink,height:34});
 };

 // COVER
 doc.addPage();doc.rect(0,0,PAGE.w,PAGE.h).fillColor(C.navy).fill();
 doc.roundedRect(-130,480,560,360,85).fillColor('#0D2344').fill();
 doc.circle(630,145,240).fillColor('#113A77').fill();
 doc.circle(567,520,170).lineWidth(1.3).strokeColor(C.gold).stroke();
 brand(true);
 txt(T.label,44,118,507,{size:ar?13:11,bold:true,color:C.gold,height:32});
 txt(T.title,44,178,507,{size:ar?31:46,bold:true,color:C.white,height:100});
 txt(T.subtitle,44,281,507,{size:ar?18:17,color:'#D9E4F6',height:95});
 doc.moveTo(44,385).lineTo(550,385).strokeColor(C.gold).lineWidth(3).stroke();
 txt(T.strap,44,411,507,{size:ar?15:18,bold:true,color:C.white,height:73});
 txt(T.summary,44,488,507,{size:ar?10.4:11.4,color:'#D4E0F1',height:125});
 txt(T.coverFooter,44,729,507,{size:ar?10:9,bold:true,color:C.gold,height:43});
 footer(1,true);

 // OVERVIEW
 regular(2,T.section2,T.sec2sub);
 rrect(44,208,507,119,C.pale,14);
 txt(T.intro,61,223,473,{size:ar?9.8:10.3,color:C.ink,height:100});
 block(44,352,243,156,T.service1,T.desc1,true);
 block(308,352,243,156,T.service2,T.desc2);
 block(44,528,243,156,T.service3,T.desc3);
 block(308,528,243,156,T.service4,T.desc4,true);
 txt(T.serviceFoot,44,718,507,{size:ar?9.1:9.6,color:C.muted,height:52});

 // TIERS: balanced vertical comparison; avoids unverified fixed turnaround or success percentages.
 regular(3,T.tierTitle,T.tierSub);
 const tiers=[
 {name:T.p1,desc:T.t1Desc,bullets:[T.t1a,T.t1b,T.t1c,T.t1d],y:209,color:C.blue},
 {name:T.p2,desc:T.t2Desc,bullets:[T.t2a,T.t2b,T.t2c,T.t2d],y:396,color:C.gold},
 {name:T.p3,desc:T.t3Desc,bullets:[T.t3a,T.t3b,T.t3c,T.t3d],y:583,color:C.blue}
 ];
 for(const tier of tiers){
   rrect(44,tier.y,507,178,C.white,14,C.line);
   doc.roundedRect(44,tier.y,507,37,13).fillColor(tier.color).fill();
   txt(tier.name,61,tier.y+8,475,{size:13,bold:true,color:tier.color===C.gold?C.navy:C.white,height:28,align:ar?'right':'left'});
   txt(tier.desc,61,tier.y+48,473,{size:ar?9:9.1,color:C.muted,height:50});
   const positions=[tier.y+94,tier.y+114,tier.y+134,tier.y+154];
   tier.bullets.forEach((v,i)=>bullet(v,61,positions[i],468));
 }

 // PROCESS
 regular(4,T.flowTitle,T.flowSub);
 const steps=[
 [T.f1,T.f1d],[T.f2,T.f2d],[T.f3,T.f3d],
 [T.f4,T.f4d],[T.f5,T.f5d],[T.f6,T.f6d]
 ];
 for(let i=0;i<steps.length;i++){
   const col=i%2,row=Math.floor(i/2),x=44+col*264,y=211+row*137;
   block(x,y,243,119,steps[i][0],steps[i][1],row%2===0);
 }
 rrect(44,648,507,117,C.navy,13);
 txt(T.sopTitle,61,666,472,{size:ar?12:12,bold:true,color:C.gold,height:32});
 txt(T.sopText,61,699,472,{size:ar?9.2:9.5,color:C.white,height:66});

 // GOVERNANCE AND NEXT STEP
 regular(5,T.controlTitle,'');
 block(44,192,243,119,T.own,T.ownD,true);
 block(308,192,243,119,T.quality,T.qualityD);
 block(44,325,243,170,T.terms,T.termsD);
 block(308,325,243,170,T.renewal,T.renewD,true);
 rrect(44,510,507,90,C.pale,12,C.line);
 txt(T.scope,59,521,476,{size:ar?11:11,bold:true,color:C.blue,height:25});
 txt(T.scopeD,59,549,476,{size:ar?8.7:9.1,color:C.muted,height:48});
 rrect(44,624,507,109,C.navy,14);
 txt(T.cta,61,639,473,{size:ar?14:15,bold:true,color:C.white,height:36});
 txt(T.ctaSub,61,672,473,{size:ar?9.2:10,color:'#D8E3F1',height:38});
 txt(T.site,61,708,473,{size:10,bold:true,color:C.gold,height:24,align:ar?'right':'left'});
 txt(T.note,44,744,507,{size:ar?7.7:8,color:C.muted,height:46});

 doc.end();return result;
}
module.exports={createBpoProfile};
if (require.main===module) {
 const language=process.argv[2]==='ar'?'ar':'en';
 const output=process.argv[3]||path.join(process.cwd(),'bpo-'+language+'.pdf');
 createBpoProfile(language).then(bytes=>{fs.writeFileSync(output,bytes);process.stdout.write(output+' '+bytes.length+' bytes\n');}).catch(e=>{console.error(e);process.exit(1)});
}
