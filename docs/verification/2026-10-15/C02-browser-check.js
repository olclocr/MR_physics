async (page) => {
  const root='http://127.0.0.1:8766',folder='docs/verification/2026-10-15/';
  await page.route('**/*',route=>route.continue());
  const ref=await (await page.request.get(root+'/docs/verification/2026-10-15/C02-numerical.json')).json();
  const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const keys=['mode','teMs','t2Ms','gradientHz','balance','offResHz','spreadHz'];
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const set=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
  async function capture(label) {
    const a=await page.evaluate(()=>({state:{...state},result:results()[state.mode],signal:document.getElementById('signalOutput').textContent,
      phase:document.getElementById('phaseOutput').textContent,se:document.getElementById('seSignal').textContent,gre:document.getElementById('greSignal').textContent,
      physical:document.getElementById(state.mode+'Physical').textContent,effective:document.getElementById(state.mode+'Effective').textContent,
      areaZero:document.getElementById('areaZeroOutput').textContent,overflow:document.documentElement.scrollWidth>innerWidth,
      vectorBox:document.getElementById('vectorGraphic').getAttribute('viewBox'),curves:curve(),paths:document.querySelectorAll('#signalGraphic polyline').length,
      graphics:[...document.querySelectorAll('svg')].map(s=>({view:s.getAttribute('viewBox'),box:(()=>{const r=s.getBBox();return {x:r.x,y:r.y,w:r.width,h:r.height};})()}))}));
    const r=ref.rows.find(r=>keys.every(k=>r.options[k]===a.state[k])&&Math.abs(r.timeMs-a.state.timeMs)<1e-10);
    check(!!r,label+' independent reference');
    a.error=Math.max(Math.abs(a.result.m.x-r.reference.m.x),Math.abs(a.result.m.y-r.reference.m.y),Math.abs(a.result.magnitude-r.reference.magnitude));
    check(a.error<1e-11,label+' vector/signal');check(Math.abs(parseFloat(a.signal)-r.reference.magnitude)<=.00005+1e-12,label+' readout');
    check(Math.abs(parseFloat(a.physical)-a.result.physicalArea)<=.00005+1e-12&&Math.abs(parseFloat(a.effective)-a.result.effectiveArea)<=.00005+1e-12,label+' areas');
    check(!a.overflow&&a.paths===3,label+' layout/curves');
    const c=ref.curves.find(r=>keys.filter(k=>k!=='mode').every(k=>r.options[k]===a.state[k]));
    if(c){a.curveError=Math.max(...a.curves.flatMap((x,i)=>[Math.abs(x.se-c.values[i].se),Math.abs(x.gre-c.values[i].gre)]));check(a.curveError<1e-11,label+' independent curves');}
    delete a.curves;delete a.result.members;results.push({label,...a});
  }
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});await page.goto(root+'/docs/spin_gradient_echo.html?qa='+Date.now());
    for(const mode of ['se','gre']) {
      await page.locator('#'+mode+'Mode').click();
      for(const id of ['atStart','beforeRF','afterRF','atTE']){await page.locator('#'+id).click();await capture(width+' balanced '+mode+' '+id);}
    }
    await page.locator('#seMode').click();await page.locator('#atTE').click();
    await page.locator('#diagramHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'C02-balanced-'+width+'.png'});
    await page.locator('#sequenceGraphic').screenshot({path:folder+'C02-sequence-SE-'+width+'.png'});
    await page.locator('#vectorGraphic').screenshot({path:folder+'C02-balanced-vectors-'+width+'.png'});
    await page.locator('#exampleUnbalanced').click();await capture(width+' unbalanced');check((await page.locator('#areaZeroOutput').textContent()).includes('53.33'),'unbalanced area time');
    await page.locator('#signalGraphic').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'C02-unbalanced-'+width+'.png'});
    await page.locator('#exampleSpread').click();
    for(const mode of ['se','gre']){await page.locator('#'+mode+'Mode').click();for(const id of ['beforeRF','afterRF','atTE']){await page.locator('#'+id).click();await capture(width+' spread '+mode+' '+id);}}
    check(Number(await page.locator('#seSignal').textContent())>.6&&Number(await page.locator('#greSignal').textContent())<.1,'static distribution SE/GRE difference');
    await page.locator('#diagramHeading').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'C02-spread-'+width+'.png'});
    await page.locator('#sequenceGraphic').screenshot({path:folder+'C02-sequence-GRE-'+width+'.png'});
    await page.locator('#signalGraphic').screenshot({path:folder+'C02-spread-curve-'+width+'.png'});
    await page.locator('#vectorGraphic').screenshot({path:folder+'C02-vectors-'+width+'.png'});
    await page.locator('#exampleBalanced').click();await page.locator('#greMode').click();await set('offsetControl',35);await capture(width+' common offset');
    check((await page.locator('#greSignal').textContent())==='0.6065','common offset preserves magnitude');
    await page.locator('#seMode').click();await capture(width+' common offset SE');
    await page.locator('#exampleBalanced').click();
    for(const [id,property,min,max]of [['teControl','teMs',10,80],['t2Control','t2Ms',20,200],['gradientControl','gradientHz',0,40],['balanceControl','balance',0,2],['offsetControl','offResHz',-80,80],['spreadControl','spreadHz',0,60]]) {
      await page.locator('#exampleBalanced').click();await page.locator('#'+id).focus();await page.keyboard.press('Home');
      check((await page.evaluate(k=>state[k],property))===min,id+' Home');await page.locator('#atTE').click();await capture(width+' '+id+' minimum');
      await page.locator('#'+id).focus();await page.keyboard.press('End');check((await page.evaluate(k=>state[k],property))===max,id+' End');
      await page.locator('#atTE').click();await capture(width+' '+id+' maximum');
    }
    await page.locator('#exampleBalanced').click();await set('teControl',80);await set('t2Control',20);await set('gradientControl',40);await set('balanceControl',2);await set('offsetControl',80);await set('spreadControl',60);await page.locator('#atTE').click();
    for(const mode of ['se','gre']){await page.locator('#'+mode+'Mode').click();await capture(width+' combined extrema '+mode);}
    await page.locator('#timeControl').focus();await page.keyboard.press('End');await capture(width+' end of physical range');
    await page.keyboard.press('Home');await capture(width+' start of physical range');
    await page.locator('#quizEchoWrong').click();check((await page.locator('#quizEchoFeedback').textContent()).includes('T2'),'echo wrong feedback');
    await page.locator('#quizEchoCorrect').focus();await page.keyboard.press('Enter');check((await page.locator('#quizEchoFeedback').textContent()).includes('맞습니다'),'echo correct keyboard');
    await page.locator('#quizOffsetWrong').click();check((await page.locator('#quizOffsetFeedback').textContent()).includes('같은 시점'),'offset wrong feedback');
    await page.locator('#quizOffsetCorrect').click();check((await page.locator('#quizOffsetFeedback').textContent()).includes('위상 인자'),'offset correct feedback');
    await page.locator('#quizEchoFeedback').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'C02-quiz-'+width+'.png'});
    await page.locator('#reset').focus();await page.keyboard.press('Enter');await capture(width+' reset');check((await page.locator('#quizEchoFeedback').textContent()).includes('답을 선택'),'reset feedback');
    await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:folder+'C02-page-'+width+'.png'});
  }
  check(errors.length===0,errors.join(' | '));return {browser:page.context().browser().version(),results,errors};
}
