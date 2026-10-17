# N01 · 복소 FID와 spectrum 검증 (W44)

2026-10-17. **지정 가상 성분/유한 기록 모형 대상 버전 통과.** 실제 대사물·조직 정량/진단과 localization은 미구현이다. 외부 전문가 검토 미시행.

## 대상과 사전 기준

[학습 페이지](../../fid_spectrum.html)는 A2ppm/진폭1, B3ppm/진폭0.6의 단일/혼합 신호와 B0 1.5/3T, Hz/내림차순ppm 축,128/512표시의16메뉴 조건이다. 기준은 물4.7ppm, 공통 T2*=80ms, N128/dt1ms이며 실제 물 신호를 추가하지 않는다. 가상 성분을 실제 대사물로 명명하지 않는다.

기존 MRPhysics.free를 수정 없이 재사용한다. FID는 음의 회전 위상, Fourier는 양의 kernel을 사용한다. Δt초 가중 합으로 H의 단위는 상대신호·초이며1/N으로 다시 나누지 않는다. 복소 FID를 변환한 뒤 magnitude를 취한다. 시간 magnitude를 먼저 변환하는 과정과 구별한다.

[독립 기준](../../../tests/helpers/fid-spectrum-reference.cjs)은 복소 이완/회전 RK4의1ms 상태 전이 반복, 별도 radix FFT의 양의 변환, 유한 복소 등비급수의 세 경로다. [시험](../../../tests/fid-spectrum.test.cjs)과 [수집기](N01-numerical.cjs)는 FID/FFT1e−8,등비합1e−10,Parseval1e−12를 사전 기준으로 사용한다. Zero filling의 원래 시간 표본과128격자 값 불변을 별도로 확인한다.

## 근거와 수치 결과

[Stuart Clare,1997 학위논문 §2.2.3–2.2.4](https://users.fmrib.ox.ac.uk/~stuart/thesis/chapter_2/section2_2.html)의 저자 교육 설명에서 위상 감지의 Re/Im·FID·Fourier offset·화학적 환경·상대ppm을 직접 읽었다. [저자/제출 연도](https://users.fmrib.ox.ac.uk/~stuart/thesis/)도 대조했다. 논문의 단순 T2 설명을 실제 MRS의 모든 T2* 성인으로 확대하지 않고 이 페이지는 주어진 단일 지수 T2*를 명시한다. B02/B05/F01의 기존 검증된 부호와 연결했다.

[결과](N01-numerical.json), [화면 기준](N01-display-reference.json):16조건/2,048FID표본/5,120주파수 표본에서 최대 FID 차이1.22e−11,FFT차이1.10e−12,등비합차이9.53e−16,Parseval차이2.85e−16으로 기준 통과다.

A/B의1.5T 주파수는−172.438790/−108.572571Hz,3T에서는−344.877579/−217.145142Hz이며 정답ppm은2/3이다. 수신 범위−500≤f<500Hz,획득DFT간격7.8125Hz,512표시 간격1.953125Hz다. NΔt=128ms와 마지막 표본127ms를 구별한다. 격자 간격을 실제 peak 분리능으로 부르지 않는다. Zero filling은 같은 유한 Fourier 합의 평가점만 늘린다.

## 실제 화면과 내용 검토

[실제 브라우저 절차](N01-browser-check.js), [결과](N01-browser-check.json)는 Chrome155.0.8059.82,1920×1080/390×844의32상태에서 Re/Im·spectrum·peak위치·축 변환/반전·시간/표시 간격·표를 독립 기준과 대조했다. 최대 SVG좌표 차이7.69e−6px로1e−4px 기준을 통과했다. 키보드 Home/End/ArrowUp,세 예시/초기화,정답/오답,수식 펼침,모바일 표 오른쪽 탐색을 확인했다. JS 오류·페이지 가로 넘침은 없었다.

[512표시 데스크톱](N01-filled-1920.png), [ppm 모바일](N01-field-390.png), [단일 성분](N01-base-1920.png), [모바일 표](N01-table-right-390.png)를 보존하고 대표 두 화면을 직접 열었다. 신호축−1.6…1.6,spectrum0…0.13고정,ppm 내림차순과B/A표시를 확인했다. 음의 주파수/부호·Hz/ppm·단위·유한기록/무한선모양·진폭/농도·두 문제 정답을 검토했다.

## 버전과 한계

[SHA-256](N01-versions.json), [전체 시험](W44-tests.txt), [전체 연결·화면](checkpoint-W44-navigation.md), [링크 감사](checkpoint-W44-link-audit.json)를 기록한다. 로컬 미커밋/미게시 상태다. 실제MRS localization·shimming·억제·J결합·위상보정/noise·농도/임상 판정은 미검증이다. Peak 위치/면적/폭·획득 전 감쇠는 N02로 이어간다.
