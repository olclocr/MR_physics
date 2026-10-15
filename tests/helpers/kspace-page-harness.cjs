// Run with: node --test tests/kspace_inverse_fourier.test.cjs
// Exercise the standalone page without a browser or third-party dependencies.
// The canvas stub checks drawing arguments; this does not verify visual layout.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const pagePath = path.join(__dirname, "../../docs/kspace_inverse_fourier.html");
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


module.exports={loadPage};
