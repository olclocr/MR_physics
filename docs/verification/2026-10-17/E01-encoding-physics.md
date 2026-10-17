# E01 후속 · 변위와 MR 위상 검증 (W47b)

2026-10-17. **단일 방향/한 주기 유효 gradient의 부분 모형 대상 버전 통과.** 전체 sequence·물성 inversion/임상 MRE 검증은 아니다. 외부 전문가 검토 미시행.

## 대상과 독립 기준

[학습 페이지](../../mre_motion_encoding.html)는 E01의 순수 탄성 μ4kPa/ρ1000kg/m³/60Hz/c2m/s/λ33.333333mm를 고정한다. 변위진폭5/10/20µm,유효gradient0/10/20mT/m,극성±,동기화θ0/90/180/270°의72조건이다. 전파+x,변위/gradient는y다. G(t)=pGcosωt,u=Ucos(kx−ωt−θ),한주기16.666667ms에서 φ=−γ∫Gu dt를 구한다. 정적위치항은∫Gdt=0으로상쇄된다.

기존 ShearWave의공간/시간규약과MRPhysics의양성자상수를수정없이재사용했다. 유효gradient는RF부호가필요하면이미반영된파형으로정의한다. 실제gradient ramps/RF/영상gradient는미구현이다. 신호크기1,noise/배경위상0이며wrapping은계산하지않는다. 시간/공간위상·MR위상·물성의복소phase angle을구별한다.

[독립 기준](../../../tests/helpers/mre-motion-encoding-reference.cjs)은cos/sin시간기저에대한4096분할Simpson구적으로공간위상을구하고,probe x0의401개누적시각을각각1024분할로적분한다. 별도로x0의복소MR신호ODE를4096단계RK4로적분해최종atan2와신호크기를검산한다. [시험](../../../tests/mre-motion-encoding.test.cjs)/[수집기](E01-encoding-numerical.cjs)는위상1e−9rad,복소신호크기1e−10을사전기준으로두었다.

## 원전과 결과

[Klatt·Johnson·Magin2015 DOI10.1002/jmri.24806](https://pmc.ncbi.nlm.nih.gov/articles/PMC4444395/)의원전Theory검색결과에서변위/MEG의시간적분과파형/초기위상에따른encoding효율을읽었다. 이페이지는논문의다방향encoding/전체sequence/실험성능을재현하지않는다. MR수신위상부호는기존B04의음의위상규약이며문헌의부호와구별해명시했다. 한주기cosine의T/2계수는주어진파형에서직접유도했다.

[결과](E01-encoding-numerical.json), [화면 기준](E01-encoding-display-reference.json):72조건/28,872공간위상표본/28,872누적시각에서최대공간위상차이8.89e−16rad,누적시간구적차이6.66e−12rad,복소ODE최종위상차이6.11e−16rad,신호크기차이3.67e−15로기준통과다. ODE검산은probe x0이며공간전체에는독립시간기저구적을적용했다.

기본probe위상은−0.222935158rad,변위20µm는−0.445870317rad,반대극성은+0.222935158rad다. θ90°의probe최종위상은0이지만공간위상진폭은0.222935158rad이고시간변위도0이아니다. G0에서는진동이남아도공간/최종MR위상은0이다. 지원범위의최대연속공간위상진폭은0.891740633rad로고정창±1rad안이다.

## 실제 화면과 내용 검토

[브라우저 절차](E01-encoding-browser-check.js), [결과](E01-encoding-browser-check.json)는Chrome155.0.8059.82,1920×1080/390×844의144상태에서공간위상·gradient/변위실단위파형·누적위상·표/지표를대조했다. 최대SVG y차이7.65e−6px로1e−4px기준통과다. Home/End/ArrowUp,세예시/초기화,정답/오답,수식펼침,모바일표탐색을확인했고JS오류·페이지가로넘침은없었다.

[θ90° 데스크톱](E01-encoding-quadrature-1920.png), [극성반전 모바일](E01-encoding-polarity-390.png), [변위두배](E01-encoding-amplitude-1920.png), [표오른쪽](E01-encoding-table-right-390.png)을보존하고대표두화면을직접열었다. 두시간파형의각각고정±20mT/m/µm축과누적위상의고정±1rad축을확인했다. 표시정밀도미만의음의0은출력형식에서만0으로보이고모형은수정하지않는다.

부호/극성·rad/s/T/µm/mT/m/ms·유효gradient/실제sequence·신호크기/위상·probe0/공간위상·동기화상쇄/무운동·물성불변·두문제정답을내용검토했다.

## 버전과 한계

[SHA-256](E01-encoding-versions.json), [전체 시험](W47b-tests.txt), [전체 연결·화면](checkpoint-W47b-navigation.md), [링크 감사](checkpoint-W47b-link-audit.json)를기록한다. 로컬미커밋/미게시상태다. 실제배경위상/gradient·RF/eddy·위상wrapping/noise·영상/변위추정·inversion/품질·실제조직/임상은미구현이다. E01은파동/encoding의두부분모형으로유지한다.
