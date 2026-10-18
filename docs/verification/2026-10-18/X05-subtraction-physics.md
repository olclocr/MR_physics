# X05 후속 · Signed subtraction과 공간 정합 (W71)

2026-10-18. **알려진1차원 신호/정수pixel 이동 모형의 대상 버전 통과.** 실제 조영/RF·이동 추정·분수pixel 보간/비선형 registration·환자 조영증강/진단의 검증은 아니다. 외부 전문가 검토 미시행. 전체 회귀/탐색은 별도 연결한다.

## 사전 범위와 독립 기준

128mm/128pixel·dx1mm, 바탕[−40,40]mm 신호.2a.u.와 중앙[−6,6]mm의추가.1a.u.를 직접 정의한다. 후영상 중앙 증가Δ0/.1/.3a.u., 전체 이동−8/0/8mm, 무정렬/정답 정수pixel역이동의18조건이다. 고정ROI는전영상좌표[−6,6]이며 영상마다 따라 움직이지 않는다. 각 영상의 획득 중에는 물체가 정지해 있고 영상 사이 위치만 달라진다. A02의 획득중 k-space ghosting과 구별한다.

Product는 구간 겹침 적분으로 각pixel 평균을 계산하고 알려진 이동은 후영상 배열을 역방향으로 정수 이동한다. 이동 추정/보간은 없다. 바탕/중앙 구간은 FOV 안에 남아 데이터가 잘리지 않는다. ΔI=선택후−전을 부호와 함께 보존한다. 전후 창0…0.6a.u., signed창−.4…+.4a.u., 좌표−64…64mm로고정한다.

독립 기준은 구간indicator의32개 subpixel 중점 적분이며 정답 정렬은 원좌표의 연속 물체를 따로 적분해 배열 역이동의 부호를 검산한다. 전체 양/음 적분과 고정ROI 평균은 전후 구간 경계의 사건분할 적분으로 구한다. 메뉴의 모든 경계는pixel 경계와 일치해 중점 적분이 정확한 이번 경우에 한정한다. Pixel값/ROI1e−12a.u., 전체 적분1e−10a.u.·mm를 사전 기준으로 둔다.

## 근거와 내용 검토

[Rueckert 등1999 원전](https://pubmed.ncbi.nlm.nih.gov/10534053/)의 PubMed 검색 결과가 반환한 저자 초록을 읽었다. 조영에 따른 intensity 변화와 affine/FFD의 위치/변형을 함께 다루는 실제 breast MR registration이라는 범위를 확인했다. 원전의 similarity 최적화·비선형 변형/임상 성능을 이번 알려진 정수 이동에 구현했다고 하지 않는다. 본문 전체/환자 영상을 확보했다고 표현하지 않는다.

구간/증가/이동/표시 창은 직접 정의한 교육값이다. 비음수 원영상과 signed차·부호/위상/종자화의 차이, 정답 이동 방향·pixel평균/좌표·같은스케일/FOV가정, 고정ROI/전체 보존, 양/음 적분의 단위와 원표·도식/정답을 검토했다. 전후 회색 창과 차의 흰색0/부호 창이 다름을 명시했다. 색상 값을 뺀 결과로 표현하지 않는다. 새로운 MR 신호 모형/ODE를 추가하지 않았으며 계산을 복제하는 Bloch 시험으로 대체하지 않는다. 추가 계산 오류는 발견하지 않았다.

## 독립 수치와 반례

[페이지](../../signed_subtraction_alignment.html), [모형](../../assets/signed-subtraction-model.js), [독립 기준](../../../tests/helpers/signed-subtraction-reference.cjs), [시험](../../../tests/signed-subtraction.test.cjs), [수집기](X05-subtraction-numerical.cjs), [수치](X05-subtraction-numerical.json), [표시 기준](X05-subtraction-display-reference.json).

18조건/2,304pixel에서 최대pixel차1.67e−16a.u., 양/음/순적분차1.78e−15a.u.·mm, ROI평균차5.56e−17a.u., 전체보존차2.23e−15a.u.·mm로 사전 기준을 통과했다. ΔI의 전후 순서·양/음·정수 역이동·범위/FOV와 전역/국소의 구별을 확인했다.

증가0/이동+8mm는양의적분+2.4/음의적분−2.4/전체0a.u.·mm이나 ROI평균은−.066666667a.u.다. 증가.3/같은이동은양+6/음−2.4/순3.6a.u.·mm, 고정ROI.033333333a.u.다. 같은 신호를 알려진 정수 이동으로 정렬하면ROI.3/음의적분0/양의적분3.6이 된다. 후영상의 증가량을 바꾼 것이 아니라 비교 좌표를 맞춘 결과이며 환자 정합 성능으로 확대하지 않는다.

## 실제 화면과pixel

[Chrome 절차](X05-subtraction-browser-check.js), [결과](X05-subtraction-browser-check.json).1920×1080/390×844의36상태에서 지표/128행×5열과256계단좌표·고정ROI를 독립 기준에 대조했다. 최대SVG차5.69e−14px로1e−4px 이내이며6자리 출력5.1e−7을 만족했다. 실제viewBox/중첩0·종횡비/글자11px이상도 확인했다.

실제 세canvas의각128pixel중심RGBA를 읽어 전/선택후/차의 고정창 색과 대조했다. 반올림 경계의 독립 부동소수점 차이를 위해 RGB1byte/alpha0을 기준으로 두었고 최대색차1byte로통과했다. Canvas stub 결과로 화면 검증을 대체하지 않았다.

Select Home/End/ArrowUp·세 예시/초기화·Enter, 문제 오답/정답, 수식 펼침·모바일 원표 가로/아래 스크롤을 실제 수행했다. JS 오류/페이지 가로 넘침0이다. [이동만 데스크톱](X05-subtraction-motion-1920.png), [세 띠/차 profile 모바일](X05-subtraction-motion-images-390.png), [증가와이동혼합 지표](X05-subtraction-mixed-reading-390.png)을 직접 열어 양/음 경계·전체보존/ROI차와 고정창을 읽었다. 띠 옆에 교육용1차원 도식/임상영상 아님을 표시했다.

## 버전·통합·남은 범위

[로컬 raw SHA-256](X05-subtraction-versions.json), [전체 시험](W71-tests.txt), [전체 탐색](checkpoint-W71-navigation.md), [링크 감사](checkpoint-W71-link-audit.json). 기존 A02에는 후속 링크만 더한다. 현재는 a734a1b 이후 로컬 추가분으로 다음 승인 예약 게시에서 공개한다.

X05 전체는 부분 구현/검토 중이다. 실제 약제/농도·MR획득/위상·noise/신호스케일변화·분수pixel/보간·이동추정/비선형정합·FOV잘림·환자 진단은 남았다. 물체/증가량/좌표/ROI·평균/표시창·이동/보간/경계·뺄셈 부호/정규화·도식/원표/정답이 바뀌면 해당 범위를 재검증한다.
