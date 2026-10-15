# 챕터별 물리적 정합성 검증 계획

최종 갱신: **2026-10-15 (Asia/Seoul)**

대상은 [학습 로드맵](learning-roadmap.md)의 모든 챕터와 확장 후보이다. 구현 후 내용의 물리적 정합성 검토를 개발 작업에 포함한다. 이 문서는 **검증할 계획과 진행 상태**이며, 표에 항목이 있다는 사실이 검증 통과를 뜻하지 않는다.

작업 선택·검증 미완료 시 재개는 [개발 진행 절차](development-workflow.md), 기존 재검토와 새 챕터의 순서는 [로드맵 실행 대기열](learning-roadmap.md)을 따른다. 이 문서는 물리 판정과 근거를 관리하며 별도의 작업 대기열을 복제하지 않는다.

## 구현 이후에 수행할 개발 단계

1. **구현 전 계획 구체화:** 해당 ID의 중심 주장, 계산 모형, 근사, 단위·좌표·부호, 참고 근거, 독립 검산 방법, 허용 오차를 적는다. 수치 검산이 없는 설명 중심 챕터는 주장·도식·반례 검토 방법을 적는다.
2. **구현 후 내용 검토:** 설명, 수식, 도식, 슬라이더, 수치, 그래프, 영상, 확인 문제의 정답을 항목별로 대조한다. 실제 물리 현상과 교육용 단순화를 구분하고, 설명이 모형의 적용 범위를 넘지 않는지 확인한다.
3. **독립 검산:** 구현 함수의 재사용이나 계산식 복제만으로 검산하지 않는다. 별도 유도, 시간 순서 계산, 독립 적분, 알려진 해석해, 불변량, 기준 데이터 등 적합한 방법을 선택한다. 대표 조건·극한·경계·반례를 비교한다.
4. **시각화 정합성 확인:** 물리적으로 확인한 같은 상태가 화면에 표시되는지 실제 브라우저에서 확인한다. 축·단위·범례·위상·타이밍·밝기 정규화와 조작 후 동기화를 점검한다. 화면이 보기 좋다는 이유만으로 물리 검토를 대체하지 않는다.
5. **문제 수정과 재검증:** 발견 사항을 기록하고 내용·계산·화면 중 원인을 수정한다. 해당 문제의 재현 조건을 다시 확인하고, 계산 변경의 영향을 받는 기존 챕터도 검산한다.
6. **판정과 기록:** 대상 버전, 수행 범위, 근거, 오차·판정, 남은 제한을 검증 기록에 남긴다. 이 문서의 상태와 로드맵의 다음 작업을 같은 변경에서 갱신한다.

### 진행 상태와 완료 기준

- **미착수:** 계획만 있으며 해당 챕터의 구현 후 물리 검토를 시행하지 않았다.
- **재검토 대기:** 기존 수치 시험·검토 기록은 있지만 이 문서의 내용·모형·화면 대조를 다시 확인해야 한다.
- **검토 중:** 근거 대조와 검산을 수행하고 있다.
- **수정 필요:** 검토에서 불일치나 설명 범위의 문제가 발견됐다. 수정과 재검증도 개발할 일로 남긴다.
- **대상 버전 통과:** 아래 완료 기준을 충족한 특정 파일 버전과 검토 범위에 대한 판정이다. 이후 변경까지 자동으로 통과한 것으로 보지 않는다.

완료 기준은 **중심 주장에 근거가 있고, 단위·부호·근사 범위가 일치하며, 독립 확인이 계획한 오차 기준을 충족하고, 설명·정답·시각화와 계산의 불일치가 해결된 것**이다. 생략한 현상과 검토하지 않은 범위는 기록한다. 외부 전문가 검토 여부는 별도 필드로 남기며 실제 시행하지 않았다면 완료로 표시하지 않는다.

테스트 통과, 브라우저 확인, 외부 내용 검토, 이 물리 검증 판정은 각각 별도로 기록한다. 기존 챕터의 검사 결과를 새 기준으로 소급해 통과 처리하지 않는다.

