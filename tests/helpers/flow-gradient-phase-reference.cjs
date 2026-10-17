'use strict';
// Independent SI trajectory/Bloch integration: no product moment or rotation.
const gamma=2*Math.PI*42.57747892e6;
function calculate(o,substeps=40){
  let state=[.001,1,0,0,0,0],time=0;
  const v=o.velocityCmS*.01,tau=o.lobeMs*.001,rows=[];
  const deriv=(t,y,g)=>{const omega=gamma*g*y[0];return[v,omega*y[2],-omega*y[1],-omega,g,t*g];};
  const plus=(a,k,h)=>a.map((x,j)=>x+h*k[j]);
  for(let i=0;i<=200;i++){
    if(i){const dt=2*tau/200/substeps;
      for(let j=0;j<substeps;j++){
        const g=(i<=100?1:-1)*o.polarity*.002;
        const a=deriv(time,state,g),b=deriv(time+dt/2,plus(state,a,dt/2),g),c=deriv(time+dt/2,plus(state,b,dt/2),g),d=deriv(time+dt,plus(state,c,dt),g);
        state=state.map((x,k)=>x+dt*(a[k]+2*b[k]+2*c[k]+d[k])/6);time+=dt;
      }
    }
    rows.push({timeMs:time*1000,positionMm:state[0]*1000,real:state[1],imaginary:state[2],phase:state[3],moment0:state[4],moment1:state[5],phaseStationary:-gamma*.001*state[4],phaseMotion:state[3]+gamma*.001*state[4],magnitude:Math.hypot(state[1],state[2])});
  }
  return{options:o,curve:rows,end:rows[200]};
}
module.exports={calculate};
