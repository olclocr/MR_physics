# B04 공간 부호화 통합 물리 검증 (W05)

2026-10-15 (Asia/Seoul). **판정: 아래 범위에서 대상 버전 통과. 외부 전문가 검토 미시행.** 기준 commit `fea4b44` 이후의 로컬 변경, 최종 [대상별 SHA-256](B04-versions.json)로 버전을 식별한다. 시작 전체 시험 40/40 통과. GitHub 게시 확인과 구별하는 로컬 개발 기록이다.

## 범위와 사전 확인

- 기존 파일의 5×5 모형을 유지하고 위치→주파수/위상→복소 합의 세 관찰, Gy=0 및 격자 불일치 예측 문제를 보강한다. slice selection·새 재구성법은 제외한다.
- 단위: x,y는 voxel 간격=1인 좌표, FOV=5 간격, 화면 k는 cycles/FOV의 무차원 좌표. 제어값 Hz/col과 deg/row는 물리 gradient 세기 T/m 자체가 아닌 효과를 나타낸다. 시간은 계산 ms와 화면 재생 초를 구별한다.
- 독립 rectangular gradient 면적 적분으로 k, 위상을 확인한다. 허용 절대 오차 k≤1e−12, 위상≤1e−10 rad, raw 복소 신호≤1e−10, 정규화 신호≤1e−12, 완전·부분 재구성≤1e−10. 구현의 trajectory·signal·inverse 함수는 독립 기준에서 호출하지 않는다.
- 모든 패턴·4개 샘플링·4개 순서, Gy=0/기본/경계, 주파수/시간/T2* 범위, 감쇠 ON/OFF, phase/frequency/sequence 모드, 준비/ADC/완료·TR 경계, 초기화·속도·정지·키보드와 1920×1080/390×844 실제 화면을 확인한다.

초기 발견: 속도 변경이 관찰 시점을 바꾸며 행별 PE 위상 라벨이 실제 음의 위상과 반대 부호다. 첫 검토에서 complete frame을 잘못 판단했으나 기준 commit이 이미 이를 readout 끝으로 처리함을 확인했다. 공통 계산은 변경하지 않았다. 이후 실제 브라우저에서 canvas resize 오류도 찾아 수정·재검증했다. 세부 결과는 아래와 같다.

## 근거·수식·단위와 모형 범위

