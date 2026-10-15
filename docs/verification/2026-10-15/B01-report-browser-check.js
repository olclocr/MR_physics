async (page) => {
  const results=[];
  for(const [width,height]of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:8766/docs/proton_spin_rf_larmor_resonance.html?qa=b01-links-'+Date.now());
    await page.getByText('선행 기호와 단위',{exact:true}).click();
    await page.getByRole('link',{name:'B01 스핀·순자화와 열평형',exact:true}).click();
    if(!(await page.title()).includes('열평형'))throw Error('B02 predecessor navigation');
    await page.getByText('가정·상수·출처',{exact:true}).click();
    await page.getByRole('link',{name:'B01 물리 검증 기록',exact:true}).click();
    const a=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,tables:document.querySelectorAll('table').length}));
    if(a.width!==a.scrollWidth||a.tables!==2)throw Error(JSON.stringify(a));
    await page.screenshot({path:'docs/verification/2026-10-15/B01-report-'+width+'.png'});
    results.push({viewport:{width,height},...a,url:page.url()});
  }
  return results;
}
