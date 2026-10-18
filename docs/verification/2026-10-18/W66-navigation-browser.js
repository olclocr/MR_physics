async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-18/',results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});await page.goto(root);
  await page.locator('a[href="phase_contrast_venc.html"]').click();
  await page.getByRole('link',{name:'X01 후속 · 두 속도의 복소합',exact:true}).click();
  await page.getByRole('link',{name:'X03 · 위상차와 VENC',exact:true}).click();
  await page.locator('a[href="verification/2026-10-18/X03-physics.html"]').click();
  const compact=await page.locator('.report-list summary').count()>0;
  if(compact){await page.locator('.report-list summary').click();if(await page.locator('.report-links a[aria-current="page"]').getAttribute('href')!=='X03-physics.html')throw Error('Report current link');}
  else if(await page.locator('nav a[href="X03-physics.html"]').count()!==1)throw Error('Inline report link');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Menu overflow');
  await page.screenshot({path:folder+'W66-report-menu-'+width+'.png'});
  if(compact)await page.locator('.report-list summary').click();
  await page.screenshot({path:folder+'W66-report-'+width+'.png'});
  results.push({width,portal:true,predecessor:true,report:true,reportNavigation:compact?'compact':'inline'});
}
return{browser:page.context().browser().version(),root,results};
}
