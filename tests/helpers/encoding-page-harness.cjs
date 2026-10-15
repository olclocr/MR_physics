const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),P=require('../../docs/assets/mr-physics-models.js');
function loadEncodingPage() {
  const file=path.resolve(__dirname,'../../docs/frequency_phase_encoding_visualization.html'),html=fs.readFileSync(file,'utf8'),texts=[];
  const ctx=new Proxy({}, {get:(o,k)=>o[k]||(k==='measureText'?text=>({width:String(text).length*7}):k==='fillText'?(value)=>texts.push(String(value)):k==='arc'?(x,y,r)=>{if(r<0)throw new RangeError('negative canvas radius');}:()=>{})});
  function element(attrs='') {return {value:attrs.match(/value="([^"]*)"/)?.[1]||'',checked:/\bchecked\b/.test(attrs),
    clientWidth:1530,clientHeight:1080,width:1530,height:1080,style:{},dataset:{},listeners:{},classList:{toggle(){}},
    addEventListener(k,v){this.listeners[k]=v;},fire(k){this.listeners[k]?.({target:this});},getContext:()=>ctx};}
  const elements=Object.fromEntries([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>[m[1],element(m[0])]));
  for(const [,id,body]of html.matchAll(/<select[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))elements[id].value=body.match(/value="([^"]+)"/)?.[1]||'';
  const buttons=[...html.matchAll(/data-mode="([^"]+)"/g)].map(m=>Object.assign(element(),{dataset:{mode:m[1]}}));
  const sandbox=vm.createContext({MRPhysics:P,document:{getElementById:id=>elements[id],querySelectorAll:()=>buttons},
    window:{devicePixelRatio:1,addEventListener(){}},requestAnimationFrame(){},Date});
  for(const [,code]of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(code,sandbox,{filename:file});
  return {html,elements,texts,run:code=>vm.runInContext(code,sandbox)};
}
module.exports={loadEncodingPage};