대상 버전 통과는 **기록에 명시한 주장·모드·조건**에 한정한다. 챕터 전체를 통과로 표시하려면 해당 ID의 필수 검토 항목을 모두 다뤄야 한다. 일부 모드만 검토했다면 전체 상태는 검토 중으로 두고 미검토 범위를 적는다. 외부 전문가 검토 미시행만으로 교육용 구현을 차단하지 않지만, 핵심 주장의 근거 부족이나 계산 불일치는 해결 전 통과시킬 수 없다.

### 다시 검토해야 하는 변경

계산식, 물리 모형, pulse/gradient 타이밍, 좌표·부호, 조직값, 범위·단위, 정규화, 핵심 설명·정답, 근사·적용 범위가 바뀌면 영향 항목을 재검증한다. 공통 계산 자산을 바꾸면 사용하는 챕터도 확인한다. 단순 배치·색상 수정은 표시와 데이터의 연결에 영향이 있는지 확인하고 필요한 범위만 점검한다.

## 기존 구현의 검증 계획과 진행 상태

| ID | 현재 있는 근거 | 물리 검증 진행 | 추가로 확인할 내용 |
|---|---|---|---|
| B00 | [기존 검산 기록](verification/2026-10-14/fix-validation.md), physics 시험 | 재검토 대기 | 토크·각운동량·세차 방향, 관성·축척·단위와 수치 대조. 정상 세차 비유가 양자 스핀의 실체 또는 일반적인 운동 해로 오해되지 않는지 검토 |
| B01 | [열평형 학습](spin_ensemble_equilibrium.html), [W04 통합 검증](verification/2026-10-15/B01-physics.md) | 대상 버전 통과 | 두 준위·편극·단위·정규화·확대·위상 도식·양자적 한계·정답을 근거·고정밀 Boltzmann·실제 화면으로 대조. 개념 문서 VI/VII와 대조하며 전체 심화 문서 통과로 확대하지 않음. 외부 전문가 검토 미시행 |
| B02 | [기존 RF 검산](verification/2026-10-14/fix-validation.md), [W02 통합 검증](verification/2026-10-15/B02-physics.md) | 대상 버전 통과 | 프레임·부호·단위·정규화, RF ON/OFF와 0/90/180/360°, 독립 Bloch·실제 화면 대조. 범위·버전·한계는 기록 참조. 외부 전문가 검토 미시행 |
| B03 | [기존 SE·RF 검산](verification/2026-10-14/fix-validation.md), [W03 통합 검증](verification/2026-10-15/B03-physics.md) | 대상 버전 통과 | 유한 RF/ideal pulse·RF→free 연속성·T1/T2·180° 전후·TE/TR·chemical·정규화·확인 문제를 독립 수치와 실제 화면으로 대조. 범위·버전·한계는 기록 참조. 외부 전문가 검토 미시행 |
| B04 | [기존 부호화 검산](verification/2026-10-14/fix-validation.md), [W05 통합 검증](verification/2026-10-15/B04-physics.md) | 대상 버전 통과 | gradient 면적·위상/k·단위·ADC·정규화·고정 표시 창·복소 역변환·Gy=0/격자 제한·정답을 독립 수치와 실제 화면으로 대조. 범위·버전은 기록 참조. 외부 전문가 검토 미시행 |
| B05 | `tests/kspace_inverse_fourier.test.cjs`의 독립 성질·조작 시험 | 재검토 대기 | DFT 정규화·복소수·위상·conjugate symmetry·Parseval을 확인. 단일 성분, 중심/외곽 누락, aliasing, zero filling의 설명과 재구성 결과 대조 |
| C01 | [기존 구현 검증](verification/2026-10-14/contrast-chapter.md), [W01 통합 물리 검증](verification/2026-10-15/C01-physics.md) | 대상 버전 통과 | 이상적 SE 식·근사·180°의 종자화 반전·PD/TR/TE·예시값·고정 창·표/곡선/영상·퀴즈·map 구분을 근거·독립 계산·실제 화면으로 대조. 버전·오차·한계는 기록 참조. 외부 전문가 검토 미시행 |

