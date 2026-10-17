async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
for(const [width,height]of [[1920,1080],[390,844]]){
  await page.setViewportSize({width,height});
  await page.goto(root+'index.html');
  await page.locator('a[href="mrs_field_linewidth.html"]').click();
  if(!page.url().endsWith('/mrs_field_linewidth.html'))throw Error('Portal navigation');
  await page.getByRole('link',{name:'N03 · 관측 공간',exact:true}).click();
  await page.getByRole('link',{name:'N03 후속 · Field와 선폭',exact:true}).click();
  await page.locator('#exampleWide').click();
  if(!/20\.391945/.test(await page.locator('#widthOutput').textContent()))throw Error('Wide example');
  await page.locator('#reset').focus();await page.keyboard.press('Enter');
  if(!/10\.762501/.test(await page.locator('#widthOutput').textContent()))throw Error('Keyboard reset');
  await page.locator('a[href="verification/2026-10-17/N03-field-physics.html"]').click();
  await page.locator('.report-list summary').click();
  if(await page.locator('.report-links a[aria-current="page"]').getAttribute('href')!=='N03-field-physics.html')throw Error('Report current link');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report menu overflow');
  await page.screenshot({path:folder+'W54-report-menu-'+width+'.png'});
  results.push({width,height,portal:true,predecessor:true,report:true,reportMenu:true,example:true,keyboardReset:true});
}
if(errors.length)throw Error(JSON.stringify(errors));
return{browser:page.context().browser().version(),root,errors,results};
}
