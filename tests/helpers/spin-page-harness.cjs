const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const P=require('../../docs/assets/mr-physics-models.js');
function loadSpinPage() {
  const htmlPath=path.resolve(__dirname,'../../docs/proton_spin_mr_simulation.html'),html=fs.readFileSync(htmlPath,'utf8');
  const ctx=new Proxy({}, {get:(o,k)=>o[k]||(k==='measureText'?text=>({width:String(text).length*7}):()=>{})});
  const element=(attrs='')=>({value:attrs.match(/value="([^"]*)"/)?.[1]||'',clientWidth:1400,clientHeight:1000,offsetTop:900,
    width:1400,height:1000,textContent:'',style:{},dataset:{},listeners:{},disabled:false,appendChild(){},
    addEventListener(k,v){this.listeners[k]=v;},getContext:()=>ctx,getBoundingClientRect:()=>({width:1400,height:1000}),
    fire(k){this.listeners[k]?.({target:this});}});
  const elements=Object.fromEntries([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>[m[1],element(m[0])]));
  elements.sequenceMode.value='custom';
  const sandbox=vm.createContext({MRPhysics:P,document:{getElementById:id=>elements[id],createElement:()=>element()},
    window:{devicePixelRatio:1,addEventListener(){}},requestAnimationFrame(){},Date});
  for(const [,code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(code,sandbox,{filename:htmlPath});
  return {html,elements,run:code=>vm.runInContext(code,sandbox)};
}
module.exports={loadSpinPage};
