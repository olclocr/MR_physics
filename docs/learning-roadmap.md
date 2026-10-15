# MR Physics 학습 구성과 개발 로드맵

최종 갱신: **2026-10-15 (Asia/Seoul)**

교육 대상은 영상의학과 의사·전공의이다. 물리 원리, 촬영 조건, 영상의 변화, 판독의 함정을 연결한다. 사용자와 논의한 전체 후보를 보존하되 한 페이지에 모든 내용을 넣지 않는다. 기본 형식은 [챕터 작성 지침](chapter-authoring.md), 내용 검토는 [물리적 정합성 검증 계획](physics-validation-plan.md), 짧은 개발 요청의 처리·완료·재개 절차는 [개발 진행 절차](development-workflow.md), 이후 작업자를 위한 지침은 [AGENTS.md](../AGENTS.md)에 둔다.

## 구성 원칙과 학습 경로

한 페이지는 하나의 중심 질문과 2–3개 관찰 과제로 구성한다. 같은 모형에서 조건을 바꾸는 T1W·T2W·PDW는 묶고, 새로운 기전이 필요한 T2*, IR, mapping은 나눈다. 기본 경로는 다음과 같다.

**스핀·공명 → 자화·이완 → 영상 대비·echo → 공간 부호화·k-space → 해상도·화질·시간 → 지방·확산·자화율 → artifact → 정량·분광·AI → 혈류·기능·심장 등 심화**

경로는 독서 순서를 제안하는 것이며 기존 파일의 위치나 이름을 바꾸지 않는다. 임상 관심에 따라 대비 이후 DWI, 지방, SWI로 이동해도 된다. 수학은 필요한 지점에서 간략히 안내하고 심화 수식은 접는다.

### 상태를 읽는 방법

- **페이지 구현:** 학습용 웹페이지가 있다. 검증 상태와 남은 보강은 별도로 확인한다.
- **부분 구현:** 다른 페이지나 문서에 원리 또는 일부 조작만 있다. 독립 챕터가 완성된 상태가 아니다.
- **계획:** 독립 교육 페이지가 없다.
- 기존 페이지의 교육 형식은 균일하지 않다. 새 작성 지침의 모든 항목을 충족한다고 간주하지 않는다.
- 표의 날짜는 로컬 작업 상태이다. 커밋·GitHub Pages 게시 상태를 뜻하지 않는다.
- 구현·시험·브라우저 확인·물리 검증 상태를 구분한다. 구현 후 물리 검토가 남으면 **페이지 구현 / 물리 검증 대기**이다. 모든 ID의 물리 검증 계획과 진행 상태는 [검증 계획 문서](physics-validation-plan.md)에 기록한다.

## 현재 구현과 가장 가까운 보강 작업

| ID | 학습 챕터 | 상태와 연결된 구현 | 앞으로 할 일 |
|---|---|---|---|
| B00 | 세차운동의 고전적 비유 (선택) | 페이지 구현: [자전거 바퀴](bicycle_wheel_precession_interactive.html) | 고전적 비유와 양자 스핀의 경계를 확인 문제로 보강. 정상 세차 모델의 한계 유지 |
| B01 | 스핀·순자화와 열평형 | 페이지 구현: [열평형 학습](spin_ensemble_equilibrium.html) / [대상 버전 통과](verification/2026-10-15/B01-physics.md) | W04에서 실제 점유율·확대·위상 합·B0/온도·확인 문제를 구현. 외부 전문가 검토 미시행 |
| B02 | 라머 공명·RF·flip angle | 페이지 구현: [RF 공명](proton_spin_rf_larmor_resonance.html) / [대상 버전 통과](verification/2026-10-15/B02-physics.md) | W02에서 RF OFF·세 관찰·확인 문제·기호·정규화·모바일 보강. 외부 전문가 검토 미시행 |
| B03 | 자화·회전좌표계·기본 이완 | 페이지 구현: [스핀 MR](proton_spin_mr_simulation.html) / [대상 버전 통과](verification/2026-10-15/B03-physics.md) | W03에서 RF→자유 이완→SE 관찰·정확한 시간 조작·chemical 별도 안내·확인 문제 보강. 외부 전문가 검토 미시행 |
| B04 | 주파수·위상 부호화 | 페이지 구현: [공간 부호화](frequency_phase_encoding_visualization.html) / [대상 버전 통과](verification/2026-10-15/B04-physics.md) | W05에서 세 관찰·예측 문제·부호/시간/표시 창·resize 보강. slice selection은 G02로 분리. 외부 전문가 검토 미시행 |
| B05 | k-space와 역푸리에 변환 | 페이지 구현: [k-space](kspace_inverse_fourier.html) / [대상 버전 통과](verification/2026-10-15/B05-physics.md) | W08에서 복소수·세 관찰·확인 문제·독립 FFT·실제 화면 보강. 외부 전문가 검토 미시행 |
| C01 | T1W·T2W·PDW 영상 대비 | 페이지 구현: [대비 실험실](contrast_weighting.html) / [대상 버전 물리 검증 통과](verification/2026-10-15/C01-physics.md) | 외부 전문가 검토·실제 임상 예시는 남음. T2*·IR·mapping은 후속 챕터로 연결 |

