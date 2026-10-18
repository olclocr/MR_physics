async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});await page.goto(root);
  await page.locator('a[href="dsc_signal_rate.html"]').click();
  await page.getByRole('link',{name:'M03 · T2*와 R2*',exact:true}).click();
  await page.getByRole('link',{name:'X06 · 신호비와 ΔR2* 변환',exact:true}).click();
  await page.locator('a[href="verification/2026-10-18/X06-physics.html"]').click();
  const compact=await page.locator('.report-list summary').count()>0;
  if(compact){await page.locator('.report-list summary').click();if(await page.locator('.report-links a[aria-current="page"]').getAttribute('href')!=='X06-physics.html')throw Error('Report current link');}
  else if(await page.locator('nav a[href="X06-physics.html"]').count()!==1)throw Error('Inline report link');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Menu overflow');
  await page.screenshot({path:folder+'W72-report-menu-'+width+'.png'});
  if(compact)await page.locator('.report-list summary').click();
  await page.screenshot({path:folder+'W72-report-'+width+'.png'});
  results.push({width,portal:true,predecessor:true,report:true,reportNavigation:compact?'compact':'inline'});
}
return{browser:page.context().browser().version(),root,results};
}
