# MR Physics 학습 구성과 개발 로드맵

최종 갱신: **2026-10-17 (Asia/Seoul)**

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
| B00 | 세차운동의 고전적 비유 (선택) | 페이지 구현: [자전거 바퀴](bicycle_wheel_precession_interactive.html) / [대상 버전 통과](verification/2026-10-15/B00-physics.md) | W12에서 힘 척도·signed 세차·정지/예시/초기화·문제·모바일 라벨 보강. 일반 강체/양자 실체 모형은 제외 |
| B01 | 스핀·순자화와 열평형 | 페이지 구현: [열평형 학습](spin_ensemble_equilibrium.html) / [대상 버전 통과](verification/2026-10-15/B01-physics.md) | W04에서 실제 점유율·확대·위상 합·B0/온도·확인 문제를 구현. 외부 전문가 검토 미시행 |
| B02 | 라머 공명·RF·flip angle | 페이지 구현: [RF 공명](proton_spin_rf_larmor_resonance.html) / [대상 버전 통과](verification/2026-10-15/B02-physics.md) | W02에서 RF OFF·세 관찰·확인 문제·기호·정규화·모바일 보강. 외부 전문가 검토 미시행 |
| B03 | 자화·회전좌표계·기본 이완 | 페이지 구현: [스핀 MR](proton_spin_mr_simulation.html) / [대상 버전 통과](verification/2026-10-15/B03-physics.md) | W03에서 RF→자유 이완→SE 관찰·정확한 시간 조작·chemical 별도 안내·확인 문제 보강. 외부 전문가 검토 미시행 |
| B04 | 주파수·위상 부호화 | 페이지 구현: [공간 부호화](frequency_phase_encoding_visualization.html) / [대상 버전 통과](verification/2026-10-15/B04-physics.md) | W05에서 세 관찰·예측 문제·부호/시간/표시 창·resize 보강. slice selection은 G02로 분리. 외부 전문가 검토 미시행 |
| B05 | k-space와 역푸리에 변환 | 페이지 구현: [k-space](kspace_inverse_fourier.html) / [대상 버전 통과](verification/2026-10-15/B05-physics.md) | W08에서 복소수·세 관찰·확인 문제·독립 FFT·실제 화면 보강. 외부 전문가 검토 미시행 |
| C01 | T1W·T2W·PDW 영상 대비 | 페이지 구현: [대비 실험실](contrast_weighting.html) / [대상 버전 물리 검증 통과](verification/2026-10-15/C01-physics.md) | 외부 전문가 검토·실제 임상 예시는 남음. T2*·IR·mapping은 후속 챕터로 연결 |

기존 B00/B02/B03/B04의 수치 검산은 [2026-10-14 검증 기록](verification/2026-10-14/README.md)에 있다. B05는 `tests/kspace_inverse_fourier.test.cjs`에 수치·조작 시험이 있다. 기존 페이지의 새 교육 형식 적용과 화면 검증은 필요할 때 각 작업에서 추가 기록한다.

**C01 검증 상태:** W01에서 이상적 SE 정상상태·근사·표시·퀴즈의 통합 물리 검토와 실제 데스크톱·모바일 확인을 완료했다. 대상 버전·독립 검산·시험·화면·적용 범위는 [C01 물리 검증 기록](verification/2026-10-15/C01-physics.md)에 있다. [2026-10-14 구현 검증](verification/2026-10-14/contrast-chapter.md)은 과거 기록으로 보존한다. 외부 전문가 검토와 실제 임상 예시는 남아 있다.

**구현 후 물리 검증의 개발 현황:** B00–B05·C01–C08·G01–G03·Q01–Q07(Q06은 유한반복/표시 범위)·F01–F04(F03은 선택 SAT·두 RF 물 여기 범위)·D01–D02·D03(균일field/시간 예측 범위)·S01(주어진분포/GRE·후처리 범위)는 각 W01–W34의 검토 범위에서 **대상 버전 통과**다. 다른 후속 챕터·확장 후보는 아래 표의 구현·검토 상태를 확인한다. 통과는 대상 버전/범위에 한정하며 외부 전문가 검토는 미시행이다. [ID별 계획과 상태](physics-validation-plan.md).

## 핵심 후속 챕터

### 대비와 시퀀스 — 새 기전마다 분리

| ID | 챕터와 중심 질문 | 선행 | 현재 상태 / 구현할 사항 |
|---|---|---|---|
| C02 | SE와 GRE: echo는 어떻게 다시 모이나? | B03, B04, C01 | 페이지 구현: [SE/GRE](spin_gradient_echo.html) / [대상 버전 통과](verification/2026-10-15/C02-physics.md). 외부 전문가 검토 미시행 |
| C03 | T2와 T2*: 왜 GRE에서 더 빨리 어두워지나? | C02 | 페이지 구현: [T2/T2*](t2_t2star_dephasing.html) / [대상 버전 통과](verification/2026-10-15/C03-physics.md). 외부 전문가 검토 미시행 |
| C04 | IR·TI·STIR·FLAIR: 특정 조직을 어떻게 지우나? | C01 | 페이지 구현: [IR·TI·null](inversion_recovery.html) / [대상 버전 통과](verification/2026-10-15/C04-physics.md). TE0 이상적 읽기·유한 TR·signed/magnitude. 실제 IR-FSE/PSIR 제외 |
| C05 | FSE/TSE: 여러 echo를 어떻게 이용하나? | C02, B05 | 페이지 구현: [Echo train·ordering](fast_spin_echo.html) / [대상 버전 통과](verification/2026-10-15/C05-physics.md). 명시한1D T2 가중/복소 역합. 실제 FA/stimulated echo 제외 |
| C06 | Spoiled GRE: flip angle은 대비에 무엇을 바꾸나? | B02, C01 | 페이지 구현: [Spoiled GRE](spoiled_gre.html) / [대상 버전 통과](verification/2026-10-15/C06-physics.md). 이상적 spoiling·과도/정상상태·Ernst. 실제 spoiling 제외 |
| C07 | EPI: 한 번의 excitation으로 어떻게 빠르게 읽나? | B04, B05 | 페이지 구현: [EPI 경로·시간](epi_trajectory.html) / [대상 버전 통과](verification/2026-10-15/C07-physics.md). ADC/gradient·중앙1D PE근사. 실제2D/eddy 제외 |
| C08 | bSSFP: 정상상태를 유지하면 무엇이 달라지나? | C06 | 두 페이지 구현: [반복/주파수응답](balanced_ssfp.html)·[T1/T2 대비/근사](bssfp_contrast_limits.html) / [반복 검증](verification/2026-10-16/C08-physics.md)·[대비 검증](verification/2026-10-16/C08-contrast-physics.md). 순간RF·단일spin의지정범위통과, 실제조직/finiteRF는제외 |

### 공간 해상도와 화질 — 한 페이지에 변수를 몰지 않음

| ID | 챕터와 중심 질문 | 선행 | 상태 / 구현할 사항 |
|---|---|---|---|
| G01 | FOV·matrix: 촬영 범위와 pixel 크기를 어떻게 정하나? | B04, B05 | 페이지 구현: [FOV·matrix](fov_matrix_resolution.html) / [대상 버전 통과](verification/2026-10-15/G01-physics.md). 1D 점/경계·획득/표시 격자·k-space 검증. 외부 전문가 검토 미시행 |
| G02 | Slice selection·두께·partial volume: 얇게 찍으면 무엇이 달라지나? | B02, B04 | 두 범위 구현: [이상적 선택/부분 용적](slice_selection_partial_volume.html)·[유한RF/profile](finite_rf_slice_profile.html) / [이상적](verification/2026-10-15/G02-physics.md)·[유한RF 검증](verification/2026-10-17/G02-rf-physics.md). 실제장비pulse·rephaser/echo·gap/cross-talk은 남음 |
| G03 | 2D와 3D: slice와 slab·partition은 어떻게 다른가? | G01, G02 | 페이지 구현: [2D/3D·MPR](volume_2d_3d.html) / [대상 버전 통과](verification/2026-10-15/G03-physics.md). 동일3D box·voxel평균·재단면. 실제PSF/움직임/시간 제외 |
| Q01 | SNR·CNR·NEX: 더 잘 보이는 영상은 무엇인가? | C01, G01 | 페이지 구현: [SNR·CNR·평균](snr_cnr_averaging.html) / [대상 버전 통과](verification/2026-10-15/Q01-physics.md). 단일 복소 채널·고정 voxel·독립 반복. 실제 임상/AI는 모형 밖 |
| Q02 | Receiver bandwidth: 잡음과 왜곡을 어떻게 바꾸나? | B04, Q01 | 페이지 구현: [Receiver BW](receiver_bandwidth.html) / [대상 버전 통과](verification/2026-10-15/Q02-physics.md). 전체/±/Hzpixel·ADC·generic off-res 위치·기대잡음. 실제 수신/감쇠 제외 |
| Q03 | 검사 시간: 어떤 조건을 바꾸면 빨라지나? | C05, G03, Q01 | 페이지 구현: [이벤트 수와 시간](scan_time.html) / [대상 버전 통과](verification/2026-10-15/Q03-physics.md). 2D/3D 배정·나머지·NEX·gating·준비. 실제 장비 견적 제외 |
| Q04 | Parallel imaging: 코일로 어떻게 덜 찍나? | B05, Q01 | 페이지 구현: [Coil·R2·잡음](parallel_imaging.html) / [대상 버전 통과](verification/2026-10-15/Q04-physics.md). 두위치/coil 선형모형·g/√R·분리실패. 실제map/vendor 제외 |
| Q05 | Partial Fourier: 덜 얻은 데이터를 어떻게 보완하나? | B05 | 페이지 구현: [표본/위상복원](partial_fourier_phase.html) / [대상버전통과](verification/2026-10-16/Q05-physics.md). 중앙추정/정답prior·단순128회위상선반복, vendor/임상은제외 |
| Q06 | Compressed sensing: 희소성으로 무엇을 더 가정하나? | B05, Q05 | 페이지 구현: [Haar/표본/L1](compressed_sensing_sparsity.html) / [지정유한반복범위 통과](verification/2026-10-16/Q06-physics.md). 두조합2000회solver기준미달표시, vendor/임상은제외 |
| Q07 | SMS: 여러 slice를 동시에 찍을 수 있나? | G02, Q04 | 페이지 구현: [두 slice/coil·CAIPI](sms_slice_separation.html) / [대상 모형 통과](verification/2026-10-17/Q07-physics.md). 공간/균일 감도·오보정 leakage·묶음 수. 실제 RF/profile·장비 시간·SNR 제외 |

### 지방·확산·자화율 — 임상 판독과 연결

| ID | 챕터와 중심 질문 | 선행 | 상태 / 구현할 사항 |
|---|---|---|---|
| F01 | Chemical shift·IP/OP: 물과 지방은 언제 상쇄되나? | B02, B03 | 페이지 구현: [IP/OP](chemical_shift_ip_op.html) / [대상 버전 통과](verification/2026-10-15/F01-physics.md). 단일peak 물/지방·복소합·B0/TE/비율·공통감쇠. 실제multipeak/PDFF 제외 |
| F02 | Dixon: 물과 지방 영상을 어떻게 분리하나? | F01 | 페이지 구현: [복소 분리·field](dixon_water_fat.html) / [대상 버전 통과](verification/2026-10-15/F02-physics.md). 2echo/검증3echo·field/교환. 실제map/multipeak 제외 |
| F03 | Spectral fat suppression: 지방만 선택적으로 지울 수 있나? | B02, F01 | 두 페이지 구현: [선택 saturation](spectral_fat_saturation.html)·[Water excitation](water_excitation.html) / [SAT 검증](verification/2026-10-15/F03-physics.md)·[물 여기 검증](verification/2026-10-15/F03-water-physics.md). 두 한계모형 범위 통과 |
| F04 | 지방억제 선택: fat-sat·STIR·SPIR/SPAIR·Dixon은 언제 다른가? | C04, F02, F03 | 페이지 구현: [선택원리/실패비교](fat_suppression_comparison.html) / [대상버전통과](verification/2026-10-15/F04-physics.md). 세모형재사용·지원범위/스케일구별. SPIR/SPAIR는기전설명만 |
| D01 | DWI·b-value: 움직이는 물은 신호에 어떻게 나타나나? | C02, B04 | 페이지 구현: [확산·b-value](diffusion_b_value.html) / [대상버전통과](verification/2026-10-15/D01-physics.md). 자유1D/Brownian·유한lobe·동일TE b0정규화. 실제조직/수신잡음 제외 |
| D02 | ADC·shine-through: 밝은 DWI는 무엇을 뜻하나? | D01, C01, Q01 | 페이지 구현: [ADC/T2/잡음](adc_fitting_shine_through.html) / [대상버전통과](verification/2026-10-15/D02-physics.md). 동일TE단일지수·log OLS·음수/바닥. 실제임상map/진단 제외 |
| D03 | DWI 획득과 왜곡: EPI의 약점은 어떻게 줄이나? | C07, D02 | 부분 구현: [신호·EPI 시간/위치](dwi_epi_conditions.html) / [해당범위 통과](verification/2026-10-16/D03-physics.md). 공간field/움직임·실제coil/분할재구성은 A05/A02 연계 후속 |
| S01 | Susceptibility·T2*·SWI: 신호·위상·blooming은 무엇을 반영하나? | C03, B05 | 두 페이지 구현: [주어진분포/GRE](susceptibility_signal_phase.html)·[mask/minIP](swi_mask_projection.html) / [GRE 검증](verification/2026-10-16/S01-physics.md)·[처리 검증](verification/2026-10-16/S01-swi-physics.md). 두 한계모형 통과, χ→dipolefield/실제filtering·임상은 제외 |
| S02 | QSM: phase에서 susceptibility를 어떻게 추정하나? | S01 | 부분 구현: [주기 dipole/영점 역문제](qsm_dipole_inverse.html) / [두 모드 범위 통과](verification/2026-10-17/S02-physics.md). 실제phase/field추정·배경제거/noise·COSMOS/임상은 남음 |

### Artifact — 관찰 → 원인 → 조절의 공통 형식

| ID | 챕터 | 선행 / 상태 | 구현할 사항 |
|---|---|---|---|
| A01 | Aliasing·wrap-around | G01 / [페이지 구현](aliasing_fov.html) | [두 점/Fourier 범위 통과](verification/2026-10-17/A01-physics.md). FOV·짝수 표본·zero filling 구별. 실제 연속 조직·수신 필터/장비 oversampling·임상 예시는 남음 |
| A02 | 움직임·ghosting·gating | B05, Q03 / [부분 구현](motion_ghosting.html) | [1D 모형 통과](verification/2026-10-17/A02-physics.md). 시간별 q·주기/한 번 이동·순서·이상적 gating/대기. 실제2D·호흡/ECG/navigator·DWI motion/eddy 보정은 남음 |
| A03 | Gibbs ringing·zero filling | B05, G01 / [페이지 구현](gibbs_ringing.html) | [명시 모형 통과](verification/2026-10-17/A03-physics.md). 유한 계수·경계·표본 최대값·M/필터·PSF 폭. 실제 장비/임상 제거는 제외 |
| A04 | Chemical shift displacement | Q02, F01 / [페이지 구현](chemical_shift_artifacts.html) | [두 분리 모형 통과](verification/2026-10-17/A04-physics.md). BW/극성 위치와 TE/f 상쇄. 실제 결합 경계 영상/다중 peak·임상은 제외 |
| A05 | Susceptibility·금속·EPI artifact | C03, C07, S01 / [부분 구현](field_epi_distortion.html) | [1D 공간 field/위치 통과](verification/2026-10-17/A05-physics.md). 실제2D·voxel 분포/소실 결합·metal·보정은 남음. C03/S01·D03 연결 |
| A06 | B0/B1 불균일·RF 간섭·코일 문제 | Q01, F03 / [부분 구현](b0_b1_receive_shading.html) | [TX/RX/B0 3기전 통과](verification/2026-10-17/A06-physics.md). 같은 밝기 반례/추가flip. 실제 간섭/zipper·coil noise/QA·보정/안전 판단은 남음 |

## 정량·분광·AI 심화

