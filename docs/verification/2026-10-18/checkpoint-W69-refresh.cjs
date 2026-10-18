const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),catalog=require('../../../scripts/validation-reports.json');
const pages=fs.readdirSync(path.join(root,'docs')).filter(p=>p.endsWith('.html')).sort();
const inventory=[...pages,...Object.entries(catalog.dates).flatMap(([date,docs])=>docs.map(d=>'verification/'+date+'/'+d.target))];
fs.writeFileSync(path.join(__dirname,'checkpoint-W69-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
const files=['README.md','docs/learning-roadmap.md','docs/physics-validation-plan.md','scripts/validation-reports.json',...inventory.map(p=>'docs/'+p)];
fs.writeFileSync(path.join(__dirname,'checkpoint-W69-versions.json'),JSON.stringify({date:'2026-10-18',scope:'navigation and displayed pages after W69',files:files.map(p=>({path:p,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex').toUpperCase()}))},null,2)+'\n');
console.log(JSON.stringify({learningPages:pages.length,reports:inventory.length-pages.length,browserStates:inventory.length*2}));
