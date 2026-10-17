const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),changes=[];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex').toUpperCase();
const groups=[['2026-10-15',['B04','G01-final','G02','Q01','B00','C04','C05','G03','Q02','Q03','C06','C07','Q04','F01','F02','F03','F04','D01','D02','F03-water']],['2026-10-16',['D03','S01','S01-swi','C08','C08-contrast','Q05','Q06']],['2026-10-17',['Q07','A01','A02','A03','A04','A05','A06','M01','M01-limits','M02','M03','M04','M04-echo','M04-fit','X05','N01','N02','N03','N03-field','M02-ecv','G02-rf','E01','E01-encoding','E02','S02','AI01','AI03','AI03-t2','AI02','AI03-noise']]];
const updates=[];
for(const [date,ids]of groups)for(const id of ids){
  const file=path.join(root,'docs/verification',date,id+'-versions.json'),data=read(file);
  for(const entry of data.files){
    const sha256=hash(entry.path);if(sha256===entry.sha256)continue;
    if(entry.path!=='docs/frequency_phase_encoding_visualization.html')throw Error('Unreviewed drift: '+entry.path);
    changes.push({manifest:path.relative(root,file),path:entry.path,before:entry.sha256,after:sha256,reason:'W60 constant velocity phase follow-up navigation link only'});entry.sha256=sha256;
  }
  updates.push({file,data});
}
const reviewed=['docs/flow_gradient_phase.html','docs/assets/flow-gradient-phase-model.js','docs/assets/mr-physics-models.js','docs/assets/ir-lesson.css','tests/flow-gradient-phase.test.cjs','tests/helpers/flow-gradient-phase-reference.cjs',...['numerical.cjs','numerical.json','display-reference.json','browser-check.js','browser-check.json'].map(p=>'docs/verification/2026-10-17/X01-'+p)];
const versionFile=path.join(__dirname,'X01-versions.json');
if(fs.existsSync(versionFile)){
  const prior=read(versionFile);
  for(const entry of prior.files||[])if(hash(entry.path)!==entry.sha256)throw Error('Reviewed W60 input changed: '+entry.path);
}
for(const {file,data}of updates)fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(versionFile,JSON.stringify({date:'2026-10-17',baseCommit:'ba0a3323254353349430c06c7e670c336259990e',uncommitted:true,scope:'W60 known constant velocity trajectory and bipolar gradient phase; own report excluded',files:reviewed.map(p=>({path:p,sha256:hash(p)}))},null,2)+'\n');
const pages=fs.readdirSync(path.join(root,'docs')).filter(p=>p.endsWith('.html')).sort();
const catalog=read(path.join(root,'scripts/validation-reports.json'));
const inventory=[...pages,...Object.entries(catalog.dates).flatMap(([date,docs])=>docs.map(d=>'verification/'+date+'/'+d.target))];
const checkpointFile=path.join(__dirname,'checkpoint-W60-versions.json');
const previous=fs.existsSync(checkpointFile)?read(checkpointFile).changes||[]:[];
const nav=['README.md','docs/learning-roadmap.md','docs/physics-validation-plan.md','scripts/validation-reports.json',...inventory.map(p=>'docs/'+p)];
fs.writeFileSync(path.join(__dirname,'checkpoint-W60-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
fs.writeFileSync(checkpointFile,JSON.stringify({date:'2026-10-17',changes:[...new Map([...previous,...changes].map(c=>[c.manifest+'|'+c.path+'|'+c.after,c])).values()],navigationFiles:nav.map(p=>({path:p,sha256:hash(p)}))},null,2)+'\n');
console.log(JSON.stringify({learningPages:pages.length,reports:inventory.length-pages.length,browserStates:inventory.length*2,changes}));
