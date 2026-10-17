# D01 확산·gradient·b-value 검증 (W25)

2026-10-15. **대상 버전 통과 (W25 완료)**. 외부 전문가 검토 미시행.

δ10ms고정, G30mT/m(0~60,5), D0.001mm²/s(0~0.003,0.0005), Δ40ms(25~80,5). Δ는lobe시작간격, TE=Δ+δ, 180°는TE/2. 물리두lobe동극성/effective반전·q rad/mm·b s/mm²·γrad와Hzγbar를구별한다. 정규화는각조건의동일TE b0신호이며T1/T2/임상절대밝기/수신잡음은제외한다.

자유1DBrownian·초기위치0·순간RF/gradient·공간일정D이다. 고정seed8192표본, 0.5ms구간에서선형q의Brownian적분은끝점Z1과독립bridge Z2를써서구간분산을포함한다. 표시8경로/32위상과전체복소평균을구별한다. 실제제한/비Gaussian/관류/flow/tensor·EPI·실제장비/임상b/안전은제외한다.

독립검산은SI gradient→q의구간별적분/Simpson b, Brownian min(t,s)공분산의별도이중적분을사용한다. b단위절대1e−8s/mm²/상대1e−10, 두독립분산상대1e−9·stationary/zero극한을사전허용한다. 통계는8192개×3seed·대표G/D/Δ의27조건씩, phase/위치평균·분산·복소신호/공분산을사전5SE, SD상대5/√[2(N−1)]로확인한다. 실제SVG1e−6·표반올림·G변경시경로불변·모바일/키보드/문제를검토한다.

Stejskal·Tanner1965 원문본문의두동극성lobe·유한δ 식과180°/움직임설명을실제로읽었다(DOI10.1063/1.1695690,원문PDF). 표시격자/bridge·단위/정규화는자체검산한다. 공개초록검색의잘못매칭된다른PubMed항목은근거로쓰지않는다.

## 독립 단위·gradient 적분·Brownian 공분산

대상은 commit `417aa00` 이후 로컬 파일로 [SHA-256 목록](D01-versions.json)에 특정한다. [독립 기준](../../../tests/helpers/diffusion-reference.cjs)은SI의T/m·m²/s로변환해구간별gradient→q를적분하고Simpson법으로∫q²dt를구한다. 별도로 Brownian위치의min(t,s)공분산을두lobe에서이중적분해위상분산을구한다. 제품의닫힌b공식을기대값으로복사하지않는다. [수집기](D01-numerical.cjs), [결과](D01-numerical.json)에전1,092조건과통계를저장했다.

| 검토 항목 | 결과와 사전 기준 | 판정 |
|---|---|---|
| SI→b | 최대절대차이4.321e−12s/mm², 기준1e−8. 비영값의상대오차도1e−10이내 | 통과 |
| 별도Brownian공분산 | Varφ=2bD와최대1.244e−14 차이, 비영값상대1e−9이내 | 통과 |
| Echo끝q | 최대8.732e−14rad/mm, 기준1e−10. 정지위치재위상화 | 통과 |
| 격자/bridge분산 | bank선형q가중치분산과독립min공분산kernel의최대차이2.542e−20s³ | 통과 |
| RF부호·phase-position | 공분산부호를독립실제gradient×Brownian위치적분과비교. 180°공통위상제거뒤φ=+γ∫g_eff xdt=−∫q dx | 통과 |
| 극한·배율 | G0또는D0의정규화신호1, G두배의b4배, G변경시같은경로, 유한δ/정확한Δ정의·동일TE정규화 | 통과 |

직접시간적분의표시기준은같은선언된Gaussian입력에서Brownian끝점을만들고, 각구간의위치적분 h(Wstart+Wend)/2−√(h³/12)Z2를각lobe에합한다. 제품의q가중증분을그대로기준으로쓰지않는다. 표시하지않는구간사이Brownianbridge가분산에필요하며, 표시경로의직선연결을정확한연속물리경로라고주장하지않는다.

## 통계 확인

N8192·3seed(0x6d725d01/0x243f6a88/0x13579bdf), 각seed의G0/30/60·D0/.001/.003·Δ25/40/80의27조건, 총 **81개통계조건**을사전허용으로검토했다. 같은bank를사용하는조건끼리는상관이있으며독립표본81개라는뜻은아니다.

| 항목 | 최대관측 | 사전기준 |
|---|---|---|
| 위상평균 / 위치평균 | 1.525SE / 1.470SE | 각각5SE |
| phase-position공분산 | 2.007SE | 5SE |
| 복소평균Re / Im | 2.460SE / 2.091SE | 각각5SE |
| 위상SD / 위치SD 상대차이 | 0.015209 / 0.014136 | 0.039065 |

기대복소평균은exp(−bD)이며유한ensemble의magnitude와구별했다. Re/Im분산은Gaussian위상의특성함수로계산하며, 낮은신호의표본magnitude바닥을실제수신Rician잡음이라고설명하지않는다. 실제T2/조직/ADC/진단이나EPI읽기를모형에추가하지않았다.

## 실제 화면·조작·내용 검토

[독립 표시 수집기](D01-display-reference.cjs)는직접gradient×위치적분으로12Δ의 **98,304개위상용계수**와대표경로를만든다. [브라우저 스크립트](D01-browser-check.js), [결과](D01-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/diffusion_b_value.html`,1920×1080·390×844의 **250상태**다. 전12Δ×대표3G×3D, 경계/방향키·정지/무gradient·긴간격/저신호·문제/초기화를대조했다. JS오류·가로넘침0이다.

실제두gradient도식·181점q·8경로의모든표시점·32대표위상·전체8192복소평균/기대표식·TE선을독립기준과비교했다. 최대좌표차이1.393e−12, 기준1e−6이내. G30→60변경에서실제경로SVG문자열도같음을확인했다.

[모바일waveform](D01-waveform-390.png), [Brownian경로](D01-paths-390.png), [복소평균](D01-phase-390.png), [낮은기대신호](D01-low-signal-390.png)를직접보았다. 두단위의축/눈금·180°/TE·경로/위상범례·기대/표본의구별에서겹침/잘림을발견하지않았다. Gradient/q를별도세로구간에배치해단위와고정축을보이고, 작은평균벡터의화살촉은생략해길이를과장하지않는다.

`node --test tests/*.test.cjs`: **87/87 통과**. 새2개시험은독립SI/Brownian이중적분·직접gradient-position표본·부호/공분산/통계·극한·입력조건을다룬다. 실제화면/내용판정은별도로수행했다.

## 최종 판정과 범위

D01의자유1DGaussian확산·두lobe/RF180·q/b/단위·동일TE b0정규화·Brownian/bridge·기대/유한표본·설명/문제를 **대상버전통과**로판정한다. 실제조직/제한/비Gaussian/관류/tensor·T1/T2/수신잡음·EPI·장비/권장b/임상/전문가검토는미시행또는모형밖이다. waveform/RF·gradient/시간·확산모형·난수/bridge·정규화/표시범위가바뀌면독립적분/공분산/통계·실제두화면을재검증한다. 다음W26/D02.
