async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});await page.goto(root);
  await page.locator('a[href="complex_echo_water_fat_fit.html"]').click();
  await page.getByRole('link',{name:'M04 · Echo와 spectrum',exact:true}).click();
  await page.getByRole('link',{name:'M04 후속 · 복소echo 성분 추정',exact:true}).click();
  await page.locator('a[href="verification/2026-10-17/M04-fit-physics.html"]').click();
  await page.locator('.report-list summary').click();
  if(await page.locator('.report-links a[aria-current="page"]').getAttribute('href')!=='M04-fit-physics.html')throw Error('Report current link');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Menu overflow');
  await page.screenshot({path:folder+'W57-report-menu-'+width+'.png'});
  await page.locator('.report-list summary').click();
  await page.screenshot({path:folder+'W57-report-'+width+'.png'});
  results.push({width,portal:true,predecessor:true,report:true,reportMenu:true});
}
return{browser:page.context().browser().version(),root,results};
}
