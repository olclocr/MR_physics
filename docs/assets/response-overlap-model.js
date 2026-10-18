(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./delayed-response-model.js'):root.DelayedResponse);if(node)module.exports=api;else root.ResponseOverlap=api;})(typeof globalThis!=='undefined'?globalThis:this,function(D){
 'use strict';const defaults=Object.freeze({separationSec:6,secondAmplitude:1,scaleSec:1}),observationSec=10;
 function calculate(options={}){const o={...defaults,...options};if(![2,6,10].includes(o.separationSec)||![0,.5,1].includes(o.secondAmplitude)||![1,2].includes(o.scaleSec))throw new RangeError('Unsupported overlap state');
  const source=D.calculate({durationSec:2,scaleSec:o.scaleSec,timeSec:8}),shift=10*o.separationSec,curve=source.curve.map((p,j)=>{const q=source.curve[j-shift],firstInput=p.input,secondInput=o.secondAmplitude*(q?.input||0),firstResponse=p.response,secondResponse=o.secondAmplitude*(q?.response||0);return{timeSec:p.timeSec,firstInput,secondInput,input:firstInput+secondInput,firstResponse,secondResponse,response:firstResponse+secondResponse};});
  return{options:o,observationSec,firstOnsetSec:2,secondOnsetSec:2+o.separationSec,durationSec:2,totalResponseAreaSec:2*(1+o.secondAmplitude),curve,current:curve[100]};
 }
 return{defaults,calculate};
});
