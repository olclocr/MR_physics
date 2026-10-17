# W54 전체 연결·화면 점검

2026-10-17. 로컬 미커밋/미게시 상태다. W54 마감 검증을 완료했다.

[전체 시험](W54-tests.txt), [실제 Chrome](checkpoint-W54-browser.json), [링크 감사](checkpoint-W54-link-audit.json), [탐색 해시](checkpoint-W54-versions.json).

Node v22.18.0의 `node --test tests/*.test.cjs`는155개 통과/실패0이다. Chrome155.0.8059.82에서125개 HTML(학습/포털61개·보고서64개)의1920×1080/390×844 두 화면250상태를 확인했다. 모든 주 문서는HTTP200·h1 존재·가로 넘침0·JS오류0이었다. 지정된 후속 챕터와 새 N03-field에서는 수식을 펼친 상태도 포함한다. 이 전체 탐색이 기존 모든 챕터의 모든 조작이나 물리 내용을 새로 검토했다는 뜻은 아니다.

[실제 연결 조작](W54-navigation-browser.js), [결과](W54-navigation-browser.json)에서 포털→N03-field→기존N03→후속→보고서를 두 화면에서 실제 클릭했다. 폭40 예시와 Enter로 초기화, 보고서 목록 펼침과 현재 문서 표식을 확인했다. README의 링크는 정적 경로 감사 대상으로 확인했다.

[데스크톱 보고서](W54-report-1920.png), [모바일 펼친 학습 페이지](W54-expanded-390.png), [모바일 보고서 목록](W54-report-menu-390.png)을 직접 열어 읽었다. 새 보고서 제목/단위/문자·메뉴 줄바꿈/고정 폭은 읽을 수 있고 겹침은 없었다. 개별108상태/표/그래프·기존 캡처 확인은 [물리 기록](N03-field-physics.md)에 있다.

링크 감사는 HTML의 script 블록 밖에 있는 href/src의3,190개 로컬 참조를 확인했고 오류0이다. JavaScript 안의 `${s.url}` 같은 템플릿 문자열은 DOM 링크가 아니므로 제외했다. [감사 코드](checkpoint-W54-link-audit.cjs)를 보존한다. 기존 W53의 참조 수와는 감사 범위가 다르므로 같은 개수로 비교하지 않는다.

최종 URL은 `http://127.0.0.1:8877/docs/`다. 샌드박스 Chrome crashpad·8767 포트 접근 문제는 별도 검증 세션/8877 서버로 복구했다. 페이지의 favicon 자동 요청404는 학습 자산/JS오류와 구별한다. 과학 계산 자산과 새 학습 페이지는 중단 전 검증 버전 그대로다. 기존N03은 후속 링크만 바꾸었고 그 manifest 변경 전/후 hash와 이유를 탐색 해시에 보존했다. W01–W08/G01 초기 manifest는 변경하지 않았다.
