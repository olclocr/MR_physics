from __future__ import annotations

import argparse
import io
import math
import struct
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image, ImageDraw, ImageFont


Vec3 = tuple[float, float, float]
Point2 = tuple[float, float]
Color = tuple[int, int, int, int]

ROOT = Path(__file__).resolve().parents[1]
GIF_OUTPUT = ROOT / "outputs" / "bicycle_wheel_precession_kr.gif"
VIDEO_OUTPUT = ROOT / "outputs" / "bicycle_wheel_precession_kr.avi"

PALETTE = {
    "bg": (246, 248, 251, 255),
    "ink": (24, 32, 44, 255),
    "muted": (88, 102, 119, 255),
    "grid": (151, 164, 181, 78),
    "panel": (255, 255, 255, 232),
    "panel_edge": (214, 222, 232, 220),
    "axis": (58, 68, 82, 255),
    "wheel_fill": (219, 235, 245, 230),
    "wheel_edge": (60, 88, 112, 255),
    "r": (50, 116, 168, 255),
    "g": (75, 85, 99, 255),
    "l": (230, 128, 32, 255),
    "tau": (199, 63, 132, 255),
    "dl": (44, 151, 112, 255),
    "ghost": (44, 151, 112, 92),
    "path": (100, 116, 139, 165),
    "accent": (231, 92, 72, 255),
}