기존 구현의 수치·조작·화면 근거는 보존한다. C01·B02·B03은 로드맵 W01–W03, B04·B05·B00은 W05·W08·W12로 재검토를 배정했다. B01 독립 구현·검토는 W04, 누락된 보고서 참조와 회귀 기반 복구는 W00에 배정했다. **이 배정은 물리 검토를 수행한 결과가 아니며 위 상태를 바꾸지 않는다.** 실제 다음 작업은 로드맵에서 선택하고 문제가 발견되면 새 챕터보다 관련 오류 수정을 우선한다.

**2026-10-15 W00 완료:** 실제 작성된 보고서만 생성·시험 대상으로 등록하고 기존 검산의 잘못된 개별 보고서 참조와 누락 화면 링크를 정정했다. [복구 근거](verification/2026-10-15/W00-report-recovery.md). W00 자체는 챕터의 통합 물리 판정을 바꾸지 않은 보고서 기반 복구다.

**2026-10-15 W01 완료:** C01의 필수 항목을 모두 검토하고 설명 범위와 모바일 눈금을 수정·재검증했다. [근거·대상 버전·판정 범위](verification/2026-10-15/C01-physics.md). C01만 대상 버전 통과로 변경하며 다른 챕터와 외부 전문가 검토 상태는 유지한다.

## 후속 챕터별 확인 계획

아래에서 별도 상태를 표시하지 않은 행은 **미착수**이다. 해당 챕터를 구현할 때 행에 개별 상태·검증 기록 링크를 추가한다. 아직 없는 페이지의 구현 후 검토를 완료로 표시하지 않는다.

### 대비·시퀀스

| ID | 내용·모형 정합성 검토 | 독립 검산·확인할 비교 |
|---|---|---|
| C02 | **대상 버전 통과** — [W06 통합 검증](verification/2026-10-15/C02-physics.md). SE/GRE 재위상화의 차이, RF·gradient·echo 시간 기준 | isochromat 위상의 시간 순서 계산, TE에서 합성 신호, off-resonance 비교 |
| C03 | T2와 T2*의 정의, 정적 불균일과 불가역 감쇠, SE가 회복시키는 범위 | 동일 ensemble의 FID/GRE/SE 비교, 불균일 0과 T2 감쇠만 있는 경우 |
| C04 | inversion 후 자화 부호, TI null, STIR/FLAIR 조건과 magnitude 표시 | 독립 IR 자화 계산, 긴/유한 TR, null 전후 부호·표시 확인 |
| C05 | echo train·effective TE·k-space ordering, echo마다 달라지는 신호 | pulse·echo 순서 계산과 단순 참조 phantom, ordering 변경의 대비/blur 비교 |
| C06 | spoiling·GRE 정상상태·flip angle, 이상적 모형의 적용 범위 | 반복 pulse 계산과 정상상태 해 대조, flip angle 극한과 최적점 확인 |
| C07 | EPI trajectory·echo spacing·시간축, 위상 방향 왜곡의 원인 | gradient 적분으로 k 경로 재계산, 알려진 off-resonance phantom의 위치 이동 |
| C08 | balanced gradient와 bSSFP 정상상태, off-resonance banding | 반복 Bloch 계산, off-resonance sweep와 주기성, 모형별 대비의 조건 확인 |

### 공간·화질·검사 시간

