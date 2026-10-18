# W109 · 포화 모멘트와 장 척도의 구분

2026-10-19. **지정된 두 문구의 설명 수정/기존 모형 보존 검증 통과.** W105에서 발견한 μsat=.001A·m²/Bc=1T의 모호한 나열을 ‘포화 모멘트 μsat=.001 A·m²와 장 척도 Bc=1 T를 각각 정의’하는 문장으로 고쳤다. B=1 T에서 B/Bc=1이라는 설명도 완전한 문장으로 구분했다. 기존 상수/식/계산/입력값·정답을 바꾸지 않았다.

실제 코드의 momentLimitAm2=.001/scaleT=1과 선형 α=.001 A·m²/T를 대조했다. μsat는 A·m², Bc는 T, μsat/Bc는 A·m²/T이고 B/Bc는 무차원이다. Bc=1 T에서 B=1 T는 작은 장 극한이 아니다. Ueff=−μsatBc ln cosh(B/Bc)의 단위는J이며 기존 힘/일 적분 의미를 유지한다.

[Fitzpatrick 원전](https://farside.ph.utexas.edu/teaching/sm1/lectures/node62.html)의 tanh 응답/작은 장/포화/약한 상호작용 범위를 다시 읽었다. 원전은 spin1/2의 미시적 배경이며 여기 직접 정한 거시적 계수/실제 재질/장비의 출처로 확대하지 않는다.

[편집 전102개 manifest/1,043입력](W109-before-versions.json)과 [두 리터럴](W109-copy-edits.json)·[역치환 절차](W109-edit-audit.cjs)·[결과](W109-edit-audit.json)는1,041개 입력의 바이트 불변과 같은 HTML의2개 manifest 항목만 변경됨을 확인했다. 이전 바이트를 정확히 복원했고 script/style/태그/속성은 동일하다. [manifest 갱신](W109-manifest-updates.json)은 이 두 문구와 근거만 반영했다.

[독립 수치 재실행](W109-saturation-numerical.cjs)·[결과](W109-saturation-numerical.json)는 기존8조건/1,288곡선 점의 일 적분/에너지 미분을 별도 파일로 실행했다. 최대 모멘트2.169e−19A·m², 에너지1.075e−15J, 힘2.732e−13N, 구적 수렴1.611e−14J, 미분 수렴7.918e−13N으로 기존 사전 기준을 통과했다. 과거 수치 파일을 덮어쓰지 않았다.

[실제 변경 전16개 상태](W109-before-browser.json)·[변경 후16개](W109-browser-check.json)·[독립 값/화면 절차](W109-browser-check.js)·[비교](W109-browser-comparison.json)는1920/390의 모든8조건에서 전체 모델/원표/SVG의 SHA-256과 출력/행 수가 정확히 같음을 확인했다. 실제 다각형/축/선택점·키보드/초기화/예제/두 문제/원표 탐색도 재검증했다. SVG 오차4.980e−6은1e−5 이내, 표시 다각형의 유한 사다리꼴 면적 오차3.301e−5mJ는1e−4 이내다. 이 표시 근사와 분석적 숫자의 차이를 기존처럼 명시했다. JS 오류/페이지 가로 넘침0이다.

[데스크톱 상수 설명](W109-constants-1920.png)·[모바일 설명](W109-constants-390.png)과 [모바일 곡선/지표](W109-saturation-base-plots-390.png)를 직접 읽었다. [전체242개 시험](W109-tests.txt)·[대상20개 입력](W109-versions.json)·통합 탐색은 별도 근거다. canvas stub으로 실제 화면을 대신하지 않았다. 새로운 재질 모형/임상/외부 전문가 검토를 추가 수행한 것으로 확대하지 않는다.

이 작업은34b9105 이후 로컬 설명 복구다. W105의 공백 편집과 분리했으며 다음W106을 재개한다. 마지막06:50 게시/Windows 보호를 유지한다.
