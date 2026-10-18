async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});await page.goto(root);
  await page.locator('a[href="magic_angle_orientation.html"]').click();
  await page.getByRole('link',{name:'M01 · T2와 신호',exact:true}).click();
  await page.getByRole('link',{name:'X14 · 방향과 magic angle',exact:true}).click();
  await page.locator('a[href="verification/2026-10-18/X14-physics.html"]').click();
  const compact=await page.locator('.report-list summary').count()>0;
  if(compact){await page.locator('.report-list summary').click();if(await page.locator('.report-links a[aria-current="page"]').getAttribute('href')!=='X14-physics.html')throw Error('Report current link');}
  else if(await page.locator('nav a[href="X14-physics.html"]').count()!==1)throw Error('Inline report link');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Menu overflow');
  await page.screenshot({path:folder+'W63-report-menu-'+width+'.png'});
  if(compact)await page.locator('.report-list summary').click();
  await page.screenshot({path:folder+'W63-report-'+width+'.png'});
  results.push({width,portal:true,predecessor:true,report:true,reportNavigation:compact?'compact':'inline'});
}
return{browser:page.context().browser().version(),root,results};
}
