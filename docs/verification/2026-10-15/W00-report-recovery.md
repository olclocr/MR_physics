# W00 — 검증 보고서와 회귀 시험 복구

날짜: **2026-10-15 (Asia/Seoul)**. 상태: **완료**.

대상 버전: `e14d801` 기반 미커밋 로컬 변경. 시작할 때 AGENTS, README, 작성 지침, 로드맵, 물리 검증 계획 및 실행 절차·계획 검토 기록의 사용자 변경이 있었다. 이를 보존하고 W00 관련 범위만 수정했다. 최종 코드·원본·생성물은 [SHA-256 목록](report-recovery-versions.json)으로 식별한다. 커밋·푸시·배포는 수행하지 않았다.

## 범위와 발견 사항

보고서 생성·링크·회귀 기반을 복구하는 작업이다. 시뮬레이션 계산, 물리 설명·퀴즈, 조직값, 학습 조작은 바꾸지 않았다. 따라서 새 챕터의 물리 검증 보고서는 작성하지 않고 기존 ID의 **재검토 대기** 상태를 유지한다. 이 기록은 챕터 물리 검증 통과 판정이 아니다.

1. 시작 시험은 24개 중 23개 통과, `published report pages and simulation assets have resolvable local links`가 없는 `B00-physics.html`에서 실패했다. B02/B03/B04 개별 보고서도 원본·HTML 모두 없었다.
2. 생성기가 같은 미작성 보고서들을 기본 목록에 넣어 기존 HTML을 일부 쓴 뒤 실패할 수 있었다. 특정 날짜가 코드에 고정되어 있었고, 모르는 파일명은 결과 0개로 조용히 끝날 수 있었다.
3. `fix-validation.md`에 없는 개별 보고서 4개와 화면 5개의 참조가 있었다. 생성 HTML은 원문 일부 갱신을 반영하지 않았다. C01 기록도 HTML이 없는데 원문 링크를 무조건 `.html`로 변환하면 깨지는 구조였다.

## 수정과 인수 기준 확인

| 항목 | 수정·확인 결과 |
|---|---|
| 실제 보고서와 예정 보고서 구별 | [명시적 목록](../../../scripts/validation-reports.json)에 2026-10-14의 README·수정 전·수정 후·C01 원본 네 개만 등록. 미시행 보고서를 만들어 통과시키지 않음 |
| 날짜·부분 처리 | `--date YYYY-MM-DD`와 등록된 원본명 선택 지원. 등록하지 않은 날짜·파일·옵션은 실패. 다른 날짜의 생성물을 보존하는 fixture 시험 통과 |
| 부분 덮어쓰기 방지 | 해당 날짜의 등록 원본 전체를 읽고 선택한 생성물의 링크·이미지를 확인한 뒤 쓰기 시작. 입력/자산 누락 때 기존 출력 두 개가 그대로 남는 시험 통과 |
| 링크와 생성물 일치 | 등록된 원본만 HTML로 변환하고 다른 Markdown 링크는 유지. 원본→생성 HTML 일치와 모든 공개 대상의 로컬 링크 존재 확인. 원래 링크 검사는 유지하고 목록을 공유 |
| 과거 기록 보존 | 수정 후 원문에 2026-10-15 정정 이유·미작성 보고서·누락 화면을 명시. 없는 화면 다섯 개는 원래 파일명을 코드로 보존. 기존 수행 서술·실제 이미지·수치 JSON은 보존 |
| 기존 표시 보존 | CSS와 본문 렌더링 방식을 유지하고 공통 탐색에 C01 기록을 연결. 수정 전 보고서의 Markdown 내용은 변경하지 않음 |

누락 화면은 `mr-te-desktop.jpg`, `mr-mobile.jpg`, `rf-mobile.jpg`, `encoding-mobile.jpg`, `wheel-mobile.jpg`다. 이 과거 화면을 복구했다고 간주하지 않으며 아래의 새 화면은 **보고서 표시 확인**만 증명한다. 생성기의 사용·등록 절차는 [안내](../../../scripts/README.md)에 기록했다.

## 실행 검증

