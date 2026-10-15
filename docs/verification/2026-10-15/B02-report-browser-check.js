async (page) => {
  const results=[];
  for(const [width,height] of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:8766/docs/proton_spin_rf_larmor_resonance.html');
    await page.getByText('가정·정규화·다음 학습',{exact:true}).click();
    await page.getByRole('link',{name:'검증 기록',exact:true}).click();
    const metrics=await page.evaluate(()=>({title:document.title,width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,tables:document.querySelectorAll('table').length}));
    if(metrics.width!==metrics.scrollWidth||metrics.tables!==2)throw Error(JSON.stringify(metrics));
    await page.screenshot({path:'docs/verification/2026-10-15/B02-report-'+width+'.png'});
    results.push({viewport:{width,height},...metrics,url:page.url()});
  }
  return results;
}
