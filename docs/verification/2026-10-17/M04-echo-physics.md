# M04 후속 · Echo 감쇠와 지방 spectrum 검증 (W43b)

2026-10-17. **주어진 spectrum/완벽한 성분 분리의 부분 모형 대상 버전 통과.** 실제 CSE/PDFF 추정·다중 교란 보정의 검증이 아니다. 외부 전문가 검토 미시행.

## 대상과 독립 기준

[학습 페이지](../../pdff_echo_assumptions.html)는 기본 T1 bias 페이지와 분리된 T1 가중 없는 모형이다. 밀도 합1, 지방 분율0/.3/.5/1, B0 1.5/3T, TE0/2/4/6/8/12ms, 단일/6peak, 공통/서로 다른 T2*, 원신호/정답 모형 역산의384조건을 제공한다. 물·지방의 복소 신호는 이미 정확하게 분리되어 제공된다고 가정한다. TE0은 수학적 기준이다.

물 T2*=40ms, 지방 T2*=40/20ms는 교육용 값이며 각 지방 peak의 T2*는 같게 둔다. B0는 ppm→Hz 변환만 바꾼다. 음의 복소 위상, 초 변환, 공통 양성자 상수는 기존 F01 규약을 따른다. F01의 −3.5ppm 자산은 수정하지 않고 이 페이지의 단일 비교 peak는 −3.4ppm으로 명시했다.

[독립 기준](../../../tests/helpers/pdff-echo-reference.cjs)은 dZ/dt=(−1/T2*−i2πΔf)Z를 0.001ms 이하의 RK4 시간 단계로 적분한다. 직접 삼각함수·지수식의 제품 계산과 별개다. 신호와 분율의 사전 허용 오차는1e−8이다. [수집기](M04-echo-numerical.cjs)는 384조건과46,464곡선 표본을 대조한다.

## 원전과 수치 결과

[Hamilton 등 2011, DOI10.1002/nbm.1622, Table3](https://pmc.ncbi.nlm.nih.gov/articles/PMC3860876/)의 관측6peak와 상대 비율을 원문 검색 결과에서 확인했다. 직접 PMC 열기는 captcha였고, 본문 검색 결과의 Table3 내용으로 대조했다. 물4.7ppm 기준 변환은 [Wang·Hernando·Reeder 2016, DOI10.1002/mrm.25681, Table1](https://pmc.ncbi.nlm.nih.gov/articles/PMC4592785/)에 재대조했다. −3.8/−3.4/−2.6/−1.95/−.5/+.6ppm의 비율은8.8/70/12/.6/3.9/4.7%, 합100%다. Hamilton의 MRS T2 수치를 이 페이지의 교육용 T2*로 취급하지 않았다.

Wang의 원전 초록/본문 표는 spectrum 가정의 영향 근거이며, 이 페이지의 성분 크기 역산은 논문의 mixed/magnitude fitting을 구현하지 않는다. 알려진 모형에서 결과가 정확하다는 사실을 환자 성능이나 특정 spectrum의 우월성으로 확대하지 않는다.

[결과](M04-echo-numerical.json), [화면 기준](M04-echo-display-reference.json), [시험](../../../tests/pdff-echo.test.cjs): 최대 복소/가중 차이1.09e−11, 분율9.21e−13, 곡선1.71e−12로 기준 통과다. 모든 곡선에서 지방 크기 가중의 최소값은0.34658558이어서 선택 범위의 역산 분모는0이 아니다. 이 결과는 일반 spectrum의 영점이 없다는 주장이 아니다.

밀도30%·3T·TE4ms의 원신호 분율은 단일/공통30%, 단일/서로 다른 감쇠27.942857%,6peak/공통21.267236%,6peak/서로 다른 감쇠19.640892%다. 정답 모형 역산은30%이며, TE0과 순수 성분 경계도 유지한다. 지방 peak를 복소수로 합한 뒤 크기를 구한다. 물/지방 간 OP와 지방 내부 상쇄를 구별하고, 두 성분 크기의 합을 원래 voxel magnitude로 표시하지 않는다.

## 실제 화면과 내용 검토

[브라우저 절차](M04-echo-browser-check.js), [결과](M04-echo-browser-check.json)는 Chrome155.0.8059.82의1920×1080/390×844에서768상태를 확인한다. 각 상태의 분율 출력·Re/Im/크기/단위 밀도 가중 표·분율/두 신호 SVG와 선택점이 독립 기준과 일치하는지 대조했다. 최대 SVG y차이는7.70e−6px로1e−4px 기준을 통과했다. JS 오류와 페이지 가로 넘침은 없었다. 키보드 Home/End/ArrowUp, 세 예시·초기화, 정답/오답, 수식 펼침, 모바일 표 탐색도 확인했다.

[데스크톱 spectrum](M04-echo-spectrum-1920.png), [모바일 역산](M04-echo-known-390.png), [감쇠 차이](M04-echo-decay-1920.png), [표 오른쪽](M04-echo-table-right-390.png)을 보존한다. 두 대표 화면을 직접 열어 고정축과 범례·밀도/신호·원신호/정답 역산의 표시를 확인했다. 원전 peak·단위·부호·감쇠·밀도 정의·문제 정답을 내용 검토했다.

## 대상 버전과 한계

[SHA-256](M04-echo-versions.json), [전체 시험](W43b-tests.txt), [전체 연결·화면](checkpoint-W43b-navigation.md), [링크 감사](checkpoint-W43b-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제 물/지방 분리·field/감쇠/spectrum 추정·noise/B1·J결합/교환·장비PDFF/임상 cutoff는 미검증이다. |c|가 작은 경우 잡음 증폭도 미구현이다. M04는 두 부분 모형 구현으로 유지하며 전체 임상 정량 검증으로 표시하지 않는다.
