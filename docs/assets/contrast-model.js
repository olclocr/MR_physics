/* Educational ideal spin echo: ms, relative visible proton density, fixed M0 scale.
 * Shares the ideal steady-state longitudinal factor with the spin page. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./mr-physics-models.js"));
  else root.MRContrast = factory(root.MRPhysics);
})(typeof globalThis !== "undefined" ? globalThis : this, function (physics) {
  "use strict";
  const tissues = Object.freeze([
    Object.freeze({ id: "wm", name: "백질 WM", pd: .70, t1: 800, t2: 70, color: "#2563eb" }),
    Object.freeze({ id: "gm", name: "회백질 GM", pd: .85, t1: 1300, t2: 100, color: "#b45309" }),
    Object.freeze({ id: "csf", name: "뇌척수액 CSF", pd: 1, t1: 4000, t2: 2000, color: "#087f75" })
  ]);
  const presets = Object.freeze({
    t1: Object.freeze({ tr: 500, te: 15, label: "T1W 예시" }),
    pd: Object.freeze({ tr: 10000, te: 10, label: "PDW 예시" }),
    t2: Object.freeze({ tr: 6000, te: 100, label: "T2W 예시" })
  });
  function signal(tissue, tr, te, equalPD = false) {
    if (![tr, te, tissue.pd, tissue.t1, tissue.t2].every(Number.isFinite) || te < 0 || tr <= 0 || tr < te || tissue.t1 <= 0 || tissue.t2 <= 0 || tissue.pd < 0) {
      throw new RangeError("Finite positive relaxation times and TR >= TE >= 0 are required.");
    }
    const pd = equalPD ? 1 : tissue.pd;
    const recovery = physics.spinEchoInitialMz(tr, te, tissue.t1);
    const approxRecovery = 1 - Math.exp(-tr / tissue.t1);
    const decay = Math.exp(-te / tissue.t2);
    return { pd, recovery, approxRecovery, decay, signal: pd * Math.abs(recovery) * decay };
  }
  function signals(tr, te, equalPD = false) {
    return tissues.map(tissue => ({ ...tissue, ...signal(tissue, tr, te, equalPD) }));
  }
  function tissueAt(x, y) {
    // Schematic nested compartments and two CSF spaces; no clinical anatomy.
    if ((x / .88) ** 2 + (y / .97) ** 2 > 1) return null;
    if ((x / .84) ** 2 + (y / .92) ** 2 > 1) return "csf";
    if (((Math.abs(x) - .13) / .09) ** 2 + ((y + .06) / .26) ** 2 < 1) return "csf";
    if ((x / .70) ** 2 + (y / .77) ** 2 < 1) return "wm";
    return "gm";
  }
  return { tissues, presets, signal, signals, tissueAt };
});
