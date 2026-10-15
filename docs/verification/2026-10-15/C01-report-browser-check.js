async (page) => {
  const results=[];
  for(const [width,height] of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:8766/docs/contrast_weighting.html');
    await page.locator('details').last().locator('summary').click();
    await page.getByRole('link',{name:'C01 물리 검증 기록',exact:true}).click();
    const metrics=await page.evaluate(()=>({title:document.title,width:document.documentElement.clientWidth,
      scrollWidth:document.documentElement.scrollWidth,tables:document.querySelectorAll('table').length,
      hasJudgment:document.body.textContent.includes('대상 버전 통과')}));
    if(metrics.width!==metrics.scrollWidth||!metrics.hasJudgment||metrics.tables!==3) throw new Error('Report layout/content mismatch: '+JSON.stringify(metrics));
    await page.screenshot({path:'docs/verification/2026-10-15/C01-report-'+width+'.png'});
    results.push({viewport:{width,height},url:page.url(),...metrics});
  }
  return results;
}
