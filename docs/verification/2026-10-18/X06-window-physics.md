# X06 후속 · 양의 신호 평균과 log 순서 (W92)

2026-10-18. **진행 중.** W72의 직접 정의한 ΔR(t)=40sin²(πt/20)s⁻¹(0<t<20초, 밖0), nativeR=30s⁻¹, 올바른 S0=exp(−30TE)을 쓴다. TE10/30/60ms·대칭 균일 창W2/6/12초·중심0/10/20초의27조건이며 기본TE30/W12/중심10초다. 중심0…30초/.25의121개 창을 계산하고 창이0…20초 밖으로 나가도 전체 길이W로 나눈다. 실제 획득/복소 k-space 평균·잡음/기준 오류·농도/관류 정량은 제외한다.

양의 q=S/S0=exp(−TEΔR)를 먼저 평균해 Reff=−ln⟨q⟩/TE를 구하는 것과 Rmean=⟨−ln(q)/TE⟩=⟨ΔR⟩을 비교한다. gap=Rmean−Reff다. 기존 TemporalWindow의 모양과 T2Fit.signal의 같은 지수 신호 계산을 재사용하며 공통 자산은 바꾸지 않는다. 시간t/W는 초, TE는 ms를 초로 바꾼다. 두 SVG 고정 시간0…30초·신호비0…1·rate0…42s⁻¹, 전체121×7표/다섯 지표·창 양끝/선택 행/두 문제를 대조한다.

사전 독립 기준: 0/20초에서 분리한 Gauss64/128 구적, cos형 rate의 해석적 시간 적분, 제품 Simpson512/1024 수렴. 비1e−10, rate/gap1e−8s⁻¹, 상수/빈 창/단위1e−10으로 정한다. 0≤Reff≤Rmean≤40, TE가 증가할 때 같은 창의 Reff가 증가하지 않는 성질, 상수 rate에서 두 순서가 같은 극한을 확인한다. 실제1920/390 화면의 전 조건/전체 표/곡선/선택창/키보드/예제/문제/초기화를 확인하기 전에는 완료로 표시하지 않는다.

[OSIPI osipy 공식 개발 문서](https://osipi.github.io/osipy/reference/dsc/concentration/signal_to_conc/)의 signal_to_delta_r2 관계와 ms 입력/s⁻¹ 출력을 읽었다. 코드/프로토콜/농도 계수를 가져오지 않는다. [CMU 저자 강의](https://stat.cmu.edu/~cshalizi/dst/20/lectures/13/lecture-13.html)의 Backup: Jensen’s inequality에서 −log의 볼록성과 기대값 부등식을 읽었다. 이 페이지의 균일 창 q에 적용해 Reff≤Rmean을 직접 유도한다. CMU 다른 PDF는404로 열리지 않아 본문 근거로 쓰지 않는다.

## 20:40 게시 중단 지점

순수 모형/독립 helper·두 Node 시험과 27조건/1,089곡선점 수치 검산이 통과했다. 최대 신호비 차6.90e−12, rate4.84e−10s⁻¹, gap3.48e−10s⁻¹, 해석적 평균1.65e−10s⁻¹, Gauss 수렴1.87e−13, 제품 수렴4.54e−10, 상수4.77e−13으로 사전 기준 안이다. [초안 입력](X06-window-draft-versions.json)은 완료 판정이 아니다. HTML/실제 화면·정합성 최종 판정은 미수행이다. 다음 행동: docs/signal_window_log.html을 구현하고 실제1920/390px에서27조건과 전체 표/두 곡선을 검증한다.
