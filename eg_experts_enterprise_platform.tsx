import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Menu, X, ChevronDown, ChevronRight, ChevronUp, ChevronLeft,
  Target, Eye, Award, Briefcase, Users, Zap,
  GraduationCap, Lightbulb, Settings, Headset, 
  Mail, Phone, MapPin, Share2, Search, BarChart2, 
  Palette, FileText, UserPlus, Video, Box, 
  Calendar, Megaphone, Code, Truck, CheckCircle2, PlusCircle,
  TrendingUp, ShieldCheck, Laptop, Building, UserCheck,
  ArrowRight, Check, Globe, Layers, ExternalLink,
  ThumbsUp, MessageSquare, Headphones, Clock, Sparkles
} from 'lucide-react';

const BRAND = {
  blue: '#1C4C96',
  gold: '#C2A74C'
};

const CALENDAR_LINK = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3zb9w_gavqu04nfboUT0cLYoHTIJoED4yWBNYW4GgRN6msObv9zF5NQBBFpavnPoQGP34fApJ3";

const BrandLogo = () => (
  <div className="flex items-center gap-3 select-none">
    <svg className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 drop-shadow-sm transition-transform duration-300 hover:scale-105" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="38" y="13" width="24" height="24" rx="6" transform="rotate(45 50 25)" fill={BRAND.gold}/>
      <rect x="38" y="63" width="24" height="24" rx="6" transform="rotate(45 50 75)" fill={BRAND.gold}/>
      <rect x="13" y="38" width="24" height="24" rx="6" transform="rotate(45 25 50)" fill={BRAND.blue}/>
      <rect x="63" y="38" width="24" height="24" rx="6" transform="rotate(45 75 50)" fill={BRAND.blue}/>
    </svg>
    <div className="flex flex-col uppercase font-black leading-[1.05] tracking-tight">
      <span className="text-[#1C4C96] dark:text-white text-lg sm:text-2xl transition-colors">Experts</span>
      <div className="flex items-baseline">
        <span className="text-[#1C4C96] dark:text-white text-lg sm:text-2xl transition-colors">Group</span>
        <span className="text-[#C2A74C] text-[9px] sm:text-[11px] ml-1 font-bold tracking-widest">PLUS</span>
      </div>
    </div>
  </div>
);

