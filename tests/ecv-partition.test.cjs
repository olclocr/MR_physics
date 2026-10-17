const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../docs/assets/ecv-partition-model.js');
const {reference}=require('./helpers/ecv-partition-reference.cjs');
test('ECV partition agrees with independent volume sums and longitudinal RK4 inverse in all 36 lesson states',()=>{
  for(const ecv of [.2,.3,.5])for(const plasmaMm of [0,.5,1,2])for(const analysisHct of [.25,.4,.55]){
    const o={ecv,plasmaMm,analysisHct},r=M.calculate(o),v=reference(o);
    for(let j=0;j<2;j++)for(const key of ['amountUmol','preR1','postR1','deltaR1','preT1Ms','postT1Ms']){
      const tolerance=key.endsWith('Ms')?1e-6:1e-9;
      assert.ok(Math.abs(r.rows[j][key]-v.rows[j][key])<tolerance,JSON.stringify({o,j,key}));
    }
    for(const key of ['lambda','ecv']){
      if(v.estimate[key]===null)assert.equal(r.estimate[key],null);
      else assert.ok(Math.abs(r.estimate[key]-v.estimate[key])<1e-9);
    }
  }
});
test('Dose scaling, hematocrit bias and the zero-change exception keep their distinct meanings',()=>{
  const a=M.calculate(),b=M.calculate({plasmaMm:2}),c=M.calculate({analysisHct:.25}),z=M.calculate({plasmaMm:0});
  assert.ok(Math.abs(a.estimate.ecv-.3)<1e-15);
  assert.ok(Math.abs(a.estimate.ecv-b.estimate.ecv)<1e-15);
  assert.equal(b.rows[0].deltaR1,2*a.rows[0].deltaR1);
  assert.deepEqual(c.rows,a.rows);
  assert.ok(Math.abs(c.estimate.ecv-.375)<1e-15);
  assert.equal(z.estimate.ecv,null);assert.equal(z.estimate.lambda,null);
  assert.equal(z.bias,null);assert.equal(z.rows[0].preT1Ms,z.rows[0].postT1Ms);
  assert.throws(()=>M.infer(0,500,1500,500,.4),RangeError);
  assert.throws(()=>M.infer(1000,500,1500,500,1),RangeError);
  assert.equal(M.infer(1000,500,500,1500,.4).ecv,null);
});
