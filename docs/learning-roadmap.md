# MR Physics 학습 구성과 개발 로드맵

최종 갱신: **2026-10-14 (Asia/Seoul)**

교육 대상은 영상의학과 의사·전공의이다. 물리 원리, 촬영 조건, 영상의 변화, 판독의 함정을 연결한다. 사용자와 논의한 전체 후보를 보존하되 한 페이지에 모든 내용을 넣지 않는다. 기본 형식과 갱신 절차는 [챕터 작성 지침](chapter-authoring.md), 각 챕터 구현 후의 내용 검토는 [물리적 정합성 검증 계획](physics-validation-plan.md), 이후 작업자를 위한 지침은 [AGENTS.md](../AGENTS.md)에 둔다.

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
| B01 | 스핀·순자화와 열평형 | 부분 구현: [개념 문서](mr_physics.md), 스핀 페이지 | 개별 핵과 ensemble, population 차이, 순자화를 짧은 독립 학습으로 정리 |
| B02 | 라머 공명·RF·flip angle | 페이지 구현: [RF 공명](proton_spin_rf_larmor_resonance.html) | 선행 기호 안내, off-resonance 오개념, 확인 문제 추가 |
| B03 | 자화·회전좌표계·기본 이완 | 페이지 구현: [스핀 MR](proton_spin_mr_simulation.html), [유효장 문서](b_eff.md) | 여러 모드를 짧은 경로로 안내. RF, 자유 이완, echo의 학습 목표를 분리하여 안내 |
| B04 | 주파수·위상 부호화 | 페이지 구현: [공간 부호화](frequency_phase_encoding_visualization.html) | 위치와 주파수/위상의 관계에 예측 문제 추가. slice selection은 G02로 분리 |
| B05 | k-space와 역푸리에 변환 | 페이지 구현: [k-space](kspace_inverse_fourier.html) | 선행 복소수 안내와 학습 확인 보강. zero filling과 실제 가속 재구성 구별 유지 |
| C01 | T1W·T2W·PDW 영상 대비 | 페이지 구현: [대비 실험실](contrast_weighting.html) | 임상 예시와 외부 내용 검토. T2*·IR·mapping은 후속 챕터로 연결 |

기존 B00/B02/B03/B04의 수치 검산은 [2026-10-14 검증 기록](verification/2026-10-14/README.md)에 있다. B05는 `tests/kspace_inverse_fourier.test.cjs`에 수치·조작 시험이 있다. 기존 페이지의 새 교육 형식 적용과 화면 검증은 필요할 때 각 작업에서 추가 기록한다.

**C01 검증 상태:** 수치·조작 확인 및 실제 브라우저 확인 완료. 전체 24개 시험 통과, 1920px 데스크톱과 390px 모바일의 화면·입력·초기화 확인. [검증 내용과 화면](verification/2026-10-14/contrast-chapter.md). 외부 내용 검토와 실제 임상 예시의 추가는 남아 있다.

**구현 후 물리 검증의 개발 현황:** C01과 기존 B00/B02–B05는 기존 검산 근거를 유지하면서 내용·모형·화면의 통합 재검토를 **재검토 대기**로 등록했다. B01과 나머지 후속 챕터·확장 후보는 **미착수**이다. 기존 시험을 새 물리 검증 기준의 통과로 소급하지 않는다. [ID별 계획과 상태](physics-validation-plan.md)를 참조한다.

## 핵심 후속 챕터

### 대비와 시퀀스 — 새 기전마다 분리

| ID | 챕터와 중심 질문 | 선행 | 현재 상태 / 구현할 사항 |
|---|---|---|---|
| C02 | SE와 GRE: echo는 어떻게 다시 모이나? | B03, C01 | 부분 구현(B03의 SE). refocusing과 gradient reversal 비교, 시간도식 |
| C03 | T2와 T2*: 왜 GRE에서 더 빨리 어두워지나? | C02 | 부분 구현(B03). 정적 불균일과 회복 가능한/불가능한 dephasing 구별 |
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

## 개발 순서

1. **현재 구현한 첫 추가 페이지:** C01 대비 실험실. 학습 형식·동기화된 곡선/영상·고정 표시 창·모델 검산의 예시로 삼는다. 다음 보강에는 C01의 구현 후 내용·모형·화면 정합성 재검토를 포함한다.
2. **가까운 다음 작업:** C02/C03 echo와 T2*, G01 FOV/matrix, G02 slice, Q01 SNR. 한 번에 하나의 페이지를 구현하고 검증한다.
3. **검사 선택 실험실:** C05 FSE, G03 2D/3D, Q02 bandwidth, Q03 시간, Q04 가속. 계산 가정이 다른 획득법을 단계적으로 추가한다.
4. **임상 핵심:** C04 IR, F01–F04 지방, C07 EPI, D01/D02 확산, S01 SWI. 해당 artifact 챕터를 함께 연결한다.
5. **심화:** M01 T2 mapping, N01 MRS, E01 MRE, AI01 재구성. 벤더 비교와 정량 해석은 기반 완성 후 추가한다.
6. **지속 보강:** 기존 페이지의 선행 지식·오개념·추가 질문·확인 문제를 새 형식에 맞춘다. 확장 후보는 임상 활용도와 선행 구현 상태로 선택한다.
7. **각 챕터 구현 직후:** 해당 ID의 물리 검증 계획을 수행하고 발견 사항 수정·재검증·결과 저장을 같은 개발 묶음에 포함한다. 시험·화면 확인과 내용의 물리 판정을 각각 기록한다.
8. **기존 내용 재검토:** C01에 이어 B02/B03/B04/B05/B00의 기존 검산과 설명·도식의 일치를 재확인한다. 발견한 오류의 수정은 후속 챕터 구현과 함께 개발 우선순위를 조정한다.

## 작업 기록

| 날짜 | 변경 | 검증과 남은 사항 |
|---|---|---|
| 2026-10-14 | 전체 챕터 ID, 현재 구현 범위, 후속 구현, 확장 후보, 작성·갱신 지침 정리 | 기존 상태는 실제 파일 기준. 새 형식 적용은 페이지별 보강 필요 |
| 2026-10-14 | C01 T1W·T2W·PDW 대비 실험실 추가 | 전체 24개 시험 통과. 1920px/390px 실제 브라우저 검증. 모바일 조작 위치와 숫자 입력 반영 수정. 임상 예시값 표·외부 내용 검토·질병 진단 모형은 미포함 |
| 2026-10-14 | 각 챕터·확장 후보의 물리 검증 계획과 구현 후 검토 절차 추가 | 검증 계획을 개발 대상으로 등록. 기존 구현은 재검토 대기/미착수로 구분하며 이번 문서 작업이 새 검증 통과를 뜻하지 않음 |

## 참고 방향

MRIQuestions는 주제 선택과 질문 발굴의 참고 자료이며 원문·그림을 복제하지 않는다. 새 페이지마다 실제 사용한 근거를 연결한다.

- [MRIQuestions 전체 주제](https://www.mriquestions.com/index.html)
- [SE 영상 대비와 TR/TE](https://www.mriquestions.com/image-contrast-trte.html)
- [FOV와 k-space](https://www.mriquestions.com/field-of-view-fov.html)
- [DWI와 ADC](https://www.mriquestions.com/trace-vs-adc-map.html)
- [MRI와 MRS](https://www.mriquestions.com/mri-vs-mrs.html)
- [MR elastography](https://www.mriquestions.com/mr-elastography.html)
- [Canon PIQE의 잡음 제거·zero filling·ringing 감소](https://global.medical.canon/publications/mri/g2k/g2k-on-piqe/)
