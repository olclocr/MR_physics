# M03 T2* · R2* · Gaussian echo 범위 검증 (W42)

2026-10-17. **주어진 두 envelope/잡음0 부분 모형 대상 버전 통과.** 실제2Dmap·철정량보정/임상cutoff는 미구현이다. 외부 전문가 검토 미시행.

## 대상 · 사전 기준

[학습 페이지](../../t2star_mapping.html)는 A1의 단일 지수 T2*=40ms/R2*=25s⁻¹와 C03의 T2=80ms/Gaussian σ0/4/8Hz를 비교한다. 지수 예시는 추가 지수R2′12.5s⁻¹를 가정한 것으로 σ에서 이 상수를 유도하지 않는다. Gaussian은 평균주파수0의 연속 정적 분포이며 일반적으로 감쇠가 비지수다.

TE2/5/10/15/20/30/40/60ms,전체8/앞4/뒤4점에 free-intercept log OLS를 적용한다. Curve0–80ms,창0–1.2고정이며 fit 외삽이 넘으면 그림만 clip한다. σ는 지수 모드에서 미적용/disabled다. R2*(s⁻¹)=1000/T2*(ms)를 명시한다.

독립 기준은 지수의 시간 ODE, Gaussian 복소 분포의 ±9SD Simpson구적/횡이완 ODE, Householder QR다. 신호1e−9,기울기1e−10,T2*상대1e−8을 사전 기준으로 정했다. Gaussian 순간 감쇠율은 표시식에서 직접 미분해 구간의 유효 요약과 구별했다. 물리 근거/기존 검산은 [C03](../2026-10-15/C03-physics.html)·[S01](../2026-10-16/S01-physics.html)에 연결하고 공통 모형은 수정하지 않았다.

## 독립 결과

[수집기](M03-numerical.cjs), [결과](M03-numerical.json), [화면 기준](M03-display-reference.json), [구적/ODE/QR 기준](../../../tests/helpers/t2star-fit-reference.cjs), [시험](../../../tests/t2star-fit.test.cjs)을 사용했다.18조합/7,218곡선 표본에서 최대 신호 오차7.94e−15,기울기3.34e−16ms⁻¹,T2*상대2.37e−14,R2*차3.34e−13s⁻¹로 기준을 통과했다. 지수 모드의σ값 차이는 미적용이지만 이전 Gaussian 상태에서 전환 가능한 모든 메뉴 상태로 검사했다.

지수 모드는 모든 범위에서40ms/25s⁻¹, Gaussian σ0은80ms/12.5s⁻¹다. Gaussian σ8Hz는 전체/앞/뒤 T2*가11.279449/29.321069/8.667804ms, R2*가88.656814/34.105168/115.369477s⁻¹다. 정답σ와T2는 그대로인데 선택 범위가 유효값을 바꾼다. 뒤 구간의 추정A6.078316은 정답A1과 다르고 초기 외삽이 크게 벗어나는 점도 표시했다.

## 실제 화면 · 내용 검토

[브라우저 절차](M03-browser-check.js), [결과](M03-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의36상태다. 정답/fit SVG·T2*/R2* 변환·신호/잔차/사용점 표·disabled 상태를 독립 기준과 대조했다. 큰 외삽 곡선 좌표를 포함한 최대 SVG y오차3.05e−5px로 허용1e−4px 이내다. Home/End/ArrowUp·초기화·예시·문제 정답/오답·펼친 수식·모바일 표 탐색을 확인했다. JS 오류와 페이지 가로 넘침은 없었다.

[데스크톱 뒤echo](M03-late-1920.png), [모바일 앞echo](M03-early-390.png), [σ0](M03-zero-1920.png), [모바일 표](M03-table-right-390.png)를 직접 확인했다. Clip 안내와 원래 수치를 유지하며 T2=80ms 표기와 설명의 띄어쓰기도 정리했다.

단위1000배·역수·추정A/정답A·단일지수/Gaussian·순간율/OLS요약·실제분포/범위효과·noise0·고정창/외삽·문제 정답을 검토했다. 높은 유효R2*를 실제 철농도나 새 조직물성으로 확정하지 않는다.

## 버전 · 한계

[대상 SHA-256](M03-versions.json), [최종 전체 시험](W42-tests.txt), [링크 감사](checkpoint-W42-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제GRE sequence/2Dmap·phase/Rician noise·다중 성분·철정량보정/임상cutoff는 남는다.
