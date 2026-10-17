"""Read-only local HTML/Markdown link and duplicate-ID audit for this checkpoint."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re

root = Path(__file__).resolve().parents[3]
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.links=[]; self.ids=[]; self.feed(source)
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value is None: continue
            if key in ('href','src'): self.links.append(value)
            if key == 'id': self.ids.append(value)

html_files = sorted((root/'docs').rglob('*.html'))
pages = {p: Page(p.read_text(encoding='utf-8-sig')) for p in html_files}
sources = {p: v.links for p,v in pages.items()}
for p in [root/'README.md',root/'docs/learning-roadmap.md',root/'docs/physics-validation-plan.md']:
    sources[p] = re.findall(r'\]\(([^)\s]+)(?:\s+[^)]*)?\)',p.read_text(encoding='utf-8-sig'))
checked=0; errors=[]
for p,links in sources.items():
    for link in links:
        u=urlsplit(link.strip('<>'))
        if u.scheme or u.netloc or not u.path and not u.fragment: continue
        target=(p.parent/unquote(u.path)).resolve() if u.path else p
        checked+=1
        if not target.exists(): errors.append({'source':str(p.relative_to(root)),'link':link,'reason':'missing file'})
        elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
            errors.append({'source':str(p.relative_to(root)),'link':link,'reason':'missing static anchor'})
for p,parsed in pages.items():
    duplicate=sorted({i for i in parsed.ids if parsed.ids.count(i)>1})
    if duplicate: errors.append({'source':str(p.relative_to(root)),'reason':'duplicate IDs','ids':duplicate})
result={'htmlFiles':len(html_files),'localReferences':checked,'errors':errors}
Path(__file__).with_suffix('.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
