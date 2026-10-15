async (page) => {
  const results=[];
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:8766/docs/frequency_phase_encoding_visualization.html?qa=report-'+Date.now());
    await page.getByText('모형의 범위와 출처',{exact:true}).click();
    await page.getByRole('link',{name:'B04 물리 검증 기록',exact:true}).click();
    const a=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,tables:document.querySelectorAll('table').length}));
    if(a.width!==a.scrollWidth||a.tables!==2)throw Error(JSON.stringify(a));
    await page.screenshot({path:'docs/verification/2026-10-15/B04-report-'+width+'.png'});
    results.push({viewport:{width,height},...a,url:page.url()});
  }
  return results;
}