def add(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def sub(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def mul(a: Vec3, s: float) -> Vec3:
    return (a[0] * s, a[1] * s, a[2] * s)


def dot(a: Vec3, b: Vec3) -> float:
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def cross(a: Vec3, b: Vec3) -> Vec3:
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def norm(a: Vec3) -> float:
    return math.sqrt(dot(a, a))


def normalize(a: Vec3) -> Vec3:
    length = norm(a)
    if length == 0:
        return (0.0, 0.0, 0.0)
    return (a[0] / length, a[1] / length, a[2] / length)


def to_xy(p: Point2) -> tuple[int, int]:
    return (round(p[0]), round(p[1]))


@dataclass(frozen=True)
class Camera:
    origin: Point2
    scale: float
    eye: Vec3 = (3.5, -5.3, 3.2)
    target: Vec3 = (0.0, 0.0, 0.40)

    def __post_init__(self) -> None:
        forward = normalize(sub(self.target, self.eye))
        right = normalize(cross(forward, (0.0, 0.0, 1.0)))
        up = normalize(cross(right, forward))
        object.__setattr__(self, "forward", forward)
        object.__setattr__(self, "right", right)
        object.__setattr__(self, "up", up)

    def project(self, p: Vec3) -> Point2:
        shifted = sub(p, self.target)
        x = dot(shifted, self.right)
        y = dot(shifted, self.up)
        return (self.origin[0] + x * self.scale, self.origin[1] - y * self.scale)


def find_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    if bold:
        names = ("malgunbd.ttf", "seguisb.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf")
    else:
        names = ("malgun.ttf", "segoeui.ttf", "arial.ttf", "DejaVuSans.ttf")
    roots = (
        Path("C:/Windows/Fonts"),
        Path("/usr/share/fonts/truetype/dejavu"),
        Path("/Library/Fonts"),
    )
    for root in roots:
        for name in names:
            candidate = root / name
            if candidate.exists():
                return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> int:
    left, _, right, _ = draw.textbbox((0, 0), text, font=font)
    return right - left


def wrap_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.ImageFont,
    max_width: int,
) -> list[str]:
    lines: list[str] = []
    for raw_line in text.splitlines():
        words = raw_line.split(" ")
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            if text_width(draw, candidate, font) <= max_width:
                current = candidate
                continue
            if current:
                lines.append(current)
            current = word
        if current:
            lines.append(current)
    return lines


def draw_multiline(
    draw: ImageDraw.ImageDraw,
    xy: Point2,
    text: str,
    font: ImageFont.ImageFont,
    fill: Color,
    max_width: int,
    line_gap: int = 7,
) -> int:
    y = round(xy[1])
    for line in wrap_text(draw, text, font, max_width):
        draw.text((round(xy[0]), y), line, font=font, fill=fill, anchor="la")
        bbox = draw.textbbox((round(xy[0]), y), line, font=font, anchor="la")
        y = bbox[3] + line_gap
    return y


def draw_arrow_2d(
    draw: ImageDraw.ImageDraw,
    p0: Point2,
    p1: Point2,
    color: Color,
    width: int = 5,
    head: int = 18,
) -> None:
    draw.line([to_xy(p0), to_xy(p1)], fill=color, width=width)
    dx = p1[0] - p0[0]
    dy = p1[1] - p0[1]
    angle = math.atan2(dy, dx)
    spread = math.radians(28)
    left = (p1[0] - head * math.cos(angle - spread), p1[1] - head * math.sin(angle - spread))
    right = (p1[0] - head * math.cos(angle + spread), p1[1] - head * math.sin(angle + spread))
    draw.polygon([to_xy(p1), to_xy(left), to_xy(right)], fill=color)


def draw_arrow_3d(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    p0: Vec3,
    p1: Vec3,
    color: Color,
    width: int = 5,
    head: int = 18,
) -> None:
    draw_arrow_2d(draw, cam.project(p0), cam.project(p1), color, width=width, head=head)


def draw_label(
    draw: ImageDraw.ImageDraw,
    xy: Point2,
    text: str,
    font: ImageFont.ImageFont,
    fill: Color,
    pad: int = 6,
) -> None:
    bbox = draw.textbbox(to_xy(xy), text, font=font, anchor="mm")
    box = (bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad)
    draw.rounded_rectangle(box, radius=7, fill=(255, 255, 255, 226), outline=(205, 214, 224, 205), width=1)
    draw.text(to_xy(xy), text, font=font, fill=fill, anchor="mm")


def with_alpha(color: Color, alpha: int) -> Color:
    return (color[0], color[1], color[2], max(0, min(255, alpha)))


def draw_polyline_3d(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    points: Sequence[Vec3],
    color: Color,
    width: int = 2,
    dashed: bool = False,
) -> None:
    for i in range(len(points) - 1):
        if dashed and i % 2:
            continue
        draw.line([to_xy(cam.project(points[i])), to_xy(cam.project(points[i + 1]))], fill=color, width=width)


def circle_xy(radius: float, z: float, steps: int = 144) -> list[Vec3]:
    return [
        (radius * math.cos(2 * math.pi * i / steps), radius * math.sin(2 * math.pi * i / steps), z)
        for i in range(steps + 1)
    ]


def draw_reference_plane(draw: ImageDraw.ImageDraw, cam: Camera, radius: float) -> None:
    pts = [to_xy(cam.project(p)) for p in circle_xy(radius, 0.0, 128)]
    draw.polygon(pts, fill=(229, 235, 242, 86))
    draw.line(pts, fill=(132, 147, 165, 116), width=2)
    for ring in (0.45, 0.85, 1.25):
        draw_polyline_3d(draw, cam, circle_xy(ring, 0.0, 128), PALETTE["grid"], width=1)
    for i in range(12):
        angle = math.tau * i / 12
        draw_polyline_3d(
            draw,
            cam,
            [(0.0, 0.0, 0.0), (radius * math.cos(angle), radius * math.sin(angle), 0.0)],
            PALETTE["grid"],
            width=1,
        )
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), (0.0, 0.0, 1.55), (73, 101, 163, 190), width=4, head=14)


def disk_basis(axis: Vec3) -> tuple[Vec3, Vec3]:
    n = normalize(axis)
    u = cross(n, (0.0, 0.0, 1.0))
    if norm(u) < 0.02:
        u = cross(n, (1.0, 0.0, 0.0))
    u = normalize(u)
    v = normalize(cross(n, u))
    return u, v


