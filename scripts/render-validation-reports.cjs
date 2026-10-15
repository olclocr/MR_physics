// Dependency-free renderer for the Markdown subset used by our audit reports.
// Source Markdown remains the canonical, GitHub-renderable document.
const fs = require('node:fs');
const path = require('node:path');
const folder = path.resolve(__dirname, '../docs/verification/2026-10-14');
const escape = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function inline(text) {
  const tokens=[];
  text=text.replace(/`([^`]+)`/g,(_,code)=>{tokens.push(`<code>${escape(code)}</code>`);return `@@TOKEN${tokens.length-1}@@`;});
  text=escape(text);
  text=text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,alt,url)=>`<img src="${url}" alt="${alt}" loading="lazy">`);
  text=text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{
    if (!/^[a-z]+:/i.test(url)) url=url.replace(/\.md(?=$|#)/,'.html');
    return `<a href="${url}">${label}</a>`;
  });
  text=text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  return text.replace(/@@TOKEN(\d+)@@/g,(_,i)=>tokens[Number(i)]);
}
function render(markdown) {
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
const requested = new Set(process.argv.slice(2));
const documents = [['README.md','index.html'],['original-review.md','original-review.html'],['fix-validation.md','fix-validation.html'],
  ...['B00','B02','B03','B04'].map(id => [`${id}-physics.md`, `${id}-physics.html`])];
let rendered = 0;
for(const [source,target] of documents) {
  if (requested.size && !requested.has(source)) continue;
  const markdown=fs.readFileSync(path.join(folder,source),'utf8');
  const title=markdown.match(/^# (.+)/m)?.[1]||'검증 보고서';
  const html=`<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>${css}</style></head><body><main><nav><a href="../../index.html">시뮬레이션 홈</a><a href="index.html">검증 기록</a><a href="original-review.html">수정 전 보고서</a><a href="fix-validation.html">수정 후 검산</a><a href="${source}">Markdown 원문</a></nav>${render(markdown)}<footer>2026-10-14 · MR Physics 과학 검증 기록</footer></main></body></html>\n`;
  fs.writeFileSync(path.join(folder,target),html);
  rendered++;
}
console.log(`Rendered ${rendered} verification documents.`);
