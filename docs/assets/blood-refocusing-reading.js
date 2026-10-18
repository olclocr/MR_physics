(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BloodRefocusingReading=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const sources=[
  {id:'blood',title:'Gomori 등 (1987) · Blood relaxation and cell integrity',url:'https://pubmed.ncbi.nlm.nih.gov/3597895/',location:'초록: 측정 범위와 oxy/deoxy·용혈액의 T2 비교',scope:'혈액 NMR, 0.19–1.4T. Field 또는 echo 간격에 따른 이완시간 변화; 환자 영상 밝기표가 아님'},
  {id:'diffusion',title:'Thulborn 등 (1982) · Oxygenation and transverse relaxation',url:'https://pubmed.ncbi.nlm.nih.gov/6275909/',location:'초록: CPMG pulse rate와 세포 주변 field gradient를 통한 물 확산',scope:'탈산소화/횡이완의 기전 근거; 이 페이지의 정량 피팅에 사용하지 않음'},
  {id:'iron',title:'Thulborn 등 (1990) · Ferritin/hemosiderin in rat hemorrhage',url:'https://pubmed.ncbi.nlm.nih.gov/1690500/',location:'초록: 쥐 혈종의 조직/생화학 대조와 대칭·비대칭 SE linewidth 영상',scope:'특정 쥐 모형의 분포 관찰. 초록에 field/TE 수치가 제시되지 않으므로 임의로 넣지 않음'}
 ].map(Object.freeze);
 const cases=[
  {id:'oxy',name:'적혈구 내 oxyHb',sample:'세포막이 유지된 oxyhemoglobin 혈액 시료',acquisition:'혈액 NMR · 0.19–1.4T · field/echo 간격 변화',quantity:'T2 이완시간의 조건 의존성',finding:'Field 또는 echo 간격이 커질 때 T2가 조금 감소',meaning:'OxyHb에서도 관찰된 작은 변화를 0으로 바꾸지 않습니다. 영상이 항상 밝다는 결론도 아닙니다.',source:'blood',diagram:'cells-oxy'},
  {id:'deoxy',name:'적혈구 내 deoxyHb',sample:'세포막이 유지된 deoxyhemoglobin 혈액 시료',acquisition:'혈액 NMR · 0.19–1.4T · field/echo 간격 변화',quantity:'T2 이완시간의 조건 의존성',finding:'Field 또는 echo 간격이 커질 때 T2가 뚜렷하게 감소',meaning:'Refocusing이 있어도 세포 주변 field gradient를 건너는 물의 확산에 따른 횡이완은 남을 수 있습니다.',source:'blood',diagram:'cells-deoxy'},
  {id:'lysate',name:'DeoxyHb 용혈액',sample:'적혈구가 용해된 혈액 시료 · 구획 경계 변화',acquisition:'같은 원전의 혈액 NMR · 0.19–1.4T',quantity:'T2 이완시간의 조건 의존성',finding:'용혈액의 T2는 field/echo 간격에 의존하지 않았음',meaning:'이 실험의 조건 의존성이 사라졌다는 뜻입니다. T2가 무한대이거나 모든 횡이완이 없어졌다는 뜻은 아닙니다.',source:'blood',diagram:'lysate'},
  {id:'storage',name:'Ferritin과 hemosiderin 분포',sample:'혈액을 주입한 쥐 뇌의 후기 혈종 · 조직/생화학 대조',acquisition:'대칭/비대칭 T2W SE의 linewidth 영상 · field/TE 수치는 초록에 미제시',quantity:'철 저장 물질의 공간 분포와 linewidth 영상의 대응',finding:'Ferritin 분포가 더 넓었고 linewidth 변화 분포와 유사',meaning:'두 철 저장 물질을 한 이름/한 공간 범위로 합치지 않습니다. 이 관찰을 GRE 한 장에서 물질별로 구분하는 진단기로 바꾸지 않습니다.',source:'iron',diagram:'storage'}
 ].map(Object.freeze);
 const views=Object.freeze([{id:'original',label:'원전의 refocusing 조건에서 읽기'},{id:'gre',label:'GRE T2*로 옮겨 읽기'}].map(Object.freeze));
 function select(caseId='deoxy',viewId='original'){
  const item=cases.find(c=>c.id===caseId),view=views.find(v=>v.id===viewId);if(!item||!view)throw new RangeError('Unsupported blood refocusing reading');
  return{item,view,source:sources.find(s=>s.id===item.source),supported:viewId==='original',reading:viewId==='original'?item.finding:'이 원전 요약만으로 GRE 밝기/정량값을 예측하지 않음',status:viewId==='original'?'측정 시료·물리량·획득 조건을 함께 읽습니다.':'GRE는 refocusing 방식과 T2* 조건이 다릅니다. 원전 열은 유지하고, 실제 TE/field·공간 분포·수신 조건을 추가 확인합니다.'};
 }
 return Object.freeze({sources:Object.freeze(sources),cases:Object.freeze(cases),views,select});
});
