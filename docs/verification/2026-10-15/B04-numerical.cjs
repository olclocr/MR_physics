const fs=require('node:fs'),path=require('node:path'),R=require('../../../tests/helpers/encoding-reference.cjs');
const {loadEncodingPage}=require('../../../tests/helpers/encoding-page-harness.cjs');
const page=loadEncodingPage(),rows=[],reconstructions=[];
for(const pattern of ['center','uniform','diagonal','bars','spot'])for(const options of R.parameterCases) {
  page.run(`Object.assign(state,${JSON.stringify({...options,objectPattern:pattern})});`);const cells=page.run('spinCells()');
  for(const ky of [-2,-1,0,1,2])for(const kx of [-2,-1,0,1,2]) {
    const actual=page.run(`rawKspaceValue(${kx},${ky})`),reference=R.signal(cells,options,{stage:'readout',ky,readoutProgress:(kx+2)/4});
    const phases=page.run(`spinCells().map(c=>phaseAt(c,{stage:'readout',ky:${ky},phaseProgress:1,readoutProgress:${(kx+2)/4}}))`);
    const phaseError=Math.max(...cells.map((c,i)=>Math.abs(phases[i]+2*Math.PI*(c.x*reference.areaX+c.y*reference.areaY))));
    rows.push({kind:'ADC',pattern,options,kx,ky,reference,phaseError,error:Math.max(Math.abs(actual.real-reference.real),Math.abs(actual.imaginary-reference.imaginary)),kError:Math.max(Math.abs(actual.actualKx-reference.kx),Math.abs(actual.actualKy-reference.ky))});
  }
  for(const phaseOnly of [false,true])for(const ky of [-2,0,1,2])for(const progress of [0,.5,1]) {
    const frame={stage:'phase',phaseOnly,ky,phaseProgress:progress,readoutProgress:0},reference=R.signal(cells,options,frame);
    const actual=page.run(`signalAt(${JSON.stringify(frame)})`);
    rows.push({kind:'preparation',pattern,options,phaseOnly,ky,progress,reference,error:Math.max(Math.abs(actual.real-reference.real/reference.totalDensity),Math.abs(actual.imaginary-reference.imaginary/reference.totalDensity))});
  }
}
for(const pattern of ['center','uniform','diagonal','bars','spot'])for(const order of ['linear','centric','reverse','interleaved'])for(const sampling of Object.keys(R.samplingRows))for(const ignoreDecay of [false,true]) {
  const options={...R.parameterCases[0],ignoreDecay};
  page.run(`Object.assign(state,${JSON.stringify({...options,objectPattern:pattern,fillOrder:order,samplingPattern:sampling,mode:'sequence'})});state.elapsed=acquisitionDuration()/state.speed;`);
  const cells=page.run('spinCells()'),image=page.run('reconstructedImage(currentFrame())');
  const independent=R.samplingRows[sampling].flatMap(ky=>[-2,-1,0,1,2].map(kx=>({...R.signal(cells,options,{stage:'readout',ky,readoutProgress:(kx+2)/4}),kx,ky})));
  const pixels=cells.map(c=>({x:c.x,y:c.y,...R.inverse(independent,c.x,c.y)}));
  const error=Math.max(...image.pixels.flatMap((p,i)=>[Math.abs(p.value-pixels[i].real),Math.abs(p.residual-pixels[i].imaginary)]));
  reconstructions.push({pattern,order,sampling,ignoreDecay,pixels,error});
}
const summary={adcRows:rows.filter(r=>r.kind==='ADC').length,preparationRows:rows.filter(r=>r.kind==='preparation').length,reconstructions:reconstructions.length,
  maxRawError:Math.max(...rows.filter(r=>r.kind==='ADC').map(r=>r.error)),maxKError:Math.max(...rows.filter(r=>r.kind==='ADC').map(r=>r.kError)),
  maxPhaseError:Math.max(...rows.filter(r=>r.kind==='ADC').map(r=>r.phaseError)),maxPrepError:Math.max(...rows.filter(r=>r.kind==='preparation').map(r=>r.error)),maxReconError:Math.max(...reconstructions.map(r=>r.error)),maxImage:Math.max(...reconstructions.flatMap(r=>r.pixels.map(p=>p.magnitude)))};
fs.writeFileSync(path.join(__dirname,'B04-numerical.json'),JSON.stringify({method:'Independent rectangular gradient quadrature, complex signal and inverse sums',summary,rows,reconstructions})+'\n');console.log(summary);
