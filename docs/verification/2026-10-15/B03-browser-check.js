async (page) => {
  const root='http://127.0.0.1:8766',folder='docs/verification/2026-10-15/';
  await page.route('**/*',route=>route.continue());
  const references=await (await page.request.get(root+'/docs/verification/2026-10-15/B03-numerical.json')).json();
  const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
  const scrub=async(time)=>set('sequenceScrub',time);
  async function capture(label) {
    const a=await page.evaluate(()=>{const p=physics(),c=document.getElementById('scene');return {
      label:'',state:{mode:state.mode,b0:state.b0,b1MicroT:state.b1MicroT,angleDeg:state.targetDeg,offResHz:state.offResHz,t1Ms:state.t1Ms,t2Ms:state.t2Ms,trMs:state.trMs,teMs:state.teMs,spreadHz:state.spreadHz,fatFraction:state.fatFraction,sequenceMode:state.sequenceMode,paused:state.sequencePaused},
      time:state.mode==='free'?state.freeMs:state.sequenceElapsedMs,
      m:{x:p.m.x/p.m0Scene,y:p.m.y/p.m0Scene,z:p.m.z/p.m0Scene},signal:p.signal,teSignal:p.teSignal,event:p.event,
      z:document.getElementById('mzMetric').textContent,xy:document.getElementById('mxyMetric').textContent,
      rfActive:p.rfActive,overflow:document.documentElement.scrollWidth>innerWidth,
      drawn:c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)};});a.label=label;
    const kind=a.state.mode==='free'?'free':a.state.sequenceMode==='chemical'?'chemical':'SE';
    const keys=kind==='free'?['b1MicroT','angleDeg','offResHz','t1Ms','t2Ms']:kind==='SE'?['trMs','teMs','spreadHz','offResHz']:['b0','fatFraction','offResHz'];
    const ref=references.rows.find(r=>r.kind===kind&&Math.abs(r.timeMs-a.time)<1e-10&&keys.every(k=>r.options[k]===a.state[k]));
    check(!!ref,label+' missing independent reference');
    const independent=ref.endToEndReference||ref.reference;
    a.maxVectorError=Math.max(...['x','y','z'].map(k=>Math.abs(a.m[k]-independent[k])));
    check(a.maxVectorError<2e-5,label+' vector');check(!a.overflow&&a.drawn,label+' layout/drawing');
    check(Math.abs(Number(a.z)-a.m.z)<=.0005+1e-12&&Math.abs(Number(a.xy)-a.signal)<=.0005+1e-12,label+' numeric display');
    results.push(a);
  }
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});await page.goto(root+'/docs/proton_spin_mr_simulation.html?qa=w03-'+Date.now());
    await page.locator('#observeRF').click();await capture(width+' RF end');
    await page.locator('#observeFree').click();await capture(width+' T2');
    await scrub(900);await capture(width+' T1');await page.waitForTimeout(150);check((await page.evaluate(()=>state.freeMs))===900,'free paused clock');
    await page.locator('#pauseSequence').click();await page.waitForTimeout(100);check((await page.evaluate(()=>state.freeMs))>900,'free resume');
    await page.locator('#pauseSequence').click();await scrub(5000);await capture(width+' free boundary');
    await page.locator('#observeRF').click();await page.locator('#startPulse').click();
    await page.locator('#pauseSequence').click();const rfTime=await page.evaluate(()=>state.elapsed);await page.waitForTimeout(150);
    check((await page.evaluate(()=>state.elapsed))===rfTime,'finite RF paused clock');await page.locator('#pauseSequence').click();
    await page.waitForFunction(()=>state.mode==='free');await page.locator('#pauseSequence').click();await scrub(0);await capture(width+' replay finite RF');
    await set('flipControl',0);await page.locator('#startPulse').click();await page.waitForFunction(()=>state.mode==='free');
    await page.locator('#pauseSequence').click();await scrub(0);await capture(width+' zero flip');
    await page.locator('#observeEcho').click();await capture(width+' guided echo');
    for(const t of [0,49.9,50,100,3000]){await scrub(t);await capture(width+' T2W '+t);}
    await page.locator('#sequenceEventList button').filter({hasText:'180°:'}).click();
    check((await page.evaluate(()=>state.sequenceElapsedMs))===50,'exact refocusing button');
    await page.locator('.stage').screenshot({path:folder+'B03-refocus-'+width+'.png'});
    await page.locator('#sequenceMode').scrollIntoViewIfNeeded();
    await page.screenshot({path:folder+'B03-controls-'+width+'.png'});
    await set('spreadControl',0);await scrub(100);await capture(width+' homogeneous echo');
    check((await page.locator('#spreadOutput').textContent()).includes('1 groups'),'zero distribution count');
    await page.locator('#sequenceMode').selectOption('t1w');await set('spreadControl',35);
    await page.locator('#runSequence').click();await page.waitForTimeout(100);await page.locator('#pauseSequence').click();
    const frozen=await page.evaluate(()=>state.sequenceElapsedMs);await page.waitForTimeout(150);check((await page.evaluate(()=>state.sequenceElapsedMs))===frozen,'SE pause');
    for(const t of [7.4,7.5,15,500]){await scrub(t);await capture(width+' T1W '+t);}
    await set('teControl',15.1);await page.locator('#sequenceEventList button').filter({hasText:'180°:'}).click();
    check((await page.evaluate(()=>state.sequenceElapsedMs))===7.55,'half-slider-tick exact time');
    check((await page.locator('#sequenceScrubOutput').textContent()).includes('7.55'),'half tick display precision');
    await capture(width+' exact half tick');
    await set('trControl',100);await set('teControl',300);
    check((await page.locator('#teControl').inputValue())==='99','TE/TR constraint');
    await page.locator('#sequenceEventList button').filter({hasText:'TE:'}).click();await capture(width+' short TR boundary');
    await set('t1Control',200);await set('t2Control',500);check((await page.locator('#t2Control').inputValue())==='400','T2<=2T1');
    await page.locator('#sequenceMode').selectOption('chemical');
    for(const b0 of [3,1.5])for(const fat of [0,50,100]) {
      await set('b0Control',b0);await page.locator('#applyPreset').click();await set('fatControl',fat);
      await scrub(b0===3?2.3:4.6);await capture(width+' chemical '+b0+'T '+fat+'%');
    }
    await set('b0Control',3);await page.locator('#applyPreset').click();await set('fatControl',50);await scrub(1.1);await capture(width+' near OP');
    await page.locator('.stage').screenshot({path:folder+'B03-chemical-'+width+'.png'});
    await page.locator('#quizWrong').click();check((await page.locator('#quizFeedback').textContent()).includes('회복하지 못합니다'),'quiz incorrect feedback');
    await page.locator('#quizCorrect').focus();await page.keyboard.press('Enter');check((await page.locator('#quizFeedback').textContent()).includes('맞습니다'),'quiz keyboard correct');
    await page.locator('#quizFeedback').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B03-lesson-'+width+'.png'});
    await page.locator('#resetPulse').click();check((await page.evaluate(()=>state.mode))==='idle','reset mode');
    check((await page.evaluate(()=>state.sequencePaused))===false,'reset pause');
    await page.locator('#sequenceMode').selectOption('custom');await page.locator('#observeFree').click();
    await page.locator('#sequenceScrub').focus();await page.keyboard.press('Home');check((await page.evaluate(()=>state.freeMs))===0,'keyboard Home');
    await page.keyboard.press('End');check((await page.evaluate(()=>state.freeMs))===5000,'keyboard End');
    await page.locator('#observeRF').click();await page.evaluate(()=>{document.querySelector('.sidebar').scrollTop=0;scrollTo(0,0);});
    await page.screenshot({path:folder+'B03-page-'+width+'.png'});
    await page.locator('.stage').screenshot({path:folder+'B03-scene-'+width+'.png'});
  }
  check(errors.length===0,'browser errors '+errors.join(','));
  return {browser:page.context().browser().version(),results,errors};
}
