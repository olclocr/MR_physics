const {evolve}=require('./pdff-echo-reference.cjs');
const {qrSolve}=require('./dixon-reference.cjs');
const peaks=[[-3.8,.088],[-3.4,.7],[-2.6,.12],[-1.95,.006],[-.5,.039],[.6,.047]];
function columns(t,fieldHz,assumption){
  const water=evolve(t,1/40,fieldHz),rate=1/(assumption==='common'?40:20);
  let re=0,im=0;
  for(const [ppm,weight]of assumption==='single'?[[-3.4,1]]:peaks){
    const p=evolve(t,rate,fieldHz+ppm*42.57747892*3);re+=weight*p.re;im+=weight*p.im;
  }
  return{water:{real:water.re,imaginary:water.im},fat:{real:re,imaginary:im}};
}
function reference(o){
  const a=[],rhs=[],rows=[];
  for(let t=1;t<=6;t++){
    const actual=columns(t,o.fieldHz,'matched'),model=columns(t,o.fieldHz,o.assumption),f=o.fatDensityFraction;
    const data={real:(1-f)*actual.water.real+f*actual.fat.real,imaginary:(1-f)*actual.water.imaginary+f*actual.fat.imaginary};
    a.push([model.water.real,model.fat.real],[model.water.imaginary,model.fat.imaginary]);rhs.push(data.real,data.imaginary);rows.push({teMs:t,data,model});
  }
  const unconstrained=qrSolve(a,rhs),candidates=[];
  const at=x=>{const prediction=a.map(row=>row[0]*x[0]+row[1]*x[1]);return{x,objective:prediction.reduce((s,v,j)=>s+(v-rhs[j])**2,0),prediction};};
  if(unconstrained.every(v=>v>=0))candidates.push(at(unconstrained));
  for(let k=0;k<2;k++){
    const numerator=a.reduce((s,row,j)=>s+row[k]*rhs[j],0),denominator=a.reduce((s,row)=>s+row[k]**2,0),x=[0,0];
    x[k]=Math.max(0,numerator/denominator);candidates.push(at(x));
  }
  const best=candidates.reduce((a,b)=>a.objective<b.objective?a:b),[water,fat]=best.x;
  const estimate={water,fat,coefficientSum:water+fat,estimatedFraction:water+fat>0?fat/(water+fat):null,objective:best.objective,rmse:Math.sqrt(best.objective/6)};
  const values=rows.map((row,j)=>({...row,predicted:{real:best.prediction[2*j],imaginary:best.prediction[2*j+1]},residual:Math.hypot(best.prediction[2*j]-row.data.real,best.prediction[2*j+1]-row.data.imaginary)}));
  return{options:o,rows:values,estimate,bias:estimate.estimatedFraction-o.fatDensityFraction};
}
module.exports={reference,columns};
