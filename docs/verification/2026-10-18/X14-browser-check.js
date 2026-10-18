async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'magic_angle_orientation.html');const refs=await page.evaluate(async()=>await(await fetch('verification/2026-10-18/X14-display-reference.json')).json());let maxGraphicError=0;
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});
 for(const ref of refs){
  await page.locator('#angleControl').selectOption(ref.options.angle);await page.locator('#teControl').selectOption(String(ref.options.teMs));
  const r=await page.evaluate(ref=>{
   const fail=[],near=(a,b)=>{if(!Number.isFinite(a)||Math.abs(a-b)>5.1e-7)fail.push({a,b});};let graphicError=0;const p=ref.current;
   for(const [id,value]of [['angleOutput',p.angleDeg],['factorOutput',p.factor],['squaredOutput',p.factorSquared],['rateOutput',p.r2PerS],['t2Output',p.t2Ms],['signalOutput',p.signal]])near(parseFloat(document.getElementById(id).textContent),value);
   const table=[...ref.angleCurve,ref.magicPoint].sort((a,b)=>a.angleDeg-b.angleDeg),ar=[...document.querySelectorAll('#angleRows tr')],tr=[...document.querySelectorAll('#timeRows tr')];if(ar.length!==182||tr.length!==61)fail.push('Rows');
   for(let j=0;j<182;j++){const q=table[j];for(const [k,value]of [q.angleDeg,q.factor,q.factorSquared,q.r2PerS,q.t2Ms,q.signal].entries())near(Number(ar[j].children[k].textContent),value);}
   for(let j=0;j<61;j++)for(const [k,value]of [j,ref.timeCurve[j].signal,ref.timeCurve[j].isotropicSignal].entries())near(Number(tr[j].children[k].textContent),value);
   if(document.querySelectorAll('#angleRows .current-row').length!==1||document.querySelectorAll('#timeRows .current-row').length!==1)fail.push('Selected rows');near(Number(document.querySelector('#angleRows .current-row th').textContent),p.angleDeg);near(Number(document.querySelector('#timeRows .current-row th').textContent),ref.options.teMs);
   for(const [kind,data,key,maxX]of [['angle',ref.angleCurve,'angleDeg',90],['time',ref.timeCurve,'teMs',60]]){
    const w=Number(document.getElementById(kind+'Graphic').getAttribute('viewBox').split(' ')[2]),x=v=>44+v/maxX*(w-60),y=v=>210-v*180;
    for(const name of ['signal','isotropicSignal']){const pts=[...document.querySelector(`[data-${kind}="${name}"]`).points];if(pts.length!==data.length)fail.push('Points');for(let j=0;j<data.length;j++)graphicError=Math.max(graphicError,Math.abs(pts[j].x-x(data[j][key])),Math.abs(pts[j].y-y(data[j][name])));}
    const dot=document.querySelector(`[data-current="${kind}"]`);graphicError=Math.max(graphicError,Math.abs(Number(dot.getAttribute('cx'))-x(p[key])),Math.abs(Number(dot.getAttribute('cy'))-y(p.signal)));
   }
   const fiber=document.querySelector('[data-axis="fiber"]'),rad=p.angleDeg*Math.PI/180;graphicError=Math.max(graphicError,Math.abs(Number(fiber.getAttribute('x2'))-(140+100*Math.sin(rad))),Math.abs(Number(fiber.getAttribute('y2'))-(210-100*Math.cos(rad))));
   if(graphicError>1e-4)fail.push({graphicError});return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
  },ref);if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,options:ref.options,...r}));maxGraphicError=Math.max(maxGraphicError,r.graphicError);results.push({width,...ref.options});
 }
 await page.locator('#angleControl').focus();await page.keyboard.press('Home');if(await page.locator('#angleControl').inputValue()!=='0')throw Error('Home');await page.keyboard.press('End');if(await page.locator('#angleControl').inputValue()!=='90')throw Error('End');await page.keyboard.press('ArrowUp');if(await page.locator('#angleControl').inputValue()!=='70')throw Error('Arrow');
 for(const id of ['quizFloorWrong','quizFloorCorrect','quizTEWrong','quizTECorrect']){await page.locator('#'+id).click();const target=id.includes('Floor')?'floorFeedback':'teFeedback',value=await page.locator('#'+target).textContent();if(value.includes('답을 선택')||(id.endsWith('Correct')&&!value.startsWith('맞습니다.')))throw Error('Quiz');}
 for(const [name,button,angle,teMs]of [['base','reset','magic',2],['parallel','exampleParallel','0',2],['long','exampleLong','magic',40],['perpendicular','examplePerpendicular','90',2]]){
  await page.locator('#'+button).click();if(await page.locator('#angleControl').inputValue()!==angle||await page.locator('#teControl').inputValue()!==String(teMs))throw Error('Example');
  await page.evaluate(()=>window.scrollTo(0,document.querySelector('.layout').offsetTop-15));await page.screenshot({path:folder+'X14-'+name+'-'+width+'.png'});
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
 }
 await page.locator('#exampleLong').click();await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
 for(const name of ['각도별 인자 이완률 시간 신호 표','시간별 선택 방향과 가상 참조 신호 표']){const region=page.getByRole('region',{name});await region.focus();await region.evaluate(e=>e.scrollTop=e.scrollHeight);if(await region.evaluate(e=>e.scrollTop)<=0)throw Error('Table vertical');if(width===390){await region.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await region.evaluate(e=>e.scrollLeft)<=0)throw Error('Table horizontal');}}
 if(width===390){await page.getByRole('region',{name:'각도별 인자 이완률 시간 신호 표'}).screenshot({path:folder+'X14-table-right-390.png'});await page.evaluate(()=>window.scrollTo(0,document.querySelector('.layout section.card').getBoundingClientRect().top+scrollY-15));await page.screenshot({path:folder+'X14-viewport-reading-390.png'});}
 await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#angleControl').inputValue()!=='magic')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,keyboard:true,quiz:true,tables:true,errors,results};
}
