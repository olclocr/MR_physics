// Playwright CLI: run-code --filename docs/verification/2026-10-15/C01-browser-check.js
async (page) => {
  const origin='http://127.0.0.1:8766';
  const evidence='docs/verification/2026-10-15/';
  const reference=await (await page.request.get(origin+'/docs/verification/2026-10-15/C01-numerical.json')).json();
  const check=(condition,message)=>{if(!condition)throw new Error(message);};
  const errors=[],results=[];
  page.on('pageerror',error=>errors.push(error.message));
  const setNumber=async(id,value)=>{await page.locator('#'+id).fill(String(value));await page.locator('#'+id).press('Tab');};
  async function inspect(label) {
    const actual=await page.evaluate(()=>({
      state:{...state},width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
      controlsParent:document.getElementById('controlsPanel').parentElement.id,
      rows:[...document.querySelectorAll('#signalTable tr')].map(tr=>[...tr.querySelectorAll('td')].map(td=>Number(td.textContent))),
      bars:[...document.querySelectorAll('#signalBars .bar')].map(el=>parseFloat(el.getAttribute('style').split(':')[1])/100),
      parameters:[...document.querySelectorAll('#tissueParameters tr')].map(tr=>tr.textContent),
      approx:document.getElementById('approximationNote').textContent,
      summary:document.getElementById('summary').textContent,
      phantomLabel:document.getElementById('phantom').getAttribute('aria-label'),
      pixels:(()=>{const c=document.getElementById('phantom'),ctx=c.getContext('2d');return [48,84,89].map(x=>[...ctx.getImageData(Math.floor((x+.5)/96*c.width),Math.floor(48.5/96*c.height),1,1).data]);})(),
      canvases:[...document.querySelectorAll('canvas')].map(c=>({id:c.id,width:c.width,height:c.height,
        nonblank:c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)}))
    }));
    check(actual.width===actual.scrollWidth,label+': horizontal overflow');
    check(actual.canvases.every(c=>c.width>0&&c.height>0&&c.nonblank),label+': blank canvas');
    const wanted=reference.rows.filter(r=>r.tr===actual.state.tr&&r.te===actual.state.te);
    check(wanted.length===3,label+': reference missing');
    wanted.forEach((row,i)=>{
      const pd=actual.state.equalPD?1:row.pd;
      const signal=pd*row.independent.second.echo;
      const expected=[pd,row.independent.second.recovery,row.independent.first.echo,signal];
      expected.forEach((v,j)=>check(Math.abs(actual.rows[i][j]-v)<=.0005+1e-12,label+': table '+i+','+j));
      check(Math.abs(actual.bars[i]-signal)<1e-8,label+': bar '+i);
      const gray=Math.round(255*signal);
      check(actual.pixels[i].slice(0,3).every(v=>Math.abs(v-gray)<=1),label+': phantom gray '+i);
      check(actual.phantomLabel.includes(signal.toFixed(3)),label+': accessible signal '+i);
    });
    if(label.includes('default T1W')) {
      actual.markers=await page.evaluate(values=>['recoveryPlot','decayPlot'].flatMap((id,k)=>{
        const c=document.getElementById(id),rect=c.getBoundingClientRect(),ctx=c.getContext('2d');
        const selected=k===0?500:15,min=k===0?200:0,max=k===0?12000:180;
        const x=36+(selected-min)/(max-min)*(rect.width-50);
        return values.map((v,i)=>{
          const y=rect.height-35-v[k]*(rect.height-47);
          return {id,tissue:i,value:v[k],pixel:[...ctx.getImageData(Math.floor(x*devicePixelRatio),Math.floor(y*devicePixelRatio),1,1).data]};
        });
      }),wanted.map(r=>[r.independent.second.recovery,r.independent.first.echo]));
      const colors=[[37,99,235],[180,83,9],[8,127,117]];
      actual.markers.forEach(m=>check(m.pixel.slice(0,3).every((v,j)=>Math.abs(v-colors[m.tissue][j])<=4),label+': marker '+m.id+','+m.tissue));
    }
    results.push({label,...actual});
    return actual;
  }
  for(const [width,height] of [[1920,1080],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto(origin+'/docs/contrast_weighting.html');
    let current=await inspect(width+' default T1W');
    check(current.controlsParent===(width<=1100?'mobileControls':'desktopControls'),'control placement');
    await setNumber('trNumber',200);await inspect(width+' short TR');
    await setNumber('trNumber',12000);await inspect(width+' long TR');
    await page.getByRole('button',{name:'T2W 예시',exact:true}).click();
    await inspect(width+' T2W');
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:evidence+'C01-t2-'+width+'.png'});
    await page.locator('.grid').first().screenshot({path:evidence+'C01-signal-'+width+'.png'});
    await page.locator('.charts').screenshot({path:evidence+'C01-curves-'+width+'.png'});
    await setNumber('teNumber',180);await inspect(width+' longer TE');
    await page.locator('[data-answer="increase"]').click();
    check((await page.locator('#quizFeedback').textContent()).includes('다시 생각'),'incorrect quiz feedback');
    await page.locator('[data-answer="decrease"]').focus();await page.keyboard.press('Enter');
    const feedback=await page.locator('#quizFeedback').textContent();
    check(feedback.includes('맞습니다')&&feedback.includes('0.734 → 0.701'),'correct quiz values');
    await page.locator('.quiz').screenshot({path:evidence+'C01-quiz-'+width+'.png'});
    await page.getByRole('button',{name:'PDW 예시',exact:true}).click();await inspect(width+' PDW');
    await page.locator('#equalPD').check();await inspect(width+' PDW equal PD');
    await setNumber('trNumber',200);await setNumber('teNumber',180);await inspect(width+' boundary');
    await page.locator('details').last().locator('summary').click();
    check((await page.locator('#approximationNote').textContent()).includes('0.0055, 단순 회복 근사 0.0488'),'approximation boundary');
    await page.locator('details').last().screenshot({path:evidence+'C01-model-'+width+'.png'});
    // Empty, invalid, rounding and keyboard range boundaries are real input events.
    await setNumber('trNumber',999999);check((await page.locator('#trNumber').inputValue())==='12000','TR clamp');
    await setNumber('teNumber',-20);check((await page.locator('#teNumber').inputValue())==='5','TE clamp');
    await setNumber('teNumber',17);check((await page.locator('#teNumber').inputValue())==='15','TE step');
    await setNumber('teNumber','');check((await page.locator('#teNumber').inputValue())==='15','empty restore');
    await page.locator('#tr').focus();await page.keyboard.press('Home');check((await page.locator('#trNumber').inputValue())==='200','TR Home');
    await page.keyboard.press('End');check((await page.locator('#trNumber').inputValue())==='12000','TR End');
    await page.locator('#te').focus();await page.keyboard.press('Home');check((await page.locator('#teNumber').inputValue())==='5','TE Home');
    await page.keyboard.press('End');check((await page.locator('#teNumber').inputValue())==='180','TE End');
    await inspect(width+' upper boundary');
    await page.locator('#reset').focus();await page.keyboard.press('Enter');
    const reset=await inspect(width+' reset');
    check(reset.state.tr===500&&reset.state.te===15&&!reset.state.equalPD,'reset state');
    check((await page.locator('#quizFeedback').textContent()).includes('답을 고르면'),'reset feedback');
  }
  // Resizing with an active nondefault state must preserve both data and moved controls.
  await page.getByRole('button',{name:'T2W 예시',exact:true}).click();
  await page.setViewportSize({width:1920,height:1080});
  const resized=await inspect('resize mobile to desktop');
  check(resized.controlsParent==='desktopControls'&&resized.state.tr===6000&&resized.state.te===100,'resize state');
  return {browser:page.context().browser().version(),tolerances:{table:.0005,bar:1e-8,gray:1},results,errors};
}
