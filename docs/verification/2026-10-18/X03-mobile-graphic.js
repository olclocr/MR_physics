async(page)=>{
await page.route('http://127.0.0.1:8877/**',route=>route.continue());await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:8877/docs/phase_contrast_venc.html');await page.evaluate(()=>window.scrollTo(0,document.querySelector('#velocityGraphic').getBoundingClientRect().top+scrollY-40));await page.screenshot({path:'docs/verification/2026-10-18/X03-base-graphic-390.png'});return{width:390,defaultState:true,graphicVisible:true};
}