| ID | 내용·모형 정합성 검토 | 독립 검산·확인할 비교 |
|---|---|---|
| G01 | FOV·획득 matrix·pixel·k-space 간격/범위의 연결, 재구성 matrix와 구별 | 격자·단위 계산, 점/경계 phantom, zero filling 전후 실제 정보 비교 |
| G02 | RF bandwidth·slice gradient·두께, slice profile·partial volume·cross-talk 가정 | slice 선택 주파수 계산, slab/경계 phantom의 공간 적분, profile 근사 확인 |
| G03 | 2D slice와 3D partition, voxel·MPR·SNR/시간 비교의 전제 | 같은 3D phantom의 두 획득 모형 비교, voxel 크기를 맞춘 재구성 확인 |
| Q01 | 복소/크기영상의 잡음 분포, SNR/CNR 정의, NEX·voxel 효과의 전제 | 독립 잡음 표본의 평균/분산, 반복 평균과 알려진 신호, noise floor 비교 |
| Q02 | Hz/pixel·전체 bandwidth·샘플링 시간의 단위, 다른 조건의 고정 여부 | bandwidth 변환·readout 계산, 잡음과 chemical shift displacement 비교 |
| Q03 | 시퀀스별 TR·phase steps·NEX·ETL·partition·gating 시간 모형 | 단순 공식과 실제 획득 이벤트 수를 독립 계산. 2D multislice·3D·불완전 echo train·overhead 경계 확인 |
| Q04 | 코일 감도·undersampling·R·g-factor 설명과 재구성 가정 | 알려진 coil phantom에서 full/undersampled 비교, 가속 1의 기준 결과·noise amplification |
| Q05 | conjugate symmetry의 조건, phase 추정, zero filling과 실제 복원 구별 | 실수/복소 phantom, 위상 변화/불일치, 독립 기준 영상과 복원 오차 |
| Q06 | sparsity·incoherent sampling·정규화, 모형 밖 정보와 처리 한계 | full-sampled 참조와 sparse/non-sparse phantom 비교, data consistency·정규화 강도별 오차 |
| Q07 | 동시 여기·slice 분리·CAIPI·leakage, 시간 계산의 가정 | 알려진 slice별 phantom·coil sensitivity로 분리 오차와 시간 이벤트 확인 |

### 지방·확산·자화율

| ID | 내용·모형 정합성 검토 | 독립 검산·확인할 비교 |
|---|---|---|
| F01 | chemical shift의 ppm/Hz 변환·B0·TE·상대 위상, single-peak 지방 근사 | 독립 water/fat 복소 벡터 합, 물/지방 단독·같은 비율·IP/OP 주기 확인 |
| F02 | Dixon 분리와 field map, multi-peak/phase ambiguity·swap 조건 | 성분과 field가 알려진 multi-echo phantom, 분리 결과·swap·T2* 영향 확인 |
| F03 | 주파수 선택 pulse·water excitation, B0/B1 불균일과 억제 실패 | 주파수/flip angle sweep의 Bloch 계산, 물/지방에 대한 excitation·saturation 확인 |
| F04 | 방법별 억제 기전·선택 조건, STIR을 지방에만 특이적인 것으로 설명하지 않기 | C04/F02/F03 검증 결과로 동일 사례 비교. 조영증강 등 비교 조건은 해당 근거 확인 |
| D01 | diffusion gradient·b-value·감쇠, monoexponential과 Brownian 모형의 범위 | gradient waveform 적분과 독립 확산 모형, b=0·확산 0·방향/강도 변화 |
| D02 | ADC fitting·T2 shine-through·noise floor·단위 | ADC가 알려진 다중 b 신호에서 추정, T2만 변경한 반례, 저신호 fitting bias |
| D03 | DWI 획득법별 distortion·가속·echo spacing·움직임 관계 | field map과 움직임이 알려진 phantom으로 C07/A05와 일관성 비교 |
| S01 | susceptibility·magnitude/phase·phase mask·minIP·blooming, 좌표/벤더 부호 | 알려진 field perturbation의 phase 계산, TE·부호·projection 변경과 합성 구조의 크기 비교 |
| S02 | field와 susceptibility의 구분, QSM 역문제·참조·비유일성 | 알려진 susceptibility phantom의 forward field와 inverse 추정, 배경장·정규화 영향 |

### Artifact

| ID | 내용·모형 정합성 검토 | 독립 검산·확인할 비교 |
|---|---|---|
| A01 | FOV 부족·undersampling·aliasing의 구분과 folding 위치 | 알려진 물체의 격자 샘플링/DFT, 예상 이동 위치와 oversampling 비교 |
| A02 | 주기/비주기 움직임·ghost 방향·gating·navigator 설명 | 획득 시점마다 움직인 phantom의 신호 합성, phase/frequency 방향과 주기 변경 |
| A03 | 유한 k-space와 ringing, zero filling·필터·해상도의 구분 | step/point phantom의 PSF·경계 진동, 획득 범위와 표시 matrix를 따로 변경 |
| A04 | frequency 방향 displacement와 OP 경계 상쇄의 구분 | Q02/F01의 단위·부호를 대조, bandwidth와 TE를 따로 바꾸는 사례 |
| A05 | susceptibility/metal/EPI의 위치 왜곡·신호 소실·저감의 전제 | field와 구조가 알려진 phantom에서 SE/GRE·TE/BW 변경, C03/C07/D03과 비교 |
| A06 | B0/B1·RF 간섭·코일 감도 원인의 구분, 보정이 해결하는 범위 | 독립 field/sensitivity/interference 모형과 uniform phantom의 결과 대조 |

