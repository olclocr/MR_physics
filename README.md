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

## Conceptual Documentation

- **[MR Physics Conceptual Guide](docs/mr_physics.md)**: A detailed summary of spin mechanics, angular momentum, precession, and classical-quantum boundaries in NMR/MRI.
- **[Effective Magnetic Field ($B_{\text{eff}}$) Guide](docs/b_eff.md)**: Explains the math and physical intuition behind the rotating reference frame, RF offset/detuning, and the effective magnetic field.

## Getting Started

No installation or build steps are required. Simply clone the repository and open any of the `.html` files in the `docs` folder with a modern web browser, or access the live link above.

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

## 물리 개념 이론 문서

- **[MR Physics 개념 가이드](docs/mr_physics.md)**: 스핀 역학, 각운동량, 세차운동 및 NMR/MRI의 고전-양자 경계 개념에 대한 종합 문답식 정리본입니다.
- **[유효 자기장 ($B_{\text{eff}}$) 가이드](docs/b_eff.md)**: 회전좌표계, RF 오프셋/디튜닝(Detuning), 그리고 유효 자기장($B_{\text{eff}}$)의 수학적 유도 및 물리적 직관을 설명합니다.

## 사용 방법

별도의 빌드나 추가 프로그램 설치가 필요하지 않습니다. 저장소를 클론한 후 `docs` 폴더 안의 `.html` 파일을 브라우저로 직접 열어 실행하거나 위의 라이브 링크를 이용해 주세요.

## 라이선스

본 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.
