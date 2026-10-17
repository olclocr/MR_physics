const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../docs/assets/finite-slice-rf-model.js');
const {reference}=require('./helpers/finite-slice-rf-reference.cjs');
test('Finite slice RF matches continuous-field RK4 and independent SI boundary roots in all 24 states',()=>{
  for(const durationMs of [2,4,8])for(const flipDeg of [30,90])for(const gradientMilliTPerM of [-10,-5,5,10]){
    const o={durationMs,flipDeg,gradientMilliTPerM},r=M.calculate(o),v=reference(o);
    assert.ok(Math.abs(r.nominalThicknessMm-v.nominalThicknessMm)<1e-9);
    assert.ok(Math.abs(r.areaFlipDeg-flipDeg)<1e-4);
    for(let j=0;j<201;j++){
      for(const key of ['x','y','z','magnitude'])assert.ok(Math.abs(r.profile[j][key]-v.profile[j][key])<2e-5,JSON.stringify({o,j,key}));
      assert.ok(Math.abs(r.profile[j].norm-1)<1e-10);
    }
  }
});
test('Pulse duration and gradient control nominal width; center flip uses sine rather than linear scaling',()=>{
  const r=M.calculate(),long=M.calculate({durationMs:8}),small=M.calculate({flipDeg:30}),negative=M.calculate({gradientMilliTPerM:-10});
  assert.equal(r.nominalThicknessMm,2*long.nominalThicknessMm);
  assert.ok(Math.abs(r.center.magnitude-1)<1e-10);
  assert.ok(Math.abs(small.center.magnitude-.5)<1e-10);
  for(let j=0;j<201;j++){
    assert.ok(Math.abs(r.profile[j].magnitude-negative.profile[j].magnitude)<1e-12);
    assert.ok(Math.abs(r.profile[j].x+negative.profile[j].x)<1e-12);
    assert.ok(Math.abs(r.profile[j].y-negative.profile[j].y)<1e-12);
  }
  assert.throws(()=>M.calculate({durationMs:0}),RangeError);
});
