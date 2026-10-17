async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'flow_gradient_phase.html');
const refs=await page.evaluate(async()=>await(await fetch('verification/2026-10-17/X01-display-reference.json')).json());let maxGraphicError=0;
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});
 for(const ref of refs){
  for(const [id,key]of [['velocityControl','velocityCmS'],['durationControl','lobeMs'],['polarityControl','polarity']])await page.locator('#'+id).selectOption(String(ref.options[key]));
  for(const index of [0,50,100,150,200]){
   await page.locator('#timeControl').evaluate((e,i)=>{e.value=i;e.dispatchEvent(new Event('input',{bubbles:true}));},index);
   const r=await page.evaluate(({ref,index})=>{
    const fail=[],near=(a,b)=>{if(!Number.isFinite(a)||Math.abs(a-b)>5.1e-7)fail.push({a,b});};let graphicError=0;const p=ref.curve[index];
    for(const [id,value]of [['timeOutput',p.timeMs],['a0Output',ref.end.moment0*1e6],['a1Output',ref.end.moment1*1e9],['phaseOutput',p.phase],['stationaryOutput',p.phaseStationary],['magnitudeOutput',p.magnitude]])near(parseFloat(document.getElementById(id).textContent),value);
    const complex=document.getElementById('complexOutput').textContent.match(/-?\d+\.\d+/g).map(Number);near(complex[0],p.real);near(complex[1],p.imaginary);
    near(Number(document.getElementById('positionOutput').textContent.match(/위치 (\S+)mm/)[1]),p.positionMm);
    const rows=[...document.querySelectorAll('#rows tr')];if(rows.length!==201)fail.push('Rows');
    for(let j=0;j<=200;j++){const q=ref.curve[j];for(const [k,value]of [q.timeMs,q.positionMm,q.gradientMtM,q.moment0*1e6,q.moment1*1e9,q.phase,q.phaseStationary,q.real,q.imaginary,q.magnitude].entries())near(Number(rows[j].children[k].textContent),value);}
    if(!rows[index].classList.contains('current-row')||document.querySelectorAll('.current-row').length!==1)fail.push('Selected row');
    const svg=document.getElementById('phaseGraphic'),w=Number(svg.getAttribute('viewBox').split(' ')[2]),x=t=>44+t/6*(w-60),y=v=>110-v/2*75;
    for(const key of ['phase','phaseStationary']){
     const points=[...document.querySelector(`[data-phase="${key}"]`).points];if(points.length!==201)fail.push('Points');
     for(let j=0;j<=200;j++)graphicError=Math.max(graphicError,Math.abs(points[j].x-x(ref.curve[j].timeMs)),Math.abs(points[j].y-y(ref.curve[j][key])));
     const dot=document.querySelector(`[data-current="${key}"]`);graphicError=Math.max(graphicError,Math.abs(Number(dot.getAttribute('cx'))-x(p.timeMs)),Math.abs(Number(dot.getAttribute('cy'))-y(p[key])));
    }
    const tau=ref.options.lobeMs,g=ref.options.polarity*2,wave=[...document.querySelector('[data-gradient="wave"]').points];
    for(const [j,q]of [[0,0],[0,g],[tau,g],[tau,-g],[2*tau,-g],[2*tau,0]].entries())graphicError=Math.max(graphicError,Math.abs(wave[j].x-x(q[0])),Math.abs(wave[j].y-y(q[1])));
    for(const [name,re,im]of [['moving',p.real,p.imaginary],['stationary',p.stationaryReal,p.stationaryImaginary]]){const line=document.querySelector(`[data-vector="${name}"]`);graphicError=Math.max(graphicError,Math.abs(Number(line.getAttribute('x2'))-(140+100*re)),Math.abs(Number(line.getAttribute('y2'))-(140-100*im)));}
    if(graphicError>1e-4)fail.push({graphicError});return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
   },{ref,index});
   if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,options:ref.options,index,...r}));maxGraphicError=Math.max(maxGraphicError,r.graphicError);results.push({width,...ref.options,index});
  }
 }
 await page.locator('#velocityControl').focus();await page.keyboard.press('Home');if(await page.locator('#velocityControl').inputValue()!=='-10')throw Error('Select Home');await page.keyboard.press('End');if(await page.locator('#velocityControl').inputValue()!=='10')throw Error('Select End');await page.keyboard.press('ArrowUp');if(await page.locator('#velocityControl').inputValue()!=='0')throw Error('Select Arrow');
 await page.locator('#timeControl').focus();await page.keyboard.press('Home');if(await page.locator('#timeControl').inputValue()!=='0')throw Error('Range Home');await page.keyboard.press('End');await page.keyboard.press('ArrowLeft');if(await page.locator('#timeControl').inputValue()!=='199')throw Error('Range Arrow');
 await page.locator('#timeControl').click();const middle=Number(await page.locator('#timeControl').inputValue());if(Math.abs(middle-100)>2)throw Error('Range click');
 for(const id of ['quizMomentWrong','quizMomentCorrect','quizNormWrong','quizNormCorrect']){await page.locator('#'+id).click();const target=id.includes('Moment')?'momentFeedback':'normFeedback';if((await page.locator('#'+target).textContent()).includes('답을 선택'))throw Error('Quiz');}
 for(const [name,button]of [['base','reset'],['stationary','exampleStationary'],['long','exampleLong'],['reverse','exampleReverse']]){
  await page.locator('#'+button).click();const o=await page.evaluate(()=>window.lessonResult.options);if(o.velocityCmS!==(name==='stationary'?0:10)||o.lobeMs!==(name==='long'?3:2)||o.polarity!==(name==='reverse'?-1:1))throw Error('Example');
  await page.locator('.layout').screenshot({path:folder+'X01-'+name+'-'+width+'.png'});
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
 }
 await page.locator('#showCurrentRow').click();const region=page.getByRole('region',{name:'시간별 위치 moment 위상 복소 자화 표'});
 if(!await region.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.current-row').getBoundingClientRect();return b.top>=a.top-1&&b.bottom<=a.bottom+1;}))throw Error('Row reveal');
 if(width===390){await region.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await region.evaluate(e=>e.scrollLeft)<=0)throw Error('Table horizontal');await region.screenshot({path:folder+'X01-table-right-390.png'});}
 await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#polarityControl').inputValue()!=='1')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,keyboard:true,range:true,quiz:true,table:true,errors,results};
}
