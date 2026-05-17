# MR Physics Visualizations

MRI/NMR에서 쓰는 실험실 좌표계, 회전좌표계, `B0`, `B1`, RF pulse, flip angle을
Python으로 시각화하는 작은 프로젝트입니다.

현재 구현은 외부 수치 라이브러리 없이 `Pillow`만 사용합니다. 로컬에 `ffmpeg`가 없어도
바로 재생 가능한 animated GIF를 생성합니다.

## 빠른 실행

```powershell
python scripts/generate_videos.py
```

생성 파일:

- `outputs/rf_phase_sweep.gif`
- `outputs/rf_flip_angle_0_360.gif`
- `outputs/rotating_frame_precession.gif`
- `outputs/gyroscope_torque_precession.gif`
- `outputs/gyroscope_short_x_push.gif`

MR physics 정리는 [docs/mr_physics.md](docs/mr_physics.md)에 있습니다.

## 옵션

```powershell
python scripts/generate_videos.py --frames 73 --size 640 --duration-ms 60
```

- `--frames`: 애니메이션 프레임 수
- `--size`: 정사각형 영상 한 변의 픽셀 크기
- `--duration-ms`: GIF 프레임당 표시 시간

## 의존성

```powershell
python -m pip install -r requirements.txt
```
