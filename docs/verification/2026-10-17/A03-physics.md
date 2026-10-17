# A03 유한 k-space · ringing · Hann 검증 (W36)

2026-10-17. **대상 버전 통과 — 명시한1D 주기 사각형/Fourier 급수 모형.** 외부 전문가 검토 미시행. 실제 임상 artifact 판정·제거 성능 검증으로 확대하지 않는다.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../gibbs_ringing.html)는 FOV160mm의 주기 신호를 사용한다. |y|<20mm에서1, 바깥0.2, 불연속점은0.6이다. 위상·잡음·이완은 없다. 측정 q−K…K, K8/16/32, 표시 M128/512, rect/Hann을 비교한다. c0=.4, cq=.8sin(πq/4)/(πq), k=q/160mm⁻¹이다. 계수는1/FOV 적분으로 정규화하며 역합에 추가1/N을 붙이지 않는다. 이 규약을 A01의 점 DFT와 구별해 적었다.

Hann은 wq=.5[1+cos(πq/(K+1))]이며 DC1이다. 신호와 정답 창0–1.2, PSF 중심1·진폭축−.3…1.1로 고정한다. PSF 진폭 FWHM은 첫 half-height 교차점의 두 배다. 초과/미달은 표시 격자에서 찾은 값이며 연속 최대값이라고 표시하지 않는다. M만 바꿔도 표본 최대값은 변할 수 있다.

독립 확인은 사각형 구간을4096분할 Simpson 적분해 계수를 구하고 radix-2 FFT로 역합했다. Hann은 cos²의 동치식으로, PSF FWHM은 조밀한 첫 교차 구간 탐색과 safeguarded secant로 구했다. 신호·계수·PSF 절대 오차1e−9, FWHM1e−7mm, 모든 UI조합·DC/기존 표시 위치 불변·필터 폭/진동 반례를 사전 기준으로 정했다.

저자 강의 [Larson, Artifacts](https://larsonlab.github.io/MRI-education-resources/Artifacts.html)의 직접 시연에서 유한 Fourier cutoff와 경계 ringing, window의 진동 감소/해상도 손실을 대조했다. 이 페이지의 수치·사각형·Hann 정의는 직접 만든 교육 예시이며 강의 영상이나 임상 사진을 복제하지 않았다. 정확한 수치는 독립 적분/FFT와 PSF 근으로 확인했다.

## 독립 수치 결과

[수집기](A03-numerical.cjs), [결과](A03-numerical.json), [독립 화면 기준](A03-display-reference.json), [적분/FFT 기준 구현](../../../tests/helpers/ringing-reference.cjs), [시험](../../../tests/ringing.test.cjs)을 사용했다. 12조합/3,840개 복소 영상 표본과9,612개 PSF점에서 최대 오차는 계수8.27e−13, 영상7.79e−12, PSF3.34e−16, FWHM9.71e−11mm였다. 사전 기준을 모두 통과했다.

기본 K16/M128의 rect PSF FWHM은5.852676mm, 표시 격자 초과0.080982/미달0.064822이다. 같은 조건의 Hann은9.411765mm와0.004717/0.004645다. 필터는 진동을 낮추지만 PSF는 넓어진다. K8→16→32 rect FWHM은11.371654→5.852676→2.970618mm이며, 유한 cutoff에서 진동은 남는다. M128→512는 계수와 FWHM을 바꾸지 않고 원래128위치의 값을 보존한다. 평균 DC=.4도 유지된다.

## 실제 브라우저 · 내용 검토

[절차](A03-browser-check.js), [결과](A03-browser-check.json)는 Chrome155.0.8059.82의1920×1080/390×844에서 전체12조합씩24상태다. 두 canvas의15,360개 pixel 중심, 신호/PSF SVG·FWHM 선·표본 최대 초과/미달·계수/가중 표를 독립 기준값과 대조했다. 최대 SVG y오차7.71e−6px로 저장 좌표 허용1e−4px 이내다. select의 Home/End/ArrowUp, 초기화·세 예시·두 문제 정답/오답·펼친 수식/표를 확인했다. JS 오류와 페이지 가로 넘침은 없었다.

[데스크톱 rect](A03-base-1920.png), [모바일 Hann](A03-filter-390.png), [더 높은 k](A03-more-1920.png), [모바일 PSF](A03-filter-psf-390.png)를 직접 확인했다. 경계와 진동, Hann의 완만한 경계·넓어진 PSF, 음의 PSF sidelobe와 half-height 선이 수치에 일치한다.

설명·급수 정규화·k/y 단위·q대칭/실수·경계 평균값·고정 창·표본 최대값의 의미·DC1 가중·PSF peak 정규화·진폭/강도 FWHM 구별·K/M/filter 독립성·문제 정답을 검토했다. Hann이 모든 ringing을 완전히 없앤다거나 표시0.3125mm가 실제 해상도라는 주장을 하지 않는다.

## 버전 · 한계

[대상 SHA-256](A03-versions.json), [최종 전체 시험](W36-tests.txt), [링크 감사](checkpoint-W36-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제2D/3D·조직/잡음·경계 위치 변화·장비 filter·Gibbs 제거·임상 판독은 제외한다. PSF FWHM 하나를 모든 임상 해상도의 지표로 일반화하지 않는다.
