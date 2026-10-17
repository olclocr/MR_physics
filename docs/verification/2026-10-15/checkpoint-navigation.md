# W09–W18 연결·기록 체크포인트

2026-10-15. 로컬 작업이며 커밋·푸시·게시하지 않았다. 기준 commit은 `417aa00`이다.

[로컬 참조 감사](local-link-audit.py), [결과](local-link-audit.json): HTML41개와 README·로드맵·물리 계획의 로컬 참조1,097개를 확인했다. 없는 파일·없는 정적 anchor·중복 ID는0이다. JS로 생성하는 그래프의 물리 판정을 이 검사로 대신하지 않는다.

[실제 브라우저 감사](checkpoint-browser.js), [결과](checkpoint-browser.json): Chrome155.0.8059.40, 로컬HTTP8767, 1920×1080·390×844에서16개 학습/포털 페이지와18개 생성 검증 보고서, 총68상태를 열었다. HTTP200·제목·h1·가로 넘침·JS 오류를 확인했고 실패0이다. 기존 C01의 다음 학습 링크를 기존 내용 영역에 넣은 [모바일 화면](C01-navigation-check-390.png), 새 [C06 보고서 모바일](C06-report-390.png)을 직접 보았다. 기존 C01의 계산·시뮬레이션·물리 판정을 이번 navigation 확인으로 새로 판정하지 않는다.

새 페이지를 이어 주는 동안 G01/G02/Q01/C04/C05/G03/Q02의 본문 학습 링크가 추가되었다. 계산·단위·정규화·그림 코드는 유지했다. W09 이후 새 최종 manifest의 페이지 hash를 현재 링크 추가본으로 갱신하고 [이전/현재 hash와 전체 페이지 목록](checkpoint-versions.json)을 저장했다. G01의 초안 manifest와 기존 W01–W08의 과거 검증 기록/버전 목록은 보존했다. 새 최종 manifest의 `navigationAudit`는 이 감사의 브라우저 결과를 가리킨다.

`node --test tests/*.test.cjs` 74/74 통과, `git diff --check` 오류0. 과거 보고서 HTML 변경은 보고서 목록 추가에 따른 공통 navigation 생성 결과다. 새 챕터별 수치·화면·물리 판정은 각 ID 기록을 따른다. 외부 전문가 검토는 수행하지 않았다.
