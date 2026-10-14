# 2026-10-14 과학 검증 기록

MR Physics의 HTML 시뮬레이션 4개를 검토하고 주요 오류를 수정한 기록입니다.

- [수정 전 과학·교육 검증 보고서](original-review.md): GitHub 커밋 `0006c3b`의 문제 13개, 코드 위치, 재현 조건과 문헌 근거.
- [수정 후 구현 및 검산](fix-validation.md): 각 문제의 수정 상태, 모델의 가정, 수치 및 실행 검증 결과.
- [웹에서 렌더링된 보고서](https://olclocr.github.io/MR_physics/verification/2026-10-14/): 별도 프로그램 없이 GitHub Pages에서 읽을 수 있습니다.
- [수정 전 수치 결과](numerical-results.json)와 [재현 스크립트](original-audit.cjs).

GitHub에서는 이 Markdown과 연결된 보고서를 렌더링해서 읽을 수 있습니다. 웹 버전에는 표, 코드, 재현 화면과 출처 링크를 포함했습니다.

수정 후 시험은 저장소 루트에서 다음 명령으로 실행합니다.

```powershell
node --test tests/physics-scientific.test.cjs
node scripts/render-validation-reports.cjs
```

범위: RF 라머 공명, 양성자 MR, Frequency/Phase Encoding, 자전거 바퀴. 별도로 작업 중인 K-space/Inverse Fourier 페이지는 이번 변경에 포함하지 않았습니다.
