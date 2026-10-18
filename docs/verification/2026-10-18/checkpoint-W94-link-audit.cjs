const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const inventory=JSON.parse(fs.readFileSync(path.join(__dirname,'checkpoint-W94-inventory.json'),'utf8'));
let localReferences=0;const errors=[];
for(const page of inventory){
  // JavaScript template strings are not HTML references; dynamic links are
  // rendered separately in the real-browser traversal.
  const file=path.join(root,'docs',page),html=fs.readFileSync(file,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'');
  for(const [,url]of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
    if(/^(?:[a-z]+:|\/\/)/i.test(url))continue;
    localReferences++;
    const target=path.resolve(path.dirname(file),decodeURIComponent(url.replace(/&amp;/g,'&').split(/[?#]/)[0]));
    if(!fs.existsSync(target))errors.push({page,url,target:path.relative(root,target)});
  }
}
const result={method:'static HTML href/src outside script blocks',htmlFiles:inventory.length,localReferences,errors};
fs.writeFileSync(path.join(__dirname,'checkpoint-W94-link-audit.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));if(errors.length)process.exitCode=1;
