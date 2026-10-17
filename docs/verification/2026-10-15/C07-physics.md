# C07 EPI 경로·시간·PE 이동 검증 (W19)

2026-10-15. **대상 버전 통과 (W19 완료)**. 외부 전문가 검토 미시행.

한 번의 RF 뒤 왕복 readout·phase blip이 서로 다른 시간의 줄을 채우는 경로, ESP 변화, off-resonance/PE 반전을 세 관찰로 묶는다. N16×16/FOV160mm, dwell10µs, TE30ms, ESP0.8ms(0.4/0.8/1.6/3.2), offset50Hz(−100~100,10), PE극성±1이다. 순간 gradient 전환·일정 readout G·줄 사이 일정 Gy blip·첫 ADC 전 prephase를 가정한다.

재구성은 실제 echo 시각의 kx0 표본16개만 쓰는1D PE 점응답이다. 복소 inverse1/N, 점 중심1, 격자10mm·고정0~1회색창·FOV주기를 명시한다. Within-readout off-res·T2*·실제2D field/늘어남/압축·Nyquist/eddy correction·임상영상은 제외한다. 같은 offset의 공통 이동을 국소 field 왜곡 전체로 표현하지 않는다.

독립 검산은 gradient 구간의 SI 시간 적분→ADC k좌표, 별도 시간 순서 표본 열거, 닫힌 유한 Fourier kernel/위치 root를 사용한다. k절대1e−10cycles/mm, 시각1e−10ms, 복소점응답1e−9, 이동1e−9mm, 실제 SVG1e−6·수치 반올림·회색 정수 일치를 사전 허용한다. Nyquist 끝점·양/음 PE·offset0·ESP비례·echo중심/ADCspan·TE 위상/정규화·문제 정답을 통합 검토한다.

2026-10-15 실제 읽은 Larson Fast Imaging의 EPI/ESP·MRI Signal Equation의 gradient/off-res 부호·Artifacts의 EPI phase방향 이동을 근거로 삼는다. 시간과 1D 근사 유도/수치는 자체 검산한다. 실제 장비나 안전/임상 수치를 권장하지 않는다.

## 독립 수치·단위·정규화

대상은 commit `417aa00` 이후 로컬 파일로 [SHA-256 목록](C07-versions.json)에 특정한다. [독립 기준](../../../tests/helpers/epi-reference.cjs)은 SI gamma·G·시간에 따라 ADC를 별도로 열거하고, 각 gradient 구간을64개 midpoint로 적분한다. 점응답은 직접 역변환 대신 닫힌 Dirichlet kernel과 공간 위상 차이의 이분법 root로 대조한다. [수집기](C07-numerical.cjs), [결과](C07-numerical.json)에 전168조건·43,008개 ADC 비교를 저장했다.

| 검토 항목 | 결과와 사전 기준 | 판정 |
|---|---|---|
| ADC k좌표·gradient 면적 | 최대3.069e−15 cycles/mm, 기준1e−10 | 통과 |
| ADC 시각·echo 중심 | 최대1.066e−14 ms, 기준1e−10. 모든ADC의 시각 단조 증가·kx0이 각echo시각과 일치 | 통과 |
| 복소 PE 점응답 | 최대 성분차이1.498e−15, 기준1e−9 | 통과 |
| signed 이동 | root와 최대1.422e−14 mm, 기준1e−9. ESP비례·PE반전·offset0 확인 | 통과 |
| 정규화·에너지 | 16개 영상 표본의 Σ|m|²=1, 최대6.662e−16. 조밀한 점 중심 크기1과 subpixel 표본 최대를 구별 | 통과 |
| 격자·범위·문제 | 반대 방향의 ADC 순서·짝수 DFT 끝점·TE 공통위상·1D 중앙 근사·고정 창을 설명/정답과 대조 | 통과 |

기본ESP0.8 ms에서 PE BW는78.125 Hz/pixel, +50 Hz/+PE는+0.64pixel=+6.4mm로 이동한다. Readout |Gx|는14.679mT/m로 고정된다. 첫/마지막 echo 중앙 간격은12ms, 첫/마지막 ADC 시각 차이는12.16ms다. Ny×ESP를 이 시각 차이와 같은 값이라고 부르지 않는다. TE30ms에서 kx=ky=0을 읽으며 ESP가 바뀌어도 이 정의를 유지한다.

prephaser·readout·blip은 하나의 이상적 gradient 시간표로 연결되며 실제 ramp/slew 한계를 구현하지 않았다. PE 점응답은256개 ADC 전체의2D 역변환이 아니라 kx0의16개 중앙 표본을 사용한다. 이 근사를 본문과 수식/그림에 명시했다. 같은 offset의 이동과 공간적으로 변하는 field의 실제 늘어남/압축·dropout을 구별한다.

## 실제 화면·조작·통합 검토

[브라우저 스크립트](C07-browser-check.js), [결과](C07-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/epi_trajectory.html`,1920×1080·390×844에서 **360개 상태**를 확인했다. 모든4ESP×21offset×2PE를 두 화면에서 대조하고, 예시·slider 경계/방향키·선택 Home/End·Tab·문제 Enter·초기화를 확인했다. JS 오류·가로 넘침0이다.

실제256ADC·16echo시각·표의 위상/ky·501곡선·16영상표본·17개의 주기 경계 분할 띠·예상 이동 표식을 독립 시간/유한kernel 기준과 대조했다. 좌표 최대차이2.274e−13으로 기준1e−6 이내이며 회색 정수는 정확히 일치했다. FOV 가장자리의 영상 표본 띠는 반 칸씩 나눠 표본 중심과 정렬했다.

[모바일 경로](C07-trajectory-390.png), [모바일 점응답](C07-profile-390.png), [긴ESP 시간](C07-timing-390.png)을 직접 보았다. 방향 화살표·blip·중앙 표본·격자 경계·시간과 점응답/띠의 정렬에서 겹침/잘림을 발견하지 않았다. [PE 반전 경로](C07-reverse-path-390.png)와 [반전 점응답](C07-reverse-390.png)도 저장했다.

`node --test tests/*.test.cjs`: **76/76 통과**. 새2개 시험은 독립 SI 적분/시각/kernel과 이동·정규화·극한·입력 조건을 다룬다. 실제 화면/내용 판정은 별도로 수행했다.

## 최종 판정과 범위

C07의 명시한 EPI trajectory·gradient 면적·시간/단위·중앙 PE 점응답·부호·정규화/창·설명/정답을 **대상 버전 통과**로 판정한다. 실제2D 재구성·within-readout off-res·이완/field map·gradient 한계·Nyquist/eddy 보정·임상영상·외부 전문가 검토는 미시행 또는 모형 밖이다. 경로/gradient·ADC/echo시각·TE·PE순서·재구성 근사·정규화가 바뀌면 독립적분/kernel과 실제 두 화면을 재검증한다. 다음 W20/Q04.
