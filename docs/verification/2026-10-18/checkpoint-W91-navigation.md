# W91 · 유한 방출과 도달/T1 통합 검증

2026-10-18. [독립40조건·80개 실제 상태·내용 판정](X08-train-physics.md), [전체216개 시험](W91-tests.txt), [191개 HTML·382개 실제 상태](checkpoint-W91-browser.json)가 통과했다. 학습·포털91개와 보고서100개이며 JS 오류/페이지 가로 넘침은0이다. [절차](checkpoint-W91-browser.js), [5,345개 로컬 참조](checkpoint-W91-link-audit.json)의 누락은0이다.

[왕복 탐색](W91-navigation-browser.js)·[결과](W91-navigation-browser.json)는 포털→새 페이지→X08/X09 선행 페이지의 후속 링크→보고서/접힌 목록을 두 화면에서 확인했다. 대표 데스크톱/모바일 곡선과 지표를 직접 읽었다.

[기존87개 manifest](checkpoint-W91-versions.json)는 X08/X09 선행 HTML의 후속 링크만 허용하고 제거로 이전 SHA를 정확히 재현했다. 세 입력 항목을 갱신하고 [새12개 입력](X08-train-versions.json)을 별도로 고정했다. 현재88개 manifest/843개 입력이다. 과거 전체 입력/문구 감사는 당시 버전 기록이며 이후 후속 링크를 추가한 뒤 그대로 재실행하지 않는다. 기존 공통/순간 packet 자산은 바뀌지 않았다.

W91은 ef58ab4 이후 로컬 개발이다. 다음W92, 후속W93/W94/W95를 유지한다. 다음 승인 게시20:40, 마지막10월19일06:50 한국시간과 Windows 보호를 유지하며 마지막 결과 확인 전 완료 marker를 만들지 않는다.