기존 B00/B02/B03/B04의 수치 검산은 [2026-10-14 검증 기록](verification/2026-10-14/README.md)에 있다. B05는 `tests/kspace_inverse_fourier.test.cjs`에 수치·조작 시험이 있다. 기존 페이지의 새 교육 형식 적용과 화면 검증은 필요할 때 각 작업에서 추가 기록한다.

**C01 검증 상태:** W01에서 이상적 SE 정상상태·근사·표시·퀴즈의 통합 물리 검토와 실제 데스크톱·모바일 확인을 완료했다. 대상 버전·독립 검산·시험·화면·적용 범위는 [C01 물리 검증 기록](verification/2026-10-15/C01-physics.md)에 있다. [2026-10-14 구현 검증](verification/2026-10-14/contrast-chapter.md)은 과거 기록으로 보존한다. 외부 전문가 검토와 실제 임상 예시는 남아 있다.

**구현 후 물리 검증의 개발 현황:** C01·B02·B03·B01·B04·C02·C03·B05는 각 W01–W08의 검토 범위에서 **대상 버전 통과**, 기존 B00은 **재검토 대기**이다. 나머지 후속 챕터·확장 후보는 **미착수**이다. 기존 시험을 새 물리 검증 기준의 통과로 소급하지 않는다. [ID별 계획과 상태](physics-validation-plan.md)를 참조한다.

## 핵심 후속 챕터

### 대비와 시퀀스 — 새 기전마다 분리

| ID | 챕터와 중심 질문 | 선행 | 현재 상태 / 구현할 사항 |
|---|---|---|---|
| C02 | SE와 GRE: echo는 어떻게 다시 모이나? | B03, B04, C01 | 페이지 구현: [SE/GRE](spin_gradient_echo.html) / [대상 버전 통과](verification/2026-10-15/C02-physics.md). 외부 전문가 검토 미시행 |
| C03 | T2와 T2*: 왜 GRE에서 더 빨리 어두워지나? | C02 | 페이지 구현: [T2/T2*](t2_t2star_dephasing.html) / [대상 버전 통과](verification/2026-10-15/C03-physics.md). 외부 전문가 검토 미시행 |
| C04 | IR·TI·STIR·FLAIR: 특정 조직을 어떻게 지우나? | C01 | 계획. 같은 inversion 곡선에서 지방/CSF null 비교. 지방억제 선택은 F04에서 연결 |
| C05 | FSE/TSE: 여러 echo를 어떻게 이용하나? | C02, B05 | 계획. ETL, effective TE, echo ordering, blurring |
| C06 | Spoiled GRE: flip angle은 대비에 무엇을 바꾸나? | B02, C01 | 계획. 정상상태, TR·flip angle, Ernst angle은 심화 |
| C07 | EPI: 한 번의 excitation으로 어떻게 빠르게 읽나? | B04, B05 | 계획. readout train·echo spacing·위상 방향 왜곡. D03/A05로 연결 |
| C08 | bSSFP: 정상상태를 유지하면 무엇이 달라지나? | C06 | 계획. balanced gradient, T2/T1 관련 대비, banding |

### 공간 해상도와 화질 — 한 페이지에 변수를 몰지 않음

| ID | 챕터와 중심 질문 | 선행 | 상태 / 구현할 사항 |
|---|---|---|---|
| G01 | FOV·matrix: 촬영 범위와 pixel 크기를 어떻게 정하나? | B04, B05 | 계획. FOV/N, k-space 간격·범위, 획득/재구성 matrix, interpolation |
| G02 | Slice selection·두께·partial volume: 얇게 찍으면 무엇이 달라지나? | B02, B04 | 계획. RF bandwidth/gradient와 slice 두께, 경계 혼합, gap·cross-talk |
| G03 | 2D와 3D: slice와 slab·partition은 어떻게 다른가? | G01, G02 | 계획. 두 획득 방식, isotropic voxel, MPR, 움직임 민감도 |
| Q01 | SNR·CNR·NEX: 더 잘 보이는 영상은 무엇인가? | C01, G01 | 계획. 복소 잡음과 magnitude, averaging의 제곱근 관계, 병변 대비. AI와 기존 SNR 측정 구별 |
| Q02 | Receiver bandwidth: 잡음과 왜곡을 어떻게 바꾸나? | B04, Q01 | 계획. Hz/pixel과 전체 BW 구별, SNR·chemical shift·readout 연결 |
| Q03 | 검사 시간: 어떤 조건을 바꾸면 빨라지나? | C05, G03, Q01 | 계획. 시퀀스별 2D/3D 시간 모형. TR·phase steps·NEX·ETL·partition. multislice 수를 무조건 곱하지 않음 |
| Q04 | Parallel imaging: 코일로 어떻게 덜 찍나? | B05, Q01 | 계획. coil sensitivity, SENSE/GRAPPA 개념, R·g-factor·잔여 aliasing |
| Q05 | Partial Fourier: 덜 얻은 데이터를 어떻게 보완하나? | B05 | 부분 구현(B05의 누락/zero filling). 실제 위상 추정 복원은 별도 구현 |
| Q06 | Compressed sensing: 어떤 조건에서 적은 데이터로 복원하나? | B05, Q04 | 계획. sparsity, incoherent sampling, regularization과 정보 보존 |
| Q07 | SMS: 여러 slice를 동시에 찍을 수 있나? | G02, Q04 | 계획. slice 분리, CAIPI, leakage. Q03의 시간 모형으로 연결 |