| ID | 짧게 나눌 챕터 | 선행 | 상태 / 핵심 구현 |
|---|---|---|---|
| M01 | T2W와 T2 mapping / 여러 echo와 fitting | C01, C02 | 부분 구현2페이지: [기본/밝기](t2_mapping_basics.html)·[잡음/두성분](t2_mapping_limits.html). [기본](verification/2026-10-17/M01-physics.md)·[한계](verification/2026-10-17/M01-limits-physics.md) 모형 통과. 실제2D/FSE·임상정량·추정방법 확장은 남음 |
| M02 | T1 mapping과 ECV의 기초 | C04, M01 | 두 부분 모형: [IR signed/유한TR 추정](t1_mapping_ir.html)·[R1/ECV 분배](ecv_r1_partition.html) / [IR](verification/2026-10-17/M02-physics.md)·[평형 분배 검증](verification/2026-10-17/M02-ecv-physics.md). 실제sequence/B1/noise/교환·비평형/임상정량은 남음 |
| M03 | T2* mapping·R2*와 철 관련 신호 | C03, M01 | 부분 구현: [단위/echo범위/Gaussian](t2star_mapping.html) / [해당모형 통과](verification/2026-10-17/M03-physics.md). 실제2D/noise/철정량보정/임상은 남음 |
| M04 | PDFF: 지방 비율을 정량화하려면? | F02, M01 | 세 부분 모형: [T1 bias](pdff_t1_bias.html)·[echo/spectrum](pdff_echo_assumptions.html)·[알려진열/complex fit](complex_echo_water_fat_fit.html) / [T1](verification/2026-10-17/M04-physics.md)·[echo](verification/2026-10-17/M04-echo-physics.md)·[계수추정 검증](verification/2026-10-17/M04-fit-physics.md). unknownfield/감쇠/위상·noise·임상PDFF는 남음 |
| N01 | NMR/MRS: 화학 환경은 spectrum에 어떻게 나타나나? | B02, F01, B05 | 페이지 구현: [복소 FID/spectrum](fid_spectrum.html) / [지정 모형 통과](verification/2026-10-17/N01-physics.md). 실제 대사물/농도·임상/localization은 제외 |
| N02 | MRS peak를 읽기: 위치·면적·폭·TE | N01 | 부분 구현: [가상 단일 peak](spectral_peak_features.html) / [기본 모형 통과](verification/2026-10-17/N02-physics.md). 실제 대사물·J결합/overlap·농도/진단은 남음 |
| N03 | MRS localization과 품질 | N02, G02 | 부분 구현: [관측 공간/혼합](mrs_observation_volume.html)·[field 분포/선폭](mrs_field_linewidth.html) / [공간 적분](verification/2026-10-17/N03-physics.md)·[균일 분포 모형 통과](verification/2026-10-17/N03-field-physics.md). 실제pulse/MRSI/SRF·억제·shim 최적화/임상품질은 남음 |
| E01 | MRE: 파동을 MR로 측정하면 무엇을 알 수 있나? | B04 | 두 부분 모형 구현: [균일 파동](mre_shear_wave.html)·[MR위상encoding](mre_motion_encoding.html) / [파동](verification/2026-10-17/E01-physics.md)·[encoding 검증](verification/2026-10-17/E01-encoding-physics.md). 실제조직/sequence·inversion/임상은 남음 |
| E02 | MRE 품질과 해석의 한계 | E01 | 부분 구현: [복소 국소 역산/표본/공간 오차](mre_inversion_limits.html) / [해당 범위 통과](verification/2026-10-17/E02-physics.md). 실제noise/confidence·2D3D/vendor/임상은 남음 |
| AI01 | AI 재구성: denoising·가속·선명도 개선 | Q01, Q04, Q06 | 기본 부분 구현: [역할/자료일치 대리처리](reconstruction_roles.html) / [지정 범위 통과](verification/2026-10-17/AI01-physics.md). 실제 학습 모델/딥러닝·vendor/임상은 미구현 |
| AI02 | 벤더별 AI 접근 비교 | AI01 | [공개 자료 읽기 페이지](vendor_ai_reading.html) / [주장·출처 검토 통과](verification/2026-10-17/AI02-physics.md). 2026-10-17 확인한 8명칭/6자료에 한정. 설치 버전·독립 임상 우열은 미확인 |
| AI03 | AI 화질을 평가하기: 작은 구조·texture·정량값 | AI01, M01 | 세 부분 모형 구현: [구조/질감](structure_texture_evaluation.html)·[공간 처리/T2](processed_t2_mapping.html)·[반복 잡음](reconstruction_noise_ensemble.html) / [구조](verification/2026-10-17/AI03-physics.md)·[T2](verification/2026-10-17/AI03-t2-physics.md)·[반복 통계 검증](verification/2026-10-17/AI03-noise-physics.md). 실제 학습·다중coil/크기영상·임상 SNR/검출은 남음 |

## 확장 기본 챕터

| ID | 중심 질문과 구현 | 상태와 남은 범위 |
|---|---|---|
| X01 | [등속 운동과 gradient 위상](flow_gradient_phase.html), [두 속도의 복소합](flow_velocity_mixture.html) | [단일 spin](verification/2026-10-17/X01-physics.md)·[두 이산 속도 합](verification/2026-10-18/X01-mixture-physics.md) 모형 통과. 연속 분포·flow compensation·실제유량은 남음 |
| X02 | [Slab 유입과 반복 RF 포화](inflow_rf_saturation.html) | [이상적 TE0/균일 slab 모형 통과](verification/2026-10-17/X02-physics.md). 실제 TOF 2D/3D·위상/혈관분포/임상은 남음 |
| X03 | [두 획득의 위상차와 VENC](phase_contrast_venc.html) | [단일 속도/두 encoding 모형 통과](verification/2026-10-18/X03-physics.md). 실제 분포/유량·noise/배경 위상·4D flow는 남음 |
| X04 | [관측창과 프레임 간격](temporal_window_bolus.html) | [직접 정의한 시간 평균/표본 모형 통과](verification/2026-10-18/X04-physics.md). 실제 CE-MRA/k-space·농도/RF·임상 bolus는 남음 |
| X13 | [Methemoglobin 상태](hemorrhage_state_reading.html), [혈액 성분과 refocusing](blood_refocusing_limits.html) | [MetHb 세 상태](verification/2026-10-17/X13-physics.md)·[oxy/deoxy/철 저장의 조건부 근거 읽기](verification/2026-10-18/X13-refocusing-physics.md) 통과. 정량/실제 GRE/SWI·환자 날짜/진단은 남음 |
| X14 | [방향과 magic angle](magic_angle_orientation.html) | [직접 정의한 R2/유한 감쇠 모형 통과](verification/2026-10-18/X14-physics.md). 실제 조직/정렬 분포·다성분·보편 TE 기준/진단은 남음 |
| X15 | [상수/선형 보정](linear_field_correction.html), [곡률과 보정 기저](polynomial_field_basis.html) | [직선](verification/2026-10-18/X15-physics.md)·[알려진2차/401점 모형](verification/2026-10-18/X15-basis-physics.md) 통과. 실제 측정/3Dcoil·제약/고차항·장비/RF/안전은 남음 |
| X05 | [농도와 GRE 신호](contrast_concentration_competition.html), [Signed subtraction과 정합](signed_subtraction_alignment.html) | [농도 기본](verification/2026-10-17/X05-physics.md)·[정수pixel 뺄셈 모형](verification/2026-10-18/X05-subtraction-physics.md) 통과. 실제 약제/동태·신호 스케일/보간·환자 정합/진단은 남음 |
| X06 | [신호비와 ΔR2* 변환](dsc_signal_rate.html) | [단일 지수/기준 입력 모형 통과](verification/2026-10-18/X06-physics.md). 농도/AIF/CBF/CBV/MTT·T1/누출/noise·환자 해석은 남음 |
| X07 | [단일 구획 입력과 washout](compartment_input_washout.html) | [직사각 입력/단일 EES 모형 통과](verification/2026-10-18/X07-physics.md). 실제AIF/혈관항·신호변환/환자fitting/임상은 남음 |
| X08 | [순간 표지의 도달과 T1 감쇠](label_arrival_decay.html) | [동일T1/보관packet 모형 통과](verification/2026-10-18/X08-physics.md). 실제표지기간/PCASL PLD·교환/ASL읽기/CBF/임상은 남음 |
| X12 | [방향 확산과MD/FA](diffusion_tensor_direction.html), [두성분/제한fit](diffusion_tensor_mixture.html) | [알려진단일tensor](verification/2026-10-18/X12-physics.md)·[두Gaussian/xy맞춤](verification/2026-10-18/X12-mixture-physics.md) 모형 통과. 실제3D추정/성분복원/조직분율/tractography·환자분류는 남음 |

## 나중에 추가할 후보 — 잊지 않고 보존

아래는 기본 구현 뒤에도 남아 있는 확장 범위와 아직 착수하지 않은 주제이다. 현재 구현/검증 상태는 위 챕터 표와 실행 대기열을 따른다. 각 묶음은 착수할 때 작은 챕터로 나눈다.

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

**다음 실행 항목: W79.** 공개 Pages의 저장소 코드 링크404 복구 W59를 W56보다 먼저 마쳤다. 별도 주제 지정 없이 “개발 진행해”라는 요청을 받으면 아래에서 진행 중인 항목을 재개하거나, 선행 조건을 충족한 가장 앞의 미완료 항목을 실행한다. 완료 후 이 문장·행의 상태·결과 링크를 함께 갱신한다. 작업 상태와 챕터의 구현/물리 검증 상태는 별개다.

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
| W09 | G01 FOV·matrix·해상도 챕터 | W05, W08 | 완료 — [독립 계산·200개 실제 상태·통합 판정](verification/2026-10-15/G01-physics.md) |
| W10 | G02 slice selection·부분 용적 챕터 | W02, W05 | 완료 — [독립 SI·공간 적분·512개 실제 상태·판정](verification/2026-10-15/G02-physics.md) |
| W11 | Q01 SNR·CNR·NEX 챕터 | W01, W09 | 완료 — [독립 통계·564개 실제 상태·물리 판정](verification/2026-10-15/Q01-physics.md) |
| W12 | B00 고전적 비유의 검증과 한계 | W00 | 완료 — [독립 적분·126개 실제 상태·판정](verification/2026-10-15/B00-physics.md) |
| W13 | C04 IR·TI·null 챕터 | W01 | 완료 — [독립 시간 순서·448개 실제 상태·판정](verification/2026-10-15/C04-physics.md) |
| W14 | C05 FSE/TSE·echo train 챕터 | W06, W08 | 완료 — [독립 FFT·이벤트·118개 실제 상태·판정](verification/2026-10-15/C05-physics.md) |
| W15 | G03 2D/3D·partition 챕터 | W09, W10 | 완료 — [독립 공간적분·116개 실제 상태·판정](verification/2026-10-15/G03-physics.md) |
| W16 | Q02 Receiver bandwidth 챕터 | W05, W11 | 완료 — [독립SI/kernel/PSD·216실제상태·판정](verification/2026-10-15/Q02-physics.md) |
| W17 | Q03 검사 시간·이벤트 수 챕터 | W14, W15, W11 | 완료 — [독립 이벤트·시간·1,004실제상태·판정](verification/2026-10-15/Q03-physics.md) |
| W18 | C06 Spoiled GRE·flip angle 챕터 | W01, W02 | 완료 — [독립 회전/RK4·314실제상태·판정](verification/2026-10-15/C06-physics.md) |
| W19 | C07 EPI·trajectory 챕터 | W05, W08 | 완료 — [독립 SI적분/kernel·360실제상태·판정](verification/2026-10-15/C07-physics.md) |
| W20 | Q04 Parallel imaging·coil sensitivity 챕터 | W08, W11 | 완료 — [독립 QR/DFT/통계·580실제상태·판정](verification/2026-10-15/Q04-physics.md) |
| W21 | F01 Chemical shift·IP/OP 독립 챕터 | W02, W03 | 완료 — [독립RK4/단위·452실제상태·판정](verification/2026-10-15/F01-physics.md) |
| W22 | F02 Dixon 물/지방 분리 챕터 | W21 | 완료 — [독립RK4/일반QR·298실제상태·판정](verification/2026-10-15/F02-physics.md) |
| W23 | F03 Spectral fat suppression 챕터 | W02, W21 | 완료(선택SAT) — [독립Bloch/행렬지수·474실제상태·판정](verification/2026-10-15/F03-physics.md). Water excitation은W27 |
| W24 | F04 지방억제 원리·실패 비교 | W13, W22, W23 | 완료 — [독립세모형사례·22실제상태·판정](verification/2026-10-15/F04-physics.md) |
| W25 | D01 Diffusion·b-value 챕터 | W05, W06 | 완료 — [독립적분/공분산/통계·250실제상태·판정](verification/2026-10-15/D01-physics.md) |
| W26 | D02 ADC fitting·shine-through 챕터 | W25, W01, W11 | 완료 — [독립ODE/QR/잡음통계·888실제상태·판정](verification/2026-10-15/D02-physics.md) |
| W27 | F03 후속 Water excitation | W02, W21, W23 | 완료 — [독립 Bloch·480 실제 상태·판정](verification/2026-10-15/F03-water-physics.md) |
| W28 | D03 DWI/EPI 왜곡과획득조건 | W19, W26 | 완료(균일field/시간 예측) — [504독립조건·260실제상태·판정](verification/2026-10-16/D03-physics.md) |
| W29 | S01 주파수분포·GRE·blooming | W07, W08 | 완료 — [독립적분/196,608voxel·112실제상태·판정](verification/2026-10-16/S01-physics.md) |
| W29b | S01 후속 phase mask·minIP | W29 | 완료 — [독립곱/최소·112실제상태/917,504pixel·판정](verification/2026-10-16/S01-swi-physics.md) |
| W30 | C08 bSSFP·coherence·banding | W18 | 완료 — [독립lab두TR/ODE·240실제상태·판정](verification/2026-10-16/C08-physics.md) |
| W30b | C08 후속 T2/T1 대비·근사 범위 | W30 | 완료 — [독립588조건/극한·54실제상태·판정](verification/2026-10-16/C08-contrast-physics.md) |
| W31 | Q05 Partial Fourier·위상·대칭 | W08 | 완료 — [독립FFT/normal반복·64실제상태·판정](verification/2026-10-16/Q05-physics.md) |
| W32 | Q06 Compressed sensing·희소성 | W08, W31 | 완료(지정유한반복) — [독립normal/ADMM·78실제상태·판정](verification/2026-10-16/Q06-physics.md). 두조합solver기준미달표시 |
| W33 | Q07 SMS·slice 분리·CAIPI | W10, W20 | 완료 — [독립 368조건·96실제상태·범위 판정](verification/2026-10-17/Q07-physics.md) |
| W34 | A01 FOV·aliasing·folding | W08, W09 | 완료 — [독립648조건·160실제상태·판정](verification/2026-10-17/A01-physics.md) |
| W35 | A02 움직임·ghosting·gating | W08, W17 | 완료(1D 모형) — [독립30조건·60실제상태·판정](verification/2026-10-17/A02-physics.md) |
| W36 | A03 유한 k-space·ringing·필터 | W08, W09 | 완료 — [독립 적분/FFT·24실제상태·판정](verification/2026-10-17/A03-physics.md) |
| W37 | A04 Chemical shift·공간 이동과 voxel 상쇄 | W16, W21 | 완료 — [독립300조건·600실제상태·판정](verification/2026-10-17/A04-physics.md) |
| W38 | A05 공간 field·susceptibility/EPI 위치 왜곡 | W07, W19, W28, W29 | 완료(1D 위치 모형) — [독립54조건·108실제상태·판정](verification/2026-10-17/A05-physics.md) |
| W39 | A06 B0/B1·coil shading 원인 구분 | W11, W23, W33 | 완료(3기전 부분 모형) — [독립ODE·60실제상태·판정](verification/2026-10-17/A06-physics.md) |
| W40 | M01 기본·밝기와 다중 echo T2 추정 | W01, W06 | 완료(기본 모형) — [독립72조건·144실제상태·판정](verification/2026-10-17/M01-physics.md) |
| W40b | M01 후속·잡음 바닥과 다중 성분 fitting 한계 | W11, W26, W40 | 완료(명시 모형) — [독립48조건·96실제상태·판정](verification/2026-10-17/M01-limits-physics.md) |
| W41 | M02 T1 mapping·추정과 입력 가정 | W13, W40 | 완료(기본IR모형) — [독립48조건·96실제상태·판정](verification/2026-10-17/M02-physics.md) |
| W42 | M03 T2* mapping·R2*와 모형 한계 | W07, W40 | 완료(명시envelope) — [독립18조건·36실제상태·판정](verification/2026-10-17/M03-physics.md) |
| W43 | M04 기본·신호 비율과 T1 bias | W18, W22, W40, W42 | 완료 · [부분 모형 검증](verification/2026-10-17/M04-physics.md) |
| W43b | M04 후속·echo 감쇠/지방 spectrum 가정 | W43 | 완료 · [부분 모형 검증](verification/2026-10-17/M04-echo-physics.md) |
| W44 | N01 FID·chemical shift·spectrum | W02, W08, W21 | 완료 · [지정 모형 검증](verification/2026-10-17/N01-physics.md) |
| W45 | N02 spectrum의 위치·면적·폭·TE | W44 | 완료 · [기본 부분 검증](verification/2026-10-17/N02-physics.md) |
| W46 | N03 MRS localization·관측 범위와 오염 | W45, W10 | 완료 · [공간 적분 부분 검증](verification/2026-10-17/N03-physics.md) |
| W47 | E01 기본·균일 탄성 매질의 shear wave | W05, W46 | 완료 · [파동 부분 검증](verification/2026-10-17/E01-physics.md) |
| W47b | E01 후속·변위와 motion encoding 위상 | W47 | 완료 · [encoding 부분 검증](verification/2026-10-17/E01-encoding-physics.md) |
| W48 | E02 MRE inversion·wave quality의 한계 | W47b | 완료 · [기본 부분 검증](verification/2026-10-17/E02-physics.md) |
| W49 | S02 QSM·주어진 field와 dipole 역문제 | W29, W48 | 완료 · [주기 부분 검증](verification/2026-10-17/S02-physics.md) |
| W50 | AI01 재구성 역할·data consistency의 기본 비교 | W11, W20, W32, W49 | 완료 · [대리처리 기본 검증](verification/2026-10-17/AI01-physics.md) |
| W51 | AI03 기본·작은 구조와 texture 평가 | W50, W40 | 완료 · [검증](verification/2026-10-17/AI03-physics.md) |
| W51b | AI03 후속·공간 처리와 정량값 | W51, W40b | 완료 · [검증](verification/2026-10-17/AI03-t2-physics.md) |
| W52 | AI02 공개 벤더 자료의 역할/근거 범위 비교 | W51b | 완료 · [검토](verification/2026-10-17/AI02-physics.md) |
| W53 | AI03 후속·반복 잡음과 비선형 평가 | W51b, W11 | 완료 · [검증](verification/2026-10-17/AI03-noise-physics.md) |
| W54 | N03 후속·주파수 분포와 linewidth | W46, W45 | 완료 · [검증](verification/2026-10-17/N03-field-physics.md) |
| W55 | M02 후속·R1 변화와 ECV 분배의 개념 | W41, W43 | 완료 · [검증](verification/2026-10-17/M02-ecv-physics.md) |
| W56 | G02 후속·유한 RF와 slice profile | W10, W23 | 완료 · [검증](verification/2026-10-17/G02-rf-physics.md) |
| W57 | M04 후속·알려진 field의 복소 echo 성분 분리 | W43b, W22 | 완료 · [검증](verification/2026-10-17/M04-fit-physics.md) |
| W58 | X05 기본·조영 농도와 T1/T2* 신호 경쟁 | W55, W42, W18 | 완료 — [54조건·108실제상태·통합 판정](verification/2026-10-17/X05-physics.md) |
| W59 | Pages 보고서의 저장소 원본 코드 링크 복구 | W54 게시 | 완료 · [로컬 검증/게시 대기](verification/2026-10-17/W59-pages-source-links.md) |
| W60 | X01 기본·정지와 등속 운동의 gradient 위상 | W05, W25 | 완료 — [18조건·180실제상태·통합 판정](verification/2026-10-17/X01-physics.md) |
| W61 | X02 기본·Slab 유입과 반복RF 포화 | W60, W18 | 완료 — [36조건·216실제상태·통합 판정](verification/2026-10-17/X02-physics.md) |
| W62 | X13 기본·Methemoglobin 상태 표와 시간 해석의 한계 | W01, W29 | 완료 — [원전6주장·18실제상태·내용 판정](verification/2026-10-17/X13-physics.md) |
| W63 | X14 기본·방향과 magic angle의 제한 모형 | W01, W60 | 완료 — [독립18조건·36실제상태·통합 판정](verification/2026-10-18/X14-physics.md) |
| W67 | 게시 소스의 줄바꿈 정규화와 검토 지문 대조 | W62, W63 | 완료 — [78항목·원본 없는 재현·공개5자산·전체검증](verification/2026-10-18/publication-0105-fingerprints.md) |
| W64 | X01 후속·서로 다른 속도의 복소합과 신호 크기 | W60, W61 | 완료 — [60조건·120실제상태·통합 판정](verification/2026-10-18/X01-mixture-physics.md) |
| W69 | 고정 표 제목 아래로 선택 행 보이기 복구 | W58, W60, W61, W64 | 완료 — [36경로·계산/원표 불변·실제 두 화면](verification/2026-10-18/W69-selected-row.md) |
| W65 | X13 후속·Oxy/deoxy와 철 저장 상태의 시퀀스 구별 | W62, W29 | 완료 — [원전8주장·16실제상태·통합 판정](verification/2026-10-18/X13-refocusing-physics.md) |
| W66 | X03 기본·두 gradient 획득의 위상차와 속도 모호성 | W60, W64 | 완료 — [독립63조건·126실제상태·통합 판정](verification/2026-10-18/X03-physics.md) |
| W68 | X15 기본·균일 offset과 선형 field의 보정 | W39, W54 | 완료 — [독립27조건·54실제상태·통합 판정](verification/2026-10-18/X15-physics.md). A06 선행 ID는 W39로 정정 |
| W70 | X04 기본·시간창과 bolus 관측 시점 | W58, W15, W17 | 완료 — [6조합/66프레임·132실제상태·통합 판정](verification/2026-10-18/X04-physics.md) |
| W71 | X05 후속·Signed subtraction과 공간 정합 | W35, W58 | 완료 — [독립18조건·36실제상태/canvas·통합 판정](verification/2026-10-18/X05-subtraction-physics.md) |
| W72 | X06 기본·신호비와 ΔR2* 변환의 조건 | W19, W42, W58, W70 | 완료 — [독립9조합/54조건·108실제상태·통합 판정](verification/2026-10-18/X06-physics.md) |
| W76 | X15 제외한 이완 효과와 시간값 표기 명확화 | W68, W72 | 완료 — [바이트 불변·실제 두 화면 확인](verification/2026-10-18/W76-relaxation-wording.md) |
| W73 | X15 후속·고차 field와 보정 basis의 한계 | W68, W76 | 완료 — [독립36조건·72실제상태·통합 판정](verification/2026-10-18/X15-basis-physics.md) |
| W74 | X07 기본·단일 구획의 조영 입력과 washout | W55, W70 | 완료 — [독립48조건·96실제상태·통합 판정](verification/2026-10-18/X07-physics.md) |
| W75 | X08 기본·Label 도달과 T1 감쇠의 구별 | W13, W60, W61 | 완료 — [독립36조건·72실제상태·통합 판정](verification/2026-10-18/X08-physics.md) |
| W77 | X12 기본·방향별 확산과 평균/FA의 구별 | W25, W26 | 완료 — [독립27조건·54실제상태·통합 판정](verification/2026-10-18/X12-physics.md) |
| W78 | X12 후속·교차 성분과 단일tensor의 한계 | W77, W26 | 완료 — [독립45조건·90실제상태·통합 판정](verification/2026-10-18/X12-mixture-physics.md) |
| W79 | X09 기본·입력 자극과 지연 반응의 구별 | W70, W72 | 진행 중 |
| W80 | X17 기본·알려진phantom 격자와 영상 거리 | W09 | 미착수 |
| W81 | 학습 본문의 띄어쓰기와 단위 읽기 보강 | W73, W74, W75, W77 | 미착수 |
| W82 | X10 기본·주기 운동과 관찰 시간창 | W70 | 미착수 |

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