def draw_wheel(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    center: Vec3,
    axis: Vec3,
    radius: float,
    spin_phase: float,
) -> None:
    u, v = disk_basis(axis)
    rim: list[tuple[int, int]] = []
    for i in range(96):
        angle = math.tau * i / 96
        point = add(center, add(mul(u, radius * math.cos(angle)), mul(v, radius * math.sin(angle))))
        rim.append(to_xy(cam.project(point)))
    draw.polygon(rim, fill=PALETTE["wheel_fill"])
    draw.line(rim + [rim[0]], fill=PALETTE["wheel_edge"], width=3, joint="curve")
    for i in range(12):
        angle = spin_phase + math.tau * i / 12
        outer = add(center, add(mul(u, radius * math.cos(angle)), mul(v, radius * math.sin(angle))))
        draw.line([to_xy(cam.project(center)), to_xy(cam.project(outer))], fill=(76, 96, 120, 168), width=2)
    for offset, color in ((0.0, PALETTE["accent"]), (math.tau / 3, PALETTE["l"]), (2 * math.tau / 3, PALETTE["dl"])):
        angle = spin_phase + offset
        outer = add(center, add(mul(u, radius * math.cos(angle)), mul(v, radius * math.sin(angle))))
        draw.line([to_xy(cam.project(center)), to_xy(cam.project(outer))], fill=color, width=4)
    cx, cy = cam.project(center)
    draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=PALETTE["axis"])


