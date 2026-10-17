// Refresh only the navigation changes reviewed for W54; fail on unrelated drift.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),changes=[];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex').toUpperCase();
const files15=['G01-final','G02','Q01','B00','C04','C05','G03','Q02','Q03','C06','C07','Q04','F01','F02','F03','F04','D01','D02','F03-water'];
const groups=[['2026-10-15',files15],['2026-10-16',['D03','S01','S01-swi','C08','C08-contrast','Q05','Q06']],['2026-10-17',['Q07','A01','A02','A03','A04','A05','A06','M01','M01-limits','M02','M03','M04','M04-echo','N01','N02','N03','E01','E01-encoding','E02','S02','AI01','AI03','AI03-t2','AI02','AI03-noise']]];
const updates=[];
for(const [date,ids]of groups)for(const id of ids){
  const file=path.join(root,'docs/verification',date,id+'-versions.json'),data=read(file);
  for(const entry of data.files){
    const sha256=hash(entry.path);
    if(entry.sha256===sha256)continue;
    if(entry.path!=='docs/mrs_observation_volume.html')throw Error('Unreviewed version drift: '+entry.path);
    changes.push({manifest:path.relative(root,file),path:entry.path,before:entry.sha256,after:sha256,reason:'W54 follow-up navigation link only'});
    entry.sha256=sha256;
  }
  updates.push({file,data});
}
// Freeze reviewed inputs, excluding this report's own Markdown/HTML.
const prior=read(path.join(__dirname,'N03-field-work-in-progress-versions.json'));
const reviewed=prior.files.filter(e=>!e.path.endsWith('N03-field-physics.md'));
for(const entry of reviewed)if(hash(entry.path)!==entry.sha256)throw Error('W54 reviewed input changed: '+entry.path);
const files=[...reviewed,{path:'docs/assets/ir-lesson.css',sha256:hash('docs/assets/ir-lesson.css')}];
for(const {file,data}of updates)fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'N03-field-versions.json'),JSON.stringify({baseCommit:prior.baseCommit,uncommitted:true,date:'2026-10-17',scope:'W54 uniform spatial frequency distribution; report excluded from its own manifest',files},null,2)+'\n');
const pages=fs.readdirSync(path.join(root,'docs')).filter(p=>p.endsWith('.html')).sort();
const catalog=read(path.join(root,'scripts/validation-reports.json'));
const inventory=[...pages,...Object.entries(catalog.dates).flatMap(([date,docs])=>docs.map(d=>'verification/'+date+'/'+d.target))];
const nav=['README.md','docs/index.html','docs/mrs_observation_volume.html','docs/learning-roadmap.md','docs/physics-validation-plan.md','scripts/validation-reports.json',...pages.map(p=>'docs/'+p),...inventory.filter(p=>p.startsWith('verification/')).map(p=>'docs/'+p)];
fs.writeFileSync(path.join(__dirname,'checkpoint-W54-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
const checkpointFile=path.join(__dirname,'checkpoint-W54-versions.json');
const previousChanges=fs.existsSync(checkpointFile)?read(checkpointFile).changes||[]:[];
const recordedChanges=[...new Map([...previousChanges,...changes].map(c=>[c.manifest+'|'+c.path+'|'+c.after,c])).values()];
fs.writeFileSync(checkpointFile,JSON.stringify({date:'2026-10-17',changes:recordedChanges,navigationFiles:[...new Set(nav)].map(p=>({path:p,sha256:hash(p)}))},null,2)+'\n');
console.log(JSON.stringify({learningPages:pages.length,reports:inventory.length-pages.length,browserStates:inventory.length*2,changes}));
