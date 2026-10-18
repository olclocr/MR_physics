# W97 · 선형 열손실/입력 시점 통합 검증

2026-10-18. [독립12조건·24개 실제 상태·내용 판정](X16-thermal-physics.md), [전체228개 시험](W97-tests.txt), [203개 HTML·406개 실제 통합 상태](checkpoint-W97-browser.json)가 통과했다. 학습·포털97개/보고서106개이며 JS 오류/페이지 가로 넘침0이다. [절차](checkpoint-W97-browser.js)·[5,876개 로컬 참조](checkpoint-W97-link-audit.json)의 누락0이다.

[왕복 탐색](W97-navigation-browser.js)·[결과](W97-navigation-browser.json)는 포털→새 페이지→흡수 파워 선행/후속 링크→보고서/접힌 목록을 두 화면에서 확인했다. 대표 온도/에너지 곡선·앞/뒤 입력·열손실0과 모바일 지표를 직접 읽었다.

[기존93개 manifest](checkpoint-W97-versions.json)는 흡수 파워 선행 HTML의 후속 링크 제거로 이전 SHA를 정확히 재현한1항목만 갱신했다. [새12개 입력](X16-thermal-versions.json)까지 현재94개 manifest/918개 입력이다. 기존 흡수 파워 자산은 바꾸지 않았고 연속10초 입력의 시각만 이동하여 재사용했다. 과거 전체 입력/문구 감사는 당시 버전 기록으로 보존한다.

W97은4bb4235 이후 로컬 개발이다. 다음W98, 후속W99/W100/W101이다. 다음10월19일01:45/06:50 예약과 Windows 보호를 유지하며 마지막 결과 전 완료 marker를 만들지 않는다.
