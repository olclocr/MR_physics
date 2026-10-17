async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));
await page.goto(root+'contrast_concentration_competition.html');
const refs=await page.evaluate(async()=>await(await fetch('verification/2026-10-17/X05-display-reference.json')).json());let maxGraphicError=0;
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});
  for(const ref of refs){
    for(const [id,key]of [['concentrationControl','concentrationMm'],['teControl','teMs'],['flipControl','flipDeg']])await page.locator('#'+id).selectOption(String(ref.options[key]));
    const r=await page.evaluate(ref=>{
      const fail=[],near=(a,b)=>{if(!Number.isFinite(a)||Math.abs(a-b)>5.1e-7)fail.push({a,b});};let graphicError=0;
      for(const [id,value]of [['t1Output',ref.current.t1Ms],['t2Output',ref.current.t2StarMs],['signalOutput',ref.current.signal],['referenceOutput',ref.current.t1Only],['baselineOutput',ref.baseline.signal],['ratioOutput',ref.current.ratio]])near(parseFloat(document.getElementById(id).textContent),value);
      const rows=[...document.querySelectorAll('#rows tr')];if(rows.length!==161)fail.push('Rows');
      for(let j=0;j<161;j++)for(const [k,value]of [ref.curve[j].concentrationMm,ref.curve[j].t1Ms,ref.curve[j].t2StarMs,ref.curve[j].signal,ref.curve[j].t1Only,ref.curve[j].ratio].entries())near(Number(rows[j].children[k].textContent),value);
      const selected=document.querySelectorAll('.current-row');if(selected.length!==1)fail.push('Selection');else near(Number(selected[0].children[0].textContent),ref.options.concentrationMm);
      const w=Number(document.getElementById('concentrationGraphic').getAttribute('viewBox').split(' ')[2]),span=w-60;
      for(const key of ['signal','t1Only']){
        const points=[...document.querySelector(`[data-curve="${key}"]`).points];if(points.length!==161)fail.push('Points');
        for(let j=0;j<161;j++)graphicError=Math.max(graphicError,Math.abs(points[j].x-(44+ref.curve[j].concentrationMm/4*span)),Math.abs(points[j].y-(210-ref.curve[j][key]/.5*180)));
        const dot=document.querySelector(`[data-current="${key}"]`);graphicError=Math.max(graphicError,Math.abs(Number(dot.getAttribute('cx'))-(44+ref.options.concentrationMm/4*span)),Math.abs(Number(dot.getAttribute('cy'))-(210-ref.current[key]/.5*180)));
      }
      if(graphicError>1e-4)fail.push({graphicError});return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
    },ref);
    if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,options:ref.options,...r}));maxGraphicError=Math.max(maxGraphicError,r.graphicError);results.push({width,...ref.options});
  }
  await page.locator('#concentrationControl').focus();await page.keyboard.press('Home');if(await page.locator('#concentrationControl').inputValue()!=='0')throw Error('Home');
  await page.keyboard.press('End');if(await page.locator('#concentrationControl').inputValue()!=='4')throw Error('End');
  await page.keyboard.press('ArrowUp');if(await page.locator('#concentrationControl').inputValue()!=='2')throw Error('Arrow');
  for(const id of ['quizSignalWrong','quizSignalCorrect','quizReferenceWrong','quizReferenceCorrect']){await page.locator('#'+id).click();const target=id.includes('Signal')?'signalFeedback':'referenceFeedback';if((await page.locator('#'+target).textContent()).includes('답을 선택'))throw Error('Quiz');}
  for(const [name,button]of [['base','reset'],['high','exampleHigh'],['long','exampleLong'],['low','exampleLowFlip']]){
    await page.locator('#'+button).click();const o=await page.evaluate(()=>window.lessonResult.options);
    if(o.concentrationMm!==(name==='high'||name==='long'?4:1)||o.teMs!==(name==='long'?16:8)||o.flipDeg!==(name==='low'?5:15))throw Error('Example');
    await page.locator('.layout').screenshot({path:folder+'X05-'+name+'-'+width+'.png'});
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
  }
  await page.locator('#exampleLong').click();await page.locator('#showCurrentRow').click();
  const region=page.getByRole('region',{name:'농도별 이완시간과 GRE 신호 원값 표'});
  const visible=await region.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.current-row').getBoundingClientRect();return b.top>=a.top-1&&b.bottom<=a.bottom+1;});if(!visible)throw Error('Selected row reveal');
  await region.focus();await page.keyboard.press('Home');await page.keyboard.press('PageDown');
  if(await region.evaluate(e=>e.scrollTop)<=0)throw Error('Vertical table scroll');
  if(width===390){await region.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await region.evaluate(e=>e.scrollLeft)<=0)throw Error('Horizontal table scroll');await region.screenshot({path:folder+'X05-table-right-390.png'});}
  await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#concentrationControl').inputValue()!=='1')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,keyboard:true,quiz:true,table:true,errors,results};
}
