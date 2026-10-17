(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.InversionRecovery=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const defaults=Object.freeze({tiMs:200,trMs:6000,target:'fat'}),tissues=Object.freeze([{id:'fat',label:'지방 예시',t1Ms:300,color:'#b56215'},{id:'tissue',label:'조직 예시',t1Ms:1000,color:'#245cf6'},{id:'fluid',label:'CSF 예시',t1Ms:4000,color:'#087e62'}].map(Object.freeze));
 function validate(tiMs,trMs,t1Ms){if(!Number.isFinite(tiMs)||tiMs<0||!Number.isFinite(trMs)||trMs<=tiMs||!Number.isFinite(t1Ms)||t1Ms<=0)throw new RangeError('Invalid IR timing');}
 function signedMz(tiMs,trMs,t1Ms){validate(tiMs,trMs,t1Ms);return 1-2*Math.exp(-tiMs/t1Ms)+Math.exp(-trMs/t1Ms);}
 function nullTime(trMs,t1Ms){validate(0,trMs,t1Ms);return t1Ms*Math.log(2/(1+Math.exp(-trMs/t1Ms)));}
 function calculate(options={}){const o={...defaults,...options};if(!tissues.some(t=>t.id===o.target))throw new RangeError('Invalid tissue');const rows=tissues.map(t=>{const mz=signedMz(o.tiMs,o.trMs,t.t1Ms);return {...t,mz,magnitude:Math.abs(mz),nullMs:nullTime(o.trMs,t.t1Ms),longTrNullMs:t.t1Ms*Math.LN2,beforeInversion:-Math.expm1(-(o.trMs-o.tiMs)/t.t1Ms)};});return {options:o,rows,selected:rows.find(t=>t.id===o.target)};}
 return {defaults,tissues,signedMz,nullTime,calculate};
});
