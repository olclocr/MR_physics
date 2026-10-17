# W59 · Pages 보고서 원본 코드 링크 복구

2026-10-17. **로컬 복구 검증 완료 / 다음 예약 게시 대기.** W54 최초 게시에서 Pages는 main의 docs/만 공개하지만 보고서의 독립 검산/시험 링크는 저장소 루트 tests/를 상대경로로 가리켜404가 됨을 확인했다. 공개 `https://olclocr.github.io/tests/helpers/mrs-field-distribution-reference.cjs`의 HEAD가404였다. 로컬 파일 존재 검사로는 공개 URL 범위를 보장할 수 없는 경우다.

`repositorySourceBase`를 명시하고 renderer에서 docs/ 밖의 실제 저장소 파일만 GitHub blob URL로 연결한다. 등록 보고서·docs/ 안 자산/Markdown은 기존 방식이며 존재하지 않는 파일은 계속 실패한다. 과학 본문·모형·물리 판정의 변경은 없고 과거 검증 manifest를 임의 갱신하지 않았다. main 원본 링크는 최신 코드이므로 정확한 검증 버전은 각 기록의 SHA-256으로 구별한다.

전용 fixture 시험으로 공백 경로/fragment·로컬 자산·등록 문서·누락 파일을 확인했다. 최초 fixture에서는 부분 생성 전에 index.html을 만들지 않아 실패했고, fixture의 선행 HTML 생성을 보완한 뒤5개 보고서 시험이 통과했다. 추가로 전체 생성 보고서를 옵션 적용 전/후 메모리에서 만들어 같은 원본의 anchor 목적지만 달라지는지 대조했다. 로컬 W55의 새 원본은 다음 동일 커밋 게시 후 공개 GitHub에서 열 수 있다.

[독립 링크 대조 코드](W59-audit.cjs), [결과](W59-link-changes.json):65개 보고서의91개 링크/89개 서로 다른 원본이 바뀌었다. 각 원본은 실제로 존재하고 변경 전 상대 링크와 같은 파일이다. href 이외의 HTML은 완전히 동일했다. [전체158개 시험](W59-tests.txt)이 통과했다.

[실제 연결 절차](W59-source-browser.js), [결과](W59-source-browser.json)에서 두 화면의 N03-field 보고서 링크와 레이아웃을 확인하고, 원본 링크를 실제 클릭하여 [공개 GitHub 독립 기준](https://github.com/olclocr/MR_physics/blob/main/tests/helpers/mrs-field-distribution-reference.cjs)의 HTTP200과 파일 제목을 확인했다. [모바일 링크 화면](W59-source-link-390.png)을 직접 열어 읽었다.

[전체 Chrome](checkpoint-W59-browser.json)은127개 HTML/두 화면254상태에서 HTTP200·h1·가로 넘침0·JS오류0이다. [정적 로컬 링크 감사](checkpoint-W59-link-audit.json)는3180개 참조 오류0이다. 외부로 바꾼91개는 로컬 참조 수에서 빠지므로 W55의3271과 구별한다. [최종 입력/출력 SHA-256](W59-versions.json)을 보존한다. 과거 보고서 HTML의 코드 목적지 수정 이력은 이 기록으로 남기며 과거 내용 검토를 새로 수행한 것으로 표시하지 않는다.