### 정량·분광·MRE·AI

| ID | 내용·모형 정합성 검토 | 독립 검산·확인할 비교 |
|---|---|---|
| M01 | T2W 밝기와 T2 추정의 차이, echo·fitting·noise·다중 성분 가정 | 알려진 T2의 합성 신호를 독립 방법으로 fitting, 무잡음/저신호·다중 성분의 오차 |
| M02 | T1 mapping 획득식·fitting·ECV 입력과 단위, 측정법 의존성 | 알려진 T1의 모형별 신호와 독립 fitting, finite TR/B1·측정 조건 변화 |
| M03 | T2*와 R2* 변환·단위, 짧은 TE·noise floor·모형 범위 | 알려진 감쇠 신호의 추정값, TE 배치·신호 소실·배경 불균일 영향 |
| M04 | PDFF 정의·T1 bias·T2*·multi-peak와 단순 신호 비율의 차이 | 지방 비율이 알려진 multi-echo phantom, 각 방해 요인을 따로 추가 |
| N01 | 핵종·chemical environment·ppm·FID와 spectrum, Fourier 축의 방향 | 독립 합성 FID와 알려진 peak 주파수, B0 변경 시 Hz/ppm 축 비교 |
| N02 | peak 위치·면적·폭·TE·J-coupling, 정량/진단 해석의 전제 | 성분·농도·linewidth가 알려진 spectrum, relaxation/coupling을 따로 변경 |
| N03 | PRESS/STEAM·voxel localization·shimming·억제·오염 설명 | pulse/gradient 도식과 독립 localization 계산, 선택 voxel 밖 신호의 사례 |
| E01 | shear wave·위상/변위·stiffness, 주파수·밀도·탄성/점탄성 가정 | 알려진 매질의 파동·motion encoding 계산, 주파수를 고정/변경한 비교 |
| E02 | inversion·confidence·wave quality, stiffness 해석의 조건 | E01의 알려진 stiffness를 추정하고 파동 품질·경계·attenuation 영향 확인 |
| AI01 | denoising·undersampling 재구성·선명도 개선의 구별, 실제 데이터/교육 예시 범위 | 알려진 원본·잡음·sampling에서 결과 비교, 작은 구조·data consistency·실패 사례 |
| AI02 | 벤더 공개 설명의 제품/버전/자료 날짜, 공개되지 않은 알고리즘의 추정 구별 | 공식 기술 자료와 원문 주장 대조. 서로 다른 촬영 조건/성능 수치를 동일 조건으로 비교하지 않기 |
| AI03 | 보기 좋은 texture와 정보 보존의 구별, nonlinear reconstruction의 SNR/정량 평가 | 작은 구조가 알려진 phantom·참조 재구성, signal bias·정량 오차와 smoothing 비교 |

## 확장 후보의 검증 계획

아래 후보도 현재 물리 검증 **미착수**이다. 소주제로 분리할 때 이 ID의 확인 항목을 새 ID에 이전하고 로드맵과 이 문서를 함께 갱신한다.

