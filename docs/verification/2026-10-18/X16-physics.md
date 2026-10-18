# X16 기본 · 고정 자기 dipole의 힘과 torque (W86)

2026-10-18. **직접 정한 고정 점 dipole·국소 x방향 힘/torque 모형은 대상 버전 통과.** 실제 물체/재질·유도/포화 자화·3D 자석/다른 힘 성분·질량/고정/움직임·RF/시간변화장·장비/implant 안전 조건과 허용 여부는 계산하지 않았다. X16 전체와 외부 전문가 검토는 미완료다.

## 범위·단위와 사전 기준

고정 μ=10⁻³A·m², 관찰 위치 x=0, 축 위 Bz(x)=B0+Gx를 직접 정했다. B0 1/3T·G0/1T/m·+z에서 +x 쪽 θ0/45/90도의 12조건이다. 기본 B0 3/G1/θ45다. x방향 힘 성분만 계산하는 1D 위치 모형이며 공간 전체의 source-free 3D MRI 자석을 재현하지 않는다. μ 크기는 장에 따라 변하지 않는다. 방향과 위치를 지정하며 실제 회전/이동 시간은 계산하지 않는다.

기존 MRPhysics.rotate/v의 순수 벡터 회전을 재사용했다. 초기 +z의 μ를 +y축 양의 θ만큼 회전해 μ=(μsinθ,0,μcosθ)를 만든다. proton γ·자화 자유 세차/이완·RF/스핀 신호는 사용하지 않는다. 기존 수레바퀴의 중력 torque는 다른 기전이므로 재사용하지 않았다. 공통 자산은 변경하지 않았다.

U=−μ·B, Fx=−∂U/∂x=μGcosθ, τy=−∂U/∂θ=−μB0sinθ (x=0)다. 각도 미분은 rad이고 입력 도는 π/180로 변환한다. A·m²×T=J=N·m, A·m²×T/m=N이다. 지표/표는 N→mN·N·m→mN·m·J→mJ에 1000을 곱한다. 위치 그림의 상대 에너지는 J→μJ에 10⁶을 곱한다. 에너지와 torque의 차원이 같아도 물리량은 다르다.

독립 기준은 제품 모형/공통 회전을 호출하지 않고 에너지의 중앙차분 h1e−4/5e−5m 또는 rad와 μ×B의 부호를 대조했다. 별도로 중심에 둔 폐곡선 사각 전류 고리를 Lorentz 힘 선적분으로 계산하고 r×dF를 합했다. 고리 크기1/.5mm·변당32/64중점으로 재검산했다. 기준 고리는 주어진 Bz(x)를 그 고리까지 확장한 수학적 비교이며 실제 MRI의 3D 장/물체 모양·전류를 설계한 것이 아니다. 사전 오차는 힘1e−10N·torque1e−10N·m·에너지1e−12J·μnorm1e−14A·m², 수렴1e−10SI이다. 화면 6자리/표는 5.1e−7, SVG는 1e−5 viewBox 좌표 단위다.

## 근거와 내용 판정

