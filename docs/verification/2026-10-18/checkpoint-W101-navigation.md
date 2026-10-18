# W101 · 정확한 좌표/가정 간격 통합 검증

2026-10-18. [독립12조건·24개 실제 상태·내용 판정](X17-spacing-physics.md), [전체236개 시험](W101-tests.txt), [211개 HTML·422개 실제 통합 상태](checkpoint-W101-browser.json)가 통과했다. 학습·포털101개/보고서110개이며 JS 오류/페이지 가로 넘침0이다. [절차](checkpoint-W101-browser.js)·[6,274개 로컬 참조](checkpoint-W101-link-audit.json)의 누락0이다.

[왕복 탐색](W101-navigation-browser.js)·[결과](W101-navigation-browser.json)는 포털→새 페이지→두 선행 페이지의 후속 링크→보고서/접힌 목록을 두 화면에서 확인했다. 데스크톱 기본과 모바일 행 간격 오류/정확한 환산 지표/열 간격 오류의 대각선을 직접 읽었다. 표 값/스크롤은 실제 브라우저 자동 대조다.

기존97개 manifest/972입력은 [후속 링크 제거로 이전 SHA를 정확히 재현한2항목](checkpoint-W101-versions.json)만 갱신했다. [새11개 입력](X17-spacing-versions.json)을 포함하여 현재98개 manifest/983입력이다. 공통 계산 자산은 바꾸지 않았고 과거 감사는 당시 버전 기록으로 보존한다.

W101은4bb4235 이후 로컬 개발이다. 다음W102, 후속W103/W104/W105이다. 10월19일01:45/06:50 예약과 Windows 보호를 유지하며 마지막 결과 전 완료 marker를 만들지 않는다.