**W13 — C04 “특정 조직의 종자화를 언제 0으로 만들까?”**

- 선행 W01. 중심 질문은 inversion 뒤 TI가 부호와 magnitude를 어떻게 바꾸는가이다. 목표는 inversion 회복·TI null·magnitude 부호 소실을 구별하는 세 가지다. 관찰은 긴 TR의 TI, TR 단축, 예시 T1 변경이다.
- 기본 TI 200 ms(0~3000, 0.1), TR 6000 ms(3500~10000, 500), 예시 T1 300/1000/4000 ms. 이상적 inversion→90° readout 후 횡자화 spoiling의 반복 모형을 쓰고 TE=0의 이상적 즉시 읽기로 T1 원리에 집중하고 T2 감쇠를 제외한다. STIR/FLAIR 값은 교육 예시이며 실제 권장 TI가 아니다.
- 독립 시간 순서 이완·inversion 반복과 정상상태 식의 차이 ≤1e−9, null 전후 부호·긴 TR의 T1 ln2 극한, 실제 두 화면·정답을 대조한다. 실제 IR-FSE ordering·PSIR 재구성·임상 프로토콜은 제외한다. 인수 기준은 부호/크기/회복 곡선·예시 null·가정이 같은 모형과 일치하고 통합 검증 기록이 있는 것이다.

**W14 — C05 “여러 echo를 서로 다른 k-space 줄에 쓰면?”**

- 선행 W06·W08. 목표는 echo train과 effective TE, ordering에 따른 대비·blur를 구별한다. 관찰은 echo spacing, ETL, 중심 k-space echo 배치의 세 가지다.
- N64·FOV240mm, ESP10ms(5~20,5), ETL8(1/4/8/16), k순서/중심먼저/외곽먼저, PD1·T2 A50/B150ms의 교육 모형을 구현한다. 64/ETL개의 TR과 echo별 k 배정, 복소 inverse와 고정 창을 독립 radix2 FFT·이벤트 열거로 대조한다. 단순 T2 가중 k-space 모형이며 stimulated echo·실제 refocusing train·scan time 전체 조절은 제외한다. 인수 기준은 같은 echo 시간 가중치로 pulse/echo 도식·k 줄·재구성 영상·문제가 일치하고 독립 FFT·실제 두 화면 검증이 있는 것이다.

**W15 — G03 “2D slice와 3D partition은 어떻게 다른가?”**

- 선행 W09·W10. 같은 3D 교육 phantom에서 slice 두께/partition·in-plane 격자를 비교하며 MPR·등방 voxel·두 획득 방식의 개념을 세 관찰로 나눈다. 착수 때 격자·두께·volume 범위·독립 공간 적분을 확정한다. 인수 기준은 같은 phantom의 평균·격자·MPR이 독립 공간 적분과 맞고 SNR/시간 비교의 고정 조건이 명시된 것이다. 실제 3D RF 정상상태·움직임·scanner scan time 전체는 제외한다.

**W16 — Q02 “Receiver bandwidth를 바꾸면 무엇이 함께 바뀌나?”**

- 선행 W05·W11. Hz/pixel과 전체 BW·readout 시간의 단위를 먼저 확정한다. 고정 matrix에서 BW만, 같은 off-resonance의 위치 이동, 독립 잡음 모형의 기대 SNR을 세 관찰로 구성한다. 착수 때 BW 범위·방향·표시 창을 확정하고 단위 계산과 알려진 주파수 phantom으로 검증한다. 실제 chemical shift 위상 상쇄는 F01과 구별하며 실제 장비 검사 시간·금속 안전은 제외한다.

**W17 — Q03 “검사 시간은 어떤 이벤트를 세면 되나?”**

- 선행 W14·W15·W11. 2D/3D, Ny128(32/64/96/128), sections16(4/8/16/32), ETL8(1/4/8/12/16), TR4000ms(200~4000,200), NEX1(1/2/4), gating100%(100/50%)를 비교한다. Active20+ETL×10ms, 준비10s/dummy4TR은1회, 2D는묶음별전체Ny/3D는ky빠른phase쌍의연속배정, 마지막train도전체active예약을명시한다. 독립 이벤트 열거와 시간 합, 실제 두 화면·문제로 검증한다. slice 수를 항상 곱하는 설명을 피하며 실제 장비 견적·임상 촬영 보장은 제외한다.

**W18 — C06 “Spoiled GRE의 flip angle은 왜 중요할까?”**

- 선행 W01·W02. 일정TR에서 반복pulse의 정상상태·flip angle sweep·긴/짧은TR을 세 관찰로 비교한다. 기본TR20ms(5/10/20/50/100/500/2000/5000), flip20°(0~90,0.1), T1 A600ms(300/600/1000), B1200ms, 공통PD1/T2*40ms/TE2ms를 쓴다. 50회 pulse와정상상태·1%잔차도달횟수·고정0~1신호창을 표시하며 완전 spoiling을 가정한다. 독립 시간 순서 반복/Bloch 계산과 Ernst angle 극한을 대조한다. 인수 기준은 수치·정상상태 곡선·부호/정규화·예측 문제가 같은 모형이며 실제 두 화면을 검증한 것이다. bSSFP의 잔여 coherence·실제 RF spoiling 효율은 제외한다.

**W19 — C07 “EPI는 k-space를 어떻게 빠르게 훑을까?”**

- 선행 W05·W08. readout zigzag·echo spacing·위상방향 off-resonance 왜곡의3관찰을 정한다. N16×16/FOV160mm, dwell10µs, TE30ms, ESP0.8ms(0.4/0.8/1.6/3.2), offset50Hz(−100~100,10), PE극성±1을 쓴다. 실제256ADC시간/좌표와 piecewise gradient를 연결한다. 재구성은 각echo중앙kx0의16표본을 쓰는1D PE점응답으로 한정하고 within-readout off-res와T2*감쇠를 제외한다. 독립gradient 적분·유한kernel/위치이동을 비교한다. 인수 기준은 trajectory·획득시점·재구성/왜곡·문제의 부호/단위가 일치하며 실제 두 화면 검증이 있는 것이다. 실제eddy current·Nyquist correction·vendor EPI는 제외한다.

**W20 — Q04 “코일 감도로 어떻게 덜 찍은 위치를 구별할까?”**

- 선행 W08·W11. 알려진 coil sensitivity의 이상적phantom에서 R1/full·R2/alias·분리/잡음증폭을 비교한다. 신호(1,0.5)의FOV/2간격 두voxel·두coil 실수선형모형을 쓴다. C=[[cosθ,sinθ],[sinθ,cosθ]], θ20°(0~45,1), R1/R2, σ0.05(0~0.1,0.01), 각열norm1·독립등분산잡음을 고정한다. R2합정규화의raw잡음σ√2·g/조건수·45°분리불가와고정seed1회예시를 표시한다. 독립QR/DFT와3seed×131072개의Monte Carlo를5SE/SD상대기준으로 검증한다. 실제 vendor SENSE/GRAPPA·임상SNR·AI는 제외하며 실제 두 화면/실패조건·정답을 기록한다.

**W21 — F01 “물과 지방은 언제 상쇄될까?”**

- 선행 W02·W03. 단일 peak 지방 근사의 ppm/Hz·B0·TE·물/지방 비율을 위상 벡터·복소 합·magnitude 세 관찰로 나눈다. B0=3T(1.5/3), TE1.1ms(0~12,0.001), TE0지방성분비율0.5(0~1,0.05), fat−3.5ppm/water0·공통T2*40ms·TE0전체신호1을 쓴다. 물회전계의Mx+iMy·복소합과크기/개별성분합·고정창·IP/OP 근처0.001ms반올림을 명시한다. 독립 복소 벡터 합과 IP/OP 주기·0/동일비율의 극한을 검증하고 실제 두 화면·문제와 대조한다. 실제 multipeak 지방·Dixon 분리·장비별 권장 TE는 제외한다.

**W22 — F02 “서로 다른 TE의 위상으로 물과 지방을 나눌까?”**

- 선행 W21. 알려진 single-peak 지방 주파수·균일한 field의 복소 echo 모형에서 두/세 echo의 정보·물/지방 분리·field 오류를 세 관찰로 구성한다. B0=3T·fat−3.5ppm, T=첫OP1.118409ms의TE(T,2T)에서복소분리하고3T는검증전용세번째echo로추가한다. 이완/잡음/초기공통위상0의이상모형, f0.3(0~1,0.05), 실제field100Hz(−500~500,25), 제공된field/0가정/IP주위상branch의3규칙을비교한다. 두echo복소해·세번째잔차와(W,F,b)↔(F,W,b±|Δf|)동일데이터를독립선형대수/시간적분으로 검증한다. 근접0branch를정답field로보장하지않는다. 복소 분리의 성공/실패와 IP/OP magnitude만의 모호성을 두 화면·문제에 일치시킨다. 실제 multipeak Dixon·공간 field map·임상PDFF는 제외한다.

**W23 — F03 “주파수를 골라 지방 신호를 줄일까?”**

- 선행 W02·W21. 지방 주파수의 선택 pulse·spoiling·영상 여기의 순서를 알려진 물/단일peak 지방 모형으로 비교한다. 명목90°사각RF의기간8ms(2/4/8/12/16), 추가offset0Hz(−500~500,25), B1배율1(0~2,0.05)을 세관찰로둔다. carrier는3T지방−3.5ppm으로고정하며 기간변경때명목90°를유지하도록B1을조정한다. 이완/지연없음·이상적netXYspoiling·순간90°영상여기/TE0·분리된순수물/지방voxel M0각1을쓴다. 전체응답/측면엽·signedMz/읽기크기·1/기간은폭척도이며정확한BW가아님을명시한다. 독립 Bloch 적분·원하는/원치 않는 saturation·off-res 실패를 두 화면과 문제에 대조한다. 실제 fat-sat 권장값·multipeak·임상 안전은 제외한다.

**W24 — F04 “지방억제 방법마다 실패 이유가 왜 다를까?”**

- 선행 W13·W22·W23. C04/F02/F03의 검증된 모형과 출처를 연결해 주파수 선택·T1 선택·복소 분리의 차이를 비교한다. 고정세사례는동일T1(물300/지방300ms)의IR동시null, 공통field−450Hz의선택SAT물손실/Dixon주위상swap, 선택RF B1배율2의즉시지방신호복귀다. IR TR6000ms/지방null TI·선택SAT8ms·Dixon f0.3을기준으로각모형을재사용한다. 해당오류입력이없는방법은숫자비교에서제외하고정규화가다른절대밝기/SNR/실제성능순위를만들지않는다. 모형을 중복 구현하지 않고 조건/예측/한계가 원 챕터와 일치하는지 독립 대조한다. 임상 방법 선택이나SPIR/SPAIR 장비별 성능은 근거 범위만 설명하며 실제 프로토콜 처방은 제외한다.

**W25 — D01 “확산 gradient는 움직이는 물 신호를 어떻게 줄일까?”**

- 선행 W05·W06. 두gradient lobe·재위상화의 정지/이동 차이, b-value, 알려진D의 신호감소를 세 관찰로 구성한다. δ10ms고정·G30mT/m(0~60,5), D0.001mm²/s(0~0.003,0.0005), Δ40ms(25~80,5)를쓴다. Δ는lobe시작간격·TE=Δ+δ·180시점TE/2, 물리두lobe동극성/효과gradient반전·q단위rad/mm·b단위s/mm²를명시한다. S(b)/동일TE의S(b0)로정규화하고T2/임상신호는제외한다. 고정seed8192자유Brownian·0.5ms격자에서선형q적분의bridge분산까지포함하고3seed평균/분산/복소신호/phase-position공분산5SE를사전기준으로둔다. 독립q(t)적분의b와확산ensemble/극한을 대조하고 실제 두 화면·문제를 검증한다. 실제restriction/IVIM/tensor·임상b값 권장·장비안전은 제외한다.

**W26 — D02 “DWI가 밝을 때 ADC로 무엇을 구별할까?”**

- 선행 W25. 알려진D·T2·S0 모형에서 b별신호·ADC fitting·T2 shine-through와저신호의영향을 세관찰로 구성한다. b=[0,500,1000,1500]s/mm²·TE80ms·PD1, D0.001mm²/s(0~0.003,0.00025), T280ms(40/80/160), 성분잡음σ0(0~0.1,0.01)로고정한다. 복소독립Gaussian→magnitude4표본을자유절편의비가중log OLS로맞추며0이하/비유한로그실패·음수ADC를숨기지않는다. 고정seed0x0adc2026·원신호/동일D T280기준/fit을고정축·창으로비교한다. 독립QR/Poisson-Gamma log-magnitude모멘트와3seed Monte Carlo의평균/분산5SE로검증한다. 독립회귀·동일D/다른T2 반례·노이즈바닥/입력실패를 두화면/문제와 대조한다. 실제병변진단·임상ADC역치·IVIM/비Gaussian확산은 제외한다.

**W27 — F03 후속 “지방을 눕히지 않고 물만 여기할까?”**

- 선행 W02·W21·W23. 선택saturation과별개인두pulse/시간간격의물여기를독립관찰로구성해기존F03범위의미구현계획을보존한다. 같은위상+x의순간45°두pulse, 지연1.118ms(0~2.5,0.001), 공통offset0Hz(−500~500,25), 각도/B1배율1(0~2,0.05), 3T단일peak지방−3.5ppm/물carrier0을쓴다. RF중detuning/이완없음·중간spoiling없음·마지막pulse즉시읽기·각순수voxel M0=1로고정한다. 첫OP버튼은0.001ms근처이며정확null로표현하지않는다. 독립시간순서Bloch적분/주파수응답과두pulse사이coherence/실패를검증한다. 독립Bloch시간순서·물/지방선택/실패·signed/크기를두화면/문제와대조한다. 실제 binomial/shaped RF·임상권장/장비안전은제외한다.

