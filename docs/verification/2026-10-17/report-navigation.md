# 보고서 탐색 보강

2026-10-17. UI 배치만 변경했으며 과거 챕터 물리 판정의 범위를 확대하지 않았다.

보고서가 4개를 넘으면 목록을 native details로 접는다. 2026-10-16의 7개 보고서에 적용했다. 2026-10-14(4개)와 2026-10-15(27개)는 기존 분기가 유지된다. 모바일 390px에서 Q06 h1의 y좌표는 변경 전 약388px, 변경 후150.19px이다. 데스크톱은162.19px이다.

[실제 Chrome 검사](report-navigation-browser.json), [재현 절차](report-navigation-browser.js), [모바일 화면](report-nav-390.png), [펼친 목록](report-nav-expanded-390.png)을 확인했다. Enter 펼침, 현재 항목 aria-current, Q05로 이동, 가로 넘침 없음을 두 화면에서 확인했다. [변경 직후 전체105시험](resume-baseline-tests.txt)은 통과했다. 이후 회귀 결과는 각 작업의 최종 시험 기록을 따른다.
