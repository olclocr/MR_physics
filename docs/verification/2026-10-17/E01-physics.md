# E01 기본 · 균일 탄성 shear wave 검증 (W47)

2026-10-17. **주어진 순수 탄성 파동 부분 모형 대상 버전 통과.** MR 위상 encoding은 별도 후속이며 실제조직/물성추정/임상 MRE 검증이 아니다. 외부 전문가 검토 미시행.

## 대상과 사전 기준

[학습 페이지](../../mre_shear_wave.html)는 균일·등방·무한·선형·순수 탄성 매질이다. ρ1000kg/m³,정답μ1/4/9kPa,기계진동30/60/90Hz,변위진폭10µm,스냅샷0/90/180/270°의36조건이다. 전파+x/변위y의shear wave를 x0–200mm/401점,변위−10…10µm의고정축으로그린다. μ는입력정답이며추정결과가아니다. 기계진동과RF/Larmor주파수를구별한다.

ρu_tt=μu_xx에서c=√(μ/ρ)=fλ를사용한다. 단위는μPa/ρkg·m⁻³/c m·s⁻¹/λm로변환하며화면길이는mm/µm이다. 최대변형률2πU/λ는지원범위에서0.006미만이다. 점탄성·이방성·반사·감쇠·경계·종파는미구현이다. Shear modulus와Young's modulus/임상장비stiffness를동일시하지않는다.

[독립 기준](../../../tests/helpers/shear-wave-reference.cjs)은 μu_xx+ρω²u=0의공간진동자초기값문제를RK4로적분하고derivative의crest교차로파장을읽는다. 표시간격0.5mm당128단계,36조건총1,843,200공간단계다. [시험](../../../tests/shear-wave.test.cjs)/[수집기](E01-numerical.cjs)의사전기준은변위1e−8µm,파장1e−6mm이다.

## 근거와 독립 결과

[Muthupillai등1995 DOI10.1126/science.7569924](https://pubmed.ncbi.nlm.nih.gov/7569924/)의원전초록에서조화기계응답을MR로관측해재료성질과연결하는개념을읽었다. [Atay등2008 DOI10.1115/1.2899575](https://pmc.ncbi.nlm.nih.gov/articles/PMC2408772/)의원전이론검색결과에서주어진shear wave/PDE와선형/주파수적용범위를확인했다. [저자합의문서Manduca등2021 DOI10.1002/mrm.28627](https://onlinelibrary.wiley.com/doi/full/10.1002/mrm.28627)의순수탄성ρc²해석과구별했다. 실제논문의동물/gel주파수·탄성수치를이페이지의예시로대체하거나재현하지않았다.

[결과](E01-numerical.json), [화면 기준](E01-display-reference.json):36조건/14,436표시표본에서최대변위차이2.25e−10µm,crest간격의파장차이5.39e−10mm로기준통과다. μ4kPa/60Hz는c2m/s,λ33.333333mm,T16.666667ms다. μ9kPa/60Hz는c3m/s/λ50mm,μ4kPa/30Hz는같은c2m/s/λ66.666667mm다. 1/4주기뒤crest는+x로λ/4이동한다. 같은f/ρ에서λ두배는μ네배임을확인한다.

## 실제 화면과 내용 검토

[브라우저 절차](E01-browser-check.js), [결과](E01-browser-check.json)는Chrome155.0.8059.82,1920×1080/390×844의72상태에서파형/crest간격·속도/파장/주기/시점·위치표를독립기준과대조했다. 최대SVG차이7.62e−6px로1e−4px기준통과다. Home/End/ArrowUp,다음1/4주기의270→0순환,세예시/초기화,정답/오답,수식펼침,모바일표탐색을확인했다. JS오류·가로넘침은없었다.

[큰μ 데스크톱](E01-stiff-1920.png), [1/4주기 모바일](E01-quarter-390.png), [주파수변경](E01-frequency-1920.png), [표오른쪽](E01-table-right-390.png)을보존하고대표두화면을직접열었다. 다음시점/초기화버튼간격과문장띄어쓰기를보강한뒤72상태를재검증했다. 전파/변위방향·mm/µm·Pa/kPa·기계/RF주파수·단일실수μ/실제재료·주파수조건·정답을내용검토했다.

## 버전과 남은 범위

[SHA-256](E01-versions.json), [전체 시험](W47-tests.txt), [전체 연결·화면](checkpoint-W47-navigation.md), [링크 감사](checkpoint-W47-link-audit.json)를기록한다. 로컬미커밋/미게시상태다. MR 위상 encoding은 W47b, 반사/감쇠·실제 조직의 점탄성·inversion/품질·임상은 후속 범위다.
