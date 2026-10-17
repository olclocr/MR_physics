async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());
page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'finite_rf_slice_profile.html');
const refs=await page.evaluate(async()=>await(await fetch('verification/2026-10-17/G02-rf-display-reference.json')).json());
let maxGraphicError=0,maxChangeMs=0;
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});
  for(const ref of refs){
    const started=Date.now();
    for(const [id,key]of [['durationControl','durationMs'],['flipControl','flipDeg'],['gradientControl','gradientMilliTPerM']])await page.locator('#'+id).selectOption(String(ref.options[key]));
    maxChangeMs=Math.max(maxChangeMs,Date.now()-started);
    const r=await page.evaluate(ref=>{
      const fail=[],near=(a,b,t=2.1e-5)=>{if(Math.abs(a-b)>t)fail.push({a,b,t});};let graphicError=0;
      for(const [id,value,tolerance]of [['peakOutput',ref.peakB1MicroT,1.1e-5],['widthOutput',ref.nominalThicknessMm,5.1e-7],['areaOutput',ref.options.flipDeg,1e-4],['bandwidthOutput',4000/ref.options.durationMs,5.1e-7],['centerOutput',ref.profile[100].magnitude,2.1e-5],['mzOutput',ref.profile[100].z,2.1e-5]])near(parseFloat(document.getElementById(id).textContent),value,tolerance);
      const rows=[...document.querySelectorAll('#rows tr')];
      if(rows.length!==201)fail.push('row count');
      for(let j=0;j<201;j++)for(const [k,key]of ['zMm','offResHz','x','y','z','magnitude'].entries())near(Number(rows[j].children[k].textContent),ref.profile[j][key],key==='zMm'||key==='offResHz'?5.1e-7:2.1e-5);
      const w=document.getElementById('profileGraphic').viewBox.baseVal.width,span=w-16-44;
      for(const [key,component]of [['magnitude','magnitude'],['mz','z']]){
        const points=[...document.querySelector(`[data-curve="${key}"]`).points];
        for(let j=0;j<201;j++)graphicError=Math.max(graphicError,Math.abs(points[j].x-(44+(ref.profile[j].zMm+10)/20*span)),Math.abs(points[j].y-(210-(ref.profile[j][component]+1)/2*180)));
      }
      const waveform=[...document.querySelector('[data-curve="rf"]').points];
      for(let j=0;j<257;j++)graphicError=Math.max(graphicError,Math.abs(waveform[j].x-(44+ref.waveform[j].timeMs/8*span)),Math.abs(waveform[j].y-(210-(ref.waveform[j].b1MicroT+20)/40*180)));
      const ideal=document.querySelector('[data-ideal]').getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
      const leftEdge=44+(-ref.nominalThicknessMm/2+10)/20*span,rightEdge=44+(ref.nominalThicknessMm/2+10)/20*span,top=210-(Math.sin(ref.options.flipDeg*Math.PI/180)+1)/2*180;
      for(const [actual,expected]of [[ideal[2],leftEdge],[ideal[3],top],[ideal[4],rightEdge]])near(actual,expected,1e-6);
      if(graphicError>.002)fail.push({graphicError});
      return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
    },ref);
    if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,options:ref.options,...r}));
    maxGraphicError=Math.max(maxGraphicError,r.graphicError);results.push({width,...ref.options});
  }
  await page.locator('#gradientControl').focus();await page.keyboard.press('Home');if(await page.locator('#gradientControl').inputValue()!=='-10')throw Error('Home');
  await page.keyboard.press('End');if(await page.locator('#gradientControl').inputValue()!=='10')throw Error('End');
  await page.keyboard.press('ArrowUp');if(await page.locator('#gradientControl').inputValue()!=='5')throw Error('Arrow');
  for(const id of ['quizWidthWrong','quizWidthCorrect','quizFlipWrong','quizFlipCorrect']){await page.locator('#'+id).click();const target=id.includes('Width')?'widthFeedback':'flipFeedback';if((await page.locator('#'+target).textContent()).includes('답을 선택'))throw Error('Quiz');}
  for(const [name,button]of [['base','reset'],['long','exampleLong'],['gradient','exampleGradient'],['flip','exampleFlip']]){
    await page.locator('#'+button).click();const o=await page.evaluate(()=>window.lessonResult.options);
    if(o.durationMs!==(name==='long'?8:4)||o.flipDeg!==(name==='flip'?30:90)||o.gradientMilliTPerM!==(name==='gradient'?5:10))throw Error('Example');
    await page.locator('.layout').screenshot({path:folder+'G02-rf-'+name+'-'+width+'.png'});
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded');
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
  }
  if(width===390){const table=page.getByRole('region',{name:'위치별 주파수와 자화 원값 표'});await table.focus();await table.evaluate(e=>{e.scrollLeft=e.scrollWidth;e.scrollTop=e.scrollHeight;});if(await table.evaluate(e=>e.scrollLeft)<=0||await table.evaluate(e=>e.scrollTop)<=0)throw Error('Scroll');await table.screenshot({path:folder+'G02-rf-table-right-390.png'});}
  await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#durationControl').inputValue()!=='4')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));
return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,maxThreeSelectChangeMs:maxChangeMs,keyboard:true,quiz:true,errors,results};
}
