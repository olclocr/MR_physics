# W84 · 두 입력의 지연 반응 겹침 통합 검증

2026-10-18. [독립 18조건·36개 실제 상태·내용 판정](X09-overlap-physics.md), [전체 206개 시험](W84-tests.txt), [179개 HTML·358개 실제 통합 상태](checkpoint-W84-browser.json)가 통과했다. 학습 86개·보고서 93개이며 JS 오류·페이지 가로 넘침은 없었다. [절차](checkpoint-W84-browser.js), [4,825개 로컬 참조](checkpoint-W84-link-audit.json)의 누락은 0이다.

[왕복 탐색](W84-navigation-browser.js)·[결과](W84-navigation-browser.json)는 포털→새 페이지→X09/X04 선행 페이지와 후속 왕복→보고서/접힌 목록을 두 화면에서 확인했다. 대표 성분/합 곡선과 모바일 본문·보고서를 직접 읽었다.

[기존 80개 manifest](checkpoint-W84-versions.json)는 X09/X04 학습 HTML의 후속 링크 추가만 허용하고 링크 제거로 이전 바이트 SHA를 정확히 재현했다. 기존 지연 반응 계산 자산은 바뀌지 않았다. [새 모형 11개 입력](X09-overlap-versions.json)과 과거 판정 범위를 구별한다. 과거 체크포인트의 전체 입력 감사는 당시 버전 기록이며 후속 탐색 링크 변경 뒤 그대로 재실행하지 않는다.

W84는 ef58ab4 게시 이후 로컬 개발이며 공개 게시 완료라고 표현하지 않는다. 다음 W85, 후속 W86/W87/W88이다. 다음 승인 게시는 20:40, 마지막은 10월 19일 06:50 한국시간이다. Windows 보호 완료 marker를 만들지 않았다.