### 지방·확산·자화율 — 임상 판독과 연결

| ID | 챕터와 중심 질문 | 선행 | 상태 / 구현할 사항 |
|---|---|---|---|
| F01 | Chemical shift·IP/OP: 물과 지방은 언제 상쇄되나? | B02, B03 | 부분 구현(B03 water/fat). 위상 벡터·TE·B0·지방 비율을 독립 학습으로 구성 |
| F02 | Dixon: 물과 지방 영상을 어떻게 분리하나? | F01 | 계획. 다중 echo, field map, water/fat swap. 단순 IP/OP와 구별 |
| F03 | Spectral fat suppression: 지방만 선택적으로 지울 수 있나? | B02, F01 | 계획. 주파수 선택, B0/B1 불균일, water excitation |
| F04 | 지방억제 선택: fat-sat·STIR·SPIR/SPAIR·Dixon은 언제 다른가? | C04, F02, F03 | 계획. 원리를 재구현하지 않고 방법별 장단점·실패 사례 비교 |
| D01 | DWI·b-value: 움직이는 물은 신호에 어떻게 나타나나? | C02, B04 | 계획. diffusion gradient와 신호 감소. 단순 monoexponential 모형 명시 |
| D02 | ADC·shine-through: 밝은 DWI는 무엇을 뜻하나? | D01, C01 | 계획. DWI/ADC 비교, T2 영향, noise floor와 fitting. 진단적 단정 피하기 |
| D03 | DWI 획득과 왜곡: EPI의 약점은 어떻게 줄이나? | C07, D02 | 계획. BW·echo spacing·가속·분할 readout, 움직임과의 균형 |
| S01 | Susceptibility·T2*·SWI: 신호·위상·blooming은 무엇을 반영하나? | C03, B05 | 계획. magnitude/phase, phase mask, minIP. 벤더별 위상 부호 규약 명시 |
| S02 | QSM: phase에서 susceptibility를 어떻게 추정하나? | S01 | 계획. field와 susceptibility 구별, inverse problem과 한계 |

### Artifact — 관찰 → 원인 → 조절의 공통 형식

| ID | 챕터 | 선행 / 상태 | 구현할 사항 |
|---|---|---|---|
| A01 | Aliasing·wrap-around | G01 / 부분 구현(B05) | FOV·undersampling·oversampling을 비교하고 병변과 혼동하는 사례 |
| A02 | 움직임·ghosting·gating | B05, Q03 / 계획 | 주기/비주기 움직임, phase 방향, 호흡·ECG·navigator, gating efficiency |
| A03 | Gibbs ringing·zero filling | B05, G01 / 부분 구현(B05) | 유한 k-space·경계·필터와 해상도. interpolation이 새 정보와 다른 점 |
| A04 | Chemical shift displacement | Q02, F01 / 계획 | frequency 방향 이동과 IP/OP 경계 상쇄를 구별 |
| A05 | Susceptibility·금속·EPI artifact | C03, C07, S01 / 계획 | signal loss·왜곡, TE·BW·SE/GRE, 금속 저감의 원리. D03으로 연결 |
| A06 | B0/B1 불균일·RF 간섭·코일 문제 | Q01, F03 / 계획 | shading·zipper·coil flare, 원인 감별. 안전 판단과 분리 |

## 정량·분광·AI 심화

| ID | 짧게 나눌 챕터 | 선행 | 상태 / 핵심 구현 |
|---|---|---|---|
| M01 | T2W와 T2 mapping / 여러 echo와 fitting | C01, C02 | 계획. signal points·곡선·map 연결, 오차·noise floor·비단일 지수 |
| M02 | T1 mapping과 ECV의 기초 | C04, M01 | 계획. 획득 모형과 fitting, native/postcontrast. 임상 기준값은 별도 근거 확인 |
| M03 | T2* mapping·R2*와 철 관련 신호 | C03, M01 | 계획. magnitude decay, 짧은 TE, fitting 한계 |
| M04 | PDFF: 지방 비율을 정량화하려면? | F02, M01 | 계획. T1 bias·T2*·지방 multi-peak를 단순 IP/OP와 구별 |
| N01 | NMR/MRS: 화학 환경은 spectrum에 어떻게 나타나나? | B02, F01, B05 | 계획. 핵종·chemical shift·ppm, FID→spectrum |
| N02 | MRS peak를 읽기: 위치·면적·폭·TE | N01 | 계획. NAA·Cho·Cr·lactate 등의 교육 예시, J-coupling은 선택 심화, 과도한 진단 단정 방지 |
| N03 | MRS localization과 품질 | N02, G02 | 계획. single/multivoxel, PRESS/STEAM, water suppression·shimming·오염 |
| E01 | MRE: 파동을 MR로 측정하면 무엇을 알 수 있나? | B04 | 계획. 진동·shear wave·motion encoding·stiffness, 주파수 고정 비교 |
| E02 | MRE 품질과 해석의 한계 | E01 | 계획. inversion·confidence·wave quality, 획득법/주파수 의존성 |
| AI01 | AI 재구성: denoising·가속·선명도 개선 | Q01, Q04, Q06 | 계획. 역할별 비교, data consistency, 합성 잡음/undersampling 실험. 벤더 알고리즘을 임의로 재현했다고 표현하지 않음 |
| AI02 | 벤더별 AI 접근 비교 | AI01 | 계획. GE AIR Recon DL, Siemens Deep Resolve, Philips SmartSpeed/Precise, Canon AiCE/PIQE. 공개 기술 범위와 제품/버전/자료 날짜 기록 |
| AI03 | AI 화질을 평가하기: 작은 구조·texture·정량값 | AI01, M01 | 계획. smoothing·apparent resolution·정보 보존, nonlinear reconstruction에서 SNR 측정의 한계 |

