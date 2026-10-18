# W80 · 알려진 격자와 영상 거리 통합 검증

2026-10-18. [독립 24조건·실제 48개 상태·내용 판정](X17-physics.md), [전체 200개 시험](W80-tests.txt), [전체 172개 HTML·344개 실제 상태](checkpoint-W80-browser.json)가 통과했다. 학습 83개·보고서 89개이며 JS 오류·페이지 가로 넘침이 없었다. [탐색 절차](checkpoint-W80-browser.js)·[4,557개 로컬 참조](checkpoint-W80-link-audit.json)의 누락은 0이다.

[실제 왕복 탐색](W80-navigation-browser.js)·[결과](W80-navigation-browser.json)는 포털→새 페이지→G01 선행/후속→검증 보고서와 접힌 목록의 현재 링크를 두 화면에서 확인했다. 대표 도식·간격/길이 지표와 [모바일 보고서](W80-report-390.png)를 직접 읽었다.

[기존 76개 manifest](checkpoint-W80-versions.json)는 G01 학습 HTML의 후속 링크 추가만 허용했다. 기존 계산은 바뀌지 않았다. 최초 전체 버전 목록 작성은 아직 생성하지 않은 X17 보고서 HTML 때문에 중단됐다. 이때 완료한 G01/새 모형 지문 쓰기를 삭제하지 않고, d7fb7dd의 기존 manifest에서 원래 SHA를 읽어 링크 제거로 정확한 이전 바이트를 재현했다. 보고서를 생성한 뒤 전체 버전/링크·실제 탐색을 재검증했다. [새 모형 10개 입력](X17-versions.json)과 기존 물리 판정을 구별한다.

W80은 로컬 개발 결과다. 게시 완료는 별도 [11:55 실행 결과](publication-1155.md)의 d7fb7dd까지이며 다음 승인 예약은 15:33이다. 다음 W81, 후속 W82/W83/W84를 유지한다.
