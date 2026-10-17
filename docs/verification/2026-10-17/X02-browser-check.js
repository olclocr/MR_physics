async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'inflow_rf_saturation.html');
const refs=await page.evaluate(async()=>await(await fetch('verification/2026-10-17/X02-display-reference.json')).json());let maxGraphicError=0;
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});
 for(const ref of refs){
  for(const [id,key]of [['velocityControl','velocityCmS'],['trControl','trMs'],['flipControl','flipDeg']])await page.locator('#'+id).selectOption(String(ref.options[key]));
  for(const index of [0,59,119]){
   await page.locator('#depthControl').evaluate((e,i)=>{e.value=i;e.dispatchEvent(new Event('input',{bubbles:true}));},index);
   const r=await page.evaluate(({ref,index})=>{
    const fail=[],near=(a,b)=>{if(!Number.isFinite(a)||Math.abs(a-b)>5.1e-7)fail.push({a,b});};let graphicError=0;const p=ref.profile[index];
    for(const [id,value]of [['depthOutput',p.positionMm],['mzOutput',p.beforeRF],['signalOutput',p.signal],['staticOutput',ref.staticSignal],['ratioOutput',p.ratioToStatic],['meanOutput',ref.meanSignal]])near(parseFloat(document.getElementById(id).textContent),value);
    const count=document.getElementById('countOutput').textContent;if(p.previousRF===null?!count.includes('무한'):parseInt(count)!==p.previousRF)fail.push('Count');
    const rows=[...document.querySelectorAll('#rows tr')];if(rows.length!==120)fail.push('Rows');
    for(let j=0;j<120;j++){const q=ref.profile[j];near(Number(rows[j].children[0].textContent),q.positionMm);if(q.previousRF===null?rows[j].children[1].textContent!=='정상상태':Number(rows[j].children[1].textContent)!==q.previousRF)fail.push('Row count');for(const [k,value]of [q.beforeRF,q.signal,ref.staticSignal,q.ratioToStatic].entries())near(Number(rows[j].children[k+2].textContent),value);}
    if(!rows[index].classList.contains('current-row')||document.querySelectorAll('.current-row').length!==1)fail.push('Selected row');
    const w=Number(document.getElementById('profileGraphic').getAttribute('viewBox').split(' ')[2]),span=w-60,x=z=>44+z/30*span,y=s=>210-s*180,points=[...document.querySelector('[data-profile="signal"]').points];if(points.length!==240)fail.push('Points');
    for(let j=0;j<120;j++){
     const q=ref.profile[j];graphicError=Math.max(graphicError,Math.abs(points[2*j].x-x(j*.25)),Math.abs(points[2*j+1].x-x((j+1)*.25)),Math.abs(points[2*j].y-y(q.signal)),Math.abs(points[2*j+1].y-y(q.signal)));
     const bin=document.querySelector(`[data-bin="${j}"]`),gray=Math.round(255*q.signal);if(bin.getAttribute('fill')!==`rgb(${gray},${gray},${gray})`)fail.push('Gray');graphicError=Math.max(graphicError,Math.abs(Number(bin.getAttribute('x'))-(44+j/120*span)),Math.abs(Number(bin.getAttribute('width'))-(span/120+.02)));
    }
    for(const [key,value]of [['static',ref.staticSignal],['fresh',ref.freshSignal]]){const line=document.querySelector(`[data-reference="${key}"]`);graphicError=Math.max(graphicError,Math.abs(Number(line.getAttribute('y1'))-y(value)),Math.abs(Number(line.getAttribute('y2'))-y(value)));}
    const dot=document.querySelector('[data-current="signal"]');graphicError=Math.max(graphicError,Math.abs(Number(dot.getAttribute('cx'))-x(p.positionMm)),Math.abs(Number(dot.getAttribute('cy'))-y(p.signal)));
    if(graphicError>1e-4)fail.push({graphicError});return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
   },{ref,index});
   if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,options:ref.options,index,...r}));maxGraphicError=Math.max(maxGraphicError,r.graphicError);results.push({width,...ref.options,index});
  }
 }
 await page.locator('#velocityControl').focus();await page.keyboard.press('Home');if(await page.locator('#velocityControl').inputValue()!=='0')throw Error('Select Home');await page.keyboard.press('End');if(await page.locator('#velocityControl').inputValue()!=='20')throw Error('Select End');await page.keyboard.press('ArrowUp');if(await page.locator('#velocityControl').inputValue()!=='10')throw Error('Select Arrow');
 await page.locator('#depthControl').focus();await page.keyboard.press('Home');if(await page.locator('#depthControl').inputValue()!=='0')throw Error('Range Home');await page.keyboard.press('End');await page.keyboard.press('ArrowLeft');if(await page.locator('#depthControl').inputValue()!=='118')throw Error('Range Arrow');await page.locator('#depthControl').click();if(Math.abs(Number(await page.locator('#depthControl').inputValue())-59.5)>2)throw Error('Range click');
 for(const id of ['quizHistoryWrong','quizHistoryCorrect','quizScopeWrong','quizScopeCorrect']){await page.locator('#'+id).click();const target=id.includes('History')?'historyFeedback':'scopeFeedback';if((await page.locator('#'+target).textContent()).includes('답을 선택'))throw Error('Quiz');}
 for(const [name,button]of [['base','reset'],['entry','exampleEntry'],['slow','exampleSlow'],['large','exampleLarge']]){
  await page.locator('#'+button).click();const {options:o,index}=await page.evaluate(()=>({options:window.lessonResult.options,index:window.lessonIndex}));if(o.velocityCmS!==(name==='slow'?5:10)||o.trMs!==20||o.flipDeg!==(name==='large'?60:30)||index!==(name==='entry'?0:119))throw Error('Example');
  await page.locator('.layout').screenshot({path:folder+'X02-'+name+'-'+width+'.png'});await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
 }
 await page.locator('#showCurrentRow').click();const region=page.getByRole('region',{name:'깊이별 RF 이력과 자화 신호 표'});if(!await region.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.current-row').getBoundingClientRect();return b.top>=a.top-1&&b.bottom<=a.bottom+1;}))throw Error('Row reveal');
 if(width===390){await region.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await region.evaluate(e=>e.scrollLeft)<=0)throw Error('Table horizontal');await region.screenshot({path:folder+'X02-table-right-390.png'});}
 await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#flipControl').inputValue()!=='30')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,keyboard:true,range:true,quiz:true,table:true,errors,results};
}
