# MR Physics Visualizations

[English Version]

An interactive visualization and educational resource project for understanding Magnetic Resonance (MR) physics, classical precession analogies, and spatial encoding.

## Live Demo
Access the live simulations directly from your browser:
🔗 **[MR Physics Simulations Web Portal](https://olclocr.github.io/MR_physics/)**

## Interactive Simulations

This repository contains the following interactive simulations located in the [docs/](docs) directory:

1. **Bicycle Wheel Precession Interactive** ([bicycle_wheel_precession_interactive.html](docs/bicycle_wheel_precession_interactive.html))
   - Explores the classical physics analogy of spin precession using a spinning bicycle wheel experiencing gravitational torque.
2. **Proton Spin RF Larmor Resonance** ([proton_spin_rf_larmor_resonance.html](docs/proton_spin_rf_larmor_resonance.html))
   - Visualizes RF excitation, resonance, and spin nutation under a rotating radiofrequency magnetic field ($B_1$) matched to the Larmor frequency.
3. **Proton Spin MR Simulation** ([proton_spin_mr_simulation.html](docs/proton_spin_mr_simulation.html))
   - Demonstrates the dynamics of proton spins in static $B_0$ and RF $B_1$ magnetic fields with parameters for relaxation and coordinates.
4. **Frequency / Phase Encoding Visualization** ([frequency_phase_encoding_visualization.html](docs/frequency_phase_encoding_visualization.html))
   - Visualizes spatial encoding concepts in MRI, showing how frequency and phase encoding gradients map spins to spatial locations.
5. **K-space / Inverse Fourier Transform** ([kspace_inverse_fourier.html](docs/kspace_inverse_fourier.html))
   - Continues spatial encoding with three guided steps: inspect a complex k-space component, add spatial patterns to reconstruct an image, and compare missing-frequency effects with zero-filled reconstruction.
6. **T1W / T2W / PDW Contrast Lab** ([contrast_weighting.html](docs/contrast_weighting.html))
   - Adjust TR and TE to connect ideal spin-echo recovery and decay with a synthetic image, signal table, and guided questions. Uses a fixed display scale and separates weighting from quantitative mapping.
7. **Spin Ensemble and Thermal Equilibrium** ([spin_ensemble_equilibrium.html](docs/spin_ensemble_equilibrium.html))
   - Start here before RF: compare real spin-1/2 occupations, magnified population differences, and a separate phasor-sum teaching diagram. Explore B0 and temperature with a fixed polarization scale.

8. **SE and GRE Rephasing** ([spin_gradient_echo.html](docs/spin_gradient_echo.html))
   - Compare RF refocusing and gradient reversal with linked timing, phasors, complex signals, gradient areas, and static off-resonance examples.

9. **T2 and Static Dephasing** ([t2_t2star_dephasing.html](docs/t2_t2star_dephasing.html))
   - Separate irreversible T2 loss from continuous Gaussian static dephasing, compare FID/GRE and SE envelopes, and inspect when a single exponential T2* model applies.

## Curriculum and Development

- [Q07 · SMS, slice separation, and CAIPI](docs/sms_slice_separation.html): compare two-slice coil mixtures, spatial versus uniform sensitivity, controlled shifts, and calibration leakage. [Scope and validation](docs/verification/2026-10-17/Q07-physics.md).
- [A01 · FOV, wrap-around, and zero filling](docs/aliasing_fov.html): track point locations, reduced sampling, and unchanged information after display interpolation. [Validation](docs/verification/2026-10-17/A01-physics.md).
- [A02 · Motion, view ordering, and ideal gating](docs/motion_ghosting.html): compare samples acquired at different positions with a temporal complex-image average and count accepted/waiting slots. [Limited 1D validation](docs/verification/2026-10-17/A02-physics.md).
- [A03 · Gibbs ringing, interpolation, and Hann filtering](docs/gibbs_ringing.html): compare finite Fourier coefficients, sampled overshoot, and normalized amplitude PSF width. [Validation](docs/verification/2026-10-17/A03-physics.md).
- [A04 · Chemical shift displacement and intravoxel cancellation](docs/chemical_shift_artifacts.html): reuse Q02/F01 in explicitly separate spatial and temporal experiments. [Validation and limits](docs/verification/2026-10-17/A04-physics.md).
- [A05 · Spatial field and EPI distortion](docs/field_epi_distortion.html): reconstruct four single-frequency landmarks using their actual SE/EPI sample times, and separate displacement from unmodeled intravoxel signal loss. [Partial-model validation](docs/verification/2026-10-17/A05-physics.md).
- [A06 · B1 excitation, receive gain, and finite-RF B0 shading](docs/b0_b1_receive_shading.html): compare distinct mechanisms, matched 90° brightness, and a fixed-gain 45° counterexample. [Partial-model validation](docs/verification/2026-10-17/A06-physics.md).
- [M01 basics · T2-weighted brightness and T2 fitting](docs/t2_mapping_basics.html): separate initial signal, display TE, fitting echoes, and a noiseless log-OLS T2 estimate. [Basic-model validation](docs/verification/2026-10-17/M01-physics.md); noise/model limits are implemented in the separate follow-up below.
- [M01 limits · Magnitude noise and biexponential fitting](docs/t2_mapping_limits.html): compare fixed complex-noise realizations, echo ranges, effective T2, and nondecaying fits. [Validation](docs/verification/2026-10-17/M01-limits-physics.md).
- [M02 basics · Finite-TR IR and T1 fitting](docs/t1_mapping_ir.html): fit signed IR data with explicit recovery assumptions and compare the infinite-TR approximation. [Partial-model validation](docs/verification/2026-10-17/M02-physics.md).
- [AI03 noise · Repeat variance and bias](docs/reconstruction_noise_ensemble.html): compares 512-repeat means, variances and neighbour covariance for declared linear/nonlinear proxies; preserves bias and undefined zero-SD ratios. [Partial-model validation](docs/verification/2026-10-17/AI03-noise-physics.md).
- [AI02 · Reading vendor AI reconstruction claims](docs/vendor_ai_reading.html): separates eight product names by roles, source dates, document types and unverified installed versions; makes no clinical ranking. [Source and content review](docs/verification/2026-10-17/AI02-physics.md).
- [AI03 quantitative example · Processing and T2](docs/processed_t2_mapping.html): applies the same declared processor to each noiseless echo and compares spatial mixing, echo selection and invalid signed fits. [Partial-model validation](docs/verification/2026-10-17/AI03-t2-physics.md).
- [AI03 basics · Small structures and texture](docs/structure_texture_evaluation.html): compares paired known-feature responses with overall complex error using declared proxies; no trained AI or clinical detection claims. [Partial-model validation](docs/verification/2026-10-17/AI03-physics.md).
- [AI01 basics · Reconstruction roles and data consistency](docs/reconstruction_roles.html): compares declared mathematical proxies on known noisy and undersampled complex data; contains no trained AI/vendor model. [Partial-model validation](docs/verification/2026-10-17/AI01-physics.md).
- [S02 basics · Dipole field and missing susceptibility components](docs/qsm_dipole_inverse.html): demonstrates equal fields from different periodic susceptibility maps, orientation-dependent nulls and a declared L2 inverse. [Partial-model validation](docs/verification/2026-10-17/S02-physics.md).
- [E02 basics · Local inversion, sampling and spatial error](docs/mre_inversion_limits.html): compares complex modulus estimates with a fixed known elastic material and explicit exclusion rules. [Partial-model validation](docs/verification/2026-10-17/E02-physics.md).
- [E01 follow-up · Motion encoding and MR phase](docs/mre_motion_encoding.html): integrates a prescribed effective gradient against known transverse displacement, separating polarity and synchronization from material properties. [Partial-model validation](docs/verification/2026-10-17/E01-encoding-physics.md).
- [E01 basics · Shear waves and wavelength](docs/mre_shear_wave.html): distinguishes frequency-dependent wavelength from a known uniform elastic modulus. [Partial-model validation](docs/verification/2026-10-17/E01-physics.md).
- [X01 follow-up · Acceleration and second gradient moment](docs/gradient_second_moment.html): compares first-moment and second-moment nulling for a prescribed uniformly accelerated single spin at one observation endpoint. [Conditional-model validation](docs/verification/2026-10-18/X01-acceleration-physics.md).
- [X01 follow-up · First gradient moment and constant-velocity phase](docs/gradient_first_moment.html): compares zero area with zero first moment at the same observation endpoint, separating phase correction from preserved single-spin magnitude. [Conditional-model validation](docs/verification/2026-10-18/X01-compensation-physics.md).
- [X01 follow-up · Two-velocity complex signal mixing](docs/flow_velocity_mixture.html): contrasts weighted complex sums with sums of magnitudes, preserving cancellation, undefined phase, and unit single-population limits. [Conditional-model validation](docs/verification/2026-10-18/X01-mixture-physics.md).
- [X03 basics · Phase difference and VENC](docs/phase_contrast_venc.html): compares common-phase cancellation, single-velocity aliasing, and the shared ±π boundary using two symmetric encodings. [Conditional-model validation](docs/verification/2026-10-18/X03-physics.md).
- [X15 follow-up · Curvature and correction basis](docs/polynomial_field_basis.html): compares residual curvature after linear projection with a basis that contains a known quadratic field. One-dimensional educational projection, separate from scanner coil settings. [Validation scope](docs/verification/2026-10-18/X15-basis-physics.md).
- [X15 basics · Constant and linear field correction](docs/linear_field_correction.html): distinguishes mean frequency, spatial spread, and coherent signal after ideal projection of a known one-dimensional field. [Conditional-model validation](docs/verification/2026-10-18/X15-physics.md).
- [X04 basics · Temporal window and frame spacing](docs/temporal_window_bolus.html): contrasts instantaneous signal, uniform window averages, and sampled peaks in a defined time curve. [Conditional-model validation](docs/verification/2026-10-18/X04-physics.md).
- [X05 follow-up · Signed subtraction and alignment](docs/signed_subtraction_alignment.html): separates true signal changes from between-image integer translations, with signed boundaries, fixed-ROI readings, and global integrals. [Conditional-model validation](docs/verification/2026-10-18/X05-subtraction-physics.md).
- [X10 basics · Periodic motion and observation window](docs/periodic_motion_window.html): compares instantaneous and uniformly averaged positive 1D profiles, with known motion, phase-dependent spread, and explicit limits relative to MR reconstruction. [Conditional-model validation](docs/verification/2026-10-18/X10-physics.md).
- [X16 follow-up · Fixed and reversible induced dipoles](docs/induced_dipole_energy.html): compares prescribed moment responses, force, and effective mechanical potential through the work integral, including the linear response factor of one half. [Conditional-model validation](docs/verification/2026-10-18/X16-induced-physics.md).
- [X16 basics · Fixed magnetic dipole force and torque](docs/magnetic_dipole_force_torque.html): separates a specified x-force from directional torque through field strength, spatial gradient, and orientation. No device or implant safety decision. [Conditional-model validation](docs/verification/2026-10-18/X16-physics.md).
- [X17 follow-up · Rigid motion and preserved distances](docs/phantom_rigid_distance.html): rotates and translates known points to separate individual displacement from pairwise length and anisotropic pixel-coordinate differences. [Conditional-model validation](docs/verification/2026-10-18/X17-rigid-physics.md).
- [X17 basics · Known grid and image distances](docs/phantom_grid_distance.html): compares exact reference points with a defined spatial warp and converts fractional pixel coordinates using separate row/column spacing. No scanner QA acceptance decision. [Validation scope](docs/verification/2026-10-18/X17-physics.md).
- [X09 follow-up · Overlapping delayed responses](docs/response_overlap.html): shifts and weights the existing causal response to compare known input timing with component curves and their sum. [Conditional-model validation](docs/verification/2026-10-18/X09-overlap-physics.md).
- [X09 basics · Input and delayed response](docs/delayed_response_kernel.html): separates a known input from a directly defined causal convolution, with fixed axes, an independent integration reference, and explicit limits of interpretation. [Verification status](docs/verification/2026-10-18/X09-physics.md).
- [X12 follow-up · Two-component signals and a single tensor curve](docs/diffusion_tensor_mixture.html): compares a positive Gaussian mixture with a restricted least-squares tensor form in apparent-ADC space, including undefined b0 values and nonunique zero residuals. [Validation scope](docs/verification/2026-10-18/X12-mixture-physics.md).
- [X12 basics · Directional diffusion and MD/FA](docs/diffusion_tensor_direction.html): compares known positive tensors with equal mean diffusion, rotation invariance, and ambiguity of scalar shape summaries. [Validation scope](docs/verification/2026-10-18/X12-physics.md).
- [X08 follow-up · Finite release and arrival/T1 contrast](docs/label_train_arrival.html): holds total initial contrast at one, sums packet recovery from each release time, and separates arrival fraction from remaining contrast. [Bounded-model validation](docs/verification/2026-10-18/X08-train-physics.md).
- [X08 basics · Label arrival and T1 decay](docs/label_arrival_decay.html): separates transport, recovery from instantaneous labeling time, and observation of a retained packet. Separate from finite PCASL timing and flow quantification. [Validation scope](docs/verification/2026-10-18/X08-physics.md).
- [X07 basics · Single compartment input and washout](docs/compartment_input_washout.html): separates prescribed plasma input, tissue/EES volume concentration, transfer and efflux rates in a known one-minute input model. [Validation scope](docs/verification/2026-10-18/X07-physics.md).
- [X06 basics · Signal ratio and ΔR2* conversion](docs/dsc_signal_rate.html): distinguishes echo time, dynamic time, and baseline-input bias in a positive monoexponential rate model. [Conditional-model validation](docs/verification/2026-10-18/X06-physics.md).
- [X14 basics · Orientation and magic angle](docs/magic_angle_orientation.html): separates the angular factor from a defined finite R2 floor and compares orientation with TE in a controlled decay model. [Conditional-model validation](docs/verification/2026-10-18/X14-physics.md).
- [X13 basics · Reading methemoglobin states](docs/hemorrhage_state_reading.html): compares compartment/concentration conditions in qualitative spin-echo evidence, keeping author proposals, GRE scope, and timing inference distinct. [Claim review](docs/verification/2026-10-17/X13-physics.md).
- [X13 follow-up · Blood products and refocusing limits](docs/blood_refocusing_limits.html): distinguishes cell integrity, echo spacing, blood T2 measurements, and rat storage-iron linewidth evidence before transferring claims to GRE. [Claim review](docs/verification/2026-10-18/X13-refocusing-physics.md).
- [X02 basics · Slab inflow and repeated RF saturation](docs/inflow_rf_saturation.html): links depth and velocity to RF exposure, comparing fresh inflow and stationary spins with the same T1. [Conditional-model validation](docs/verification/2026-10-17/X02-physics.md).
- [X01 basics · Constant velocity and bipolar gradient phase](docs/flow_gradient_phase.html): compares stationary and moving spin trajectories, gradient moments, phase sign, and preserved single-spin magnitude. [Conditional-model validation](docs/verification/2026-10-17/X01-physics.md).
- [X05 basics · Concentration and T1/T2* competition](docs/contrast_concentration_competition.html): compares two relaxation effects in the same ideal spoiled GRE and shows when a shorter T1 still gives less signal. Educational coefficients, no drug or dose prescription. [Model validation](docs/verification/2026-10-17/X05-physics.md).
- [M04 follow-up · Complex echo water-fat coefficient fitting](docs/complex_echo_water_fat_fit.html): estimates two nonnegative coefficients from summed echoes with known field and basis functions, testing mismatched assumptions and absent-fat residuals. [Conditional-model validation](docs/verification/2026-10-17/M04-fit-physics.md).
- [G02 follow-up · Finite RF and slice profiles](docs/finite_rf_slice_profile.html): compares prescribed finite sinc-pulse Bloch responses with nominal slice width, retaining pulse-end phase and flip-angle limits. [Partial-model validation](docs/verification/2026-10-17/G02-rf-physics.md).
- [M02 follow-up · R1 changes and ECV partition](docs/ecv_r1_partition.html): links a declared equilibrium compartment model to R1 differences, hematocrit input and an undefined zero-change ratio. [Partial-model validation](docs/verification/2026-10-17/M02-ecv-physics.md).
- [N03 follow-up · Intravoxel field distribution and linewidth](docs/mrs_field_linewidth.html): separates a uniform frequency shift from spatial dephasing, linewidth and peak height at fixed normalized area. [Partial-model validation](docs/verification/2026-10-17/N03-field-physics.md).
- [N03 basics · Observation volume and spectral mixing](docs/mrs_observation_volume.html): integrates a prescribed three-dimensional response over two synthetic regions, including outside contributions. [Partial-model validation](docs/verification/2026-10-17/N03-physics.md).
- [N02 basics · Peak position, area, width and echo weighting](docs/spectral_peak_features.html): distinguishes equal height from equal area in a declared continuous absorption model. [Partial-model validation](docs/verification/2026-10-17/N02-physics.md).
- [N01 · Complex FID and frequency spectrum](docs/fid_spectrum.html): two synthetic components, Hz/ppm axes and zero filling of a fixed acquisition. [Model validation](docs/verification/2026-10-17/N01-physics.md).
- [M04 follow-up · Echo decay and fat spectrum](docs/pdff_echo_assumptions.html): holds density fixed while changing component decay and a prescribed six-peak spectrum. [Partial-model validation](docs/verification/2026-10-17/M04-echo-physics.md).
- [M04 basics · Density fraction and T1 bias](docs/pdff_t1_bias.html): separates signal fractions from mobile proton-density fractions under known T1 assumptions. [Partial-model validation](docs/verification/2026-10-17/M04-physics.md).
- [M03 basics · T2*, R2*, and echo range](docs/t2star_mapping.html): distinguish an exponential rate from a range-dependent summary of Gaussian dephasing. [Partial-model validation](docs/verification/2026-10-17/M03-physics.md).

- [Learning roadmap, implementation status, and future chapters](docs/learning-roadmap.md)
- [Chapter authoring and verification workflow](docs/chapter-authoring.md)
- [Per-chapter physical consistency review plan and progress](docs/physics-validation-plan.md)
- [Execution, acceptance, and resume procedure for development requests](docs/development-workflow.md)
- [Instructions for future contributors and agents](AGENTS.md)

Update the roadmap and physical review plan in the same change whenever a chapter is added, revised, split, or verified. Each implementation includes a subsequent review of its explanations, model, equations, visualizations, and quiz answers, followed by corrections and revalidation. Track physical review separately from test and browser results. Run all regression checks with `node --test tests/*.test.cjs`.

A request such as “개발 진행해” selects or resumes the first eligible work item in the roadmap, carries it through implementation and verification, and records the next step. The roadmap defines task dependencies and acceptance criteria; the execution procedure defines completion and blocker handling. Commit, push, and publication follow the user's authorization for those actions.

## Conceptual Documentation

- **[MR Physics Conceptual Guide](docs/mr_physics.md)**: A detailed summary of spin mechanics, angular momentum, precession, and classical-quantum boundaries in NMR/MRI.
- **[Effective Magnetic Field ($B_{\text{eff}}$) Guide](docs/b_eff.md)**: Explains the math and physical intuition behind the rotating reference frame, RF offset/detuning, and the effective magnetic field.

## Getting Started

No installation or build steps are required. Simply clone the repository and open any of the `.html` files in the `docs` folder with a modern web browser, or access the live link above.

## Scientific Validation

The [2026-10-14 validation record](docs/verification/2026-10-14/README.md) contains the original audit, corrections, numerical checks, and source references. Read the [rendered reports on GitHub Pages](https://olclocr.github.io/MR_physics/verification/2026-10-14/).

Run the scientific regression checks with `node --test tests/physics-scientific.test.cjs`. Educational assumptions and remaining scope limits are documented in the correction report.

The [2026-10-15 C01 physical consistency review](docs/verification/2026-10-15/C01-physics.md) records independent calculations, browser checks, and the reviewed version and scope. External expert review is still pending. These are local development records.

The [B02 RF resonance review](docs/verification/2026-10-15/B02-physics.md) covers resonance, both rotating frames, RF OFF, normalization, guided observations, and desktop/mobile verification.

The [B03 relaxation and spin-echo review](docs/verification/2026-10-15/B03-physics.md) covers the guided RF → free relaxation → SE path, finite-pulse accuracy, exact observation clocks, and the separate water/fat model.

The [B01 spin ensemble review](docs/verification/2026-10-15/B01-physics.md) covers quantum and ensemble boundaries, thermal polarization, magnification, independent 60-digit reference values, and real desktop/mobile checks.

The [B04 spatial encoding review](docs/verification/2026-10-15/B04-physics.md) covers gradient areas, signed phase and k, ADC, complex reconstruction, missing spatial information, fixed display scales, and real resize recovery.

## License

This project is licensed under the [MIT License](LICENSE).

---

[Korean Version]

MRI/NMR 물리학의 핵심 직관, 자전거 바퀴 세차운동 비유 및 공간 부호화(Spatial Encoding)를 학습하기 위한 인터랙티브 시각화 시뮬레이션 및 정리 문서 프로젝트입니다.

## 라이브 데모
웹 브라우저를 통해 실시간으로 시뮬레이션을 실행해 볼 수 있습니다:
🔗 **[MR Physics 시뮬레이션 웹 포털](https://olclocr.github.io/MR_physics/)**

## 인터랙티브 시뮬레이션 구성

[docs/](docs) 디렉토리에 포함된 주요 웹앱 시뮬레이션 목록입니다:

1. **자전거 바퀴 세차운동 시뮬레이션** ([bicycle_wheel_precession_interactive.html](docs/bicycle_wheel_precession_interactive.html))
   - 중력 토크를 받는 회전하는 자전거 바퀴를 통해 스핀의 고전적 세차운동 물리적 메커니즘을 시각화합니다.
2. **양성자 스핀 RF 라머 공명 시뮬레이션** ([proton_spin_rf_larmor_resonance.html](docs/proton_spin_rf_larmor_resonance.html))
   - 라머 주파수와 일치하는 회전 자기장($B_1$) 하에서 양성자의 RF 여기(Excitation), 공명 및 뉴테이션(Nutation) 현상을 보여줍니다.
3. **양성자 스핀 MR 시뮬레이션** ([proton_spin_mr_simulation.html](docs/proton_spin_mr_simulation.html))
   - 정자기장 $B_0$와 RF 자기장 $B_1$ 환경에서 다양한 이완 및 좌표 매개변수에 따른 양성자 스핀의 동역학을 상세히 시뮬레이션합니다.
4. **주파수 및 위상 부호화 시뮬레이션** ([frequency_phase_encoding_visualization.html](docs/frequency_phase_encoding_visualization.html))
   - MRI의 공간 부호화(Spatial Encoding) 개념을 주파수 및 위상 부호화 경사자장(Gradient) 작동 방식을 통해 인터랙티브하게 시각화합니다.
5. **K-space / 푸리에 역변환** ([kspace_inverse_fourier.html](docs/kspace_inverse_fourier.html))
   - 공간 부호화 다음 단계로, k-space 한 성분의 무늬 관찰 → 성분 합성으로 영상 복원 → 빠진 공간 주파수의 영향 비교를 안내합니다. 복소수와 역변환 식은 선택해서 펼쳐 볼 수 있습니다.
6. **T1W / T2W / PDW 영상 대비 실험실** ([contrast_weighting.html](docs/contrast_weighting.html))
   - TR·TE를 조절하며 이상적인 SE의 회복·감쇠·신호 표·합성 영상을 함께 관찰합니다. 고정 표시 창, 선행 지식, 흔한 오개념, 확인 문제와 후속 질문을 제공합니다.
7. **B01 스핀·순자화와 열평형** ([spin_ensemble_equilibrium.html](docs/spin_ensemble_equilibrium.html))
   - RF 앞에서 학습하는 기초 챕터입니다. 실제 두 준위의 작은 차이와 확대 막대, 별도 위상 합 도식을 구분하고 B0·온도를 바꾸며 편극을 비교합니다.

8. **C02 SE와 GRE 재위상화** ([spin_gradient_echo.html](docs/spin_gradient_echo.html))
   - RF 반전과 gradient reversal을 시간도식·벡터·신호로 비교하고 면적 불균형과 정적 주파수 분포의 영향을 관찰합니다.

9. **C03 T2와 T2*·정적 탈위상** ([t2_t2star_dephasing.html](docs/t2_t2star_dephasing.html))
   - 같은 T2에서 주파수 분포만 바꿔 보고, 180°가 되돌리는 정적 위상과 남는 T2 감쇠를 인자·곡선·신호로 구분합니다.

## 학습 구성과 개발 방향

- [전체 학습 챕터 · 구현 현황 · 앞으로 할 일](docs/learning-roadmap.md)
- [챕터 작성 형식과 검증·갱신 지침](docs/chapter-authoring.md)
- [각 챕터의 물리적 정합성 검증 계획과 진행 상태](docs/physics-validation-plan.md)
- [“개발 진행해” 실행·완료·중단 후 재개 절차](docs/development-workflow.md)
- [후속 기여자와 에이전트 지침](AGENTS.md)

챕터 추가·수정·분리·검증 작업에서는 같은 변경으로 로드맵과 물리 검증 계획을 갱신합니다. 구현 이후 설명·모형·수식·시각화·정답의 물리 검토와 수정·재검증을 개발 과정에 포함하고, 물리 검증 상태를 시험·브라우저 확인과 구분합니다. 전체 회귀 시험은 `node --test tests/*.test.cjs`로 실행합니다.

“개발 진행해”라고 요청하면 로드맵의 선행 조건을 충족한 첫 작업을 선택하거나 미완료 작업을 재개하여 구현·검증·기록까지 진행합니다. 작업별 순서·인수 기준은 로드맵, 완료·차단·재개 방법은 실행 절차에서 관리합니다. 커밋·푸시·게시에는 해당 행동에 대한 사용자 승인을 따릅니다.

## 물리 개념 이론 문서

- **[MR Physics 개념 가이드](docs/mr_physics.md)**: 스핀 역학, 각운동량, 세차운동 및 NMR/MRI의 고전-양자 경계 개념에 대한 종합 문답식 정리본입니다.
- **[유효 자기장 ($B_{\text{eff}}$) 가이드](docs/b_eff.md)**: 회전좌표계, RF 오프셋/디튜닝(Detuning), 그리고 유효 자기장($B_{\text{eff}}$)의 수학적 유도 및 물리적 직관을 설명합니다.

## 사용 방법

별도의 빌드나 추가 프로그램 설치가 필요하지 않습니다. 저장소를 클론한 후 `docs` 폴더 안의 `.html` 파일을 브라우저로 직접 열어 실행하거나 위의 라이브 링크를 이용해 주세요.

## 과학 검증 기록

- [W69 · 고정 제목 아래의 선택 행 표시 복구](docs/verification/2026-10-18/W69-selected-row.md): 세 기존 화면의 스크롤 표시를 수정하고 계산/물리 판정과 구별했다.

[2026-10-14 검증 폴더](docs/verification/2026-10-14/README.md)에 수정 전 보고서, 수정 내역, 수치 검산과 문헌 근거를 보존했습니다. [웹에서 렌더링된 보고서](https://olclocr.github.io/MR_physics/verification/2026-10-14/)도 읽을 수 있습니다.

과학 회귀 시험은 `node --test tests/physics-scientific.test.cjs`로 실행합니다. 각 교육용 모델의 가정과 구현 범위는 수정 후 보고서에 명시했습니다.

[2026-10-15 C01 통합 물리 검증](docs/verification/2026-10-15/C01-physics.md)에 독립 검산·실제 화면·대상 버전·판정 범위를 기록했습니다. C01은 이 범위에서 대상 버전 통과이며 외부 전문가 검토는 미시행입니다. 로컬 개발 기록과 GitHub 게시 상태는 구별합니다.

[B02 RF 공명 검증](docs/verification/2026-10-15/B02-physics.md)에는 두 회전좌표계·RF OFF·정규화·관찰/정답·실제 데스크톱/모바일 검증을 기록했습니다.

[B03 자화·이완·SE 검증](docs/verification/2026-10-15/B03-physics.md)은 세 단계 관찰, 유한 RF 정확도 개선, 정확한 시간 조작과 별도 water/fat 모형의 독립 검산·실제 화면을 기록합니다.

[B01 스핀·열평형 검증](docs/verification/2026-10-15/B01-physics.md)은 두 준위·편극·양자/ensemble 경계·확대와 위상 도식을 60자리 독립 계산·실제 데스크톱/모바일로 대조한 기록입니다.

[B04 공간 부호화 검증](docs/verification/2026-10-15/B04-physics.md)은 gradient 면적·위상/k·ADC·복소 역변환·정보 소실·고정 표시 창·실제 resize 복구를 독립 수치와 실제 화면으로 대조한 기록입니다.

## 라이선스

본 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

[C02 SE/GRE physical review · 물리 검증](docs/verification/2026-10-15/C02-physics.md): independent time-ordered/analytic comparisons and desktop/mobile controls.

[C03 T2/T2* physical review · 물리 검증](docs/verification/2026-10-15/C03-physics.md): continuous Gaussian envelopes checked by independent frequency integration and desktop/mobile controls.

[B05 k-space physical review · 물리 검증](docs/verification/2026-10-15/B05-physics.md): independent FFT checks, complex-number guidance, prediction feedback, and real canvas verification.

G01: [FOV and matrix](docs/fov_matrix_resolution.html). Acquired versus display grids, point/edge response, k-space spacing and extent. [Independent calculation, 200 real-browser states and physical review](docs/verification/2026-10-15/G01-physics.md).

G02: [Slice selection and partial volume](docs/slice_selection_partial_volume.html). RF bandwidth, gradient polarity, slice location and thickness, and normalized versus integrated compartment signal. [Independent calculation and physical review](docs/verification/2026-10-15/G02-physics.md).

Q01: [SNR, CNR and complex averaging](docs/snr_cnr_averaging.html). Fixed-seed independent quadrature noise, nested NEX comparisons and magnitude noise floor. [Independent statistics and physical review](docs/verification/2026-10-15/Q01-physics.md).

[B00 classical analogy review](docs/verification/2026-10-15/B00-physics.md): signed precession, consistent force scale, independent ring/elliptic-integral checks and explicit limits of the quantum-spin analogy.

C04: [Inversion recovery, TI and null](docs/inversion_recovery.html). Finite-TR ideal 180°/90° readout, signed magnetization versus magnitude, and STIR/FLAIR concept limits. [Independent chronological calculation and physical review](docs/verification/2026-10-15/C04-physics.md).

C05: [Echo train and k-space ordering](docs/fast_spin_echo.html). Explicit shot/echo assignments, T2-weighted complex reconstruction, and effective-TE comparison. [Independent FFT and physical review](docs/verification/2026-10-15/C05-physics.md).

G03: [2D slices, 3D partitions and MPR](docs/volume_2d_3d.html). Matched voxel geometry, physical aspect and asymmetric orientation markers in an explicit box-average phantom. [Independent spatial integration and physical review](docs/verification/2026-10-15/G03-physics.md).

Q02: [Receiver bandwidth and readout](docs/receiver_bandwidth.html). Full versus one-sided BW, Hz/pixel, ADC time, signed off-resonance displacement and expected noise at fixed geometry. [Independent kernel, units and physical review](docs/verification/2026-10-15/Q02-physics.md).

Q03: [Scan time and acquisition events](docs/scan_time.html). Explicit 2D interleaving, 3D phase-pair scheduling, ETL remainder, NEX, gating and fixed preparation. [Independent event enumeration and physical review](docs/verification/2026-10-15/Q03-physics.md).

C06: [Spoiled GRE and flip angle](docs/spoiled_gre.html). Ideal spoiling, transient versus steady state, TR and Ernst angle, fixed signal scale and signal-versus-contrast distinction. [Independent rotation, RK4 and physical review](docs/verification/2026-10-15/C06-physics.md).

C07: [EPI trajectory and echo spacing](docs/epi_trajectory.html). Timed ADC/gradient path and a declared echo-center 1D phase-direction point-response approximation. [Independent SI integration, finite kernel and physical review](docs/verification/2026-10-15/C07-physics.md).

Q04: [Parallel imaging with coil sensitivity](docs/parallel_imaging.html). Two-position real linear model, R1/R2 alias separation, singularity, g-factor and fixed-condition noise scaling. [Independent QR, DFT, Monte Carlo and physical review](docs/verification/2026-10-15/Q04-physics.md).

F01: [Chemical shift and IP/OP](docs/chemical_shift_ip_op.html). Same-voxel complex water/fat sum, single-peak frequency, B0/TE/signal-fraction comparisons and common T2* decay. [Independent RK4, units and physical review](docs/verification/2026-10-15/F01-physics.md).

F02: [Dixon complex separation and field ambiguity](docs/dixon_water_fat.html). Declared two-echo fit, held-out third echo, known versus assumed field and an equal-spacing swap counterexample. [Independent RK4, generic QR and physical review](docs/verification/2026-10-15/F02-physics.md).

F03: [Spectral fat saturation](docs/spectral_fat_saturation.html). Declared rectangular RF, net transverse spoiling, immediate imaging excitation, signed Mz and B0/B1 failure cases. Water excitation is covered in the separate two-pulse lesson below. [Independent Bloch ODE, matrix exponential and physical review](docs/verification/2026-10-15/F03-physics.md).

F04: [Fat-suppression mechanisms and failure cases](docs/fat_suppression_comparison.html). Reuses validated IR, spectral saturation and Dixon models; shows only supported error cases and keeps their different signal scales explicit. [Independent case checks and physical review](docs/verification/2026-10-15/F04-physics.md).

D01: [Diffusion gradients and b-value](docs/diffusion_b_value.html). Free 1D Brownian motion, finite rectangular PGSE lobes, q/b units, exact bridge variance and same-TE b0 normalization. [Independent integrals, covariance, seeded statistics and physical review](docs/verification/2026-10-15/D01-physics.md).

D02: [ADC fitting and T2 shine-through](docs/adc_fitting_shine_through.html). Fixed-TE single-voxel signal, complex-to-magnitude noise, declared log OLS, same-D/T2 comparison and unclipped negative estimates. [Independent ODE, QR, log-noise moments and physical review](docs/verification/2026-10-15/D02-physics.md).

F03 follow-up: [Water excitation](docs/water_excitation.html). Two instantaneous RF pulses, coherent delay, separate water/fat magnetization and B0/angle errors. [Independent time-ordered Bloch integration and physical review](docs/verification/2026-10-15/F03-water-physics.md).

D03: [DWI amplitude and EPI timing](docs/dwi_epi_conditions.html). Fixed-TE diffusion signal, declared single-shot/PI/readout-segment timing, uniform-field position prediction and PI alias ambiguity. [Independent SI schedule, Bloch integration and physical review](docs/verification/2026-10-16/D03-physics.md). Spatial distortion and motion reconstruction remain planned.

S01: [Prescribed frequency distributions, GRE magnitude and phase](docs/susceptibility_signal_phase.html). Reuses C03 Gaussian dephasing; separates mean frequency from dispersion and shows a fixed-threshold blooming example. [Independent frequency quadrature, full voxel check and physical review](docs/verification/2026-10-16/S01-physics.md). Phase masking and projection are covered in the separate follow-up below.

S01 follow-up: [Phase masks and minIP](docs/swi_mask_projection.html). Same complex volume, explicit mask powers and per-plane weighting before minimum projection; shows depth loss and a fixed geometry comparison. [Independent quadrature, repeated products, sorted minima and physical review](docs/verification/2026-10-16/S01-swi-physics.md).

C08: [Balanced SSFP and frequency response](docs/balanced_ssfp.html). Alternating instantaneous RF, retained transverse magnetization, RF-frame steady state versus startup, and explicit magnitude/complex periodicity. [Independent laboratory-frame affine exponentials, Bloch ODE and physical review](docs/verification/2026-10-16/C08-physics.md).

C08 follow-up: [bSSFP relaxation contrast and short-TR limits](docs/bssfp_contrast_limits.html). Same-T1, same-T2 and same-ratio pairs; exact shared Bloch fixed points versus a declared short-TR approximation. [Independent variable-relaxation matrix/ODE checks and physical review](docs/verification/2026-10-16/C08-contrast-physics.md).

Q05: [Partial Fourier and phase assumptions](docs/partial_fourier_phase.html). Explicit sample sets, zero/conjugate filling and a declared 128-step phase-line reconstruction; separates acquired-data agreement from complex accuracy. [Independent FFT, real normal-operator iteration and physical review](docs/verification/2026-10-16/Q05-physics.md).

Q06: [Haar sparsity, sampling and L1 reconstruction](docs/compressed_sensing_sparsity.html). Declared complex optimization, fixed masks and penalty tradeoffs; shows half-FOV ambiguity and finite-iteration status. [Independent wavelet basis, FFT, normal operator, ADMM bounds and physical review](docs/verification/2026-10-16/Q06-physics.md). Two dense cases retain an explicit iteration-limit flag.

[W81 readability record](docs/verification/2026-10-18/W81-readability.html): static whitespace edits in five lessons preserve all non-whitespace characters, scripts, model outputs, tables, and SVG data.

[W85 readability record](docs/verification/2026-10-18/W85-readability.html): static spacing in five flow, field, and time-curve lessons preserves code, non-whitespace content, and exact model/table/SVG outputs.

[W89 wording clarification](docs/verification/2026-10-18/W89-relaxation-clarity.html): clarifies the observation time and omitted relaxation in one lesson and its answer feedback, preserving numerical results and graphics.
