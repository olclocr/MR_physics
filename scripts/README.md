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
- `repositorySourceBase`를 지정하면 `docs/` 밖에 실제로 존재하는 저장소 원본(예: 독립 검산 `tests/`)은 해당 GitHub blob URL로 연결한다. Pages의 `/docs` 공개 범위를 벗어난 상대 링크404를 막기 위한 설정이다. `docs/` 안의 자산·Markdown과 등록 보고서 링크는 기존 방식이며 없는 로컬 파일은 계속 오류다. 저장소 소유자/기준 브랜치가 바뀌면 이 URL도 갱신한다.
- 기존 Markdown을 정정할 때 날짜·이유를 적고 과거 수행 범위를 보존한다. 누락된 과거 화면을 현재 촬영한 화면으로 대체하거나 미시행 검토를 통과 기록으로 만들지 않는다.

`tests/validation-reports.test.cjs`는 생성물과 원본의 일치, 날짜별 처리, 누락 입력·자산의 사전 실패를 확인한다. 실제 보고서 화면 확인은 이 시험과 별도로 수행한다.
## 게시 SHA-256 대조

검토 지문은 당시 로컬 바이트 기준이다. Git의 줄바꿈 정규화 뒤 게시 blob 지문과 다를 수 있으므로 `publication-fingerprints.cjs`로 대상 commit의 manifest/blob을 비교한다. `--commit`에는40자리 commit SHA, `--manifest`에는 해당 commit의 검토 JSON 경로를 반복해서 넣는다. `--output`은 결과 JSON을 쓸 때 지정한다.

원본의 검토 SHA가 확인되고 CRLF/LF만 같은 경우에만 통과한다. 차이 항목의 `reviewCRLFPositions`는 정규화한 UTF-8의 바이트 위치이며, 이후 `--prior-audit 결과.json`으로 원본 바이트를 복원해 SHA를 재검증할 수 있다. 기록이 다른 코드를 줄바꿈 차이로 숨길 수는 없다. 원본/복원 지문이 없거나 내용이 다르면 실패한다. 현재 working 파일의 새 검토 승인과 과거 게시 commit 검사는 구별한다.

`validation-reports.json`의 선택 설정 `publicationFingerprintReport`는 검증 폴더 안의 대조 보고서를 가리킨다. 등록된 Markdown이면 해당 HTML로 연결하고, 모든 보고서 footer에서 로컬 지문/게시 바이트와 대조 범위를 구별한다. 누락/범위 밖 경로는 쓰기 전에 실패한다. 새 날짜의 대상 HTML을 처음 만들 때는 그 날짜를 먼저 렌더한 뒤 다른 날짜를 재생성한다.

[01:05 게시의 실제 대조/재현 예시](../docs/verification/2026-10-18/publication-0105-fingerprints.md)를 참고한다. 기존 검토 SHA를 게시 SHA로 덮어쓰거나 지문 감사만으로 물리 검토를 새로 통과시키지 않는다.
