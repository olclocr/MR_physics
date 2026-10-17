# A05 공간 field · EPI 위치 역합 검증 (W38)

2026-10-17. **부분 모형 대상 버전 통과 — 단일 주파수4점의1D SE/EPI 중앙 표본 범위.** A05 전체의 실제2D/voxel 분포·metal·보정은 미구현이다. 외부 전문가 검토 미시행.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../field_epi_distortion.html)는 N32/FOV160mm/5mm의4점 y−45/−15/+15/+45mm, 진폭.5/1/.8/.6을 사용한다. 순간 excitation,25ms의 이상적180°,TE50ms이며 q−16…15의 중앙 kx0 표본 시간은50+polarity×q×ESP(ms)다. ESP.5/1/1.5ms, polarity±1, A0/40/80Hz, df=A/Ay/80/Aexp[−((y−20)/30)²]의 균일/선형/국소 함수를 비교한다. 각 점에는 단일 주파수만 있고 이완·분포·noise·motion은 없다.

점별 시간 위상 exp[−i2πdf(t−TE)/1000]와 공간 위상을 합해 실제 복소 자료를 합성한 뒤 inverse1/32로 영상화한다. 예측 y′=y+polarity×160×df(y)×ESP/1000을 개별 점에 적용한다. 이 예측을 서로 간섭하는 magnitude 전체의 정확한 peak와 동일시하지 않는다. ±극성 모두 같은 음의 Nyquist를 유지하므로 시간 끝점의 비대칭을 명시했다. 모든 표본은180° 이후다.

독립 기준은 SI 단위의 두 자유진화→180° 반전→자유진화 순서다. 회전은 작은 각도 Taylor/거듭제곱으로 계산한다. 역영상은 radix-2 FFT, 위치는 unwrap한 개별 점 위상의 선형 회귀로 구한다. Dense곡선은 회귀 위치의 닫힌 Dirichlet 합이다. 복소/점별 진폭1e−9, 위치1e−7mm를 사전 기준으로 정하고 모든54조합과 진폭/echo중심 불변을 검산한다.

[Jezzard와 Balaban, 1995 원전 초록](https://pubmed.ncbi.nlm.nih.gov/7674900/)에서 정적 field 불균일에 따른 EPI pixel shift와 field-map 기반 보정의 연구 범위를 확인했다. 공개 PDF의 스캔 본문 텍스트는 읽지 못했으므로 전문이나 보정 알고리즘을 검토했다고 기록하지 않는다. 여기서는 보정을 구현하지 않으며 원전의 실험 성능을 가져오지 않았다. 핵심 정량 결과는 독립 시간 순서 계산과 위상 회귀로 확인했다.

## 독립 수치 결과

[수집기](A05-numerical.cjs), [결과](A05-numerical.json), [독립 화면 기준](A05-display-reference.json), [Taylor 회전/FFT/회귀](../../../tests/helpers/field-distortion-reference.cjs), [시험](../../../tests/field-distortion.test.cjs)을 사용했다. 54조건/1,728개 복소 native표본/17,334개 dense표본에서 최대 오차는 계수5.51e−14, native영상8.29e−15, dense5.23e−15, 위치3.56e−14mm였다. 점별 진폭 보존 오차2.47e−14로 모든 기준을 통과했다.

기본 선형 A80/ESP1/+극성에서 이동은−7.2/−2.4/+2.4/+7.2mm, 이웃 간격은34.8mm다. 극성 반전 시 간격25.2mm이며 field 자체는 같다. 균일80Hz는 모든 점을+12.8mm 옮겨 간격30mm를 보존한다. A0은 위치 변화를 없앤다. q0의 echo중심 합은 항상2.9이며 모든 개별 점의 자화 크기도 고정이다. Native peak가 달라져도 이 모형에서T2나 intravoxel 분포 소실이 생긴 것은 아니다.

## 실제 브라우저 · 수정 · 내용 검토

[절차](A05-browser-check.js), [결과](A05-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의108상태다. 정적/복원 canvas6,912개 pixel 중심, 복소 신호·dense magnitude SVG·예측 위치선·landmark/시간 표를 독립 기준과 대조했다. 최대 SVG y오차7.70e−6px로 허용1e−4px 이내다. Home/End/ArrowUp·초기화·세 예시·문제 정답/오답·펼친 표·모바일 가로 표 탐색을 확인했다. JS 오류와 페이지 가로 넘침은 없었다.

[데스크톱 선형 field](A05-base-1920.png), [모바일 국소 field](A05-local-390.png), [극성 반전](A05-reverse-1920.png), [모바일 표의 오른쪽 열](A05-table-right-390.png)을 직접 확인했다. 작은 화면에서는 표 자체만 좌우로 움직이며 포커스와 안내를 제공한다. 신호 소실 문제의 초안 질문이 선택지와 논리적으로 맞지 않는 점을 고쳐 “낮아진 pixel peak를 어떻게 해석해야 하나”로 정리한 뒤 최종 화면/정답을 재확인했다.

TE/180°와 시간 순서, 부호·단위·FOV/역합 정규화·음의 Nyquist·주어진field/χ의 구별·단일 주파수와 분포의 차이·개별 위치와 합친 magnitude peak의 차이·고정 창0–1.2·native5mm와 표시0.5mm·극성/ESP·정답을 검토했다. 영상 한 pixel의 어두워짐을T2 단축이나 실제 signal dropout으로 단정하지 않는다.

## 버전 · 남은 범위

[대상 SHA-256](A05-versions.json), [최종 전체 시험](W38-tests.txt), [링크 감사](checkpoint-W38-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제χ→dipole·금속·2D/readout ADC·voxel 내 분포·T2/T2*·signal dropout과 위치 왜곡의 결합·공간적 역보정·field 추정·RF/SAR·임상 성능은 남는다. C03/S01은 소실 기전의 별도 학습으로 연결하며 이 페이지와 결합한 모형으로 주장하지 않는다.
