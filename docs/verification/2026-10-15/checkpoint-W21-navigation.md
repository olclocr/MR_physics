# W21까지의 연결·기록 체크포인트

2026-10-15. 기준 commit `417aa00` 이후 로컬 개발이며 커밋·푸시·게시하지 않았다.

[로컬 참조 검사](local-link-audit.json): HTML47개, 로컬참조1,317개에서 없는 파일/정적anchor·중복ID0. [실제 브라우저 감사](checkpoint-W21-browser.js), [결과](checkpoint-W21-browser.json): Chrome155.0.8059.40, 로컬HTTP8767, 1920×1080·390×844에서20개 학습/포털 페이지와21개 생성 보고서, **82상태**를 열어 HTTP200·h1·제목·넘침·JS오류를 확인했다. 실패0이다. 새 [F01 모바일 보고서](W21-F01-report-390.png), [Q04 데스크톱 보고서](W21-Q04-report-1920.png)를 직접 보았다.

후속 페이지 링크로 바뀐 새 최종manifest는 [이전/현재hash 목록](checkpoint-W21-versions.json)에 기록하고 현재hash로 갱신했다. B03/B05 등 기존 페이지의 추가는 학습 연결이며 과거 물리 기록의 판정 범위를 확대하지 않는다. W01–W08 과거 버전 목록과 G01초안manifest는 보존했다. 생성 보고서의 공통navigation 갱신은 원래 Markdown 판정을 바꾸지 않는다.

`node --test tests/*.test.cjs` **80/80 통과**, `git diff --check` 오류0. W09–W21의 각 챕터 수치·화면·내용 검토는 해당ID 기록에 있으며 외부 전문가 검토는 미시행이다. 다음 W22/F02가 진행 중이고 대기열에는W23–W25를 유지한다.
