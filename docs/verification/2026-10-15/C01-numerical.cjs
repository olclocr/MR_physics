// Run from the repository root: node docs/verification/2026-10-15/C01-numerical.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const model = require('../../assets/contrast-model.js');
const {relaxRK4,repeatedEcho} = require('../../../tests/helpers/contrast-reference.cjs');
const rows = [];
const maxError = {chronological:0, rk4Recovery:0, rk4Signal:0, approximation:0};
for(const tissue of model.tissues) for(const tr of [200,500,6000,10000,12000]) for(const te of [5,10,15,100,180]) {
  const before180=1-Math.exp(-te/2/tissue.t1);
  const chronological=1+(-before180-1)*Math.exp(-(tr-te/2)/tissue.t1);
  const reference=repeatedEcho(tissue,tr,te);
  const actual=model.signal(tissue,tr,te);
  const error={chronological:Math.abs(actual.recovery-chronological),rk4Recovery:Math.abs(actual.recovery-reference.second.recovery),
    rk4Signal:Math.abs(actual.signal-tissue.pd*reference.second.echo),approximation:Math.abs(actual.approxRecovery-relaxRK4([0,0,0],tr,tissue.t1,tissue.t2)[2])};
  for(const key of Object.keys(error)) maxError[key]=Math.max(maxError[key],error[key]);
  assert.ok(error.chronological<=1e-12);
  assert.ok(error.rk4Recovery<=1e-8&&error.rk4Signal<=1e-8&&error.approximation<=1e-8);
  assert.ok(Math.abs(model.signal(tissue,tr,te,true).signal-reference.second.echo)<=1e-8);
  rows.push({tissue:tissue.id,tr,te,pd:actual.pd,recovery:actual.recovery,decay:actual.decay,signal:actual.signal,
    approxRecovery:actual.approxRecovery,independent:reference,error});
}
const presets=Object.fromEntries(Object.entries(model.presets).map(([id,{tr,te}])=>[id,{tr,te,rows:model.signals(tr,te),equalPD:model.signals(tr,te,true)}]));
const limits=model.tissues.map(tissue=>({tissue:tissue.id,longTRZeroTE:model.signal(tissue,1e8,0).signal,
  trEqualsTE:model.signal(tissue,200,200).signal,
  longTRZeroTEError:Math.abs(model.signal(tissue,1e8,0).signal-tissue.pd)}));
assert.ok(limits.every(row=>row.longTRZeroTEError<=1e-12));
const result={date:'2026-10-15',tolerance:{chronological:1e-12,rk4:1e-8,maxStepMs:.5},cases:rows.length,maxError,presets,limits,rows};
fs.writeFileSync(path.join(__dirname,'C01-numerical.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,maxError,limits},null,2));
