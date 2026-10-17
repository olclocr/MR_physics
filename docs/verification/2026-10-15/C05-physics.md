# C05 Echo train·ordering 검증 (W14)

2026-10-15. **대상 버전 통과 (W14 완료)**. 외부 전문가 검토 미시행.

중심 질문은 서로 다른echo의 k를 모으면 무엇이 달라지는가이다. ESP·ETL·배치의3관찰. 기본ESP10ms(5~20,5), ETL8(1/4/8/16), ordering linear/centric/reverse. N64/FOV240mm/3.75mm 격자와 PD1의 A16칸·T2=50ms/B12칸·T2=150ms를 고정한다. 위상 원점은 표본 index0이며 표시 y는 칸 중심이다. 시작 자화·TR 회복·echo는 이상적이고 T2 단일 지수만 가중한다.

독립 확인은 별도 radix2 FFT로 구획의 스펙트럼을 구하고 echo별 감쇠를 적용해 복소 IFFT를 비교한다. 배정은 TR별/echo별 이벤트를 따로 열거해 각 k가1회만 읽히는지 확인한다. 사전 복소 성분 절대오차1e−9, 시간/단위1e−12, 실제 SVG좌표1e−6·회색정수 정확일치. ETL1의 단일TE 일치와 중심/외곽 배치에 따른TEeff·서로 다른 k가 같은TE가 아닌 반례를 확인한다.

실제 RF flip-angle train·stimulated echo·T1 이력·B1·J-coupling/지방·임상 FSE 대비·scan time 전체는 제외한다. 근거는 Larson Fast Imaging과 Busse 등2008의view ordering/PSF 개념과 실제 pulse-train의 추가 조건이다. 숫자/phantom/배치는 자체 교육 예시다.

## 독립 검산·단위·물리 판정

대상은 commit `417aa00` 이후 로컬 파일이며 [SHA-256 목록](C05-versions.json)으로 특정한다. [독립 기준](../../../tests/helpers/echo-train-reference.cjs)은 TR별/echo별 loop로 k 배정을 열거하고 별도 recursive radix2 FFT로 신호와 영상을 구한다. 제품의 직접 DFT·inverse 합산은 기준에서 호출하지 않는다. [수집기](C05-numerical.cjs), [결과](C05-numerical.json)에48개 조합을 저장했다.

| 주장·비교 | 독립 결과·조건 | 판정 |
|---|---|---|
| echo 배정과 획득 수 | 각 조합에서64개 k를 각각1회, 각 TR에 ETL개, 각 echo에64/ETL개 TR. 별도 열거와 일치 | 통과 |
| DFT 정규화·복소 inverse | 48개 조합×64 pixel. 최대 성분 절대오차3.802e−15, 허용1e−9. 허수부를 보존한 뒤 magnitude | 통과 |
| TEeff | ESP10/ETL8에서 linear50ms, centric10ms, reverse80ms. k=0의 실제 echo 시간과 일치 | 통과 |
| ETL1의 극한 | 모든 k가ESP 하나에서 읽혀 순수 단일 echo 감쇠와 실제 복소 역합이1e−9 이내로 일치 | 통과 |
| 같은 중심 TE의 반례 | centric ETL8/16은 TEeff10ms로 같지만 주변 k의 다른 echo 가중치 때문에 프로필이 다름 | 통과 |
| RF·echo·단위 | 여기 중심0, refocus=(e−1/2)ESP, echo=eESP. ms. 그림은 RF 진폭이나 gradient의 세부 파형을 뜻하지 않음 | 통과 |
| 모델 범위·정답 | 같은 초기 자화·위상·완전90/180·T2 단일 지수. 실제 FSE의 stimulated echo/T1·FA train·noise·시간 전체를 포함하지 않음 | 통과 |

같은 echo의 위상을 공통 수신 기준으로 정렬했다고 가정해 T2 가중치로 결합했다. A/B의 서로 다른T2는 각 성분의 스펙트럼에 따로 가중한다. 전체 영상에 단일 T2나 단일 TEeff를 임의로 적용하지 않는다. 표시 y는 칸 중심, 위상은 index0 원점이며 이 기준을 수식에서 구분했다. 공간 간격3.75mm, k index−32…31, 모든 데이터는64개이며 표시 interpolation이나 새 측정을 추가하지 않는다.

근거는 2026-10-15 실제 확인한 [Larson Multiple Spin-echo 절](https://larsonlab.github.io/MRI-education-resources/Fast%20Imaging%20Pulse%20Sequences.html)의 ESP·ETL·중심TE, [Busse 등2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2760745/)의 refocusing/view ordering·PSF 주제다. 단순 모형의 배정·수치·phantom은 별도 정의했으며 특정 벤더의 순서나 실제 FA train을 재현하지 않는다.

## 표시 검토·보강·재검증

표시를 연결하는 중 프로필 끝 표본의 중심을 FOV 끝점처럼 표기할 위험을 발견했다. 칸 중심 좌표(j+1/2)×3.75−120mm와 축 끝점±120mm를 따로 그려 일치시켰다. echo색만으로 배정을 읽게 하지 않도록 접힌64개 이벤트 표(TR/k/echo/TE)를 추가하고 그 행을 독립 열거와 대조했다. 임상 사진처럼 보이는 영상을 만들지 않고1D 교육용 띠로 표시했다.

[브라우저 스크립트](C05-browser-check.js), [결과](C05-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/fast_spin_echo.html`,1920×1080·390×844에서 **118상태**. 각 화면의48개 전체 조합, ETL1·centric/reverse·예시·키보드·정답·초기화를 확인했다.

- 독립 FFT의64개 complex/magnitude 기준으로 실제 프로필·고정 회색 띠를 대조했다. SVG 최대오차5.401e−13, 허용1e−6. 회색 정수·echo색·수치·RF/echo 위치·64개 표 행 일치. 가로 넘침·페이지JS 오류0.
- ESP Home/End/ArrowLeft, ETL End/Tab, ordering Home/Tab, 모든 문제 Enter와 reset을 확인했다. 최대ETL16/ESP20 상태도 정상 반영됐다.
- 직접 확인한 화면: [데스크톱 진입](C05-page-1920.png), [모바일 진입](C05-page-390.png), [echo8](C05-train-390.png), [echo16](C05-longtrain-390.png), [linear 프로필](C05-profile-390.png), [centric](C05-centric-390.png), [배치](C05-ordering-390.png), [reverse](C05-reverse-390.png). 긴 train은 모바일에서 echo 번호를 간추려 겹침을 피하고 모든 pulse 위치는 유지했다.

`node --test tests/*.test.cjs`: **66/66 통과**. 새2개 시험의 FFT/이벤트 열거·ETL1·중심TE·주변 가중치·시간·잘못된 입력 확인과 실제 화면·내용 판정은 별도로 수행했다.

## 최종 판정·남은 범위

C05의 이상적 echo 시간·명시한k 배정·T2 가중치·복소 역합·표시/격자·TEeff·정답/한계를 **대상 버전 통과**로 판정한다. 외부 전문가 검토·실제 임상 데이터·FA/stimulated echo·T1 이력·장비/진단 성능은 미시행/모형 밖이다. echo/shot 배정·phase 규약·T2 성분·격자/정규화·pulse시간·창 변경 시 독립 FFT/이벤트·내용/정답·실제 두 화면을 재검증한다. 다음 W15/G03.
