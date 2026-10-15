// Independent radix-2 row/column FFT; no cached trigonometric pixel basis from the page.
function fft(a,inverse=false){
  if(a.length===1)return a.map(v=>({...v}));const n=a.length,e=fft(a.filter((_,i)=>i%2===0),inverse),o=fft(a.filter((_,i)=>i%2===1),inverse),out=[];
  for(let k=0;k<n/2;k++){const phi=(inverse?1:-1)*2*Math.PI*k/n,c=Math.cos(phi),s=Math.sin(phi),r=c*o[k].real-s*o[k].imaginary,i=s*o[k].real+c*o[k].imaginary;out[k]={real:e[k].real+r,imaginary:e[k].imaginary+i};out[k+n/2]={real:e[k].real-r,imaginary:e[k].imaginary-i};}
  return out;
}
const wrap=x=>(x%16+16)%16;
function fft2(a,inverse=false){const rows=Array.from({length:16},(_,i)=>fft(a.slice(i*16,i*16+16),inverse));for(let c=0;c<16;c++){const col=fft(rows.map(r=>r[c]),inverse);col.forEach((v,r)=>rows[r][c]=v);}return rows.flat().map(v=>({real:v.real/(inverse?256:1),imaginary:v.imaginary/(inverse?256:1)}));}
function forward(original){const grid=Array.from({length:256},()=>({real:0,imaginary:0}));original.forEach((v,i)=>{const x=i%16-8,y=7-Math.floor(i/16);grid[wrap(y)*16+wrap(x)]={real:v,imaginary:0};});const f=fft2(grid);return Array.from({length:256},(_,i)=>{const kx=i%16-8,ky=7-Math.floor(i/16);return {kx,ky,...f[wrap(ky)*16+wrap(kx)]};});}
function inverse(coefficients){const grid=Array.from({length:256},()=>({real:0,imaginary:0}));for(const s of coefficients)grid[wrap(s.ky)*16+wrap(s.kx)]={real:s.real,imaginary:s.imaginary};const a=fft2(grid,true);return Array.from({length:256},(_,i)=>a[wrap(7-Math.floor(i/16))*16+wrap(i%16-8)]);}
function reference(original,state,selection=[]){
 const all=forward(original),map=new Map(all.map(v=>[`${v.kx},${v.ky}`,v])),active=new Map(),key=(x,y)=>`${x},${y}`,add=v=>active.set(key(v.kx,v.ky),v);
 if(state.mode==='mask'){for(const v of all){const inside=Math.max(Math.abs(v.kx),Math.abs(v.ky))<=state.cutoff;if(state.mask==='full'||state.mask==='low'&&inside||state.mask==='high'&&!inside||state.mask==='alternate'&&wrap(v.ky)%2===0)add(v);}}
 else if(state.mode==='sum'){selection.forEach(([x,y])=>add(map.get(key(x,y))));}
 else{const s=map.get(key(state.kx,state.ky)),px=wrap(-s.kx+8)-8,py=wrap(-s.ky+8)-8,self=px===s.kx&&py===s.ky,phi=self?0:state.phaseOffset*Math.PI/180,c=Math.cos(phi)*state.gain,t=Math.sin(phi)*state.gain,v={kx:s.kx,ky:s.ky,real:c*s.real-t*s.imaginary,imaginary:t*s.real+c*s.imaginary};if(state.includeDC)add(map.get('0,0'));add(v);if(state.includePair&&!self)add({kx:px,ky:py,real:v.real,imaginary:-v.imaginary});}
 const reconstruction=inverse([...active.values()]);return {coefficients:all,active:[...active.values()],reconstruction};
}
module.exports={fft,forward,inverse,reference};
