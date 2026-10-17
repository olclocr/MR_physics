# S02 기본 · 주기 dipole field와 역문제 검증 (W49)

2026-10-17. **두 조화 모드/주기 경계 부분 모형 대상 버전 통과.** 실제QSM phase처리/field추정·조직/임상 검증이 아니다. 외부 전문가 검토 미시행.

## 대상과 사전 기준

[학습 페이지](../../qsm_dipole_inverse.html)는9³격자/FOV90mm/cell10mm의주기영역이다. 인덱스j0…8의χppm=.2cos(2πjx/9)+hcos[2π(jx+jy+jz)/9]+m이며h0/.1/.2,m0/.1이다. B0방향은z 또는(1,1,1)/√3,λ0/.01/.1의36조건이다. 양끝voxel중심좌표는−40/+40mm,표시단면z0mm(jz4)다. 전체계산/오차는729개voxel이며주기경계밖의유한물체는구현하지않는다.

D(k)=1/3−(k·b)²/|k|²,k0은0이다. χ와δb=δB/B0는서로다른물리량이지만각각무차원ppm으로표시한다. B0크기는상대field에서상쇄되고방향만바꾼다. Fourier정방향은각축1/9의음의합/역방향은양의합이다. 홀수격자로Nyquist단면모호성을피하고알려진낮은공간모드만사용한다.

λ0은|D|<1e−10의성분을0으로두고나머지를나눈최소norm해,λ양수는Dδb/(D²+λ²)의L2해다. 역산평균0은k0기준이지정답평균을관측했다는뜻이아니다. 실제일정χ의유한물체field가항상0이라고확대하지않는다.

[독립 기준](../../../tests/helpers/qsm-dipole-reference.cjs)은DFT를쓰지않고선택한두모드의각도/고유응답을해석적으로계산한다. z방향에서A/B의D는1/3·0,대각선에서0·−2/3이다. 원전식의각도관계와모드별L2회복계수D²/(D²+λ²)를따로유도했다. [시험](../../../tests/qsm-dipole.test.cjs)/[수집기](S02-numerical.cjs)의사전기준은voxel/지표1e−9ppm및대응분율이다.

## 근거와 독립 결과

[Smith등2015 DOI10.1002/mrm.25540](https://pmc.ncbi.nlm.nih.gov/articles/PMC4457712/)의원전Methods검색결과에서3D susceptibility→field식1/3−kz²/|k|²와Hz변환을읽었다. 이페이지는metal/장비수치나실험성능을재현하지않고상대field/선형스칼라모형만사용한다. 일반방향식은kz를k·b로회전한추론이며두모드에직접대입해검산했다.

[Liu등2009 DOI10.1002/mrm.21828](https://pubmed.ncbi.nlm.nih.gov/19097205/)의COSMOS원전초록에서관측방향에따라field를얻어역문제를안정화하는개념을확인했다. 두선택방향의자료를통합하는COSMOS재구성은미구현이다. 검색중2차교육자료에k비의분자/분모가뒤집힌식이노출되어이를근거로사용하지않았고원전Methods의식과각도영점으로대조했다.

[결과](S02-numerical.json), [화면 기준](S02-display-reference.json):36조건/104,976voxel비교(정답/field/역산/재투영)에서최대voxel차이1.14e−15ppm,지표1.25e−15,모드3.34e−16,불필요허수1.69e−15로기준통과다. z/λ0/h.2/m0의χ NRMSE는70.710678%,field잔차0,field RMS0.047140452ppm다. B를0으로바꾸어도같은field이며χ오차는0이된다. m+.1의추가도field를바꾸지않고NRMSE77.459667%가남는다.

대각선에서는다른모드가누락되어기본NRMSE70.710678%,fieldRMS0.094280904ppm다. z/λ.1은관측A도감쇠되어잔차0.003892331ppm/NRMSE70.951308%다. λ가영점정보를복구한결과로표현하지않는다. Field가0인대각선/h0조건에서도잔차절대RMS와χ NRMSE는정의된다.

## 실제 화면과 내용 검토

[브라우저 절차](S02-browser-check.js), [결과](S02-browser-check.json)는Chrome155.0.8059.82,1920×1080/390×844의72상태에서3개z0지도/17,496SVG cell의값→고정색변환·좌표,전체voxel지표/모드표를독립기준과대조했다. 색은고정χ±.5ppm/field±.15ppm이며반올림동률만1e−10의부동소수정리를적용했다. Canvas stub은사용하지않았다.

Home/End/ArrowUp·세예시/초기화·정답/오답·펼친수식·모바일표탐색을확인했고JS오류·가로넘침은없었다. [기본 데스크톱](S02-base-1920.png), [방향 모바일](S02-direction-390.png), [영field](S02-zero-field-1920.png), [표오른쪽](S02-table-right-390.png)을보존하고대표두화면을직접열었다. x축라벨이외곽이아닌끝voxel중심을가리키도록수정하고축좌표검사/72상태를재검증했다. 영field의흰지도는계산된0이며빈그림으로취급하지않는다.

Field/χ·단위/정규화·평균기준·주기/유한경계·각도/영점·자료일치/정답오차·최소norm/L2·고정창/색·퀴즈정답을내용검토했다.

## 버전과 한계

[SHA-256](S02-versions.json), [전체 시험](W49-tests.txt), [전체 연결·화면](checkpoint-W49-navigation.md), [링크 감사](checkpoint-W49-link-audit.json)를기록한다. 로컬미커밋/미게시상태다. 실제GRE위상/field추정·background removal/noise·유한물체경계·이방성·COSMOS통합/정규화알고리즘비교·vendor/임상QSM은남는다. S02는기본부분모형으로유지한다.
