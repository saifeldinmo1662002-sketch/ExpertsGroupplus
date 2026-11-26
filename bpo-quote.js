'use strict';
const GROUPS = {
  "management": {
    "label": "Management & supervision",
    "multiple": false,
    "options": {
      "client": "Managed by your company",
      "egp": "Managed by Experts Group Plus"
    }
  },
  "services": {
    "label": "BPO services",
    "multiple": true,
    "options": {
      "customer": "Customer support",
      "sales": "Sales & lead generation",
      "backoffice": "Back-office support",
      "other": "Other / tailored service"
    }
  },
  "tools": {
    "label": "Technology & systems",
    "multiple": true,
    "options": {
      "existing": "Your existing systems",
      "crm": "CRM platform",
      "dialer": "Dialer & calling",
      "calendar": "Calendar & scheduling",
      "internal": "Internal systems & workflows"
    }
  },
  "reporting": {
    "label": "Reporting & analytics",
    "multiple": false,
    "options": {
      "standard": "Standard reporting",
      "advanced": "Advanced reporting & analytics",
      "client": "Client-managed reporting"
    }
  },
  "mode": {
    "label": "Work arrangement",
    "multiple": false,
    "options": {
      "onsite": "On-site",
      "remote": "Remote / offshore"
    }
  }
};
function validateQuote(body){
 const fail=()=>{throw new Error('Invalid quotation details.');};
 const text=(v,max,min=0)=>{if(typeof v!=='string'||v.trim().length<min||v.length>max)fail();return v.trim();};
 if(!body||typeof body!=='object'||Array.isArray(body))fail();
 const name=text(body.name,160,2),company=text(body.company,180,2),email=text(body.email,254,3);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail();
 const phone=text(body.phone??'',40),notes=text(body.notes??'',3000),headcount=text(body.headcount??'',6);
 if(headcount&&(!/^\d+$/.test(headcount)||Number(headcount)<1||Number(headcount)>100000))fail();
 const selections=body.selections;if(!selections||typeof selections!=='object'||Array.isArray(selections))fail();
 if(Object.keys(selections).length!==Object.keys(GROUPS).length)fail();
 const summary=[];for(const [key,group] of Object.entries(GROUPS)){const values=selections[key];if(!Array.isArray(values)||!values.length||(!group.multiple&&values.length!==1)||values.length>Object.keys(group.options).length||new Set(values).size!==values.length||values.some(v=>typeof v!=='string'||!Object.hasOwn(group.options,v)))fail();summary.push(group.label+': '+values.map(v=>group.options[v]).join(', '));}
 return {name,company,email,phone,language:body.language==='ar'?'ar':'en',message:[...summary,'Estimated team size: '+(headcount||'Not specified'),'Phone: '+(phone||'Not specified'),'Additional requirements: '+(notes||'None provided')].join('\n')};
}
module.exports={GROUPS,validateQuote};