| ID | 내용·모형 검토 및 독립 확인 계획 |
|---|---|
| X01 | inflow·flow void·phase·flow compensation을 기전별로 구분. 알려진 속도/경로의 spin 이동과 gradient 적분을 비교 |
| X02 | TOF의 saturation·2D/3D·느린/면내 흐름을 확인. flow phantom의 속도·slab·flip angle을 따로 변경 |
| X03 | phase contrast·VENC·velocity aliasing의 단위·부호 확인. 알려진 속도와 bipolar gradient에서 위상·유량을 독립 계산 |
| X04 | CE-MRA의 bolus·중심 k-space timing·시간 해상도 확인. 알려진 시간-농도 모형과 획득 순서를 비교 |
| X05 | 조영제 농도·relaxivity·T1/T2*·subtraction 가정 확인. 독립 농도-신호 계산, registration/표시 영향과 물리 효과 구분 |
| X06 | DSC의 신호-농도·AIF·CBF/CBV/MTT·leakage 가정 확인. 입력과 조직 반응이 알려진 perfusion 모형에서 회수값 비교 |
| X07 | DCE의 신호 변환·약동학 변수·시간/농도 단위·Ktrans 의미 확인. 알려진 입력 곡선과 독립 fitting 및 모형 불일치 사례 |
| X08 | ASL labeling·PLD·T1 decay·transit·혈류 정량의 전제 확인. 알려진 transit time/혈류를 가진 모형과 label/control 차이 비교 |
| X09 | BOLD·hemodynamic response·task/rest·통계의 연결 확인. 뇌 활동과 BOLD를 동일시하지 않는지 검토하고 알려진 합성 시계열로 분석 확인 |
| X10 | cine·gating·심장 위상·시간 해상도 확인. 박동과 움직임이 알려진 phantom에서 reconstruction phase와 temporal blur 비교 |
| X11 | LGE·PSIR·TI null·mapping의 조건 확인. 독립 IR/Bloch 계산과 M01/M02 검증을 연결, 해석 범위와 임상 기준은 별도 근거 확인 |
| X12 | tensor·FA·방향·tractography와 실제 신경 경로의 차이 확인. 알려진 tensor 및 crossing-fiber 모형으로 추정·실패 사례 비교 |
| X13 | 출혈 시기·화학 상태·구획·T1/T2/susceptibility 설명을 근거와 대조. 자기장/시퀀스에 무관한 고정 밝기 규칙으로 단정하지 않는지 검토 |
| X14 | magic angle·조직 방향·TE 의존성을 근거와 대조. 각도에 따른 모형과 시각화 비교, 적용 조직/가정 확인 |
| X15 | B0/B1·shimming·코일·gradient 성능의 단위와 역할 구별. 알려진 field/sensitivity 모형·gradient amplitude/slew 계산을 비교 |
| X16 | force/torque·SAR·발열·소음·PNS 기전을 근거와 대조. 단순 모형의 단위/범위 검산. 실제 안전 조건은 최신 공식 문서·장비/implant 조건의 적용 범위 확인 |
| X17 | QA 지표·측정법·phantom 조건 확인. 결함과 잡음이 알려진 phantom의 metric을 독립 계산하고 지표별 측정 범위 비교 |
| X18 | MT·CEST·T1rho의 기전·모형·단위를 분리해 확인. 알려진 교환/회전좌표계 모형의 독립 적분과 특수/극한 조건 비교 |
| X19 | synthetic MRI·MR fingerprinting의 forward model·dictionary·추정값 구별. 알려진 조직값의 신호를 생성하고 모형 불일치/잡음 조건에서 회수값 비교 |
| X20 | 핵종별 gyromagnetic ratio·단위·공명 주파수·검출 조건을 근거와 대조. B0별 독립 주파수 계산과 spectrum 축 확인 |
| X21 | thermometry와 전기적 특성 추정의 측정량·가정·교란 요인을 분리. 알려진 온도/특성 변화에 대한 forward model·오차 비교 |
| X22 | radial·spiral·회전 blade·stack trajectory의 k 좌표·sampling·재구성 가정 확인. 알려진 phantom에서 독립 trajectory 적분과 참조 재구성·움직임/off-resonance 비교 |

## 검증 기록의 저장 형식

구현 후 기록은 `docs/verification/<검증 날짜>/<chapter-id>-physics.md`에 저장한다. 파일을 실제로 작성한 뒤 해당 행과 로드맵에서 연결한다. 날짜는 Asia/Seoul 기준이다. 수정 전 발견 사항은 지우지 않고 수정·재검증 결과를 이어 적는다.

