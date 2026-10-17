/* Ideal rectangular excitation profile. z: mm; RF offsets/BW: Hz; G: mT/m.
   Same positive proton gamma as the shared MR model; no finite-RF Bloch solver. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./mr-physics-models.js'):root.MRPhysics);if(typeof module==='object'&&module.exports)module.exports=api;else root.SliceSelection=api;})(typeof globalThis!=='undefined'?globalThis:this,function(physics){
 'use strict';
 const gammaHzPerMicroT=physics.GAMMA_HZ_PER_UT,defaults=Object.freeze({bandwidthHz:2000,gradientMilliTPerM:10,offsetHz:500,polarity:1}),densityA=1,densityB=.3;
 function settings(options={}){const o={...defaults,...options};if(!Number.isFinite(o.bandwidthHz)||o.bandwidthHz<=0||!Number.isFinite(o.gradientMilliTPerM)||o.gradientMilliTPerM<=0||!Number.isFinite(o.offsetHz)||![1,-1].includes(o.polarity))throw new RangeError('Invalid slice settings');return o;}
 function frequencyAt(options={},zMm=0){const o=settings(options);if(!Number.isFinite(zMm))throw new RangeError('Invalid z position');return gammaHzPerMicroT*o.gradientMilliTPerM*o.polarity*zMm;}
 function calculate(options={}){const o=settings(options),slopeHzPerMm=gammaHzPerMicroT*o.gradientMilliTPerM*o.polarity,centerMm=o.offsetHz/slopeHzPerMm,thicknessMm=o.bandwidthHz/Math.abs(slopeHzPerMm),lowMm=centerMm-thicknessMm/2,highMm=centerMm+thicknessMm/2,lengthA=Math.max(0,Math.min(highMm,0)-lowMm),lengthB=thicknessMm-lengthA,fractionA=lengthA/thicknessMm,fractionB=lengthB/thicknessMm,integratedSignal=densityA*lengthA+densityB*lengthB;
 return {...o,slopeHzPerMm,centerMm,thicknessMm,lowMm,highMm,lowFrequencyHz:o.offsetHz-o.bandwidthHz/2,highFrequencyHz:o.offsetHz+o.bandwidthHz/2,lengthA,lengthB,fractionA,fractionB,integratedSignal,meanSignal:integratedSignal/thicknessMm};}
 return {defaults,gammaHzPerMicroT,densityA,densityB,calculate,frequencyAt};
});
