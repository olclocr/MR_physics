async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-19/',errors=[],results=[];
await page.route(root+'**',route=>route.continue());page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));
const cases=[["signal_window_log.html","X06-window"],["absorbed_power_energy.html","X16-power"],["saturating_dipole_work.html","X16-saturation"],["label_postarrival_outflow.html","X08-outflow"],["rigid_transform_order.html","X17-order"],["thermal_input_timing.html","X16-thermal"],["compartment_input_scale.html","X07-scale"],["vascular_ees_components.html","X07-vascular"],["axis_scale_area.html","X17-scale"],["assumed_pixel_spacing.html","X17-spacing"],["ir_phase_reference.html","X11-phase"],["translation_fit_residual.html","X17-residual"]];
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});let r=await page.goto(root+'?checkpoint=0145');if(r.status()!==200)throw Error('Portal');
 for(const [file]of cases)if(await page.locator('a[href="'+file+'"]').count()!==1)throw Error('Portal link '+file);
 for(const [file,id]of cases){
  r=await page.goto(root+file+'?checkpoint=0145');if(r.status()!==200)throw Error(file);
  const buttons=await page.locator('button[id^="example"]').evaluateAll(es=>es.map(e=>e.id));
  for(const button of [null,...buttons]){
   if(button)await page.locator('#'+button).click();
   await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
   const state=await page.evaluate(()=>({outputs:[...document.querySelectorAll('output,[id$="Output"],#status')].map(e=>({id:e.id,text:e.textContent.trim()})),tableRows:document.querySelectorAll('tbody tr').length,overflow:document.documentElement.scrollWidth>innerWidth,graphics:[...document.querySelectorAll('svg[id]')].map(e=>({id:e.id,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))}));
   if(state.overflow||!state.outputs.length||state.graphics.some(g=>g.width<=0||g.height<=0))throw Error(JSON.stringify({file,width,button,state}));
   results.push({width,file,button,...state});
  }
  if(id==='X17-residual'){await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));await page.evaluate(()=>window.scrollTo(0,document.querySelector('svg[id]').getBoundingClientRect().top+scrollY-15));await page.screenshot({path:folder+'publication-0145-X17-residual-'+width+'.png'});}
  r=await page.goto(root+'verification/2026-10-18/'+id+'-physics.html');if(r.status()!==200||await page.locator('h1').count()!==1||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report '+id);results.push({width,file:id+'-physics.html',report:true});
 }
}
for(const width of [1920,390]){await page.setViewportSize({width,height:width===390?844:1080});const response=await page.goto(root+'verification/2026-10-19/publication-0145.html');if(response.status()!==200||await page.locator('h1').count()!==1||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Editorial report');results.push({width,file:'publication-0145.html',report:true});}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,errors,results};
}
