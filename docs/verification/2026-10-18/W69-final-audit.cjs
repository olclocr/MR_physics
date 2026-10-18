const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..'),read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')),sha=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const frozen=read(path.join(__dirname,'checkpoint-W69-inputs.json'));
const allowed=new Set(['docs/contrast_concentration_competition.html','docs/flow_gradient_phase.html','docs/inflow_rf_saturation.html']);
const addition=';scroll-margin-top:55px;scroll-margin-bottom:10px',changes=[];let unchanged=0;
for(const entry of frozen.files){
 const bytes=fs.readFileSync(path.join(root,entry.path)),actual=sha(bytes);
 if(actual===entry.sha256){unchanged++;continue;}
 assert(allowed.has(entry.path),'Unexpected change: '+entry.path);
 const text=bytes.toString('utf8');assert.equal(text.split(addition).length,2);
 assert.equal(sha(Buffer.from(text.replace(addition,''),'utf8')),entry.sha256,'CSS-only reconstruction: '+entry.path);
 changes.push({path:entry.path,before:entry.sha256,after:actual,reason:'W69 selected row scroll margins only; inline script and all other bytes unchanged'});
}
assert.equal(changes.length,3);
const before=read(path.join(__dirname,'W69-browser-before.json')),after=read(path.join(__dirname,'W69-browser-after.json'));
assert.equal(before.states,36);assert.equal(after.states,36);assert.equal(after.hidden,0);assert.equal(after.errors.length,0);
for(let i=0;i<before.results.length;i++){
 const a=before.results[i],b=after.results[i];for(const key of ['page','width','value','edge','displaySha256','rowCount'])assert.equal(a[key],b[key],key+' '+i);
}
// Only update manifests after all source/display invariance checks pass.
for(const manifest of frozen.manifests){
 const file=path.join(root,manifest),data=read(file);let updated=false;
 for(const entry of data.files){const change=changes.find(c=>c.path===entry.path);if(!change)continue;assert([change.before,change.after].includes(entry.sha256));entry.sha256=change.after;updated=true;}
 if(updated)fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
const result={scope:'W69 presentation-only correction; no new physics pass',manifests:frozen.manifests.length,uniqueInputs:frozen.files.length,unchanged,changes,displayStates:after.states,displayHashesIdentical:true,hiddenBefore:before.hidden,hiddenAfter:after.hidden};
fs.writeFileSync(path.join(__dirname,'W69-audit.json'),JSON.stringify(result,null,2)+'\n');
const own=['docs/contrast_concentration_competition.html','docs/flow_gradient_phase.html','docs/inflow_rf_saturation.html',...['W69-freeze.cjs','W69-final-audit.cjs','checkpoint-W69-inputs.json','W69-browser-before.js','W69-browser-before.json','W69-browser-after.js','W69-browser-after.json','W69-audit.json'].map(p=>'docs/verification/2026-10-18/'+p)];
fs.writeFileSync(path.join(__dirname,'W69-versions.json'),JSON.stringify({date:'2026-10-18',baseCommit:'a734a1b6b1e091ca09d0a7fea09b1666d2e072f4',scope:result.scope,files:own.map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p)))}))},null,2)+'\n');
console.log(JSON.stringify(result));
