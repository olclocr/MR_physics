# G02 후속 · 유한 sinc RF와 slice profile (W56)

2026-10-17. **명시한 유한 RF 교육 모형 대상 버전 통과.** 실제 장비 pulse 설계·안전 판단이 아니다. 외부 전문가 검토 미시행. 전체 회귀·탐색 결과는 별도 기록으로 구분한다.

## 대상과 사전 기준

RF파형 sinc[4(t/T−.5)],t∈[0,T]를 사용하고 그 면적을 중심flip30/90°에 맞춘다. Duration T=2/4/8ms, Gz±5/±10mT/m의24조건이다. 기본4ms/90°/+10mT/m, 초기M=(0,0,1),M0=1,T1/T2∞,carrier offset0이다. RF와gradient는같은구간에서작용하고 끝직후자화를읽는다. Rephaser·echo·위상경로선택은없다.

Product는201개 위치z±10mm/0.1mm에서2048개중점상수field의정확한공통회전을합성한다. 시간ms/주파수Hz/B1µT,gradient mT/m×위치mm=µT,γ̄=42.57747892Hz/µT다. dM/dt=γM×B의부호를유지한다. 명목BW=4/T초와두께BW/(γ̄|G|)는참고설계척도이며실제FWHM이아니다.

독립기준은연속sinc의4096분할Simpson면적·SI주파수의경계root·8192단계Bloch RK4다. 대표조건의16384단계와비교해기준수렴도확인한다. 사전오차는각벡터성분2e−5,Mxy2e−5,두께1e−9mm,중심flip면적1e−4°,product norm1e−10이다. 시간/공간고정축·원표·정답과실제두화면을따로확인한다.

## 근거와 범위

[Larson RF Pulses](https://larsonlab.github.io/MRI-education-resources/RF%20Pulses.html)의 TBW·shaped pulse·Bloch와Fourier근사구별, [Slice Selection](https://larsonlab.github.io/MRI-education-resources/Slice%20Selection.html)의주파수/공간대응·명목두께·RF끝의미재위상화설명을직접읽었다. 해당저자의Hamming예시와이페이지의직접정의한truncated sinc를같은파형으로취급하지않는다. Small-tip Fourier를90°의계산식으로쓰지않는다. Pauly1989논문PDF열기는용량제한이었고2011재수록PubMed는초록이없어본문근거로기록하지않는다. 위직접읽은저자교육자료와공통Bloch/독립ODE를근거로사용한다.

## 독립 수치 결과

[학습 페이지](../../finite_rf_slice_profile.html), [순수 모형](../../assets/finite-slice-rf-model.js), [독립 기준](../../../tests/helpers/finite-slice-rf-reference.cjs), [시험](../../../tests/finite-slice-rf.test.cjs), [수집기](G02-rf-numerical.cjs), [수치 결과](G02-rf-numerical.json), [화면 기준](G02-rf-display-reference.json).

24조건/4824위치의 최대벡터차1.22e−6,|Mxy|차9.15e−7로 사전2e−5이내다. Product norm차8.00e−15,명목두께/SIroot차1.78e−15mm,중심면적flip차2.85e−14°다. RF amplitude와연속Simpson기준차2.29e−6µT로수집기실행전기준1e−5µT이내다. 독립8192→16384단계의최대성분차2.27e−10으로수렴기준1e−7이내이며, 공통정확회전과독립RK4의서로다른방법을대조했다.

기본4ms/90°/+10mT/m의 RF peak6.503653µT,명목BW1000Hz,명목두께2.348659mm,중심|Mxy|1/Mz0이다.8ms면3.251827µT/500Hz/1.174330mm로줄고중심자화는같다. G+5이면같은RF에서4.697319mm다.30°면peak2.167884µT,중심|Mxy|.5/Mz.866025다.90°/30°의진폭비3과중심횡자화비2를구별한다.

Gradient부호반전은|Mxy|/Mz를유지하고Mx부호를반전하며My는같다. 이결과는중심0/실제축대칭RF/추가offset0의조건에한정한다. 추가rephaser를했다고해석하지않는다. 원값은Cartesian성분으로비교하여작은횡자화의위상각불안정성도피했다.

## 실제 화면과 내용 판정

[절차](G02-rf-browser-check.js), [결과](G02-rf-browser-check.json):Chrome155.0.8059.82,1920×1080/390×844의48상태에서201행의복소/종자화,257점RF와201점profile의x/y,이상적참고경계,출력을독립기준과대조했다. 그래픽기준.002px는정규화자화2e−5×90px와SVG좌표반올림을포함해사전에정했다. 최대차1.13e−4px로통과다. 세menu선택을합한최대시간은브라우저결과에기록하며모바일폭은동일PC의viewport이고실제휴대폰CPU성능을검증한것은아니다.

Home/End/ArrowUp·4예시/초기화/Enter·두문제정답/오답·수식펼침·모바일표가로/세로탐색을확인했다. JS오류/가로넘침0이고canvas stub을사용하지않았다. [기본데스크톱](G02-rf-base-1920.png), [긴RF모바일](G02-rf-long-390.png), [표오른쪽](G02-rf-table-right-390.png)을직접열어읽었다.

중심90°가모든위치의90°를뜻하지않으며이truncated sinc에서는일부Mz가음수임을설명에명시했다. 이상적중심Mz0의미소음수는표시반올림에서−0.000000대신0.000000으로만보이며원값과계산은유지한다. 문구/표시보강뒤48상태와캡처를재검증했다.

단위/γ와γ̄·실제축RF부호/위상·gradient극성·시간원점/종료·회전순서·무이완norm보존·sinc절단/음의RF·면적flip/sinα·명목BW/폭과실제profile·고정축/공간표본·rephaser/echo미구현·두문제정답을검토했다. 본문/수식/원표/그래프는같은상태에서생성한다. 발견된추가계산오류는없다.

## 버전과 남은 범위

[SHA-256](G02-rf-versions.json), [전체 시험](W56-tests.txt), [전체 연결/화면](checkpoint-W56-navigation.md), [링크 감사](checkpoint-W56-link-audit.json). 기반commit ba0a3323254353349430c06c7e670c336259990e 이후의로컬미커밋/미게시다. G02기본에는후속링크만추가하며기존이상적부분용적계산은유지한다.

이번판정은24개메뉴의명시한무이완/단일RF/일정gradient에한정한다. 실제finiteRF의이완/교환·SLR/vendor최적설계·slice rephaser·echo·B0/B1추정·다중slice/cross-talk·환자/SAR는미검토다. G02전체는검토중으로두고기존이상적범위와새유한RF범위통과를구별한다. 파형·duration/flip/G·좌표/부호·이산화·단위/상수·축/표/정답변경시영향범위를다시확인한다.
