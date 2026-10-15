async (page) => {
  const root='http://127.0.0.1:8766',evidence='docs/verification/2026-10-15/';
  const reference=await (await page.request.get(root+'/docs/verification/2026-10-15/B02-numerical.json')).json();
  const results=[],errors=[];page.on('pageerror',error=>errors.push(error.message));
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
  async function run(label,{flip=180,detune=0,b1=8,frame='rf',off=false,b0=1.5}={}) {
    await page.locator('#resetPulse').click();
    await set('flipControl',flip);await set('detuneControl',detune);await set('b1Control',b1);await set('b0Control',b0);await set('timeScaleControl',3);
    if(frame==='rf')await page.locator('[data-frame-mode="rf"]').click();
    if(off)await page.locator('#rfOffControl').check();
    await page.locator('#startPulse').click();await page.waitForFunction(()=>state.completed,null,{timeout:15000});
    const actual=await page.evaluate(()=>({state:{b0:state.b0,detuneHz:state.detuneHz,b1MicroT:state.b1MicroT,flipDeg:state.flipDeg,rfEnabled:state.rfEnabled,frameMode:state.frameMode},
      width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
      physics:currentPhysics(),metric:document.getElementById('magMetric').textContent,
      tilt:document.getElementById('actualFlipOutput').textContent,summary:document.getElementById('learningReadout').textContent,
      canvasLabel:document.getElementById('scene').getAttribute('aria-label'),log:(()=>{const log=JSON.parse(document.getElementById('verificationLog').value);return {status:log.status,conditions:log.conditions,formulaChecks:log.checks.formulaChecks,sampleCount:log.samples.length,lastM:log.samples.at(-1).m};})(),
      f0:document.getElementById('f0Output').textContent,rf:document.getElementById('rfOutput').textContent,
      nonblank:(()=>{const c=document.getElementById('scene');return c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0);})()}));
    const expected=reference.rows.find(r=>r.flipDeg===flip&&r.detuneHz===detune&&r.b1MicroT===b1&&r.frameMode===frame&&r.rfEnabled===!off);
    check(expected,label+': missing reference');
    const m=expected.reference,metric=actual.metric.split('/').map(Number),mxy=Math.hypot(m.x,m.y);
    check(Math.abs(metric[0]-m.z)<=.0005+1e-12&&Math.abs(metric[1]-mxy)<=.0005+1e-12,label+': normalized metrics');
    check(Math.abs(parseFloat(actual.tilt)-Math.acos(Math.max(-1,Math.min(1,m.z)))*180/Math.PI)<=.05+1e-6,label+': tilt');
    check(Math.hypot(actual.physics.m.x-m.x,actual.physics.m.y-m.y,actual.physics.m.z-m.z)<1e-8,label+': vector');
    check(actual.log.status==='completed'&&actual.log.conditions.rfEnabled===!off,label+': log');
    check(actual.width===actual.scrollWidth,label+': page overflow');
    check(actual.nonblank,label+': blank scene');
    check(Math.abs(parseFloat(actual.rf)-parseFloat(actual.f0)-detune/1e6)<1e-6+1e-10,label+': Hz/MHz display');
    results.push({label,...actual});
  }
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});await page.goto(root+'/docs/proton_spin_rf_larmor_resonance.html');
    for(const flip of [90,180,360])await run(width+' resonance '+flip,{flip,frame:'larmor'});
    await run(width+' positive offset',{detune:1000});
    await page.evaluate(()=>{document.querySelector('.sidebar').scrollTop=0;scrollTo(0,0);});
    await page.screenshot({path:evidence+'B02-offset-'+width+'.png'});
    await page.locator('.stage').screenshot({path:evidence+'B02-scene-'+width+'.png'});
    await run(width+' negative offset',{detune:-1000});
    await run(width+' larmor offset',{detune:1000,frame:'larmor'});
    await run(width+' stronger RF',{detune:1000,b1:30});
    await run(width+' RF OFF resonance',{off:true});
    await run(width+' RF OFF offset',{detune:1000,off:true});
    await page.locator('#learningReadout').scrollIntoViewIfNeeded();
    await page.screenshot({path:evidence+'B02-off-'+width+'.png'});
    await run(width+' B0 upper normalized',{b0:3});
    await run(width+' zero flip',{flip:0});
    await run(width+' extreme detuning',{detune:2000,b1:3,b0:.5});
    await page.locator('#resetPulse').click();
    // Pause is observation freeze, distinct from RF OFF.
    await page.locator('#startPulse').click();await page.waitForTimeout(120);await page.locator('#startPulse').click();
    const paused=await page.evaluate(()=>state.pulseTime);await page.waitForTimeout(150);
    check((await page.evaluate(()=>state.pulseTime))===paused,'pause changed time');
    await page.locator('#startPulse').click();await page.waitForFunction(()=>state.completed,null,{timeout:10000});
    await page.getByText('흔한 오개념과 확인',{exact:true}).click();
    await page.locator('#quizPositive').click();check((await page.locator('#rfQuizFeedback').textContent()).includes('다시 확인'),'wrong feedback');
    await page.locator('#quizNegative').focus();await page.keyboard.press('Enter');
    check((await page.locator('#rfQuizFeedback').textContent()).includes('맞습니다'),'right feedback');
    await page.locator('.lesson').nth(1).screenshot({path:evidence+'B02-lesson-'+width+'.png'});
    await page.locator('#resetPulse').focus();await page.keyboard.press('Enter');
    check((await page.locator('#rfQuizFeedback').textContent()).includes('답을 고르면'),'reset feedback');
    await page.locator('#detuneControl').focus();await page.keyboard.press('Home');check((await page.locator('#detuneControl').inputValue())==='-2000','offset Home');
    await page.keyboard.press('End');check((await page.locator('#detuneControl').inputValue())==='2000','offset End');
    await page.locator('#resetPulse').click();
    check(!(await page.locator('#rfOffControl').isChecked()),'reset RF');
  }
  return {browser:page.context().browser().version(),results,errors};
}