- [Larson, Spatial Encoding (2026)](https://larsonlab.github.io/MRI-education-resources/Spatial%20Encoding.html): 위치별 `Δf=γ̄G·r`, readout 동안의 주파수 부호화와 준비 gradient 면적의 위상 부호화를 대조했다. 여기 제어값 Hz/col은 γ̄GxΔx, deg/row는 한 nominal ky 단계에서의 위상 차이 크기다. 그림의 Hz는 readout 설계값이며 준비 중 음의 Gx 주파수 자체가 아니다.
- [Larson, K-space (2026)](https://larsonlab.github.io/MRI-education-resources/K-space.html): 물리 `k=γ̄∫Gdt`, 복소 위상 `−2πk·r`, forward/inverse Fourier 부호를 확인했다. 이 화면의 k는 물리 k×FOV인 정규화 수치다. N=5, r=xindex×Δx, FOV=5Δx이므로 `φ=−2π(knorm,x xindex+knorm,y yindex)/5`가 된다.
- [Larson, MRI Signal Equation (2026)](https://larsonlab.github.io/MRI-education-resources/MRI%20Signal%20Equation.html): 수신 복소 신호가 공간의 순자화 기여 합이라는 점을 대조했다. 5×5의 ρ는 교육용 점 표본이며 균일 코일을 가정한다. 신호 및 K 크기 숫자는 Σρ로 정규화하고 실제 K는 같은 복소 합의 비정규화 값으로 저장한다. 재구성의 1/25는 신호를 나눈 Σρ와 별도다.

기본 준비 8 ms 동안 x 주파수 기울기는 `−(25 Hz/col×32 ms)/(2×8 ms)=−50 Hz/col`이고, 이 면적이 kx=−2를 만든다. Readout에서 +25 Hz/col을 32 ms 적용하면 kx=+2로 간다. 다섯 ADC는 시작·끝을 포함한 0/8/16/24/32 ms, Δkx=1이다. Gy의 기본 72°/row는 Δky=1이며, 75°에서는 Δky=75/72이다. 준비 구간의 x,y 면적을 따로 적분하여 이 값과 위상 부호를 독립 확인했다.

T2*는 excitation 직후의 물리 시간으로 계산하는 공통 단일 지수 감쇠다. 기본 ADC 시간은 90° 직후 기준 8/16/24/32/40 ms이다. 감쇠 OFF는 지수항 1, 영상은 복소 역변환 magnitude이다. 감쇠가 있으면 ρ 자체가 아닌 감쇠한 데이터의 재구성이며 색상 표시 창은 0~1.2로 고정했다. 매 반복의 시작 자화는 같다고 가정하고 실제 TR·T1 정상상태·RF shape·gradient ramp·유한 voxel profile·잡음·slice는 계산하지 않는다. 6.2초의 화면 주기는 물리 TR이 아니다. 마지막 ADC 뒤에는 해당 시점의 snapshot을 유지한다.

## 독립 검산

`tests/helpers/encoding-reference.cjs`의 독립 rectangular gradient rate를 16개 구간으로 적분하여 면적→위상→복소 신호를 얻었다. 구현의 trajectory·signal·inverse 함수는 기준에서 호출하지 않는다. 각 패턴의 ρ 배열은 알려진 시험 입력으로 읽고, 샘플링할 ky 집합은 별도로 정의했다. 역변환도 별도 복소 합으로 계산하여 구현의 저장 목록을 정답으로 재사용하지 않았다.

재현: `node docs/verification/2026-10-15/B04-numerical.cjs`. [수집기](B04-numerical.cjs) / [전체 결과](B04-numerical.json). 5개 물체, Gy=0/42/72/75/144°, 주파수 4~60 Hz/col, readout 8~160 ms, T2*=50/180/600 ms, 감쇠 ON/OFF와 올바른 대체 격자(5 Hz×160 ms, 50 Hz×16 ms)를 포함했다.

| 항목 | 비교 수 | 최대 성분 절대 오차 | 사전 기준 | 판정 |
|---|---:|---:|---:|---|
| Raw complex ADC | 1,500 | 2.576e−13 | ≤1e−10 | 통과 |
| ADC 실제 k | 1,500 | 1.422e−14 | ≤1e−12 | 통과 |
| ADC의 25개 위치 위상 | 37,500 | 4.264e−14 rad | ≤1e−10 rad | 통과 |
| 준비 구간 정규화 복소 신호 | 1,440 | 6.040e−15 | ≤1e−12 | 통과 |
| 완전·누락 복소 재구성 | 160 조건×25 pixel | 1.777e−15 | ≤1e−10 | 통과 |

재구성은 5개 패턴×4개 순서×4개 샘플링×감쇠 ON/OFF이다. 최대 magnitude는 1.1로 고정 창 0~1.2에서 잘리지 않는다. 감쇠 OFF·완전 격자는 초기 ρ로 돌아오며 한쪽 4줄은 일반적으로 허수 성분이 남는다. 화면에서 이 residual을 지우지 않고 복소 magnitude를 사용한다. 한쪽 4줄은 zero fill이며 실제 partial Fourier 위상 추정 복원이 아니다.

Gy=0이면 각 명목 행이 모두 실제 ky=0이고 같은 x의 y별 기여가 구별되지 않는다. 25칸 채움 자체가 25개 독립 공간 주파수를 뜻하지 않으므로 2D 재구성을 보류하는 것이 맞다. 75°/row 등 임의 격자에서도 고정 IFFT는 보류하지만, 이것을 일반적인 모든 재구성법의 정보 소실이라고 확대하지 않는다. 이 두 구분이 확인 문제의 정답과 피드백에 반영되었다.

## 발견 문제 → 수정 → 재검증

1. **위상 라벨 반대 부호:** 실제 계산은 음의 위상인데 행별 숫자만 양의 식을 사용했다. 같은 `phaseAt(x=0,y)`를 사용하게 바꾸어 +ky=1, y=+1에서 −72°를 표시하고 독립 기준과 대조했다. 준비가 끝난 뒤에도 range가 남도록 실제 ky로 계산한다.
2. **속도가 시점을 바꿈:** elapsed×speed의 곱을 보존하도록 바꾸었다. 정지 중 1→2.6배, 표시 옵션 변경에서 k·물리 시간·신호가 유지된다. 시퀀스 시점 조작은 PE+FE에서만 활성화한다.
3. **0 신호의 위상:** 수치적 잔여 real/imag에서 atan2로 임의 위상을 표시하던 문제를 수정했다. 정규화 |S|<1e−10이면 위상 정의 안 됨, K는 중립 회색이다. 0에 가까운 uniform 물체의 ADC로 확인했다.
4. **자동 표시 배율:** 조건별 max K와 max image로 다시 나누면 감쇠 변화가 숨을 수 있었다. K 크기·진하기는 |K|/Σρ, 재구성 창은 magnitude 0~1.2로 고정했다. 실제 T2*=50/600 ms에서 K 숫자·곡선·영상 진하기 차이를 같은 창으로 확인했다.
5. **현재 표식과 명목 격자:** 공통 complete 계산은 원래 마지막 ADC k였으나 canvas 표식은 readout 종료 후 중앙에 놓였다. 마지막 명목 ADC 위치를 유지하고 준비 중에는 표식을 숨겼다. 표식이 실제 trajectory라는 오해를 없애기 위해 범례·설명에 명목 ADC 위치라고 명시했다. 실제 k는 수치로 표시한다.
6. **실제 resize 예외:** 1920→390 전환에서 canvas가 잠시 0 폭을 보고하여 arc 반지름 −6.206으로 예외가 났다. collapsed frame을 건너뛰고 레이아웃 안정 후 backing store 크기를 회복하게 했다. Node 재현과 재로딩 없는 실제 폭 변경을 다시 확인해 오류가 사라졌다.
7. **수치 카드 잘림·모형 설명:** 핵심 k 카드의 ellipsis를 줄바꿈으로 바꾸고 폭·모바일 여백을 조정했다. voxel 표본 수와 실제 핵 개수, 물리 ms와 재생 초, density와 감쇠한 magnitude, FFT 명칭과 직접 합산, 실제 partial Fourier와 zero fill을 구별했다.

## 시험·실제 브라우저

Node v22.18.0, `node --test tests/*.test.cjs` **44/44 통과**. 새 네 시험은 독립 gradient/ADC, 완전·누락 역변환, PE 부호·0 신호, 속도·초기화·제약·resize 복구를 확인한다. 공통 `mr-physics-models.js`의 계산식은 바꾸지 않았으며 기존 챕터의 회귀도 통과했다.

[실제 Chrome 조작](B04-browser-check.js) / [94개 상태 기록](B04-browser-check.json), Chrome 155.0.8059.40, `http://127.0.0.1:8766/docs/frequency_phase_encoding_visualization.html?qa=...`, 1920×1080·390×844. 세 관찰·모드·4개 순서/샘플링·5개 패턴·감쇠·Gy=0/75°·고정 창·재생 속도·표시·정지·초기화·키보드 Home/End/Enter·두 문제 정답/오답을 확인했다. 실제 k의 최대 오차 1.777e−15, 정규화 신호 1.083e−15, 재구성 1.555e−15였다. 물리 시간·반올림 수치·재구성 보류가 일치하고 가로 넘침·빈 canvas·JS 오류는 0건이다. canvas readback 성능 권고는 시험 계측에서 발생한다. 초기 favicon 404는 챕터 자산 실패가 아니다.

[실제 보고서 연결](B04-report-browser-check.js)도 확인했다. 페이지에서 검증 기록을 눌러 두 viewport에서 보고서 표 두 개·가로 넘침 0을 확인하고 [보고서 1920](B04-report-1920.png) / [390](B04-report-390.png)을 직접 열어 읽기와 배치를 점검했다.

다음 실제 PNG 중 대표 장면을 직접 열어 위치·위상 부호·동일 표시 창·범례·텍스트·조작을 확인했다. 자동 canvas stub으로 화면 확인을 대신하지 않았다.

| 장면 | 데스크톱 | 모바일 |
|---|---|---|
| 주파수 부호화 | [1920](B04-frequency-1920.png) | [390](B04-frequency-390.png) |
| Gy 종료 후 −72° 위상 | [1920](B04-phase-1920.png) | [390](B04-phase-390.png) |
| Gy=0 정보 소실 | [1920](B04-no-Gy-1920.png) | [390](B04-no-Gy-390.png) |
| 완전 격자 | [1920](B04-full-1920.png) | [390](B04-full-390.png) |
| 75° 격자 보류 | [1920](B04-unmatched-1920.png) | [390](B04-unmatched-390.png) |
| T2*=50 ms · 고정 창 | [1920](B04-T2star-50-1920.png) | [390](B04-T2star-50-390.png) |
| T2*=600 ms · 같은 창 | [1920](B04-T2star-600-1920.png) | [390](B04-T2star-600-390.png) |
| 학습 경로 | [1920](B04-lesson-1920.png) | [390](B04-lesson-390.png) |
| 확인 문제 | [1920](B04-quiz-1920.png) | [390](B04-quiz-390.png) |

## 판정과 남은 범위

B04의 기존 세 모드, gradient→위상/k→복소 ADC→완전/zero-filled 역변환, 설명·단위·부호·수치·canvas·정답은 해당 버전에서 통과한다. 외부 전문가 검토 미시행. 실제 장비·임상 protocol·비정규 k 재구성·slice·부분 Fourier 위상 추정은 범위 밖이다. 후속 계산·좌표·물리/재생 시간·표시 창·정답 변경은 관련 범위를 다시 검증한다.
