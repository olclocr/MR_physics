const fatHz=-3.5e-6*42577478.92*3;
function integrate(m,duration,f,maxStep){const count=Math.max(1,Math.ceil(duration/maxStep)),h=duration/count;let v=[...m];const add=(a,b,s)=>a.map((x,i)=>x+b[i]*s);for(let i=0;i<count;i++){const a=f(v),b=f(add(v,a,h/2)),c=f(add(v,b,h/2)),d=f(add(v,c,h));v=v.map((x,j)=>x+h*(a[j]+2*b[j]+2*c[j]+d[j])/6);}return v;}
function rf(m,angle){return integrate(m,angle,v=>[0,v[2],-v[1]],.001);}
function history(frequency,delay,scale){const first=rf([0,0,1],Math.PI/4*scale),omega=2*Math.PI*frequency/1000,gap=integrate(first,delay,v=>[omega*v[1],-omega*v[0],0],.001),last=rf(gap,Math.PI/4*scale),object=v=>({x:v[0],y:v[1],z:v[2]});return {first:object(first),gap:object(gap),last:object(last),magnitude:Math.hypot(last[0],last[1])};}
function response(frequency,delay,scale){const a=Math.PI/4*scale,phase=2*Math.PI*frequency*delay/1000,mz=Math.cos(a)**2-Math.sin(a)**2*Math.cos(phase);return {mz,magnitude:2*Math.abs(Math.sin(a)*Math.cos(phase/2))*Math.sqrt(Math.sin(phase/2)**2+Math.cos(a)**2*Math.cos(phase/2)**2)};}
module.exports={fatHz,history,response};
