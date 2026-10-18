const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),sha=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const files=new Map(),manifests=[...JSON.parse(fs.readFileSync(path.join(__dirname,'checkpoint-W67-scope-manifests.json'),'utf8')),'docs/verification/2026-10-18/X01-mixture-versions.json'];
for(const manifest of manifests){
  const data=JSON.parse(fs.readFileSync(path.join(root,manifest),'utf8').replace(/^\uFEFF/,''));
  if(!Array.isArray(data.files))continue;
  for(const entry of data.files){const actual=sha(fs.readFileSync(path.join(root,entry.path)));if(actual!==entry.sha256)throw Error('Before drift: '+manifest+' '+entry.path);files.set(entry.path,actual);}
}
fs.writeFileSync(path.join(__dirname,'checkpoint-W69-inputs.json'),JSON.stringify({manifests,files:[...files].map(([path,sha256])=>({path,sha256}))},null,2)+'\n');
console.log(JSON.stringify({manifests:manifests.length,uniqueInputs:files.size}));
