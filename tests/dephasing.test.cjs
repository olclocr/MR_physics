const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../docs/assets/dephasing-model.js'),{reference}=require('./helpers/dephasing-reference.cjs'),{loadDephasingPage}=require('./helpers/dephasing-page-harness.cjs');
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
test('continuous Gaussian envelopes agree with independent Simpson integration of time-ordered Bloch vectors',()=>{
  for(const t2Ms of [20,80,200])for(const sigmaHz of [0,1,10,20])for(const teMs of [20,40,80]){
    const o={t2Ms,sigmaHz,teMs};for(const t of [0,teMs/2-.1,teMs/2,teMs/2+.1,teMs-.1,teMs,teMs+.1,120]){
      const a=M.calculate(o,t),b=reference(o,t);near(a.fid,b.fid);near(a.se,b.se);near(b.variance,sigmaHz**2);
      near(b.fidVector.x,0);near(b.seVector.x,0);near(b.fidVector.y,a.fid);near(b.seVector.y,a.afterRF?-a.se:a.se);
    }
  }
});
test('zero spread, RF boundary, irreversible T2 and non-exponential Gaussian limits are consistent',()=>{
  for(const t of [0,19.999,20,40,120]){const a=M.calculate({sigmaHz:0},t);near(a.fid,Math.exp(-t/80));near(a.se,a.fid);}
  for(const sigmaHz of [0,1,10,20]){const a=M.calculate({sigmaHz},40);near(a.se,Math.exp(-.5));near(a.seCoherence,1);assert.ok(a.se<1);}
  const before=M.calculate({},20-1e-7),after=M.calculate({},20);near(before.se,after.se,1e-8);
  const a=M.calculate({},10),b=M.calculate({},20);assert.ok(Math.abs(Math.log(b.fidCoherence)-2*Math.log(a.fidCoherence))>.1);
  const short=M.calculate({t2Ms:40},40),long=M.calculate({},40);assert.ok(short.se<long.se);near(short.seCoherence,long.seCoherence);
  near(M.calculate({},-1).timeMs,0);near(M.calculate({},200).timeMs,120);
  for(const o of [{t2Ms:0},{sigmaHz:-1},{teMs:Infinity}])assert.throws(()=>M.calculate(o,40),RangeError);
});
test('observation examples, keyboard-compatible controls, time markers and explanatory quizzes stay synchronized',()=>{
  const p=loadDephasingPage(),e=p.elements;assert.equal(e.seSignal.textContent,'0.6065');assert.equal(e.seFactor.textContent,'1.0000');
  e.exampleZero.fire('click');assert.equal(e.fidSignal.textContent,e.seSignal.textContent);e.sigmaControl.value='10';e.sigmaControl.fire('input');assert.ok(Number(e.fidSignal.textContent)<.1);
  e.exampleT2.fire('click');assert.equal(e.seSignal.textContent,'0.3679');e.beforeRF.fire('click');near(p.run('state.timeMs'),19.9);e.afterRF.fire('click');near(p.run('state.timeMs'),20);e.atTE.fire('click');near(p.run('state.timeMs'),40);
  for(const id of ['quizEchoCorrect','quizEchoWrong','quizShapeCorrect','quizShapeWrong'])e[id].fire('click');assert.match(e.quizShapeFeedback.textContent,/t²/);
  p.run('window.innerWidth=390;render()');assert.match(e.signalGraphic.attributes.viewBox,/^0 0 360 /);assert.equal((e.signalGraphic.innerHTML.match(/polyline/g)||[]).length,3);
  e.reset.fire('click');assert.equal(p.run('state.t2Ms'),80);assert.equal(p.run('state.sigmaHz'),10);assert.match(e.quizEchoFeedback.textContent,/답을 선택/);
  const ids=[...p.html.matchAll(/<[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);for(const [,id]of p.html.matchAll(/\bfor="([^"]+)"/g))assert.ok(ids.includes(id));
  for(const [,url]of p.html.matchAll(/(?:href|src)="([^"]+)"/g))if(!/^https?:|^#/.test(url))assert.ok(fs.existsSync(path.resolve(__dirname,'../docs',url)),url);
});
