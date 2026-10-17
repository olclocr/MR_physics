async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'hemorrhage_state_reading.html');
// Expected qualitative conditions were transcribed during H01-H06 source review,
// independently of the page data asset. These are not intensity simulations.
const expected=[{id:'intracellular',t1:'고신호 경향',t2:'뚜렷한 저신호 경향',evidence:'소규모 관찰과 해석',membranes:3},{id:'free-dense',t1:'고신호 경향',t2:'등신호 또는 약한 저신호 가능',evidence:'저자의 제안 포함',membranes:0},{id:'free-dilute',t1:'고신호 경향',t2:'고신호 경향',evidence:'소규모 관찰과 해석',membranes:0}];
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});
 for(const state of expected)for(const view of ['t1','t2','gre']){
  await page.locator('#stateControl').selectOption(state.id);await page.locator('#viewControl').selectOption(view);
  const r=await page.evaluate(({state,view,expected})=>{
   const fail=[],value=view==='gre'?'이 표에서 예측하지 않음':state[view];
   if(document.getElementById('findingOutput').textContent!==value)fail.push('Selected finding');if(document.getElementById('evidenceOutput').textContent!==state.evidence)fail.push('Evidence');if(!document.getElementById('timingOutput').textContent.includes('날짜를 계산하지 않음'))fail.push('Timing');
   const rows=[...document.querySelectorAll('#rows tr')];if(rows.length!==3)fail.push('Rows');
   for(const e of expected){const row=document.querySelector(`[data-state="${e.id}"]`);if(row.children[2].textContent!==e.t1||row.children[3].textContent!==e.t2||!row.children[4].textContent.includes(e.evidence))fail.push('Table');if(!row.children[4].textContent.includes(view==='gre'?'예측하지 않음':e[view]))fail.push('Table view');}
   if(document.querySelectorAll('.current-row').length!==1||document.querySelector('.current-row').getAttribute('data-state')!==state.id)fail.push('Selected row');
   const membranes=[...document.querySelectorAll('[data-membrane="cell"]')],dots=[...document.querySelectorAll('[data-met="symbol"]')];if(membranes.length!==state.membranes||!dots.length)fail.push('Symbols');
   if(state.id==='intracellular')for(const d of dots){const x=Number(d.getAttribute('cx')),y=Number(d.getAttribute('cy'));if(!membranes.some(m=>Math.hypot(x-Number(m.getAttribute('cx')),y-Number(m.getAttribute('cy')))+Number(d.getAttribute('r'))<=Number(m.getAttribute('r'))))fail.push('Compartment');}
   const sources=[...document.querySelectorAll('#sources a')].map(a=>a.href);if(!sources.includes('https://pubmed.ncbi.nlm.nih.gov/3257117/')||!sources.includes('https://pubs.rsna.org/doi/10.1148/radiology.157.1.4034983'))fail.push('Sources');
   return{fail,overflow:document.documentElement.scrollWidth>innerWidth};
  },{state,view,expected});if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,state:state.id,view,...r}));results.push({width,state:state.id,view});
 }
 await page.locator('#stateControl').focus();await page.keyboard.press('Home');if(await page.locator('#stateControl').inputValue()!=='intracellular')throw Error('Home');await page.keyboard.press('End');if(await page.locator('#stateControl').inputValue()!=='free-dilute')throw Error('End');await page.keyboard.press('ArrowUp');if(await page.locator('#stateControl').inputValue()!=='free-dense')throw Error('Arrow');
 for(const id of ['quizConditionWrong','quizConditionCorrect','quizTimeWrong','quizTimeCorrect']){await page.locator('#'+id).click();const target=id.includes('Condition')?'conditionFeedback':'timeFeedback';const text=await page.locator('#'+target).textContent();if(text.includes('답을 선택')||(id.endsWith('Correct')&&!text.startsWith('맞습니다.')))throw Error('Quiz');}
 for(const [name,button,s,v]of [['base','reset','intracellular','t2'],['t1','exampleT1','free-dilute','t1'],['dense','exampleDense','free-dense','t2'],['gre','exampleGRE','free-dilute','gre']]){
  await page.locator('#'+button).click();if(await page.locator('#stateControl').inputValue()!==s||await page.locator('#viewControl').inputValue()!==v)throw Error('Example');await page.locator('.layout').screenshot({path:folder+'X13-'+name+'-'+width+'.png'});
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
 }
 if(width===390){const region=page.getByRole('region',{name:'Methemoglobin 세 상태의 정성 근거 비교 표'});await region.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await region.evaluate(e=>e.scrollLeft)<=0)throw Error('Table scroll');await region.screenshot({path:folder+'X13-table-right-390.png'});}
 await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#stateControl').inputValue()!=='intracellular')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,keyboard:true,quiz:true,sources:true,qualitativeClaims:'H01-H06; no new quantitative model',errors,results};
}
