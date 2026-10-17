async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/';
const target='https://github.com/olclocr/MR_physics/blob/main/tests/helpers/mrs-field-distribution-reference.cjs';
const results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});
  const response=await page.goto(root+'verification/2026-10-17/N03-field-physics.html');
  const link=page.locator('a[href="'+target+'"]');
  if(await link.count()!==1)throw Error('Source anchor missing');
  await link.scrollIntoViewIfNeeded();
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report overflow');
  await page.screenshot({path:folder+'W59-source-link-'+width+'.png'});
  results.push({width,reportStatus:response.status(),sourceHref:await link.getAttribute('href')});
}
let sourceStatus=null;
page.on('response',r=>{if(r.url()===target)sourceStatus=r.status();});
await page.locator('a[href="'+target+'"]').click();
if(page.url()!==target||sourceStatus!==200)throw Error(JSON.stringify({url:page.url(),sourceStatus}));
return{browser:page.context().browser().version(),results,sourceStatus,sourceUrl:page.url(),sourceTitle:await page.title()};
}