## 나중에 추가할 후보 — 잊지 않고 보존

아래는 독립 웹페이지가 없는 확장 후보이다. 각 묶음은 실제 착수할 때 위의 기준으로 다시 작은 챕터로 나눈다.

| 후보 ID | 주제와 예상 소주제 | 필요한 기반 / 우선순위 |
|---|---|---|
| X01 | 혈류 효과: inflow·flow void·phase·flow compensation | C02, B04 / 임상 심화 우선 |
| X02 | TOF MRA: 2D/3D·saturation·느린 흐름·artifact | X01, G03 / 임상 심화 우선 |
| X03 | Phase contrast·VENC·4D flow | X01, B04 / 후속 |
| X04 | CE-MRA·bolus timing·시간 해상도 | G03, X05 / 후속 |
| X05 | 조영증강 물리: T1 단축·relaxivity·T2* 영향·subtraction | C01, C03 / 임상 심화 우선 |
| X06 | DSC perfusion: 신호-시간 곡선·CBF/CBV/MTT·누출 | C03, C07, X05 / 후속 |
| X07 | DCE perfusion: 조영증강 곡선·약동학·Ktrans 해석 | X05 / 후속 |
| X08 | ASL: labeling·PLD·혈류 map·transit artifact | C04, X01 / 후속 |
| X09 | BOLD/fMRI: 산소화·hemodynamic response·task/rest·통계 | S01, C07 / 선택 심화 |
| X10 | 심장 MRI 기초: cine·gating·시간/공간 해상도 | C08, A02 / 선택 심화 |
| X11 | 심장 LGE·PSIR·T1/T2/ECV mapping | C04, M01, M02, X05 / 선택 심화 |
| X12 | DTI·FA·tensor·tractography와 한계 | D02 / 선택 심화 |
| X13 | 출혈 신호의 시간 변화·hemoglobin·철·susceptibility | C01, S01 / 임상 심화 우선 |
| X14 | Magic angle·조직 방향과 T2 신호 | C01 / 임상 심화 우선 |
| X15 | 장비·B0/B1·shimming·RF 코일·gradient 성능 | B02, B04, Q01 / 공통 보강 |
| X16 | MR 안전 물리: force/torque·SAR·RF 발열·소음·PNS | B02, B04, X15 / 별도 기본 경로. 실제 장비·implant 허용 여부는 최신 공식 기준 확인 |
| X17 | QA·phantom: 기하 정확도·균일도·SNR·ghosting | G01, Q01, A02 / 공통 보강 |
| X18 | MT·CEST/APT·T1rho | B03, C04 / 선택 심화 |
| X19 | Synthetic MRI·MR fingerprinting | M01, M02 / 선택 심화 |
| X20 | 다핵종 MRS/MRI: 31P·13C·23Na·129Xe | N01, N03 / 선택 심화 |
| X21 | MR thermometry·전기적 조직 특성 영상 | C03, S02 / 선택 심화 |
| X22 | Radial·spiral·PROPELLER/BLADE·stack of stars | B05, A02 / 획득법 심화 |

## 개발 순서와 실행 대기열

**다음 실행 항목: W09.** 별도 주제 지정 없이 “개발 진행해”라는 요청을 받으면 아래에서 진행 중인 항목을 재개하거나, 선행 조건을 충족한 가장 앞의 미완료 항목을 실행한다. 완료 후 이 문장·행의 상태·결과 링크를 함께 갱신한다. 작업 상태와 챕터의 구현/물리 검증 상태는 별개다.

2026-10-15 계획 검토 당시에는 **전체 24개 중 23개 통과, 보고서 파일 누락으로 1개 실패**했다. 원인은 [계획 검토 기록](verification/2026-10-15/development-plan-review.md)에 보존한다. 이후 W00에서 보고서 목록·링크·생성을 복구했다. 현재 근거와 시험·화면 결과는 [W00 완료 기록](verification/2026-10-15/W00-report-recovery.md)에 있다. 과거 시험 결과와 현재 검증을 구별한다.

