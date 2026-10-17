# M02 기본 · 유한 TR IR의 T1 추정 검증 (W41)

2026-10-17. **기본 signed IR 부분 모형 대상 버전 통과.** 실제mapping sequence/2Dmap·B1·noise·ECV는 미구현이다. 외부 전문가 검토 미시행.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../t1_mapping_ir.html)는 C04의180→TI→90/TE0읽기→spoil→회복 반복을 수정 없이 재사용한다. 각 TI는 별도의 반복 정상상태 조건이다. T1300/600/1000/1800ms,A.5/1/2,TR3000/6000ms,TI50/100/200/400/700/1100/1700/2400ms,잡음0/정확RF/signed기준이다. 부호 소실의 참고로 magnitude를 표시하지만fit에는 쓰지 않는다.

Signed 신호 공간 NLLS로 A≥0,T1∈[100,4000]ms를 맞춘다. 실제 유한TR식 또는TR∞ 근사를 선택한다. Product는 각T1의 최적A를 해석적으로 구하고 log grid401점의 국소 최소 구간을 golden 탐색한다. A0의 평탄 구간을 불필요한 국소 최소 후보로 늘리지 않도록 엄격한 이웃 비교를 사용한다. 전체 지정 범위에서 독립 최적화와 목적함수/추정값을 대조했다.

독립 자료는 기존 종자화 ODE의 회복→inversion→회복이고, 독립 fit은6개초기값의2매개변수 Levenberg–Marquardt(A,logT1)다. 사전 기준은 신호1e−9,T1 1e−4ms,목적함수1e−9이다. 이완/pulse의 근거와 기존 독립 검증은 [C04](../2026-10-15/C04-physics.html)에 연결하며 새 최적화는 별도로 검산했다. 숫자는 교육 조건이며 실제조직/임상 기준이 아니다.

## 독립 결과

[수집기](M02-numerical.cjs), [결과](M02-numerical.json), [독립 화면 기준](M02-display-reference.json), [ODE/LM 기준](../../../tests/helpers/t1-fit-reference.cjs), [시험](../../../tests/t1-fit.test.cjs)을 사용했다.48조건에서 최대 신호 오차9.13e−14,T1차1.62e−6ms,A차4.68e−10,목적함수 차9.58e−16으로 전 기준을 통과했다. 유한TR식은 정답A/T1을 회복하고, A만 변해도 noiseless T1은 유지됐다.

T11800/TR3000/A1의TR∞ fit은T11276.013265ms,A0.856577,RMSE0.032726이다. 실제null936.250545ms와TR∞ null1247.664925ms도 다르다. TR6000의 같은T1 자료를 근사하면1696.894304ms,RMSE0.004928로 차이가 줄지만0은 아니다. 이 예시의 근사 오차를 실제모든sequence/조직으로 일반화하지 않는다.

## 실제 브라우저 · 내용 검토

[절차](M02-browser-check.js), [결과](M02-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의96상태다. Signed/magnitude/fit SVG와8개TI/신호/잔차·추정T1/A·목적함수를 독립 기준과 대조했다. 최대 SVG y오차7.66e−6px로 허용1e−4px 이내다. 독립최적화의 허용T1차를 수치 반올림 검사에도 반영했다.

Home/End/ArrowUp·초기화·세 예시·두 문제 정답/오답·펼친 수식·모바일 표 좌우 탐색을 확인했다. JS 오류와 페이지 가로 넘침은 없었다. [데스크톱TR∞ 반례](M02-approx-1920.png), [모바일signed](M02-signed-390.png), [A2](M02-amplitude-1920.png), [모바일 표](M02-table-right-390.png)를 직접 확인했다.

반복 주기/정상상태·TI<TR·TE0읽기/spoil·signed와magnitude·A/T1·ms단위·TR항/null·log직선이아닌signed NLLS·검색범위/경계·RMSE·문제 정답을 검토했다. 하나inversion 뒤반복읽기나 실제Look-Locker/MOLLI를 구현한 것으로 해석하지 않는다.

## 버전 · 한계

[대상 SHA-256](M02-versions.json), [최종 전체 시험](W41-tests.txt), [링크 감사](checkpoint-W41-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제finiteRF/B1·불완전inversion·noise/magnitude fit·Look-Locker/MOLLI·ECV입력/임상cutoff·2Dmap은 남는다.
