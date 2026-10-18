const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex').toUpperCase();
const manifests=[...read(path.join(__dirname,'checkpoint-W67-scope-manifests.json')),...['X01-mixture','W69'].map(id=>'docs/verification/2026-10-18/'+id+'-versions.json')];
const changes=[],updates=[];
for(const manifest of manifests){const file=path.join(root,manifest),data=read(file);for(const entry of data.files){const after=hash(entry.path);if(after===entry.sha256)continue;if(entry.path!=='docs/hemorrhage_state_reading.html')throw Error('Unexpected drift: '+entry.path);changes.push({manifest,path:entry.path,before:entry.sha256,after,reason:'W65 follow-up navigation only; prior material reading and inline script unchanged'});entry.sha256=after;}updates.push({file,data});}
const own=['docs/blood_refocusing_limits.html','docs/assets/blood-refocusing-reading.js','docs/assets/ir-lesson.css',...['source-review.md','display-reference.json','browser-check.js','browser-check.json'].map(p=>'docs/verification/2026-10-18/X13-refocusing-'+p)];
const vf=path.join(__dirname,'X13-refocusing-versions.json');if(fs.existsSync(vf))for(const entry of read(vf).files||[])if(hash(entry.path)!==entry.sha256)throw Error('Reviewed input changed: '+entry.path);
for(const {file,data}of updates)fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(vf,JSON.stringify({date:'2026-10-18',baseCommit:'a734a1b6b1e091ca09d0a7fea09b1666d2e072f4',scope:'W65 qualitative evidence R01-R08; no new quantitative physical model; own report excluded',files:own.map(p=>({path:p,sha256:hash(p)}))},null,2)+'\n');
const pages=fs.readdirSync(path.join(root,'docs')).filter(p=>p.endsWith('.html')).sort(),catalog=read(path.join(root,'scripts/validation-reports.json'));
const inventory=[...pages,...Object.entries(catalog.dates).flatMap(([date,docs])=>docs.map(d=>'verification/'+date+'/'+d.target))];
fs.writeFileSync(path.join(__dirname,'checkpoint-W65-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
const cf=path.join(__dirname,'checkpoint-W65-versions.json'),prior=fs.existsSync(cf)?read(cf).changes||[]:[];
const nav=['README.md','docs/learning-roadmap.md','docs/physics-validation-plan.md','scripts/validation-reports.json',...inventory.map(p=>'docs/'+p)];
fs.writeFileSync(cf,JSON.stringify({date:'2026-10-18',checkedManifests:manifests.length,changes:[...new Map([...prior,...changes].map(c=>[c.manifest+'|'+c.path+'|'+c.after,c])).values()],navigationFiles:nav.map(p=>({path:p,sha256:hash(p)}))},null,2)+'\n');
console.log(JSON.stringify({learningPages:pages.length,reports:inventory.length-pages.length,browserStates:inventory.length*2,changes}));