### 첫 개발 묶음

작업 중 상태는 아래 행에서 관리하고, 완료/차단 시 근거 링크와 재개 메모를 붙인다. 의존성은 개발 작업 간 조건이며 학습자가 읽을 순서와는 다르다. 새 챕터의 선행 핵심 모형·설명은 먼저 검토한다. 공통 완료 기준은 [개발 진행 절차](development-workflow.md)를 따른다.

| 순서 / 작업 ID | 대상과 작업 | 선행 작업 | 상태 / 결과 |
|---|---|---|---|
| W00 | 검증 보고서·회귀 시험 복구 | 없음 | 완료 — [생성·회귀·실제 화면 기록](verification/2026-10-15/W00-report-recovery.md) |
| W01 | C01 내용·모형·화면의 통합 재검토 | W00 | 완료 — [물리·수치·실제 화면 기록](verification/2026-10-15/C01-physics.md) |
| W02 | B02 RF 공명 검증과 학습 안내 보강 | W00 | 완료 — [수치·화면·물리 판정](verification/2026-10-15/B02-physics.md) |
| W03 | B03 모드별 검증과 짧은 학습 경로 | W00 | 완료 — [독립 수치·실제 화면·판정](verification/2026-10-15/B03-physics.md) |
| W04 | B01 스핀·ensemble·열평형 독립 챕터 | W00 | 완료 — [고정밀·실제 화면·판정](verification/2026-10-15/B01-physics.md) |
| W05 | B04 공간 부호화 재검토와 예측 문제 | W00 | 완료 — [독립 수치·실제 화면·판정](verification/2026-10-15/B04-physics.md) |
| W06 | C02 SE/GRE echo 비교 챕터 | W01, W02, W03, W04, W05 | 완료 — [검증](verification/2026-10-15/C02-physics.md) |
| W07 | C03 T2/T2*와 dephasing 챕터 | W06 | 완료 — [검증](verification/2026-10-15/C03-physics.md) |
| W08 | B05 k-space 재검토와 선행 안내 | W05 | 완료 — [검증](verification/2026-10-15/B05-physics.md) |
| W09 | G01 FOV·matrix·해상도 챕터 | W05, W08 | 미착수 |
| W10 | G02 slice selection·부분 용적 챕터 | W02, W05 | 미착수 |
| W11 | Q01 SNR·CNR·NEX 챕터 | W01, W09 | 미착수 |
| W12 | B00 고전적 비유의 검증과 한계 | W00 | 미착수 |

W00–W12는 기존 검증을 새 교육으로 이어가는 묶음이다. B01을 누락하지 않고 C02의 선행 기반을 마련하며, B00의 전면 보강 때문에 핵심 경로를 중단하지 않는다. 다만 어느 페이지에서든 확인된 핵심 오류는 표 순서보다 먼저 수정한다.

### 작업별 범위와 인수 기준

아래 기준은 공통 완료 기준에 추가한다. 파일명은 착수 시 기존 파일과 충돌을 확인한 뒤 확정할 제안이며, 미구현 파일의 링크를 만들지 않는다. 새 챕터는 착수할 때 조작 기본값·범위·계산 가정·근거·허용 오차를 구체화한다. 각 완료 때 최소한 다음 세 작업의 카드를 실행 가능한 수준으로 유지한다.

**W00 — 보고서가 있는 상태와 예정인 상태를 구별한다.**

- 확인할 파일: `tests/physics-scientific.test.cjs`, `scripts/render-validation-reports.cjs`, `docs/verification/2026-10-14/fix-validation.md` 및 생성 HTML. 착수 당시 B00/B02/B03/B04의 `*-physics.md`와 `*-physics.html`이 없는데 참조·기본 처리 목록에는 포함되어 있었다.
- 실제 수행하지 않은 챕터별 물리 검증 보고서를 통과 기록으로 만들어 채우지 않는다. 기존 검증 근거와 재검토 대기를 구분해 링크·문구·처리 대상을 일치시킨다. 날짜별 입력·출력 처리 방법도 명확히 한다.
- 인수 기준: `node --test tests/*.test.cjs`와 기본 보고서 생성 명령이 성공하고, 현재 게시 대상으로 지정한 보고서·로컬 자산 링크가 실제로 존재한다. 없는 필수 산출물을 무조건 건너뛰는 방식으로 시험을 무력화하지 않는다. 기존 보고서의 내용·렌더링을 보존하고 생성 HTML을 바꾸면 대표 화면을 확인한다.

**W01 — C01을 통합 검증 기록의 첫 기준 사례로 만든다.**

- 기존 `contrast_weighting.html`, 두 계산 자산, contrast 시험과 2026-10-14 기록을 대조한다. 중심 질문은 “같은 조직이 TR·TE에 따라 왜 다르게 보이나?”를 유지한다.
- 인수 기준: 조직별 PD·회복·감쇠와 고정 표시 창이 설명·표·곡선·영상·퀴즈에서 일치한다. 이상적 SE 식과 설명용 근사를 구분하고, 독립 시간 순서 계산·대표 조건·경계를 확인한다. 새 날짜의 `C01-physics.md`에 근거·버전·오차·실제 화면 결과를 남긴다. 잡음·질병 모형·실제 임상 영상 추가는 제외한다.

