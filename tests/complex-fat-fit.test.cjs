const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../docs/assets/complex-fat-fit-model.js');
const {reference}=require('./helpers/complex-fat-fit-reference.cjs');
test('Known-field six-echo nonnegative fit matches independent ODE/real QR and satisfies KKT in all 36 states',()=>{
  for(const fatDensityFraction of [0,.3,.5,1])for(const fieldHz of [-60,0,60])for(const assumption of ['matched','single','common']){
    const o={fatDensityFraction,fieldHz,assumption},r=M.calculate(o),v=reference(o);
    for(let j=0;j<6;j++)for(const component of ['real','imaginary']){
      assert.ok(Math.abs(r.rows[j].data[component]-v.rows[j].data[component])<1e-8);
      assert.ok(Math.abs(r.rows[j].predicted[component]-v.rows[j].predicted[component])<1e-8);
    }
    for(const key of ['water','fat','estimatedFraction','coefficientSum','rmse'])assert.ok(Math.abs(r.estimate[key]-v.estimate[key])<1e-8);
    assert.ok(Math.abs(r.estimate.objective-v.estimate.objective)<1e-10);
    for(const key of ['water','fat']){
      const gradient=r.rows.reduce((sum,row,j)=>sum+2*((row.predicted.real-row.data.real)*r.columns[j][key].real+(row.predicted.imaginary-row.data.imaginary)*r.columns[j][key].imaginary),0);
      assert.ok(r.estimate[key]>=0);
      assert.ok(r.estimate[key]>1e-9?Math.abs(gradient)<1e-9:gradient>=-1e-9);
    }
  }
});
test('Model mismatch changes inference while known field phase alone does not; absent fat does not validate its basis',()=>{
  const a=M.calculate(),b=M.calculate({fieldHz:-60}),wrong=M.calculate({assumption:'single'}),water=M.calculate({fatDensityFraction:0,assumption:'single'});
  assert.ok(Math.abs(a.estimate.estimatedFraction-.3)<1e-12);
  assert.ok(Math.abs(a.estimate.estimatedFraction-b.estimate.estimatedFraction)<1e-12);
  assert.deepEqual(a.data,wrong.data);
  assert.ok(Math.abs(wrong.estimate.estimatedFraction-.3)>1e-3);
  assert.ok(water.estimate.rmse<1e-12&&water.estimate.fat<1e-12);
  assert.equal(M.fit(a.data.map(()=>({real:0,imaginary:0})),a.columns).estimatedFraction,null);
  assert.throws(()=>M.calculate({fieldHz:61}),RangeError);
});
