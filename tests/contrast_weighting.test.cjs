// node --test tests/contrast_weighting.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('../docs/assets/contrast-model.js');
const htmlPath = path.join(__dirname, '../docs/contrast_weighting.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const near = (a,b,eps=1e-12) => assert.ok(Math.abs(a-b)<eps, `${a} != ${b}`);

test('SE recovery agrees with independent chronological relaxation and inversion', () => {
  // Start immediately after an ideal 90. Recover to TE/2, invert z,
  // recover to the following excitation. This does not reuse the SE formula.
  for(const tissue of model.tissues) for(const tr of [200,500,6000,12000]) for(const te of [5,15,100,180]) {
    const zBeforeRefocus=1-Math.exp(-(te/2)/tissue.t1);
    const zAfterRefocus=-zBeforeRefocus;
    const zAtNext90=1+(zAfterRefocus-1)*Math.exp(-(tr-te/2)/tissue.t1);
    const actual=model.signal(tissue,tr,te);
    near(actual.recovery,zAtNext90);
    near(actual.signal,tissue.pd*zAtNext90*Math.exp(-te/tissue.t2));
    assert.ok(actual.signal>=0&&actual.signal<=1);
  }
});

test('contrast examples, monotonic signal loss and PD isolation support the lesson', () => {
  const [wm,gm,csf]=model.signals(500,15);
  assert.ok(wm.signal>gm.signal&&gm.signal>csf.signal,'T1 example');
  const t2=model.signals(6000,100);
  assert.ok(t2[2].signal>t2[1].signal&&t2[1].signal>t2[0].signal,'T2 example');
  for(const tissue of model.tissues) {
    assert.ok(model.signal(tissue,6000,180).signal<model.signal(tissue,6000,100).signal);
    assert.ok(model.signal(tissue,12000,15).recovery>model.signal(tissue,500,15).recovery);
    near(model.signal(tissue,10000,10).signal/model.signal(tissue,10000,10,true).signal,tissue.pd);
    near(model.signal(tissue,1e8,0).signal,tissue.pd);
  }
  const equal=model.signals(10000,10,true);
  assert.ok(Math.abs(equal[2].signal-equal[0].signal)>.02,'finite TR/TE retains relaxation contrast');
  assert.throws(()=>model.signal(model.tissues[0],100,200),RangeError);
  assert.throws(()=>model.signal(model.tissues[0],Infinity,10),RangeError);
});

test('synthetic compartments are labeled and fixed display signals stay finite at all slider boundaries', () => {
  const counts={wm:0,gm:0,csf:0};
  for(let y=0;y<96;y++) for(let x=0;x<96;x++) {
    const id=model.tissueAt((x+.5)/96*2-1,(y+.5)/96*2-1);
    if(id) {assert.ok(id in counts);counts[id]++;}
  }
  assert.ok(Object.values(counts).every(n=>n>100));
  assert.equal(model.tissueAt(1,1),null);
  for(const tr of [200,12000]) for(const te of [5,180]) for(const equal of [false,true]) {
    for(const row of model.signals(tr,te,equal)) assert.ok(Number.isFinite(row.signal)&&row.signal>=0&&row.signal<=1);
  }
});

function loadPage(width=1000) {
  const drawing=new Proxy({}, {get(target,key) {return target[key]||((...args)=>{for(const n of args) if(typeof n==='number') assert.ok(Number.isFinite(n),`canvas ${key}`);});}});
  const makeElement=attrs=>({
    id:attrs.match(/id="([^"]*)"/)?.[1]||'',
    value:attrs.match(/value="([^"]*)"/)?.[1]||'',
    min:attrs.match(/min="([^"]*)"/)?.[1]||'',max:attrs.match(/max="([^"]*)"/)?.[1]||'',step:attrs.match(/step="([^"]*)"/)?.[1]||'',
    checked:false, textContent:'',innerHTML:'',attributes:{},dataset:{},listeners:{},
    classList:{toggle(){},remove(){}},setAttribute(k,v){this.attributes[k]=v;},
    appendChild(child){child.parentNode=this;},
    addEventListener(name,fn){this.listeners[name]=fn;},
    getBoundingClientRect(){return {width:Math.min(width,460),height:270};},getContext(){return drawing;},
    fire(name){assert.ok(this.listeners[name]);this.listeners[name]({target:this});}
  });
  const elements=Object.fromEntries([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(m=>[m[1],makeElement(m[0])]));
  const presets=[...html.matchAll(/<button[^>]*data-preset="([^"]+)"[^>]*>/g)].map(m=>Object.assign(makeElement(m[0]),{dataset:{preset:m[1]}}));
  const answers=[...html.matchAll(/<button[^>]*data-answer="([^"]+)"[^>]*>/g)].map(m=>Object.assign(makeElement(m[0]),{dataset:{answer:m[1]}}));
  const sandbox=vm.createContext({MRContrast:model,document:{getElementById:id=>{assert.ok(elements[id],id);return elements[id];},querySelectorAll:selector=>selector==='[data-preset]'?presets:answers},window:{innerWidth:width,devicePixelRatio:2,addEventListener(){}}});
  for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],sandbox,{filename:htmlPath});
  return {elements,presets,answers,run:code=>vm.runInContext(code,sandbox)};
}

test('controls, numeric constraints, quiz, PD switch and reset keep all outputs synchronized', () => {
  for(const width of [1440,390]) {
    const page=loadPage(width), e=page.elements;
    assert.equal(e.controlsPanel.parentNode,width<=1100?e.mobileControls:e.desktopControls);
    assert.match(e.conditionLabel.textContent,/T1W/);
    page.presets.find(b=>b.dataset.preset==='t2').fire('click');
    assert.equal(e.tr.value,6000);assert.equal(e.teNumber.value,100);
    e.teNumber.value='180';e.teNumber.fire('input');
    assert.equal(e.te.value,180);assert.equal(e.teNumber.value,'180');
    assert.match(e.conditionLabel.textContent,/TE 180/);
    e.te.value='180';e.te.fire('input');
    assert.match(e.conditionLabel.textContent,/직접 조절/);
    assert.match(e.phantom.attributes['aria-label'],/TE 180/);
    e.trNumber.value='999999';e.trNumber.fire('change');assert.equal(e.tr.value,12000);
    e.teNumber.value='-20';e.teNumber.fire('change');assert.equal(e.te.value,5);
    e.trNumber.value='';e.trNumber.fire('change');assert.equal(e.trNumber.value,12000);
    e.equalPD.checked=true;e.equalPD.fire('change');assert.match(e.summary.textContent,/밀도 차이를 숨겼습니다/);
    page.answers.find(b=>b.dataset.answer==='decrease').fire('click');assert.match(e.quizFeedback.textContent,/맞습니다/);
    e.reset.fire('click');assert.equal(e.tr.value,500);assert.equal(e.te.value,15);assert.equal(e.equalPD.checked,false);
    assert.match(e.quizFeedback.textContent,/답을 고르면/);
  }
});

test('page resources, local navigation and unique labels resolve', () => {
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const m of html.matchAll(/\bfor="([^"]+)"/g)) assert.ok(ids.includes(m[1]));
  for(const m of html.matchAll(/(?:href|src)="([^"#:]+\.(?:html|js|md))"/g)) {
    if(m[1].startsWith('http'))continue;
    assert.ok(fs.existsSync(path.resolve(path.dirname(htmlPath),m[1])),`missing ${m[1]}`);
  }
});
