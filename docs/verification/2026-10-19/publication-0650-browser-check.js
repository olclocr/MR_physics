async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-19/',errors=[],results=[];
await page.route(root+'**',route=>route.continue());page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));
await page.goto(root+'?checkpoint=0650-initialize');
const cases=await page.evaluate(async root=>await(await fetch(root+'verification/2026-10-19/publication-0650-cases.json')).json(),root);
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});let r=await page.goto(root+'?checkpoint=0650');if(r.status()!==200)throw Error('Portal');
 for(const [file]of cases)if(await page.locator('a[href="'+file+'"]').count()!==1)throw Error('Portal link '+file);
 for(const [file,report]of cases){
  r=await page.goto(root+file+'?checkpoint=0650');if(r.status()!==200)throw Error(file);
  const buttons=await page.locator('button[id^="example"]').evaluateAll(es=>es.map(e=>e.id));if(buttons.length!==3)throw Error('Example count '+file);
  for(const button of [null,...buttons]){
   if(button)await page.locator('#'+button).click();
   await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
   const state=await page.evaluate(()=>({outputs:[...document.querySelectorAll('output,[id$="Output"],#status')].map(e=>({id:e.id,text:e.textContent.trim()})),tableRows:document.querySelectorAll('tbody tr').length,overflow:document.documentElement.scrollWidth>innerWidth,graphics:[...document.querySelectorAll('svg[id]')].map(e=>({id:e.id,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))}));
   if(state.overflow||!state.outputs.length||state.graphics.some(g=>g.width<=0||g.height<=0))throw Error(JSON.stringify({file,width,button,state}));
   results.push({width,file,button,...state});
  }
  if(file==='two_pool_relaxation_rates.html'){await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));await page.evaluate(()=>window.scrollTo(0,document.querySelector('svg[id]').getBoundingClientRect().top+scrollY-15));await page.screenshot({path:folder+'publication-0650-rates-'+width+'.png'});}
  r=await page.goto(root+'verification/'+report);if(r.status()!==200||await page.locator('h1').count()!==1||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report '+report);results.push({width,file:report,report:true});
 }
 for(const file of ['W105-readability.html','W109-saturation-clarity.html','W112-svg-margins.html','publication-0650.html']){r=await page.goto(root+'verification/2026-10-19/'+file);if(r.status()!==200||await page.locator('h1').count()!==1||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report '+file);results.push({width,file,report:true});}
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,errors,results};
}
