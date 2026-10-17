(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VolumeGeometry=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const extentMm=48,defaults=Object.freeze({inPlaneMm:3,sliceMm:6,partitionMm:3}),cache=new Map();
 const boxes=[{x:[-8,8],y:[-8,8],z:[-3,3],amplitude:.8},{x:[-18,-12],y:[-3,3],z:[9,15],amplitude:.5},{x:[-3,3],y:[12,18],z:[-15,-9],amplitude:.4}];
 function geometry(inPlaneMm,dz){if(![1.5,3,6].includes(inPlaneMm)||![1.5,3,6,12].includes(dz))throw new RangeError('Invalid voxel geometry');return {nx:extentMm/inPlaneMm,ny:extentMm/inPlaneMm,nz:extentMm/dz,dx:inPlaneMm,dy:inPlaneMm,dz,voxelMm3:inPlaneMm**2*dz,isotropic:inPlaneMm===dz};}
 function fraction(i,d,a,b){const lo=-extentMm/2+i*d,hi=lo+d;return Math.max(0,Math.min(hi,b)-Math.max(lo,a))/d;}
 function volume(inPlaneMm,dz){const key=inPlaneMm+'/'+dz;if(cache.has(key))return cache.get(key);const g=geometry(inPlaneMm,dz),data=new Float64Array(g.nx*g.ny*g.nz);for(let z=0;z<g.nz;z++)for(let y=0;y<g.ny;y++)for(let x=0;x<g.nx;x++){let signal=.2;for(const b of boxes)signal+=b.amplitude*fraction(x,g.dx,...b.x)*fraction(y,g.dy,...b.y)*fraction(z,g.dz,...b.z);data[(z*g.ny+y)*g.nx+x]=signal;}const a={geometry:g,data};cache.set(key,a);return a;}
 function planes(v){const g=v.geometry,get=(x,y,z)=>v.data[(z*g.ny+y)*g.nx+x],axial=[],coronal=[],sagittal=[];for(let row=0;row<g.ny;row++)for(let x=0;x<g.nx;x++){const y=g.ny-1-row;axial.push((get(x,y,g.nz/2-1)+get(x,y,g.nz/2))/2);}for(let row=0;row<g.nz;row++){const z=g.nz-1-row;for(let x=0;x<g.nx;x++)coronal.push((get(x,g.ny/2-1,z)+get(x,g.ny/2,z))/2);for(let y=0;y<g.ny;y++)sagittal.push((get(g.nx/2-1,y,z)+get(g.nx/2,y,z))/2);}return {axial:{width:g.nx,height:g.ny,data:axial},coronal:{width:g.nx,height:g.nz,data:coronal},sagittal:{width:g.ny,height:g.nz,data:sagittal}};}
 function calculate(options={}){const o={...defaults,...options},a=volume(o.inPlaneMm,o.sliceMm),b=volume(o.inPlaneMm,o.partitionMm);return {options:o,stack:{...a,planes:planes(a)},slab:{...b,planes:planes(b)}};}
 return {defaults,extentMm,geometry,volume,planes,calculate};
});
