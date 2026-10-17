# AI01 기본 · 재구성 역할과 자료 일치 검증 (W50)

2026-10-17. **학습 모델 없는 역할/평가 대리모형 대상 버전 통과.** 실제AI·훈련모형·벤더/임상성능 검증은 아니다. 외부 전문가 검토 미시행.

## 대상과 사전 기준

[학습 페이지](../../reconstruction_roles.html)는 N64/FOV64mm의Q06단계원본에j32의작은성분0.15를추가했다. Unitary Fourier의k-space Re/Im에각각σ0/.05/.15의고정seed Gaussian잡음을더하고full/짝수/기존irregular마스크를적용한다. Identity/3tap평활/3tap선명도/1회Haar shrink(.08),획득k치환off/on의72조건이다. 실제학습데이터·네트워크·벤더알고리즘은없음을첫화면/본문/정답에서명시한다.

Q04의RNG와Q06의unitary Fourier/Haar/soft shrink를수정없이재사용한다. 이전Q06의2000반복solver를호출하지않고한번의사전처리로만정의했다. 해당Q06의유한반복제한판정을확대하거나변경하지않았다. 잡음seed0x41493031의128입력을[고정fixture](../../../tests/helpers/reconstruction-roles-noise.json)로보존한다.

[독립 기준](../../../tests/helpers/reconstruction-roles-reference.cjs)은별도radix FFT,평활/선명도의주파수응답,명시적Haar기저행렬과위상/크기soft연산을사용한다. 입력fixture는이미검증된RNG의고정수치로취급하고새분포통과주장을하지않는다. [시험](../../../tests/reconstruction-roles.test.cjs)/[수집기](AI01-numerical.cjs)는복소신호/지표1e−9를사전기준으로두었다.

## 원전과 수치 결과

[Hammernik등2018 DOI10.1002/mrm.26977](https://pmc.ncbi.nlm.nih.gov/articles/PMC5902683/)의원전초록/방법검색결과에서학습된필터/활성함수/prior와데이터항가중을unrolled변분재구성과결합하는구조를읽었다. [fastMRI저자저장소](https://github.com/facebookresearch/fastMRI)의원본k-space/기준구현·학습/평가구분과연결한다. 이페이지는그모형/학습자료/환자성능을재현하지않는다. 대리필터를AI로이름붙이지않는것을내용검토기준에포함했다.

[결과](AI01-numerical.json), [화면 기준](AI01-display-reference.json):72조건/32,256복소값비교에서최대차이1.43e−14,지표4.13e−15로기준통과다. Full/σ.15/평활은입력NRMSE44.628602%→출력31.566863%,자료잔차27.957235%다. 짝수/잡음0/identity는자료잔차0에출력오차49.927174%/누락k오차100%다. Irregular/σ.05/Haar/치환on은자료잔차0,출력오차14.024539%/누락k오차48.620365%다. 단일seed의대리처리예시이지일반AI성능비교가아니다.

자료치환은잡음포함원자료를다시넣고,누락모드를참값으로확인하지않는다. Full에서는누락k오차를null/해당없음으로두어0%라고부르지않는다. 선형위치불변평활/선명도뒤획득값을모두치환하면원래zero filling으로돌아오는것을별도검산했다. 복소NRMSE/획득잔차/누락오차의분모를구별한다.

## 실제 화면과 내용 검토

[브라우저 절차](AI01-browser-check.js), [결과](AI01-browser-check.json)는Chrome155.0.8059.82,1920×1080/390×844의144상태에서27,648회색SVG cell,실수/허수/k크기곡선·표본mask·전체표/지표를독립기준과대조했다. 최대SVG y차이7.70e−6px로1e−4px기준통과다. 회색창0…1.4와실신호곡선−1…2/k크기0…3.5의고정표시를확인했다. Canvas stub은사용하지않았다.

Clip개수시험에서이론상0인선명도결과의부동소수잔여가~1e−14수준으로부호가달라지는것을발견했다. 표시경계1e−10이내만clip개수에서제외하고띠의실제색clamp와원래복소신호는유지했다. 이를본문에명시하고144상태를재검증했다. 주요문장띄어쓰기도정리했다.

[평활 데스크톱](AI01-noise-1920.png), [자료치환 모바일](AI01-consistent-390.png), [누락표본](AI01-missing-1920.png), [표오른쪽](AI01-table-right-390.png)을보존하고대표두화면을직접열었다. Home/End/ArrowUp·세예시/초기화·정답/오답·수식펼침·모바일표가로/세로탐색이통과했고JS오류·가로넘침은없었다.

단위/unitary잡음·실수띠/복소계산·정답/입력/출력·누락0/획득0·정규화/clip·치환/잡음·대리처리/학습모형·질문정답을내용검토했다.

## 버전과 한계

[SHA-256](AI01-versions.json), [전체 시험](W50-tests.txt), [전체 연결·화면](checkpoint-W50-navigation.md), [링크 감사](checkpoint-W50-link-audit.json)를기록한다. 로컬미커밋/미게시상태다. 실제학습/딥러닝·다중coil/실제2D자료·학습분포밖성능/비선형SNR·임상/vendor는미검증이다. AI01은역할/평가의기본부분모형으로유지한다.
