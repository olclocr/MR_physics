async (page) => {
  const root='http://127.0.0.1:8766',folder='docs/verification/2026-10-15/';
  await page.route('**/*',route=>route.continue());
  await page.goto(root+'/docs/frequency_phase_encoding_visualization.html?qa=resize-fix-'+Date.now());
  const ref=await (await page.request.get(root+'/docs/verification/2026-10-15/B04-numerical.json')).json();
  const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
  const finish=()=>page.locator('#timeScrub').evaluate(el=>{el.value=el.max;el.dispatchEvent(new Event('input',{bubbles:true}));});
  async function capture(label) {
    const a=await page.evaluate(()=>{const frame=currentFrame(),image=reconstructedImage(frame),p=MRPhysics.encodingTrajectory(state,frame),c=document.getElementById('scene');return {
      state:{...state},frame,trajectory:p,signal:signalAt(frame),image:{valid:image.validGrid,count:image.sampleCount,max:image.maxValue,reason:image.reason,pixels:image.pixels},
      phase:document.getElementById('signedPhaseOutput').textContent,signalPhase:document.getElementById('signalPhaseOutput').textContent,
      signalMetric:document.getElementById('signalMetric').textContent,physicalTime:document.getElementById('physicalTimeOutput').textContent,
      samples:totalAcquiredSampleCount(frame),ift:document.getElementById('iftOutput').textContent,
      overflow:document.documentElement.scrollWidth>innerWidth,drawn:c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)};});
    const keys=['phaseDegPerRow','frequencyHzPerCol','readoutMs','t2starMs','ignoreDecay'];
    const preparation=['phase','excitation'].includes(a.frame.stage),nominalKx=a.frame.readoutProgress*4-2;
    const r=ref.rows.find(r=>r.pattern===a.state.objectPattern&&keys.every(k=>r.options[k]===a.state[k])&&r.ky===a.frame.ky&&
      (preparation?r.kind==='preparation'&&r.phaseOnly===!!a.frame.phaseOnly&&Math.abs(r.progress-a.frame.phaseProgress)<1e-10:r.kind==='ADC'&&Math.abs(r.kx-nominalKx)<1e-10));
    check(!!r,label+' reference');
    a.kError=Math.max(Math.abs(a.trajectory.kx-r.reference.kx),Math.abs(a.trajectory.ky-r.reference.ky));
    a.signalError=Math.max(Math.abs(a.signal.real-r.reference.real/r.reference.totalDensity),Math.abs(a.signal.imaginary-r.reference.imaginary/r.reference.totalDensity));
    check(a.kError<1e-12&&a.signalError<1e-12,label+' independent k/signal');
    check(Math.abs(parseFloat(a.signalMetric)-a.signal.magnitude)<=.0005+1e-12,label+' signal display');
    check(Math.abs(parseFloat(a.physicalTime)-r.reference.timeMs)<=.005+1e-12,label+' physical time display');
    check(!a.overflow&&a.drawn,label+' drawing/overflow');
    if(a.frame.stage==='complete'&&a.image.valid&&a.state.frequencyHzPerCol===25&&a.state.readoutMs===32&&a.state.t2starMs===180) {
      const b=ref.reconstructions.find(r=>r.pattern===a.state.objectPattern&&r.order===a.state.fillOrder&&r.sampling===a.state.samplingPattern&&r.ignoreDecay===a.state.ignoreDecay);
      check(!!b,'inverse reference');
      a.reconstructionError=Math.max(...a.image.pixels.flatMap((p,i)=>[Math.abs(p.value-b.pixels[i].real),Math.abs(p.residual-b.pixels[i].imaginary)]));
      check(a.reconstructionError<1e-10,label+' inverse image');
    }
    delete a.image.pixels;results.push({label,...a});
  }
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});await page.waitForTimeout(80);
    const buffer=await page.evaluate(()=>{const c=document.getElementById('scene');return {w:c.width,h:c.height,cw:c.clientWidth,ch:c.clientHeight,dpr:devicePixelRatio};});
    check(buffer.w===Math.round(buffer.cw*buffer.dpr)&&buffer.h===Math.round(buffer.ch*buffer.dpr),'resize backing store');
    await page.goto(root+'/docs/frequency_phase_encoding_visualization.html?qa='+Date.now());await capture(width+' initial');
    await page.locator('#observeFrequency').click();await capture(width+' frequency');
    await page.locator('.stage').screenshot({path:folder+'B04-frequency-'+width+'.png'});
    await page.locator('#observePhase').click();await capture(width+' phase after Gy');check((await page.locator('#signedPhaseOutput').textContent()).startsWith('-72.0'),'PE phase sign');
    await page.locator('.stage').screenshot({path:folder+'B04-phase-'+width+'.png'});
    const observation=await page.evaluate(()=>state.elapsed*state.speed);await set('speed',2.6);
    check(Math.abs((await page.evaluate(()=>state.elapsed*state.speed))-observation)<1e-12,'speed changed observation');await capture(width+' speed preserved');
    await page.locator('#showPhase').uncheck();await page.locator('#showPhase').check();check(Math.abs((await page.evaluate(()=>state.elapsed*state.speed))-observation)<1e-12,'display changed time');
    await page.locator('#observeNoPhase').click();await capture(width+' Gy zero');
    check((await page.locator('#iftOutput').textContent()).includes('y 정보 없음'),'Gy zero withholding');
    await page.locator('.stage').screenshot({path:folder+'B04-no-Gy-'+width+'.png'});
    await page.locator('#observeFull').click();await capture(width+' full');
    await page.locator('.stage').screenshot({path:folder+'B04-full-'+width+'.png'});
    for(const order of ['linear','centric','reverse','interleaved'])for(const sampling of ['full','center3','alternate','partialFourier'])for(const decayOff of [false,true]) {
      await page.locator('#fillOrder').selectOption(order);await page.locator('#samplingPattern').selectOption(sampling);
      if(decayOff)await page.locator('#ignoreDecay').check();else await page.locator('#ignoreDecay').uncheck();
      await finish();await capture(width+' '+order+' '+sampling+' decayOff='+decayOff);
    }
    await page.locator('#samplingPattern').selectOption('full');await page.locator('#fillOrder').selectOption('linear');await page.locator('#ignoreDecay').check();
    for(const pattern of ['center','uniform','diagonal','bars','spot']) {await page.locator('#objectPattern').selectOption(pattern);await finish();await capture(width+' pattern '+pattern);}
    await page.locator('#objectPattern').selectOption('uniform');await finish();
    check((await page.locator('#signalPhaseOutput').textContent()).includes('정의 안 됨'),'zero signal phase');
    await page.locator('#observeFull').click();await set('phaseDegrees',75);await finish();await capture(width+' unmatched ky');
    check((await page.locator('#iftOutput').textContent()).includes('격자 불일치'),'unmatched grid withholding');
    await page.locator('.stage').screenshot({path:folder+'B04-unmatched-'+width+'.png'});
    await page.locator('#observeFull').click();await page.locator('#ignoreDecay').uncheck();
    for(const t2 of [50,600]) {await set('t2starMs',t2);await finish();await capture(width+' T2star '+t2);await page.locator('.stage').screenshot({path:folder+'B04-T2star-'+t2+'-'+width+'.png'});}
    await page.locator('#reset').click();await page.locator('[data-mode="phase"]').click();
    await capture(width+' phase only start');await page.locator('#playPause').click();await page.waitForTimeout(100);await page.locator('#playPause').click();
    const stopped=await page.evaluate(()=>state.elapsed);await page.waitForTimeout(100);check((await page.evaluate(()=>state.elapsed))===stopped,'phase pause');
    await page.locator('#observeFull').click();await page.locator('#timeScrub').focus();await page.keyboard.press('Home');check((await page.evaluate(()=>state.elapsed))===0,'scrub Home');
    await page.keyboard.press('End');check((await page.evaluate(()=>currentFrame().stage))==='complete','scrub End');
    await page.locator('#quizYWrong').click();check((await page.locator('#quizYFeedback').textContent()).includes('칸 수'),'Y wrong feedback');
    await page.locator('#quizYCorrect').focus();await page.keyboard.press('Enter');check((await page.locator('#quizYFeedback').textContent()).includes('맞습니다'),'Y correct keyboard');
    await page.locator('#quizGridWrong').click();check((await page.locator('#quizGridFeedback').textContent()).includes('실제 ky'),'grid wrong feedback');
    await page.locator('#quizGridCorrect').click();check((await page.locator('#quizGridFeedback').textContent()).includes('75/72'),'grid correct feedback');
    await page.locator('#quizYFeedback').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B04-quiz-'+width+'.png'});
    await page.locator('#reset').click();check((await page.locator('#quizYFeedback').textContent()).includes('답을 선택'),'reset feedback');
    await page.locator('#learningPath').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B04-lesson-'+width+'.png'});
  }
  check(errors.length===0,'page errors: '+errors.join(' | '));return {browser:page.context().browser().version(),results,errors};
}
