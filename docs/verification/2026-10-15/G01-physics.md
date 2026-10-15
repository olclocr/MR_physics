# G01 FOV·matrix·해상도 계산 기반 (W09)

2026-10-15. **검토 중 / 통과 아님**. 기준 commit `f13d460`, 시작 전체 53/53 통과. 계산 자산·교육 HTML 초안을 구현하고 실제 브라우저의 기본 연결만 점검했다. 독립 수치와 모든 화면의 통합 대조·내용 판정은 남아 있다. 외부 전문가 검토 미시행.

## 구현 전 설계

중심 질문은 “표시 pixel이 작아지면 실제 정보도 늘어나는가?”다. 관찰은 N 고정/FOV 변경, FOV 고정/획득 N 변경, 획득 고정/재구성 M 변경이다. 한 방향의 1D 점 응답·폭 30 mm 사각형 경계를 사용하며, 2D 임상 영상과 구별한다. SNR·검사 시간·잡음·실제 partial Fourier는 제외한다.

기본 FOV=240 mm (화면 계획 160~320, step 40), 획득 N=32 (16/32/64), 재구성 M=N×배율 (1/2/4), 모형 point 또는 edge다. Δx=FOV/N, 표시 Δx=FOV/M, Δk=1/FOV cycles/mm (=1000/FOV cycles/m), 표본 n=−N/2…N/2−1, k=n/FOV이다. NΔk는 DFT bin 대역폭이며 두 끝 표본의 차이 (N−1)Δk와 구별한다. 명목 획득 간격 FOV/N을 모든 임상 공간 해상도 지표와 동일시하지 않는다.

점 응답은 같은 N개 주파수의 합을 N으로 나누어 중심 크기 1로 표시한다. 사각형의 Fourier 신호는 ∫ρ(x)exp(−i2πkx)dx, 단위 mm×상대 PD이며 역합의 정규화는 1/FOV다. 두 모형의 정규화 의미를 혼동하지 않도록 화면에서 따로 표시해야 한다. 짝수 N의 한쪽 Nyquist 표본 때문에 연속 보간의 복소 위상은 허용하며 실수부와 magnitude를 구분한다.

독립 기준은 점 응답의 Dirichlet 닫힌식과 사각형 영역에 대한 복소 PSF convolution의 4096구간 Simpson 적분이다. 제품의 sinc Fourier 계수나 역합 코드를 기준 함수에서 호출하지 않는다. 성분 절대 오차 ≤1e−9, 격자·단위 ≤1e−12를 사전 기준으로 한다. 같은 획득에서 M만 늘리면 기존 격자 값이 유지되고, 점 응답의 첫 영점 ±FOV/N과 주파수 표본 수는 바뀌지 않아야 한다.

근거: [Larson, FOV and Resolution](https://larsonlab.github.io/MRI-education-resources/FOV%20and%20Resolution.html)의 FOV=1/Δk와 획득 대역, [PSF Analysis](https://larsonlab.github.io/MRI-education-resources/Point%20Spread%20Function%20Analysis.html)의 k-space 가중치·convolution을 읽고 설계했다. 독립 유도와 단위 검산을 추가한다.

## 여기까지 구현·수행한 확인

[순수 계산 자산](../../assets/fov-resolution-model.js)에 geometry·coefficients·at·calculate를 구현했다. 점 응답은 N개 주파수의 직접 역합이며, edge는 폭 30 mm 사각형의 해석적 sinc 계수를 역합한다. 원본의 범위 밖 반복·ringing·복소 보간은 앞으로 화면에서 설명해야 한다. [교육 HTML 초안](../../fov_matrix_resolution.html)을 연결했다. README·index에는 초안/검증 대기로 등록했다.

[독립 기준](../../../tests/helpers/fov-reference.cjs)은 기하급수의 유한 합을 닫힌 Dirichlet kernel로 구하고, edge에는 실공간 convolution을 수치 적분한다. 이산 주파수 sinc 계수와 삼각함수 직접 역합을 복제하지 않았다. [수집기](G01-numerical.cjs)는 루트에서 `node docs/verification/2026-10-15/G01-numerical.cjs`로 재현한다. [결과](G01-numerical.json)는 162개 조건·위치에서 성분 최대 1.286e−12로 사전 1e−9 기준을 충족했다.

`node --test tests/*.test.cjs`: **56/56 통과**. 새 3개 시험은 FOV/간격/단위와 모든 N/M 격자, 점/경계 독립 convolution, M만 늘렸을 때 기존 복소 격자값 보존·주파수 표본 불변·점 응답 영점·잘못된 인자를 확인한다. 이 결과는 계산 범위만의 확인이며 실제 화면 검증이나 챕터 물리 통과가 아니다. 버전은 [SHA256 목록](G01-versions.json)으로 특정한다.

## 초안 화면의 제한된 확인

[실제 smoke 스크립트](G01-browser-smoke.js), [결과](G01-browser-smoke.json): Chrome 155, 1920×1080·390×844의 14개 기본 상태에서 FOV Home/End·N64·M128·경계·초기화·문제 Enter를 확인했다. M만 늘리면 조밀한 곡선의 SVG 좌표가 그대로이며 표시 격자 수만 늘었다. JS 오류·가로 넘침 0이었다. [데스크톱 진입](G01-draft-page-1920.png), [모바일 진입](G01-draft-page-390.png), [모바일 점](G01-draft-profile-390.png), [모바일 경계](G01-draft-edge-390.png)를 직접 확인했다. 이는 독립 기준과 표시 전체를 대조하는 통합 물리 검증이 아니다.

## 재개할 첫 행동과 남은 작업

1. `fov_matrix_resolution.html`의 초안을 읽고 `render()`의 점/경계 곡선·격자·띠 좌표를 독립 기준과 대조한다. 띠의 각 셀과 실제 표본 위치의 대응, 획득/표시 간격, k 끝점·대역·고정 축·정규화를 검토한다.
2. 구현된 세 관찰·입력·수식·두 문제를 검토한다. 첫 영점·ringing·짝수 Nyquist 비대칭·pixel과 임상 해상도의 차이를 점검하고, 모든 N/M 조합·입력 경계·초기화·키보드의 실제 동작 확인을 보강한다.
3. 기본 smoke를 넘어 **실제 1920×1080·390×844의 독립 수치/표시 전체 대조**, 설명/수식/정답/가정의 통합 물리 검토를 수행한다. 발견 문제를 수정하고 독립 검산·영향 시험을 재실행한다.
4. 최종 기록·HTML 보고서·선행 B05 연결과 README/index 초안 상태를 갱신하고 로드맵/검증 계획을 갱신한다. 그 전에는 W09를 완료로 바꾸지 않는다.

중단 이유는 사용자가 지정한 계정 사용량 한도 근접이다. 외부 전문가·임상 영상·사용자 추가 결정을 기다리는 작업은 아니다. 다음 요청은 W09의 독립 수치/화면 연결 대조와 내용 검토부터 바로 재개한다.
