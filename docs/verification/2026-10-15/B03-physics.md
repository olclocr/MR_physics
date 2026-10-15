# B03 자화·이완·SE 통합 물리 검증 (W03)

검증 날짜: 2026-10-15 (Asia/Seoul). **판정: 아래 범위에서 대상 버전 통과. 외부 전문가 검토 미시행.**

대상: `proton_spin_mr_simulation.html`, 공통 `assets/mr-physics-models.js` 및 독립 기준·시험·화면 검증 스크립트. 기준 commit `46e99bf` 이후 로컬 변경을 검토했다. 최종 대상별 SHA-256은 [버전 목록](B03-versions.json)에 있다. 이 기록은 해당 파일 버전의 로컬 검토이며 GitHub 게시 확인을 뜻하지 않는다.

## 중심 질문과 판정 범위

RF가 꺼진 뒤 자화와 신호는 어떻게 달라지는가? RF 종료 → 자유 이완 → SE의 세 관찰, 별도 chemical 모드의 기존 계산·표시를 검토했다. 유한 RF는 평형에서 한 번, 시퀀스는 ideal pulse와 spoiling을 가진 반복 정상상태에서 시작한다. RF amplitude/time/nominal angle이 시퀀스에 적용되지 않음을 UI에서 구분했다.

## 사전 확인 계획

- 유한 hard RF: 공통 구현을 호출하지 않는 RK4 Bloch 적분과 비교. 단위 ms, Δf=fspin−fRF, M0=1. B1=1/10/30 µT, Δf=−120/0/+120 Hz, 0/90/180/270/360°, T1/T2 경계. 각 성분 절대 오차 ≤ 2e−5. RF 종료→자유 이완 t=0 연속 오차 ≤ 1e−12.
- RF OFF: 독립 지수·복소 회전으로 0/T2/T1/5000 ms 확인. 절대 오차 ≤ 1e−12.
- SE: 반복 종자화의 독립 정상상태, 9개 주파수의 복소수 위상과 180°의 y/z 반전. TE/2 직전·직후/TE/TR, spread=0/35/100 Hz, TR/TE 경계. 절대 오차 ≤ 1e−11.
- Chemical: 독립 water/fat 복소 합, ppm→Hz와 IP/OP 시간, 지방 0/50/100%, B0=1.5/3 T. 절대 오차 ≤ 1e−11. 같은 T1/T2·단일 fat peak·spoiled excitation 모형의 한계를 설명한다.
- 실제 Chrome 1920×1080 및 390×844에서 세 관찰, 모드·초기화·정지/재개·시간 조작·퀴즈·화면 겹침·숫자/벡터를 대조한다. 캔버스 stub은 화면 검증으로 취급하지 않는다.

## 근거·부호·적용 조건

