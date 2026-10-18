async(page)=>{
const root='https://olclocr.github.io/MR_physics/',folder='docs/verification/2026-10-18/',errors=[],results=[];
await page.route('https://olclocr.github.io/**',route=>route.continue());page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}));let sourceURL;
const cases=[['ecv_r1_partition.html','M02-ecv','exampleZero','ecvOutput','정의 불가'],['finite_rf_slice_profile.html','G02-rf',null,'widthOutput',2.348659],['complex_echo_water_fat_fit.html','M04-fit','exampleSingle','fractionOutput',23.307486],['contrast_concentration_competition.html','X05','exampleLong','signalOutput',.044493],['flow_gradient_phase.html','X01','exampleLong','phaseOutput',.481540],['inflow_rf_saturation.html','X02','exampleLarge','signalOutput',.028203],['hemorrhage_state_reading.html','X13','exampleDense','findingOutput','등신호 또는 약한 저신호 가능']];
for(const width of [1920,390]){
 await page.setViewportSize({width,height:width===390?844:1080});let response=await page.goto(root+'?checkpoint=a734a1b');if(response.status()!==200)throw Error('Portal');
 for(const [file]of cases)if(await page.locator('a[href="'+file+'"]').count()!==1)throw Error('Portal link: '+file);
 for(const [file,id,button,output,expected]of cases){
  response=await page.goto(root+file+'?checkpoint=a734a1b');if(response.status()!==200)throw Error(file+': '+response.status());if(button)await page.locator('#'+button).click();
  const actual=await page.locator('#'+output).textContent();if(typeof expected==='number'?Math.abs(parseFloat(actual)-expected)>1e-6:actual!==expected)throw Error(JSON.stringify({file,expected,actual}));
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+file);results.push({width,file,status:response.status(),example:button,actual});
  if(id==='X13'){await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));await page.evaluate(()=>window.scrollTo(0,document.getElementById('stateHeading').getBoundingClientRect().top+scrollY-15));await page.screenshot({path:folder+'publication-0105-public-X13-'+width+'.png'});}
  const report='verification/2026-10-17/'+id+'-physics.html';await page.locator('a[href="'+report+'"]').click();if(await page.locator('h1').count()!==1||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report '+id);
  if(id==='X05'&&!sourceURL)sourceURL=await page.locator('a[href^="https://github.com/olclocr/MR_physics/blob/main/tests/"]').first().getAttribute('href');results.push({width,file:report,report:true});
 }
}
const sourceResponse=await page.goto(sourceURL);if(sourceResponse.status()!==200)throw Error('Public source '+sourceResponse.status());if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,commit:'a734a1b6b1e091ca09d0a7fea09b1666d2e072f4',states:results.length,portalWidths:[1920,390],sourceURL,sourceStatus:sourceResponse.status(),errors,results};
}
