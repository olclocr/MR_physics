# Q02 Receiver BW·시간·이동 검증 (W16)

2026-10-15. **대상 버전 통과 (W16 완료)**. 외부 전문가 검토 미시행.

중심질문은같은matrix에서receiver BW가무엇을함께바꾸는가이다. 기본200Hz/pixel(50~800,50), offset200Hz(−400~400,50), polarity±1. N64/FOV240mm/간격3.75mm·기준점신호1·NEX/coil/TE를고정한다. BW에맞추어readout G를바꾸고같은FOV를유지한다. BW는전체양측폭/complexADC rate, ±표시는그절반이다. RF bandwidth와구별한다.

ADC 시간중앙을0으로, k_n=polarity(n−32)/FOV, off-res phase=−2πΔf t_n으로계산하고복소inverse로magnitude를구한다. 점응답은중심1 정규화이며64영상격자·조밀501점의같은합을보인다. 실제T2*/readout감쇠·filter/ramp·noise영상은제외한다. σ는200Hz/pixel에서0.1인백색잡음의기대치이며고정기준신호1/σ를SNRref로표시한다.

독립기준: SI주파수/위치관계로이동root를구하고닫힌Dirichlet kernel로복소점응답을확인한다. 단위/시간절대1e−12, 복소성분절대1e−9, 위치1e−9mm, 실제SVG좌표1e−6을사전허용한다. polarity/offset0·최대이동·NΔt와(N−1)Δt·half/fullBW·분산∝BW와readout대응을검토한다. 근거는2026-10-15실제읽은Larson SNR의BW/time식·MRI signal equation의off-res phase이며유도/수치는자체검산한다.

## 독립 검산·단위·부호 검토

대상은 commit `417aa00` 이후 로컬 파일이며 [SHA-256 목록](Q02-versions.json)으로 특정한다. [독립 기준](../../../tests/helpers/bandwidth-reference.cjs)은 SI field→frequency의 이분법 root, 기존 독립 Dirichlet kernel, 평평한 잡음PSD의4096구간 적분을 사용한다. 제품의ADC표본 합을 그대로 기대값으로 쓰지 않는다. [수집기](Q02-numerical.cjs), [결과](Q02-numerical.json)에 전체544조건의 결과를 저장했다.

| 중심 주장 | 관측 결과·사전 기준 | 판정 |
|---|---|---|
| 위치와 극성 | SI 주파수 root와 최대8.882e−16mm 차이, 허용1e−9. +G/+Δf에서+x, G반전 시−x | 통과 |
| 복소ADC→점응답 | 닫힌 유한 kernel과 최대 성분오차1.105e−15, 허용1e−9 | 통과 |
| 잡음σ | 독립PSD 적분과 최대7.495e−15 차이, 허용1e−12. 고정N에서 분산∝BW | 통과 |
| 표본 정규화/에너지 | Σ64pixel|m|²=1의 오차최대1.111e−15. 연속 이동 중심 크기1, subpixel 이동의 격자 최대는 별개 | 통과 |
| BW/time/단위 | fullBW=2halfBW=64BWpixel, NΔt=1/BWpixel. 첫/마지막 시각차이는(N−1)Δt | 통과 |
| 고정 조건·정답 | 같은N/FOV·기준신호·voxel·NEX/coil/TE, BW와G를 함께 변경. RF BW/진단SNR·EPI phase왜곡과 구별 | 통과 |

기본200Hz/pixel에서 전체12.8kHz, ±6.4kHz, dwell78.125µs, NΔt5ms, 첫/마지막4.921875ms, pixel3.75mm다. Δf200Hz에서 이동1pixel=3.75mm, σ0.1·SNRref10이다. 800Hz/pixel이면 readout1.25ms·σ0.2·SNRref5이며 같은Δf의 이동은0.25pixel이다. 점이 격자 사이에 놓일 때 표본 최대값이 줄어드는 현상을 σ효과로 설명하지 않는다.

자료는 [Larson SNR/BW](https://larsonlab.github.io/MRI-education-resources/Signal%20to%20Noise%20Ratio.html)의 양측/한쪽 대역·readout 관계, [MRI Signal Equation](https://larsonlab.github.io/MRI-education-resources/MRI%20Signal%20Equation.html)의 off-resonance 위상으로 대조했다. 같은 수식이라도 실제수신filter·noise correlation·T2* readout·TE/gradient 제한은 별도이므로 실제 장비의SNR이나허용BW를 보장하지 않는다.

## 실제 화면·조작·내용 확인

[브라우저 스크립트](Q02-browser-check.js), [결과](Q02-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/receiver_bandwidth.html`,1920×1080·390×844의 **216상태**를 확인했다. 화면별16BW×3 offset(−400/0/+400)×2극성, 예시·경계/키보드·문제·초기화를 다뤘다.

- 독립 유한 kernel의501점·64격자와 실제 곡선/점, ADC64개 상대시간 위치, 예상이동 표식·151점σ곡선·반올림된 수치를 대조했다. 좌표1e−6 이내, 표시 수치 반올림 이내. 페이지JS 오류·가로 넘침0.
- BW/offset Home·End·ArrowLeft, 극성 End/Tab, 모든 답Enter·reset과 피드백 복구를 확인했다. 같은고정시간축에서 넓은BW의64개표본이 더 좁은시간구간에 모인다.
- 직접 본 화면: [데스크톱 진입](Q02-page-1920.png), [모바일 진입](Q02-page-390.png), [양의이동](Q02-shift-390.png), [극성반전](Q02-negative-390.png), [좁은BW ADC](Q02-narrow-adc-390.png), [넓은BW ADC](Q02-wide-adc-390.png), [잡음 기대](Q02-noise-390.png). 단위·표식·0축의 겹침/잘림을 발견하지 않았다.

`node --test tests/*.test.cjs`: **70/70 통과**. 새2개 시험은 전체544조건·에너지·0offset·극성/스케일·잘못된입력을 확인한다. 이 결과와 실제 화면/내용 판정은 별개다. 표시를 연결하는 동안 noise곡선도 model의공통함수를 사용하게 해 선택수치와곡선의 계산을 통일했다.

## 최종 판정·범위

Q02의 receiver BW·half/full·Hz/pixel·상대ADC시간·gradient/위치 부호·복소점응답·기대σ·고정조건/문제를 **대상 버전 통과**로 판정한다. 외부전문가검토·실제수신장비·임상영상·readout감쇠/제한·가속/coil결합은 미시행/모형밖이다. N/FOV·샘플시간·k/위상·BW정의·noise조건·gradient/이동·정규화·표시창을 바꾸면 독립단위/kernel/PSD·내용/정답과 실제 두화면을 다시 확인한다. 다음W17/Q03.
