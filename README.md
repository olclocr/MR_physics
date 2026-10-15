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

## Curriculum and Development

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

[2026-10-14 검증 폴더](docs/verification/2026-10-14/README.md)에 수정 전 보고서, 수정 내역, 수치 검산과 문헌 근거를 보존했습니다. [웹에서 렌더링된 보고서](https://olclocr.github.io/MR_physics/verification/2026-10-14/)도 읽을 수 있습니다.

과학 회귀 시험은 `node --test tests/physics-scientific.test.cjs`로 실행합니다. 각 교육용 모델의 가정과 구현 범위는 수정 후 보고서에 명시했습니다.

[2026-10-15 C01 통합 물리 검증](docs/verification/2026-10-15/C01-physics.md)에 독립 검산·실제 화면·대상 버전·판정 범위를 기록했습니다. C01은 이 범위에서 대상 버전 통과이며 외부 전문가 검토는 미시행입니다. 로컬 개발 기록과 GitHub 게시 상태는 구별합니다.

[B02 RF 공명 검증](docs/verification/2026-10-15/B02-physics.md)에는 두 회전좌표계·RF OFF·정규화·관찰/정답·실제 데스크톱/모바일 검증을 기록했습니다.

[B03 자화·이완·SE 검증](docs/verification/2026-10-15/B03-physics.md)은 세 단계 관찰, 유한 RF 정확도 개선, 정확한 시간 조작과 별도 water/fat 모형의 독립 검산·실제 화면을 기록합니다.

## 라이선스

본 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.
