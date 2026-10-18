# W81 · 학습 본문의 띄어쓰기와 단위 읽기

2026-10-18. **공백 편집의 바이트/표시 데이터 보존 검증 완료.** 곡률/기저·단일 구획·표지 도달·단일 tensor·두 성분의 최근 5개 학습 HTML에서 정적 본문·단위·확인 문제·출처의 공백을 183곳 다듬었다. 과학 내용/수식/정답 의미·계산·입력 범위는 바꾸지 않았다. 새 물리 판정을 부여하지 않는다. 전체 탐색 결과는 마지막 절에 기록했다.

## 변경 범위와 정확한 복원

[편집 전 77개 manifest/705항목](W81-before-versions.json)과 [편집 목록](W81-copy-edits.json)을 고정했다. [검사 절차](W81-copy-audit.cjs)·[결과](W81-copy-audit.json)는 700개 입력 바이트 불변, 5개 학습 HTML의 공백만 변경을 확인했다. 각 정적 text node의 원문/수정문과 위치를 기록했고 역치환으로 이전 파일 SHA를 정확히 재현했다. 모든 비공백 문자, 실제 태그/속성, script/style 전체 바이트가 동일하다.

링크·강조로 분리된 문장은 text node별로 편집했다. 기존 <1분 부등호를 태그처럼 취급하던 편집기의 분류도 수정했다. 부등호를 포함한 수식 문자와 HTML 태그는 보존하고 주변 공백만 다듬었다. 임시 공백 편집을 재정리할 때도 소유한 수정의 SHA/역치환을 확인한 뒤 정확히 복원했으며 사용자 변경을 삭제하거나 Git reset/stash를 사용하지 않았다.

동적으로 만드는 SVG 글자·상태/피드백 문자열은 script 바이트 보존 범위이며 이번 정적 본문 편집으로 바꾸지 않았다. 실제 신호/임상 의미나 기존 판정을 새로 검증한 것으로 확대하지 않는다.

## 실제 화면과 표시 데이터

[편집 전 40개 상태](W81-before-browser.json)와 [최종 40개 상태](W81-browser-check.json), [절차](W81-browser-check.js), [비교](W81-browser-comparison.json)를 대조했다. Chrome 1920/390px에서 다섯 페이지의 기본값과 세 예제를 확인했다. 모형 결과 전체·모든 표 셀·SVG outerHTML의 직렬화 SHA-256과 출력 텍스트/행 수가 모두 일치했다. JS 오류/페이지 가로 넘침은 없었다.

[설명 읽기 절차](W81-reading-browser.js)·[두 화면 10경로](W81-reading-browser.json)는 접힌 설명·본문·출처를 펼치고 각 페이지의 문제 버튼 4개와 키보드 초기화를 확인한다. [ASL 선행 설명](W81-label_arrival_decay-390.png), [단일 tensor 본문](W81-diffusion_tensor_direction-content-390.png), [혼합 본문](W81-diffusion_tensor_mixture-content-390.png), [기저/수식](W81-polynomial_field_basis-content-1920.png), [구획 출처](W81-compartment_input_washout-source-390.png)를 직접 읽었다. 최종 출처와 부등호 주변의 공백 수정 뒤 화면 자료도 다시 확인했다.

12:27 무렵 마지막 화면 명령은 계정 사용 한도로 자동 승인 검토가 실패하여 실행되지 않았다. 사용 한도 조회/크레딧 사용/승인 우회를 하지 않았다. 안내된 재시도 시각을 지난 15:33 이후 같은 정식 승인 경로에서 최종 검증을 수행했다. 이전 11:55 게시는 이미 완료되어 중복 실행하지 않았다.

[편집 대상 버전](W81-versions.json), [전체 회귀](W81-tests.txt). 기존 X15-basis/X07/X08/X12/X12-mixture의 내용 판정은 공백 외 문자와 계산/표시 불변 근거로 보존한다. 이전 화면 절차의 정확한 문장 assertion은 당시 문구의 기록이며 최신 공백 버전은 W81 절차를 사용한다.

## 통합 검증 완료

[전체 173개 HTML·346개 실제 상태](checkpoint-W81-browser.json), [절차](checkpoint-W81-browser.js), [4,620개 로컬 참조](checkpoint-W81-link-audit.json)는 오류/누락 0이다. [전체 200개 시험](W81-tests.txt)도 통과했다. [포털/보고서 목록 실제 탐색](W81-navigation-browser.js)·[결과](W81-navigation-browser.json)와 대표 보고서 화면을 두 화면에서 확인했다. 기존 77개 manifest의 5개 HTML 지문만 공백 편집 근거로 갱신했으며 [버전 대조](checkpoint-W81-versions.json)와 [편집 입력 16개](W81-versions.json)를 함께 보존한다. 다음 작업은 W82이며 아직 구현하지 않았다.