const ServiceHero = ({ breadcrumbs, title, subtitle, badges }) => (
  <div className="relative bg-slate-50 dark:bg-[#0B132B] overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:28px_28px] opacity-60 dark:opacity-100"></div>
    <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-[#1C4C96]/10 dark:bg-[#1C4C96]/25 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-[#C2A74C]/10 dark:bg-[#C2A74C]/15 rounded-full blur-[70px] sm:blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 uppercase tracking-wider">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className={idx === breadcrumbs.length - 1 ? 'text-[#1C4C96] dark:text-[#C2A74C]' : ''}>{crumb}</span>
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-[1.15] tracking-tight">
            {title.split(' ').map((word, i) => (
              word.toLowerCase() === 'expert' ? 
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C4C96] to-[#3b82f6] dark:from-[#C2A74C] dark:to-[#fef08a] mr-2 sm:mr-3">{word}</span> : 
                <span key={i} className="mr-2 sm:mr-3">{word}</span>
            ))}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 w-full max-w-md">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-4 transition-all duration-300"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-900/90 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 text-[#1C4C96] dark:text-[#C2A74C]">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{badge.label}</div>
                    <div className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">{badge.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SplitFAQSection = ({ faqs, subtitle = "Here are some common questions about our services and operational delivery." }) => {
  const [openIdx, setOpenIdx] = useState(0);
  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-24">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-28 bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-4">
            Need Clarification?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
            {subtitle}
          </p>
          <a 
            href={CALENDAR_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-all duration-300 shadow-md shadow-[#1C4C96]/20 text-xs sm:text-sm group"
          >
            <span>Schedule a Call</span>
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        <div className="lg:col-span-8 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white dark:bg-slate-800/90 rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
                  isOpen 
                    ? 'border-[#1C4C96]/50 dark:border-[#C2A74C]/50 ring-1 ring-[#1C4C96]/20 dark:ring-[#C2A74C]/20' 
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <button 
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between focus:outline-none min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-sm sm:text-base pr-3 transition-colors ${
                    isOpen ? 'text-[#1C4C96] dark:text-[#C2A74C]' : 'text-slate-900 dark:text-white'
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen 
                      ? 'bg-[#1C4C96] text-white dark:bg-[#C2A74C] dark:text-slate-950' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm border-t border-slate-100 dark:border-slate-700/60">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ScheduleCallCTA = ({ 
  title = "Ready to Supercharge Your Operations?", 
  subtitle = "Schedule a call with our senior leadership team to discover how EG-Experts can streamline your business." 
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br sm:bg-gradient-to-r from-[#1C4C96] via-[#163e7c] to-[#0b1e3f] p-7 sm:p-12 md:p-14 text-white shadow-xl border border-blue-400/20">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C2A74C]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C2A74C] font-semibold text-xs uppercase tracking-wider mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            Let's Collaborate
          </div>
          <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3">
            {title}
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>
        <a
          href={CALENDAR_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-[#C2A74C] hover:bg-[#d8be5e] text-slate-950 font-bold transition-all duration-300 shadow-lg shadow-black/20 group text-sm sm:text-base min-h-[48px]"
        >
          <span>Schedule a Call</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  </div>
);

const HomePage = ({ navigate }) => (
  <div className="animate-in fade-in duration-500">
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(28,76,150,0.15)_0%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(194,167,76,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 mb-6 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#C2A74C] animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">ENTERPRISE B2B SOLUTIONS</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-6 max-w-5xl mx-auto">
          Your All-In-One <br className="hidden sm:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C4C96] via-[#2563eb] to-[#C2A74C] dark:from-[#C2A74C] dark:via-[#eadd9d] dark:to-white">Managed Service Provider</span>
        </h1>
        
        <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
          Scale operations, upskill your workforce, and streamline processes with our premier training, strategic consultation, operational delegation, and BPO solutions designed for modern enterprises.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
          <a 
            href={CALENDAR_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-all duration-300 shadow-md shadow-[#1C4C96]/20 flex items-center justify-center gap-2 group text-base min-h-[48px]"
          >
            <span>Schedule a Call</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <button 
            onClick={() => navigate('about')} 
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-[#1C4C96] dark:hover:border-[#C2A74C] hover:text-[#1C4C96] dark:hover:text-[#C2A74C] transition-all duration-300 flex items-center justify-center text-base shadow-sm min-h-[48px]"
          >
            Discover Our Story
          </button>
        </div>
      </div>
    </section>

    {/* Core Divisions Grid */}
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            Core Pillars
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Our Four Divisions</h2>
          <div className="w-16 h-1 bg-[#C2A74C] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { icon: GraduationCap, title: "Expert Training", desc: "Customized upskilling & structured onboarding for new hires and management.", tag: "Tailored Curricula", path: "training" },
            { icon: Lightbulb, title: "Expert Consultation", desc: "Rigorous 3-week strategic diagnostics and hands-on advisory execution.", tag: "3-Week Diagnostic", path: "consultation" },
            { icon: Settings, title: "Expert Operations", desc: "Comprehensive 12-point operational delegation with 1-3 day rapid onboarding.", tag: "12 Service Pods", path: "operations" },
            { icon: Headset, title: "Expert BPO", desc: "Specialized, high-conversion support with guaranteed CSAT and zero lock-in.", tag: "98% Chat CSAT", path: "bpo" }
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => navigate(item.path)} 
              className="bg-slate-50 dark:bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm text-center cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:border-[#1C4C96]/40 dark:hover:border-[#C2A74C]/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-800 group-hover:bg-[#1C4C96] dark:group-hover:bg-[#C2A74C] group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#1C4C96] dark:text-[#C2A74C] group-hover:text-white dark:group-hover:text-slate-950 transition-colors" />
                </div>
                <div className="text-[11px] font-bold text-[#1C4C96] dark:text-[#C2A74C] uppercase tracking-wider mb-2">{item.tag}</div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#1C4C96] dark:group-hover:text-[#C2A74C] transition-colors">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center gap-1.5 text-xs font-bold text-[#1C4C96] dark:text-[#C2A74C] group-hover:gap-2.5 transition-all">
                <span>Explore division</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <ScheduleCallCTA 
      title="Ready to Scale Your Enterprise Operations?"
      subtitle="Schedule a call with our senior leadership team to map out a customized operational roadmap."
    />
  </div>
);

const AboutPage = () => {
  const pillars = [
    { label: "Training", id: "training" },
    { label: "Consultation", id: "consultation" },
    { label: "Services", id: "operations" },
    { label: "BPO", id: "bpo" }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-16 bg-slate-50/60 dark:bg-slate-950 transition-colors">
      <ServiceHero 
        breadcrumbs={['Home', 'About Us']}
        title="About Experts Group"
        subtitle="We partner with businesses to solve complex operational challenges, accelerate growth, and drive long-term workforce excellence."
        badges={[
          { icon: Building, label: "Headquarters", value: "Cairo, Egypt" },
          { icon: Users, label: "Companies Empowered", value: "200+ Clients" }
        ]}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4 sm:space-y-6">
          <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
            At EG-Experts, we believe that every business has the potential to thrive when backed by the right strategy and a dedicated team. Based in Egypt, we are a full-service business consulting, operational management, and Business Process Outsourcing (BPO) firm dedicated to solving complex business problems.
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            We are a team of passionate, forward-thinking professionals whose primary goal is to improve lives and elevate businesses through disruptive, high-quality services. Whether you are a small startup looking to establish your footprint or a large enterprise aiming to optimize performance, we have built a world-class operations team ready to fuel your growth.
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-black tracking-wider uppercase text-[#1C4C96] dark:text-[#C2A74C]">
            {pillars.map((p, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50">{p.label}</span>
                {idx < pillars.length - 1 && <span className="text-slate-400 dark:text-slate-600">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-14">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#1C4C96] to-[#12366e] text-white shadow-lg flex flex-col justify-between border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 text-[#C2A74C] border border-white/10">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold mb-3 tracking-tight text-white">
                Our Mission
              </h3>
              <p className="text-blue-100 leading-relaxed text-sm sm:text-base lg:text-lg">
                To empower businesses by providing end-to-end, tailor-made solutions in consulting, training, and outsourcing, allowing our clients to focus on what they do best—growing their business.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 text-xs font-semibold text-[#C2A74C] uppercase tracking-wider">
              <span>Client-First Execution</span>
            </div>
          </div>

          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0e274d] to-[#08172e] dark:from-[#0d1f3d] dark:to-[#050b14] text-white shadow-lg flex flex-col justify-between border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#C2A74C]/10 rounded-full blur-2xl group-hover:bg-[#C2A74C]/20 transition-colors"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 text-[#C2A74C] border border-white/10">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold mb-3 tracking-tight text-white">
                Our Vision
              </h3>
              <p className="text-slate-200 leading-relaxed text-sm sm:text-base lg:text-lg">
                To be the premier all-in-one business partner across the region, recognized for setting new standards in operational excellence, driving workforce growth, and empowering businesses through seamless BPO and strategic consulting.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 text-xs font-semibold text-[#C2A74C] uppercase tracking-wider">
              <span>Regional Leadership & Impact</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-12 border border-slate-200 dark:border-slate-700/80 shadow-md text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            Proven Track Record
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Businesses That Trust EG-Experts
          </h2>
          <div className="w-16 h-1 bg-[#C2A74C] mx-auto rounded-full mb-10"></div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 items-center justify-center mb-10">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-16 sm:h-20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-1 font-black italic tracking-tighter text-xs sm:text-sm">
                <span className="text-slate-900 dark:text-white">BE</span>
                <span className="text-[#FF6600]">FORWARD</span>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-16 sm:h-20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#C41230] text-white flex items-center justify-center font-black text-[10px] rounded">F</div>
                <div className="text-left leading-none">
                  <span className="font-extrabold text-[10px] sm:text-xs text-slate-900 dark:text-white tracking-wider block">FLAIRSTECH</span>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-16 sm:h-20 hover:scale-105 transition-transform">
              <div className="font-black text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white flex items-center">
                <span className="text-[#1C4C96] text-sm sm:text-base">P</span>
                <span>SEO</span>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-16 sm:h-20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                <span className="text-[10px] font-black text-[#1C4C96]">=</span>
                <span className="tracking-wide">Madrid</span>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-16 sm:h-20 hover:scale-105 transition-transform">
              <div className="text-[10px] font-black uppercase text-slate-800 dark:text-white leading-tight">
                Mountains<br /><span className="text-slate-400 font-medium text-[8px]">Solutions</span>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center h-16 sm:h-20 hover:scale-105 transition-transform">
              <div className="bg-[#B93826] text-white px-2 py-1 rounded text-[10px] sm:text-xs font-black tracking-tight flex items-center gap-0.5">
                <span>The</span>
                <span className="underline decoration-[#C2A74C]">Outsource</span>
              </div>
            </div>
          </div>

          <div className="max-w-xl mx-auto pt-6 border-t border-slate-100 dark:border-slate-700/60">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              200+ companies use EG-Experts to grow their businesses.
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6">
              Join us and make your company a better place.
            </p>
            <a 
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-all shadow-md text-xs sm:text-sm group min-h-[44px]"
            >
              <span>Schedule a Call</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <ScheduleCallCTA 
        title="Partner With Experts Group"
        subtitle="Build long-term operational resilience and efficiency. Let's discuss your enterprise vision."
      />
    </div>
  );
};

const TrainingPage = () => {
  const trainingTiers = [
    {
      title: "Employee Training",
      target: "Ideal for new hires",
      desc: "Equip your incoming team members with essential skills and structured onboarding so they hit the ground running.",
      popular: true,
      features: [
        { label: "Expert Industry Trainers", addOn: false },
        { label: "Tailored Onboarding Curriculum", addOn: false },
        { label: "Practical Workshops", addOn: false },
        { label: "Hands-On Exercises", addOn: false },
        { label: "Custom Training Materials", addOn: true }
      ]
    },
    {
      title: "Department Training",
      target: "Ideal for existing teams",
      desc: "Specialized skill development across operational and administrative departments to boost overall efficiency and bridge skill gaps.",
      popular: false,
      features: [
        { label: "Department-Specific Upskilling", addOn: false },
        { label: "Process & Workflow Optimization", addOn: false },
        { label: "Interactive Group Exercises", addOn: false },
        { label: "Case Studies", addOn: false },
        { label: "Departmental Playbooks", addOn: true }
      ]
    },
    {
      title: "Management Training",
      target: "Ideal for team leaders & managers",
      desc: "Strengthen leadership capabilities and team management to build a high-performance organization.",
      popular: false,
      features: [
        { label: "Strategic Planning", addOn: false },
        { label: "Coaching & Communication", addOn: false },
        { label: "Conflict Resolution", addOn: false },
        { label: "Team Empowerment", addOn: false },
        { label: "Executive Toolkits", addOn: true },
        { label: "Leadership Frameworks", addOn: true }
      ]
    }
  ];

  const faqs = [
    { 
      q: "Is there a minimum number of participants required?", 
      a: "No, there is no minimum number of participants required. Whether you need 1-on-1 executive coaching or a department-wide workshop, we scale our training to fit your exact headcount." 
    },
    { 
      q: "How are the training sessions delivered?", 
      a: "We offer flexible delivery methods to suit your operational needs. Sessions can be conducted 100% online via virtual classrooms, on-site at your corporate headquarters, or through a hybrid approach combining both." 
    },
    { 
      q: "How long does a typical training program take?", 
      a: "The duration varies based on the curriculum depth and your team's availability. Programs can range from intensive 1-day workshops to comprehensive multi-week academies. We tailor the schedule to minimize disruption to your daily operations." 
    },
    { 
      q: "How long does the preparation phase take?", 
      a: "Typically, our preparation phase takes 1 to 2 weeks. During this time, we conduct a needs assessment, align with your stakeholders, and custom-tailor the curriculum and materials to match your specific corporate objectives." 
    },
    { 
      q: "How much does the training cost?", 
      a: "Pricing is customized based on the program's length, delivery method, and level of customization. After our initial strategy call and needs assessment, we provide a transparent, detailed proposal with no hidden fees." 
    },
    { 
      q: "How do I ensure my company's content and data remain secure?", 
      a: "We take data security very seriously. All training programs are conducted under strict enterprise-grade NDAs. Any proprietary company data used for custom case studies is heavily protected and never shared outside your organization." 
    },
    { 
      q: "How do we get started?", 
      a: "Simply click the 'Schedule a Call' button to schedule a brief strategy call. We'll discuss your current challenges, desired outcomes, and map out a tailored training plan for your team." 
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10 bg-slate-50/60 dark:bg-slate-950 min-h-screen transition-colors">
      <ServiceHero 
        breadcrumbs={['Home', 'Services', 'Expert Training']}
        title="Expert Training"
        subtitle="Elevate your workforce. Personalized, high-impact training programs designed to maximize human capital and drive departmental efficiency."
        badges={[
          { icon: GraduationCap, label: "Custom Curriculum", value: "100% Tailored" },
          { icon: Building, label: "Delivery Options", value: "On-Site & Virtual" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            Curriculum Options
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Expert Training for Your Business Growth
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Invest in your team to drive faster growth, ensure operational stability, and scale seamlessly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
          {trainingTiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular 
                  ? 'bg-white dark:bg-slate-800/90 border-2 border-[#1C4C96] dark:border-[#C2A74C] shadow-xl shadow-[#1C4C96]/10 dark:shadow-[#C2A74C]/5 lg:-translate-y-2' 
                  : 'bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1C4C96] text-white dark:bg-[#C2A74C] dark:text-slate-950 text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Requested
                </div>
              )}

              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#1C4C96] dark:text-[#C2A74C] uppercase tracking-wider block mb-1">
                    {tier.target}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {tier.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2.5 leading-relaxed min-h-[48px]">
                    {tier.desc}
                  </p>
                </div>

                <a 
                  href={CALENDAR_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 min-h-[44px] ${
                    tier.popular
                      ? 'bg-[#1C4C96] hover:bg-[#153a75] text-white shadow-md shadow-[#1C4C96]/20'
                      : 'bg-slate-100 hover:bg-[#1C4C96] hover:text-white dark:bg-slate-700 dark:hover:bg-[#C2A74C] dark:hover:text-slate-900 text-slate-800 dark:text-white'
                  }`}
                >
                  <span>Schedule a Call</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="border-t border-slate-100 dark:border-slate-700/70 pt-5 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">
                    What's Included
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#1C4C96] dark:text-[#C2A74C] shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {feat.label}
                          {feat.addOn && (
                            <span className="ml-1.5 inline-block text-[10px] font-semibold text-[#C2A74C] dark:text-[#eadd9d] px-1.5 py-0.5 rounded bg-[#C2A74C]/10 dark:bg-[#C2A74C]/20">
                              Add-On
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#1C4C96] dark:text-[#C2A74C]" /> Online & On-Site
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#1C4C96] dark:text-[#C2A74C]" /> No Headcount Min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <SplitFAQSection 
        faqs={faqs} 
        subtitle="Here are answers to the most common questions regarding our corporate training delivery, scheduling, and scope."
      />

      <ScheduleCallCTA 
        title="Ready to Upskill Your Corporate Workforce?"
        subtitle="Schedule a call with our curriculum architects to tailor an onboarding or departmental training program."
      />
    </div>
  );
};

const ConsultationPage = () => {
  const [currentOption, setCurrentOption] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  const consultationOptions = [
    {
      title: "Financial & Unit Economics Strategy",
      category: "Finance & Margin Expansion",
      desc: "Build 12-to-36 month cash flow models, optimize pricing structures, and improve unit margins to ensure long-term financial health."
    },
    {
      title: "Operational & Process Optimization",
      category: "Workflow & Scalability",
      desc: "Identify and eliminate departmental bottlenecks, eliminate duplicate workflows, and implement high-efficiency SOPs across your organization."
    },
    {
      title: "Market Expansion & GTM Strategy",
      category: "Growth & Market Penetration",
      desc: "Target high-intent customer segments, test agile go-to-market channels, and outmaneuver regional competition with backed data."
    },
    {
      title: "Organizational Structure & Team Scaling",
      category: "Executive Governance",
      desc: "Design scalable organizational charts, establish clear accountability matrices, and transition founders smoothly into executive leadership."
    },
    {
      title: "Digital Transformation & Tech Stack Audit",
      category: "Technology Architecture",
      desc: "Audit SaaS software expenses, eradicate software bloat, and build unified, automated tech ecosystems across sales and operations."
    },
    {
      title: "Sales Pipeline & Revenue Operations",
      category: "Revenue & Conversion",
      desc: "Re-engineer your sales stages, train high-converting account executives, and institute predictable monthly pipeline forecasting."
    },
    {
      title: "Supply Chain & Vendor Cost Optimization",
      category: "Procurement & Fulfillment",
      desc: "Audit vendor agreements, renegotiate tier pricing, and streamline end-to-end fulfillment pipelines to maximize bottom-line profit."
    }
  ];

  const nextOption = () => {
    setCurrentOption((prev) => (prev + 1) % consultationOptions.length);
  };

  const prevOption = () => {
    setCurrentOption((prev) => (prev - 1 + consultationOptions.length) % consultationOptions.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentOption((prev) => (prev + 1) % consultationOptions.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isPaused, currentOption, consultationOptions.length]);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextOption();
    } else if (distance < -minSwipeDistance) {
      prevOption();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const coreFeatures = [
    {
      title: "Guaranteed Fast Delivery",
      desc: "No matter the scope or complexity, receive your complete strategic diagnostic and final consultation package within 3 weeks maximum."
    },
    {
      title: "Market & Industry Research",
      desc: "Besides the provided data, EG-Experts leverages its own primary and secondary research sources to analyze market trends and benchmark your performance."
    },
    {
      title: "Operational & Process Diagnostic",
      desc: "A thorough assessment of your existing workflows, organizational structure, and bottlenecks to pinpoint exact areas for improvement. Grow what you have, not start over."
    },
    {
      title: "Custom Strategic Action Plan",
      desc: "A clear, step-by-step roadmap with actionable recommendations designed to address your specific business goals and growth targets."
    }
  ];

  const addOnFeatures = [
    {
      title: "Dedicated Advisory Support (Add-On)",
      desc: "Direct access to an expert throughout your engagement to guide and ensure results for 6 months, with adjustments to the plan as operational realities shift."
    },
    {
      title: "Custom Playbook Creation (Add-On)",
      desc: "Turn strategic recommendations into detailed Standard Operating Procedures (SOPs) and departmental playbooks for your team, designed for execution."
    }
  ];

  const faqs = [
    { q: "How long does a typical consultation engagement last?", a: "Our standard diagnostic and strategic action plan delivery is completed within 3 weeks maximum. With our Dedicated Advisory Support add-on, we continue actively guiding implementation for 6 months." },
    { q: "How does the diagnostic process begin?", a: "We begin with a 360-degree assessment of your existing operational workflows, organizational structure, and financial metrics. We focus on growing what you already have rather than asking you to start over." },
    { q: "Can you help our team execute the strategy?", a: "Yes. In addition to creating custom playbooks and SOPs, our senior advisors stay embedded with your executive team throughout the engagement to guide real-world implementation." },
    { q: "Do you specialize in specific business sectors?", a: "Our data-backed unit economics and operational frameworks are universally applicable across B2B services, technology, retail, logistics, and scaling enterprise operations." }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10 bg-slate-50/60 dark:bg-slate-950 min-h-screen transition-colors">
      <ServiceHero 
        breadcrumbs={['Home', 'Services', 'Expert Consultation']}
        title="Expert Consultation"
        subtitle="Move beyond theory. Rigorous strategic planning paired with hands-on execution support to eliminate bottlenecks and deliver measurable ROI."
        badges={[
          { icon: Target, label: "Delivery Guarantee", value: "3 Weeks Max" },
          { icon: Users, label: "Advisory Support", value: "6 Months" }
        ]}
      />

      <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            Practice Areas
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Explore Our Strategic Options
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base">
            Here are a few of our core consultation services. If you don't find what you are looking for, schedule a discovery session with our advisors.
          </p>
        </div>

        <div 
          className="max-w-4xl mx-auto relative bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-12 shadow-lg transition-all touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/70">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#1C4C96] dark:text-[#C2A74C]">
              {consultationOptions[currentOption].category}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold hidden sm:inline">
                {isPaused ? 'Paused' : 'Auto 10s'}
              </span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">
                0{currentOption + 1} / 0{consultationOptions.length}
              </span>
            </div>
          </div>

          <div className="min-h-[120px] sm:min-h-[140px] flex flex-col justify-center text-center px-2 sm:px-10">
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              {consultationOptions[currentOption].title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
              {consultationOptions[currentOption].desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-8 sm:mt-12 pt-6 border-t border-slate-100 dark:border-slate-700/70">
            <div className="flex items-center gap-2">
              <button 
                onClick={prevOption}
                aria-label="Previous consultation option"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextOption}
                aria-label="Next consultation option"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {consultationOptions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentOption(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentOption === i 
                      ? 'w-7 sm:w-8 bg-[#1C4C96] dark:bg-[#C2A74C]' 
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <a
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Schedule a Call</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Consultation Features Section */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Our Consultation Features
            </h2>
            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              Engineered to eliminate strategic bottlenecks, accelerate executive decision-making, and deliver measurable ROI from day one.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 space-y-6">
              <div className="text-xs font-bold text-[#C2A74C] uppercase tracking-wider mb-2">Core Deliverables</div>
              {coreFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#C2A74C] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white mb-1">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 space-y-6">
              <div className="text-xs font-bold text-[#C2A74C] uppercase tracking-wider mb-2">Extended Execution Add-Ons</div>
              {addOnFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <PlusCircle className="w-5 h-5 text-[#C2A74C] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white mb-1">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SplitFAQSection 
        faqs={faqs} 
        subtitle="Frequently asked questions about our strategic diagnostics, roadmap deliveries, and execution advisory."
      />

      <ScheduleCallCTA 
        title="Ready to Redefine Your Enterprise Strategy?"
        subtitle="Schedule a call with our advisory partners to uncover immediate revenue and margin expansion opportunities."
      />
    </div>
  );
};

const OperationsPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  const operationsList = [
    { 
      icon: Share2, 
      tag: "Marketing",
      title: "Social Media Management", 
      desc: "End-to-end brand management, community engagement, and viral content strategy.",
      detailedDesc: "Our dedicated social media squads manage every facet of your brand's digital presence. From creative content ideation and multi-channel scheduling to real-time audience engagement and analytics tracking, we build loyal, active online communities.",
      benefits: [
        "Consistent daily multi-channel publishing",
        "Community response times under 15 minutes",
        "Custom high-converting graphics and copywriting",
        "Monthly ROI and growth performance dashboards"
      ],
      advantage: "Dedicated social media manager + copywriter per account pod."
    },
    { 
      icon: Search, 
      tag: "Growth",
      title: "SEO Optimization", 
      desc: "Data-driven organic search ranking strategies and technical site auditing.",
      detailedDesc: "Dominate search engine results pages with comprehensive technical audits, competitor keyword clustering, on-page optimization, and high-authority link-building campaigns that drive sustained organic growth.",
      benefits: [
        "Technical health audits and Core Web Vitals remediation",
        "Targeted intent-based keyword research",
        "On-page schema and metadata optimization",
        "Transparent rank tracking and traffic attribution"
      ],
      advantage: "Zero black-hat techniques; 100% Google algorithm compliant."
    },
    { 
      icon: BarChart2, 
      tag: "Intelligence",
      title: "Data Analysis", 
      desc: "Transforming raw metrics into actionable business intelligence and dashboards.",
      detailedDesc: "Unlock the value hidden within your operational data. Our BI analysts clean raw transactional data, construct automated executive dashboards, and formulate predictive insights to optimize business choices.",
      benefits: [
        "Interactive PowerBI and Tableau dashboard design",
        "Automated cross-platform data pipeline synthesis",
        "Cohort analysis and churn risk identification",
        "Actionable weekly executive summaries"
      ],
      advantage: "Fast integration with major databases, CRMs, and ERP systems."
    },
    { 
      icon: Palette, 
      tag: "Creative",
      title: "Graphic Design", 
      desc: "Premium visual assets, branding guidelines, and UI/UX interface design.",
      detailedDesc: "Empower your brand with elite visual storytelling. We provide dedicated graphic designers who craft compelling marketing collateral, brand guidelines, UI layouts, presentations, and product packaging.",
      benefits: [
        "Pixel-perfect digital, vector, and print collateral",
        "Full brand identity kits and brand style guides",
        "Rapid 24-48 hour turnaround on design iterations",
        "All source vector files delivered directly to you"
      ],
      advantage: "Unlimited design revisions within your dedicated pod subscription."
    },
    { 
      icon: FileText, 
      tag: "Creative",
      title: "Content Writing", 
      desc: "SEO-optimized, conversion-focused copywriting for blogs, PR, and web.",
      detailedDesc: "Capture authority in your niche with meticulously researched, industry-specific written content. We produce long-form articles, whitepapers, press releases, landing page copy, and email sequences that educate and convert.",
      benefits: [
        "100% human-written, editorial-grade articles",
        "Native English and bilingual Arabic copywriters",
        "SEO-keyword integration with organic readability",
        "In-depth industry research and competitor gap analysis"
      ],
      advantage: "Specialized writers with domain expertise across B2B, tech, and retail."
    },
    { 
      icon: UserPlus, 
      tag: "HR",
      title: "Talent Acquisition", 
      desc: "Sourcing, vetting, and headhunting elite industry professionals globally.",
      detailedDesc: "Eliminate costly bad hires and reduce time-to-fill by up to 60%. Our talent scouts actively headhunt, rigorously pre-screen, and technically evaluate candidates to ensure cultural and competence alignment.",
      benefits: [
        "Comprehensive resume screening and initial technical vetting",
        "Structured interview scorecards and background checks",
        "Access to passive, top-tier global talent pools",
        "Guaranteed 30-day candidate replacement warranty"
      ],
      advantage: "End-to-end recruitment cycle management from job posting to offer letter."
    },
    { 
      icon: Video, 
      tag: "Media",
      title: "Video Editing", 
      desc: "High-retention corporate video, reels, and commercial production.",
      detailedDesc: "Turn raw footage into cinematic, high-retention video assets. We edit short-form TikTok/Reels/Shorts, corporate explainers, customer testimonials, and advertisements designed to stop the scroll.",
      benefits: [
        "Dynamic pacing, sound design, and color grading",
        "Engaging animated captions and kinetic typography",
        "Multi-aspect ratio formatting (9:16, 16:9, 1:1)",
        "Fast turnarounds with cloud-based review links"
      ],
      advantage: "High-volume video workflows supported without quality degradation."
    },
    { 
      icon: Box, 
      tag: "Media",
      title: "3D Animation", 
      desc: "Immersive product visualizations, architectural renders, and motion graphics.",
      detailedDesc: "Bring complex ideas and architectural concepts to life through photorealistic 3D rendering and dynamic animation. Perfect for physical products, hardware simulations, and high-impact digital campaigns.",
      benefits: [
        "Photorealistic 3D product modeling and lighting",
        "Exploded view mechanical simulations",
        "Commercial-ready motion design and rendering",
        "Flexible 4K video exports for web and displays"
      ],
      advantage: "Expertise in Blender, Cinema4D, Maya, and Unreal Engine."
    },
    { 
      icon: Calendar, 
      tag: "Corporate",
      title: "Event Planning", 
      desc: "End-to-end logistics and management for corporate summits and launches.",
      detailedDesc: "Host flawless corporate conferences, executive retreats, brand launches, and virtual summits. We orchestrate venue sourcing, vendor negotiation, technical AV production, attendee registration, and onsite coordination.",
      benefits: [
        "Complete budget control and vendor contract auditing",
        "Keynote speaker curation and hospitality management",
        "Live audio-visual, stage, and streaming production",
        "Real-time attendee check-in and VIP handling"
      ],
      advantage: "Seamless hybrid setups combining in-person venues with global live streams."
    },
    { 
      icon: Megaphone, 
      tag: "Marketing",
      title: "Paid Advertising", 
      desc: "High-ROI campaign management across Meta, Google, LinkedIn, and TikTok.",
      detailedDesc: "Maximize your advertising budget with precision-targeted media buying. Our performance marketers build granular campaign architectures, split-test creatives continually, and optimize for ROAS and CAC.",
      benefits: [
        "Advanced pixel tracking, CAPI, and conversion attribution",
        "Rapid creative A/B testing frameworks",
        "Strict budget monitoring with spend-efficiency guardrails",
        "Weekly performance reports and strategic syncs"
      ],
      advantage: "Certified media buyers managing budgets across B2B and consumer niches."
    },
    { 
      icon: Code, 
      tag: "Tech",
      title: "Web Development", 
      desc: "Secure, scalable, and responsive web applications and enterprise platforms.",
      detailedDesc: "Transform your web presence into an intuitive, high-performance customer conversion engine. Our engineers develop modern, lightning-fast web applications, marketing sites, and enterprise customer portals.",
      benefits: [
        "Custom responsive development (React, Next.js, WordPress)",
        "Mobile-first architecture with sub-second page loads",
        "Enterprise-grade security and SSL implementation",
        "Continuous maintenance and technical monitoring"
      ],
      advantage: "Clean, documented code with seamless third-party API integrations."
    },
    { 
      icon: Truck, 
      tag: "Logistics",
      title: "Shipping & Logistics", 
      desc: "Supply chain streamlining, vendor management, and fulfillment optimization.",
      detailedDesc: "Optimize your physical fulfillment pipelines to reduce delivery lead times and slash transit costs. We audit carrier agreements, streamline warehousing workflows, and manage last-mile dispatch.",
      benefits: [
        "Tiered shipping rate renegotiations with regional carriers",
        "Inventory tracking and warehouse pick/pack optimization",
        "Customs clearance and import/export documentation compliance",
        "Real-time shipment tracking with customer visibility"
      ],
      advantage: "Direct relationships with domestic and international freight forwarders."
    }
  ];

  const faqs = [
    { q: "What is your onboarding timeline for operational services?", a: "We operate with rapid agility. Depending on the complexity of the tasks and necessary system access, our standard onboarding process integrates our specialist teams into your workflow within 1 to 3 business days." },
    { q: "How do you ensure team synchronization and communication?", a: "Our dedicated Account Managers act as a bridge. We utilize your preferred communication channels (Slack, Microsoft Teams, Email) and project management tools (Jira, Asana, Monday, Trello) to ensure 100% synchronization and visibility." },
    { q: "Can I bundle these services, or are they standalone?", a: "Absolutely. Most of our enterprise clients create custom 'pods' (e.g., combining Web Development, Graphic Design, and SEO into a unified digital team) for a comprehensive, highly cost-effective operational solution." },
    { q: "Where are your operational teams located?", a: "We maintain a robust global talent pool, with significant, highly-trained hubs located in Egypt and the region, ensuring overlapping time zones, bilingual fluency (Arabic/English), and cost arbitrage." }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedService(null);
    };
    if (selectedService) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService]);

  return (
    <div className="animate-in fade-in duration-500 pb-10 bg-slate-50/60 dark:bg-slate-950 min-h-screen transition-colors">
      <ServiceHero 
        breadcrumbs={['Home', 'Services', 'Expert Operations']}
        title="Expert Operations"
        subtitle="Take the heavy lifting off your shoulders. Instantly scale your capabilities, bypass hiring delays, and reduce overhead with our 12-point service grid."
        badges={[
          { icon: Zap, label: "Onboarding Speed", value: "1-3 Days" },
          { icon: Layers, label: "Services Available", value: "12+ Domains" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            Operational Pods
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Comprehensive Operational Delegation
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base leading-relaxed">
            Click on any service card below to view detailed deliverables, business advantages, and operational specifications.
          </p>
        </div>

        {/* 12-card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mb-20">
          {operationsList.map((op, idx) => {
            const Icon = op.icon;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedService(op)}
                className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#1C4C96]/50 dark:hover:border-[#C2A74C]/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#1C4C96] dark:text-[#C2A74C] group-hover:bg-[#1C4C96] dark:group-hover:bg-[#C2A74C] group-hover:text-white dark:group-hover:text-slate-950 transition-all shadow-sm border border-slate-100 dark:border-slate-800">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                      {op.tag}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-[#1C4C96] dark:group-hover:text-[#C2A74C] transition-colors">
                    {op.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {op.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#1C4C96] dark:text-[#C2A74C]">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Delegate Section */}
        <div className="bg-[#1C4C96] dark:bg-[#0F172A] rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl border border-white/10">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-10 tracking-tight">Why Delegate to EG-Experts?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-left">
              {[
                { t: "Instant Expertise", d: "Bypass the 3-month hiring curve and instantly access top-tier vetted talent." },
                { t: "Cost Efficiency", d: "Reduce overhead drastically. No benefits, hardware, or office lease overhead." },
                { t: "Infinite Scalability", d: "Scale your pod up or down on demand based on seasonal requirements." },
                { t: "Seamless Integration", d: "We plug directly into your preferred tools (Slack, Teams, Jira, Asana)." }
              ].map((r, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15 hover:bg-white/20 transition-colors">
                  <div className="w-10 h-10 bg-[#C2A74C] text-slate-950 rounded-xl flex items-center justify-center shadow font-black text-lg mb-4">
                    0{i+1}
                  </div>
                  <h4 className="font-bold text-white text-base mb-2">{r.t}</h4>
                  <p className="text-xs sm:text-sm text-blue-100 dark:text-slate-300 leading-relaxed">{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Selected Service */}
      {selectedService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedService(null)}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 rounded-2xl flex items-center justify-center text-[#1C4C96] dark:text-[#C2A74C]">
                {React.createElement(selectedService.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#1C4C96] dark:text-[#C2A74C]">
                  {selectedService.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              {selectedService.detailedDesc}
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                Key Deliverables & Business Benefits
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {selectedService.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#1C4C96] dark:text-[#C2A74C] shrink-0 mt-0.5" />
                    <span className="leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1C4C96] dark:text-[#C2A74C] shrink-0" />
              <span><strong>Operational Advantage:</strong> {selectedService.advantage}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setSelectedService(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <a 
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>Schedule a Call for {selectedService.title}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      <SplitFAQSection 
        faqs={faqs} 
        subtitle="Frequently asked questions about our operational pods, onboarding times, and team communication."
      />

      <ScheduleCallCTA 
        title="Ready to Delegate Your Operational Bottlenecks?"
        subtitle="Schedule a call today to match your organization with a dedicated operational pod in 1-3 business days."
      />
    </div>
  );
};

const BpoPage = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState(4);

  const mainOptions = [
    { title: "Customer Support", metric: "Highest CSAT", sub: "Market leading multichannel QA", icon: ThumbsUp },
    { title: "Chat Support", metric: "98% CSAT", sub: "Instant live response coverage", icon: MessageSquare },
    { title: "Account Executive", metric: "55% Closing", sub: "Elite B2B closing rate", icon: Briefcase },
    { title: "Cold Calling", metric: "60% Conversion", sub: "From appointment set to meeting", icon: Headphones }
  ];

  const packages = [
    {
      name: "Professional",
      badge: "Core Operations",
      bestFor: "Companies with existing software needing skilled operational execution.",
      desc: "Expert execution inside your existing setup. We handle day-to-day Billing Management and HR operations using your team's current tools.",
      popular: false,
      footerNote: "Flexible monthly plans, zero contract lock-in.",
      features: [
        "Dedicated Billing & HR team support",
        "Seamless integration in your tech stack",
        "Standard SLAs & routine execution",
        "Direct email & chat operational support"
      ]
    },
    {
      name: "Premium",
      badge: "Most Popular",
      bestFor: "Growing teams wanting modern tools without software procurement headaches.",
      desc: "Complete operational support paired with modern software. We provide expert personnel and supply the enterprise technology stack for you.",
      popular: true,
      featureHeader: "Everything in Professional, plus:",
      footerNote: "Instant tech deployment, zero licensing hassle.",
      features: [
        "Enterprise software & tech stack included",
        "Automated workflows & custom reporting",
        "Priority onboarding & software setup"
      ]
    },
    {
      name: "Ultimate",
      badge: "Full Governance",
      bestFor: "Busy executives wanting a 100% hands-off, high-performance back office.",
      desc: "A completely outsourced back office with guaranteed oversight. End-to-end execution, full technology suite, and dedicated team leadership.",
      popular: false,
      featureHeader: "Everything in Premium, plus:",
      footerNote: "100% hands-off governance, performance guaranteed.",
      features: [
        "Dedicated Team Lead & QA management supervision",
        "Custom KPI tracking & guaranteed SLA metrics",
        "Quarterly strategy & process optimization reviews"
      ]
    }
  ];

  const faqs = [
    { q: "Will I be locked into a long-term contract?", a: "No. We believe in earning your business continually based on performance. We offer highly flexible monthly plans with ZERO contract lock-in, allowing you to scale your outsourced operations with complete freedom and minimal risk." },
    { q: "How do you ensure the quality of your services, like Customer Support and Cold Calling?", a: "We employ dedicated QA Managers for every pod who randomly audit calls, chats, and tickets daily. We measure against agreed-upon SLAs and CSAT targets, providing you with transparent weekly and monthly BI reporting." },
    { q: "Can you work with our existing software and tools?", a: "Yes, seamlessly. Our agents are trained to integrate directly into your existing CRM, VoIP, and helpdesk ecosystem (Salesforce, Zendesk, HubSpot, Intercom, RingCentral, etc.) usually within days of kickoff." },
    { q: "What if I want a completely hands-off approach to my back office?", a: "Our Ultimate package is specifically designed for this. We provide dedicated Team Leads and QA managers who take over day-to-day oversight, delivering weekly KPI reports without requiring your active intervention." },
    { q: "Do you offer custom BPO services if my specific operational needs aren't listed?", a: "Yes. While Customer Support, Chat Support, Account Execution, and Cold Calling are our most requested services, we routinely build custom back-office and technical support solutions tailored to your unique workflows." },
    { q: "How do you handle data security and client confidentiality?", a: "Security is paramount. We operate under strict enterprise-grade NDAs, utilize monitored workstation networks, enforce endpoint security, and adhere strictly to global data compliance standards." },
    { q: "What languages do your support and sales agents speak?", a: "Our teams are fully bilingual in English and Arabic, with additional language squads available upon request for multinational operations." }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10 bg-slate-50/60 dark:bg-slate-950 min-h-screen transition-colors">
      <ServiceHero 
        breadcrumbs={['Home', 'Services', 'Expert BPO']}
        title="Expert BPO Solutions"
        subtitle="Specialized, high-accuracy Business Process Outsourcing designed for modern enterprises to drive revenue, boost satisfaction, and slash overhead."
        badges={[
          { icon: Headset, label: "Chat Satisfaction", value: "98% CSAT" },
          { icon: Briefcase, label: "Contracts", value: "Zero Lock-in" }
        ]}
      />
      
      {/* High-Conversion Capabilities */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            High-Conversion Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Our Main B.P.O Options
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base">
            These are our most requested specialized outsourcing pods. Meet with our leadership team for custom operational configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {mainOptions.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm text-center hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between"
              >
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 text-[#1C4C96] dark:text-[#C2A74C] shadow-sm border border-slate-100 dark:border-slate-800">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-1">{opt.title}</h3>
                <div className="text-base sm:text-xl font-extrabold text-[#1C4C96] dark:text-[#C2A74C] mb-1">{opt.metric}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{opt.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
            Transparent Engagement
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Our Service Packages
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base">
            Discover what is the best package for your operational scope. Both online and on-site delivery models are available for all tiers.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {packages.map((pkg, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl shadow-md transition-all duration-300 overflow-hidden ${
                pkg.popular 
                  ? 'bg-white dark:bg-slate-800 border-2 border-[#1C4C96] dark:border-[#C2A74C]' 
                  : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
              }`}
            >
              <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                <div className="lg:col-span-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {pkg.name}
                    </h3>
                    <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full ${
                      pkg.popular 
                        ? 'bg-[#1C4C96] text-white dark:bg-[#C2A74C] dark:text-slate-900' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {pkg.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white">Best for:</span> {pkg.bestFor}
                  </p>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pkg.desc}
                  </p>

                  <div className="pt-2">
                    <a
                      href={CALENDAR_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm min-h-[44px] ${
                        pkg.popular
                          ? 'bg-[#1C4C96] hover:bg-[#153a75] text-white shadow-[#1C4C96]/20'
                          : 'bg-slate-100 hover:bg-[#1C4C96] hover:text-white dark:bg-slate-700 dark:hover:bg-[#C2A74C] dark:hover:text-slate-900 text-slate-800 dark:text-white'
                      }`}
                    >
                      <span>Schedule a Call</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-700/80 lg:pl-8">
                  {pkg.featureHeader && (
                    <div className="font-bold text-xs uppercase tracking-wider text-[#1C4C96] dark:text-[#C2A74C] mb-2 sm:mb-3">
                      {pkg.featureHeader}
                    </div>
                  )}
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1C4C96] dark:text-[#C2A74C] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 py-3 px-6 text-center text-xs text-slate-600 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-700/60 tracking-wide">
                {pkg.footerNote}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Split FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4C96]/10 dark:bg-[#C2A74C]/15 text-[#1C4C96] dark:text-[#C2A74C] font-semibold text-xs tracking-wider uppercase mb-3">
              Operational Answers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Here are answers to key questions about contract flexibility, data security, and BPO agent deployment.
            </p>
            <a 
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-all duration-300 shadow-md shadow-[#1C4C96]/20 text-xs sm:text-sm group min-h-[44px]"
            >
              <span>Schedule a Call</span>
              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
          
          <div className="lg:col-span-8 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white dark:bg-slate-800/90 rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
                    isOpen 
                      ? 'border-[#1C4C96]/50 dark:border-[#C2A74C]/50 ring-1 ring-[#1C4C96]/20 dark:ring-[#C2A74C]/20' 
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between focus:outline-none min-h-[52px]"
                  >
                    <span className={`font-bold text-sm sm:text-base pr-3 transition-colors ${
                      isOpen ? 'text-[#1C4C96] dark:text-[#C2A74C]' : 'text-slate-900 dark:text-white'
                    }`}>
                      {faq.q}
                    </span>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen 
                        ? 'bg-[#1C4C96] text-white dark:bg-[#C2A74C] dark:text-slate-950' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm border-t border-slate-100 dark:border-slate-700/60">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ScheduleCallCTA 
        title="Ready to Supercharge Your BPO & Support Operations?"
        subtitle="Schedule a call today to customize your outsourced squads with zero contract lock-in."
      />
    </div>
  );
};

const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-16 bg-white dark:bg-slate-900 min-h-screen">
      <div className="pt-16 pb-12 sm:pt-24 sm:pb-16 bg-slate-50 dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">Contact Us</h1>
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Ready to scale your enterprise? Get in touch with our operations team today.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 grid lg:grid-cols-12 gap-10 sm:gap-14">
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">Send us a message</h3>
          
          {formSubmitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Thank you for reaching out! Our team will respond within 24 hours.
            </div>
          )}

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                <input required type="text" className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4C96] dark:focus:ring-[#C2A74C]" placeholder="John" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                <input required type="text" className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4C96] dark:focus:ring-[#C2A74C]" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
              <input required type="email" className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4C96] dark:focus:ring-[#C2A74C]" placeholder="john@company.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service of Interest</label>
              <select className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4C96] dark:focus:ring-[#C2A74C]">
                <option>Expert Training</option>
                <option>Expert Consultation</option>
                <option>Expert Operations</option>
                <option>Expert BPO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea required rows="4" className="w-full px-4 py-3 text-base rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4C96] dark:focus:ring-[#C2A74C]" placeholder="How can we help your business scale?"></textarea>
            </div>
            <button type="submit" className="w-full py-4 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-colors shadow-md text-sm sm:text-base min-h-[48px]">
              Submit Inquiry
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Direct Contact</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Prefer to reach out directly? Our executive team is available Mon-Fri.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                <Mail className="w-5 h-5 text-[#1C4C96] dark:text-[#C2A74C]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Email Us</h4>
                <a href="mailto:info@eg-experts.com" className="text-[#1C4C96] dark:text-[#C2A74C] hover:underline font-medium text-sm mt-0.5 block">info@eg-experts.com</a>
                <p className="text-xs text-slate-500 mt-0.5">For corporate inquiries and RFPs.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                <Phone className="w-5 h-5 text-[#1C4C96] dark:text-[#C2A74C]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Call Us</h4>
                <a href="tel:+201044111646" className="text-[#1C4C96] dark:text-[#C2A74C] hover:underline font-medium text-sm mt-0.5 block">+20 104 411 1646</a>
                <p className="text-xs text-slate-500 mt-0.5">Available Mon-Fri, 9am - 6pm (EET).</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                <MapPin className="w-5 h-5 text-[#1C4C96] dark:text-[#C2A74C]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Headquarters</h4>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm mt-0.5 block">Cairo, Egypt</span>
                <p className="text-xs text-slate-500 mt-0.5">Serving enterprises globally.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">Instant Calendar Booking</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Skip email back-and-forth and lock in a 1-on-1 slot with our advisory directors.</p>
            <a
              href={CALENDAR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1C4C96] dark:text-[#C2A74C] hover:underline"
            >
              <span>Open Calendar Scheduler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <ScheduleCallCTA 
        title="Skip the Form & Connect Instantly"
        subtitle="Prefer real-time scheduling? Pick an exact slot that fits your schedule on our executive calendar."
      />
    </div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const navigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const serviceLinks = [
    { id: 'training', label: 'Expert Training' },
    { id: 'consultation', label: 'Expert Consultation' },
    { id: 'operations', label: 'Expert Operations' },
    { id: 'bpo', label: 'Expert BPO' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'about': return <AboutPage />;
      case 'training': return <TrainingPage />;
      case 'consultation': return <ConsultationPage />;
      case 'operations': return <OperationsPage />;
      case 'bpo': return <BpoPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans flex flex-col selection:bg-[#1C4C96] selection:text-white dark:selection:bg-[#C2A74C] dark:selection:text-slate-950 overflow-x-hidden`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 dark:bg-[#0B132B]/95 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('home')}>
              <BrandLogo />
            </div>

            <nav className="hidden xl:flex items-center gap-8 font-semibold">
              <button 
                onClick={() => navigate('home')} 
                className={`transition-colors focus:outline-none px-2 py-1 rounded-md text-sm ${currentPage === 'home' ? 'text-[#1C4C96] dark:text-[#C2A74C] font-bold' : 'text-slate-600 hover:text-[#1C4C96] dark:text-slate-300 dark:hover:text-[#C2A74C]'}`}
              >
                Home
              </button>
              <button 
                onClick={() => navigate('about')} 
                className={`transition-colors focus:outline-none px-2 py-1 rounded-md text-sm ${currentPage === 'about' ? 'text-[#1C4C96] dark:text-[#C2A74C] font-bold' : 'text-slate-600 hover:text-[#1C4C96] dark:text-slate-300 dark:hover:text-[#C2A74C]'}`}
              >
                About Us
              </button>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className={`flex items-center gap-1.5 transition-colors focus:outline-none px-2 py-1 rounded-md text-sm ${serviceLinks.some(s => s.id === currentPage) ? 'text-[#1C4C96] dark:text-[#C2A74C] font-bold' : 'text-slate-600 hover:text-[#1C4C96] dark:text-slate-300 dark:hover:text-[#C2A74C]'}`}
                >
                  Services 
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesDropdownOpen && (
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-3 overflow-hidden z-50">
                    {serviceLinks.map(service => (
                      <button
                        key={service.id}
                        onClick={() => navigate(service.id)}
                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-all duration-200 border-l-4 
                          ${currentPage === service.id 
                            ? 'border-[#C2A74C] bg-slate-50 dark:bg-slate-800 text-[#1C4C96] dark:text-[#C2A74C]' 
                            : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-[#1C4C96] hover:text-white hover:border-[#C2A74C] dark:hover:bg-[#C2A74C] dark:hover:text-slate-950 dark:hover:border-transparent'
                          }`}
                      >
                        {service.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => navigate('contact')} 
                className={`transition-colors focus:outline-none px-2 py-1 rounded-md text-sm ${currentPage === 'contact' ? 'text-[#1C4C96] dark:text-[#C2A74C] font-bold' : 'text-slate-600 hover:text-[#1C4C96] dark:text-slate-300 dark:hover:text-[#C2A74C]'}`}
              >
                Contact
              </button>

              <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

              <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-[#C2A74C]" /> : <Moon className="w-5 h-5 text-[#1C4C96]" />}
              </button>

              <a 
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer" 
                className="px-6 py-2.5 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-all shadow-md text-sm flex items-center gap-2 group min-h-[44px]"
              >
                <span>Schedule a Call</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </nav>

            <div className="flex xl:hidden items-center gap-2 sm:gap-3">
              <button 
                onClick={toggleTheme} 
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-[#C2A74C]" /> : <Moon className="w-5 h-5 text-[#1C4C96]" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-slate-700 dark:text-slate-200 focus:outline-none bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 absolute w-full transition-all duration-300 shadow-2xl z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-5 py-6 flex flex-col gap-2">
              <button 
                onClick={() => navigate('home')} 
                className={`text-left px-5 py-3.5 rounded-xl text-base font-bold min-h-[48px] ${currentPage === 'home' ? 'bg-[#1C4C96]/10 text-[#1C4C96] dark:bg-slate-800 dark:text-[#C2A74C]' : 'text-slate-800 dark:text-slate-200'}`}
              >
                Home
              </button>
              <button 
                onClick={() => navigate('about')} 
                className={`text-left px-5 py-3.5 rounded-xl text-base font-bold min-h-[48px] ${currentPage === 'about' ? 'bg-[#1C4C96]/10 text-[#1C4C96] dark:bg-slate-800 dark:text-[#C2A74C]' : 'text-slate-800 dark:text-slate-200'}`}
              >
                About Us
              </button>
              
              <div className="px-5 pt-3 pb-1 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Our Services
              </div>
              <div className="grid grid-cols-1 gap-1.5 pl-2">
                {serviceLinks.map(service => (
                  <button
                    key={service.id}
                    onClick={() => navigate(service.id)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold border-l-4 min-h-[44px] ${currentPage === service.id ? 'border-[#1C4C96] bg-[#1C4C96]/10 text-[#1C4C96] dark:border-[#C2A74C] dark:bg-slate-800 dark:text-[#C2A74C]' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                  >
                    {service.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => navigate('contact')} 
                className={`text-left px-5 py-3.5 mt-2 rounded-xl text-base font-bold min-h-[48px] ${currentPage === 'contact' ? 'bg-[#1C4C96]/10 text-[#1C4C96] dark:bg-slate-800 dark:text-[#C2A74C]' : 'text-slate-800 dark:text-slate-200'}`}
              >
                Contact
              </button>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                 <a 
                  href={CALENDAR_LINK}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full px-6 py-4 rounded-xl bg-[#1C4C96] hover:bg-[#153a75] text-white font-bold transition-colors shadow-md text-center flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Schedule a Call</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="tel:+201044111646"
                  className="w-full px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-center flex items-center justify-center gap-2 text-sm min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-[#C2A74C]" />
                  <span>+20 104 411 1646</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-[#080E1F] text-white pt-14 pb-10 border-t-[5px] border-[#C2A74C] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
                Your premier B2B partner for sustainable business growth, professional employee training, and high-accuracy operational outsourcing.
              </p>
              <div className="flex gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-[#1C4C96] hover:text-white transition-colors cursor-pointer"><Share2 className="w-4 h-4" /></div>
                <div className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-[#C2A74C] hover:text-slate-900 transition-colors cursor-pointer"><Globe className="w-4 h-4" /></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-4 uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2.5">
                {navLinks.concat(serviceLinks).map(link => (
                  <li key={link.id}>
                    <button onClick={() => navigate(link.id)} className="text-slate-400 hover:text-[#C2A74C] transition-colors text-xs sm:text-sm">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-slate-400 text-xs sm:text-sm">
                  <Mail className="w-4 h-4 text-[#C2A74C] shrink-0" />
                  <a href="mailto:info@eg-experts.com" className="hover:text-white transition-colors truncate">info@eg-experts.com</a>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400 text-xs sm:text-sm">
                  <Phone className="w-4 h-4 text-[#C2A74C] shrink-0" />
                  <a href="tel:+201044111646" className="hover:text-white transition-colors">+20 104 411 1646</a>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-[#C2A74C] shrink-0" />
                  <span>Cairo, Egypt</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Experts Group Plus. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="hover:text-[#C2A74C] cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#C2A74C] cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