def draw_twist_plane(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    axis: Vec3,
    center: Vec3,
    font: ImageFont.ImageFont,
    alpha: int,
) -> None:
    plane_color = (199, 63, 132, alpha)
    z_span = 0.58
    plane = [
        add(mul(axis, -0.10), (0.0, 0.0, -z_span)),
        add(mul(axis, 1.22), (0.0, 0.0, -z_span)),
        add(mul(axis, 1.22), (0.0, 0.0, z_span)),
        add(mul(axis, -0.10), (0.0, 0.0, z_span)),
    ]
    pts = [to_xy(cam.project(p)) for p in plane]
    draw.line(pts + [pts[0]], fill=plane_color, width=3)
    draw.line([pts[0], pts[2]], fill=with_alpha(PALETTE["accent"], alpha // 2), width=2)
    draw.line([pts[1], pts[3]], fill=with_alpha(PALETTE["accent"], alpha // 2), width=2)

    side = normalize(cross(axis, (0.0, 0.0, 1.0)))
    p0 = add(center, add(mul(side, -0.22), (0.0, 0.0, 0.24)))
    p1 = add(center, add(mul(side, 0.28), (0.0, 0.0, -0.12)))
    draw_arrow_3d(draw, cam, p0, p1, with_alpha(PALETTE["accent"], alpha), width=5, head=16)
    draw_label(draw, cam.project(add(center, (0.0, 0.0, 0.50))), "비틀림", font, with_alpha(PALETTE["accent"], alpha))


def draw_causal_panel(
    draw: ImageDraw.ImageDraw,
    width: int,
    height: int,
    active_step: int,
    fonts: dict[str, ImageFont.ImageFont],
) -> None:
    x0, y0, x1, y1 = width - 392, 100, width - 34, height - 26
    draw.rounded_rectangle((x0, y0, x1, y1), radius=12, fill=PALETTE["panel"], outline=PALETTE["panel_edge"], width=1)

    draw.text((x0 + 22, y0 + 20), "인과 흐름", font=fonts["section"], fill=PALETTE["ink"], anchor="la")
    draw.text((x0 + 22, y0 + 55), "τ = r × mg", font=fonts["formula"], fill=PALETTE["tau"], anchor="la")
    draw.text((x0 + 184, y0 + 55), "dL/dt = τ", font=fonts["formula"], fill=PALETTE["dl"], anchor="la")
    draw.line((x0 + 22, y0 + 94, x1 - 22, y0 + 94), fill=(215, 224, 234, 255), width=1)

    y = y0 + 112
    steps = [
        ("1 L", "바퀴의 각운동량", "빠르게 회전하는 바퀴의 L은 바퀴축 방향이다.", PALETTE["l"]),
        ("2 mg", "무게중심에 걸리는 힘", "무게 mg가 바퀴의 무게중심에서 아래로 작용한다.", PALETTE["g"]),
        ("3 비틀림", "축-Z축 평면의 비틀림", "바퀴축과 z축이 이루는 평면이 비틀리려는 효과가 생긴다.", PALETTE["accent"]),
        ("4 τ", "비틀림을 토크로 표현", "그 효과를 τ = r × mg 라는 토크 벡터로 표현한다.", PALETTE["tau"]),
        ("5 dL/dt", "토크가 L을 바꿈", "토크는 시간당 각운동량 변화다. dL/dt = τ.", PALETTE["dl"]),
    ]
    for index, (label, headline, body, step_color) in enumerate(steps):
        active = index == active_step
        row_fill = (*step_color[:3], 32 if active else 0)
        if active:
            draw.rounded_rectangle((x0 + 14, y - 7, x1 - 14, y + 72), radius=9, fill=row_fill)
        label_fill = (255, 255, 255, 255) if active else (65, 76, 91, 255)
        label_box = step_color if active else (232, 237, 244, 255)
        draw.rounded_rectangle((x0 + 22, y, x0 + 88, y + 28), radius=7, fill=label_box)
        draw.text((x0 + 55, y + 14), label, font=fonts["small_bold"], fill=label_fill, anchor="mm")
        title_fill = PALETTE["ink"] if active else PALETTE["muted"]
        body_fill = PALETTE["ink"] if active else (98, 112, 129, 255)
        draw.text((x0 + 100, y - 1), headline, font=fonts["small_bold"], fill=title_fill, anchor="la")
        y = draw_multiline(draw, (x0 + 100, y + 22), body, fonts["small"], body_fill, max_width=222, line_gap=2) + 9


def draw_initial_state_panel(
    draw: ImageDraw.ImageDraw,
    width: int,
    height: int,
    fonts: dict[str, ImageFont.ImageFont],
) -> None:
    box = (34, height - 76, 590, height - 26)
    draw.rounded_rectangle(box, radius=13, fill=(255, 255, 255, 234), outline=PALETTE["panel_edge"], width=1)
    text = "초기 상태: 바퀴는 표시된 방향으로 빠르게 회전하고, 축의 한쪽은 고정되어 있으며, 중력 mg는 아래로 작용한다."
    draw_multiline(draw, (58, height - 63), text, fonts["caption"], PALETTE["ink"], max_width=500, line_gap=3)


def render_frame(width: int, height: int, frame_index: int, frame_count: int) -> Image.Image:
    progress = frame_index / frame_count
    active_step = min(4, int(progress * 5))
    phase = math.tau * progress
    spin_phase = phase * 5.0

    image = Image.new("RGBA", (width, height), PALETTE["bg"])
    draw = ImageDraw.Draw(image, "RGBA")
    fonts = {
        "title": find_font(34, bold=True),
        "section": find_font(21, bold=True),
        "formula": find_font(24, bold=True),
        "body": find_font(17),
        "caption": find_font(19, bold=True),
        "small": find_font(14),
        "small_bold": find_font(13, bold=True),
        "label": find_font(16, bold=True),
    }

    draw.text((34, 25), "자전거 바퀴와 세차운동", font=fonts["title"], fill=PALETTE["ink"], anchor="la")

    cam = Camera(origin=(292, 350), scale=145)
    draw_reference_plane(draw, cam, radius=1.34)

    axis = (math.cos(phase), math.sin(phase), 0.0)
    tau_dir = normalize(cross(axis, (0.0, 0.0, -1.0)))
    pivot = (0.0, 0.0, 0.0)
    center = mul(axis, 1.04)
    axle_end = mul(axis, 1.28)
    l_tip = mul(axis, 1.47)
    dl_tip = add(l_tip, mul(tau_dir, 0.42))
    new_l_tip = mul(normalize(dl_tip), 1.47)

    ring = circle_xy(1.47, 0.0, 160)
    draw_polyline_3d(draw, cam, ring, PALETTE["path"], width=2, dashed=True)

    draw_polyline_3d(draw, cam, [mul(axis, -0.16), axle_end], PALETTE["axis"], width=8)
    draw_wheel(draw, cam, center, axis, radius=0.28, spin_phase=spin_phase)
    u, v = disk_basis(axis)
    spin_a = spin_phase + math.radians(35)
    spin_b = spin_a + math.radians(34)
    spin_p0 = add(center, add(mul(u, 0.36 * math.cos(spin_a)), mul(v, 0.36 * math.sin(spin_a))))
    spin_p1 = add(center, add(mul(u, 0.36 * math.cos(spin_b)), mul(v, 0.36 * math.sin(spin_b))))
    draw_arrow_3d(draw, cam, spin_p0, spin_p1, PALETTE["l"], width=4, head=12)
    draw_label(draw, cam.project(add(center, mul(v, 0.46))), "회전", fonts["label"], PALETTE["l"])
    pivot_xy = cam.project(pivot)
    draw.ellipse((pivot_xy[0] - 9, pivot_xy[1] - 9, pivot_xy[0] + 9, pivot_xy[1] + 9), fill=PALETTE["ink"])

    if active_step >= 3:
        draw_arrow_3d(draw, cam, pivot, center, with_alpha(PALETTE["r"], 215), width=4, head=14)
        draw_label(draw, cam.project(mul(axis, 0.58)), "r", fonts["label"], PALETTE["r"])

    gravity_tip = add(center, (0.0, 0.0, -0.48))
    if active_step >= 1:
        draw_arrow_3d(draw, cam, center, gravity_tip, PALETTE["g"], width=5, head=17)
        draw_label(draw, cam.project(add(gravity_tip, (0.0, 0.0, -0.05))), "mg", fonts["label"], PALETTE["g"])

    draw_arrow_3d(draw, cam, pivot, l_tip, PALETTE["l"], width=7, head=22)
    draw_label(draw, cam.project(mul(axis, 1.42)), "L", fonts["label"], PALETTE["l"])

    if active_step >= 2:
        draw_twist_plane(draw, cam, axis, center, fonts["label"], alpha=125)

    tau_start = add(center, mul(tau_dir, -0.22))
    tau_end = add(center, mul(tau_dir, 0.56))
    if active_step >= 3:
        draw_arrow_3d(draw, cam, tau_start, tau_end, PALETTE["tau"], width=7, head=22)
        draw_label(draw, cam.project(add(center, mul(tau_dir, 0.72))), "τ = r × mg", fonts["label"], PALETTE["tau"])

    pulse = 0.76 + 0.24 * math.sin(math.tau * progress * 2) ** 2
    if active_step >= 4:
        draw_arrow_3d(draw, cam, l_tip, add(l_tip, mul(tau_dir, 0.43 * pulse)), PALETTE["dl"], width=6, head=18)
        draw_label(draw, cam.project(add(add(l_tip, mul(tau_dir, 0.42)), (0.0, 0.0, 0.16))), "dL/dt", fonts["label"], PALETTE["dl"])
        draw_polyline_3d(draw, cam, [pivot, new_l_tip], PALETTE["ghost"], width=4, dashed=True)

    draw_causal_panel(draw, width, height, active_step, fonts)
    draw_initial_state_panel(draw, width, height, fonts)
    return image.convert("RGB")


def save_gif(path: Path, frames: Iterable[Image.Image], duration_ms: int) -> None:
    rendered = list(frames)
    if not rendered:
        raise ValueError("No frames were rendered")
    path.parent.mkdir(parents=True, exist_ok=True)
    rendered[0].save(
        path,
        save_all=True,
        append_images=rendered[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
        disposal=2,
    )


def write_chunk(handle, chunk_id: bytes, data: bytes) -> None:
    handle.write(chunk_id)
    handle.write(struct.pack("<I", len(data)))
    handle.write(data)
    if len(data) % 2:
        handle.write(b"\0")


def start_list(handle, list_type: bytes) -> int:
    handle.write(b"LIST")
    size_pos = handle.tell()
    handle.write(struct.pack("<I", 0))
    handle.write(list_type)
    return size_pos


def finish_sized_block(handle, size_pos: int) -> None:
    end_pos = handle.tell()
    size = end_pos - size_pos - 4
    handle.seek(size_pos)
    handle.write(struct.pack("<I", size))
    handle.seek(end_pos)


def jpeg_bytes(frame: Image.Image, quality: int) -> bytes:
    buffer = io.BytesIO()
    frame.convert("RGB").save(buffer, format="JPEG", quality=quality, optimize=True)
    return buffer.getvalue()


def save_avi_mjpeg(
    path: Path,
    frames: Iterable[Image.Image],
    width: int,
    height: int,
    frame_count: int,
    fps: int,
    quality: int = 86,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    micros_per_frame = round(1_000_000 / fps)
    suggested_buffer = width * height * 3
    index: list[tuple[bytes, int, int, int]] = []

    with path.open("wb") as handle:
        handle.write(b"RIFF")
        riff_size_pos = handle.tell()
        handle.write(struct.pack("<I", 0))
        handle.write(b"AVI ")

        hdrl_pos = start_list(handle, b"hdrl")
        avih = struct.pack(
            "<IIIIIIIIIIIIII",
            micros_per_frame,
            suggested_buffer * fps,
            0,
            0x10,
            frame_count,
            0,
            1,
            suggested_buffer,
            width,
            height,
            0,
            0,
            0,
            0,
        )
        write_chunk(handle, b"avih", avih)

        strl_pos = start_list(handle, b"strl")
        strh = struct.pack(
            "<4s4sIHHIIIIIIIIiiii",
            b"vids",
            b"MJPG",
            0,
            0,
            0,
            0,
            1,
            fps,
            0,
            frame_count,
            suggested_buffer,
            0xFFFFFFFF,
            0,
            0,
            0,
            width,
            height,
        )
        write_chunk(handle, b"strh", strh)
        strf = struct.pack(
            "<IiiHHIIiiII",
            40,
            width,
            height,
            1,
            24,
            struct.unpack("<I", b"MJPG")[0],
            suggested_buffer,
            0,
            0,
            0,
            0,
        )
        write_chunk(handle, b"strf", strf)
        finish_sized_block(handle, strl_pos)
        finish_sized_block(handle, hdrl_pos)

        movi_pos = start_list(handle, b"movi")
        movi_data_pos = handle.tell()
        written = 0
        for frame in frames:
            data = jpeg_bytes(frame, quality=quality)
            offset = handle.tell() - movi_data_pos
            write_chunk(handle, b"00dc", data)
            index.append((b"00dc", 0x10, offset, len(data)))
            written += 1
        finish_sized_block(handle, movi_pos)

        idx_data = b"".join(struct.pack("<4sIII", *entry) for entry in index)
        write_chunk(handle, b"idx1", idx_data)
        finish_sized_block(handle, riff_size_pos)

    if written != frame_count:
        raise ValueError(f"Expected {frame_count} frames, wrote {written}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a Korean animation explaining bicycle wheel precession.")
    parser.add_argument("--width", type=int, default=1000)
    parser.add_argument("--height", type=int, default=640)
    parser.add_argument("--frames", type=int, default=180)
    parser.add_argument("--duration-ms", type=int, default=110)
    parser.add_argument("--fps", type=int, default=12)
    parser.add_argument("--output", type=Path, default=GIF_OUTPUT)
    parser.add_argument("--video-output", type=Path, default=VIDEO_OUTPUT)
    parser.add_argument("--skip-gif", action="store_true")
    parser.add_argument("--skip-video", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.skip_video:
        save_avi_mjpeg(
            args.video_output,
            (render_frame(args.width, args.height, i, args.frames) for i in range(args.frames)),
            width=args.width,
            height=args.height,
            frame_count=args.frames,
            fps=args.fps,
        )
        print(args.video_output)
    if not args.skip_gif:
        save_gif(
            args.output,
            (render_frame(args.width, args.height, i, args.frames) for i in range(args.frames)),
            duration_ms=args.duration_ms,
        )
        print(args.output)


if __name__ == "__main__":
    main()
