// Run with: node --test tests/kspace_inverse_fourier.test.cjs
// Exercise the standalone page without a browser or third-party dependencies.
// The canvas stub checks drawing arguments; this does not verify visual layout.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const pagePath = path.join(__dirname, "../docs/kspace_inverse_fourier.html");
const html = fs.readFileSync(pagePath, "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function loadPage() {
  let frameId = 0;
  const frames = new Map();
  const canvas = new Proxy({}, {
    get(target, prop) {
      return target[prop] || ((...args) => {
        for (const arg of args) if (typeof arg === "number") assert.ok(Number.isFinite(arg), `nonfinite canvas argument: ${prop}`);
      });
    }
  });
  function element(id, attrs = "") {
    const listeners = new Map();
    return {
      id, type: attrs.match(/type="([^"]+)"/)?.[1], value: "", checked: false, hidden: false,
      width: 360, height: 360, textContent: "", attributes: {}, dataset: {},
      classList: { toggle() {} }, focus() {},
      addEventListener(name, listener) { listeners.set(name, listener); },
      setAttribute(name, value) { this.attributes[name] = value; },
      getContext() { return canvas; },
      getBoundingClientRect() { return { left: 0, top: 0, width: 360, height: 360 }; },
      fire(name, extra = {}) { assert.ok(listeners.has(name), `${id}: ${name} listener`); listeners.get(name)({ preventDefault() {}, ...extra }); }
    };
  }
  const elements = Object.fromEntries(ids.map(id => {
    const attrs = html.match(new RegExp(`<[^>]*\\bid="${id}"[^>]*>`))[0];
    return [id, element(id, attrs)];
  }));
  const modeButtons = ["component", "sum", "mask"].map(mode => Object.assign(element(mode), { dataset: { mode } }));
  const presets = [...html.matchAll(/data-k="([^"]+)"/g)].map(match => Object.assign(element(match[1]), { dataset: { k: match[1] } }));
  const document = {
    getElementById(id) { assert.ok(elements[id], `missing element ${id}`); return elements[id]; },
    querySelectorAll(selector) { return selector === "[data-mode]" ? modeButtons : selector === "[data-k]" ? presets : []; },
    addEventListener() {}, hidden: false
  };
  const sandbox = vm.createContext({
    document, window: { devicePixelRatio: 1.5, addEventListener() {} },
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame(id) { frames.delete(id); }
  });
  vm.runInContext(script, sandbox, { filename: pagePath });
  return {
    elements, modeButtons, presets, frames,
    run(source) { return vm.runInContext(source, sandbox); },
    tick(time) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); }
  };
}

