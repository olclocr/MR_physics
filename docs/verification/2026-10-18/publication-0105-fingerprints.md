# W67 · 게시 바이트와 로컬 검토 지문

2026-10-18. **01:05 게시의 새7챕터/지문 대조 통과.** 과거 물리 검토를 새로 통과시킨 기록이나 현재 수정 중 작업물 전체의 승인 기록이 아니다.

## 대상과 발견한 차이

게시 commit은 `a734a1b6b1e091ca09d0a7fea09b1666d2e072f4`다. M02-ECV/G02유한RF/M04complex fit/X05농도/X01위상/X02유입/X13정성 읽기의7개 manifest를 그 commit에서 직접 읽었다.78검토 항목/68고유경로 중56항목은 검토 SHA와 게시 blob SHA가 같고22항목은 CRLF/LF차뿐이었다. 변경된 과학 코드로 판정한 항목이나 확인하지 못한 검토 바이트는0이다.

공유CSS와 일부 브라우저 절차/JSON은 로컬 raw바이트가 Git 게시에서LF로 정규화되어 SHA-256가 달라졌다. 기존 raw 검토 지문을 덮어쓰지 않고 실제 게시 blob SHA와 함께 보존한다. 이 상태를 물리 계산/본문의 변경과 구별한다. 이전 보고서의 “로컬 미게시” 문장은 당시 수행 시점의 기록이며 실제 게시 결과는 [01:05 실행 기록](publication-0105.md)에 있다.

## 판정과 재현 방법

[도구](../../../scripts/publication-fingerprints.cjs), [의미 있는 시험](../../../tests/publication-fingerprints.test.cjs), [전체 대조 JSON](publication-0105-fingerprints.json). 도구는 working manifest가 아닌 명시한 commit의 manifest/blob을 읽는다. 게시 SHA가 검토 SHA와 같으면 exact다. 다르면 원래 검토 SHA에 맞는 바이트를 확보하고 CRLF→LF만 바꾼 UTF-8 바이트가 정확히 같을 때만 line_endings_only다. 임의 Unicode 변환·BOM 제거·잘못된 UTF-8 대체·최종 개행 추가/삭제를 허용하지 않는다.

줄바꿈 차이 항목은 정규화된 UTF-8의 LF 바이트 위치 중 원본에CR이 있었던 위치를 함께 저장한다. 게시 바이트에서 그 위치의CR만 되넣어 원래 검토 SHA를 다시 만족해야 한다. 따라서 이후 checkout이LF가 되어도 원본 지문을 재현할 수 있다. 코드 내용이 바뀌거나 위치 기록이 틀리면 SHA가 맞지 않아 통과하지 않는다.

[원본 파일이 없는 replay 결과](publication-0105-fingerprint-replay.json)는 검토 root를 빈 폴더로 두었다.56exact와22기록 기반 복원으로 동일하게 통과했다. 원본 raw SHA에 맞는 로컬 바이트나 SHA로 확인되는 복원 기록이 모두 없으면 review_bytes_unavailable로 실패시킨다. 올바른 원본이 있는데 정규화한 내용이 다르면 content_changed로 실패한다.

```powershell
$fingerprintAudit = Get-Content docs/verification/2026-10-18/publication-0105-fingerprints.json -Raw | ConvertFrom-Json
$fingerprintArgs = @('scripts/publication-fingerprints.cjs', '--commit', $fingerprintAudit.commit, '--prior-audit', 'docs/verification/2026-10-18/publication-0105-fingerprints.json')
foreach ($manifest in $fingerprintAudit.manifests) { $fingerprintArgs += @('--manifest', $manifest) }
node @arguments
```

이 명령은 해당 게시 commit을 검사한다. Dirty working 파일이 있어도 게시 commit의 과거 지문을 기록으로 복원할 수 있다는 뜻이며, 현재 변경된 working 파일을 새로 검토/승인한다는 뜻이 아니다. 새 게시마다 새 commit과 그 시점의 manifest/검토 바이트를 대조한다. 이번7범위 밖의 오래된 모든 manifest나 아직 게시하지 않은 X14까지 확인했다고 확대하지 않는다.

## 실제 공개 자산과 화면

[공개 Chrome 바이트 절차](W67-public-byte-check.js), [결과](W67-public-byte-check.json)에서 공유CSS·X01모형JS·X13학습HTML·X01브라우저JS/JSON의5자산을 현재 공개 Pages에서 가져와 WebCrypto SHA-256를 계산했다. 모두HTTP200이며 해당 commit의 게시 blob SHA와 같았다. Node의 로컬 파일 SHA만으로 공개 결과를 대신하지 않았다.

혼합 개행/한국어 UTF-8·최종 개행 누락·실제 코드 변경·잘못된 위치 기록·변경된 working manifest/원본 부재를 시험했다. 로컬 Git 임시 저장소 생성은 sandbox권한으로 실패해서 정상 기본 시험에 추가 Git쓰기 권한이 필요하지 않도록 blob 읽기 경계를 주입했다. 실제 Git 읽기 통합은 위7manifest의 실제 a734a1b 대조와 별도 공개 fetch로 검증했다.

보고서 footer에 로컬 raw지문/게시 바이트 구별과 이 대조의 대상 범위 링크를 추가한다. 과학 계산·학습 화면의 물리 모형은 바꾸지 않는다. [전체 시험](W67-tests.txt), [전체 탐색](checkpoint-W67-navigation.md), [링크 감사](checkpoint-W67-link-audit.json), [도구/검증 버전](W67-versions.json)을 함께 확인한다.

최종 통합 검증에서 전체174시험이 통과했고142HTML/284실제상태·로컬 참조3,827개 누락0을 확인했다. [기존71보고서 차이 감사](W67-report-diff-audit.json)는 a734a1b의 각HTML에서 새 footer설명만 추가되었음을 확인했다. [기존 과학 입력 대조](checkpoint-W67-science-inputs.json)는61manifest/536항목이 그대로임을 확인했다. 다섯 날짜 footer의10실제상태와 모바일 설명/대조 보고서 화면도 직접 열어 읽었다.
