(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./mr-physics-models.js'):root.MRPhysics,node?require('./pdff-echo-model.js'):root.PDFFEcho);
  if(node)module.exports=api;else root.ComplexFatFit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(P,D){
  'use strict';
  const defaults=Object.freeze({fatDensityFraction:.3,fieldHz:60,assumption:'matched'}),times=Object.freeze([1,2,3,4,5,6]);
  const dot=(a,b)=>a.real*b.real+a.imaginary*b.imaginary;
  function signal(teMs,fraction,fieldHz,spectrum,relaxation){
    const c=D.at(teMs,{fatDensityFraction:fraction,b0:3,spectrum,relaxation});
    const m=P.free(P.v(c.water+c.fatReal,c.fatImaginary,0),teMs,fieldHz);
    return{real:m.x,imaginary:m.y};
  }
  function basis(teMs,fieldHz,assumption){
    const spectrum=assumption==='single'?'single':'multi',relaxation=assumption==='common'?'same':'different';
    return{water:signal(teMs,0,fieldHz,spectrum,relaxation),fat:signal(teMs,1,fieldHz,spectrum,relaxation)};
  }
  function fit(echoes,columns){
    if(!echoes.length||echoes.length!==columns.length)throw new RangeError('Matching nonempty echo and basis arrays required');
    let a=0,b=0,c=0,d=0,e=0;
    for(let j=0;j<echoes.length;j++){
      const p=columns[j];a+=dot(p.water,p.water);b+=dot(p.water,p.fat);c+=dot(p.fat,p.fat);d+=dot(p.water,echoes[j]);e+=dot(p.fat,echoes[j]);
    }
    const determinant=a*c-b*b;
    if(!Number.isFinite(determinant)||determinant<=1e-12*a*c||a<=0||c<=0)throw new RangeError('Two independent finite basis columns required');
    const at=(water,fat)=>{
      const predicted=columns.map(p=>({real:water*p.water.real+fat*p.fat.real,imaginary:water*p.water.imaginary+fat*p.fat.imaginary}));
      const objective=predicted.reduce((sum,p,j)=>sum+(p.real-echoes[j].real)**2+(p.imaginary-echoes[j].imaginary)**2,0);
      return{water,fat,predicted,objective};
    };
    const candidates=[at(Math.max(0,d/a),0),at(0,Math.max(0,e/c)),at(0,0)];
    const water=(d*c-b*e)/determinant,fat=(a*e-b*d)/determinant;
    if(water>=0&&fat>=0)candidates.push(at(water,fat));
    const best=candidates.reduce((x,y)=>x.objective<=y.objective?x:y),sum=best.water+best.fat;
    return{...best,coefficientSum:sum,estimatedFraction:sum>0?best.fat/sum:null,rmse:Math.sqrt(best.objective/echoes.length),determinant};
  }
  function calculate(options={}){
    const o={...defaults,...options};
    if(![0,.3,.5,1].includes(o.fatDensityFraction)||![-60,0,60].includes(o.fieldHz)||!['matched','single','common'].includes(o.assumption))throw new RangeError('Unsupported complex fat fit state');
    const columns=times.map(t=>basis(t,o.fieldHz,o.assumption));
    const data=times.map(t=>signal(t,o.fatDensityFraction,o.fieldHz,'multi','different'));
    const estimate=fit(data,columns);
    const rows=times.map((teMs,j)=>({teMs,data:data[j],predicted:estimate.predicted[j],residual:Math.hypot(estimate.predicted[j].real-data[j].real,estimate.predicted[j].imaginary-data[j].imaginary)}));
    return{options:o,times,columns,data,estimate,rows,trueWater:1-o.fatDensityFraction,trueFat:o.fatDensityFraction,bias:estimate.estimatedFraction===null?null:estimate.estimatedFraction-o.fatDensityFraction};
  }
  return{defaults,times,basis,fit,calculate};
});
