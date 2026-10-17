// Dependency-free renderer for the Markdown subset used by our audit reports.
// Source Markdown remains the canonical, GitHub-renderable document.
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('./validation-reports.json');
const escape = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function renderInline(text, resolveLink) {
  const tokens=[];
  text=text.replace(/`([^`]+)`/g,(_,code)=>{tokens.push(`<code>${escape(code)}</code>`);return `@@TOKEN${tokens.length-1}@@`;});
  text=escape(text);
  text=text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,alt,url)=>`<img src="${url}" alt="${alt}" loading="lazy">`);
  text=text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{
    url=resolveLink(url);
    return `<a href="${url}">${label}</a>`;
  });
  text=text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  return text.replace(/@@TOKEN(\d+)@@/g,(_,i)=>tokens[Number(i)]);
}
function render(markdown, resolveLink) {
  const inline = text => renderInline(text, resolveLink);
  const lines=markdown.replace(/\r/g,'').split('\n'),out=[];
  for(let i=0;i<lines.length;) {
    const line=lines[i];
    if (!line.trim()) {i++;continue;}
    if (line.startsWith('```')) {
      const code=[];i++;while(i<lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);i++;
      out.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`);continue;
    }
    const heading=line.match(/^(#{1,6}) (.+)$/);
    if(heading){out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);i++;continue;}
    if(line.startsWith('|') && /^[\s|:-]+$/.test(lines[i+1]||'')) {
      const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>inline(x.trim()));
      const header=cells(line);i+=2;const rows=[];
      while(i<lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]));
      out.push(`<div class="table"><table><thead><tr>${header.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if(/^([-*] |\d+\. )/.test(line)) {
      const ordered=/^\d+\./.test(line),tag=ordered?'ol':'ul',items=[];
      const pattern=ordered?/^\d+\. (.*)$/:/^[-*] (.*)$/;
      while(i<lines.length && pattern.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(pattern,'$1'))}</li>`);
      out.push(`<${tag}>${items.join('')}</${tag}>`);continue;
    }
    if(line.startsWith('> ')){out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);i++;continue;}
    if(/^---+$/.test(line.trim())){out.push('<hr>');i++;continue;}
    const paragraph=[line];i++;
    while(i<lines.length && lines[i].trim() && !/^(#|```|[-*] |\d+\. |> |\|)/.test(lines[i])) paragraph.push(lines[i++]);
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return out.join('\n');
}
const css=`body{margin:0;background:#f7f9fc;color:#172033;font:16px/1.85 system-ui,"Malgun Gothic",sans-serif}main{max-width:960px;margin:auto;padding:36px 24px 72px}nav{display:flex;gap:18px;flex-wrap:wrap;border-bottom:1px solid #d8e0eb;padding-bottom:20px;margin-bottom:28px}a{color:#1b5fc3}h1{font-size:32px;line-height:1.3}h2{margin-top:40px}p,li{overflow-wrap:anywhere}p:has(>strong:first-child){margin-top:28px}code{background:#eaf0f7;border-radius:4px;padding:2px 5px;font-size:.92em}pre{background:#172033;color:#e7edf5;padding:20px;overflow:auto;line-height:1.55;border-radius:8px}pre code{background:none;padding:0}img{display:block;max-width:100%;height:auto;border:1px solid #d8e0eb;border-radius:8px;margin:20px auto}.table{overflow:auto}table{width:100%;border-collapse:collapse;background:white}th,td{border:1px solid #d8e0eb;text-align:left;padding:10px 14px}th{background:#eaf0f7}blockquote{margin:20px 0;padding:12px 20px;background:#e8f0ff;border-left:4px solid #2563eb}footer{margin-top:50px;color:#627189;font-size:14px}@media(max-width:600px){main{padding:24px 16px}h1{font-size:26px}}`;
// Only registered Markdown reports have HTML counterparts. Keep other Markdown links intact.
function buildReports({baseDir = path.resolve(__dirname, '../docs/verification'), reports = catalog,
  date = reports.defaultDate, sources = []} = {}) {
  if (!Object.hasOwn(reports.dates, date)) throw new Error(`Unregistered report date: ${date}`);
  const documents = reports.dates[date];
  for (const source of sources) {
    if (!documents.some(doc => doc.source === source)) throw new Error(`Unregistered report source: ${source} (${date})`);
  }
  const folder = path.join(baseDir, date);
  const targets = new Map(Object.entries(reports.dates).flatMap(([day, docs]) =>
    docs.map(doc => [path.resolve(baseDir, day, doc.source), path.resolve(baseDir, day, doc.target)])));
  const resolveLink = url => {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) return url;
    const [, file, suffix] = url.match(/^([^?#]*)(.*)$/);
    const target = targets.get(path.resolve(folder, file));
    return target ? path.relative(folder, target).split(path.sep).join('/') + suffix : url;
  };
  // Read every registered input before rendering or writing anything, including on partial runs.
  const inputs = documents.map(doc => ({...doc, markdown: fs.readFileSync(path.join(folder, doc.source), 'utf8')}));
  const selected = inputs.filter(doc => !sources.length || sources.includes(doc.source));
  const output = selected.map(({source, target, markdown}) => {
    const title=markdown.match(/^# (.+)/m)?.[1]||'검증 보고서';
    const compact=documents.length>4;
    const nav=documents.map(doc => `<a href="${escape(doc.target)}"${compact&&doc.target===target?' aria-current="page"':''}>${escape(doc.label)}</a>`).join('');
    const extraCss=compact?'.report-list{flex-basis:100%}.report-list summary{cursor:pointer;font-weight:700}.report-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px 18px;margin-top:14px}.report-links a[aria-current=page]{font-weight:700}summary:focus-visible{outline:3px solid #7c3aed;outline-offset:4px}':'';
    const navigation=compact?`<a href="../../index.html">시뮬레이션 홈</a><a href="${escape(source)}">Markdown 원문</a><details class="report-list"><summary>검증 보고서 목록 (${documents.length})</summary><div class="report-links">${nav}</div></details>`:`<a href="../../index.html">시뮬레이션 홈</a>${nav}<a href="${escape(source)}">Markdown 원문</a>`;
    const html=`<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>${css}${extraCss}</style></head><body><main><nav>${navigation}</nav>${render(markdown, resolveLink)}<footer>${escape(date)} · MR Physics 과학 검증 기록</footer></main></body></html>\n`;
    return {source: path.join(folder, source), target: path.join(folder, target), html};
  });
  const generated = new Set(output.map(doc => path.resolve(doc.target)));
  for (const doc of output) {
    for (const [, url] of doc.html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue;
      const local = path.resolve(folder, url.split(/[?#]/)[0]);
      if (!generated.has(local) && !fs.existsSync(local)) throw new Error(`Missing report link: ${doc.source} -> ${url}`);
    }
  }
  return output;
}
function renderReports(options) {
  const output = buildReports(options);
  for (const doc of output) fs.writeFileSync(doc.target, doc.html);
  return output;
}
function parseArgs(args) {
  let date = catalog.defaultDate;
  const sources = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(args[i + 1] || '')) throw new Error('--date requires YYYY-MM-DD');
      date = args[++i];
    } else if (args[i].startsWith('-')) throw new Error(`Unknown option: ${args[i]}`);
    else sources.push(args[i]);
  }
  return {date, sources};
}
if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const output = renderReports(options);
    console.log(`Rendered ${output.length} verification documents (${options.date}).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {buildReports, renderReports, parseArgs};
