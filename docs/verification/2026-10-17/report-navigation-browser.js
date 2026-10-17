async(page)=>{
 const root='http://127.0.0.1:8767/docs/verification/2026-10-16/',folder='docs/verification/2026-10-17/',results=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});
  await page.goto(root+'Q06-physics.html');
  const initial=await page.locator('h1').boundingBox();
  if(initial.y>250)throw Error('Heading '+initial.y);
  await page.locator('.report-list summary').focus();await page.keyboard.press('Enter');
  if(!await page.locator('.report-list').evaluate(e=>e.open))throw Error('Keyboard expand');
  if(await page.locator('.report-links a[aria-current="page"]').getAttribute('href')!=='Q06-physics.html')throw Error('Current link');
  await page.locator('.report-links').screenshot({path:folder+'report-nav-expanded-'+width+'.png'});
  await page.locator('.report-links a[href="Q05-physics.html"]').click();
  if(!page.url().endsWith('Q05-physics.html'))throw Error('Link');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw Error('Overflow');
  await page.screenshot({path:folder+'report-nav-'+width+'.png'});
  results.push({width,headingTop:initial.y,keyboard:true,currentLink:true,navigation:true,overflow});
 }
 if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),results,errors};
}