1. [Larson, Principles of MRI: Bloch Equation](https://larsonlab.github.io/MRI-education-resources/Bloch%20Equation.html) (2026, 확인 2026-10-15): `dM/dt=γ M×B`, RF와 회전좌표계, 지수 이완을 기준으로 삼았다. 예시 코드의 회전 부호를 복사하지 않고 지배 방정식에서 독립 적분했다. 단위는 ms·Hz·µT, 오른손 좌표와 양의 proton γ를 사용한다. `Δf=fspin−fRF`, 앞 B02의 `δ=fRF−fspin`과는 부호를 바꾼다. Δf>0에서 횡자화의 복소 위상은 감소한다.
2. [Larson: Gradient and Spin Echo Pulse Sequences](https://larsonlab.github.io/MRI-education-resources/Gradient%20and%20Spin%20Echoes.html): 180°에 의한 정적 off-resonance 재위상화와 남는 T2 감쇠를 대조했다. SE 정상상태의 T1 회복·180° 반전 순서는 [C01 검증의 근거와 독립 확인](C01-physics.md)을 함께 사용했다. TR/TE 경계에서도 단순 `1−exp(−TR/T1)`로 대체하지 않는다.
3. [Brodsky et al., JMRI 2010, doi:10.1002/jmri.22308](https://pmc.ncbi.nlm.nih.gov/articles/PMC2949297/) Theory 식 1·9: 물·지방의 복소 성분 합과 단일/multi-peak 차이를 확인했다. PMC 직접 열기는 확인 페이지였으나 검색에서 원문 Theory를 읽었다. 문헌의 복소 위상 부호와 화면 좌표 부호의 차이는 공액 변환이며 magnitude 간섭은 동일하다. 이 페이지는 분리 알고리즘을 구현하지 않는다.
4. [Seiberlich, Michigan MRI 기초 강의](https://courses.lsa.umich.edu/fmri-training-course/wp-content/uploads/sites/17/2021/08/Seiberlich-Lecture-1.pdf)의 3.5 ppm 설명을 검색 원문에서 확인했다. `γ̄[MHz/T] × B0[T] × 3.5 ppm`의 수치가 Hz가 된다. 지방의 단일 주파수는 물보다 낮게 둔다. 실제 fat spectrum·T2*·PDFF와 동일하다고 주장하지 않는다.

M0=1인 수치와 3 T 기준의 그림 길이를 구분했다. 회색 SE 화살표는 각 묶음의 자화, 빨간 순자화는 가중 평균이다. σf는 ±2σf에서 잘라 9개로 이산화한 Gaussian 폭 매개변수이며 실제 이산 분포의 표준편차와 같지 않다. σf=0은 한 묶음이다. 이산 모형에는 늦은 시점의 인공 재결맞음이 가능하므로 연속 조직의 T2* 추정에 쓰지 않는다.

## 독립 수치 결과

명령: `node docs/verification/2026-10-15/B03-numerical.cjs`. 독립 기준은 `tests/helpers/spin-reference.cjs`에 있으며 공통 모델의 회전·이완·신호 함수를 호출하지 않는다. [최종 1,311개 결과](B03-numerical.json), [수정 전 결과](B03-before-numerical.json), [수집 스크립트](B03-numerical.cjs)를 보존했다.

| 항목 | 조건 수 | 독립 기준 | 관측 최대 성분 절대 오차 | 판정 |
|---|---:|---|---:|---|
| 유한 RF 종료 | 135 | 12,000-step RK4, ms의 Bloch 미분식 | 2.081e−6 | ≤2e−5 통과 |
| 자유 이완 | 540 | 같은 시작 자화에 독립 복소 회전·지수 회복 | 2.221e−16 | ≤1e−12 통과 |
| SE | 420 | 시간 순서의 z 회복·반전 + 각 주파수의 해석적 복소 위상 | 2.759e−15 | ≤1e−11 통과 |
| Chemical | 216 | 두 성분의 독립 복소 합 | 5.552e−17 | ≤1e−11 통과 |

자유 이완 행은 이완 자체의 오차와 RF의 오차를 분리한다. `endToEndReference`에는 독립 RK4 종료 자화로부터 이완한 값도 저장했다. 브라우저는 그 기준과 대조한다. RF→free의 같은 종료 시점은 135개 조건에서 ≤1e−12로 연속이다. 이상적 180°는 불연속 회전이므로 연속이라고 판정하지 않고, `x 유지 / y,z 반전 / 각 Δf 유지`를 직접 확인했다. TE에서 위상은 다시 모이고 신호에는 `exp(−TE/T2)`가 남는다. TR 직전 z는 다음 excitation의 정상상태 A로 돌아온다.

경계는 0/90/180/270/360°, B1=1/10/30 µT, Δf 양·음·0, T1/T2 경계, TR=100~5000 ms, TE=15.1 ms의 반눈금(7.55 ms), TE=TR−1, spread=0/35/100 Hz, 물·지방 단독/동량, 1.5/3 T이다. 물·지방 동량은 해석적 첫 OP에서 수치 오차 수준으로 상쇄하고, 한 성분만 있으면 공통 위상 변화로 magnitude가 변하지 않는다.

## 발견 문제 → 수정 → 재검증

- B1=30 µT·짧은 T2·큰 flip에서 기존 분할법의 오차가 사전 한도 2e−5를 넘었다(최대 2.431e−5). 최대 step 0.025→0.01 ms, 주기당 40→160 step으로 바꾸어 최대 2.081e−6으로 낮췄다. 허용 오차를 늘리지 않았다. 공통 `hardPulse`의 페이지 호출자는 B03뿐이며 `spinEcho`·`chemical`·C01 대비 함수·B02의 자체 해석식은 바꾸지 않았다. 관련 회귀를 포함해 전체 시험을 다시 실행했다.
- 자유 이완은 계속 재생되어 정확한 T1/T2 시점을 보기 어려웠다. RF·free·sequence의 정지/재개, free의 0~5000 ms 관찰, 초기화 시 정지 상태 해제를 추가했다. RF 종료 0 ms, T2에서 종료 횡자화의 e⁻¹, T1에서 남은 종자화 간격의 e⁻¹을 같은 시작 자화로 대조했다.
- 이상적 순간 pulse를 B1 세기와 유한 시간 화살표처럼 표시하던 구간을 없앴다. pulse 시점의 값은 회전 직후이며 이벤트는 정확한 시점에만 붙인다. 관련 없는 모드별 조작을 비활성화했다.
- 긴 TR의 선형 시간축에서 90°/180°/TE 이름이 겹칠 수 있었다. tick 위치는 유지하고, 읽을 수 있는 시간 버튼으로 정확히 이동하게 바꿨다. TE/2가 슬라이더 0.1 ms 사이에 놓이는 7.55 ms에서도 정확한 state와 소수 둘째 자리 표시를 확인했다.
- σf=0에서 계속 9 groups라고 쓰던 표시, σf를 실제 표준편차로 읽을 위험, 반올림된 TE 표시를 수정했다. 초기화가 현재 매개변수를 보존한다는 점을 명시했다.
- 확인 문제의 정답은 정적 주파수 차이로 벌어진 위상이며, T2 감쇠·종자화 반전과 혼동하지 않도록 피드백을 제공했다.

## 시험·실제 화면

시작 시험 32/32, 최종 `node --test tests/*.test.cjs` **36/36 통과** (Node v22.18.0). 새 네 시험은 독립 RF/이완, SE 위상·시간, chemical 합, 관찰·정지·초기화 동작을 검증한다. [실제 Chrome 조작 스크립트](B03-browser-check.js)와 [52개 실제 상태 결과](B03-browser-check.json)를 저장했다.

Chrome 155.0.8059.40, `http://127.0.0.1:8766/docs/proton_spin_mr_simulation.html` (최신 파일 확인을 위한 `qa` query 및 HTTP cache 비활성화), **1920×1080 / 390×844**에서 확인했다. 세 관찰, 유한 RF의 정지/재개·종료, 0°, free·SE의 시간 정지/재개, TE/2 전후·TE·TR, 분포 0, 7.55 ms, TE/TR·T2≤2T1 제한, 물·지방 양 끝과 동량, 모드 변경·preset·초기화, 키보드 Home/End·퀴즈 Enter가 통과했다. DOM 숫자는 계산값을 반올림한 값과 일치하고, 그림 벡터는 독립 계산과 허용 오차 안에서 일치한다. 페이지 가로 넘침·빈 canvas·JS 오류 0건. `getImageData` 반복에 대한 성능 권고는 시험 계측에서 발생했으며 모델 오류가 아니다.

독립 RF 종료부터 계산한 실제 화면 벡터의 최대 성분 오차는 5.265e−7이었다. [보고서 링크 확인 스크립트](B03-report-browser-check.js)로 실제 페이지에서 보고서를 열어 두 viewport에서 표 두 개·가로 넘침 0을 확인했다. [보고서 1920](B03-report-1920.png) / [390](B03-report-390.png)도 직접 열어 읽기와 표 배치를 확인했다.

다음 원본 PNG를 직접 열어 제목·라벨·벡터·지시선·카드·시간 조작·정답을 확인했다. 화면 판정은 stub 시험으로 대체하지 않았다.

| 장면 | 데스크톱 | 모바일 |
|---|---|---|
| 전체와 학습 경로 | [1920](B03-page-1920.png) | [390](B03-page-390.png) |
| RF 종료 자화 | [1920](B03-scene-1920.png) | [390](B03-scene-390.png) |
| 180° 직후 | [1920](B03-refocus-1920.png) | [390](B03-refocus-390.png) |
| 시간 조작·이벤트 | [1920](B03-controls-1920.png) | [390](B03-controls-390.png) |
| Water/fat 근접 OP | [1920](B03-chemical-1920.png) | [390](B03-chemical-390.png) |
| 학습 후 문제 | [1920](B03-lesson-1920.png) | [390](B03-lesson-390.png) |

[변경 전 모바일](B03-before-390.png)은 비교용으로 남긴다. 표시·시간·부호·수식·quiz·적용 범위를 검토했으며 위 버전에 한정해 통과한다. 외부 전문가 검토, 실제 임상 영상, GRE/Dixon·다중 peak·연속 주파수 분포는 미시행/범위 밖이다. 후속 계산·시간·부호·모형·표시 변경은 해당 범위를 다시 검증해야 한다.
