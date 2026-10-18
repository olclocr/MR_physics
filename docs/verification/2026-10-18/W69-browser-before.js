async(page)=>{
const phase='before',root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',results=[],errors=[];
await page.route(root+'**',route=>route.continue());
page.on('pageerror',e=>errors.push(e.message));
const cases=[
 {page:'contrast_concentration_competition.html',control:'concentrationControl',kind:'select',values:['0','2','4']},
 {page:'flow_gradient_phase.html',control:'timeControl',kind:'range',values:['0','100','200']},
 {page:'inflow_rf_saturation.html',control:'depthControl',kind:'range',values:['0','60','119']}
];
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});
 for(const c of cases){
  await page.goto(root+c.page);const region=page.locator('.table-scroll');
  for(const value of c.values)for(const edge of ['top','bottom']){
   if(c.kind==='select')await page.locator('#'+c.control).selectOption(value);
   else await page.locator('#'+c.control).evaluate((e,value)=>{e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));},value);
   await region.evaluate((e,edge)=>{e.scrollTop=edge==='top'?0:e.scrollHeight;e.scrollLeft=0;},edge);
   await page.locator('#showCurrentRow').focus();await page.keyboard.press('Enter');
   const r=await region.evaluate(async e=>{
    const a=e.getBoundingClientRect(),b=e.querySelector('.current-row').getBoundingClientRect(),h=e.querySelector('thead th').getBoundingClientRect();
    const bytes=new TextEncoder().encode(document.querySelector('#rows').textContent+'|'+document.querySelector('.metrics').textContent);
    const displaySha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
    return{rowTop:b.top,rowBottom:b.bottom,headerBottom:h.bottom,regionBottom:a.bottom,visible:b.top>=h.bottom-1&&b.bottom<=a.bottom+1,displaySha256,rowCount:e.querySelectorAll('tbody tr').length,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   results.push({page:c.page,width,value,edge,...r});
   if(r.overflow||phase==='after'&&!r.visible)throw Error(JSON.stringify(results.at(-1)));
   if(value===c.values[1]&&edge==='bottom'){
    await page.evaluate(()=>window.scrollTo(0,document.querySelector('.table-scroll').getBoundingClientRect().top+scrollY-20));
    await page.screenshot({path:folder+'W69-'+phase+'-'+c.page.replace('.html','')+'-'+width+'.png'});
   }
  }
  await page.locator('#'+c.control).focus();await page.keyboard.press('Home');
  if(await page.locator('#'+c.control).inputValue()!==c.values[0])throw Error('Keyboard Home');
  await page.keyboard.press('End');if(await page.locator('#'+c.control).inputValue()!==c.values[2])throw Error('Keyboard End');
  if(width===390){await region.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await region.evaluate(e=>e.scrollLeft)<=0)throw Error('Horizontal table scroll');}
 }
}
if(errors.length)throw Error(JSON.stringify(errors));
return{phase,browser:page.context().browser().version(),states:results.length,hidden:results.filter(r=>!r.visible).length,errors,results};
}
