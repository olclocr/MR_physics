# W35 전체 연결·화면 점검

2026-10-17. 로컬 미커밋/미게시 상태다. [전체111시험](W35-tests.txt)은 모두 통과했다. [실제 Chrome 점검](checkpoint-W35-browser.json)은 학습/포털38개와 등록 보고서41개, 총79개 HTML의 두 화면158상태에서 HTTP200·h1·가로 넘침·JS 오류 검사를 통과했다. A02와 최근 챕터의 details를 펼쳤다. [링크 감사](checkpoint-W35-link-audit.json)는2,209개 참조와 중복 ID에서 오류0이다.

[버전 변화](checkpoint-W35-versions.json)는 D03→A02 탐색 링크 추가와 현재 루트 HTML 해시를 기록한다. D03의 물리 계산이나 실제 motion/eddy 미구현 상태는 바꾸지 않았다. 과거 판정·외부 전문가 검토 상태를 확대하지 않는다. [재현 절차](checkpoint-W35-browser.js).
