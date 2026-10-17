# AI03 정량 · echo별 공간 처리와 T2 추정 (W51b)

2026-10-17. **잡음 없는 1D 처리/추정 모형 대상 버전 통과.** 실제 학습 모델·임상 mapping 검증이 아니다. 외부 전문가 검토 미시행.

## 대상과 사전 기준

[학습 페이지](../../processed_t2_mapping.html)는 N64/FOV64 mm, A1, 위상0, 배경 T2=80 ms와 중심 j32/폭1·3·7표본의 T2=20·40·120 ms를 사용한다. 이상적 SE/완전 회복/잡음0이며 echo10/20/40/60/80/120/160/200 ms다. AI01의 identity/순환 평활/선명도/한 번의 Haar shrink를 각 echo에 적용한다. All/early4/late4의 free-intercept log OLS로 총108조건이다.

사용 신호≤1e−12면 해당 위치의 log fit을 하지 않는다. 절댓값으로 바꾸거나 일부 사용점을 자동으로 빼지 않는다. 기울기≥−1e−12/ms도 감쇠 추정 불가로 정의했다. 유효 위치만의 공간 T2 RMSE와 제외 개수를 함께 보고한다. 후자의 기울기 예외는 허용 메뉴에서 발생하지 않아 해당 사례의 검증을 주장하지 않는다.

[모형](../../assets/processed-t2-model.js)은 기존 M01 이완/logFit과 AI01 처리를 수정 없이 재사용한다. [독립 기준](../../../tests/helpers/processed-t2-reference.cjs)은 dt.01 ms 횡이완 RK4, 주파수 응답/별도 FFT와 명시 Haar 행렬, Householder QR다. 기존 독립 구조 helper에는 process의 export만 추가했고 연산은 바꾸지 않았다. [시험](../../../tests/processed-t2.test.cjs)/[수집기](AI03-t2-numerical.cjs)의 사전 기준은 신호1e−10, T2/공간 RMSE1e−7 ms, A1e−10이다.

기본 감쇠식은 [Larson 저자 강의 TE/T2 절](https://larsonlab.github.io/MRI-education-resources/Basic%20Contrast%20Mechanisms.html)의 원문 식을 직접 읽고 M01 검증과 연결했다. 공간 혼합 뒤의 비단일 지수와 log OLS bias는 이 모형의 연산에서 직접 유도한다. 수치 T2는 교육 조건이며 실제 조직 표나 임상 성능 자료가 아니다.

## 독립 결과와 반례

[결과](AI03-t2-numerical.json), [화면 기준](AI03-t2-display-reference.json): 108조건/55,296개 신호/6,912개 위치 피팅을 비교했다. 최대 신호차3.89e−15, T2차1.35e−11 ms, A4.77e−13, RMSE1.94e−12 ms로 기준 통과다. 이 중 사용 신호 기준의 불가25건, 표시 창 밖 유효 추정9건을 별도로 보존했다.

기본 T2=40/폭1/평활의 중심은 .5 exp(−TE/40)+.5 exp(−TE/80)이며 전체 echo 추정64.832377 ms다. 초기57.447334 ms/후기69.232886 ms로 달라진다. 폭3/평활 중심은40 ms가 유지되지만 공간 경계의 bias는 남아 map RMSE2.904803 ms다. 공간 전체 RMSE가 작다는 사실을 작은 구조의 정확도로 확대하지 않는다.

T2=20/폭1/선명도/all은 중심 사용8점 중6개가 음수이며 중심 피팅 불가1개를 남긴다. 유효 위치만의 map RMSE.753758 ms를 제외된 중심의 정확도라고 해석하지 않는다. T2=20/폭7/Haar/late의 j29는474.152817 ms로 200 ms 표시 창을 넘는다. 원표와 오차 계산에는 원값을 유지한다. 원래 신호/출력/피팅은 고정 −.3…1.1 창 안이며 반복 정규화가 없다.

## 실제 화면과 내용 검토

[브라우저 절차](AI03-t2-browser-check.js), [결과](AI03-t2-browser-check.json): Chrome155.0.8059.82, 1920×1080/390×844의216상태다. 독립 기준으로64개 원래/추정 map, 불가×, 창 밖 색·위치/개수, 중심8 echo/사용표시/신호·피팅, 원값 표와 지표를 대조했다. 최대 SVG차7.62e−6px로1e−4px 기준을 통과했다. Home/End/ArrowUp·예시/초기화·정답/오답·수식/전체표 펼침·모바일 표 가로/세로 탐색을 확인했다. JS오류/가로 넘침은 없었다. Canvas stub을 사용하지 않았다.

[기본 데스크톱](AI03-t2-base-1920.png)과 [음수 모바일](AI03-t2-invalid-390.png)을 직접 열었다. [창 밖 사례](AI03-t2-clip-390.png), [원값 표](AI03-t2-table-right-390.png)를 보존했다. 브라우저 기록의 viewport와 모형 width 이름 충돌을 발견해 viewportWidth로 기록하고216상태를 다시 실행했다. 창 밖 대표 스크린샷도 실제 창 밖 값이 있는 조건으로 고쳐 재확인했다.

단위/완전 회복·위상·잡음0·순환 공간 처리·echo별 비선형 문턱·공간 혼합과 지수 fit의 순서·유효점 RMSE/제외개수·신호 문턱/기울기·음수/절댓값·고정 창/원표·문제 정답을 검토했다.

## 재현과 남은 범위

[SHA-256](AI03-t2-versions.json), [전체 시험](W51b-tests.txt), [전체 탐색](checkpoint-W51b-navigation.md), [링크 감사](checkpoint-W51b-link-audit.json). 로컬 미커밋/미게시다. 실제 조직·잡음/공분산·학습 모델·2D/coil·임상 mapping·외부 전문가 검토는 미시행이다. AI03 전체 완료로 올리지 않는다.
