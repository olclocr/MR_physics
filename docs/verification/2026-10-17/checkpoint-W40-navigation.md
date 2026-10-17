# W40 전체 연결·화면 점검

2026-10-17. 로컬 미커밋/미게시 상태다. [전체121시험](W40-tests.txt)은 모두 통과했다. [실제 Chrome 점검](checkpoint-W40-browser.json)은 학습/포털43개와 등록 보고서46개, 총89개 HTML의 두 화면178상태에서 HTTP200·h1·가로 넘침·JS 오류 검사를 통과했다. M01과 최근 챕터의 details를 펼쳤다. [링크 감사](checkpoint-W40-link-audit.json)는 현재 링크 참조와 중복 ID 검사를 기록한다.

[현재 루트 HTML 해시](checkpoint-W40-versions.json)에 탐색 변경을 기록한다. C01→M01의 탐색 링크는 추가했으며 기존 W01 물리 검증 파일의 역사적 해시는 덮어쓰지 않는다. 공통 이완 계산은 바뀌지 않았다. M01은 기본/잡음0 부분 통과이며 W40b의 noise/다중 성분은 남는다. [재현 절차](checkpoint-W40-browser.js).