**W02 — B02의 공명·off-resonance·flip angle을 예측할 수 있게 한다.**

- 기존 RF 공명 페이지와 `b_eff.md`의 기호·좌표·Hz/rad·시간 정의를 맞춘다. 공명/비공명, RF 세기/길이, RF OFF 중 2–3개 관찰 과제와 피드백을 제공한다.
- 인수 기준: B02 검증 계획의 독립 Bloch 확인과 양·음 detuning, 90°/180°/360°, RF OFF 결과가 실제 화면 설명·자화 그림과 일치한다. nominal flip을 실제 기울기로 단정하는 오개념을 다룬다. pulse shape·slice selection은 제외한다.

**W03 — B03의 여러 모드를 학습 경로로 분리한다.**

- 기존 파일을 유지하며 RF → 자유 이완 → SE의 목표·대표 설정·관찰 순서를 안내한다. water/fat 모드에는 별도 기전과 한계를 표시하고 F01을 예고한다.
- 인수 기준: 유한 RF/이상적 pulse, 전환 연속성, 이완, 180° 전후 자화, TE/TR 기준을 모드별로 검토한다. 기존 chemical 모드의 시간·단위·표시도 영향 범위에 포함한다. 실제 화면의 모드 변경·초기화와 독립 검산을 기록한다. 이 작업에서 새 GRE·Dixon 모형을 추가하지 않는다.

**W04 — B01 “많은 핵에서 순자화는 어떻게 생기나?”**

- 제안 파일: `spin_ensemble_equilibrium.html`. 목표는 개별 핵과 ensemble 구분, population 차이와 순자화 연결, 고전적 그림의 한계 이해다.
- 관찰: 무작위 위상과 횡방향 합, 작은 population 불균형의 확대 표시, B0 또는 온도를 하나씩 바꾸는 열평형 비교 중 최대 세 개다. 실제 비율과 교육상 과장한 그림을 구별한다.
- 인수 기준: 개념 문서의 설명과 새 도식·수치·퀴즈가 일치하고, population/자화의 독립 기준값·대칭/극한을 확인한다. 과장한 화살표 수를 실제 핵의 비율로 읽지 않게 한다. 양자 상태를 고전적 회전 구체로 단정하지 않는다. RF 동역학·조직별 이완은 B02/B03으로 연결한다.

**W05 — B04 공간 부호화의 기반을 재검토한다.**

- gradient 적분·k 좌표·ADC·위상 부호를 독립 대조하고 위치/주파수/위상 예측 문제를 추가한다. slice는 G02로 남긴다.
- 인수 기준: `Gy=0`의 y 정보 소실과 격자 불일치 재구성 제한을 실제 화면에서 확인하고 예측 문제에 설명형 피드백을 제공한다. B04 물리 기록과 데스크톱·모바일 조작 근거를 남긴다. 기존 수치 시험만으로 통합 재검토를 대신하지 않는다.

**W06 — C02 “SE와 GRE는 각각 무엇을 되돌리나?”**

- 제안 파일: `spin_gradient_echo.html`. 목표는 pulse/gradient 시간도식 읽기, 두 재위상화 기전 구별, 정적 off-resonance 조건의 결과 예측이다.
- 관찰: 같은 ensemble에서 SE/GRE 전환, gradient 모멘트 균형 변경, 정적 off-resonance 추가. 시간도식·개별 위상·합성 신호가 같은 상태를 사용한다.
- 인수 기준: gradient 위상과 RF refocusing을 시간 순서로 독립 계산하고 echo 전/TE/후를 대조한다. 화면의 echo 위치·크기·벡터 방향과 정답이 계산과 일치한다. full GRE 정상상태·bSSFP·diffusion은 제외한다.

**W07 — C03 “T2가 같아도 왜 더 빨리 신호가 줄어드나?”**

- 제안 파일: `t2_t2star_dephasing.html`. 목표는 정적 주파수 분포와 T2 감쇠 구분, FID/GRE/SE 비교, refocusing의 한계 설명이다.
- 관찰: T2를 고정해 불균일만 바꾸기, 불균일을 고정해 T2만 바꾸기, refocusing 전후 비교. 분포의 종류·단위·가정을 표시한다.
- 인수 기준: 불균일 0·T2 감쇠만 있는 경우·동일 ensemble의 refocusing을 독립 확인한다. 선택한 주파수 분포의 envelope를 실제 단일 지수 T2*와 무조건 동일시하지 않는다. SE가 불가역 T2를 회복한다는 오개념을 반례·정답으로 다룬다. SWI·금속 모형은 후속으로 남긴다.

**W08 — B05 k-space의 계산과 선행 안내를 재검토한다.**

