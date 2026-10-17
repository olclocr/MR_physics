const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const {buildReports}=require('../../../scripts/render-validation-reports.cjs');
const catalog=require('../../../scripts/validation-reports.json');
const changed=[],files=['scripts/render-validation-reports.cjs','scripts/validation-reports.json','tests/validation-reports.test.cjs'];
for(const date of Object.keys(catalog.dates)){
  const actual=buildReports({date}),previous=buildReports({date,reports:{...catalog,repositorySourceBase:undefined}});
  for(let j=0;j<actual.length;j++){
    const a=actual[j],b=previous[j],strip=h=>h.replace(/href="[^"]*"/g,'href="checked"');
    if(strip(a.html)!==strip(b.html))throw Error('Change beyond anchor targets: '+a.target);
    const links=h=>[...h.matchAll(/href="([^"]*)"/g)].map(m=>m[1]);
    const actualLinks=links(a.html),beforeLinks=links(b.html);
    for(let k=0;k<actualLinks.length;k++)if(actualLinks[k]!==beforeLinks[k]){
      const url=actualLinks[k];if(!url.startsWith(catalog.repositorySourceBase))throw Error('Unexpected anchor change');
      const old=path.resolve(path.dirname(a.target),beforeLinks[k].split(/[?#]/)[0]);
      const newPath=path.resolve(root,decodeURIComponent(url.slice(catalog.repositorySourceBase.length).split(/[?#]/)[0]));
      if(old!==newPath||!fs.existsSync(old))throw Error('Source target mismatch');
      changed.push({report:path.relative(root,a.target).replace(/\\/g,'/'),before:beforeLinks[k],after:url});
    }
    files.push(path.relative(root,a.target));
  }
}
const result={date:'2026-10-17',reports:files.length-3,sourceLinksChanged:changed.length,uniqueSources:new Set(changed.map(p=>p.after.split('#')[0])).size,onlyExistingSourceAnchorTargetsChanged:true,changed};
fs.writeFileSync(__dirname+'/W59-link-changes.json',JSON.stringify(result,null,2)+'\n');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex').toUpperCase();
fs.writeFileSync(__dirname+'/W59-versions.json',JSON.stringify({baseCommit:'ba0a3323254353349430c06c7e670c336259990e',uncommitted:true,scope:'Generated report source anchors only; historical science manifests preserved',files:files.map(p=>({path:p.replace(/\\/g,'/'),sha256:hash(p)}))},null,2)+'\n');
console.log(JSON.stringify({...result,changed:undefined}));
