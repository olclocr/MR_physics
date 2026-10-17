# G03 2D/3D·voxel·MPR 검증 (W15)

2026-10-15. **대상 버전 통과 (W15 완료)**. 외부 전문가 검토 미시행.

중심 질문은3D가 언제나 좋은 재단면을 보장하는가이다. 2D z두께·같은voxel·3D 비등방의3관찰을 구현한다. 공통x/y3mm(1.5/3/6), 2D z6mm와3D z3mm(각1.5/3/6/12). 각축48mm의 같은phantom: 배경0.2·상자1, 상자x/y±8,z±3mm. 방향 확인용비대칭표식2개(x−18~−12/y±3/z9~15, 추가밀도0.5; x±3/y12~18/z−15~−9, 추가0.4)를 추가했다. gap0의 이상적 voxel 공간 평균이며 실제RF/3D Fourier PSF·이완/잡음은 계산하지 않는다. MPR은물리좌표0에서 인접 중앙2voxel을0.5/0.5 보간하고 z/y의 위쪽 방향을 유지한다.

사전 독립 기준: 제품의 겹침길이 식을 호출하지 않고 각축4096중점의 indicator를 적분하고 Fubini 곱으로 각voxel과MPR을 구한다. 평균신호 절대허용(0.8+0.5+0.4)×3/(2×4096)=0.000622559. 별도의 정확한 전체3D 물체 부피/적분 신호를 절대1e−8mm³×상대밀도로 확인한다. 같은geometry의2D/3D는배열/화면이정확히일치해야한다. 실제 두화면에서 고정창/축방향/물리aspect/격자·RF/slab도식·키보드/초기화/정답을검토한다.

근거는2026-10-15 실제 읽은 [Larson Volumetric Imaging](https://larsonlab.github.io/MRI-education-resources/Volumetric%20Imaging.html)의2D slice·3D slab/z encoding·SNR/시간 비교 조건이다. MPR·phantom·직육면체 평균은 자체 이상적기하 모형이며 실제진단·contrast·SNR·scanner시간을 예측하지 않는다.

실제 회색 비교의 사전 기준: 독립 중점 적분의 불확실성이 회색 반올림 경계를 넘을 수 있어 적분 기준과 RGB차이는1단계 이내를 허용한다. 실제 모형 값에서 고정 창/회색으로의 연결은 각 실제 canvas pixel에서 정수 정확일치로 별도 확인한다. 비대칭표식은 coronal/sagittal의 z·좌우 방향을 검사하기 위해 추가했다.

## 독립 공간 적분과 내용 판정

대상은 commit `417aa00` 이후 로컬 파일이며 [SHA-256 목록](G03-versions.json)으로 특정한다. [독립 기준](../../../tests/helpers/volume-reference.cjs)은 각축의 indicator 중점 적분과 일반적 물리좌표 trilinear sampler를 사용한다. 제품의 box 겹침 길이 함수·중앙plane 평균 코드를 호출하지 않는다. [수집기](G03-numerical.cjs)와 [결과](G03-numerical.json)를 보존했다.

| 중심 주장·조건 | 관측 결과 | 판정 |
|---|---|---|
| voxel 공간 평균 | 12개 고유geometry의 전체 voxel을 별도4096점/축 적분과 비교. 최대8.682e−5, 사전허용6.226e−4 이내 | 통과 |
| MPR 위치·방향 | 물리좌표0의 trilinear 기준과 전체3단면 최대8.682e−5. 비대칭표식의 위/좌우가 올바름 | 통과 |
| 적분 신호·부피 보존 | 모든geometry에서 전체 적분23541.6 mm³×상대밀도와 일치. 최대오차0(보상합), 허용1e−8 | 통과 |
| 같은geometry의 두 방식 | 양쪽voxel/배열·3개MPR이 정확일치. 실제2D/3D 대비가 같다는 일반화 없음 | 통과 |
| 기본3×3×6 vs3×3×3 | 중앙 axial에서 큰 상자 최대평균0.6/1.0. 부피54/27mm³이며 값은 부피로 나눈 평균 | 통과 |
| 등방·비등방·단위 | 등방은 dx=dy=dz, 3D라도 dz6/xy3은 비등방. FOV각48mm·slice/partition 수48/dz | 통과 |
| RF/slab·SNR/시간 전제·정답 | 2D 각각선택과3D 전체slab+zencoding을 구별. 동일격자의 순수기하만 비교하며 SNR·실제scan time을 밝기에서 추정하지 않음 | 통과 |

초기 대칭 상자만으로는 방향이 뒤집혀도 같은 모습이므로, coronal의 위/왼쪽과 sagittal의 아래/오른쪽에 다른 표식을 더했다. 추가 신호 밀도/좌표를 공개하고 독립 적분·전체부피 기준도 그 전에 갱신했다. 그림은 실제 해부 영상이 아니다.

여기서는3D partition의 실제 Fourier PSF와2D RF profile을 모두 직육면체 공간 평균으로 단순화했다. “3D partition은 별도RF slice” 또는 “실제partition PSF가box”라고 설명하지 않는다. 픽셀/밀도·순서·평균은 같은 정의를 사용하며 물리48×48mm 단면을 항상 정사각형으로 표시한다. 따라서 z셀 개수가 적으면 z방향 칸이 길쭉하다. 정합된2D 묶음도MPR 가능하지만 두께/gap/움직임의 한계가 남는다는 문제 정답과 일치한다.

## 실제 화면·조작 확인

[브라우저 스크립트](G03-browser-check.js), [결과](G03-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/volume_2d_3d.html`,1920×1080·390×844에서 **116상태**. 화면별48개 전체조합과 동일geometry·3D비등방·select Home/End/Tab·모든 답Enter·reset을 확인했다.

- 실제6canvas의 **216,576 pixel**을 독립 적분 기준과 대조했다. 회색 최대차0단계(허용1단계), 실제모형→회색/alpha 정수 연결도 전부 정확일치했다. 물리aspect 1:1, 배열 크기·방향·samegeometry 픽셀 일치, 선택slice/partition 도식의 경계좌표가 일치했다.
- 가로 넘침·빈canvas·페이지JS 오류0. 가장 큰32×32×32격자와 두께12mm의4개partition도 정상 반영됐다.
- 직접 본 화면: [데스크톱 진입](G03-page-1920.png), [모바일 진입](G03-page-390.png), [선택/slab](G03-geometry-390.png), [coronal 데스크톱](G03-coronal-1920.png), [coronal 모바일](G03-coronal-390.png), [sagittal 방향](G03-sagittal-390.png), [같은voxel](G03-matched-390.png), [3D비등방](G03-anisotropic-390.png). 표식·두께·다른 voxel 모양을 눈으로 확인했고 겹침/잘림이 없었다.

`node --test tests/*.test.cjs`: **68/68 통과**. 새2개 시험은 독립 공간/전체부피·MPR·같은geometry·등방/비등방·중앙반례/입력을 확인했다. 시험·실제 화면·물리 내용은 별도 근거다.

## 최종 범위·재검증 조건

G03의 slice/slab/partition 기하 개념, voxel·partial volume·단위·MPR/방향·비교전제·정답을 **대상 버전 통과**로 판정한다. 외부 전문가 검토·실제RF/Fourier PSF·진단·실제SNR/촬영시간은 미시행/모형 밖이다. geometry·phantom·평균·MPR평면/순서·displayaspect/창·RF/slab 설명을 바꾸면 독립 적분/부피·내용/정답과 실제 두 화면을 다시 확인한다. 다음 W16/Q02.