**W28 — D03 “확산준비와EPI읽기는어떤문제를각각만들까?”**

- 선행 W19·W26. 중심 질문은 “b를 높이면 EPI 위치 이동도 커질까?”다. D02의 TE80ms/T280ms/D0.001mm²/s/PD1·잡음0 신호를 재사용하고 b0/500/1000/1500만 바꾼다. N32/FOV160mm·참점 y0=−20mm, 공통 offset50Hz(−100~100,10)·PE ±1이다. 읽기 세 조건은 SS(R1/ESP0.8ms/1shot), PI(R2/실제ESP0.8ms/1shot/ky한줄건너), 읽기분할(3shot/실제ESP0.4ms/각shot32개ky)이다. 분할수로 ESP를 자동 유도하지 않고 선언한 예시 조건이다. TE는 모두80ms·shot간위상완전일치다. 시간/위상과 선형위상기울기의 예측 위치를 표시하며 누락 PI 표본의 실제 coil 분리/영상재구성은 구현하지 않는다. 잡음/SNR·실제scan time·motion/eddy·dropout/국소늘어남을 비교하지 않는다. 세 관찰은 b/밝기, 시간규칙/이동, field·PE방향이다. 독립 SI 시간→복소위상 적분/unwrap회귀·R2 alias모호성·b불변/극한·실제 두 화면과 정답을 검증한다.

**W29 — S01 “신호·위상·blooming은무엇을반영할까?”**

- 선행 W07·W08. S01을 두 페이지로 나눈다. W29는 “위상이 달라지는 것과 신호가 사라지는 것은 같은가?”로 주어진 주파수분포/GRE·TE·blooming을 다루고, 독립 후처리인 mask/minIP는 바로 다음 W29b에서 구현한다. N32/FOV32mm·1mm격자·T280ms·PD1·TE20ms(5~40,5), Gaussian 평균10hHz/SD12hHz, h=exp(−r²/72)인 주어진 분포를 쓴다. 4개2mm평면의 기준도형은 반지름3mm·중심x−6/−2/2/6mm이며 기본평면은 index2다. 기준도형으로 field를 유도하지 않는다. 평균만/분산만/둘다, 평균주파수 부호±를 비교하고 C03의 연속Gaussian GRE크기를 재사용한다. 위상−2πfTE·ΔB단위·PD고정창·배경대비0.5미만 면적을 명시한다. 독립 주파수복소구적/이완ODE·모든pixel/좌표·두화면/정답을 검증한다. 실제χ→dipolefield·field filtering/unwrap·임상물질진단/장비성능은 제외한다.

**W29b — S01 후속 “위상 mask와 투영은 보이는 범위를 어떻게 바꿀까?”**

- 선행 W29. 같은 복소모형의 4개평면을 재사용한다. TE20ms(5~40,5), mask지수4(0/1/4), 단일평면index2/4평면minIP를 세관찰로 비교한다. 위상은 이미 배경장이 제거된 것으로 가정하며 음의위상에서 m=1+φ/π, 나머지1·SWI=|S|m^p·minIP=평면별최소를 쓴다. 평면 index2·부호관례고정·회색창/위상창·기준도형합집합/최저값위치·면적기준을 명시하고 독립구적/반복곱/정렬최소·모든실제pixel/두화면/정답을 검증한다. 실제high-pass/unwrap·vendor SWI·SNR최적지수/물질진단은 제외한다.

**W30 — C08 “잔여횡자화를보존하면정상상태가어떻게달라질까?”**

- 선행 W18. 중심질문은 “잔여횡자화를 보존하면 off-resonance 신호가 왜 반복될까?”다. TR5ms(3/5/10), flip30°(0~90,1), offset0Hz(−500~500,10), TE=TR/2·T11000/T2100ms·M01·단일정적spin을쓴다. 각TR의gradient0차moment0, 순간RF위상0/π교대·RF와함께도는수신위상·순간RF중이완/offset없음을선언한다. 세관찰은반복과정/잔여횡자화, 주파수응답/offset, TR·flip조건이다. RFframe1TR행렬고정점과첫50pulse transient·M0절대벡터오차1e−4의반복도달을계산한다. 독립labframe두RF주기Bloch/affine행렬지수고정점·직접시간적분·magnitude1/TR주기/위상반주기·flip0·실제두화면/정답을검증한다. 실제spatialgradient/다중성분·finiteRF/MT·흐름·vendor/임상최적화·안전은제외한다.

**W30b — C08 후속 “신호를 T2/T1 비율만으로 정할 수 있을까?”**

- W30의 고정T1/T2 반복/주파수응답과 독립인 대비 실험을 분리한다. 같은T1(A1000/100,B1000/200), 같은T2(A500/100,B1000/100), 같은비율(A1000/100,B500/50)ms 세쌍을 쓴다. TR5ms(5/20/50/100/200), TE=TR/2·flip30°·offset0·RF0/π·M01고정이다. 두spin의정확Bloch고정점과짧은TR/on-res근사 S=sinα/[1+cosα+(T1/T2)(1−cosα)]를비교한다. 기존BSSFP고정점을T1/T2선택으로확장해재사용하고독립lab두TR행렬/ODE·공유모형원래범위/실제두화면을재검증한다. 실제조직/임상대비·SNR·finiteRF는제외한다. W30에명시적으로남긴T1/T2대비를완결한뒤Q05로진행한다.

**W31 — Q05 “일부 k-space와 위상 가정은 어떤 관계일까?”**

- 선행 W08. 중심질문은 “측정을맞춘부분Fourier복원이왜틀릴수있나?”다. N64/FOV64mm·x0..63mm·M0기준실수진폭0.2+두사각형(16..23:+0.8,40..47:+0.4), 위상0/0.9sin(2πx/64)/1.2sin(20πx/64), 표본수40/48/64를쓴다. DFT bin q−32..31중 q≤count−33을읽어Nyquist−32를포함하고 DC/자기conjugatebin을덮어쓰지않는다. inverse1/64·forward무정규화다. zero fill/결측만conjugate채움/고정128회phase-line projection→측정재대입의간단POCS를동시에비교한다. phaseprior는대칭중앙±(count−33)의Hann(.5[1+cos(πq/(radius+1))]) 저해상위상또는정답제공이다. 음수real진폭을자르지않고마지막은측정우선·mergingfilter없음으로선언한다. 세관찰은실수/복소위상·측정수·위상prior이다. 독립FFT와실수normal행렬의Landweber등가반복으로검산하고복소/크기오차·측정잔차/위상선잔차·실제두화면/정답을대조한다. 실제vendor homodyne/POCS·noise/SNR·scan시간/임상복원을보장하지않는다.

**W32 — Q06 “희소하다는 가정은 누락 자료 복원에 무엇을 더할까?”**

- 선행 W08·W31. N64/FOV64mm·초기phase0·noise0, 직교Haar변환/복소L1을쓴다. 계단진폭(배경.2,16..23:1,40..47:.6)과조밀진동(.6+.18sin5+.16cos13+.14sin23 주기/FOV)을비교한다. 표본은고정불규칙32(중앙±7+seed0x4d524353으로고른나머지17), 짝수q32, 전체64다. unitaryFourier1/√64·HaarL2보존과 min .5||A a−y||²+λΣ|a|를선언한다. λ.01(0/.001/.01/.1), 복소soft threshold/FISTA최대2000회·20회마다dual gap1e−8×max(1,objective) 도달을검사한다. λ0은zero-fill최소norm해다. 세관찰은Haar희소성·같은개수의표본집합·λ/자료오차의tradeoff다. 독립명시적Haar기저/FFT/normal행렬·ADMM목적함수/dual bound·짝수표본에서32mm이동동일데이터/동일HaarL1반례·실제두화면을검증한다. 실제wavelet선택최적화/noise/coil·vendor CS·임상/AI·시간/SNR는제외한다.

**W33 — Q07 “겹친 두 slice를 코일과 위상 부호로 분리할 수 있을까?”**

- 선행 W10·W20. MB2·N32·FOV160mm의 두 slice와 두 coil을 사용한다. 감도 각 a(j)=θ+v cos(2πj/32), θ20°(0–45°,1°), v10° 또는0°다. 두 slice의 열은 [cos a,sin a]와 [sin a,cos a]이며 제곱합1이다. 두 번째 slice에 exp(−i2πq d/32), d0/16을 적용해 +d pixel 순환 이동을 만든다. 고정 phantom·잡음/이완 없음·감도 오보정0/+5°를 비교한다. 세 관찰은 중첩/CAIPI·균일 특이점·오보정 leakage다. 독립 FFT·Householder QR·각도 차이 g·전달계수를 절대/상대1e−10으로 확인하고 두 화면의 표·곡선·영상을 대조한다. 시간은 서로 겹치지 않는 2s 예시 블록에서 4slice의4→2묶음만 계산하며 실제TR/시간·RF/SAR/SNR는 제외한다. 균일 감도에서 CAIPI의 g 이득이 없는 반례를 포함한다. 실제 RF/profile·blipped gradient·실제 calibration은 후속 범위다.

**W34 — A01 “FOV 밖의 신호는 영상의 어디에 나타날까?”**

- 선행 W08·W09. 1D 점 phantom 두 개(−20mm 진폭1, 이동점+84mm 진폭0.6)를 쓴다. 이동점 −160..160mm/4mm, FOV128/256mm, 획득 pixel4mm 고정(N32/64), 모든 q 또는 짝수 q만 획득한다. q−N/2..N/2−1의 k=q/FOV이며 원래 위치에서 직접 Fourier 신호를 합성한다. 역변환의 1/N 정규화는 누락 상태에도 유지해 짝수 표본의 복제본이 각각1/2 진폭임을 명시한다. 표시 격자는 N 또는4N(1/4mm)이며 계수는 바꾸지 않는다. 세 관찰은 FOV modulo 위치·Δk를 줄이는 FOV 확대·새 정보 없는 zero filling이다. 독립 residue-class 격자/FFT와 Dirichlet 등비급수로 모든 복소 영상과 접힘 위치를 사전1e−10으로 검산하고 실제 두 화면/키보드/정답을 대조한다. 동일 Δx로 FOV 확대 시 자료 수가 늘지만 실제 scan time·SNR은 계산하지 않는다. 연속 조직/anti-alias filter·coil 복원·장비 oversampling은 제외한다. Chemical shift는 A04로 보존한다.

**W35 — A02 “움직인 물체의 k-space를 한 영상으로 합치면?”**

- 선행 W08·W17. N32/FOV160mm/5mm의 1D 두 점(−20mm:1,+35mm:0.6)을 y방향으로 함께 이동시킨다. 순간 q표본을250ms마다 하나 읽고 q는linear 또는centric 순서다. 주기 모형은 δ(s)=A[1−cos(2πs/8)]/2, 한 번 이동은 slot16부터δ=A다. A10mm(0–20/5mm)이며 실제 호흡 파형/시간은 아니다. gating은 주기 모형에서 외부 phase0 slot만 수락하고 마지막 수락slot 끝까지 대기 시간을 센다. 32줄의 accepted신호와 원래 정적 영상, 궤적·수락/대기 표·복소 NRMSE를 비교한다. 세 관찰은 주기/step, q획득 순서, 이상적 gating/대기다. 독립 좌표점 Fourier 합과 unitary spectral modulation 분해/FFT를 사전1e−10으로 대조하고 A0·gating 정적 극한·시간 사건 수·실제 두 화면/정답을 확인한다. 실제 readout 중 움직임·2D motion·coil/noise·호흡/ECG/navigator 보정·임상 최적화는 제외한다. D03의 실제 움직임/eddy 복원은 여전히 후속이다.

**W36 — A03 “표시 pixel을 늘리면 ringing과 실제 해상도는 어떻게 바뀔까?”**

- 선행 W08·W09. FOV160mm의 주기적 사각형 신호(.2 배경, |y|<20mm에서1, 경계.6)를 쓴다. 측정 q=−K…K, K8/16/32(기본16), Fourier 급수 계수 c0=.4/cq=.8sin(πq/4)/(πq)다. 표시 M128/512(기본128), rect/Hann 가중을 독립 조작한다. Hann wq=.5[1+cos(πq/(K+1))]이고 DC1이다. 실제 입력과 유한 역합·PSF를 같은 고정 창으로 비교한다. 세 관찰은 K/경계 진동, 표시 격자/동일 계수, 필터/PSF 폭이다. 초과/미달은 표시 격자에서 측정한 값으로 명명하며 연속 최대값으로 부르지 않는다. PSF는 중심1로 정규화한 진폭 FWHM(mm)을 표시한다. 독립 Simpson 적분 계수·radix-2 FFT와 PSF half-height 근을 사전1e−9 신호/1e−7mm로 검산하고 실제 두 화면/문제를 대조한다. 새 해상도 정보 없는 보간과 필터의 tradeoff를 확인한다. 실제2D/조직 진단·장비 필터/임상 ringing 제거는 제외한다.

**W37 — A04 “공간 이동과 한 voxel의 상쇄는 어떻게 다를까?”**

- 선행 W16·W21. Q02와 F01의 검증된 순수 모형을 수정 없이 재사용하는 두 실험 비교다. 실험1은 N64/FOV240mm/3.75mm의 물 점−30mm와 지방 점+30mm를 서로 별도 순수 진폭1로 읽어, BW50/100/200/400/800Hz/pixel(기본200)·readout극성±1에서 지방의 위치 이동을 표시한다. 실험2는 한 voxel의 물/지방 비율f0/.5/1(기본.5), B0 1.5/3T, TE0/첫OP/첫IP/3/6ms(기본OP)에서 복소 합과 공통감쇠 전 신호비를 표시한다. B0만 두 실험에 공통이며 BW/극성은 실험1, TE/f는 실험2에만 적용된다고 명시한다. 합성 모형·순수 점의 고정창/혼합 신호 정규화·fat−3.5ppm/위상 부호를 구별한다. 독립 SI gradient 위치 역산/Dirichlet와 물/지방 RK4 ODE로300조건의 위치·복소값을 사전1e−9로 대조하고 실제 두 화면/정답을 확인한다. 두 실험을 동시에 합친 임상 영상이나 실제 권장 BW·SNR·다중 peak/진단은 제외한다.



**W38 — A05 “공간에 따라 다른 field는 영상의 위치를 어떻게 바꿀까?”**

- 선행 W07·W19·W28·W29. D03의 공간 field 후속을1D 위치 왜곡에 한정한다. N32/FOV160mm의 고정4점 y−45/−15/+15/+45mm, 진폭.5/1/.8/.6을 사용한다. TE50ms·이상적180°는25ms, 각 q−16…15의 중앙 표본 t=TE+polarity×q×ESP, ESP.5/1/1.5ms, polarity±1이다. 주어진 df는 A(균일), Ay/80(선형), A exp{−[(y−20)/30]²} (국소), A0/40/80Hz(기본80), 기본선형/ESP1/+극성이다. 점별 신호는 exp{−i2π[qy/160+df(y)(t−TE)/1000]}이며 inverse1/32를 계산한다. 세 관찰은 균일/국소 이동·ESP/극성·변한 밝기와 위상 소실의 구별이다. 단일 주파수 점이라 voxel 내 분포·T2 손실은 없으며 실제 신호 소실은 C03/S01과 연결한다. 독립 두 자유진화/180° 반전/Taylor 회전·FFT·unwrap 위상 기울기로 복소1e−9/위치1e−7mm를 검산하고 실제 두 화면·표·그림·정답을 확인한다. 실제χ→dipole·metal·2D/readout ADC·공간적 역보정·voxel 분포·임상 성능은 제외하며 A05는 부분 구현으로 유지한다.

**W39 — A06 “밝기 불균일의 원인이 RF인지 수신 감도인지 구별할 수 있을까?”**

- 선행 W11·W23·W33. 균일 M0=1의 N64/FOV160mm/2.5mm phantom을 사용한다. h(y)=cos(2πy/160), 강도v0/.25/.5/.75/1(기본.5), RF8ms·nominal90/45°다. TX는B1scale=1+v h, RX는gain=cos(πv h/2)와균일RF, B0는df=60v h Hz와균일RF/gain이다. F03의유한RF pulse 회전에서spoil전 Mxy크기를재사용한다. RX감도는90°에서TX와일부러같은밝기를만드는고정함수이며flip을바꿔도감도자체는변하지않는다. 세관찰은원인별map·90°의비식별반례·45°추가조건에서의구별이다. 독립SI Bloch ODE·수신곱과30조합/전체voxel을사전1e−9로검산하고실제두화면·map/신호/정답을대조한다. 단일RF직후·이완/noise 없음·고정창0–1이며실제QA/간섭/zipper·RF안전·진단·B1map추정/보정은제외한다. A06은이3기전부분구현으로유지한다.

### 이후 승격 순서

**W57 — M04 “성분 신호를 이미 안다는 가정을 풀면 어떤 정보가 더 필요할까?”**

- 선행 PDFF 가정·Dixon. 정답fat분율0/.3/.5/1(기본.3), 알려진field−60/0/+60Hz(기본+60), fit가정일치/단일peak/공통T2*40ms(기본일치)의36조건이다. B0 3T·6peak는W43b자산그대로, 실제T2*물40/지방20ms,초기공통위상0·밀도합1·T1가중/잡음0이다. TE1/2/3/4/5/6ms의합성복소합6개만자료로주고W/F를이미분리된입력으로쓰지않는다. 알려진field/감쇠/spectrum의2복소열에서실수비음수W/F를least squares로맞춘다. 합W+F는1로강제하지않고 F/(W+F)를계산한다. 관찰은알려진field/복소자료·같은자료의모형변경·지방0에서틀린fat모형도잔차0인반례다. 원자료/fit Re·Im/복소잔차표와고정신호±1.2/계수0…1.2표시를같은값으로연결한다. 독립복소ODE·12실수행의QR/경계최소/KKT로신호·계수/분율1e−8,목적함수1e−10을검산하고두화면/원표/문제·전체시험을통과해야완료다. 실제unknownfield/R2*·복소수신위상/잡음·T1/다중coil·환자PDFF/임상성능은제외한다.

