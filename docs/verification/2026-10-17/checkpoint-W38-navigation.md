# W38 전체 연결·화면 점검

2026-10-17. 로컬 미커밋/미게시 상태다. [전체117시험](W38-tests.txt)은 모두 통과했다. [실제 Chrome 점검](checkpoint-W38-browser.json)은 학습/포털41개와 등록 보고서44개, 총85개 HTML의 두 화면170상태에서 HTTP200·h1·가로 넘침·JS 오류 검사를 통과했다. A05와 최근 챕터의 details를 펼쳤다. [링크 감사](checkpoint-W38-link-audit.json)는2,356개 참조와 중복 ID에서 오류0이다.

감사에서 로드맵 수식의 대괄호 다음 괄호가 Markdown 링크로 해석되는 것을 발견해 수식 표기를 바꾸고 재검증했다. [버전 변화](checkpoint-W38-versions.json)는 D03→A05 탐색 링크와 현재 루트 HTML 해시를 기록한다. D03의 원래 수치 모형/판정 범위는 그대로다. 외부 전문가 검토 상태를 확대하지 않는다. [재현 절차](checkpoint-W38-browser.js).
