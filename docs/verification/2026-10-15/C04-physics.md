# C04 IR·TI·null 검증 (W13)

2026-10-15. **대상 버전 통과 (W13 완료)**. 외부 전문가 검토 미시행.

중심 질문은 특정 조직의 종자화를 언제0으로 읽는가이다. TI·TR·예시 T1을 세 관찰로 비교한다. 기본 TI200ms(0~3000, step0.1), TR6000ms(3500~10000, step500), T1=300/1000/4000ms의 자체 교육 예시다. T1별 M0=1·완전180/90·TE0의 순간 읽기·이상적 spoiling 반복을 가정한다. 실제 IR-SE/FSE·PSIR·임상 protocol 값은 모형 밖이다.

근거: [Larson Basic Contrast](https://larsonlab.github.io/MRI-education-resources/Basic%20Contrast%20Mechanisms.html)의 inversion→TI→90 및 유한 TR 식, [MASTIR (2020)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7276363/)의 preparation/readout/reconstruction 조건을 2026-10-15 실제 열람했다. 조직 T1 숫자는 문헌 정상범위가 아닌 예시다.

독립 검산은 이전90°로 Mz=0이 된 뒤 TR−TI 회복→180°→TI 회복→90°를 별도 시간 순서 RK4로 계산한다. 같은 닫힌식을 반복하지 않는다. 사전 signed Mz 절대 오차1e−9, null의 독립 이분법 위치 절대오차1e−6ms, UI SVG좌표1e−6·회색정수 정확일치를 적용한다. 긴 TR·TI0·null 전후·TR 변화·같은 magnitude/반대 부호와 finiteTR근사차이를 확인한다.

## 수치·내용·정답 검토

대상은 commit `417aa00` 이후 로컬 파일이며 [SHA-256 목록](C04-versions.json)으로 특정한다. [독립 RK4 기준](../../../tests/helpers/ir-reference.cjs)은 회복 미분방정식을0.5ms 이하 step으로 적분하며 제품의 정상상태 식을 호출하지 않는다. null은 독립 적분 함수의45회 이분법으로 구한다. [수집기](C04-numerical.cjs)와 [결과](C04-numerical.json)를 보존했다.

| 중심 주장 | 독립 결과·관측 | 판정 |
|---|---|---|
| inversion·TI·90°의 유한 TR 종자화 | 120개 시간/조건의 signed Mz 최대 절대오차4.509e−14, 허용1e−9 | 통과 |
| 유한 TR null | 12개 TR/T1에서 null 위치 최대1.106e−10ms, 허용1e−6ms | 통과 |
| 긴 TR 근사·반례 | TR→∞이면 T1 ln2, T1=1000ms에서693.147ms. T1=4000/TI2000에서 TR10000의 자화는 음수, TR3500에서는 양수 | 통과 |
| magnitude 부호 손실 | signed −0.5/+0.5의 구성 조건에서 각각 확인. 크기는 모두0.5. 음의 자화도 0은 아니며 같은90°로 횡신호를 만듦 | 통과 |
| 표시·단위·정규화 | ms, M0=1, TE0의 즉시 읽기, signed색−1~+1·magnitude회색0~1 고정. 숫자/곡선/표/띠/문제에 동일한 모형 사용 | 통과 |
| STIR·FLAIR·모형 경계 | 짧은/긴 T1의 null을 선택하는 원리만 연결. 예시 T1을 임상 권장값으로 쓰지 않으며 같은T1의 다른 성분도 억제될 수 있음을 명시 | 통과 |

종자화는 이전90° 이후부터 TR−TI 동안 회복하므로 inversion 직전의 자화가 각 TI에 따라 다르다. 따라서 그림의 곡선은 TI별 반복 정상상태의 읽기 결과이며, 하나의 고정 초기값에서 시간만 경과한 단일 회복 궤적이라고 설명하지 않는다. 이 구별을 수식·timing·그래프 아래에 함께 표시했다. 실제 IR-SE/FSE의 refocusing/echo train 이력은 이 식에 포함되지 않는다.

기초 근거는 Larson의 IR 식과 pulse 순서다. Ma 등 MASTIR 논문의 [공식 저널 본문](https://qims.amegroups.org/article/view/43814/html)에서 data collection·TR/recovery·phase-sensitive/magnitude 절을 추가로 직접 확인했다. 그 논문의 실제 시퀀스·진단 성능을 재현한다고 주장하지 않는다. signed 색을 실제 PSIR 처리라고 부르지 않았다. 기본 계획의 TE 표현은 T1 원리 한 가지에 집중하도록 **TE0의 이상적 읽기**로 구체화했으며 TE가 달라지는 실제 IR 대비는 후속 범위로 남겼다.

## 실제 화면·수정·재검증

[브라우저 스크립트](C04-browser-check.js), [결과](C04-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/inversion_recovery.html`, 1920×1080·390×844. TR14개 × 대표 TI5개 × 선택 예시3개의 화면별210조합과 null·TR 부호반례·키보드·초기화를 합쳐 **448상태**를 확인했다.

- 각각의3곡선301좌표·현재TI/자화 위치·signed와 magnitude RGB·시간 도식의90° 위치를 독립 시간 순서 계산과 대조했다. 좌표 오차1e−6 SVG단위 이내, 표시 수치 반올림 이내, RGB정수 정확일치. 가로 넘침·페이지JS 오류0.
- TI/TR Home·End·ArrowLeft, 예시 select Home/ArrowDown/Tab, null 버튼의0.1ms 반올림과 모든 답의 Enter, reset의state/피드백 복구를 확인했다. null 근처의 잔여 신호가 정확히0은 아님을 명시했다.
- 첫 화면의 흰색 signed/magnitude 칸은 흰 배경에서 경계가 보이지 않았다. 고정된 얇은 테두리를 추가하고 전체 실제 화면 대조를 재실행했다. 계산과 창은 바꾸지 않았다.
- 직접 본 화면: [데스크톱 진입](C04-page-1920.png), [모바일 진입](C04-page-390.png), [signed 곡선](C04-curves-390.png), [null 띠](C04-null-390.png), [TR10000](C04-long-390.png), [TR3500](C04-finite-390.png), [시간 도식](C04-timing-390.png). 축·pulse·표·음수/양수 표시의 겹침과 잘림을 발견하지 않았다.

`node --test tests/*.test.cjs`: **64/64 통과**. 새2개 시험은 독립 RK4/이분법과 null전후·긴TR·반대부호/같은크기·잘못된 인자를 다룬다. 실제 화면과 통합 내용 검토는 이 결과와 별도 근거다.

## 최종 판정·범위

C04의 세 관찰·반복 정상상태·유한TR/긴TR null·시간 기준·부호/magnitude·고정 창·예시/단위·정답과 실제 readout 적용 경계를 **대상 버전 통과**로 판정한다. 외부 전문가 검토·실제 임상 영상·IR-FSE/PSIR/임상 protocol은 미시행/모형 밖이다. inversion효율·90°각·spoiling·추가pulse·TE·TR/TI/T1·정규화·색/회색 창을 바꾸면 독립 시간 순서·내용/정답과 실제 두 화면을 다시 확인한다. 다음 W14/C05.