**W61 — X02 “Slab에 새로 들어온 spin은 반복 RF를 겪은 spin과 같을까?”**

- 선행 등속 궤적·C06 반복 RF/회복. v0/5/10/20cm/s(기본10),TR10/20/40ms(기본20),flip10/30/60°(기본30)의36조건이다. Slab0…30mm, T1=1200ms/M0=1, 정확한균일RF·완전spoiling, TE0/RF직후 진폭·잡음0을 고정한다. 유입은+z 방향 plug flow이며 slab 밖 spin은RF를 겪지 않은 평형이다. 각 RF시점에 충분히 반복된 공간 profile을 120개 깊이중점(0.125…29.875mm)으로 관측한다. 유입 spin의 과거RF횟수와C06종자화점화식을 연결하고, 정지v0은무한정상상태로 구별한다. 관찰은입구/깊이·속도/노출횟수·flip/포화다. 깊이선택으로 각지점의과거횟수/Mz/진폭을 표·신호0…1고정곡선·120띠에 연결한다. 독립세계선의RF이벤트추적·Rodrigues/RK4회복·정지고정점으로 신호/자화1e−8,횟수정확일치를검산하고 실제두화면·예시/키보드/정답과전체회귀를확인한다. 실제혈액/조직값·B0gradientphase/T2*·혈관분포/난류·2D/3D영상/TOF프로토콜은제외한다.

**W56 — G02 “유한 길이 RF의 slice profile은 이상적 사각형과 같을까?”**

- 선행 이상적 선택·유한 RF. 중심0의 실제축 sinc[4(t/T−.5)]를0…T에서 자른 TBW4 교육파형을 사용한다. Duration2/4/8ms(기본4), nominal flip30/90°(기본90), Gz−10/−5/+5/+10mT/m(기본+10)의24조건이다. RF면적을중심flip에맞추고 초/µT와공통양성자상수/음의위상회전규약을사용한다. 초기M=(0,0,1),T1/T2∞,추가offset0,gradient동시일정,관측은RF끝직후다. Rephaser/echo는구현하지않는다. z−10…10mm/201점에서2048개중점상수RF의공통정확회전을합성한다. 명목BW=4/T초와두께BW/(γ̄|G|)는설계척도이며실제FWHM/완전한직사각형으로부르지않는다. 관찰은duration/폭·gradient/극성·flip30→90의sin비선형이다. RF축0…8ms/±20µT,profile위치±10mm/자화±1고정·원표/예시/문제를제공한다. 독립연속RF Simpson면적/SI경계root·8192단계RK4로벡터절대2e−5/두께1e−9mm/면적flip1e−4°를검산하고표본norm1e−10·두화면/무거운조건·전체시험을확인한다. 실제장비pulse/SLR설계·교환/이완·다중slice/cross-talk·SAR/안전판단은제외한다.

**W60 — X01 “같은 gradient에서 정지한 spin과 움직이는 spin의 위상은 같을까?”**

- 선행 공간부호화·gradient 적분. 등속 v−10/0/+10cm/s(기본+10), 각 lobe 길이 τ1/2/3ms(기본2), 극성 +G→−G/−G→+G(기본+→−)의18조건이다. G크기2mT/m, t0의 x0=1mm, 처음 M+=(1+0i), offset0·이완/확산/잡음0을 고정한다. 두 사각 lobe를 바로 이어 0…2τ에서 관측하며 180°RF는 없다. 이동 spin과 같은 x0의 정지 참조를 비교한다. M0=∫Gdt, M1=∫tGdt는 t0 기준 SI 단위로 계산하고 φ=−γ(x0M0+vM1), M+=exp(iφ)의 기존 음의 위상 규약을 유지한다. 끝의 M0=0이 M1=0을 뜻하지 않음을 중심으로, 정지/운동·τ²·극성/속도 부호의 세 관찰을 제공한다. 201개 시점의 위치·M0/M1·정지/운동 누적 위상과 복소 성분을 표/고정축/선택 시각에 연결한다. 독립 SI 궤적/횡 Bloch RK4·주파수 적분으로 위상/복소1e−8, moment1e−14를 사전 기준으로 정한다. 18조건·실제 두 화면·키보드/예시/정답과 전체 회귀를 통과해야 완료다. 단일 spin의 |M+|=1을 임상 flow void/밝기로 확대하지 않으며 유입/분포의 복소합·flow compensation/가속·실제유량·VENC는 분리한다.

**W55 — M02 “T1 변화의 비율과 hematocrit는 ECV 계산에 어떻게 들어갈까?”**

- 선행 signed T1 mapping·정량 bias. 가상 정답ECV20/30/50%(기본30), 평형 혈장농도0/.5/1/2mM(기본1), 계산에 넣는Hct25/40/55%(기본40)의36조건이다. 실제모형Hct40%, native T1조직1000/혈액1500ms, 공통 유효relaxivity4s⁻¹mM⁻¹를 교육값으로 고정한다. 세포내 분포0, 혈장/조직 세포외 농도 같음, 빠른교환의 단일 유효R1·잡음0을 명시한다. R1=1000/T1ms, λ=ΔR1조직/ΔR1혈액, ECV=(1−Hct입력)λ를 계산하고 농도0의0/0은정의불가로 둔다. 관찰은 농도/T1과비율·같은신호/다른입력Hct·분모0이다. 1cm³ 구획 부피/µmol·전후T1/R1표와 ΔR1 두축0…5s⁻¹의 고정 그래프를 같은값으로 그린다. 독립1mm³ 부피 적분/종자화RK4·역수와 보존식으로 R1 1e−9s⁻¹/T1 1e−6ms/분율1e−9를검산하고36조건·두화면·예시/정답/키보드·전체회귀를통과해야완료다. 실제투여/시간·MOLLI/환자Hct추정·분할2Dmap/임상cutoff는제외한다.

**W58 — X05 “조영 농도가 늘면 GRE 신호도 계속 커질까?”**

- 선행 ECV의R1단위·M03감쇠·C06spoiledGRE. C0/.25/.5/1/2/4mM(기본1),TE2/8/16ms(기본8),flip5/15/30°(기본15)의54조건이다. TR20ms·M0/PD1·정확순간RF/완전spoiling·정상상태·잡음0을고정한다. R1=1+4C s⁻¹,R2*=25+20C s⁻¹를교육용선형모형으로직접정의하고특정약제값/실제r2로취급하지않는다. C06의순수정상상태RF성분을재사용해TE감쇠를한번만곱한다. 비교선은같은R1에서R2*증가항만0인참조다. 관찰은고농도/비단조·TE/감쇠·flip/T1가중이다. 농도0…4의161표시점·신호0…0.5고정·T1/T2*/두신호/기준C0비와표를연결한다. 독립Rodrigues/종이완RK4/고정점반복·횡ODE와해석적 비로 신호1e−8/비율1e−8을 검산하고 실제 두 화면/조작/정답·전체 시험을 확인한다. 실제약제·투여량·동태/혈관구획·환자프로토콜/안전·subtraction은제외한다.

**W69 — 고정 제목에 가려진 선택 행을 실제로 보여 준다**

- W64실제화면에서 표를끝으로내린뒤f.5의선택행보기로돌아오면행이sticky제목뒤에가려짐을재현했다. W64신규페이지는scroll-margin과제목셀기준검증으로고친다. 같은기존버튼/고정제목코드가있는선행페이지를 W64뒤다음복구작업으로검사하고첫/중간/끝행·역방향스크롤·두화면/키보드를확인한다. 계산/원표값은그대로두고HTML표시변경과과거물리/버전기록을구별한다.

**W68 — X15 “균일 offset과 선형 field를 같은 보정으로 줄일 수 있을까?”**

- A06/N03의 offset·공간 퍼짐을 연결한다.40mm 관측 구간의 균일30Hz/선형2Hz/mm/혼합 field와 무보정/상수/상수+선형 보정, TE0/5/12.5ms의27조건을 비교한다.401개 동일 가중 중점에서 알려진 field의 평균/최소제곱기울기를 구하고 공통free의 복소합을 계산한다. 평균0/분산잔류·공통위상/크기·기울기제거의 세 관찰을 제공한다. 보정은 알려진 모형field를 빼는 이상적 연산이며 scanner coil 전류/장비 설정이 아니다. 독립 기하급수합/공간 moment·횡ODE로 복소1e−8, Hz/기울기1e−9를 검산하고27조건·실제 두화면·표/곡선/키보드/예시/정답·전체회귀와 내용 판정을 확인한다. 실제 field 측정/잡음·고차/비선형 field·장비 shim·RF/안전/임상 최적화는 남긴다.

**W72 — X06 “다른 TE의 신호비를 같은 ΔR2*로 읽을 수 있을까?”**

- C07/M03/X05와 W70의 시간모양을 연결한다. NativeR2*=30s⁻¹, ΔR2*(t)=40sin²(πt/20)s⁻¹(0<t<20초/밖0), TE10/30/60ms·기준신호입력배율.8/1/1.2의9조합이다. 선택시각0/5/10/15/20/30초의54조건,121시간점을 비교한다. 기존 T2Fit의 generic 지수와 W70의 순간함수에서 추출한 무차원 모양을 재사용한다. S/S0입력과−ln비/TE초·기준mismatch편향을구별하고음의추정값을clip하지않는다. 독립cos모양/횡감쇠RK4와해석적log편향으로 신호/비1e−8·rate1e−6s⁻¹을검산하고실제두화면·54조건/표/곡선·예시/키보드/정답·전체회귀와내용판정을확인한다. 단일양의지수/같은PD·T1가중변화/누출/잡음없음가정이며농도/AIF/CBV/CBF/MTT·실제DSC획득/임상cutoff는제외한다.

**W73 — X15 “직선 보정 뒤 남은 휘어진 field는 무엇을 뜻할까?”**

- 알려진1차원 f(x)=30+2x+cx²Hz, c0/.1/.2Hz/mm²와무보정/상수/선형/2차기저·TE0/5/12.5ms의36조건을비교한다. 40mm/401동일가중중점·초기M+=1·이완/RF/잡음/이동/수신차이미포함이다. QR투영과공통free를사용하고독립격자moment/2차위상공비재귀·횡ODE로계수/Hz1e−9·복소/크기/위상1e−8을검산한다. 곡률잔여/기저일치/원래직선의세관찰과실제두화면·표/곡선/키보드/정답·전체회귀를확인한다. 실제3D harmonic coil·전류제한/최적화·측정/가중/고차field와1차원다항식의차이를유지하며임상품질/안전을보장하지않는다.

**W76 — X15 “제외한 T1 효과”와 “T1 시간을0으로 설정”을 구별한다**

- W72 검토에서 T1가중변화 제외를 시간값0과 구별했다. W68의 “RF/T1/잡음/이동/수신 차이0”도 제외한 효과라는 뜻을 풀어 쓰고, 공통free의 기본 T1/T2무한대·RF미적용과 일치하는지 내용 검토한다. 계산/수치/표/곡선은 바꾸지 않고 현재 지문을 고정해 바이트 불변을 확인한다. 실제 두 화면에서 선행 가정의 펼침/읽기와 연결/기록을 확인하며 이를 새로운 T1모형 물리 통과로 확대하지 않는다. W73 전에 짧은 명확화 작업으로 우선한다.

**W74 — X07 “같은 조영 입력에서 전달과 세포외 부피는 곡선에 같은 영향을 줄까?”**

- 같은혈장입력Cp1mmol/L(0≤t<1분)/이후0에서Ktrans0/.1/.2/.4min⁻¹·ve.2/.4의8조합을비교한다. 초기Ct0/혈관직접항0,조직부피기준Ct와EES부피기준Ce=Ct/ve·kep=Ktrans/ve를구별한다. 선택t0/.5/1/2/4/6분의48조건·121시간점이다. 구간별지수해와독립합성곱/입력종료event분리ODE·유출누적적분으로농도/률/보존1e−8을검산한다. 빠른교환/큰분포부피/전달0의세관찰·실제두화면·표/곡선/경계/키보드/정답·전체회귀를확인한다. 혈관항/실제AIF/신호→농도/환자fitting·임상cutoff는분리하며기전을유일하게진단하는모형으로확대하지않는다.

**W82 — X10 “주기 운동의 한 순간은 관찰 시간창에 따라 어떻게 보일까?”**

- 알려진주기운동과시간창평균을연결한다. 착수때주기/위상·창길이·독립시간적분을정한다. 실제심장gating/부정맥·cine획득/진단/환자최적화는제외한다.

**W81 — 본문의 단어/수치/단위를 쉽게 구별할 수 있게 한다**

- 새학습본문에서붙어있는한국어/영문기호/단위의띄어쓰기를보강한다. 계산/수식/정답/표자료/조작범위를보존하며문구변경목록과계산바이트불변을대조한다. 실제두화면에서문단/단위/모형범위를읽고기존물리판정과편집범위를구별한다.

**W80 — X17 “영상의 격자 간격을 실제거리와 어떻게 비교할까?”**

- 알려진2차원phantom 점격자와픽셀/mm변환·직접정의한공간변형을연결한다. 착수때격자/축별간격·독립좌표/거리기준을확정한다. 환자영상/실제장비QA허용치·합격판정은제외한다.

**W79 — X09 “자극이 끝난 뒤에도 지연된 반응이 남을 수 있을까?”**

- 알려진 입력과 직접 정의한 지연 반응 kernel의 합성곱을 연결한다. 착수 때 시간/정규화·독립 적분 기준을 확정한다. 자극·혈역학 대리곡선·실제신경활동/BOLD를 구별하고환자분석·fMRI통계/활성화추론은제외한다.

**W78 — X12 “교차하는 두 확산 성분을 하나의 tensor로 설명할 수 있을까?”**

- W77의동일고유값/MD/FA인두성분을A0/B0·45·90도와b0신호분율0/.25/.5/.75/1·b0/500/1000의45조건으로섞는다. 기존DiffusionTensor/ADCFit을재사용하며양의같은위상신호/무교환/잡음0이다. b>0의로그ADC를36고유xy방향에서단일tensor형태1/cos2θ/sin2θ에투영하고b0의ADC/fit/잔차는미정으로둔다. 독립상대각지수합·피벗3×3정규방정식으로D/fit1e−12·신호1e−8을검산한다. 정렬두성분/교차/한성분·원표/곡선·실제두화면/예시/키보드/정답·전체회귀를확인한다. 일반3D추정/실제섬유수·조직분율·tractography/진단은제외한다.

**W77 — X12 “같은 평균 확산인데 방향별 신호와 FA는 다를까?”**

- 알려진양의고유값(.8,.8,.8)/(1.4,.5,.5)/(1.1,1.1,.2)×10⁻³mm²/s와z축주위회전0/45/90도·b0/500/1000s/mm²의27조건을비교한다. xy방향0…180도/5도간격37점·X/Y/Z세축의gᵀDg와기존ADCFit의noise0/동일T2·S0정규화를사용한다. 행렬trace/등방성제거Frobenius비와독립고유값FA·상대각ADC/감쇠ODE로D1e−12·FA/신호1e−8을검산한다. 동일MD/방향신호·회전불변·같은MD/FA의다른λ를관찰하며실제두화면·표/곡선/예시/키보드/정답·전체회귀를확인한다. 실제tensor추정·잡음/교차성분/확산시간·tractography·질병분류는제외한다.

**W75 — X08 “관측한 label 신호가 작으면 혈류도 반드시 적을까?”**

- 가상20cm경로의순간표지packet에서속도10/20/40cm/s·T1 1000/1600/2200ms·표지직후관찰t.5/1/2/3초의36조건을비교한다. 초기controlMz+1/labelMz−1에서공통relax를사용하고차이를2로나눠초기1에정규화한다. 도착전0/도착순간부터같은T1로보관하는관찰규칙이며t=τ도착으로정한다. 독립SI운동학/회복ODE로자화1e−8·시간/위치1e−10을검산하고실제두화면·표/이동/곡선/gate·예시/키보드/정답·전체회귀를확인한다. 순간표지t와유한PCASL PLD를구별하며실제pulse/표지기간/효율·교환/유출·ASL읽기/CBF/임상권고는제외한다.

**W70 — X04 “같은 bolus 곡선도 관측 시간창이 달라지면 같게 보일까?”**

- X05/G03/Q03에서 시간 관측으로 이어간다.0…20초의 s(t)=.05+.25sin²(πt/20), 바깥은baseline.05라는 직접 정의한 정규화 신호를 사용한다. 관측창W2/6/12초의 균일 평균과 프레임 간격Δt2/6초를 분리하며 중심0…30초의16/6프레임(총66값)을 비교한다. 선택 프레임은 관찰 커서로 둔다. 관측창의 겹침은 기하학적 길이 비율이지 noise상관/독립 정보량 추정이 아니다. 순간값/창평균·W/간격·peak표본의 세 관찰을 제공하고 독립 사건분할 Simpson 적분으로 신호1e−8을 검산한다. 실제 두화면·전프레임/표/301점곡선·예시/키보드/정답·전체회귀와 내용 판정을 확인한다. 이 scalar 평균은 실제 CE-MRA/k-space 재구성·농도/RF동태나 약제투여/환자 bolus timing 최적화가 아니다.

**W71 — X05 “뺄셈 영상의 양/음 경계가 모두 조영 변화일까?”**

- X05/A02에서 전후 두 영상의 위치 차이로 이어간다.128mm/128pixel·dx1mm, 바탕구간[−40,40]mm 신호.2와 중앙[−6,6]mm 추가.1을 정의한다. 중앙 증가Δ0/.1/.3a.u., 후영상이동−8/0/8mm, 무정렬/알려진 정수pixel역이동의18조건이다. 후영상−전영상의 signed차·전영상 고정ROI[−6,6] 평균·전체 양/음 적분을 같은값으로 제공한다. 이동만의 경계/순적분0·증가와오정합혼합·정수pixel정답정렬의 세 관찰을 둔다. 전후0…0.6a.u./차±.4 고정창으로1차원 교육용 띠·계단profile/원표를 표시한다. Product의 구간겹침/배열역이동과 독립subpixel적분/사건분할signed적분으로 pixel1e−12/적분1e−10을검산하고18조건·실제두화면/canvas pixel·표/그래프·키보드/예시/정답·전체회귀를 확인한다. 분수pixel보간/이동추정·실제환자registration·noise/시퀀스/진단은제외한다.

