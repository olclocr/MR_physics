const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),M=require('../../docs/assets/dephasing-model.js');
function loadDephasingPage() {
  const file=path.resolve(__dirname,'../../docs/t2_t2star_dephasing.html'),html=fs.readFileSync(file,'utf8');
  const elements=Object.fromEntries([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>[m[1],{
    value:m[0].match(/value="([^"]*)"/)?.[1]||'',min:m[0].match(/min="([^"]*)"/)?.[1]||'',max:m[0].match(/max="([^"]*)"/)?.[1]||'',
    style:{},listeners:{},attributes:{},textContent:'',innerHTML:'',setAttribute(k,v){this.attributes[k]=v;},
    addEventListener(k,v){this.listeners[k]=v;},fire(k){this.listeners[k]?.({target:this});}
  }]));
  const sandbox=vm.createContext({DephasingModel:M,document:{getElementById:id=>elements[id]},window:{innerWidth:1920,addEventListener(){}}});
  for(const [,code]of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(code,sandbox,{filename:file});
  return {html,elements,run:code=>vm.runInContext(code,sandbox)};
}
module.exports={loadDephasingPage};
