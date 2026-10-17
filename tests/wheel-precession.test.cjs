const {test}=require('node:test'),assert=require('node:assert/strict'),{loadWheel}=require('./helpers/wheel-page-harness.cjs');
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('ring quadrature, signed spin and finite-vector change agree with torques across masses, radii, gravity and phases',()=>{
 const p=loadWheel();for(const m of [1,1.5,2])for(const r of [.2,.4,.6])for(const g of [0,.25,2])for(const omega of [-15,-7,-1,1,7,15])for(const phi of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  p.run(`Object.assign(state,{mass:${m},distance:${r},gravityScale:${g},spinSpeed:${omega},phase:${phi},timeScale:0});updateMetrics();`);let ix=0,ip=0;for(let i=0;i<4096;i++){const z=.35*Math.sin(2*Math.PI*(i+.5)/4096);ix+=m/4096*.35**2;ip+=m/4096*(r*r+z*z);}near(p.run('wheelInertia()'),ix);near(p.run('pendulumInertia()'),ip);const tau=m*9.81*g*r,L=ix*omega,Omega=tau/L,dt=1e-7,dx=L*(Math.cos(phi+Omega*dt)-Math.cos(phi-Omega*dt))/(2*dt),dy=L*(Math.sin(phi+Omega*dt)-Math.sin(phi-Omega*dt))/(2*dt);near(dx,-tau*Math.sin(phi),1e-7);near(dy,tau*Math.cos(phi),1e-7);near(p.run('torqueMagnitude()'),tau);near(p.run('spinDirection()*torqueMagnitude()/angularMomentumMagnitude()'),Omega);near(p.run('gravityArrowScale()'),m/1.5*g);
 }
});
test('physical pendulum quarter-period and energy match independent elliptic integral without assuming small angles',()=>{
 const p=loadWheel();let elliptic=0;const steps=4096,h=Math.PI/2/steps;for(let i=0;i<=steps;i++){const q=1/Math.sqrt(1-.5*Math.sin(i*h)**2),weight=i===0||i===steps?1:i%2?4:2;elliptic+=weight*q*h/3;}
 for(const m of [1,2])for(const r of [.2,.6])for(const g of [.25,2]){p.run(`Object.assign(state,{spinSpeed:0,mass:${m},distance:${r},gravityScale:${g}});resetPendulum();`);const inertia=m*(r*r+.35**2/2),quarter=Math.sqrt(inertia/(m*9.81*g*r))*elliptic;p.run(`for(let i=0;i<2000;i++)advancePendulum(${quarter/2000});`);near(p.run('pendulumTheta()'),0,1e-10);near(p.run('.5*pendulumInertia()*pendulumThetaDot()**2+state.mass*currentGravity()*state.distance*(1-Math.cos(pendulumTheta()))'),m*9.81*g*r,1e-9);}
});
