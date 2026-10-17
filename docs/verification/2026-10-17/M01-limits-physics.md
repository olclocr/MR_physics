# M01 후속 · 잡음 바닥과 두 성분 fitting 검증 (W40b)

2026-10-17. **명시한 magnitude/두 성분 부분 모형 대상 버전 통과.** 실제2Dmap·noise추정·임상정량 판정이 아니다. 외부 전문가 검토 미시행.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../t2_mapping_limits.html)는 TE10/20/40/60/80/120/160/200ms,A합1,단일T240ms 또는.3exp(−TE/20)+.7exp(−TE/120)의 두 성분을 사용한다. 복소 각 성분에σ0/.02/.08/.2의 고정 Gaussian 실현을 더하고 magnitude에 M01 기본의 free-intercept log OLS를 적용한다. 전체8/앞4/뒤4점만 fitting에 쓸 수 있다. 신호 창0–1.5는 고정이고 fit 외삽이 창을 넘으면 그림만 clip하며 계산/표는 유지한다.

입력 z는 검증된 Q04 normals의 seed0x4c574d52/0x040b2026으로 정의하고 [고정 입력 fixture](../../../tests/fixtures/t2-noise-realizations.json)에 저장했다. 입력 자체의 일치와 계산의 독립성을 구별한다. SeedB는 late/σ.2의 비감쇠 반례를 위해 선택한 예시이며 성능 통계에 쓰지 않는다. 분포 기대값은 별도의LCG/Marsaglia 표본으로 확인한다.

독립 정답 신호는 두 횡이완 ODE의 합, fitting은 Householder QR다. 관측 Re/Im와 magnitude는 동일한 고정 입력으로 재구성한다. 신호1e−9,기울기1e−10,추정A1e−9,T2상대1e−9를 사전 기준으로 정했다. 기울기≥0은 양의T2로 보고하지 않으며 형식상 역수/곡선은 추적한다.

Magnitude/Rayleigh의 원전 [Gudbjartsson와 Patz,1995](https://pmc.ncbi.nlm.nih.gov/articles/PMC2254141/)은 기존 Q01에서 확인한 단일 복소 채널 통계와 연결했다. 이 페이지의 성분·T2·echo·σ·seed는 교육 예시다. 기대 바닥σ√(π/2)는 신호0의 평균이지 관측 최솟값이나 일반적인 상수 보정량이 아니다.

## 독립 결과

[수집기](M01-limits-numerical.cjs), [결과](M01-limits-numerical.json), [화면 기준](M01-limits-display-reference.json), [ODE/QR 기준](../../../tests/helpers/t2-limits-reference.cjs), [시험](../../../tests/t2-limits.test.cjs)을 사용했다. 48조건/19,248곡선 표본에서 최대 신호 오차2.11e−15,기울기7.64e−17ms⁻¹,A1.78e−14,T2상대2.57e−14,RMSE5.59e−16으로 전 기준을 통과했다.

독립 Rayleigh 검산은65,536표본,표준σ1의 평균1.253653,기대1.253314,평균의 표준오차0.002559였다. 사전6SE 기준을 통과했다. 이것을 두 고정 입력의 성능 통계로 사용하지 않았다.

두 성분/잡음0의 전체·앞4·뒤4 유효T2는106.389041/79.768855/118.312321ms,RMSE는0.032437/0.012601/0.000849다. 실제 성분은20/120ms이며 작은 뒤쪽 잔차가 단일 성분을 증명하지 않는 반례다. 단일 성분/σ0은 어느 범위에서도40ms다.

전체 메뉴의 비감쇠 조건은3개다: 단일/실현B/뒤4/σ.08,단일/실현B/뒤4/σ.2,두성분/실현B/뒤4/σ.2. 예시 단일/σ.2의 기울기는+0.011274427ms⁻¹,형식상 역수−88.696300ms다. 양수로 자르거나 물리적인 음의T2로 보고하지 않고 해석 불가 상태로 표시한다.

## 실제 브라우저 · 내용 검토

[절차](M01-limits-browser-check.js), [결과](M01-limits-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의96상태다. 정답/fit SVG·magnitude/사용점·기대바닥·원래 복소값/예측 표·기울기와 보고 상태를 독립 기준과 대조했다. 최대 SVG y오차7.76e−6px로 허용1e−4px 이내다. SVG/표 페이지이며 canvas pixel 검사를 했다고 기록하지 않는다.

Home/End/ArrowUp·초기화·세 관찰/비감쇠 예시·문제 정답/오답·펼친 수식/입력·모바일 표 좌우 탐색을 확인했다. JS 오류와 페이지 가로 넘침은 없었다. [뒤4 두성분 데스크톱](M01-limits-late-1920.png), [모바일 비감쇠](M01-limits-rising-390.png), [잡음 예시](M01-limits-noise-1920.png), [모바일 표](M01-limits-table-right-390.png)를 직접 확인했다.

복소σ/magnitude·한 실현과 기대 분포·정답 성분과유효T2·사용 범위/잔차·log OLS 목적과 물리 해석·비감쇠 부호·고정 창/clip·통계 검산의 조건·문제 정답을 검토했다. 작은 잔차나 긴 유효값을 특정 조직/성분의 확정으로 해석하지 않는다.

## 버전 · 남은 범위

[대상 SHA-256](M01-limits-versions.json), [최종 전체 시험](W40b-tests.txt), [링크 감사](checkpoint-W40b-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. M01은 기본/한계의 두 교육 모형을 구현했지만 실제2D/FSE/RF/spin history·noise추정·Rician likelihood/NLLS·성분 분리·임상map/cutoff는 남는다.
