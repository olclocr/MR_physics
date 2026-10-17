# M01 기본 · T2W 밝기와 T2 추정 검증 (W40)

2026-10-17. **기본 단일 지수/잡음0 부분 모형 대상 버전 통과.** M01의 noise floor/비단일 지수는 W40b에 남는다. 외부 전문가 검토 미시행. 실제 임상 T2map 정확도 판정이 아니다.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../t2_mapping_basics.html)는 완전회복/정확한90°·180°/단일T2의 한 voxel S=Aexp(−TE/T2)를 사용한다. A.5/1/2,T220/40/80/160ms, echo10/20/40/60/80/120/160/200ms, fitting전체8점 또는20/80ms 두 점이다. 밝기 표시 TE20/80/160ms는 fitting 자료 선택과 독립이다. A는 상대 시작 신호 척도이며 실제PD 정량값이 아니다.

기존 공통 transverse 이완을 수정 없이 재사용하고 free-intercept log OLS로 lnA/−1/T2를 추정한다. RMSE는 사용점의 원래 신호 단위다. 표시 신호 창0–2, 추정T2 창20–160ms는 서로 다른 고정 창이다. 두 칸은 한 voxel의 값 표현이며 k-space/2D map을 획득한 영상이 아니다.

독립 기준은 dt.01ms의 횡이완 RK4 ODE와 Householder QR, 두 점 신호비다. 모든72조합에 신호/A1e−10,T2 1e−7ms를 사전 기준으로 정했다. 같은TE80ms의 A1/T280과 Aexp(.5)/T2(160/3)ms가 같은 신호를 만드는 반례도 ODE로 확인한다.

공통 이완/SE의 기존 C01·C02 검증을 연결하고 저자 강의 [Larson, Basic Contrast Mechanisms](https://larsonlab.github.io/MRI-education-resources/Basic%20Contrast%20Mechanisms.html)의 TE/T2·신호 척도 관계와 대조했다. OLS/두 점 관계는 명시한 식에서 직접 유도했다. 표시T2·A·echo는 실제 조직/진단 기준이 아닌 교육 조건이다.

## 독립 결과

[수집기](M01-numerical.cjs), [결과](M01-numerical.json), [독립 화면 기준](M01-display-reference.json), [ODE/QR](../../../tests/helpers/t2-fit-reference.cjs), [시험](../../../tests/t2-fit.test.cjs)을 사용했다. 72조건/28,872개 곡선 표본에서 신호 오차5.11e−15,A4.67e−15,T2 1.06e−12ms,두 점 T2차9.95e−13ms였다. 모든 기준을 통과했다. 잡음0/단일 지수에서 두 점과8점의 정확 복원을 확인했으며 실제에서도 두 점이 더 낫다는 의미로 확대하지 않는다.

기본A1/T280/표시TE80의 신호는 exp(−1)=0.367879이다. A2이면0.735759가 되지만 추정T2는80ms다. 표시TE160으로 바꿔도 fitting 자료와 추정값은 유지된다. 반례 Aexp(.5)/T2≈53.333333ms는TE80에서 같은0.367879를 만들므로 한 밝기만으로T2를 하나로 정할 수 없다.

## 실제 브라우저 · 내용 검토

[절차](M01-browser-check.js), [결과](M01-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의144상태다. 신호/추정 곡선 SVG·모든echo의 사용 표시/표·T2/A 수치와 두 회색 칸288개를 독립 기준과 대조했다. 최대 SVG y오차7.75e−6px로 허용1e−4px 이내다. CSS 회색 칸이며 canvas 검사를 수행했다고 기록하지 않는다.

Home/End/ArrowUp·초기화·세 예시·문제 정답/오답·펼친 수식·모바일 표 좌우 탐색을 확인했다. JS 오류와 페이지 가로 넘침은 없었다. [데스크톱A2](M01-amplitude-1920.png), [모바일T240](M01-short-390.png), [표시TE160](M01-display-1920.png), [모바일 표](M01-table-right-390.png)를 직접 확인했다.

단위·완전회복/이상적SE·시작척도와 실제PD의 구별·log OLS의 절편·원래 단위RMSE·단일지수/잡음0·표시TE/사용echo의 독립성·한 밝기의 비식별반례·서로 다른 회색 창·문제 정답을 검토했다. 작은 잔차만으로 실제 조직 모형/임상map 정확도가 보장된다는 주장을 하지 않는다.

## 버전 · 남은 범위

[대상 SHA-256](M01-versions.json), [최종 전체 시험](W40-tests.txt), [링크 감사](checkpoint-W40-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. W40b의 complex noise/magnitude 바닥·다중 성분·fitting 실패 검토, 실제FSE/stimulated echo·불완전RF·B1·2Dmap·임상 정량은 남는다. M01 전체 완료 상태로 올리지 않는다.

## W40b 추가 기록

2026-10-17 후속 [잡음/두성분 모형](M01-limits-physics.md)의 검증을 완료했다. 위 W40의 기본 범위를 확대하지 않으며 기본 페이지에는 후속 링크를 추가했다.
