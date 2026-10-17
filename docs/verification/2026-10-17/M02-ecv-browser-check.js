async(page)=>{
const root='http://127.0.0.1:8877/docs/',folder='docs/verification/2026-10-17/',errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(root+'ecv_r1_partition.html');
const references=await page.evaluate(async()=>await(await fetch('verification/2026-10-17/M02-ecv-display-reference.json')).json());
let maxGraphicError=0;
for(const width of [1920,390]){
  await page.setViewportSize({width,height:width===390?844:1080});
  for(const ref of references){
    for(const [id,key]of [['ecvControl','ecv'],['plasmaControl','plasmaMm'],['hctControl','analysisHct']])await page.locator('#'+id).selectOption(String(ref.options[key]));
    const result=await page.evaluate(ref=>{
      const fail=[],near=(actual,expected,tolerance=5.1e-7)=>{if(Math.abs(actual-expected)>tolerance)fail.push({actual,expected});};
      let graphicError=0;
      for(const [id,value]of [['tissueOutput',ref.rows[0].deltaR1],['bloodOutput',ref.rows[1].deltaR1],['truthOutput',ref.options.ecv*100]])near(parseFloat(document.getElementById(id).textContent),value);
      for(const [id,key,scale]of [['lambdaOutput','lambda',1],['ecvOutput','ecv',100]]){
        const text=document.getElementById(id).textContent;
        if(ref.estimate[key]===null){if(text!=='정의 불가')fail.push({id,text});}
        else near(parseFloat(text),ref.estimate[key]*scale);
      }
      if(ref.bias===null){if(document.getElementById('biasOutput').textContent!=='계산 불가')fail.push('null bias');}
      else near(parseFloat(document.getElementById('biasOutput').textContent),100*ref.bias);
      const rows=[...document.querySelectorAll('#rows tr')];
      for(let j=0;j<2;j++)for(const [k,key]of ['accessibleFraction','amountUmol','meanConcentrationMm','preT1Ms','postT1Ms','preR1','postR1','deltaR1'].entries())near(Number(rows[j].children[k+1].textContent),ref.rows[j][key]);
      const w=document.getElementById('partitionGraphic').viewBox.baseVal.width,span=w-16-44;
      const points=[...document.querySelector('[data-curve="partition"]').points];
      for(let j=0;j<41;j++){
        graphicError=Math.max(graphicError,Math.abs(points[j].x-(44+ref.curve[j].deltaBlood/5*span)),Math.abs(points[j].y-(210-ref.curve[j].deltaTissue/5*180)));
      }
      const current=document.querySelector('[data-current]');
      graphicError=Math.max(graphicError,Math.abs(Number(current.getAttribute('cx'))-(44+ref.rows[1].deltaR1/5*span)),Math.abs(Number(current.getAttribute('cy'))-(210-ref.rows[0].deltaR1/5*180)));
      for(const [name,fraction]of [['plasma',.6],['tissue',ref.options.ecv]])graphicError=Math.max(graphicError,Math.abs(Number(document.querySelector(`[data-fraction="${name}"]`).getAttribute('width'))-fraction*span));
      if(graphicError>1e-4)fail.push({graphicError});
      return{fail,graphicError,overflow:document.documentElement.scrollWidth>innerWidth};
    },ref);
    if(result.fail.length||result.overflow)throw Error(JSON.stringify({width,options:ref.options,...result}));
    maxGraphicError=Math.max(maxGraphicError,result.graphicError);results.push({width,...ref.options});
  }
  await page.locator('#hctControl').focus();
  await page.keyboard.press('Home');if(await page.locator('#hctControl').inputValue()!=='0.25')throw Error('Home');
  await page.keyboard.press('End');if(await page.locator('#hctControl').inputValue()!=='0.55')throw Error('End');
  await page.keyboard.press('ArrowUp');if(await page.locator('#hctControl').inputValue()!=='0.4')throw Error('Arrow');
  for(const id of ['quizDoseWrong','quizDoseCorrect','quizZeroWrong','quizZeroCorrect']){
    await page.locator('#'+id).click();const target=id.includes('Dose')?'doseFeedback':'zeroFeedback';
    if((await page.locator('#'+target).textContent()).includes('답을 선택'))throw Error('Quiz');
  }
  for(const [name,button]of [['base','reset'],['dose','exampleDose'],['hct','exampleHct'],['zero','exampleZero']]){
    await page.locator('#'+button).click();
    const options=await page.evaluate(()=>window.lessonResult.options);
    if(options.ecv!==.3||options.plasmaMm!==(name==='dose'?2:name==='zero'?0:1)||options.analysisHct!==(name==='hct'?.25:.4))throw Error('Example state');
    await page.locator('.layout').screenshot({path:folder+'M02-ecv-'+name+'-'+width+'.png'});
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Expanded overflow');
    await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
  }
  if(width===390){
    const table=page.getByRole('region',{name:'전후 T1과 R1 및 물질량 표'});
    await table.focus();await table.evaluate(e=>e.scrollLeft=e.scrollWidth);
    if(await table.evaluate(e=>e.scrollLeft)<=0)throw Error('Table scroll');
    await table.screenshot({path:folder+'M02-ecv-table-right-390.png'});
  }
  await page.locator('#reset').focus();await page.keyboard.press('Enter');
  if(await page.locator('#plasmaControl').inputValue()!=='1')throw Error('Keyboard reset');
}
if(errors.length)throw Error(JSON.stringify(errors));
return{browser:page.context().browser().version(),root,states:results.length,maxGraphicError,keyboard:true,quiz:true,errors,results};
}
