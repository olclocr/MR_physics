(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HemorrhageStateReading=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const sources=[
  {id:'met',title:'Gomori 등 · Variable appearances (1987 AJNR / 1988 AJR)',url:'https://pubmed.ncbi.nlm.nih.gov/3257117/',location:'저자 초록 · 세 methemoglobin 상태의 제안',scope:'소규모 high-field spin-echo 관찰과 저자 해석'},
  {id:'evolution',title:'Gomori 등 · Intracranial hematomas (1985)',url:'https://pubs.rsna.org/doi/10.1148/radiology.157.1.4034983',location:'저자 초록 · 1.5T T1W/T2W spin-echo의 공간/시간 경향',scope:'20개 혈종의 관찰·넓은 시기 구분; 환자 날짜 계산식 아님'}
 ];
 const states=[
  {id:'intracellular',name:'비희석 세포내 metHb',compartment:'적혈구 내',concentration:'비희석',t1:'고신호 경향',t2:'뚜렷한 저신호 경향',evidence:'소규모 관찰과 해석',note:'구획을 유지한 metHb의 T1/T2W 차이를 읽습니다.'},
  {id:'free-dense',name:'비희석 free metHb',compartment:'세포 밖의 free 상태',concentration:'비희석',t1:'고신호 경향',t2:'등신호 또는 약한 저신호 가능',evidence:'저자의 제안 포함',note:'세포 밖이라는 조건만으로 T2W 고신호를 보장하지 않습니다.'},
  {id:'free-dilute',name:'희석 free metHb',compartment:'세포 밖의 free 상태',concentration:'희석',t1:'고신호 경향',t2:'고신호 경향',evidence:'소규모 관찰과 해석',note:'Free 상태에서도 농도 조건을 구별합니다.'}
 ].map(s=>Object.freeze({...s,source:'met'}));
 const views=[{id:'t1',label:'T1W spin-echo · 원전 범위'},{id:'t2',label:'T2W spin-echo · 원전 범위'},{id:'gre',label:'GRE T2* · 이 표의 근거 밖'}];
 function select(stateId='intracellular',viewId='t2'){
  const state=states.find(s=>s.id===stateId),view=views.find(v=>v.id===viewId);if(!state||!view)throw new RangeError('Unsupported hemorrhage reading state');
  return{state,view,supported:viewId!=='gre',finding:viewId==='gre'?'이 표에서 예측하지 않음':state[viewId],timing:'이 상태표로 날짜를 계산하지 않음',source:sources[0]};
 }
 return{sources:Object.freeze(sources),states:Object.freeze(states),views:Object.freeze(views),select};
});
