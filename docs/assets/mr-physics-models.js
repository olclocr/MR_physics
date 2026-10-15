/* Classical ensemble magnetization, positive proton gamma, right-handed axes.
 * dM/dt = gamma M x B. Frequencies below are in Hz; times are in ms.
 * Browser global and CommonJS export share the same pure numerical functions. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.MRPhysics = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const GAMMA_HZ_PER_UT = 42.57747892;
  const TAU = 2 * Math.PI;
  const v = (x, y, z) => ({ x, y, z });
  const add = (a, b) => v(a.x + b.x, a.y + b.y, a.z + b.z);
  const scale = (a, s) => v(a.x * s, a.y * s, a.z * s);
  const norm = a => Math.hypot(a.x, a.y, a.z);
  const transverse = a => Math.hypot(a.x, a.y);
  function rotate(m, axis, angle) {
    const n = norm(axis);
    if (!n || !angle) return { ...m };
    const k = scale(axis, 1 / n), c = Math.cos(angle), s = Math.sin(angle);
    const d = k.x * m.x + k.y * m.y + k.z * m.z;
    return v(
      m.x * c + (k.y * m.z - k.z * m.y) * s + k.x * d * (1 - c),
      m.y * c + (k.z * m.x - k.x * m.z) * s + k.y * d * (1 - c),
      m.z * c + (k.x * m.y - k.y * m.x) * s + k.z * d * (1 - c)
    );
  }
  function relax(m, timeMs, t1Ms = Infinity, t2Ms = Infinity, m0 = 1) {
    const e1 = Math.exp(-timeMs / t1Ms), e2 = Math.exp(-timeMs / t2Ms);
    return v(m.x * e2, m.y * e2, m0 + (m.z - m0) * e1);
  }
  function free(m, timeMs, offResHz = 0, t1Ms = Infinity, t2Ms = Infinity, m0 = 1) {
    return relax(rotate(m, v(0, 0, 1), -TAU * offResHz * timeMs / 1000), timeMs, t1Ms, t2Ms, m0);
  }
  function hardPulse(m, options) {
    const { b1MicroT, offResHz = 0, durationMs, phaseRad = 0,
      t1Ms = Infinity, t2Ms = Infinity, m0 = 1 } = options;
    const f1 = GAMMA_HZ_PER_UT * b1MicroT;
    const axis = v(f1 * Math.cos(phaseRad), f1 * Math.sin(phaseRad), offResHz);
    const rate = norm(axis);
    if (!durationMs) return { ...m };
    if (t1Ms === Infinity && t2Ms === Infinity) return rotate(m, axis, -TAU * rate * durationMs / 1000);
    // Exact rotations with symmetric relaxation splitting. Small fixed steps
    // resolve finite-pulse relaxation without a frame-rate dependent integrator.
    const stepMs = Math.min(0.01, rate > 0 ? 1000 / (160 * rate) : 0.01);
    const count = Math.max(1, Math.ceil(durationMs / stepMs)), dt = durationMs / count;
    let result = { ...m };
    for (let i = 0; i < count; i++) {
      result = relax(result, dt / 2, t1Ms, t2Ms, m0);
      result = rotate(result, axis, -TAU * rate * dt / 1000);
      result = relax(result, dt / 2, t1Ms, t2Ms, m0);
    }
    return result;
  }
  function pulseDurationMs(angleDeg, b1MicroT) {
    return angleDeg / 360 / (GAMMA_HZ_PER_UT * b1MicroT) * 1000;
  }
  function rfFrame(timeS, b1MicroT, rfMinusLarmorHz) {
    const f1 = GAMMA_HZ_PER_UT * b1MicroT;
    const axis = v(f1, 0, -rfMinusLarmorHz);
    const m = rotate(v(0, 0, 1), axis, -TAU * norm(axis) * timeS);
    return { m, axis, larmorM: rotate(m, v(0, 0, 1), -TAU * rfMinusLarmorHz * timeS) };
  }
  function spinEchoInitialMz(trMs, teMs, t1Ms) {
    // Steady state, ideal 90/180 pulses, residual transverse magnetization
    // spoiled before the next excitation. Includes T1 recovery inverted by 180.
    return 1 - 2 * Math.exp(-(trMs - teMs / 2) / t1Ms) + Math.exp(-trMs / t1Ms);
  }
  function isochromats(offResHz, spreadHz) {
    const offsets = spreadHz > 0 ? [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2] : [0];
    const total = offsets.reduce((sum, x) => sum + Math.exp(-x * x / 2), 0);
    return offsets.map(x => ({ hz: offResHz + x * spreadHz, weight: Math.exp(-x * x / 2) / total }));
  }
  function spinEcho(options, timeMs) {
    const { trMs, teMs, t1Ms, t2Ms, offResHz = 0, spreadHz = 35 } = options;
    const initialMz = spinEchoInitialMz(trMs, teMs, t1Ms), tau = teMs / 2;
    const members = isochromats(offResHz, spreadHz).map(member => {
      let m = free(v(0, initialMz, 0), Math.min(timeMs, tau), member.hz, t1Ms, t2Ms);
      if (timeMs >= tau) {
        m = rotate(m, v(1, 0, 0), -Math.PI);
        m = free(m, timeMs - tau, member.hz, t1Ms, t2Ms);
      }
      return { ...member, m };
    });
    const m = members.reduce((sum, member) => add(sum, scale(member.m, member.weight)), v(0, 0, 0));
    return { m, members, initialMz, signal: transverse(m), echoSignal: Math.abs(initialMz) * Math.exp(-teMs / t2Ms) };
  }
  function chemical(options, timeMs) {
    const { trMs, t1Ms, t2Ms, offResHz = 0, b0, fatFraction } = options;
    const initialMz = 1 - Math.exp(-trMs / t1Ms);
    const shiftHz = GAMMA_HZ_PER_UT * b0 * 3.5;
    const species = [
      { label: "Water", weight: 1 - fatFraction, hz: offResHz },
      { label: "Fat", weight: fatFraction, hz: offResHz - shiftHz }
    ].map(member => ({ ...member, m: free(v(0, initialMz * member.weight, 0), timeMs, member.hz, t1Ms, t2Ms, member.weight) }));
    const m = species.reduce((sum, member) => add(sum, member.m), v(0, 0, 0));
    return { m, species, initialMz, shiftHz, signal: transverse(m) };
  }
  function encodingTrajectory(parameters, frame, progress = frame.readoutProgress) {
    const { gridSize = 5, phaseDegPerRow, frequencyHzPerCol, readoutMs, preparationMs = 8 } = parameters;
    const span = gridSize * frequencyHzPerCol * readoutMs / 1000;
    const isReadout = frame.stage === "readout" || frame.stage === "rewind" || frame.stage === "complete";
    const preparation = isReadout ? 1 : frame.phaseProgress || 0;
    const kx = frame.phaseOnly ? 0 : isReadout ? span * (progress - 0.5) : -span / 2 * preparation;
    const ky = (frame.ky || 0) * phaseDegPerRow / (360 / gridSize) * preparation;
    const timeMs = isReadout ? preparationMs + progress * readoutMs : preparationMs * preparation;
    return { kx, ky, timeMs, span };
  }
  function encodingSignal(cells, parameters, frame, progress = frame.readoutProgress) {
    const trajectory = encodingTrajectory(parameters, frame, progress);
    const n = parameters.gridSize || 5;
    const decay = parameters.ignoreDecay ? 1 : Math.exp(-trajectory.timeMs / parameters.t2starMs);
    let real = 0, imaginary = 0, totalDensity = 0;
    for (const cell of cells) {
      const phase = -TAU * (trajectory.kx * cell.x + trajectory.ky * cell.y) / n;
      real += cell.density * decay * Math.cos(phase);
      imaginary += cell.density * decay * Math.sin(phase);
      totalDensity += cell.density;
    }
    return { real, imaginary, totalDensity, magnitude: Math.hypot(real, imaginary), phase: Math.atan2(imaginary, real), ...trajectory };
  }
  function cartesianGridMatches(parameters) {
    const n = parameters.gridSize || 5;
    return Math.abs(parameters.phaseDegPerRow - 360 / n) < 1e-8 &&
      Math.abs(n * parameters.frequencyHzPerCol * parameters.readoutMs / 1000 - (n - 1)) < 1e-8;
  }
  function inverseFourier(samples, x, y, n = 5) {
    let real = 0, imaginary = 0;
    for (const sample of samples) {
      const phase = TAU * (sample.kx * x + sample.ky * y) / n;
      real += sample.real * Math.cos(phase) - sample.imaginary * Math.sin(phase);
      imaginary += sample.real * Math.sin(phase) + sample.imaginary * Math.cos(phase);
    }
    real /= n * n; imaginary /= n * n;
    return { real, imaginary, magnitude: Math.hypot(real, imaginary), phase: Math.atan2(imaginary, real) };
  }
  return { GAMMA_HZ_PER_UT, v, add, scale, norm, transverse, rotate, relax, free, hardPulse,
    pulseDurationMs, rfFrame, spinEchoInitialMz, spinEcho, chemical,
    encodingTrajectory, encodingSignal, cartesianGridMatches, inverseFourier };
});
