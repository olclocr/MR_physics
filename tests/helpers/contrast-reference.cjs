// Independent on-resonance Bloch ODE integration, ms and M0=1.
// No imports from the production model and no SE steady-state formula.
function relaxRK4(start, duration, t1, t2, maxStep = .5) {
  const steps = Math.max(1, Math.ceil(duration / maxStep)), dt = duration / steps;
  const derivative = m => [-m[0] / t2, -m[1] / t2, (1 - m[2]) / t1];
  const shifted = (m, k, scale) => m.map((v, i) => v + scale * k[i]);
  let m = [...start];
  for (let i = 0; i < steps; i++) {
    const k1 = derivative(m);
    const k2 = derivative(shifted(m, k1, dt / 2));
    const k3 = derivative(shifted(m, k2, dt / 2));
    const k4 = derivative(shifted(m, k3, dt));
    m = m.map((v, j) => v + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return m;
}
function repeatedEcho(tissue, tr, te, maxStep = .5) {
  function cycle(initialZ) {
    // Right-handed axes and dM/dt=gamma M x B; a -90 degree x rotation gives +y.
    const after90 = [0, initialZ, 0];
    const before180 = relaxRK4(after90, te / 2, tissue.t1, tissue.t2, maxStep);
    const after180 = [before180[0], -before180[1], -before180[2]];
    const echo = relaxRK4(after180, te / 2, tissue.t1, tissue.t2, maxStep);
    const beforeNext90 = relaxRK4(echo, tr - te, tissue.t1, tissue.t2, maxStep);
    return {recovery: beforeNext90[2], echo: Math.hypot(echo[0], echo[1]), before180Z: before180[2], after180Z: after180[2]};
  }
  const first = cycle(1);
  // Set transverse components to zero before the next excitation (perfect spoiling).
  const second = cycle(first.recovery);
  return {first, second};
}
module.exports = {relaxRK4, repeatedEcho};
