async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',results=[],errors=[];
await page.route(root+'**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));await page.goto(root+'blood_refocusing_limits.html');
const ref=await page.evaluate(async()=>await(await fetch('verification/2026-10-18/X13-refocusing-display-reference.json')).json());
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});await page.goto(root+'blood_refocusing_limits.html');
 for(const c of ref.cases)for(const view of ['original','gre']){
  await page.locator('#caseControl').selectOption(c.id);await page.locator('#viewControl').selectOption(view);
  const r=await page.evaluate(()=>({heading:document.querySelector('#caseHeading').textContent,quantity:document.querySelector('#quantityOutput').textContent,reading:document.querySelector('#readingOutput').textContent,source:document.querySelector('#claimSource').href,membranes:document.querySelectorAll('[data-membrane]').length,hb:document.querySelectorAll('[data-hb]').length,ferritin:document.querySelectorAll('[data-ferritin]').length,hemosiderin:document.querySelectorAll('[data-hemosiderin]').length,selected:document.querySelector('#rows .current-row').dataset.case,rows:[...document.querySelectorAll('#rows tr')].map(r=>({id:r.dataset.case,quantity:r.cells[2].textContent,finding:r.cells[3].textContent,reading:r.cells[4].textContent})),overflow:document.documentElement.scrollWidth>innerWidth}));
  for(const k of ['heading','quantity','source','membranes','hb','ferritin','hemosiderin'])if(r[k]!==c[k])throw Error(k+' '+c.id);
  if(r.reading!==(view==='original'?c.finding:ref.greReading)||r.selected!==c.id||r.overflow)throw Error('Reading/current/overflow');
  for(const [i,row]of r.rows.entries()){const q=ref.cases[i];if(row.id!==q.id||row.quantity!==q.quantity||row.finding!==q.finding||row.reading!==(view==='original'?q.finding:ref.greReading))throw Error('Original table changed');}
  results.push({width,case:c.id,view,...r});
 }
 await page.locator('#caseControl').focus();await page.keyboard.press('Home');if(await page.locator('#caseControl').inputValue()!=='oxy')throw Error('Case Home');await page.keyboard.press('End');if(await page.locator('#caseControl').inputValue()!=='storage')throw Error('Case End');await page.keyboard.press('ArrowUp');if(await page.locator('#caseControl').inputValue()!=='lysate')throw Error('Case arrow');
 await page.locator('#viewControl').focus();await page.keyboard.press('Home');if(await page.locator('#viewControl').inputValue()!=='original')throw Error('View Home');await page.keyboard.press('End');if(await page.locator('#viewControl').inputValue()!=='gre')throw Error('View End');
 for(const [name,id,c,v]of [['deoxy','reset','deoxy','original'],['oxy','exampleOxy','oxy','original'],['lysate','exampleLysate','lysate','original'],['storage','exampleStorage','storage','gre']]){
  await page.locator('#'+id).click();if(await page.locator('#caseControl').inputValue()!==c||await page.locator('#viewControl').inputValue()!==v)throw Error('Example');
  await page.evaluate(()=>window.scrollTo(0,document.querySelector('.layout').offsetTop-15));await page.screenshot({path:folder+'X13-refocusing-'+name+'-'+width+'.png'});
  if(width===390&&name==='storage'){await page.evaluate(()=>window.scrollTo(0,document.querySelector('.metrics').getBoundingClientRect().top+scrollY-15));await page.screenshot({path:folder+'X13-refocusing-storage-reading-390.png'});}
 }
 for(const id of ['quizLysateWrong','quizLysateCorrect','quizTransferWrong','quizTransferCorrect']){await page.locator('#'+id).click();const t=await page.locator(id.includes('Lysate')?'#lysateFeedback':'#transferFeedback').textContent();if(t.includes('답을 선택')||id.endsWith('Correct')&&!t.startsWith('맞습니다.'))throw Error('Quiz');}
 await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');
 const table=page.locator('.table-scroll');if(width===390){await table.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await table.evaluate(e=>e.scrollLeft)<=0)throw Error('Table scroll');await table.screenshot({path:folder+'X13-refocusing-table-right-390.png'});}
 await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#caseControl').inputValue()!=='deoxy'||await page.locator('#viewControl').inputValue()!=='original')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,table:true,keyboard:true,examples:true,quiz:true,errors,results};
}
