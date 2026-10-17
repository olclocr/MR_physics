# A06 B1 · 수신 gain · RF 중 B0 부분 모형 검증 (W39)

2026-10-17. **세 기전 부분 모형 대상 버전 통과.** 실제 RF 간섭/zipper·다중 coil/noise·보정·QA·안전/진단은 미구현이다. 외부 전문가 검토 미시행.

## 대상 · 사전 기준 · 근거

[학습 페이지](../../b0_b1_receive_shading.html)는 균일 M0=1,N64/FOV160mm/2.5mm, 초기+z, RF8ms 직후를 사용한다. h(y)=cos(2πy/160mm),v0/.25/.5/.75/1,nominal45/90°다. TX는B1scale=1+v h, RX는gain=cos(πv h/2), B0는df=60v h Hz이며 나머지 기전은 기준값으로 고정한다. 회색 창0–1이며 위치별 이상적 신호 지도다. k-space/PSF 재구성·이완·noise·spoil은 없다.

F03의 순수 pulse 회전에서 spoiling 전 sqrt(Mx²+My²)를 재사용한다. F03의 saturation→spoil→다음RF 흐름이나 |Mz| 출력 전체를 재사용하는 것이 아니다. RX gain은 원인 구별 반례를 위해 고른 고정 함수다. nominal90°에서는 TX와 동일 밝기가 되지만45°로 바꿔도 gain 함수를 변경하지 않는다. 실제 송신/수신 map이 이런 관계라는 주장을 하지 않는다.

독립 기준은 기존 별도 Bloch RK4 ODE를 사용한 RF진화와 수신 gain 곱이다. 30조합/64위치의 Mxy/Mz/최종신호·B1/gain/df를 절대1e−9로 비교한다. 90° 밝기 동일성,45°/v>0에서의 차이, v0 균일 기준, flip 변경 시 gain 불변을 확인한다.

유한 RF의 근거는 F03의 원전/검증에, 수신 감도의 곱셈 모형은 Q04에 연결한다. [Yarnykh,2007 원전 초록](https://pubmed.ncbi.nlm.nih.gov/17191242/)에서 별도 RF 획득/가정을 사용하는 AFI 송신 field 측정의 범위를 확인했다. 이 페이지는 AFI의 두TR·steady state·spoiling이나 실제B1 추정을 구현하지 않는다. 단일RF 두 flip의 직접 만든 비교 실험이다.

## 독립 결과

[수집기](A06-numerical.cjs), [결과](A06-numerical.json), [독립 화면 기준](A06-display-reference.json), [ODE 기준](../../../tests/helpers/shading-reference.cjs), [시험](../../../tests/shading.test.cjs)을 사용했다. 30조건/선택1,920voxel/세 모드5,760voxel에서 최대 오차는 최종신호/Mxy9.55e−15, Mz8.89e−15, map parameter3.56e−14였다. 전 항목이 사전 기준을 통과했다.

기본v.5/90°의TX/RX는 min0.707107/max1로 같고 최대 차이2.23e−16이다.45°에서TX는0.382683…0.923880, RX는0.5…0.707107이며 최대 차이0.423880이다. RX gain은 두 flip에서 동일하다. v0은45°에서도 모든 기전의 신호가 sin45°로 같으므로 상태 안내를 별도로 조건화했다. 45°가 모든 원인을 항상 구별한다는 주장을 피했다.

## 실제 브라우저 · 내용 검토

[절차](A06-browser-check.js), [결과](A06-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의60상태다. 두 canvas7,680개 pixel 중심, 선택 map/세 신호 SVG·범위/차이·64위치 중간값 표를 독립 기준과 대조했다. 최대 SVG y오차7.53e−6px로 허용1e−4px 이내다. Home/End/ArrowUp·초기화·세 예시·문제 정답/오답·펼친 설명/표·모바일 표 좌우 탐색을 확인했다. JS 오류와 페이지 가로 넘침은 없었다.

[데스크톱90°](A06-base-1920.png), [모바일45°](A06-flip45-390.png), [수신 gain 예시](A06-rx-1920.png), [모바일 표](A06-table-right-390.png)를 직접 확인했다.90°에서 겹친 두 선이45°에서 갈라지는 것과 고정 창/비정규화 신호를 확인했다. 흰색 M0 canvas는 값1의 기대 출력이며 빈 그림이 아니다.

단위·RF duration/flip·B1scale/gain/df의 구별·Mxy와Mz·nominalon-res각도와off-res회전·spoil전 읽기·RF직후/실제MRI재구성 구별·고정 수신 gain·비식별반례의 인위적 설계·v0 예외·문제 정답을 검토했다. 단일밝기나45°의 추가예시를 실제 원인 진단/보정 성능으로 확대하지 않는다.

## 버전 · 한계

[대상 SHA-256](A06-versions.json), [최종 전체 시험](W39-tests.txt), [링크 감사](checkpoint-W39-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제 RF 간섭/zipper·coil noise/correlation·receive phase·이완/spin history·B0/B1map 추정·실제 보정·장비 QA/RF안전·진단은 남는다.
