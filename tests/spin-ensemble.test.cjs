const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../docs/assets/spin-ensemble-model.js'),{loadEnsemblePage}=require('./helpers/ensemble-page-harness.cjs');
test('thermal polarization agrees with independent 60-digit Boltzmann weights and high-temperature series',()=>{
  const reference=require('../docs/verification/2026-10-15/B01-reference.json');
  for(const r of reference.rows) {
    const a=M.equilibrium(r.b0,r.temperatureK);
    assert.ok(Math.abs(a.polarization-Number(r.polarization))<1e-15);
    assert.ok(Math.abs(a.lower-Number(r.lower))<=2e-16);assert.ok(Math.abs(a.upper-Number(r.upper))<=2e-16);
    assert.ok(Math.abs(a.relativeM0-Number(r.relativeM0))<1e-12);
    // Independent small-x expansion, terms through x^5 (x <= 2.9e-5).
    const x=6.62607015e-34*42577478.92*r.b0/(2*1.380649e-23*r.temperatureK);
    assert.ok(Math.abs(a.polarization-(x-x**3/3+2*x**5/15))<1e-19);
    assert.equal(a.lower+a.upper,1);
  }
  assert.equal(M.equilibrium(0,310).polarization,0);assert.equal(M.equilibrium(0,310).lower,.5);
  const a=M.equilibrium(1.5,310),b=M.equilibrium(3,310);
  assert.ok(Math.abs(b.polarization/a.polarization-2)<1e-9);
  assert.ok(M.equilibrium(3,400).polarization<M.equilibrium(3,250).polarization);
  for(const args of [[-1,310],[3,0],[NaN,310],[3,Infinity]])assert.throws(()=>M.equilibrium(...args),RangeError);
});
test('uniform phasors cancel by root-of-unity symmetry, aligned phasors sum, and visual magnification leaves actual occupations unchanged',()=>{
  for(const n of [2,3,16,64,256]) {
    const p=M.phaseSum('distributed',n);assert.ok(p.magnitude<1e-14);
    assert.ok(Math.abs(p.vectors.reduce((s,a)=>s+a.x*a.x+a.y*a.y,0)-n)<1e-12);
    assert.equal(M.phaseSum('aligned',n).magnitude,1);
  }
  const p=M.equilibrium(7,250).polarization,normal=M.populationDisplay(p,false),zoom=M.populationDisplay(p,true);
  assert.equal(zoom.displayP,normal.displayP*10000);
  assert.ok(zoom.lowerPercent<100&&zoom.upperPercent>0);assert.equal(zoom.lowerPercent+zoom.upperPercent,100);
  assert.equal(M.populationDisplay(0,true).lowerPercent,50);
});
test('controls synchronize actual values, separate P from R, clamp invalid input and reset all learning state',()=>{
  const page=loadEnsemblePage(),e=page.elements;
  const baseline=e.polarizationOutput.textContent;
  e.magnifyControl.checked=true;e.magnifyControl.fire('input');assert.equal(e.polarizationOutput.textContent,baseline);
  assert.match(e.scaleNotice.textContent,/10,000/);assert.ok(parseFloat(e.lowerBar.style.width)>50.1);
  e.phaseControl.value='aligned';e.phaseControl.fire('change');assert.equal(e.polarizationOutput.textContent,baseline);assert.match(e.phaseReadout.textContent,/R=1/);
  e.compareField.fire('click');assert.equal(page.run('state.b0'),1.5);
  e.temperatureControl.value='400';e.temperatureControl.fire('input');assert.equal(page.run('state.temperatureK'),400);
  e.b0Control.value='0';e.b0Control.fire('input');assert.match(e.polarizationOutput.textContent,/0.0000/);
  e.b0Control.value='999';e.temperatureControl.value='';e.b0Control.fire('input');assert.equal(page.run('state.b0'),7);assert.equal(page.run('state.temperatureK'),310);
  e.zeroWrong.fire('click');assert.match(e.zeroFeedback.textContent,/스핀/);e.zeroCorrect.fire('click');assert.match(e.zeroFeedback.textContent,/맞습니다/);
  e.fieldWrong.fire('click');assert.match(e.fieldFeedback.textContent,/1\/2/);e.fieldCorrect.fire('click');assert.match(e.fieldFeedback.textContent,/약 두 배/);
  e.reset.fire('click');assert.equal(e.polarizationOutput.textContent,baseline);assert.equal(e.magnifyControl.checked,false);assert.equal(e.phaseControl.value,'distributed');assert.match(e.zeroFeedback.textContent,/답을 선택/);
});
test('new chapter resources and local navigation resolve with unique static IDs and control labels',()=>{
  const {html}=loadEnsemblePage(),docs=path.resolve(__dirname,'../docs');
  const ids=[...html.matchAll(/<[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const [,id]of html.matchAll(/\bfor="([^"]+)"/g))assert.ok(ids.includes(id),id);
  for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g))if(!/^https?:|^#/.test(url))assert.ok(fs.existsSync(path.resolve(docs,url)),url);
  assert.match(html,/실제 개별 핵의 궤적|개별 핵의 실제 궤적/);assert.match(html,/10,000배/);
});
