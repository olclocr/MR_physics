# 검증 보고서 HTML 생성

저장소 루트에서 실행한다. Markdown이 원본이며 생성 HTML은 같은 날짜 폴더에 저장한다. 날짜별 공개 보고서는 [validation-reports.json](validation-reports.json)에 명시한다. 아직 수행하지 않은 물리 검토의 예정 파일은 등록하지 않는다.

```powershell
node scripts/render-validation-reports.cjs
node scripts/render-validation-reports.cjs --date 2026-10-14
node scripts/render-validation-reports.cjs --date 2026-10-14 fix-validation.md
node --test tests/*.test.cjs
```

- 기본 명령은 목록의 `defaultDate`에 등록된 보고서 전체를 만든다. 현재 기본 날짜는 2026-10-14다.
- 다른 날짜는 목록의 `dates`에 실제 원본·출력 파일명·탐색 이름을 추가한 뒤 `--date YYYY-MM-DD`로 지정한다. 새 날짜 등록만으로 기본 날짜를 바꾸지 않는다. 한 파일만 재생성할 때도 날짜를 함께 지정하면 과거 기록의 오수정을 줄일 수 있다.
- 등록되지 않은 날짜·파일·옵션은 오류다. 그 날짜의 모든 등록 원본을 먼저 읽고, 선택한 결과의 로컬 링크·이미지·탐색 대상이 있는지 확인한 뒤 HTML을 쓴다. 누락을 조용히 건너뛰거나 일부 HTML부터 덮어쓰지 않는다.
- 등록된 보고서로 향하는 Markdown 링크만 해당 HTML로 바꾼다. 별도 HTML을 만들지 않는 로드맵·계획·코드 등의 링크는 원래 파일을 유지한다.
- 기존 Markdown을 정정할 때 날짜·이유를 적고 과거 수행 범위를 보존한다. 누락된 과거 화면을 현재 촬영한 화면으로 대체하거나 미시행 검토를 통과 기록으로 만들지 않는다.

`tests/validation-reports.test.cjs`는 생성물과 원본의 일치, 날짜별 처리, 누락 입력·자산의 사전 실패를 확인한다. 실제 보고서 화면 확인은 이 시험과 별도로 수행한다.
