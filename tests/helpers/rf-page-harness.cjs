const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const htmlPath=path.resolve(__dirname,'../../docs/proton_spin_rf_larmor_resonance.html');
function loadRFPage() {
  const html=fs.readFileSync(htmlPath,'utf8');
  const ctx=new Proxy({}, {get:(o,k)=>o[k]||(k==='measureText'?text=>({width:String(text).length*7}):()=>{})});
  const element=attrs=>({value:attrs?.match(/value="([^"]*)"/)?.[1]||'',checked:/\bchecked\b/.test(attrs||''),
    clientWidth:1400,clientHeight:1000,width:1400,height:1000,textContent:'',style:{},dataset:{},attributes:{},
    classList:{toggle(){},add(){},remove(){}},listeners:{},setAttribute(k,v){this.attributes[k]=v;},
    addEventListener(k,v){this.listeners[k]=v;},getContext:()=>ctx,getBoundingClientRect:()=>({width:1400,height:1000}),
    fire(k){this.listeners[k]?.({target:this});}});
  const elements=Object.fromEntries([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>[m[1],element(m[0])]));
  const frames=[...html.matchAll(/data-frame-mode="([^"]+)"/g)].map(m=>Object.assign(element(),{dataset:{frameMode:m[1]}}));
  const sandbox=vm.createContext({document:{getElementById:id=>elements[id],querySelectorAll:()=>frames,createElement:()=>element()},
    window:{devicePixelRatio:1,addEventListener(){}},requestAnimationFrame(){},Date,Blob,URL,navigator:{}});
  for(const [,code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(code,sandbox,{filename:htmlPath});
  return {html,elements,run:code=>vm.runInContext(code,sandbox)};
}
module.exports={loadRFPage};