**W67 — 게시된 원본과 로컬 SHA-256을 같은 바이트 기준으로 읽는다**

- a734a1b의 X13 검토 대상 중 ir-lesson.css/일부브라우저절차·JSON은 Git의CRLF→LF정규화로 로컬 SHA와 게시blob SHA가 다름을 확인했다. HTML/자료JS는일치했고모든차이는줄바꿈뿐임을바이트정규화대조로확인했다. W63을마친뒤다음복구작업으로실행한다. 검토당시 rawSHA와commit별blobSHA를둘다보존하고줄바꿈외차이는실패시키는재현가능한게시감사를추가한다. 코드변경을EOL차이로숨기지않는의미있는시험과공개자산대표SHA검증·보고서의지문설명을정리한다. 과거로컬검토지문을무조건덮어쓰거나물리검증을새로통과로바꾸지않는다.

**W66 — X03 “두 획득의 위상차로 속도를 구할 때 무엇이 모호할까?”**

- W60의 부호/단위와 W64 복소합을 기반으로 등속 v−300/−150/−75/0/75/150/300cm/s, VENC75/150/300cm/s, 공통 기준위상−120/0/120°의63조건을 다룬다. 기본75/150/0, 각 bipolar lobe2ms·x0=1mm·M+=1·모든spin관측·이완/확산/잡음0이다. A는−G→+G, B는+G→−G, A1A=+π/(2γVENC), A1B=−π/(2γVENC)로 정하며 W60 unit 응답/공통free를 재사용한다. D=SB·conj(SA)의 arg와VENC·arg(D)/π를 구하고, branch(-π,π]의 ±VENC 경계 동등성과2VENC 주기를 명시한다. 고정속도축−300…300/121점의 꺾임을 잘라 그려 wrap을 연속 변화로 오인하지 않게 한다. 독립 SI세계선/횡Bloch RK4·속도 합동식으로 복소/위상1e−8·속도1e−6cm/s·moment1e−14를 사전 검산하고63조건/실제 두화면·공통위상/alias/경계예시·키보드/표/정답·전체회귀를 확인한다. 실제분포/유량·가속/맥동·배경위상오차·noise/VENC최적화·4D flow는 제외한다.

**W65 — X13 “Oxy/deoxy/철 저장 상태를 다른 시퀀스에도 같은 밝기 규칙으로 읽을까?”**

- W62와 S01의 구획/정적 refocusing을 연결한다. 180°가 있으면 물질 영향도 모두 없어지는지 묻고, 세포내 oxy/deoxy·deoxy 용혈액·철 저장 분포의 네 조건과 원전 읽기/GRE로 옮겨 읽기의 두 모드를 제공한다. Gomori1987의0.19–1.4T 혈액 NMR/echo 간격과 Thulborn1990의 쥐 혈종/대칭·비대칭 SE linewidth를 구별한다. 초록에서 읽은 정성 경향·물질 위치 도식·단위/미제시 조건과 주장표를 독립 대조하고 실제 두 화면의8상태·예시/키보드/정답·전체 회귀를 확인한다. 임의 T1/T2·밝기·날짜 계산은 만들지 않으며 원전 밖 GRE는 추가 조건 확인으로 표시한다.

**W64 — X01 “위상이 다른 속도의 신호를 합치면 크기는 어떻게 달라질까?”**

- W60의 음의 자유회전/두lobe와W61의 유입/포화를 구별한다. 두집단의속도는±v로두고|v|0/10/50/v90cm/s, +v분율0/.25/.5/.75/1, 각lobeτ1/2/3ms(기본10/.5/2)의60조건이다. v90은τ2ms에서각집단의끝위상이±π/2가되는고정속도로정의하고τ를바꿔도속도는유지한다. G2mT/m·초기x0=1mm/M+=1·동일수신가중·모든spin관측·이완/확산/유입/잡음0이다. W60의검증된v10/같은τ unit위상을선형확장하고공통free의회전으로각집단과분율가중복소합을구한다. 절댓값합/복소합·분율/상쇄·동일속도/끝점의세관찰과분율0…1/101점/신호0…1고정곡선,두가중벡터/합·원표를제공한다. S<=1e−8에서는위상을정의불가로표시하며수치규칙이지임상noise역치가아님을명시한다. 독립SI세계선/횡Bloch RK4의두집단을합산해복소/크기1e−8,비상쇄위상원형차1e−7rad로사전검산한다. 실제두화면·키보드/예시/상쇄정답/0분율과전체회귀를확인한다. 실제속도분포/난류/혈관유량·유입/유출/TE감쇠·임상flow void/VENC는제외한다.

**W63 — X14 “같은 조직이 B0에 대한 방향만 달라도 T2가 달라질까?”**

- 선행 대비/각도·완전한 방향 정렬. θ0/30/45/정확magic/70/90°(기본magic),TE2/10/40ms(기본2)의18조건이다. f=3cos²θ−1, R2=50+200f² s⁻¹를방향/유한바닥을분리하기위해직접정의하고,T2(ms)=1000/R2로둔다. 실제조직fit/문헌측정값으로취급하지않는다. 초기횡진폭1,RF/T1가중·잡음·B0불균일/T2*0이며공통free의T2감쇠만재사용한다. 각도0…90/181점·시간0…60ms/61점과선택θ/TE·B0대비방향도식을연결하고신호0…1고정창을유지한다. 관찰은0→magic·같은θ의TE증가·90°에서음의f/양의R2다. 독립기하의평행/수직투영으로f,atan√2의근과횡ODE RK4로신호1e−8/R2·T2 1e−9/각도1e−9°를사전기준으로검산한다. 실제두화면·표/곡선/도식·예시/키보드/정답과전체회귀를확인한다. 실제힘줄/조직별이완률·분포/다성분·환자진단·보편TEcutoff는제외한다.

**W62 — X13 “출혈 상태 표를 촬영 날짜의 시계로 읽어도 될까?”**

- 선행T1/T2대비·자화율. 원전의 high-field spin-echo에서 비희석 세포내 metHb·비희석 free metHb·희석 free metHb의 세 상태와 T1W/T2W의 정성 경향을 읽는다. 특히 비희석 free 상태는 저자 제안을 포함함을 표시하고 일률적 T2고신호 규칙으로 바꾸지 않는다. 세 상태×읽기T1W-SE/T2W-SE/GRE-T2*(근거 밖)의9상태와2–3관찰을 제공한다. 정량T1/T2/농도·숫자 밝기/시간 경과 시뮬레이션을 만들지 않는다. 주장/구획/농도/가중/근거수준·날짜 역산 불가를 두 원전의 정확한 초록 위치와 독립 대조해 별도 주장표에 기록한다. 선택 상태/표/개념 도식/근거 링크·예시/키보드/정답·데스크톱/모바일과 전체회귀를 확인한다. Oxy/deoxy/철저장 상태·실제GRE/환자별 날짜·진단은 후속 범위로 남긴다.

**W59 — 공개 Pages에서 보고서의 원본 계산 코드를 열 수 있게 한다**

- W54 최초 게시 후 `../../../tests/...`가 공개 Pages의 /docs 범위를 벗어나404가 됨을 실제HTTP로 확인했다. 과학 계산/본문은 유지하며 보고서 renderer에서 저장소 원본 경로를 명시한 GitHub blob 링크로 바꾼다. 존재하지 않는 파일을 외부 URL로 숨기지 않고, 로컬 자산/등록 보고서/Markdown 링크를 보존하는 의미 있는 시험을 추가한다. 전체 HTML 재생성·관련/전체시험·코드 링크와 보고서의 실제 두 화면·링크 감사를 통과해야 완료다. 이전 내용 검토를 새 물리 검토로 확대하지 않는다.

**W53 — AI03 “매끈한 결과의 잡음 표준편차만으로 SNR을 말할 수 있을까?”**

- 선행 AI03 정량·Q01. N64/FOV64 mm, 0/상수.2/상수1/기존단계+작은점의4원본에영상 Re/Im σ0/.05/.15의512회 고정seed 복소 Gaussian 잡음을 더한다. AI01의4처리를 그대로 재사용하는48조건. 기본단계/.15/평활. 관찰은 분산감소와bias·인접잡음상관·비선형처리의신호의존성. 복소출력을유지하되 Re의위치별반복평균/표본분산/인접공분산·상관과평균biasRMS를별도표시한다. 평균/SD 표본비는한정된반복지표이며SD0은정의불가. 순환j63→0공분산과m−1분모를명시한다. 독립FFT응답/Haar행렬·2pass통계로신호1e−9/분산공분산1e−10검산,선형σ²Σh²·σ²Σh[k]h[k+1]기대와유한표본차를구별한다. 실제환자·다중coil/비선형SNR임상표준은제외한다. 실제두화면/표/키보드/정답과전체시험으로완료한다.

**W54 — N03 “voxel 안의 주파수 분포는 peak 폭과 높이를 어떻게 바꿀까?”**

- 선행 localization·단일 line. 중심0의 균일 voxel 폭10/20/40 mm, 잔여 선형 field gradient0/.5/1 Hz/mm, 균일 offset−10/0/10 Hz, intrinsic T2=80/160 ms의54조건. 기본20mm/.5/0/80. 단위부피 평균으로 FID(0)=1/연속흡수선 전체면적1을 고정하고 실제 voxel부피/SNR효과는 제외한다. 복소FID는공통free×uniform분포의sinc, spectrum은N02 Lorentz와uniform분포convolution의arctan해석식이다. T2*를다시곱하지않는다. 관찰은uniformoffset/폭·gradient에따른broadening/같은면적과다른높이, shimming은gradient잔여를줄이는개념만이다. 독립공간Simpson으로복소FID/선분포적분,별도halfheight root/면적구적으로 신호1e−9/폭1e−7 Hz를검산한다. 실제finiteDFT/MRS대사물/voxel선택기전·shim최적화/임상품질기준은제외한다. 고정field±30Hz/FID±1/spectrum0… .35signal·s·원표/정답과실제두화면/전체시험을확인한다.

**W52 — AI02 “벤더별 AI라는 이름에서 같은 역할과 다른 근거를 어떻게 구별할까?”**

- 선행 AI01·AI03. GE AIR Recon DL, Siemens Deep Resolve Gain/Boost/Sharp, Philips SmartSpeed/SmartSpeed Precise, Canon MR AiCE/PIQE의8명칭을2026-10-17에직접읽은공식자료로비교한다. 중심질문은 제품군 안의 역할/근거 구별이다. 관찰은 denoising/가속조합/행렬·선명도 역할 필터, 자료 날짜와 software버전의 구별, vendor자료/독립성능 근거의 구별이다. 기본전체8개·역할3필터·초기화/세예시·확인문제. 제조사 원문과 각 주장·조건·페이지를 대조하고 미확인 버전/업데이트일은 명시한다. 특히 PIQE의zero filling과AI denoise/deringing을 구별하고 Gain을신경망으로단정하지않는다. 실제가중/실행/기관별지원·동일과제임상우열은 미검증. 과학계산을새로넣지않는읽기페이지이며 별도수치시험을늘리지않고 기존전체시험과 실제두화면의필터/표/문제/링크를확인한다.

**W51b — AI03 후속 “공간 처리가 서로 다른 감쇠를 섞으면 정량값도 바뀔까?”**

- 선행 AI03 기본·M01. N64/FOV64 mm, A1/위상0/잡음0의 이상적 SE echo10/20/40/60/80/120/160/200 ms. 배경T2=80 ms, 중심j32의 폭1/3/7표본은T2=20/40/120 ms다. AI01의identity/평활/선명도/Haar1회를 각echo에 적용하고 all/early4/late4의 free-intercept log OLS를 한다. 기본40 ms/폭1/평활/all. 관찰은 공간 혼합·echo 범위·음수/피팅 불가다. 사용 신호≤1e−12이면 절댓값/누락 없이 불가, slope≥−1e−12이면 감쇠추정 불가로 표시한다. 유효점만의 map RMSE와 제외 개수를 함께 표시하고 T2고정창0…200 ms 밖 값은 원표에 유지한다. 독립 이완ODE/주파수필터·Haar행렬/QR로108조건 신호1e−10·T2 1e−7 ms를 검산한다. 실제 학습·noise/2D/임상mapping은 제외한다.

**W51 — AI03 “매끈한 영상에서 작은 구조와 정량값은 유지됐을까?”**

- 선행 AI01·M01. 기본은N64/FOV64mm의같은단계원본/작은점0.15(j32)/texture.06cos(2π12j/64)이다. 전표본복소영상에Re/Imσ0/.05/.15의고정seed A/B잡음을더하고AI01의identity/평활/선명도/1회Haar처리를수정없이재사용한다. 동일잡음의점없는쌍/texture없는쌍도처리하여출력차를비교한다. 세관찰은전체NRMSE/작은구조·선명도overshoot·texture/seed조건이다. 점정점비·국소대비비·알려진cos투영진폭비를정의하고비율을0–100%로clamp하지않는다. 실제한장검출/AI성능이나SNR추정이아닌paired교육지표임을명시한다. 독립FFT주파수응답/명시Haar기저/고정입력으로24조건을1e−9검산하고두화면·고정창/표/질문/키보드를확인한다. 정량mapping은W51b,실제학습/임상/비선형SNR은후속이다.

**W50 — AI01 “잡음을 줄이는 것과 덜 찍은 데이터를 복원하는 것은 어떻게 다를까?”**

- 선행 Q01·Q04·Q06. 기본은실제학습모델없는역할/평가대리모형이다. N64/FOV64mm의Q06단계원본에j32의.15작은성분을추가하고unitary Fourier의k-space에고정seed의독립Re/Im Gaussian σ0/.05/.15를더한다. Full/짝수/기존irregular마스크,identity/3tap평활/3tap선명도/1회Haar shrink(.08),획득k치환off/on의72조건이다. Q04 RNG와Q06 Fourier/Haar를수정없이재사용한다. 세관찰은잡음감소/세부변형·누락표본/사전가정·data consistency와정답오차구별이다. 실제AI나vendor를재현했다고부르지않고원전학습모형과구별한다. 독립radix FFT·필터주파수응답·명시적Haar행렬및고정잡음입력으로72조건을1e−9검산하고실제두화면·복소신호/표/고정창·키보드/문제를확인한다. 실제학습/딥러닝·임상/vendor성능·실제2D다중coil은후속으로남긴다.

**W49 — S02 “자화율로 생긴 field를 되돌리면 왜 답이 불안정해질까?”**

- 선행 S01·E02. 기본은9³/FOV90mm/10mm주기격자의두cos모드이다. χppm=.2cos(2πjx/9)+hcos[2π(jx+jy+jz)/9]+m, h0/.1/.2,m0/.1이다. B0방향z/(1,1,1)/√3,D=1/3−(k·b)²/|k|²,k0=0;fieldδB/B0도ppm으로표시한다. λ0/.01/.1에서λ0은|D|<1e−10을0으로둔최소norm역산,양수는D/(D²+λ²)의L2역산이다. 세관찰은같은field/다른χ·방향별null·정규화/mean기준이다. 각모드의독립해석field/회복계수로36조건/전체729voxel을1e−9ppm검산하고실제두화면의고정χ/field창·z0단면/표/잔차/정답·키보드를확인한다. 실제phase/field추정·background removal/noise·COSMOS통합/vendor/임상은미구현이며S02부분으로유지한다.

**W48 — E02 “파동을 잘 맞췄다고 stiffness를 항상 믿어도 될까?”**

- 선행 E01. 기본은μ4kPa/ρ1000kg/m³/f60Hz의알려진복소변위U=e^{ikx}+r e^{−ikx}이다. x0–128mm,Δx1/2/4mm,r0/.5/1,추가공간오차η0/.02/.1×exp(i2πx/8mm)의27조건이다. η는결정된coherent모형오차이며무작위noise나조직점탄성이아니다. 중앙차분D²U와μhat=−ρω²U/D²U를복소수그대로계산하고|U|<.05(전진파진폭1기준)/미소분모는보고하지않는다. 실수/허수/정답과마스크를구별하며표시창밖원래값도보존한다. 세관찰은표본간격의편향·반사만으로Helmholtz해가깨지지않음/약한위치·작은고주파오차의미분증폭이다. 독립모드별차분고유값/실수2×2소거로27조건을1e−8kPa검산하고실제두화면·곡선/표/정답을확인한다. 실제위상→변위추정/통계noise/confidence·감쇠/점탄성/이방성·2D3D/vendor/임상은남기며E02부분으로유지한다.

**W47 — E01 “MR 위상으로 파동의 변위를 읽으면 무엇을 알 수 있을까?”**

- 선행 B04·N03. 기본은 균일/등방/무한/순수탄성 매질의1D shear wave다. ρ1000kg/m³,μ1/4/9kPa,기계진동f30/60/90Hz,변위진폭10µm,스냅샷0/90/180/270°이다. x0–200mm/401표시점,변위−10…10µm고정으로파장/전파방향/주파수조건을비교한다. μ=ρc²,c=fλ의가정과단위를명시하고독립파동ODE/RK4및crest간격으로36조건을변위1e−8µm/파장1e−6mm로검산한다. 실제두화면·3관찰/키보드/문제를확인한다. MR위상encoding은W47b로분리하고반사/감쇠·실제조직점탄성·inversion/임상은미구현이다.

**W47b — E01 후속 “작은 변위를 MR 위상으로 어떻게 바꿀까?”**