- 검토 시작 시 초안을 만들면 **검토 중 / 미수행 항목**을 명시한다. 예정된 보고서의 빈 파일을 통과 근거로 만들거나 없는 파일을 완료 링크로 등록하지 않는다.
- 대상 버전에는 commit과 미커밋 여부를 기록하고, 미커밋 파일은 검토 대상별 SHA-256 등으로 식별한다. 보고서 자체의 hash를 자기 내용에 넣지 않는다. 수정 뒤에는 최종 대상 파일과 재검증 근거를 갱신한다.
- 핵심 주장별로 **근거·적용 조건 / 독립 기준값·불변량 / 허용 오차 / 관측 결과 / 판정 / 화면 근거**를 연결한다. 수치 오차는 절대·상대·통계 기준을 구분하고 작은 기준값이나 단위 변화의 영향을 고려한다.
- 새 검토는 새 날짜 폴더에 기록하고 과거 기록은 보존한다. 옛 보고서의 오기·깨진 링크를 고칠 때도 변경 이유를 남기며 과거 미수행 검토를 수행한 것으로 고치지 않는다. HTML을 생성하면 실제 입력·출력·링크를 확인한다.

```text
챕터 ID / 검증 날짜 / 진행 상태:
대상 파일과 버전 (commit 또는 파일 hash; 미커밋 여부):
검토할 중심 주장 / 계산식 / 도식 / 퀴즈 정답:
근거 (주장별 문헌·공식 자료·자료 날짜와 적용 조건):
단위 / 좌표·부호 / 시간 기준 / 모형·근사 범위:
독립 검산 방법 / 기준 데이터 / 사전에 정한 허용 오차:
대표 조건 / 경계·극한 / 반례와 적용 제외 조건:
설명·수치·그래프·영상·정답 대조 결과:
발견 문제 / 재현 조건 / 수정 내용 / 재검증 결과:
시험 명령·결과 / 브라우저 화면·조작 확인:
판정 / 미검토 범위 / 남은 개발 항목:
외부 전문가 검토 여부 (미시행이면 명시):
후속 변경에서 다시 확인할 조건:
```

## 변경 기록

| 날짜 | 변경 |
|---|---|
| 2026-10-14 | 모든 챕터·확장 후보의 물리 검증 계획 등록. 기존 검산과 구현 후 내용 검토를 구별하고, 기존 페이지 재검토를 개발 대상으로 추가 |
| 2026-10-15 | 실행 대기열과 검증 작업 연결, 부분 검토의 판정 범위·재현 버전·증거 연결·과거 기록 보존 기준 보강. 기존 물리 검증 상태는 유지 |
| 2026-10-15 | W00 보고서 참조·생성·회귀 시험 복구 근거 연결. 기존 검산과 미시행 통합 재검토의 구분을 유지하며 챕터별 판정은 변경하지 않음 |
| 2026-10-15 | W01 C01 통합 물리 검증 완료. 근거·독립 시간 순서/RK4·실제 데스크톱/모바일·설명/눈금 수정 후 재검증을 기록하고 C01만 대상 버전 통과로 변경 |
| 2026-10-15 | W02 B02 RF OFF·정규화·좌표/단위·관찰/정답·모바일 표시를 보강하고 240개 독립 비교·실제 화면을 거쳐 대상 버전 통과. b_eff 고급 절 전체는 별도 범위 |
| 2026-10-15 | W03 B03 유한 RF의 오차 수정·독립 재검산, 자유 이완/SE/chemical의 시간·부호·정규화·내용·실제 조작 확인을 거쳐 대상 버전 통과. 공통 hardPulse 외의 계산은 유지하고 전체 회귀 확인 |
| 2026-10-15 | W04 B01을 독립 챕터로 구현하고 60자리 Boltzmann·고온 급수·단위근 및 실제 데스크톱/모바일로 검증. 실제 편극과 확대·위상 도식의 구별을 확인하고 대상 버전 통과 |
| 2026-10-15 | W05 B04의 gradient→k/위상→ADC→복소 역변환·단위·표시·정답을 통합 대조. 부호·속도·0 위상·고정 창·명목 표식·실제 resize 오류를 수정·재검증하고 대상 버전 통과 |

| 2026-10-15 | W06 C02 시간 순서 Bloch/독립 위상·단위·실제/유효 면적·도식·정답·실제 화면을 검토·수정·재검증. 대상 버전 통과. 외부 전문가 검토 미시행 |
