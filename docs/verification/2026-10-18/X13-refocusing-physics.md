# X13 후속 · 혈액 성분과 refocusing 조건 (W65)

2026-10-18. **정성 근거 읽기의 대상 버전 통과.** 혈액 시료의 이완시간과 쥐 혈종의 linewidth 분포를 구별하는 범위다. 환자 영상 밝기·산소포화도/철 농도·날짜 역산 검증은 아니다. 외부 전문가 검토 미시행.

## 사전 범위와 독립 내용 검토

중심 질문은180°가 있으면 혈액 성분의 영향도 모두 사라지는지다. 세포내 oxy/deoxyHb, deoxy 용혈액, 철 저장 분포의 네 조건과 원전/GRE 읽기의 두 모드를 제공한다. 관찰은 oxy/deoxy 차이·구획 소실의 의미·다른 물리량/획득으로의 전이다.

[독립 주장표](X13-refocusing-source-review.md)의 R01–R08에서 원전 초록·시료·자장/echo 간격·물리량·근거 한계를 확인했다. 혈액 NMR0.19–1.4T의 T2 조건 의존성과 쥐의 대칭/비대칭 T2W SE linewidth를 한 밝기표로 합치지 않는다. 세포/물 이동과 이상적 정적 refocusing의 전제를 구별하고, 접힌 적분의 rad/s·s·rad 단위와 충분 조건·도식/정답을 검토했다.

수치 이완률·자유회전·확산 계산을 추가하지 않았으므로 임의 숫자/ODE로 정성 결과를 검증했다고 하지 않는다. 정성 사실의 판정은 독립 원전 대조로 수행한다. 신규 계산을 복제하는 Node 시험도 추가하지 않았다. 기존 계산의 회귀는 별도로 실행한다.

## 실제 두 화면

[학습 페이지](../../blood_refocusing_limits.html), [근거 자료/선택](../../assets/blood-refocusing-reading.js), [수동 독립 표시 기준](X13-refocusing-display-reference.json), [Chrome 절차](X13-refocusing-browser-check.js), [결과](X13-refocusing-browser-check.json).

Chrome155.0.8059.82의1920×1080/390×844에서8조합×두화면의16상태를 확인했다. 제목/물리량/읽기/원전 링크·선택 행, 네 원전 행/선택 읽기와 막/Hb/철 저장 도식 기호 수를 독립 기준에 대조했다. GRE 모드에서도 원전 결과 열이 유지됨을 확인했다. 숫자 밝기나 정량 이완값을 만들지 않았다.

Select Home/End/ArrowUp·세 예시/초기화·Enter, 두 문제의 오답/정답 피드백, 접힌 설명/수식, 모바일 원표 가로 스크롤을 실제 수행했다. JS 오류·페이지 가로 넘침0이며 canvas stub으로 대체하지 않았다. [Deoxy 데스크톱](X13-refocusing-deoxy-1920.png), [철 저장 읽기 모바일](X13-refocusing-storage-reading-390.png), [표 오른쪽](X13-refocusing-table-right-390.png)을 직접 열어 구획/물리량·GRE 한계와 원표를 읽었다.

## 버전·통합·남은 범위

[로컬 raw SHA-256](X13-refocusing-versions.json), [전체 시험](W65-tests.txt), [전체 탐색/학습 경로](checkpoint-W65-navigation.md), [링크 감사](checkpoint-W65-link-audit.json). 기존 X13에 후속 링크만 더하고 이전 모형/정성 자료와 공유 자산은 유지한다. 이 기록은 a734a1b 이후 로컬 작업으로 다음 승인된 예약 게시에서 공개한다.

X13 전체는 부분 구현/검토 중이다. 실제 공간 혼합·field/온도·정확한 pulse열·정량 T1/T2/T2*·GRE/SWI/환자별 해석은 남았다. 출처 본문/새 근거·구획/물질/획득·정량/시간표를 추가하거나 도식/선택/정답이 바뀌면 해당 주장을 재검토한다. 게시 지문은 [W67 방법](publication-0105-fingerprints.md)과 구별하며 과거 게시 감사가 이 미게시 범위까지 확인했다는 뜻은 아니다.