- 선행 W47. 같은순수탄성μ4kPa/ρ1000kg/m³/f60Hz/λ33.333mm를고정한다. U5/10/20µm,유효y방향gradientG0/10/20mT/m,극성±,동기화0/90/180/270°의72조건이다. G(t)=pGcosωt,u_y=Ucos(kx−ωt−θ),한주기16.667ms에서φ=−γ∫Gu dt를계산한다. 공간x0–200mm/위상−1…1rad,probe x0의실제G/u시간파형(각각±20mT/m/µm)과누적위상−1…1rad를고정표시한다. 세관찰은변위진폭·G0/극성·동기화90°의적분상쇄이다. 물리gradient는유효 파형으로제공하며실제RF/imagegradient는계산하지않는다. 독립Simpson시간적분과복소MR신호ODE로72조건/전체표시곡선을1e−9rad검산하고실제두화면·표/단위/정답·키보드/초기화를확인한다. 실제배경위상/wrapping/noise·전체sequence/inversion/임상은미구현이다.

**W46 — N03 “측정한 spectrum은 어느 공간에서 온 신호일까?”**

- 선행 N02·G02. 기본은3D 직육면체 관측 가중의 공간 적분이다. 모형영역100×40×40mm, x<0의A밀도1/2ppm, x≥0의B밀도2/3ppm, 공통T2*80ms/3T/위상0이다. 선택box는x중심−20/0/20mm,폭10/20/40mm,y/z폭20mm;안가중1/밖가중ε0/.02/.1이다. 외부가중은임의의균일양의모형이며실제RF/profile/coil이아니다. G02의ideal직사각구간길이와N02의연속absorption을재사용하고부피×밀도/고정8000mm³를신호로쓴다. 세관찰은이동/경계부분용적·폭/총신호·작은외부가중과큰외부부피이다. 독립1mm³격자3D적분과복소ODE선형계로27조건을부피1e−8/신호1e−8검산하고두화면·공간도형/신호표/곡선·키보드/문제를확인한다. PRESS/STEAM교차면기전은원전설명과대조하되실제pulse·MRSI/SRF·shimming/억제/임상정량은후속이며N03부분으로유지한다.

**W45 — N02 “Spectrum의 위치·면적·폭은 어떤 정보를 다르게 줄까?”**

- 선행 N01. 기본은 가상 단일 peak의 이상적 연속 absorption이다. B0 3T/물4.7ppm 기준, 중심2.0/2.1/2.2ppm, 초기 진폭.5/1/2, 획득 후 T2*40/80/160ms, 획득 전 이상적 refocused TE0/40/80/160ms와T2=200ms를 별도로 둔다. Peak 면적이 echo시작진폭과 같도록2Re 연속 Fourier 적분의 정규화를 명시한다. 세 관찰은 중심·같은 면적의폭/높이·TE로줄어드는면적이다. 고정Hz/ppm창과 세로0–.7,전체면적/유한창면적을 구별한다. 독립 복소ODE적분/선형계·수치구적/halfheight root로108조건을1e−8 검산하고 실제 두화면·조작/정답을 확인한다. 실제 대사물/NAA·Cho·Cr·lactate와J결합·농도/진단은 후속이며N02부분으로유지한다.

**W44 — N01 “시간의 FID를 주파수로 나누면 무엇을 읽을까?”**

- 선행 B02·B05·F01. 가상 성분 A2ppm/진폭1, B3ppm/진폭.6, 물 기준4.7ppm, 공통T2*80ms의 단일 A/혼합 FID를 사용한다. B0 1.5/3T, N128/dt1ms, 표시M128/512, Hz/내림차순ppm 축이다. FID는 음의 위상, spectrum은 양의 Fourier kernel과dt초 가중을 사용하고 magnitude를0–.13 상대신호·초 고정 축으로 표시한다. 세 관찰은 복소 FID/성분·B0의Hz/ppm·zero filling/새 획득 구별이다. 직접 합을 독립 복소ODE와radix FFT/유한등비급수로1e−8 검산하고 Parseval/공통 입력을 확인한다. 실제 두 화면의16메뉴조건/축/정규화·키보드/문제를 확인한다. 실제 대사물·농도 정량/진단·localization·linewidth 심화는 후속이다.

**W43 — M04 “물/지방의 신호 비율을 PDFF라고 부르려면 무엇을 더 보정할까?”**

- 선행 C06·F02·M01·M03. 기본은T1 bias로분리한다. ρW+ρF=1,정답fat fraction0/.1/.3/.5/.9/1(기본.3),T1W1000/T1F300ms,TR20/100ms,flip3/15/30°(기본15),TE2ms/공통T2*40ms이다. C06의이상적spoiledGRE를재사용하며물/지방amplitude는이미정확히분리되어알려진다고가정한다. 원신호비F/(W+F)와알려진T1회복항을나눈분율을비교한다. 세관찰은density/신호분율·flip/TR·알려진T1교정의가정이다. 독립RF회전/이완ODE의정상상태반복으로72조건을신호1e−9/분율1e−9로검산하고실제두화면·정규화/정답을확인한다. 실제Dixon재구성·noise/B1·서로다른T2*/multipeak·임상PDFF는제외하며M04부분으로유지한다.

**W43b — M04 후속 “Echo와 지방 spectrum 가정이 다르면 분율도 달라질까?”**

- 선행 W43. T1 가중은 제거된 별도 두 성분 모형이다. 밀도 분율 0/.3/.5/1, B0 1.5/3T, TE 0/2/4/6/8/12ms, 단일 −3.4ppm 또는 Hamilton의 주어진 6peak spectrum, 공통 T2*40ms 또는 물40/지방20ms, 원신호/알려진 모형 역산을 비교한다. 물/지방 복소 신호는 이미 정확히 분리되어 주어진다고 가정하며 실제 Dixon/추정은 구현하지 않는다. 세 관찰은 감쇠 차이·지방 내부 상쇄·정답 모형 역산의 가정이다. C 계열의 음의 위상 규약과 양성자 상수를 재사용하고, 독립 복소 이완/회전 RK4로384메뉴 조건과121점 곡선을1e−8로 검산한다. 실제 두 화면·분율/신호 고정 축·순수 성분·TE0·키보드/문제를 검증한다. 실제 장비PDFF/교란 동시 추정·임상 cutoff는 남긴다.

**W42 — M03 “감쇠 곡선에서 T2*와 R2*를 추정하면 무엇을 가정할까?”**

- 선행 C03·M01. 잡음0의단일지수(A1,T2*40ms·R2*25s⁻¹)와 C03 Gaussian주파수분포(T280ms,σ0/4/8Hz)를비교한다. TE2/5/10/15/20/30/40/60ms,전체8/앞4/뒤4점에동일free-intercept log OLS를적용한다. 단일지수는추가R2′12.5s⁻¹를가정한예시이며Gaussian의비지수감쇠를항상같은상수로분해하지않는다. Curve0–80ms와T2*(ms)/R2*(s⁻¹)·범위별fit/잔차를표시한다. 세관찰은단위변환·echo범위·Gaussian폭/유효값이다. 독립시간ODE·Gaussian복소구적·Householder QR로신호1e−9/기울기1e−10/T2*상대1e−8을확인하고실제두화면·정답을대조한다. 실제noise/phase/2Dmap·철정량보정/임상cutoff는제외해M03부분구현으로유지한다.

**W41 — M02 “T1 추정값은 어떤 획득식과 입력을 전제로 할까?”**

- 선행 C04·M01. C04의 반복180→TI→90→spoil 유한TR signed신호를 재사용한다. T1300/600/1000/1800ms,A.5/1/2,TR3000/6000ms,TI50/100/200/400/700/1100/1700/2400ms,잡음0/TE0이다. fit은A≥0·T1∈[100,4000]ms의signed신호 NLLS이며유한TR식또는TR∞근사를선택한다. product는T1별최적A의1D목적함수를log-grid401점·국소golden탐색해최솟값을고른다. 세관찰은T1/A·유한TR가정·signed/magnitude부호정보다. Magnitude곡선은참고만표시하고그자체를fit하지않는다. 독립종자화ODE·다중초기값2parameter LM과목적함수/추정값을사전신호1e−9/T1 1e−4ms/목적함수1e−9로대조하고실제두화면·부호/잔차/정답을확인한다. B1/finiteRF·실제mapping sequence/Look-Locker/ECV·임상정량은제외하며M02는부분구현으로유지한다.

**W40 — M01 “밝은 T2W와 긴 T2 추정값은 어떻게 다를까?”**

- 선행 C01·C02. 완전회복/이상적SE의 한 voxel S(TE)=A exp(−TE/T2), A0.5/1/2(기본1),T220/40/80/160ms(기본80), 잡음0이다. TE10/20/40/60/80/120/160/200ms를 사용하고 fitting은전체8점 또는20/80ms 두 점을 선택한다. 선택T2W 신호의TE는20/80/160ms(기본80)다. free-intercept log OLS로 A/T2/잔차를 추정하고 각 사용점을 표시한다. 관찰은A와밝기·T2와비율·선택TE와fitting표본의 구별이다. 동일TE80에서 A1/T280과 Aexp(.5)/T2(160/3)ms가같은밝기인반례를별도제시한다. 독립SE이완ODE·Householder QR와두점비율을신호1e−10/T2 1e−7ms로검산하고실제두화면·같은신호/단위·문제를대조한다. 단일voxel의값표시이며실제2Dmap/IR/FSE stimulated echo는제외한다. Noise/Rician바닥·비단일지수는별도W40b로분리해M01전체상태에남긴다.

**W40b — M01 후속 “작은 잔차나 긴 추정 T2는 항상 조직의 T2일까?”**

- 선행 W11·W26·W40. TE10/20/40/60/80/120/160/200ms,A1고정, monoT240 또는.3exp(−TE/20)+.7exp(−TE/120)의두성분을비교한다. 복소성분별σ0/.02/.08/.2·두고정Gaussian실현(seed0x4c574d52/0x040b2026)을사용하고magnitude에free-intercept log OLS를적용한다. Echo범위는전체8/앞4/뒤4점이다. 선택seed는성능통계가아닌재현예시이며실현B의late/σ.2에서비감쇠기울기반례를제공한다. 기울기≥0이면양의T2를보고하지않고그기울기/형식상역수는기록한다. 세관찰은magnitude바닥·두성분/작은잔차·echo범위/실현변화다. 독립횡이완ODE/Householder QR·고정noise입력/기대Rayleigh바닥·전체48조건을사전신호1e−9/기울기1e−10/T2상대1e−9로확인하고실제두화면을대조한다. 실제noise추정/Rician likelihood/NLLS·임상cutoff·성분분리는제외한다.

첫 묶음 뒤에는 다음 순서에서 **선행 학습의 핵심 구현·검증이 준비된 첫 항목**을 작업 카드로 승격한다. 누락된 선행이 있으면 먼저 보충하며 순서를 바꾼 이유를 기록한다. 단순 주제명에서 바로 큰 페이지를 만들지 않고 개발 진행 절차의 카드 필수 항목을 채운다.

1. **시퀀스·임상 핵심:** C04 → C05 → G03 → Q02 → Q03 → C06 → C07 → Q04 → F01 → F02 → F03 → F04 → D01 → D02 → D03 → S01.
2. **획득·artifact 확장:** C08 → Q05 → Q06 → Q07 → A01 → A02 → A03 → A04 → A05 → A06. 앞 단계의 시연에서 발견한 artifact 설명 오류는 해당 챕터 승격 전이라도 수정한다.
3. **정량·분광·MRE·AI:** M01 → M02 → M03 → M04 → N01 → N02 → N03 → E01 → E02 → S02 → AI01 → AI03 → AI02. 벤더 비교는 원리·평가 기반 뒤에 진행한다.
4. **확장 후보:** X05 → X01 → X02 → X13 → X14를 우선 승격하고, 나머지는 위 후보 표의 선행·우선순위 및 ID 순서로 고른다. X15/X16/X17의 공통 기반·안전·QA는 필요해지는 핵심 주장에 맞춰 앞당길 수 있다. 실제 장비/implant 허용 조건을 추정하지 않는다.

## 현재 작업의 재개 메모

