async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',errors=[],results=[];
await page.route(root+'**',route=>route.continue());page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));
const cases=[["polynomial_field_basis.html","X15-basis"],["compartment_input_washout.html","X07"],["label_arrival_decay.html","X08"],["diffusion_tensor_direction.html","X12"],["diffusion_tensor_mixture.html","X12-mixture"],["linear_field_correction.html","X15"]];
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});let r=await page.goto(root+'?checkpoint=1155');if(r.status()!==200)throw Error('Portal');
 for(const [file]of cases)if(await page.locator('a[href="'+file+'"]').count()!==1)throw Error('Portal link '+file);
 for(const [file,id]of cases){
  r=await page.goto(root+file+'?checkpoint=1155');if(r.status()!==200)throw Error(file);
  const buttons=await page.locator('button[id^="example"]').evaluateAll(es=>es.map(e=>e.id));
  for(const button of [null,...buttons]){
   if(button)await page.locator('#'+button).click();
   await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
   const state=await page.evaluate(()=>({outputs:[...document.querySelectorAll('output,[id$="Output"],#status')].map(e=>({id:e.id,text:e.textContent.trim()})),tableRows:document.querySelectorAll('tbody tr').length,overflow:document.documentElement.scrollWidth>innerWidth,graphics:[...document.querySelectorAll('svg[id]')].map(e=>({id:e.id,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))}));
   if(state.overflow||!state.outputs.length||state.graphics.some(g=>g.width<=0||g.height<=0))throw Error(JSON.stringify({file,width,button,state}));
   results.push({width,file,button,...state});
  }
  if(id==='X12-mixture'){await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));await page.evaluate(()=>window.scrollTo(0,document.querySelector('svg[id]').getBoundingClientRect().top+scrollY-15));await page.screenshot({path:folder+'publication-1155-X12-mixture-'+width+'.png'});}
  r=await page.goto(root+'verification/2026-10-18/'+id+'-physics.html');if(r.status()!==200||await page.locator('h1').count()!==1||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report '+id);results.push({width,file:id+'-physics.html',report:true});
 }
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,errors,results};
}
