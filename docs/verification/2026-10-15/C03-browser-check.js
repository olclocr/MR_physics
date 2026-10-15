async(page)=>{
 const folder='docs/verification/2026-10-15/',root='http://127.0.0.1:8766';
 await page.route('**/*',route=>route.continue());const ref=await(await page.request.get(root+'/'+folder+'C03-numerical.json')).json();
 const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));const check=(a,m)=>{if(!a)throw Error(m);};
 const set=async(id,v)=>page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},v);
 async function capture(label){
   const a=await page.evaluate(()=>({state:{...state},result:Model.calculate(state,state.timeMs),values:['t2Signal','fidSignal','seSignal','t2Factor','fidFactor','seFactor'].map(id=>document.getElementById(id).textContent),bars:['t2Bar','fidBar','seBar'].map(id=>parseFloat(document.getElementById(id).style.width)),overflow:document.documentElement.scrollWidth>innerWidth,view:document.getElementById('signalGraphic').getAttribute('viewBox'),curves:[...document.querySelectorAll('polyline')].map(el=>({key:el.dataset.series,points:el.getAttribute('points').split(' ').map(s=>s.split(',').map(Number))})),sequence:document.getElementById('sequenceOutput').textContent}));
   const keys=['t2Ms','sigmaHz','teMs'],same=o=>keys.every(k=>o[k]===a.state[k]);const row=ref.rows.find(r=>same(r.options)&&Math.abs(r.timeMs-a.state.timeMs)<1e-9);check(!!row,label+' independent row');
   a.error=Math.max(Math.abs(a.result.fid-row.reference.fid),Math.abs(a.result.se-row.reference.se));check(a.error<1e-10,label+' reference mismatch');check(!a.overflow,label+' overflow');
   const expected=[a.result.t2,a.result.fid,a.result.se,a.result.t2,a.result.fidCoherence,a.result.seCoherence];a.values.forEach((v,i)=>check(v===expected[i].toFixed(4),label+' display'));a.bars.forEach((v,i)=>check(Math.abs(v-100*expected[i+3])<1e-4,label+' factor bar'));
   const curve=ref.curves.find(r=>same(r.options));if(curve){const w=Number(a.view.split(' ')[2]),l=w===360?40:55,rr=w-20;a.curveError=0;for(const p of a.curves)if(p.key!=='t2')p.points.forEach(([x,y],i)=>{a.curveError=Math.max(a.curveError,Math.abs((240-y)/190-curve.points[i][p.key]));check(Math.abs(x-(l+curve.points[i].timeMs/120*(rr-l)))<1e-10,'time axis');});check(a.curveError<1e-10,label+' plotted curve');}
   delete a.curves;results.push({label,...a});
 }
 for(const [width,height]of [[1920,1080],[390,844]]){
   await page.setViewportSize({width,height});await page.goto(root+'/docs/t2_t2star_dephasing.html?qa='+Date.now());await capture(width+' default');await page.screenshot({path:folder+'C03-page-'+width+'.png'});await page.locator('#signalGraphic').screenshot({path:folder+'C03-curve-'+width+'.png'});
   for(const id of ['beforeRF','afterRF','atTE']){await page.locator('#'+id).click();await capture(width+' '+id);}
   await page.locator('#exampleZero').click();await capture(width+' zero');await page.locator('#signalGraphic').screenshot({path:folder+'C03-zero-'+width+'.png'});
   await page.locator('#exampleT2').click();await capture(width+' shortT2');await page.locator('#signalGraphic').screenshot({path:folder+'C03-shortT2-'+width+'.png'});
   await page.locator('#exampleEcho').click();await capture(width+' echo');
   for(const [id,key]of [['t2Control','t2Ms'],['sigmaControl','sigmaHz'],['teControl','teMs']])for(const edge of ['Home','End']){await page.locator('#reset').click();await page.locator('#'+id).focus();await page.keyboard.press(edge);await capture(width+' '+key+' '+edge);}
   await page.locator('#reset').click();for(const edge of ['Home','End']){await page.locator('#timeControl').focus();await page.keyboard.press(edge);await capture(width+' time '+edge);}
   await set('t2Control',20);await set('sigmaControl',20);await set('teControl',80);await page.locator('#atTE').click();await capture(width+' combined extreme');await page.locator('#signalGraphic').screenshot({path:folder+'C03-extreme-'+width+'.png'});
   await page.locator('#reset').click();await page.locator('#factorSummary').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'C03-factors-'+width+'.png'});
   for(const id of ['quizEchoWrong','quizEchoCorrect','quizShapeWrong','quizShapeCorrect']){await page.locator('#'+id).focus();await page.keyboard.press('Enter');}
   check((await page.locator('#quizShapeFeedback').textContent()).includes('맞습니다'),'quiz response');await page.locator('#quizEchoCorrect').scrollIntoViewIfNeeded();await page.screenshot({path:folder+'C03-quiz-'+width+'.png'});
   await page.locator('#reset').focus();await page.keyboard.press('Enter');await capture(width+' reset');check((await page.locator('#quizEchoFeedback').textContent()).includes('답을 선택'),'reset feedback');
 }
 check(errors.length===0,errors.join('\n'));return {browser:page.context().browser().version(),results,errors};
}
