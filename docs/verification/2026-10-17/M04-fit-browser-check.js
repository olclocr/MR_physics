async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
await page.route('http://127.0.0.1:8877/**',route=>route.continue());page.on('pageerror',e=>errors.push(e.message));
await page.goto(root+'complex_echo_water_fat_fit.html');
const refs=await page.evaluate(async()=>await(await fetch('verification/2026-10-17/M04-fit-display-reference.json')).json());let maxGraphicError=0;
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});
  for(const ref of refs){
    for(const [id,key]of [['fractionControl','fatDensityFraction'],['fieldControl','fieldHz'],['assumptionControl','assumption']])await page.locator('#'+id).selectOption(String(ref.options[key]));
    const r=await page.evaluate(ref=>{
      const fail=[],near=(a,b)=>{if(Math.abs(a-b)>5.1e-7)fail.push({a,b});};let graphicError=0;
      for(const [id,value]of [['waterOutput',ref.estimate.water],['fatOutput',ref.estimate.fat],['sumOutput',ref.estimate.coefficientSum],['fractionOutput',100*ref.estimate.estimatedFraction],['rmseOutput',ref.estimate.rmse],['biasOutput',100*ref.bias]])near(parseFloat(document.getElementById(id).textContent),value);
      const rows=[...document.querySelectorAll('#rows tr')];
      for(let j=0;j<6;j++)for(const [k,value]of [ref.rows[j].teMs,ref.rows[j].data.real,ref.rows[j].data.imaginary,ref.rows[j].predicted.real,ref.rows[j].predicted.imaginary,ref.rows[j].residual].entries())near(Number(rows[j].children[k].textContent),value);
      const w=Number(document.getElementById('coefficientGraphic').getAttribute('viewBox').split(' ')[2]),span=w-16-44;
      for(const [name,water,fat]of [['truth',1-ref.options.fatDensityFraction,ref.options.fatDensityFraction],['fit',ref.estimate.water,ref.estimate.fat]]){
        for(const [key,value]of [['water',water],['fat',fat]])graphicError=Math.max(graphicError,Math.abs(Number(document.querySelector(`[data-bar="${name}-${key}"]`).getAttribute('width'))-value/1.2*span));
        graphicError=Math.max(graphicError,Math.abs(Number(document.querySelector(`[data-bar="${name}-fat"]`).getAttribute('x'))-(44+water/1.2*span)));
      }
      for(const component of ['real','imaginary']){
        const points=[...document.querySelector(`[data-fit="${component}"]`).points];
        for(let j=0;j<6;j++){
          graphicError=Math.max(graphicError,Math.abs(points[j].x-(44+ref.rows[j].teMs/6*span)),Math.abs(points[j].y-(210-(ref.rows[j].predicted[component]+1.2)/2.4*180)));
          const circle=document.querySelector(`[data-echo="${j+1}"][data-component="${component}"]`);
          graphicError=Math.max(graphicError,Math.abs(Number(circle.getAttribute('cx'))-(44+ref.rows[j].teMs/6*span)),Math.abs(Number(circle.getAttribute('cy'))-(210-(ref.rows[j].data[component]+1.2)/2.4*180)));
        }
      }
      if(graphicError>1e-4)fail.push({graphicError});return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
    },ref);
    if(r.fail.length||r.overflow)throw Error(JSON.stringify({width,options:ref.options,...r}));maxGraphicError=Math.max(maxGraphicError,r.graphicError);results.push({width,...ref.options});
  }
  await page.locator('#fieldControl').focus();await page.keyboard.press('Home');if(await page.locator('#fieldControl').inputValue()!=='-60')throw Error('Home');
  await page.keyboard.press('End');if(await page.locator('#fieldControl').inputValue()!=='60')throw Error('End');
  await page.keyboard.press('ArrowUp');if(await page.locator('#fieldControl').inputValue()!=='0')throw Error('Arrow');
  for(const id of ['quizFieldWrong','quizFieldCorrect','quizModelWrong','quizModelCorrect']){await page.locator('#'+id).click();const target=id.includes('Field')?'fieldFeedback':'modelFeedback';if((await page.locator('#'+target).textContent()).includes('답을 선택'))throw Error('Quiz');}
  for(const [name,button]of [['base','reset'],['field','exampleField'],['single','exampleSingle'],['water','exampleWater']]){
    await page.locator('#'+button).click();const o=await page.evaluate(()=>window.lessonResult.options);
    if(o.fatDensityFraction!==(name==='water'?0:.3)||o.fieldHz!==(name==='field'?-60:60)||o.assumption!==(name==='single'||name==='water'?'single':'matched'))throw Error('Example');
    await page.locator('.layout').screenshot({path:folder+'M04-fit-'+name+'-'+width+'.png'});
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
  }
  if(width===390){const table=page.getByRole('region',{name:'여섯 복소 echo와 예측 잔차 표'});await table.focus();await table.evaluate(e=>e.scrollLeft=e.scrollWidth);if(await table.evaluate(e=>e.scrollLeft)<=0)throw Error('Table scroll');await table.screenshot({path:folder+'M04-fit-table-right-390.png'});}
  await page.locator('#reset').focus();await page.keyboard.press('Enter');if(await page.locator('#assumptionControl').inputValue()!=='matched')throw Error('Reset');
}
if(errors.length)throw Error(JSON.stringify(errors));return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,keyboard:true,quiz:true,errors,results};
}
