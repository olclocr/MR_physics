# X12 기본 · 방향 확산과 MD/FA (W77)

2026-10-18. **알려진 양의 단일 Gaussian tensor/동일S0 정규화 모형의 대상 버전 통과.** 알려진 양의3차원tensor의 전진 신호와 scalar 요약을 다룬다. 실제tensor fitting·잡음/교차성분/tractography·조직/질병 분류는 포함하지 않는다. 외부 전문가 검토 미시행.

사전범위는고유값(0.8,0.8,0.8),(1.4,0.5,0.5),(1.1,1.1,0.2)×10⁻³mm²/s의세모형이다. 모두MD0.8×10⁻³이고뒤두모형은같은FA지만고유값모양이다르다. z축주위회전0/45/90도와b0/500/1000s/mm²의27조건,xy측정방향0…180도/5도간격37점및X/Y/Z세축을비교한다. 기본한축큰모형/회전0/b1000이다.

Product는Rdiag(λ)Rᵀ와gᵀDg,행렬trace/등방성제거Frobenius비로MD/FA를구한다. D02의noise0/고정T2 API를재사용해같은S0로나눈단일지수S/S0를계산하며기존ADCFit은바꾸지않는다. 알려진MD/FA는신호에서추정한값이아니다. 독립기준은닫힌xy회전성분·고유값쌍차이FA·상대각cos²/sin² ADC와별도b축감쇠ODE이다. 사전기준D/MD1e−12,FA/정규화신호1e−8,ODE수렴1e−8. 실제두화면·전표/두곡선/회전·예시/키보드/정답과전체회귀를확인한다.

[Basser/Pierpaoli1996 원논문 초록](https://pubmed.ncbi.nlm.nih.gov/8661285/)의등방/이방분리·회전불변요약과 [저자기관의1994설명](https://www.nichd.nih.gov/research/atNICHD/Investigators/basser/publications)을확인했다. [DIPY공식정의](https://docs.dipy.org/stable/reference/dipy.reconst.html#dipy.reconst.dti.fractional_anisotropy)의FA/MD및TensorFit.predict의신호식을대조했다(1.12.0표시). 라이브러리를설치/호출한검증은아니다. 검색된NIH1994PDF와UBC1996PDF는404,PMC1994는CAPTCHA여서그원문수식/표를읽었다고기록하지않는다. 직접정의한고유값을조직값/환자기준으로확대하지않는다.

## 독립 확인과 내용 판정

[독립 절차](X12-numerical.cjs)와 [결과](X12-numerical.json)는27조건·999각도점/81축점에서통과했다. 최대D/MD4.34e−19mm²/s,FA1.18e−16,신호2.23e−16,별도b축감쇠ODE1.03e−14/수렴1.51e−13이다. 같은기준ADC모델을noise0/동일T2로호출하고S0로나눈정규화를독립exp및ODE와확인했다. 기존ADCFit파일은변경하지않았다.

기본λ(1.4,.5,.5)×10⁻³mm²/s는MD.8×10⁻³/FA.573819042이며b1000의X/Y/Z신호는.246596964/.606530660/.606530660이다. 회전45도에서는X/Y가.386741023으로같아져도MD/FA는같다. λ(1.1,1.1,.2)모형도같은MD/FA지만X/Y.332871084/Z.818730753으로다르다. xy곡선의일정함과3차원등방성,모형정답과b0신호에서의추정을구별했다.

[실제Chrome 절차](X12-browser-check.js)와 [54상태 결과](X12-browser-check.json)는1920/390px에서27조건의MD/FA·세축신호·3×3행렬/37×3표·방향ADC/신호곡선/등방기준/축점을독립자료와대조했다. 최대SVG좌표4.95e−6 SVG좌표단위/기준1e−5,6자리수치/표는5.1e−7안이다. 키보드Home/End/Arrow/Enter·세예시/초기화·두문제양답·전체열가시성/각도표세로스크롤·b0정답/추정구별문구를확인했다. 그림viewBox/실제비율·중첩SVG없음/축11px이상이며JS오류/페이지가로넘침0이다.

첫수치/DOM대조통과뒤스크린샷을직접읽어작은행렬이X열만먼저보이는배치를발견했다. 불필요한가로스크롤을없애고세열이한눈에들어오도록수정한뒤54상태를재검증했다. [최종데스크톱](X12-base-1920.png),[모바일행렬](X12-oblate-390.png),[모바일그림](X12-oblate-graphics-390.png),[같은FA/다른Z수치](X12-oblate-metrics-390.png)를직접읽었다. 수치계산변경은없다.

3차원축/고유값·xy회전·b/ADC단위·정규화·FA쌍차이/Frobenius식의동치·설명/정답을검토했다. 한tensor의FA를실제교차성분/미세구조/질병이나tractography로확대하지않았다. [대상버전](X12-versions.json), [전체회귀](W77-tests.txt), [통합 기록](checkpoint-W77-navigation.md).
