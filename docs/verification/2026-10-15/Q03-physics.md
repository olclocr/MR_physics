# Q03 검사 시간·이벤트 수 검증 (W17)

2026-10-15. **대상 버전 통과 (W17 완료)**. 외부 전문가 검토 미시행.

중심 질문은 어떤 이벤트를 세어야 검사 시간을 알 수 있는가이다. ETL·2D interleaving 용량·NEX/gating을 세 관찰로 비교한다. 기본2D/Ny128/16slices/ETL8/TR4000ms/NEX1/효율1. 조작 Ny32/64/96/128, sections4/8/16/32, ETL1/4/8/12/16, TR200~4000ms step200, NEX1/2/4, 효율1/0.5.

교육 시나리오: active=20+ETL×10ms. 2D는 TR 안에 slice train을 순서대로 배치하고 phase 묶음별로 반복한다. 3D는 ky,kz쌍을 한 목록으로 묶어 ETL개씩 읽으며 train이kz경계를 넘을 수 있다. 마지막 불완전 train도 같은 active 시간을 예약한다. 준비10s와dummy4TR은 시작에1회, gating50%는 데이터 구간의대기/허용 슬롯을 번갈아 둔다. 마지막의 완전TR도 포함한다. 실제 장비 시간·contrast·RF/gradient 한계는 예측하지 않는다.

독립 확인은 slice train을 빈 TR에 실제로 하나씩 넣는 while-packing과 phase쌍을 echo별로 꺼내는 목록 열거를 사용한다. 공식 ceil/floor 계산의 복제를 기준으로 하지 않는다. 모든 허용 조합의 데이터TR·각측정수·gating/dummy시간 합과 표식을 대조한다. 횟수는 정수 정확일치, 시간은1e−9s, 실제 SVG좌표1e−6을 사전 허용한다. ceil의 나머지·slice 용량 경계·NEX 고정준비·3D 배정/다른정책의 차이를 검토한다.

근거는 Larson Volumetric Imaging·SNR의 interleaving·두 phase방향·TR 주기 수이며 실제 자료를 앞 작업에서 읽고 해당 조건을 다시 대조한다. 고정20ms/10s/4TR·규칙적gating은 자체 교육 시나리오다.

## 독립 이벤트 열거와 시간 검산

대상은 commit `417aa00` 이후 로컬 파일이며 [SHA-256 목록](Q03-versions.json)으로 특정한다. [독립 기준](../../../tests/helpers/scan-time-reference.cjs)은 slice train을 남은 TR에 하나씩 넣고, phase 쌍을 echo별로 꺼내며, dummy·대기·데이터 slot의 시간을 합한다. 제품의 ceil/floor 공식을 기대값으로 복사하지 않는다. [수집기](Q03-numerical.cjs)와 [결과](Q03-numerical.json)에 모든 허용 조합 **19,200개**를 저장했다.

| 검토 항목 | 결과와 기준 | 판정 |
|---|---|---|
| 데이터·대기·dummy TR 수 | 독립 packing/열거와 모든 조건 정수 정확 일치 | 통과 |
| 전체 시간과 구성 | 최대 차이 1.4552e−11 s, 사전 기준 1e−9 s | 통과 |
| 2D 반복 순서 | 한 slice 묶음의 전체 Ny를 마친 뒤 다음 묶음. 같은 묶음의 예정 RF 간격을 TR로 유지 | 통과 |
| 3D 나머지 | ky가 빠른 연속 phase 쌍 배정. ETL12의 불완전 train과 kz 경계 횡단도 목록과 일치 | 통과 |
| NEX·고정 준비 | 데이터만 NEX배, 시작 준비10 s·dummy4 TR은 한 번. 50% gating은 데이터 부분에만 대기 삽입 | 통과 |
| 시간 정의 | ms→s, 마지막 완전 TR 포함, 예정 slot TR과 gating 뒤 실제 RF 간격을 구별 | 통과 |

검토 중 2D 묶음을 TR마다 번갈아 읽는 설명/배정을 발견했다. 그 방식은 같은 slice의 RF 간격을 묶음 수만큼 늘리므로, 한 묶음을 끝낸 뒤 다음 묶음으로 가는 concatenation 순서로 수정하고 전체 조합을 재검증했다. 시간 기준 수집기에서는 초 단위 누적의 미세 반올림을 줄이도록 정수 ms를 합한 뒤 변환했다.

기본값은 한 train100 ms, TR4000 ms에 최대40 slices, 16개의 데이터 TR, dummy 포함20 TR, 전체90 s다. TR1000 ms에서는 최대10 slices여서16 slices는 두 묶음이고 전체46 s다. 따라서 TR 감소가 전체 시간에 단순 비례하지 않는다. 3D의 다른 배정 규칙인 Nz×ceil(Ny/ETL)과 현재 ceil(Ny×Nz/ETL)은 나머지 처리에 따라 달라질 수 있으며 현재 규칙을 장비 일반 공식으로 주장하지 않는다.

## 실제 화면·조작·내용 검토

[브라우저 스크립트](Q03-browser-check.js), [결과](Q03-browser-check.json): Chrome155.0.8059.40, `http://127.0.0.1:8767/docs/scan_time.html`, 1920×1080·390×844에서 **1,004개 상태**를 확인했다. 독립 이벤트 열거로 실제 SVG의 slot 색·좌표·시간표·데이터 목록·반올림 수치를 비교했다. 각 화면에서 2D/3D·Ny·slice/partition·ETL·TR·NEX·gating 조합과 예시, 키보드 경계 조작, 양쪽 문제 답과 초기화를 확인했다. JS 오류·가로 넘침은0이다.

[모바일 진입](Q03-page-390.png), [2D packing](Q03-packing-390.png), [데스크톱 gating](Q03-gating-1920.png), [모바일 시간표](Q03-times-390.png)를 직접 보았다. 12개 TR의 번호·범례·시간 끝점과 표가 읽히며 겹침/잘림을 발견하지 않았다. 고정 준비는 도식 밖 시간10 s로 명시하고, 도식이 전체 검사 중 처음 몇 TR만 확대한다는 설명을 확인했다.

`node --test tests/*.test.cjs`: **72/72 통과**. 새2개 시험은 전체 조합의 독립 event 비교와 경계·불완전 train·순서·고정 준비·입력 조건을 다룬다. 이 시험 결과와 실제 화면/내용 판정은 별개다.

## 최종 판정과 적용 범위

Q03의 명시적 2D/3D 배정, TR·ETL·phase 수·NEX·gating의 횟수와 시간, 단위·도식·표·오개념/정답을 **대상 버전 통과**로 판정한다. 실제 장비 시간 견적, 생리적 trigger 분포, 가변 active 시간, RF/gradient 한계, gating 뒤 정상상태·대비, 실제 임상 동등 화질 비교는 모형 밖이다. 외부 전문가 검토는 미시행이다. 배정 순서·active/dummy/준비·gating·시간 정의를 바꾸면 독립 열거와 실제 두 화면을 재검증한다. 다음 W18/C06.
