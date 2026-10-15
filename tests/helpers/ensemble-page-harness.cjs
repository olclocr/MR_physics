const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Model=require('../../docs/assets/spin-ensemble-model.js');
function loadEnsemblePage() {
  const file=path.resolve(__dirname,'../../docs/spin_ensemble_equilibrium.html'),html=fs.readFileSync(file,'utf8');
  const elements=Object.fromEntries([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>[m[1],{
    value:m[0].match(/value="([^"]*)"/)?.[1]||'',checked:false,style:{},listeners:{},attributes:{},textContent:'',innerHTML:'',
    setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){this.listeners[k]=v;},fire(k){this.listeners[k]?.({target:this});}
  }]));
  const sandbox=vm.createContext({SpinEnsemble:Model,document:{getElementById:id=>elements[id]}});
  for(const [,code]of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(code,sandbox,{filename:file});
  return {html,elements,run:code=>vm.runInContext(code,sandbox)};
}
module.exports={loadEnsemblePage};