[OpenStax 11.5](https://openstax.org/books/university-physics-volume-2/pages/11-5-force-and-torque-on-a-current-loop)의 균일장 순힘0·τ=μ×B·U=−μ·B 본문/수식을 읽었다. [FDA Benefits and Risks](https://www.fda.gov/radiation-emitting-products/mri-magnetic-resonance-imaging/benefits-and-risks)와 [Information for Professionals](https://www.fda.gov/radiation-emitting-products/mri-magnetic-resonance-imaging/information-professionals)의 현재 공개 내용을 확인했다. 정자기장의 물체/기기 이동과 다른 MR 환경 기전을 구별하는 배경으로만 쓰며 실제 안전 기준/장비·implant 조건을 이 모형으로 대신하지 않는다. 모든 수치는 직접 정한 교육 예시다.

설명·수식·단위/부호·범위·도식/표·문제 양답을 검토했다. 균일장 G0에서 Fx0이어도 θ45의 torque가 남는다. θ0에서는 torque0이지만 G1의 Fx가 남는다. θ90의 Fx0은 이 x성분 모형의 결과이고 실제 모든 방향의 힘0/안전을 뜻하지 않는다. B0만 바꿔도 Fx가 같은 것은 μ 고정의 결과이며 유도 자화 물체로 확대하지 않는다. 두 번째 문제는 θ0/90의 영점 예외를 피하도록 기본 θ45 조건을 명시했다. 물체가 회전하는 실제 궤적은 구현하지 않았다.

위치 그림은 x−20…20mm/0.4mm의 101점, 같은 θ에서 ΔU=U(x)−U(0)를 −25…25μJ에 표시한다. 각도 그림은 x=0의 U(θ), 0…180도/1도의 181점을 −3.2…3.2mJ에 표시한다. 절대 U와 상대 ΔU, 위치 미분과 각도 미분을 구별했다. 도식의 μ/장 화살표는 방향을 위한 고정 길이, Fx만 1mN당160 viewBox 단위다. 음의 τy는 θ 감소의 회전 경향이다. G는 정자기장의 공간 변화이며 dB/dt나 실제 gradient pulse의 계산이 아니다.

## 수치·실제 화면과 한계

[독립 절차](X16-numerical.cjs)·[12조건 결과](X16-numerical.json)는 위치1,212점/각도2,172점에서 통과했다. 최대 힘 차이1.47e−14N, torque1.25e−12N·m, 에너지0J, μnorm0A·m², 미분 수렴3.76e−12/고리 수렴1.79e−14SI다. 고리의 다른 힘/torque 성분이 이 비교장 안에서 0임도 확인했다.

기본 Fx=+0.707106781187mN, τy=−2.121320343560mN·m, U=−2.121320343560mJ, μx/μz=0.000707106781A·m²다. G0은 Fx0/같은 torque·에너지, θ0은 Fx1mN/τ0/U−3mJ이다. B0 1T는 같은 Fx/τ−0.707106781187mN·m/U−0.707106781187mJ이다. θ90은 Fx0/τ−3mN·m/U0이다. 부동소수점의 미소 영점은 6자리 표시에서 0으로 정리한다.

[실제 Chrome 절차](X16-browser-check.js)·[24개 상태](X16-browser-check.json)는 1920/390px에서 모든 조건의 6지표·101×4/181×3 전체 표·두 에너지 곡선/선택점·μ/장/힘 화살표와 영점 생략을 독립 자료와 대조했다. 최대 SVG 차이는4.983e−6 viewBox 좌표 단위다. 실제 글자11CSSpx 이상·720×340비율·중첩 SVG 없음, 세 예제/직교 경계·Home/End/Arrow/Enter·문제 양답/초기화·두 표의 sticky 머리/선택 행/전체 열을 확인했다. JS 오류·페이지 가로 넘침은0이다.

첫 모바일 에너지 캡처에는 빈 영역이 찍혀 통과 자료로 쓰지 않았다. 직접 그림으로 이동하고 실제 bounding box와 두 paint frame 뒤의 화면을 확인하도록 캡처 절차를 보강한 뒤 24개 상태를 다시 검증했다. 제품 계산/배치는 바꾸지 않았다. [데스크톱](X16-base-1920.png), [균일장](X16-uniform-direction-390.png), [나란한 방향](X16-aligned-direction-390.png), [모바일 에너지 두 곡선](X16-energy-390.png)을 직접 읽었다. 힘/torque 영점과 두 에너지 축이 설명/수치와 일치했다.

[대상 11개 입력](X16-versions.json)·[전체 회귀](W86-tests.txt)·[통합 탐색](checkpoint-W86-navigation.md). 실제 안전 시험·임상/외부 전문가 검토는 미시행이다.