test("HTML IDs, labels and local navigation resolve", () => {
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/\bfor="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
  for (const filename of ["index.html", "frequency_phase_encoding_visualization.html", "kspace_inverse_fourier.html"]) {
    const sourcePath = path.join(__dirname, "../docs", filename);
    const source = fs.readFileSync(sourcePath, "utf8");
    for (const match of source.matchAll(/href="([^"#:]+\.html)"/g)) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(sourcePath), match[1])), `broken link ${match[1]}`);
    }
  }
});

test("all original patterns round-trip, conserve energy, and have real-image conjugate symmetry", () => {
  const page = loadPage();
  for (const pattern of ["phantom", "bars", "spot", "uniform"]) {
    const result = page.run(`
      state.pattern = "${pattern}"; computeKspace(); state.mode = "mask"; state.mask = "full";
      (() => {
        const image = inverseSum(activeCoefficients());
        const symmetry = Math.max(...samples.map(s => Math.hypot(s.real - partner(s).real, s.imaginary + partner(s).imaginary)));
        const inputEnergy = original.reduce((sum, v) => sum + v * v, 0);
        const kEnergy = samples.reduce((sum, s) => sum + s.magnitude ** 2, 0) / TOTAL;
        return { error: nrmse(image), symmetry, energyError: Math.abs(inputEnergy - kEnergy), dc: sampleMap.get("0,0").real / TOTAL, mean: original.reduce((a,b) => a+b, 0) / TOTAL };
      })()`);
    assert.ok(result.error < 1e-12, `${pattern} round-trip`);
    assert.ok(result.symmetry < 1e-10, `${pattern} conjugate symmetry`);
    assert.ok(result.energyError < 1e-10, `${pattern} Parseval normalization`);
    assert.ok(Math.abs(result.dc - result.mean) < 1e-12);
  }
});

test("a single complex component has constant magnitude; edited conjugate pairs stay real", () => {
  const page = loadPage();
  const result = page.run(`
    state.mode = "component"; state.kx = 2; state.ky = 1; state.gain = 1.7; state.phaseOffset = 65; state.includeDC = false;
    (() => {
      const s = sampleMap.get("2,1");
      const coefficient = effectiveCoefficient(s);
      const single = inverseSum(new Map([[s, coefficient]]));
      const amplitude = Math.hypot(coefficient.real, coefficient.imaginary) / TOTAL;
      const constantError = Math.max(...single.real.map((v,i) => Math.abs(Math.hypot(v, single.imaginary[i]) - amplitude)));
      const paired = inverseSum(activeCoefficients());
      return { constantError, imaginary: Math.max(...paired.imaginary.map(Math.abs)), count: activeCoefficients().size };
    })()`);
  assert.ok(result.constantError < 1e-12);
  assert.ok(result.imaginary < 1e-12);
  assert.equal(result.count, 2);
  for (const [kx, ky] of [[0, 0], [-8, 0], [0, -8], [-8, -8]]) {
    page.run(`state.kx = ${kx}; state.ky = ${ky}; state.includeDC = true; render();`);
    assert.equal(page.elements.phaseOffset.disabled, true);
    assert.equal(page.run("activeCoefficients().size"), kx === 0 && ky === 0 ? 1 : 2);
    assert.ok(Math.abs(page.run("effectiveCoefficient(sampleMap.get(key(state.kx, state.ky))).imaginary")) < 1e-12);
  }
});

test("center and outer reconstruction orders cover every sample once and yield the same final image", () => {
  const page = loadPage();
  for (const order of ["center", "outer"]) {
    const result = page.run(`
      state.mode = "sum"; state.order = "${order}"; buildGroups(); state.progress = groups.length;
      ({ groups: groups.length, unique: new Set(groups.flat()).size, total: groups.flat().length, error: nrmse(inverseSum(activeCoefficients())) })`);
    assert.equal(result.groups, 130);
    assert.equal(result.unique, 256);
    assert.equal(result.total, 256);
    assert.ok(result.error < 1e-12);
  }
});

test("low and high masks are complementary; alternating ky produces the expected half-FOV fold", () => {
  const page = loadPage();
  for (const pattern of ["phantom", "spot", "bars"]) {
    const result = page.run(`
      state.pattern = "${pattern}"; computeKspace(); state.mode = "mask"; state.cutoff = 2;
      (() => {
        state.mask = "low"; const lowCount = activeCoefficients().size; const low = inverseSum(activeCoefficients());
        state.mask = "high"; const highCount = activeCoefficients().size; const high = inverseSum(activeCoefficients());
        const complementError = Math.max(...original.map((v,i) => Math.hypot(low.real[i] + high.real[i] - v, low.imaginary[i] + high.imaginary[i])));
        state.mask = "alternate"; const foldCount = activeCoefficients().size; const fold = inverseSum(activeCoefficients());
        const foldError = Math.max(...original.map((v,i) => {
          const shifted = ((Math.floor(i / N) + HALF) % N) * N + i % N;
          return Math.hypot(fold.real[i] - (v + original[shifted]) / 2, fold.imaginary[i]);
        }));
        return { lowCount, highCount, foldCount, complementError, foldError };
      })()`);
    assert.equal(result.lowCount, 25);
    assert.equal(result.highCount, 231);
    assert.equal(result.foldCount, 128);
    assert.ok(result.complementError < 1e-12);
    assert.ok(result.foldError < 1e-12);
  }
});

test("uniform brightness has only DC; a single off-center pixel needs all spatial frequencies", () => {
  const page = loadPage();
  page.run('state.pattern = "uniform"; computeKspace();');
  assert.equal(page.run("samples.filter(s => s.magnitude > EPSILON).length"), 1);
  assert.equal(page.run('sampleMap.get("0,0").real'), 256);
  page.run('state.pattern = "spot"; computeKspace();');
  assert.ok(page.run("samples.every(s => Math.abs(s.magnitude - 1) < 1e-12)"));
});

test("page controls, keyboard selection, animation completion and reset stay consistent", () => {
  const page = loadPage();
  assert.equal(page.elements.componentControls.hidden, false);
  page.elements.kspace.fire("keydown", { key: "Home" });
  assert.equal(page.run("state.kx + state.ky"), 0);
  page.elements.kspace.fire("keydown", { key: "ArrowUp" });
  assert.equal(page.run("state.ky"), 1);
  page.elements.nextStage.fire("click");
  assert.equal(page.run("state.mode"), "sum");
  assert.equal(page.elements.sumControls.hidden, false);
  page.elements.playPause.fire("click");
  for (let time = 0; page.frames.size && time < 20000; time += 100) page.tick(time);
  assert.equal(page.run("state.running"), false);
  assert.equal(page.elements.countMetric.textContent, "256 / 256");
  assert.equal(page.elements.errorMetric.textContent, "0.00%");
  assert.equal(page.frames.size, 0);
  page.elements.previous.fire("click");
  assert.equal(page.run("state.progress"), 129);
  page.elements.complete.fire("click");
  assert.equal(page.run("state.progress"), 130);
  page.elements.nextStage.fire("click");
  page.elements.mask.value = "low";
  page.elements.mask.fire("change");
  assert.equal(page.elements.cutoffRow.hidden, false);
  assert.equal(page.elements.countMetric.textContent, "25 / 256");
  page.elements.imageView.value = "magnitude";
  page.elements.imageView.fire("change");
  assert.equal(page.run("state.imageView"), "magnitude");
  page.elements.reset.fire("click");
  assert.equal(page.run("state.mode"), "component");
  assert.equal(page.elements.countMetric.textContent, "3 / 256");
  assert.equal(page.elements.imageView.value, "real");
  assert.equal(page.frames.size, 0);
});
