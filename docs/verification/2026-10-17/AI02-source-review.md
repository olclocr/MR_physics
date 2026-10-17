# AI02 주장과 출처의 대조

2026-10-17 확인. 제조사 공개 자료의 설명 범위만 대조했다. 설치 software 버전·독립 임상 우열은 미확인이다. 날짜는 본문/문서 표기이며 검색엔진 날짜는 사용하지 않았다.

| 자료 | 직접 읽은 위치와 대조한 주장 | 자료 날짜/버전과 한계 |
|---|---|---|
| [GE AIR Recon DL](https://www.gehealthcare.com/en/products/magnetic-resonance-imaging/signa-mr-vision/effortless-imaging-ai-mri-solutions/air-recon-dl) | 제품 설명의 noise/ringing 감소, evolution의3D/PROPELLER 확대 | 발행일·software 버전 미표기. 제품 소개/예시이며 설치별 지원·독립 성능은 확인하지 않음 |
| [Siemens 기술 기사](https://marketing.webassets.siemens-healthineers.com/64fa4c7894fa8085/0f9ed8ef2d8b/siemens-healthineers_mri_deep-resolve_paper.pdf) | 인쇄p3의Gain:noise map/반복 wavelet. p4의Boost:raw data/cascade/CNN/DC. p5의Sharp:complex network/DC. Gain을 모두 신경망이라고 쓰지 않음 | MAGNETOM Flash(89)4/2024호. Software 버전 아님. SPACE/VIBE 개발단계 각주를 현재 지원으로 바꾸지 않음 |
| [Philips Compressed SENSE](https://www.usa.philips.com/healthcare/technology/compressed-sense) | SmartSpeed가 Compressed SENSE+AI reconstruction의 조합이라는 소개 | 발행일/설치 버전 미표기. Precise의 추가 구성을 기본 SmartSpeed와 동일시하지 않음 |
| [Philips Precise 백서](https://www.documents.philips.com/assets/20260313/574df6dc4f704d79a80bb40c0093c1d3.pdf) | 인쇄p4–6/28의Compressed SENSE·Adaptive-CS-Net·Precise Net. p4의2D Cartesian 범위와 이후 확장 예시는 최신 전체 지원표로 합치지 않음 | 마지막p30 Apr2026/00001261-00-01 확인. URL 경로20260313과 발행일을 혼동하지 않음. 저자가 모두 직원인 제조사 백서 |
| [Canon MRI AiCE](https://global.medical.canon/products/magnetic-resonance-imaging/aice/deep-learning-reconstruction/) | 고 SNR MRI 자료로 학습한 denoising이라는 제품 설명 | 본문 발행일·설치 버전 미표기. 검색에 섞인 동명 CT 페이지는 사용하지 않음 |
| [Canon PIQE 해설](https://global.medical.canon/publications/mri/g2k/g2k-on-piqe/) | WHEN의1.5/3T·2D FSE, HOW/Questions의AI denoise/deringing+비AI zero filling, Precautions의설정 차이 | 본문 발행일 미표기. 연결PDF MOIMR0131EAA도 날짜 미확인. 문서 코드와 설치 버전을 구별. 최신 전체 지원 목록이라고 쓰지 않음 |

GE의 별도 PDF 링크는 도구에서 열기 오류여서 그 문서를 읽었다고 기록하지 않고 직접 열린 제품 페이지의 주장만 사용했다. Canon 연결 PDF2쪽도 확인했으나 발행일을 확인하지 못했다. 제조사 임상 그림이나 로고는 복제하지 않았다.

Zero filling이 새로운 획득 정보를 만든다는 주장은 쓰지 않았다. PIQE 제조사 표현의 ringing 발생 원인을 일반 물리 법칙으로 확대하지 않고, 명시한 확대 방법과 별도 감소 단계만 요약했다. Data consistency가 정답/임상 안전을 보장한다고 해석하지 않았다. 수치 성능 순위·모든 모델의 성능 일반화·훈련 데이터/가중치 재현은 제외했다.

