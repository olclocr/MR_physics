# F03 선택 saturation·B0/B1 검증 (W23)

2026-10-15. **선택 saturation 범위 대상 버전 통과 (W23 완료)**. 외부 전문가 검토 미시행. Water excitation은 W27 후속 검증 대기다.

기준3T 단일peak 지방−3.5ppm·carrier고정, 순수물/지방별개voxel의M0각1이다. 명목90°사각RF기간8ms(2/4/8/12/16), 추가offset0Hz(−500~500,25), B1배율1(0~2,0.05). 기간변경때명목90°를유지하도록B1을조정한다. RF중이완없음→순XY이상spoiling/Mz유지→순간영상90°→TE0읽기|Mz|이다. 실제Gaussian/shapedpulse·지연/T1회복/반복·다중peak·공간field·실제장비/안전/권장값은제외한다. Water excitation은후속미구현으로명시한다.

기간/주파수응답·B0의주파수이동·B1오차를세관찰로두며 signedMz와magnitude·측면엽·1/τ는폭척도뿐이라는점을구별한다. 독립Bloch ODE의시간적분을기준으로벡터/신호1e−8·norm1오차1e−9, 실제SVG1e−6/수치반올림/회색정수일치를사전허용한다. 공명90/180·B1=0·물선택실패·detuning부호/기간스케일·spoiling/즉시읽기·문제를검토한다.

Haase등1985 CHESS 원논문의선택90RF→dephase→영상순서를실제읽었다(PMID4001160,원문PDF본문). 원논문은10msGaussian/유한gradient이며현재사각RF/지연0은자체한계모형이다. 원문의coherence재위상화가능성을반영해순횡자화0과미시적소멸을구별한다. Bloch부호는B02/Larson자료와대조한다.

## 독립 Bloch 적분·회전·단위

대상은 commit `417aa00` 이후 로컬 파일이며 [SHA-256 목록](F03-versions.json)으로 특정한다. [독립 기준](../../../tests/helpers/saturation-reference.cjs)은 dM/dt=γM×B의 직접RK4 적분과 일반3×3행렬의 scaled Taylor 지수/제곱을 사용한다. 제품의유효축 닫힌회전식을 기대값으로 쓰지 않는다. [수집기](F03-numerical.cjs), [결과](F03-numerical.json)에405조건·810개spin전파를 저장했다.

| 검토 항목 | 결과와 사전 기준 | 판정 |
|---|---|---|
| RF뒤Mx/My/Mz·읽기크기 | 독립ODE와 최대3.627e−11, 기준1e−8 | 통과 |
| 일반행렬지수의 전파 | 같은ODE와 최대3.627e−11, 기준1e−8 | 통과 |
| RF중벡터norm | 최대4.441e−16, 기준1e−9. Spoiling 전 회전이며 이완없음 | 통과 |
| 공명/극한 | 명목90°는Mz0/My+1, 180°는Mz−1/크기1, B1=0은Mz1. Detuning반전/기간×주파수 척도 확인 | 통과 |
| B0/B1 실패 | Offset−450Hz에서 물신호<.01·지방>.98. B1배율2/offset0의지방즉시크기1 | 통과 |
| 가정/단위/정답 | Hz↔rad/ms·기간조절시명목90°·B1 µT·1/τ폭척도·signedMz/크기·별개voxel·TE0·이완/지연0을 대조 | 통과 |

8ms의명목B1은0.734µT이며 기간을 바꾸면명목90°를 유지하도록1/τ로 조정한다. 같은B1배율에서 주파수응답은 detuning×기간으로 정해지고 사각RF측면엽이 있어 한주파수의보존이기간에단조롭지는않다. 1/τ를 정확한BW나FWHM으로 부르지 않는다. 원논문Gaussian/shaped RF·유한spoiling시간/회복과 현재한계모형을 구별했다.

RF뒤지방Mz=−1을 즉시spoiling/영상90°로 읽으면 부호가반대인횡성분이 되고크기는1이다. 반전뒤TI를기다리는IR과 다르다. Spoiling은순횡자화0의가정이며 미시적spin자화 소멸이나 모든coherence의영구제거를 의미하지않는다고 설명했다.

## 실제 화면·조작·통합 검토

[독립 표시 수집기](F03-display-reference.cjs)는30기간/B1조건·15,030개주파수점의일반행렬지수를 계산한다. [브라우저 스크립트](F03-browser-check.js), [결과](F03-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/spectral_fat_saturation.html`,1920×1080·390×844의 **474개상태**다. 모든기간×대표9offset×5B1을두화면에서 비교하고 예시·물선택실패·180반전·키보드경계/방향키·문제/초기화를 확인했다.

실제501점의두응답곡선·물/지방주파수와현재점·signedMz/크기/벡터표·고정회색·숫자/반례를 독립기준과 대조했다. 최대좌표차이7.390e−12, 기준1e−6 이내. 회색정수일치·JS오류/가로넘침0이다.

[모바일기본응답](F03-profile-390.png), [물선택실패](F03-water-loss-390.png), [180반전의signed/크기](F03-inversion-390.png), [반전값표](F03-inversion-states-390.png)를 직접보았다. 고정주파수/자화축·현재주파수표식·음의Mz와양의magnitude·표의읽기에서 겹침/잘림을발견하지않았다. 양의Mz에서겹치는두곡선을설명하고 별개순수voxel의크기를합산하지않는다.

`node --test tests/*.test.cjs`: **84/84 통과**. 새2개시험은 독립Bloch/행렬지수·벡터부호/norm·주파수/기간척도·공명90/180·B1=0·물선택실패·입력조건을 다룬다. 실제화면/내용판정과시험상태를구별한다.

## 최종 판정과 남은 범위

F03의 **선택saturation 범위**인 사각RF→이상spoiling→순간90/TE0, 전체주파수응답·B0/B1실패·단위/정규화·signed/크기·설명/문제를 대상버전통과로 판정한다. Water excitation은구현/검증하지않았으며W27후속으로보존한다. 실제shapedRF/유한spoiling·이완/회복/반복·다중peak·공간B0/B1·실제장비/SAR/임상영상·외부전문가검토는미시행또는모형밖이다. pulse/회전/주파수/시간·spoiling/읽기·정규화/가정을바꾸면 독립Bloch/행렬지수·내용과실제두화면을재검증한다. 다음W24/F04.