W79 진행 중 (2026-10-18). W78까지 완료했다. W79는 직접 정의한 gamma kernel/구간입력 계산과 독립24조건 수치/Node 시험 초안까지 구현했다. 학습HTML·실제두화면·내용통합판정은 미완료다. 다음 행동은 docs/assets/delayed-response-model.js를 사용할 학습페이지/표/퀴즈를 구현하는 것이다. [계산초안/재개지점](verification/2026-10-18/X09-physics.md). 11:55 게시 체크포인트에 진행 상태를 보존하며 마지막 예약은10월19일06:50이다.

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
| 2026-10-15 | W09 G01 계산·화면 초안·중간 기록 | FOV/N/M·점/경계 Fourier 모형·독립 convolution 검산과 초안 화면 기본 연결. [화면·통합 검증이 남은 정확한 재개 위치](verification/2026-10-15/G01-physics.md). W09 진행 중 유지 |
| 2026-10-15 | W09 G01 통합 검토 완료 | 반 칸 밀린 띠 수정, 첫 영점/원래 경계·k 표본·단위·교육 설명 보강. [독립 전 좌표·200개 실제 상태·판정](verification/2026-10-15/G01-physics.md). 다음 W10 |
| 2026-10-15 | W10 G02 구현·통합 검증 | RF 공간/주파수·두께·극성·경계 평균/적분·반례를 구현. [3,280 독립 조건·512개 실제 상태·판정](verification/2026-10-15/G02-physics.md). 다음 W11, 후속 W13/W14 승격 |
| 2026-10-15 | W11 Q01 구현·통합 검증 | 고정 seed·복소 평균·Rician/Rayleigh·정의/창/ROI를 구현. [독립 통계·564상태·실제 346만 pixel·판정](verification/2026-10-15/Q01-physics.md). 다음 W12, W15 승격 |
| 2026-10-15 | W12 B00 통합 재검토 완료 | 힘의 질량 척도·signed Ωz·L 크기·정지/초기화/비유 한계·진자 라벨을 수정. [648 독립 조건·126개 실제 상태·판정](verification/2026-10-15/B00-physics.md). 다음 W13, W16 승격 |
| 2026-10-15 | W13 C04 IR·TI·null 구현·통합 검증 | 유한TR·TI별 반복·signed/magnitude·STIR/FLAIR의 조건·0.1ms null을 구현. [독립 RK4/이분법·448상태·판정](verification/2026-10-15/C04-physics.md). 다음 W14, W17 승격 |
| 2026-10-15 | W14 C05 Echo train·ordering 구현·통합 검증 | 공통 위상의 이상적T2 가중·k 배정·복소 inverse·TEeff를 구현. [48독립FFT·이벤트·118상태·판정](verification/2026-10-15/C05-physics.md). 다음 W15, W18 승격 |
| 2026-10-15 | W15 G03 2D/3D·MPR 구현·통합 검증 | 동일3D phantom·비대칭방향표식·voxel평균·등방/비등방·정사각 물리aspect 구현. [독립적분/부피·116상태·판정](verification/2026-10-15/G03-physics.md). 다음 W16, W19 승격 |
| 2026-10-15 | W16 Q02 Receiver BW 구현·통합 검증 | whole/±/Hzpixel·sample time·signed off-res 이동·기대PSD잡음을 구현. [544독립조건·216실제상태·판정](verification/2026-10-15/Q02-physics.md). 다음W17, W20승격 |
| 2026-10-15 | W17 Q03 검사 시간 구현·통합 검증 | 독립 이벤트19,200조건·시간·2D 반복 순서를 수정/검증. [1,004실제상태·내용 판정](verification/2026-10-15/Q03-physics.md). 다음 W18, W21 승격 |
| 2026-10-15 | W18 C06 Spoiled GRE 구현·통합 검증 | 완전 spoiling·반복/정상상태·Ernst·신호/대비 구별. [독립384조건·314실제상태·판정](verification/2026-10-15/C06-physics.md). 다음 W19, W22 승격 |
| 2026-10-15 | W19 C07 EPI 구현·통합 검증 | 실제 ADC/gradient 시간과 명시적1D 중앙근사·PE 이동. [독립168조건/43,008ADC·360실제상태·판정](verification/2026-10-15/C07-physics.md). 다음 W20, W23 승격 |
| 2026-10-15 | W20 Q04 병렬 분리 구현·통합 검증 | 두위치/coil·R1/R2·합정규화·g/√R·singular·회색경계. [독립QR/통계·580실제상태·판정](verification/2026-10-15/Q04-physics.md). 다음 W21, W24 승격 |
| 2026-10-15 | W21 F01 IP/OP 독립 구현·통합 검증 | 단일peak·복소합·B0/TE/비율·감쇠/상쇄·미소벡터 표시 개선. [독립504조건·452실제상태·판정](verification/2026-10-15/F01-physics.md). 다음 W22, W25 승격 |
| 2026-10-15 | 보고서 탐색 모바일 보강 | 21개 링크를 접힌 목록으로 제공하고 현재 보고서·키보드 펼침·이동 확인. [80시험·82실제상태·표시범위](verification/2026-10-15/report-navigation.md). 챕터 물리 판정 유지, W22 계속 |
| 2026-10-15 | W22 F02 Dixon·field 구현·통합 검증 | 알려진field/잘못된적합·검증echo·교환동일성/주위상규칙 구별. [독립2,583조건·298실제상태·판정](verification/2026-10-15/F02-physics.md). 다음 W23, W26 승격 |
| 2026-10-15 | W23 F03 선택saturation 구현·통합검증 | 사각RF·spoiling/즉시읽기·B0물손실/B1반전·전체응답. [독립405조건·474실제상태·판정](verification/2026-10-15/F03-physics.md). Water excitation미구현을W27로보존. 다음W24 |
| 2026-10-15 | W24 F04 원리·실패 비교 구현·통합검증 | 재사용IR/SAT/Dixon·동일T1/field/B1세사례·지원범위/정규화·기전출처. [독립세사례·22실제상태·판정](verification/2026-10-15/F04-physics.md). 다음W25, W28승격 |
| 2026-10-15 | W25 D01 확산·b-value 구현·통합검증 | 자유Brownian/bridge·동극성lobe/180·q/b단위·동일TE정규화·기대/표본구별. [독립1,092조건/81통계·250실제상태·판정](verification/2026-10-15/D01-physics.md). 다음W26, W29승격 |
| 2026-10-15 | W26 D02 ADC·T2·잡음 구현·통합검증 | 같은D/T2반례·magnitude/log OLS·음수/실패·고정창. [독립429조건/27통계·888실제상태·판정](verification/2026-10-15/D02-physics.md). 다음W27, W30승격 |
| 2026-10-16 | W27 F03 Water excitation 구현·통합 검증 | 두 순간 RF·coherence·OP/IP·B0/각도 오차. [독립 378조건·480 실제 상태·범위 판정](verification/2026-10-15/F03-water-physics.md). 15일 착수/16일 완료, 다음 W28·W31 승격 |
| 2026-10-16 | W28 D03 신호·EPI 시간 구현·통합 검증 | 독립504조건/24,192echo·260실제상태·균일field/PI alias·고정TE/신호를 대조. [부분범위 판정](verification/2026-10-16/D03-physics.md). 공간field/움직임은 A05/A02 연계 후속. 다음W29·W32승격 |
| 2026-10-16 | W29 S01 GRE 신호/위상 구현·통합 검증 | C03재사용·독립48조건/196,608voxel·112실제상태/344,064pixel·도형불변과문턱을 대조. [판정](verification/2026-10-16/S01-physics.md). 후처리는 별도 W29b로 계속 |
| 2026-10-16 | W29b S01 phase mask/minIP 구현·통합 검증 | 독립48조건/49,152출력·112실제상태/917,504pixel·가중순서/부호/깊이를검토. 모바일grid/표너비수정후재검증. [판정](verification/2026-10-16/S01-swi-physics.md). 다음W30 |
| 2026-10-16 | W30 C08 bSSFP 구현·통합 검증 | 독립lab2TR/ODE·147조건/21,021주파수점·240실제상태·복소부호/초기·낮은flip반례. [판정](verification/2026-10-16/C08-physics.md). 다음W31·W33승격 |
| 2026-10-16 | W30b C08 대비·근사 구현·통합 검증 | 독립588조건/1,176신호/수치극한·54실제상태·같은비율장TR반례. 원래공유C08도재검증. [판정](verification/2026-10-16/C08-contrast-physics.md). 다음W31 |
| 2026-10-16 | W31 Q05 Partial Fourier 구현·통합 검증 | 독립FFT/normal반복·18조건/3,456복소표본·64실제상태/16,384pixel·위상실패/측정일치반례. [판정](verification/2026-10-16/Q05-physics.md). 다음W32·W34승격 |
| 2026-10-16 | W32 Q06 희소성·표본·L1 구현·통합 검증 | 독립기저/FFT/normal·ADMM상하한/24조건·78실제상태/14,976pixel. [유한반복범위 판정](verification/2026-10-16/Q06-physics.md). 두조합반복한도표시보존. 다음W33·W35승격 |
| 2026-10-17 | W33 Q07 SMS 구현·ID 정정·모바일 보고서 탐색 | Q07/AI와 A01/chemical shift 카드 혼동을 원래 ID에 맞게 수정. [독립368조건·96실제상태·모형 판정](verification/2026-10-17/Q07-physics.md), [전체107시험·75HTML/150상태·링크 감사](verification/2026-10-17/checkpoint-W33-navigation.md), [보고서 UI 보강](verification/2026-10-17/report-navigation.md). 다음W34·W37승격 |
| 2026-10-17 | W34 A01 FOV·aliasing 구현·통합 검증 | [독립648조건/77,760복소표본·실제160상태/19,200pixel·판정](verification/2026-10-17/A01-physics.md). 전체109시험과 링크 감사. 다음W35·W38승격 |
| 2026-10-17 | W35 A02 1D motion·순서·gating 구현 | [독립30조건·실제60상태/5,760pixel·범위 판정](verification/2026-10-17/A02-physics.md). 실제2D/호흡/ECG/navigator·DWI 보정은 남음. 다음W36·W39승격 |
| 2026-10-17 | W36 A03 ringing·M·Hann 구현 | [독립12조건/적분·FFT·PSF/실제24상태·판정](verification/2026-10-17/A03-physics.md). 필터/PSF 폭·같은 계수 보간·표본 최대값을 구별. 다음W37·W40승격 |
| 2026-10-17 | W37 A04 chemical shift 두 기전 비교 | [독립300조건·실제600상태·범위 판정](verification/2026-10-17/A04-physics.md). 기존 Q02/F01 모형은 수정 없이 재사용. 다음W38·W41승격 |
| 2026-10-17 | W38 A05 공간 field/위치 부분 모형 | [독립54조건·실제108상태/6,912pixel·판정](verification/2026-10-17/A05-physics.md). 실제2D/voxel 분포/metal/역보정은 미구현. 다음W39·W42승격 |
| 2026-10-17 | W39 A06 세 기전 부분 모형 | [독립30조건/5,760모드voxel·실제60상태·판정](verification/2026-10-17/A06-physics.md). 90°의 비식별반례와45°/v0조건을 구별. 다음W40·W43승격 |
| 2026-10-17 | W40 M01 기본 부분 모형 | [독립72조건/ODE·QR·실제144상태·판정](verification/2026-10-17/M01-physics.md). Noise floor/비단일지수는 별도W40b로 분리하고 M01부분 상태 유지 |
| 2026-10-17 | W40b M01 noise/두성분 한계 | [독립48조건/별도Rayleigh65,536표본·실제96상태·판정](verification/2026-10-17/M01-limits-physics.md). 작은잔차/유효T2/비감쇠를 구별하고 양의T2 강제보고를 막음. 다음W41·W44승격 |
| 2026-10-17 | W41 M02 IR 기본 부분 모형 | [독립48조건/ODE·LM·실제96상태·판정](verification/2026-10-17/M02-physics.md). 유한TR/부호/근사모형을 구별. 실제mapping/ECV는 미구현. 다음W42·W45승격 |
| 2026-10-17 | W42 M03 T2*/R2* 부분 모형 | [독립18조건/구적·ODE·QR·실제36상태·판정](verification/2026-10-17/M03-physics.md). 지수/비지수·단위/유효값 구별. 실제철정량/임상은 미구현. 다음W43·W46승격 |
| 2026-10-17 | W43 M04 T1 bias 부분 모형 | [독립72조건/4,320곡선·실제144상태·판정](verification/2026-10-17/M04-physics.md). 알려진 T1 항의 회복과 실제 PDFF를 구별. W43b 진행 |
| 2026-10-17 | W43b M04 echo/spectrum 부분 모형 | [독립384조건/46,464곡선·실제768상태·판정](verification/2026-10-17/M04-echo-physics.md). 지방 내부 상쇄/감쇠 차이와 실제 추정을 구별. 다음 W44 |
| 2026-10-17 | W44 N01 복소 FID/spectrum | [독립16조건/ODE·FFT·등비합·실제32상태·판정](verification/2026-10-17/N01-physics.md). Hz/ppm·표시격자/새획득을 구별. 다음 W45 |
| 2026-10-17 | W45 N02 단일 peak 부분 모형 | [독립108조건/구적·ODE·43,308곡선·실제216상태·판정](verification/2026-10-17/N02-physics.md). 같은높이/다른면적·TE/width를 구별. 다음 W46 |
| 2026-10-17 | W46 N03 관측 공간 부분 모형 | [독립27조건/432만cube·실제54상태·판정](verification/2026-10-17/N03-physics.md). 명목부피/총신호/바깥기여와 실제localization을 구별. 다음 W47 |
| 2026-10-17 | W47 E01 균일 파동 부분 모형 | [독립36조건/184만공간단계·실제72상태·판정](verification/2026-10-17/E01-physics.md). 파장/주파수/탄성률의 조건과 단위를 구별. 다음 W47b |
| 2026-10-17 | W47b E01 변위/위상 부분 모형 | [독립72조건/구적·복소ODE·실제144상태·판정](verification/2026-10-17/E01-encoding-physics.md). 무위상/무운동·극성/물성을 구별. 다음 W48 |
| 2026-10-17 | W48 E02 국소 역산 부분 모형 | [독립27조건/모드고유값·복소선형계·실제54상태·판정](verification/2026-10-17/E02-physics.md). 표본편향/공간오차·약한위치/반사·추정허수를 구별. 다음 W49 |
| 2026-10-17 | W49 S02 dipole/영점 부분 모형 | [독립36조건/104,976voxel·실제72상태·판정](verification/2026-10-17/S02-physics.md). 같은field/다른χ·방향별null·정규화/평균기준 구별. 다음 W50 |
| 2026-10-17 | W50 AI01 역할/평가 부분 모형 | [독립72조건/32,256복소값·실제144상태·판정](verification/2026-10-17/AI01-physics.md). 대리처리/학습모형·자료/정답·누락/잡음 구별. 다음 W51 |
| 2026-10-17 | W51 AI03 구조/질감 기본 | [독립24조건/7,680복소값·실제48상태](verification/2026-10-17/AI03-physics.md). 전체 오차와 쌍의 구조 반응 구별. 다음 W51b |
| 2026-10-17 | W51b AI03 공간 처리/T2 | [독립108조건/55,296신호·실제216상태](verification/2026-10-17/AI03-t2-physics.md). 공간 혼합/echo 범위·음수 불가·창 밖 원값 보존. 다음 W52 |
| 2026-10-17 | W52 AI02 공식 자료 읽기 | [6자료/8명칭 원문 대조·실제8필터 상태](verification/2026-10-17/AI02-physics.md). 역할/문서날짜/설치버전/임상근거 구별. 다음 W53 |
| 2026-10-17 | W53 AI03 반복 잡음 | [독립48조건/24,576영상·실제96상태](verification/2026-10-17/AI03-noise-physics.md). bias/분산/공분산·모집단/유한표본·SD0 구별. 다음 W54 |
| 2026-10-17 | W54 N03 주파수 분포/선폭 마감 | [54조건 독립 적분·108실제상태·통합 판정](verification/2026-10-17/N03-field-physics.md). 재개 후 버전 대조·보고서/학습 경로 연결·최종 회귀/탐색 완료. 균일 이동/공간 퍼짐·고유 T2·연속 흡수선/유한창을 구별. 다음 W55 |

| 2026-10-17 | W55 M02 R1/ECV 기본 | [독립36조건·72실제상태·판정](verification/2026-10-17/M02-ecv-physics.md). R1차/단위·평형비율·입력Hct·0/0을 구별. 전체157시험/254화면 통과. 공개 코드 링크 복구 W59를 W56보다 먼저 진행 |

| 2026-10-17 | W59 Pages 원본 코드 링크 복구 | [65보고서/91anchor·실제공개코드200·158시험/254화면](verification/2026-10-17/W59-pages-source-links.md). 본문/물리판정 유지. 다음W56 |

| 2026-10-17 | W56 G02 유한RF/profile | [독립24조건/4824위치·48실제상태·통합판정](verification/2026-10-17/G02-rf-physics.md). 명목폭/실제profile·RF끝위상·sinflip·고정축. 전체160시험/258화면통과. 다음W57 |

| 2026-10-17 | W57 M04 complex echo 계수추정 | [독립36조건/216echo·72실제상태·통합판정](verification/2026-10-17/M04-fit-physics.md). 알려진열/실수비음수·잔차0/지방0·모형불일치를구별. 전체162시험/262화면통과. 다음W58 |

| 2026-10-17 | W58 X05 농도/T1·T2* 경쟁 | [독립54조건/108실제상태·통합 검토](verification/2026-10-17/X05-physics.md). 농도/시간·가상 참조·기준 정규화·비단조 반례를 구별. 전체164시험·266화면 통과. 다음W60 |

| 2026-10-17 | W60 X01 등속/gradient 위상 | [독립18조건/3,618점·180실제상태·통합 검토](verification/2026-10-17/X01-physics.md). 0차/1차·단일 spin 위상/크기·τ²와 부호를 구별. 전체166시험·270화면 통과. 다음W61 |

| 2026-10-17 | W61 X02 유입/반복RF 포화 | [독립36조건/4,320깊이·216실제상태·통합 검토](verification/2026-10-17/X02-physics.md). RF 이력/정지 정상상태·깊이/속도/flip·TE0/고정 창을 구별. 전체168시험·274화면 통과. 다음W62 |

| 2026-10-17 | W62 X13 metHb 정성 상태 읽기 | [H01–H06 원전 대조·18실제상태·내용 판정](verification/2026-10-17/X13-physics.md). 구획/농도·저자 제안·SE/GRE범위·날짜 역산의 한계를 구별. 전체168시험·278화면 통과. 다음W63 |

| 2026-10-18 | 01:05 예약 게시 | W62까지 main a734a1b 커밋/푸시·Pages success/built. 공개7챕터/보고서28실제상태와 GitHub 원본HTTP200 확인. 다음W63 |

| 2026-10-18 | W63 X14 방향/magic angle | [독립18조건·36실제상태·통합 검토](verification/2026-10-18/X14-physics.md). 기하 인자의0/이완률 바닥·TE/유한T2·표시 격자/정확근을 구별. 전체170시험·282화면 통과. 다음W67 |

| 2026-10-18 | W67 게시/로컬 지문 대조 | [7manifest/78항목·원본 없는 재현·공개5자산](verification/2026-10-18/publication-0105-fingerprints.md). raw/blob SHA를 보존하고 CRLF 위치로 재현. 과학536입력불변/71보고서footer만 변경, 전체174시험·284화면 통과. 다음W64 |

| 2026-10-18 | W64 X01 두 속도의 복소합 | [독립 60조건·120실제상태·통합 판정](verification/2026-10-18/X01-mixture-physics.md). 평균위상/복소합·상쇄/위상미정 구별. 고정 제목 가림은 신규 화면에서 수정했고 기존 영향은 W69로 배정. 전체176시험·288화면 통과. 다음W69 |

| 2026-10-18 | W69 선택 행의 고정 제목 가림 복구 | [세 화면·36경로·원표/지표 동일](verification/2026-10-18/W69-selected-row.md). CSS만 수정, 444과학입력 불변과 기존 판정 범위를 보존. 전체176시험·290화면 통과. 다음W65 |

| 2026-10-18 | W65 X13 물질과 refocusing 조건 | [원전8주장·16실제상태·통합 판정](verification/2026-10-18/X13-refocusing-physics.md). Oxy/deoxy/용혈과 철 저장·T2/linewidth·echo 간격/TE를 구별. 전체176시험·294화면 통과. 다음W66 |

| 2026-10-18 | W66 X03 위상차와 VENC | [독립63조건·126실제상태·통합 판정](verification/2026-10-18/X03-physics.md). 공통 위상/alias/±경계를 구별, 실제 화면에서 SVG 크기와 wrap 끝점 수정/재검증. 전체178시험·298화면 통과. 다음W68 |

| 2026-10-18 | W68 X15 상수/선형 field 보정 | [독립27조건·54실제상태·통합 판정](verification/2026-10-18/X15-physics.md). 평균/퍼짐·공통 위상/크기·직선 제거를 구별. 전체180시험·302화면 통과. A06 선행 ID 정정. 다음W70 |

| 2026-10-18 | W70 X04 관측창과 프레임 간격 | [독립6조합/66프레임·132실제상태·통합 판정](verification/2026-10-18/X04-physics.md). 순간값/창평균·간격/창·표본peak를 구별. 전체182시험·306화면 통과. 다음W71 |

| 2026-10-18 | W71 X05 Signed subtraction과 정합 | [독립18조건·36실제상태/canvas·통합 판정](verification/2026-10-18/X05-subtraction-physics.md). 국소 양/음·전체보존·고정ROI/정수정렬을 구별. 전체184시험·310화면 통과. 다음W72 |

| 2026-10-18 | W72 X06 신호비와 ΔR2* 변환 | [독립9조합/54조건·108실제상태·통합 판정](verification/2026-10-18/X06-physics.md). TE/경과시간·신호비/rate·기준편향을 구별. 전체186시험·314화면 통과. 다음W76 |

| 2026-10-18 | 06:30 지연 게시/추가 예약 | [체크포인트](verification/2026-10-18/publication-0630.md). W72까지 완료/W76표현 수정 전. 실제 배포 확인 뒤 결과 기록. 추가4예약 및 보호 연장 |

| 2026-10-18 | 06:30 지연 게시 완료 | [실행 결과](verification/2026-10-18/publication-0630.md). main6adf408 Pages success/built, 공개8챕터/보고서84상태·계산자산바이트 일치. 다음W76 |

| 2026-10-18 | W76 이완 가정 표현 | [정확한 문구 치환/506바이트불변·14실제상태](verification/2026-10-18/W76-relaxation-wording.md). 계산 변경/새T1물리판정 없음. 다음W73,후속W74/W75/W77 |

| 2026-10-18 | W73 X15 곡률/기저 | [독립36조건·72실제상태·320통합상태](verification/2026-10-18/X15-basis-physics.md). 1D2차field의QR보정과실제3Dcoil을구별. 전체188시험 통과. 다음W74,후속W75/W77/W78 |

| 2026-10-18 | W74 X07 단일 구획 | [독립48조건·96실제상태·324통합상태](verification/2026-10-18/X07-physics.md). Ct/Ce·교환률/부피·입력종료/washout/보존과ECV범위를구별. 전체190시험 통과. 다음W75,후속W77/W78/W79 |

| 2026-10-18 | W75 X08 표지 도달/T1 | [독립36조건·72실제상태·328통합상태](verification/2026-10-18/X08-physics.md). 순간표지시계/도달gate·정규화/실제PLD를구별. 전체192시험 통과. 다음W77,후속W78/W79/W80 |

| 2026-10-18 | W77 X12 방향 확산/MD/FA | [독립27조건·54실제상태·332통합상태](verification/2026-10-18/X12-physics.md). 같은MD/다른방향신호·회전불변·같은FA/다른λ를구별. 작은행렬전체열표시수정후재검증. 전체194시험 통과. 다음W78,후속W79/W80/W81 |

| 2026-10-18 | W78 X12 두성분/제한fit | [독립45조건·90실제상태·336통합상태](verification/2026-10-18/X12-mixture-physics.md). 혼합뒤로그·ADC공간fit/잔차·b0미정/잔차0의비유일성을구별. 전체196시험통과. SVG오차단위문구도명확화. 다음W79,후속W80/W81/W82 |