- 짧은 복소수·크기/위상 안내와 학습 확인을 추가한다. DFT 정규화·단일 성분·conjugate symmetry·Parseval·누락 마스크를 독립 대조한다. 실제 partial Fourier/parallel reconstruction은 제외한다.
- 인수 기준: zero filling이 새 측정 정보를 추가하지 않는다는 설명과 결과가 일치한다. B05 물리 기록, 대표 예측 문제의 설명형 피드백, 데스크톱·모바일 조작 근거가 있다. 기존 수치 시험만으로 통합 재검토를 대신하지 않는다.

**W09 — G01 “범위와 실제 pixel 크기를 어떻게 정하나?”**

- 제안 파일: `fov_matrix_resolution.html`. 관찰은 matrix 고정/FOV 변경, FOV 고정/획득 matrix 변경, 획득 고정/재구성 matrix 변경이다. 목표는 범위·pixel·실제 정보의 구분이다.
- 인수 기준: 공간 격자·k-space 간격/범위·표시 영상이 같은 정의를 사용하고 독립 단위 계산·점/경계 phantom으로 일치한다. 획득과 재구성 matrix를 구별하는 적용 문제를 제공한다. interpolation을 해상도 획득으로 표현하지 않으며 SNR/검사 시간의 전체 조절은 후속으로 남긴다.

**W10 — G02 “어느 위치를 얼마나 두껍게 선택하나?”**

- 제안 파일: `slice_selection_partial_volume.html`. 관찰은 RF bandwidth, slice gradient, 경계에 걸친 slice 두께를 하나씩 바꾸는 세 과제다.
- 인수 기준: 선택 주파수/위치·두께의 독립 계산과 단순 경계 phantom의 공간 적분이 수치·그림·퀴즈에 일치한다. 실제 slice profile과 이상적 profile을 구분하고 gap/cross-talk은 구현한 범위만 설명한다. 3D partition과 SMS는 별도다.

**W11 — Q01 “평균하면 무엇이 더 잘 보이나?”**

- 제안 파일: `snr_cnr_averaging.html`. 관찰은 같은 신호에서 잡음 크기, NEX, 두 구획 신호 차이를 각각 바꾸는 비교다. 복소 잡음과 magnitude 영상을 구별한다.
- 인수 기준: SNR/CNR의 측정 정의와 신호/잡음 단위·고정 창을 표시한다. seed·표본 수·통계 허용 오차를 먼저 정한 평균/분산·averaging 검산과 저신호 magnitude 반례를 기록한다. 매번 다른 잡음으로 NEX 효과가 뒤바뀌는 시연을 피한다. AI denoising·가속·실제 병변 진단은 제외한다.

**W12 — B00의 고전적 비유 범위를 마무리한다.**

- 기존 바퀴 페이지에서 토크·각운동량·세차 방향, 관성·단위·화면 축척과 정상 세차 가정을 재검토한다.
- 인수 기준: 독립 수치/불변량과 실제 그림을 대조하고, 이 비유로 설명 가능한 점/양자 스핀의 실체로 볼 수 없는 점을 확인 문제와 피드백으로 구별한다. 일반적인 강체 운동 해법 구현은 제외한다.

### 이후 승격 순서

첫 묶음 뒤에는 다음 순서에서 **선행 학습의 핵심 구현·검증이 준비된 첫 항목**을 작업 카드로 승격한다. 누락된 선행이 있으면 먼저 보충하며 순서를 바꾼 이유를 기록한다. 단순 주제명에서 바로 큰 페이지를 만들지 않고 개발 진행 절차의 카드 필수 항목을 채운다.

1. **시퀀스·임상 핵심:** C04 → C05 → G03 → Q02 → Q03 → C06 → C07 → Q04 → F01 → F02 → F03 → F04 → D01 → D02 → D03 → S01.
2. **획득·artifact 확장:** C08 → Q05 → Q06 → Q07 → A01 → A02 → A03 → A04 → A05 → A06. 앞 단계의 시연에서 발견한 artifact 설명 오류는 해당 챕터 승격 전이라도 수정한다.
3. **정량·분광·MRE·AI:** M01 → M02 → M03 → M04 → N01 → N02 → N03 → E01 → E02 → S02 → AI01 → AI03 → AI02. 벤더 비교는 원리·평가 기반 뒤에 진행한다.
4. **확장 후보:** X05 → X01 → X02 → X13 → X14를 우선 승격하고, 나머지는 위 후보 표의 선행·우선순위 및 ID 순서로 고른다. X15/X16/X17의 공통 기반·안전·QA는 필요해지는 핵심 주장에 맞춰 앞당길 수 있다. 실제 장비/implant 허용 조건을 추정하지 않는다.

## 현재 작업의 재개 메모

진행 중 항목 없음. 다음 W09 G01. W08의 선행 복소수 안내·확인 문제·독립 FFT·실제 canvas·내용 검토를 완료했다. 사용량 한도 전 GitHub push는 사용자 승인됨. W07까지 로컬 커밋으로 보관했다.

## 작업 기록

