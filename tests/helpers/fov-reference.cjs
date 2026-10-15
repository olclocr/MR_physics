// Independent closed finite Fourier kernel; edge response is a real-space integral.
function kernel(n,theta){const d=Math.sin(theta/2);if(Math.abs(d)<1e-12)return {real:n,imaginary:0};const a=Math.sin(n*theta/2)/d;return {real:a*Math.cos(theta/2),imaginary:-a*Math.sin(theta/2)};}
function reference(o,xMm,steps=4096){
 if(o.phantom==='point'){const a=kernel(o.acquired,2*Math.PI*xMm/o.fovMm);return {real:a.real/o.acquired,imaginary:a.imaginary/o.acquired};}
 let real=0,imaginary=0;const dx=30/steps;for(let i=0;i<=steps;i++){const u=-15+i*dx,a=kernel(o.acquired,2*Math.PI*(xMm-u)/o.fovMm),w=i===0||i===steps?1:i%2?4:2;real+=w*a.real;imaginary+=w*a.imaginary;}return {real:real*dx/3/o.fovMm,imaginary:imaginary*dx/3/o.fovMm};
}
module.exports={reference};
