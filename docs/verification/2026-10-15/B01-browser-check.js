async (page) => {
  const root='http://127.0.0.1:8766',folder='docs/verification/2026-10-15/';
  await page.route('**/*',route=>route.continue());
  const reference=await (await page.request.get(root+'/docs/verification/2026-10-15/B01-reference.json')).json();
  const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
  async function capture(label) {
    const a=await page.evaluate(()=>({state:{...state},results:currentResults(),
      p:document.getElementById('polarizationOutput').textContent,m0:document.getElementById('magnetizationOutput').textContent,
      lower:document.getElementById('lowerPopulation').textContent,upper:document.getElementById('upperPopulation').textContent,
      barWidth:parseFloat(document.getElementById('lowerBar').style.width),scale:document.getElementById('scaleNotice').textContent,
      phaseDescription:document.getElementById('phaseDescription').textContent,
      graph:document.getElementById('polarizationCurve').innerHTML,
      overflow:document.documentElement.scrollWidth>innerWidth}));
    const r=reference.rows.find(r=>r.b0===a.state.b0&&r.temperatureK===a.state.temperatureK);
    check(!!r,label+' reference');
    a.maxError=Math.abs(a.results.thermal.polarization-Number(r.polarization));
    check(a.maxError<1e-15,label+' polarization');check(Math.abs(parseFloat(a.p)-Number(r.polarization)*1e6)<=.00005+1e-12,label+' P display');
    check(Math.abs(parseFloat(a.lower)-Number(r.lower)*100)<=.0000005+1e-12,label+' lower display');
    check(Math.abs(parseFloat(a.upper)-Number(r.upper)*100)<=.0000005+1e-12,label+' upper display');
    check(Math.abs(parseFloat(a.m0)-Number(r.relativeM0))<=.00005+1e-12,label+' M0 display');
    // CSS serializes percentages with fewer significant digits than the model.
    check(Math.abs(a.barWidth-a.results.display.lowerPercent)<1e-4,label+' bar');
    check(a.graph.includes('polyline')&&!a.graph.includes('NaN')&&!a.overflow,label+' drawing/overflow');
    delete a.graph;results.push({label,...a});
  }
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});await page.goto(root+'/docs/spin_ensemble_equilibrium.html?qa='+Date.now());
    await capture(width+' initial');
    await page.screenshot({path:folder+'B01-initial-'+width+'.png'});
    for(const r of reference.rows) {await set('b0Control',r.b0);await set('temperatureControl',r.temperatureK);await capture(width+' '+r.b0+'T '+r.temperatureK+'K');}
    await page.locator('#reset').click();
    const before=await page.locator('#polarizationOutput').textContent();await page.locator('#magnifyControl').check();
    await capture(width+' magnified');check((await page.locator('#polarizationOutput').textContent())===before,'zoom altered P');
    await page.locator('#phaseControl').selectOption('aligned');await capture(width+' aligned');
    check((await page.evaluate(()=>currentResults().phase.magnitude))===1,'aligned R');
    check((await page.locator('#polarizationOutput').textContent())===before,'phase altered P');
    await page.locator('#thermalHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B01-magnified-'+width+'.png'});
    await page.locator('#phaseHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B01-phase-'+width+'.png'});
    await page.locator('#compareField').click();await capture(width+' 1.5T comparison');await page.locator('#compareField').click();await capture(width+' 3T comparison');
    await page.locator('#b0Control').focus();await page.keyboard.press('Home');check((await page.evaluate(()=>state.b0))===0,'B0 Home');
    await page.keyboard.press('End');check((await page.evaluate(()=>state.b0))===7,'B0 End');
    await page.locator('#temperatureControl').focus();await page.keyboard.press('Home');check((await page.evaluate(()=>state.temperatureK))===250,'T Home');
    await page.keyboard.press('End');check((await page.evaluate(()=>state.temperatureK))===400,'T End');
    await page.locator('#zeroWrong').click();check((await page.locator('#zeroFeedback').textContent()).includes('스핀은'),'zero wrong feedback');
    await page.locator('#zeroCorrect').focus();await page.keyboard.press('Enter');check((await page.locator('#zeroFeedback').textContent()).includes('맞습니다'),'zero correct keyboard');
    await page.locator('#fieldWrong').click();check((await page.locator('#fieldFeedback').textContent()).includes('1/2'),'field wrong feedback');
    await page.locator('#fieldCorrect').click();check((await page.locator('#fieldFeedback').textContent()).includes('약 두 배'),'field correct feedback');
    await page.locator('#quizHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B01-quiz-'+width+'.png'});
    await page.locator('#reset').focus();await page.keyboard.press('Enter');await capture(width+' reset');
    check(!(await page.locator('#magnifyControl').isChecked()),'reset zoom');check((await page.locator('#phaseControl').inputValue())==='distributed','reset phase');
    check((await page.locator('#zeroFeedback').textContent()).includes('답을 선택'),'reset feedback');
    await page.locator('#thermalHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B01-thermal-'+width+'.png'});
    await page.locator('#curveHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'B01-curve-'+width+'.png'});
  }
  check(errors.length===0,'page errors');return {browser:page.context().browser().version(),results,errors};
}