환경: Windows PowerShell, Node **v22.18.0**. 저장소 루트에서 실행했다.

```powershell
node scripts/render-validation-reports.cjs
node scripts/render-validation-reports.cjs --date 2026-10-14 fix-validation.md
node --test tests/*.test.cjs
git diff --check
```

기본 생성은 **보고서 네 개 성공**. 날짜를 지정한 부분 생성은 **한 개 성공**. 전체 회귀 시험은 **28/28 통과**, 실패·skip 없음. 기존 24개와 생성물/날짜/누락 실패/오입력 검증 4개다. 파일이 없으면 건너뛰는 예외를 추가하지 않았다. Git CRLF checkout에서도 생성물 비교가 가능하게 줄바꿈만 정규화한다. `git diff --check` 통과.

과거 시험·검산의 현재 회귀는 확인했지만, 기존 챕터의 주장별 근거와 화면을 새 기준으로 통합 재검토하지 않았다. 외부 전문가 검토는 시행하지 않았다.

## 실제 Chrome 화면·조작

Chrome **155.0.8059.40**, viewport **1920×1080 / 390×844**. URL은 `http://127.0.0.1:8766/docs/verification/2026-10-14/`의 `index.html`, `original-review.html`, `fix-validation.html`, `contrast-chapter.html`이다.

- 네 보고서 모두 두 viewport에서 문서 `scrollWidth=clientWidth`(1920/390)였다. 표·긴 코드·탐색이 페이지 전체를 가로로 밀지 않았다. 긴 코드 블록은 내부 스크롤로 읽는다.
- 총 이미지 7개(수정 전 2, 수정 후 3, C01 2)를 두 viewport에서 각각 스크롤하여 로딩을 확인했다. 깨진 이미지가 없었고 기존 표·본문·이미지의 배치와 캡처를 직접 열어 확인했다.
- 두 viewport에서 ‘수정 후 검산’ 링크 클릭으로 이동하고 ‘C01 구현 검증’ 링크에 focus 후 Enter를 눌러 이동했다. 공통 탐색과 원문 링크는 생성물의 로컬 파일 검사에도 포함된다.
- 페이지 JavaScript 오류 없음. 첫 HTTP 접속의 favicon.ico 자동 요청 404만 관측했으며 보고서·본문 이미지 요청 실패는 없었다.
- 샌드박스 Chrome은 crashpad 오류로 종료되어 호스트에서 검증 브라우저를 실행했다. 샌드박스 8765 서버는 호스트에서 접속되지 않아 종료하고 호스트의 로컬 8766 서버를 사용했다. `file:`은 CLI가 차단하므로 HTTP로 확인했다. 검증 후 세션과 서버를 종료했다.

재현용 [브라우저 조작 코드](report-browser-check.js), [관측 결과 JSON](report-browser-results.json).

| 확인 화면 | 데스크톱 | 모바일 |
|---|---|---|
| 보고서 목록 | [1920px](index-1920.png) | [390px](index-390.png) |
| 수정 전 보고서 | [1920px](original-review-1920.png) | [390px](original-review-390.png) |
| 표 | [1920px](original-table-1920.png) | [390px](original-table-390.png) |
| 수정 후 정정 내용 | [1920px](fix-validation-1920.png) | [390px](fix-validation-390.png) |
| 보존된 본문 이미지 | [1920px](report-image-1920.png) | [390px](report-image-390.png) |
| C01 기존 기록 | [1920px](contrast-chapter-1920.png) | [390px](contrast-chapter-390.png) |

## 다음 작업과 재검증 조건

W00의 생성·링크·회귀·대표 화면 인수 기준을 충족했다. 다음은 **W01 C01 내용·모형·화면의 통합 재검토**다. 로드맵의 W01–W03 카드를 유지했다. 새 보고서는 실제 수행 후 목록에 등록하며, 원본·목록·렌더러 변경 시 생성물 일치와 링크·대표 화면을 다시 확인한다. 미보존 과거 화면, 미시행 챕터 물리 검토, 외부 전문가 검토는 이번 복구의 완료 범위에 포함되지 않는다.
