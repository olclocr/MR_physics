# A01 FOV · aliasing · zero filling 검증 (W34)

2026-10-17. **대상 버전 통과 — 명시한 1D 점 신호/Fourier 모형 범위.** 외부 전문가 검토 미시행. 실제 임상 영상·장비 성능의 판정이 아니다.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../aliasing_fov.html)는 y=−20mm/진폭1의 고정점과 기본+84mm/진폭0.6의 이동점을 사용한다. 이동 범위−160…160mm/4mm, FOV128/256mm, 획득 N32/64, 획득 격자4mm 고정이다. 전체 q 또는 짝수 q, 표시 M=N/4N을 조작한다. q=−N/2…N/2−1, k=q/FOV, forward 무정규화/inverse1/N이다. 신호는 명목 FOV 밖에서도 여기·수신되며 잡음·이완·coil·수신 필터는 없다. 실제 해부학 영상이 아닌 점 신호 교육 모형이다.

획득 Fourier 신호를 실제 위치에서 직접 합성하고, 표시는 같은 계수의 역합이다. 전체 q의 비모호 주기는 FOV, 짝수 q는 FOV/2다. 짝수 q도1/N을 유지하므로 명목 FOV의 두 복제본은 각1/2 진폭이다. M=4N 보간에서도1/N을 유지한다. Nyquist −N/2를 쪼개지 않아 보간 중간점은 복소일 수 있으며 magnitude를 표시한다.

독립 검산은 실제 점 위치의 residue class로 만든 격자를 radix-2 FFT하고, 역영상은 Fourier 계수의 직접 합 대신 닫힌 등비급수/Dirichlet 식으로 구했다. 648개 조합 전체 복소 계수·영상과 구별 불가능한 대안 자료의 절대 오차1e−10을 사전 기준으로 정했다. 실제 화면은 두 viewport에서 경계·동일 위치 중첩·줄 생략·표시 확대·예시·초기화·키보드·문제를 확인한다.

기본 관계는 저자 강의 [Larson, Cartesian Sampling Image Characteristics](https://larsonlab.github.io/MRI-education-resources/Cartesian%20Image%20Characteristics.html)의 FOV/표본 간격·N/격자 관계와 대조했다. MRI aliasing 원전 [Pusey 등, 1988](https://doi.org/10.1016/0895-6111(86)90003-0)은 [서지와 공개 검색 자료](https://pubmed.ncbi.nlm.nih.gov/3179974/)를 확인했다. 공개 PDF는 도구의 크기 제한으로 전문을 읽지 못했으므로 이를 읽었다고 기록하거나 그 실험 수치에 의존하지 않는다. 이 페이지의 핵심 정량 결과는 독립 Fourier/등비급수 유도로 확인했다. 위치·진폭·격자·창은 직접 만든 예시다.

## 독립 수치 결과

[수집기](A01-numerical.cjs), [결과](A01-numerical.json), [독립 기준값](A01-display-reference.json), [독립 FFT/등비급수](../../../tests/helpers/aliasing-reference.cjs), [시험](../../../tests/aliasing.test.cjs)을 사용했다. 648조건/77,760개 복소 영상 표본의 최대 오차는 계수1.21e−14, 영상4.85e−15였다. 모든 점을 비모호 주기만큼 옮긴 대안의 측정 차이는 최대4.25e−14로 기준을 통과했다.

기본+84mm는 FOV128에서−44mm, FOV256에서+84mm다. FOV128/짝수 q에서는−44,+20mm에 각0.3 진폭으로 복제된다. FOV 확대는 Δk0.0078125→0.00390625mm⁻¹, N32→64이며 획득 격자4mm는 유지된다. 표시4N은 획득 계수를 바꾸지 않으며 원래 N개 위치의 복소값이 그대로 유지된다. 중첩점·양쪽 경계·음수 위치·전체/생략의 격자 합도 독립 역합과 일치했다.

## 실제 브라우저 · 표시 수정 · 내용 검토

[절차](A01-browser-check.js), [결과](A01-browser-check.json)는 Chrome155.0.8059.82, HTTP 로컬 페이지, 1920×1080/390×844에서160상태를 기록한다. 19,200개 canvas pixel 중심, 복소값·magnitude SVG, q 마스크·복제 위치 표를 대조했다. 최대 SVG y오차7.67e−6px로 저장 좌표 허용1e−4px를 통과했다. ArrowRight/Home/End, 세 예시, 초기화, 두 문제의 정답/오답, 모든 details를 펼친 폭을 확인했다. JS 오류와 페이지 가로 넘침은 없었다.

[데스크톱 표시4N](A01-display4-1920.png), [모바일 짝수 q](A01-even-390.png), [모바일 넓은 FOV](A01-wide-390.png), [기본 화면](A01-base-390.png)을 직접 확인했다. 그레이 반올림 경계의1단계 차이를 발견해 정수 회색 변환에1e−10의 tie 안정화를 적용하고160상태를 재검증했다. 이는 신호나 정규화를 바꾸지 않는다. 왼쪽 경계−FOV/2는 포함되고 오른쪽+FOV/2는 제외되는 문구도 위치 판정과 맞췄다.

설명·식·그림·표·퀴즈를 다음과 같이 검토했다: y와 k 단위, 신호 위상 부호, −FOV/2부터의 격자 원점, modulo의 음수 처리, 밖의 신호 수신 가정, 줄 생략과 주기/복제 진폭, Nyquist 단독 계수와 보간 허수, 고정 magnitude 창0–1.8, 실제/획득/표시 좌표 구별, 새 획득과 zero filling 구별. +84→−44 정답과 표시4N의 정보 불변 정답은 독립 반례와 일치한다.

## 버전 · 한계

[대상 SHA-256](A01-versions.json), [최종 전체 시험](W34-tests.txt), [링크 감사](checkpoint-W34-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 과거 B05/G01의 전체 물리 판정을 이번 새 페이지의 통과로 대체하지 않는다.

연속 조직·실제 PSF/수신 anti-alias filtering·장비 phase/readout oversampling·coil 복원·scan time·SNR·임상 판독은 제외한다. 연속 조직의 부분 용적이나 ringing/필터는 각각 G02/A03으로 분리한다. 표시1mm를 실제1mm 공간 해상도로 해석하지 않는다.
