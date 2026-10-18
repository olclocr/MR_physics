const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {buildReports, renderReports, parseArgs} = require('../scripts/render-validation-reports.cjs');
const catalog = require('../scripts/validation-reports.json');

test('every registered report has a source and an up-to-date HTML with resolvable links', () => {
  for (const date of Object.keys(catalog.dates)) {
    for (const doc of buildReports({date})) {
      assert.equal(fs.readFileSync(doc.target, 'utf8').replace(/\r\n/g, '\n'), doc.html, doc.target);
    }
  }
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-reports-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const baseDir = path.join(root, 'docs/verification');
  const reports = {defaultDate: '2026-10-14', dates: {}};
  for (const date of ['2026-10-14', '2026-10-15']) {
    reports.dates[date] = [
      {source: 'README.md', target: 'index.html', label: '기록'},
      {source: 'review.md', target: 'review.html', label: '검토'}
    ];
    const folder = path.join(baseDir, date);
    fs.mkdirSync(folder, {recursive: true});
    fs.writeFileSync(path.join(folder, 'README.md'), '# 기록\n\n[검토](review.md)\n');
    fs.writeFileSync(path.join(folder, 'review.md'), '# 검토\n\n[기록](README.md)\n');
  }
  fs.writeFileSync(path.join(root, 'docs/index.html'), '<h1>홈</h1>');
  return {baseDir, reports};
}

test('explicit dates and partial selection preserve other dates and map only registered Markdown links', t => {
  const options = fixture(t);
  renderReports(options);
  const prior = path.join(options.baseDir, '2026-10-14/index.html');
  const original = fs.readFileSync(prior, 'utf8');
  const folder = path.join(options.baseDir, '2026-10-15');
  fs.writeFileSync(path.join(folder, 'notes.md'), '# 참고');
  fs.writeFileSync(path.join(folder, 'review.md'), '# 새 검토\n\n[기록](README.md) / [근거](notes.md) / [이전](../2026-10-14/review.md)\n');
  renderReports({...options, date: '2026-10-15'});
  const output = renderReports({...options, date: '2026-10-15', sources: ['review.md']});
  assert.equal(output.length, 1);
  assert.match(output[0].html, /href="index.html"/);
  assert.match(output[0].html, /href="notes.md"/);
  assert.match(output[0].html, /href="..\/2026-10-14\/review.html"/);
  assert.match(output[0].html, /<footer>2026-10-15/);
  assert.equal(fs.readFileSync(prior, 'utf8'), original);
});

test('missing inputs and local assets fail before any report is overwritten', t => {
  const options = fixture(t);
  const folder = path.join(options.baseDir, options.reports.defaultDate);
  const first = path.join(folder, 'index.html');
  const second = path.join(folder, 'review.html');
  fs.writeFileSync(first, 'preserved index');
  fs.writeFileSync(second, 'preserved review');
  const source = path.join(folder, 'review.md');
  fs.unlinkSync(source);
  assert.throws(() => renderReports(options), /ENOENT/);
  fs.writeFileSync(source, '# 검토\n\n![누락](missing.jpg)\n');
  assert.throws(() => renderReports(options), /Missing report link:.*missing.jpg/);
  assert.equal(fs.readFileSync(first, 'utf8'), 'preserved index');
  assert.equal(fs.readFileSync(second, 'utf8'), 'preserved review');
});

test('unknown date, source and options fail instead of silently selecting zero reports', t => {
  const options = fixture(t);
  assert.throws(() => buildReports({...options, date: '2026-10-16'}), /Unregistered report date/);
  assert.throws(() => buildReports({...options, sources: ['B00-physics.md']}), /Unregistered report source/);
  assert.throws(() => parseArgs(['--date']), /YYYY-MM-DD/);
  assert.throws(() => parseArgs(['--unknown']), /Unknown option/);
  assert.deepEqual(parseArgs(['--date', '2026-10-15', 'review.md']), {date: '2026-10-15', sources: ['review.md']});
});

test('Pages report links use existing repository sources without moving local assets or hiding missing files', t => {
  const options = fixture(t);
  renderReports(options);
  options.reports.repositorySourceBase = 'https://github.com/example/learning/blob/main/';
  const repoRoot = path.resolve(options.baseDir, '../..');
  fs.mkdirSync(path.join(repoRoot, 'tests'), {recursive: true});
  fs.mkdirSync(path.join(repoRoot, 'docs/assets'), {recursive: true});
  fs.writeFileSync(path.join(repoRoot, 'tests/independent oracle.cjs'), 'module.exports = 1;');
  fs.writeFileSync(path.join(repoRoot, 'docs/assets/model.js'), 'const value = 1;');
  const source = path.join(options.baseDir, options.reports.defaultDate, 'review.md');
  fs.writeFileSync(source, '# Sources\n\n[Oracle](../../../tests/independent oracle.cjs#L1) / [Local](../../assets/model.js) / [Report](README.md)\n');
  const result = buildReports({...options, sources: ['review.md']})[0];
  assert.match(result.html, /href="https:\/\/github.com\/example\/learning\/blob\/main\/tests\/independent%20oracle.cjs#L1"/);
  assert.match(result.html, /href="..\/..\/assets\/model.js"/);
  assert.match(result.html, /href="index.html"/);
  fs.writeFileSync(source, '# Missing\n\n[Missing](../../../tests/missing.cjs)\n');
  assert.throws(() => buildReports({...options, sources: ['review.md']}), /Missing report link/);
});

test('fingerprint explanation links to the configured report across dates and rejects missing or outside paths', t => {
  const options=fixture(t);
  renderReports({...options,date:'2026-10-15'});
  options.reports.publicationFingerprintReport='2026-10-15/review.md';
  const output=buildReports(options);
  assert.match(output[0].html, /class="fingerprint-note"/);
  assert.match(output[0].html, /href="..\/2026-10-15\/review.html">게시 바이트 대조/);
  options.reports.publicationFingerprintReport='missing.md';
  assert.throws(()=>renderReports(options),/Missing fingerprint report/);
  options.reports.publicationFingerprintReport='../index.html';
  assert.throws(()=>renderReports(options),/inside the verification/);
});