| 날짜 | 변경 | 검증과 남은 사항 |
|---|---|---|
| 2026-10-14 | 전체 챕터 ID, 현재 구현 범위, 후속 구현, 확장 후보, 작성·갱신 지침 정리 | 기존 상태는 실제 파일 기준. 새 형식 적용은 페이지별 보강 필요 |
| 2026-10-14 | C01 T1W·T2W·PDW 대비 실험실 추가 | 전체 24개 시험 통과. 1920px/390px 실제 브라우저 검증. 모바일 조작 위치와 숫자 입력 반영 수정. 임상 예시값 표·외부 내용 검토·질병 진단 모형은 미포함 |
| 2026-10-14 | 각 챕터·확장 후보의 물리 검증 계획과 구현 후 검토 절차 추가 | 검증 계획을 개발 대상으로 등록. 기존 구현은 재검토 대기/미착수로 구분하며 이번 문서 작업이 새 검증 통과를 뜻하지 않음 |
| 2026-10-15 | 짧은 개발 요청의 실행 절차, W00–W12 순서·선행·인수 기준, B01 구현과 후속 승격 순서 추가 | 문서·실제 파일 대조, 기본 시험 23/24 통과. 누락 보고서 참조 복구를 W00에 등록. 이번 작업은 문서 보강이며 챕터 구현·물리 검증 상태는 유지 |
| 2026-10-15 | W00 보고서·회귀 기반 복구 | 실제 보고서 목록·날짜 선택·생성 전 입력/자산 확인, 누락 참조 정정, C01 기존 기록의 HTML 생성. [시험·화면·한계](verification/2026-10-15/W00-report-recovery.md). 물리 계산·챕터 판정 유지. 다음 W01 |
| 2026-10-15 | W01 C01 통합 물리 검증·설명 보강 | 회복 차이 설명·TE 의존 회복/근사·정규화·시간 순서·모바일 눈금 수정. [근거·독립 검산·시험·실제 화면·판정 범위](verification/2026-10-15/C01-physics.md). C01 대상 버전 통과, 외부 전문가 검토 미시행. 다음 W02 |
| 2026-10-15 | W02 B02 공명·RF OFF 학습과 통합 검증 | 세 관찰·확인 문제·프레임/단위·정규화·동일 시간 RF OFF·모바일 도식 개선. [독립 수치·시험·화면·판정](verification/2026-10-15/B02-physics.md). 다음 W03 |
| 2026-10-15 | W03 B03 학습 경로와 모드별 통합 검증 | RF→free→SE 관찰, 정확한 시점·정지/재개, 순간 pulse 표시·σf 설명·chemical 한계 보강. 독립 적분에서 찾은 유한 RF 오차를 축소하고 [수치·실제 화면·내용 판정](verification/2026-10-15/B03-physics.md) 완료. 다음 W04 |
| 2026-10-15 | W04 B01 스핀·열평형 독립 챕터 | 실제 population·차이 확대·별도 위상 합·B0/온도 비교·확인 문제 구현. [60자리 독립 수치·실제 화면·내용 판정](verification/2026-10-15/B01-physics.md). 포털·README·개념 문서·B02에 연결. 다음 W05 |
| 2026-10-15 | W05 B04 공간 부호화 통합 검증 | gradient·위상·복소 ADC·누락 역변환을 독립 대조하고 부호·속도·0 신호 위상·표시 창·ADC 표식·실제 resize 오류 수정. [검산·실제 화면·내용 판정](verification/2026-10-15/B04-physics.md). 다음 W06 |

## 참고 방향

MRIQuestions는 주제 선택과 질문 발굴의 참고 자료이며 원문·그림을 복제하지 않는다. 새 페이지마다 실제 사용한 근거를 연결한다.

- [MRIQuestions 전체 주제](https://www.mriquestions.com/index.html)
- [SE 영상 대비와 TR/TE](https://www.mriquestions.com/image-contrast-trte.html)
- [FOV와 k-space](https://www.mriquestions.com/field-of-view-fov.html)
- [DWI와 ADC](https://www.mriquestions.com/trace-vs-adc-map.html)
- [MRI와 MRS](https://www.mriquestions.com/mri-vs-mrs.html)
- [MR elastography](https://www.mriquestions.com/mr-elastography.html)
- [Canon PIQE의 잡음 제거·zero filling·ringing 감소](https://global.medical.canon/publications/mri/g2k/g2k-on-piqe/)

| 2026-10-15 | W06 C02 구현·통합 검증 | 15,562개 시간·조건과 실제 브라우저 68개 상태를 확인하고 모바일 도식·음수 0·축 여백을 보강. [근거와 판정](verification/2026-10-15/C02-physics.md). 다음 W07 |

| 2026-10-15 | W07 C03 구현·통합 검증 | 연속 Gaussian 정적 탈위상·T2의 인자·FID/GRE/SE를 구현. [독립 적분·34개 실제 상태·내용 판정](verification/2026-10-15/C03-physics.md). 다음 W08 |

| 2026-10-15 | W08 B05 통합 물리 재검토 | 1,432개 독립 FFT 조건, 78개 실제 상태·canvas 색, 부호 표시 범위·복소수 안내·예측 문제를 검토·수정. [판정](verification/2026-10-15/B05-physics.md). 다음 W09 |
