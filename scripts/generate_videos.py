from __future__ import annotations

import argparse
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image, ImageDraw, ImageFont


Vec3 = tuple[float, float, float]
Point2 = tuple[float, float]
Color = tuple[int, int, int, int]

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "outputs"


PALETTE = {
    "bg": (248, 250, 252, 255),
    "ink": (20, 31, 46, 255),
    "muted": (92, 109, 128, 255),
    "grid": (152, 168, 187, 82),
    "lab": (120, 132, 148, 180),
    "x": (215, 68, 76, 255),
    "y": (54, 150, 112, 255),
    "z": (54, 96, 175, 255),
    "b0": (39, 89, 184, 255),
    "b1": (207, 64, 153, 255),
    "spin": (232, 138, 38, 255),
    "ghost": (232, 138, 38, 72),
    "arc": (94, 116, 139, 180),
    "plane_fill": (221, 229, 238, 82),
    "plane_edge": (118, 135, 154, 132),
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


def length(a: Vec3) -> float:
    return math.sqrt(dot(a, a))


def normalize(a: Vec3) -> Vec3:
    n = length(a)
    if n == 0:
        return (0.0, 0.0, 0.0)
    return (a[0] / n, a[1] / n, a[2] / n)


def rotate_z(v: Vec3, theta: float) -> Vec3:
    c, s = math.cos(theta), math.sin(theta)
    return (c * v[0] - s * v[1], s * v[0] + c * v[1], v[2])


def rotate_axis(v: Vec3, axis: Vec3, theta: float) -> Vec3:
    k = normalize(axis)
    c, s = math.cos(theta), math.sin(theta)
    term1 = mul(v, c)
    term2 = mul(cross(k, v), s)
    term3 = mul(k, dot(k, v) * (1 - c))
    return add(add(term1, term2), term3)


def rotate_bloch(v: Vec3, field_axis: Vec3, flip_angle: float) -> Vec3:
    # For positive gamma, dM/dt = gamma M x B, which is a negative
    # active right-hand rotation about the field axis.
    return rotate_axis(v, field_axis, -flip_angle)


@dataclass(frozen=True)
class Camera:
    width: int
    height: int
    scale: float
    eye: Vec3 = (3.6, -5.2, 3.2)
    target: Vec3 = (0.0, 0.0, 0.0)

    def __post_init__(self) -> None:
        forward = normalize(sub(self.target, self.eye))
        right = normalize(cross(forward, (0.0, 0.0, 1.0)))
        up = normalize(cross(right, forward))
        object.__setattr__(self, "forward", forward)
        object.__setattr__(self, "right", right)
        object.__setattr__(self, "up", up)

    def project(self, p: Vec3) -> Point2:
        v = sub(p, self.target)
        x = dot(v, self.right)
        y = dot(v, self.up)
        return (self.width * 0.50 + x * self.scale, self.height * 0.55 - y * self.scale)

    def depth(self, p: Vec3) -> float:
        return dot(sub(p, self.target), self.forward)


def find_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = (
        ["seguisb.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]
        if bold
        else ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]
    )
    roots = [
        Path("C:/Windows/Fonts"),
        Path("/usr/share/fonts/truetype/dejavu"),
        Path("/Library/Fonts"),
    ]
    for root in roots:
        for name in names:
            candidate = root / name
            if candidate.exists():
                return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def rgba(c: Color) -> Color:
    return c


def to_xy(p: Point2) -> tuple[int, int]:
    return (round(p[0]), round(p[1]))


def draw_line_2d(draw: ImageDraw.ImageDraw, p0: Point2, p1: Point2, color: Color, width: int) -> None:
    draw.line([to_xy(p0), to_xy(p1)], fill=rgba(color), width=width)


def draw_polyline_3d(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    points: Sequence[Vec3],
    color: Color,
    width: int = 2,
    dashed: bool = False,
) -> None:
    if len(points) < 2:
        return
    for i in range(len(points) - 1):
        if dashed and i % 2 == 1:
            continue
        draw_line_2d(draw, cam.project(points[i]), cam.project(points[i + 1]), color, width)


def draw_arrow_2d(
    draw: ImageDraw.ImageDraw,
    p0: Point2,
    p1: Point2,
    color: Color,
    width: int = 5,
    head: int = 18,
) -> None:
    draw.line([to_xy(p0), to_xy(p1)], fill=rgba(color), width=width)
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    angle = math.atan2(dy, dx)
    spread = math.radians(27)
    base1 = (
        p1[0] - head * math.cos(angle - spread),
        p1[1] - head * math.sin(angle - spread),
    )
    base2 = (
        p1[0] - head * math.cos(angle + spread),
        p1[1] - head * math.sin(angle + spread),
    )
    draw.polygon([to_xy(p1), to_xy(base1), to_xy(base2)], fill=rgba(color))


def draw_arrow_3d(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    start: Vec3,
    end: Vec3,
    color: Color,
    width: int = 5,
    head: int = 18,
) -> None:
    draw_arrow_2d(draw, cam.project(start), cam.project(end), color, width=width, head=head)


def draw_text(
    draw: ImageDraw.ImageDraw,
    xy: Point2,
    text: str,
    font: ImageFont.ImageFont,
    fill: Color = PALETTE["ink"],
    anchor: str = "mm",
) -> None:
    draw.text(to_xy(xy), text, font=font, fill=rgba(fill), anchor=anchor)


def draw_label_box(
    draw: ImageDraw.ImageDraw,
    xy: Point2,
    text: str,
    font: ImageFont.ImageFont,
    fill: Color = PALETTE["ink"],
    bg: Color = (255, 255, 255, 218),
    anchor: str = "mm",
    pad: int = 6,
) -> None:
    bbox = draw.textbbox(to_xy(xy), text, font=font, anchor=anchor)
    expanded = (bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad)
    draw.rounded_rectangle(expanded, radius=6, fill=rgba(bg), outline=(205, 214, 224, 190), width=1)
    draw.text(to_xy(xy), text, font=font, fill=rgba(fill), anchor=anchor)


def circle_points_xy(radius: float = 1.0, z: float = 0.0, n: int = 121) -> list[Vec3]:
    return [
        (radius * math.cos(2 * math.pi * i / (n - 1)), radius * math.sin(2 * math.pi * i / (n - 1)), z)
        for i in range(n)
    ]


def circle_points_yz(radius: float = 1.0, x: float = 0.0, n: int = 121) -> list[Vec3]:
    return [
        (x, radius * math.sin(2 * math.pi * i / (n - 1)), radius * math.cos(2 * math.pi * i / (n - 1)))
        for i in range(n)
    ]


def cone_ring_points(radius: float, z: float, n: int = 145) -> list[Vec3]:
    return [
        (radius * math.cos(2 * math.pi * i / (n - 1)), radius * math.sin(2 * math.pi * i / (n - 1)), z)
        for i in range(n)
    ]


def draw_xy_plane(image: Image.Image, cam: Camera, radius: float = 1.12) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    disk = [to_xy(cam.project(p)) for p in circle_points_xy(radius=radius, n=151)]
    draw.polygon(disk, fill=rgba(PALETTE["plane_fill"]))
    draw.line(disk, fill=rgba(PALETTE["plane_edge"]), width=2, joint="curve")

    for r in (0.45, 0.80, 1.12):
        draw_polyline_3d(draw, cam, circle_points_xy(radius=r, n=121), PALETTE["grid"], width=1)

    for angle in [i * math.pi / 6 for i in range(12)]:
        p0 = (0.0, 0.0, 0.0)
        p1 = (radius * math.cos(angle), radius * math.sin(angle), 0.0)
        draw_line_2d(draw, cam.project(p0), cam.project(p1), PALETTE["grid"], width=1)

    image.alpha_composite(overlay)


def draw_lab_axes(draw: ImageDraw.ImageDraw, cam: Camera, font: ImageFont.ImageFont) -> None:
    axis_len = 1.25
    axes = [
        ((0.0, 0.0, 0.0), (axis_len, 0.0, 0.0), "x", PALETTE["lab"]),
        ((0.0, 0.0, 0.0), (0.0, axis_len, 0.0), "y", PALETTE["lab"]),
        ((0.0, 0.0, 0.0), (0.0, 0.0, axis_len), "z", PALETTE["z"]),
    ]
    for start, end, label, color in axes:
        draw_arrow_3d(draw, cam, start, end, color, width=4, head=14)
        draw_text(draw, cam.project(mul(end, 1.08)), label, font, fill=color)


def draw_rotating_axes(
    draw: ImageDraw.ImageDraw,
    cam: Camera,
    phase: float,
    font: ImageFont.ImageFont,
    length_axis: float = 1.02,
) -> tuple[Vec3, Vec3]:
    xprime = rotate_z((1.0, 0.0, 0.0), phase)
    yprime = rotate_z((0.0, 1.0, 0.0), phase)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), mul(xprime, length_axis), PALETTE["x"], width=6, head=17)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), mul(yprime, length_axis), PALETTE["y"], width=6, head=17)
    draw_text(draw, cam.project(mul(xprime, 1.15)), "x'", font, fill=PALETTE["x"])
    draw_text(draw, cam.project(mul(yprime, 1.15)), "y'", font, fill=PALETTE["y"])
    return xprime, yprime


def draw_header(
    draw: ImageDraw.ImageDraw,
    title: str,
    subtitle: str,
    width: int,
    font_title: ImageFont.ImageFont,
    font_body: ImageFont.ImageFont,
) -> None:
    draw.text((28, 24), title, font=font_title, fill=rgba(PALETTE["ink"]), anchor="la")
    draw.text((28, 62), subtitle, font=font_body, fill=rgba(PALETTE["muted"]), anchor="la")


def draw_footer(
    draw: ImageDraw.ImageDraw,
    text: str,
    height: int,
    font: ImageFont.ImageFont,
) -> None:
    draw.text((28, height - 30), text, font=font, fill=rgba(PALETTE["muted"]), anchor="la")


def make_canvas(size: int) -> tuple[Image.Image, ImageDraw.ImageDraw, Camera]:
    image = Image.new("RGBA", (size, size), PALETTE["bg"])
    cam = Camera(width=size, height=size, scale=size * 0.23)
    draw = ImageDraw.Draw(image, "RGBA")
    return image, draw, cam


def render_rf_phase_frame(size: int, phase: float) -> Image.Image:
    image, draw, cam = make_canvas(size)
    font_title = find_font(max(18, size // 28), bold=True)
    font_body = find_font(max(12, size // 44))
    font_label = find_font(max(12, size // 42), bold=True)

    deg = math.degrees(phase)
    draw_header(
        draw,
        "RF phase sweep: B1 axis rotates 0-360 deg",
        "Lab xyz axes, rotating x'y' plane, B0 and proton spin along +z",
        size,
        font_title,
        font_body,
    )
    draw_xy_plane(image, cam, radius=1.12)
    draw_lab_axes(draw, cam, font_label)
    xprime, _ = draw_rotating_axes(draw, cam, phase, font_label)

    b1_end = mul(xprime, 1.08)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.02), b1_end, PALETTE["b1"], width=8, head=22)
    draw_label_box(draw, cam.project(mul(b1_end, 1.10)), "B1 / RF", font_label, fill=PALETTE["b1"])

    draw_arrow_3d(draw, cam, (-0.08, -0.08, 0.0), (-0.08, -0.08, 1.30), PALETTE["b0"], width=8, head=22)
    draw_label_box(draw, cam.project((-0.12, -0.12, 1.42)), "B0", font_label, fill=PALETTE["b0"])

    draw_arrow_3d(draw, cam, (0.09, 0.09, 0.0), (0.09, 0.09, 0.92), PALETTE["spin"], width=7, head=20)
    draw_label_box(draw, cam.project((0.14, 0.14, 1.04)), "proton spin", font_label, fill=PALETTE["spin"])

    draw_label_box(draw, (size - 122, size - 76), f"RF phase = {deg:5.1f} deg", font_label)
    draw_footer(draw, "RF phase selects the transverse rotation axis in the rotating frame.", size, font_body)
    return image.convert("RGB")


def render_flip_frame(size: int, alpha: float) -> Image.Image:
    image, draw, cam = make_canvas(size)
    font_title = find_font(max(18, size // 28), bold=True)
    font_body = find_font(max(12, size // 44))
    font_label = find_font(max(12, size // 42), bold=True)

    deg = math.degrees(alpha)
    draw_header(
        draw,
        "RF pulse flip angle: 0-360 deg",
        "Rotating frame: resonant B1 is static, so M rotates about the B1 axis",
        size,
        font_title,
        font_body,
    )

    draw_xy_plane(image, cam, radius=1.05)
    draw_lab_axes(draw, cam, font_label)
    xprime, yprime = draw_rotating_axes(draw, cam, 0.0, font_label)

    circle = circle_points_yz(radius=0.92, x=0.0, n=145)
    draw_polyline_3d(draw, cam, circle, PALETTE["arc"], width=2, dashed=True)

    b1_end = mul(xprime, 1.08)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), b1_end, PALETTE["b1"], width=8, head=22)
    draw_label_box(draw, cam.project(mul(b1_end, 1.12)), "B1 axis", font_label, fill=PALETTE["b1"])

    draw_arrow_3d(draw, cam, (-0.09, -0.09, 0.0), (-0.09, -0.09, 1.25), PALETTE["b0"], width=7, head=20)
    draw_label_box(draw, cam.project((-0.13, -0.13, 1.37)), "B0", font_label, fill=PALETTE["b0"])

    initial_m = (0.0, 0.0, 0.92)
    magnetization = rotate_bloch(initial_m, xprime, alpha)
    projection = (0.0, magnetization[1], 0.0)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), magnetization, PALETTE["spin"], width=9, head=24)
    draw_label_box(draw, cam.project(mul(magnetization, 1.18)), "M", font_label, fill=PALETTE["spin"])

    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), projection, PALETTE["ghost"], width=5, head=15)
    draw_polyline_3d(draw, cam, [(0.0, 0.0, 0.0), projection, magnetization], (232, 138, 38, 110), width=2, dashed=True)

    arc_steps = max(3, int(abs(alpha) / (2 * math.pi) * 72))
    arc_points = [rotate_bloch(initial_m, xprime, alpha * i / arc_steps) for i in range(arc_steps + 1)]
    draw_polyline_3d(draw, cam, arc_points, PALETTE["spin"], width=4)

    for marker_deg in (90, 180, 270, 360):
        marker = rotate_bloch(initial_m, xprime, math.radians(marker_deg))
        px, py = cam.project(marker)
        r = 5
        draw.ellipse((px - r, py - r, px + r, py + r), fill=rgba((255, 255, 255, 230)), outline=rgba(PALETTE["spin"]), width=2)

    draw_label_box(draw, (size - 132, 128), "90 deg: +z -> +y'", font_label, fill=PALETTE["spin"])
    draw_label_box(draw, (size - 126, size - 76), f"flip angle = {deg:5.1f} deg", font_label)
    draw_footer(draw, "90 deg: transverse magnetization | 180 deg: inversion | 360 deg: returns to +z", size, font_body)
    _ = yprime
    return image.convert("RGB")


def render_precession_frame(size: int, phase: float) -> Image.Image:
    image, draw, cam = make_canvas(size)
    font_title = find_font(max(18, size // 28), bold=True)
    font_body = find_font(max(12, size // 44))
    font_label = find_font(max(12, size // 42), bold=True)

    deg = math.degrees(phase)
    draw_header(
        draw,
        "Larmor precession and rotating frame",
        "After a +x' 90 deg pulse, transverse M stays along +y' in the rotating frame",
        size,
        font_title,
        font_body,
    )
    draw_xy_plane(image, cam, radius=1.08)
    draw_lab_axes(draw, cam, font_label)
    _, yprime = draw_rotating_axes(draw, cam, phase, font_label)

    tilt = math.radians(38)
    transverse = mul(yprime, math.sin(tilt))
    magnetization = add(transverse, (0.0, 0.0, math.cos(tilt)))
    draw_polyline_3d(draw, cam, circle_points_xy(radius=math.sin(tilt), z=math.cos(tilt), n=121), PALETTE["arc"], width=2, dashed=True)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), magnetization, PALETTE["spin"], width=9, head=24)
    draw_arrow_3d(draw, cam, (0.0, 0.0, 0.0), transverse, (232, 138, 38, 100), width=5, head=15)
    draw_label_box(draw, cam.project(mul(magnetization, 1.16)), "M(t)", font_label, fill=PALETTE["spin"])

    draw_arrow_3d(draw, cam, (-0.08, -0.08, 0.0), (-0.08, -0.08, 1.28), PALETTE["b0"], width=8, head=22)
    draw_label_box(draw, cam.project((-0.12, -0.12, 1.40)), "B0", font_label, fill=PALETTE["b0"])

    draw_polyline_3d(draw, cam, [transverse, magnetization], (232, 138, 38, 92), width=2, dashed=True)

    draw_label_box(draw, (size - 122, size - 76), f"Larmor phase = {deg:5.1f} deg", font_label)
    draw_footer(draw, "Here x' is the RF axis; the resulting transverse magnetization is perpendicular to it.", size, font_body)
    return image.convert("RGB")


def draw_disk(
    image: Image.Image,
    cam: Camera,
    center: Vec3,
    axis: Vec3,
    radius: float,
    fill: Color,
    edge: Color,
) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    n = normalize(axis)
    u = normalize(cross(n, (0.0, 0.0, 1.0)))
    if length(u) < 0.01:
        u = (1.0, 0.0, 0.0)
    v = normalize(cross(n, u))
    pts = []
    for i in range(80):
        a = 2 * math.pi * i / 80
        p = add(center, add(mul(u, radius * math.cos(a)), mul(v, radius * math.sin(a))))
        pts.append(to_xy(cam.project(p)))
    draw.polygon(pts, fill=rgba(fill))
    draw.line(pts + [pts[0]], fill=rgba(edge), width=2, joint="curve")
    image.alpha_composite(overlay)


def render_gyroscope_frame(size: int, phase: float) -> Image.Image:
    image, draw, cam = make_canvas(size)
    font_title = find_font(max(18, size // 28), bold=True)
    font_body = find_font(max(12, size // 44))
    font_label = find_font(max(12, size // 42), bold=True)
    font_small = find_font(max(10, size // 50))

    draw_header(
        draw,
        "Gyroscope: torque nudges angular momentum sideways",
        "Gravity gives tau = r x mg; repeated dL steps become precession",
        size,
        font_title,
        font_body,
    )

    theta = math.radians(47)
    axis = (math.sin(theta) * math.cos(phase), math.sin(theta) * math.sin(phase), math.cos(theta))
    tau_dir = normalize(cross(axis, (0.0, 0.0, -1.0)))
    pivot = (0.0, 0.0, 0.0)
    cm = mul(axis, 0.95)
    axle_end = mul(axis, 1.30)
    l_end = mul(axis, 1.46)
    dl_end = add(l_end, mul(tau_dir, 0.34))
    new_l_dir = normalize(dl_end)
    new_l_end = mul(new_l_dir, 1.46)

    draw_xy_plane(image, cam, radius=1.16)
    draw_polyline_3d(draw, cam, cone_ring_points(math.sin(theta) * 1.46, math.cos(theta) * 1.46), PALETTE["arc"], width=2, dashed=True)
    draw_lab_axes(draw, cam, font_label)

    draw_disk(image, cam, cm, axis, radius=0.26, fill=(226, 236, 247, 220), edge=(96, 116, 139, 220))
    draw_polyline_3d(draw, cam, [mul(axis, -0.16), axle_end], (81, 92, 110, 255), width=7)
    px, py = cam.project(pivot)
    draw.ellipse((px - 8, py - 8, px + 8, py + 8), fill=rgba(PALETTE["ink"]))

    draw_arrow_3d(draw, cam, pivot, cm, (84, 111, 142, 210), width=4, head=14)
    draw_label_box(draw, cam.project(mul(axis, 0.58)), "r", font_small, fill=(84, 111, 142, 255))

    mg_tip = add(cm, (0.0, 0.0, -0.62))
    draw_arrow_3d(draw, cam, cm, mg_tip, (68, 80, 96, 255), width=5, head=18)
    draw_label_box(draw, cam.project(add(mg_tip, (0.0, 0.0, -0.09))), "mg", font_label, fill=(68, 80, 96, 255))

    draw_arrow_3d(draw, cam, pivot, l_end, PALETTE["spin"], width=8, head=23)
    draw_label_box(draw, cam.project(mul(l_end, 1.05)), "L", font_label, fill=PALETTE["spin"])

    tau_start = add(cm, mul(tau_dir, -0.18))
    tau_end = add(cm, mul(tau_dir, 0.52))
    draw_arrow_3d(draw, cam, tau_start, tau_end, PALETTE["b1"], width=7, head=22)

    draw_arrow_3d(draw, cam, l_end, dl_end, PALETTE["y"], width=6, head=19)

    draw_polyline_3d(draw, cam, [pivot, new_l_end], (54, 150, 112, 125), width=4, dashed=True)

    legend_x = size - 142
    legend_y = 184
    legend = [
        ("L", PALETTE["spin"]),
        ("tau = r x mg", PALETTE["b1"]),
        ("dL = tau dt", PALETTE["y"]),
        ("new L = L + dL", PALETTE["y"]),
    ]
    for i, (label, color) in enumerate(legend):
        y = legend_y + i * 25
        draw.line([(legend_x, y), (legend_x + 22, y)], fill=rgba(color), width=4)
        draw.text((legend_x + 30, y), label, font=font_small, fill=rgba(PALETTE["ink"]), anchor="lm")

    panel_x = 28
    panel_y = size - 146
    lines = [
        "1. Gravity acts downward at the center of mass.",
        "2. Because r is tilted, tau is horizontal and sideways.",
        "3. tau changes L in the tau direction.",
        "4. Repeating tiny dL steps sweeps a precession cone.",
    ]
    for i, line in enumerate(lines):
        draw.text((panel_x, panel_y + i * 24), line, font=font_small, fill=rgba(PALETTE["muted"]), anchor="la")

    draw_label_box(draw, (size - 122, size - 76), f"precession = {math.degrees(phase):5.1f} deg", font_label)
    return image.convert("RGB")


def render_short_x_push_frame(size: int, phase: float) -> Image.Image:
    image, draw, cam = make_canvas(size)
    font_title = find_font(max(18, size // 28), bold=True)
    font_body = find_font(max(12, size // 44))
    font_label = find_font(max(12, size // 42), bold=True)
    font_small = find_font(max(10, size // 50))

    progress = phase / (2 * math.pi)
    impulse = min(1.0, progress / 0.35)
    show_push = progress < 0.48

    draw_header(
        draw,
        "Short +x push on a gyroscope",
        "A force direction is not the torque direction: tau = r x F",
        size,
        font_title,
        font_body,
    )

    pivot = (0.0, 0.0, 0.0)
    r_point = (0.0, 0.0, 1.02)
    l0 = (0.0, 0.0, 1.34)
    tau_dir = (0.0, 1.0, 0.0)
    l_after_dir = normalize(add((0.0, 0.0, 1.0), mul(tau_dir, 0.42 * impulse)))
    l_after = mul(l_after_dir, 1.34)

    draw_xy_plane(image, cam, radius=1.12)
    draw_lab_axes(draw, cam, font_label)

    draw_disk(image, cam, mul(l_after_dir, 0.64), l_after_dir, radius=0.30, fill=(226, 236, 247, 220), edge=(96, 116, 139, 220))
    draw_polyline_3d(draw, cam, [mul(l_after_dir, -0.20), mul(l_after_dir, 1.10)], (81, 92, 110, 255), width=7)
    px, py = cam.project(pivot)
    draw.ellipse((px - 8, py - 8, px + 8, py + 8), fill=rgba(PALETTE["ink"]))

    draw_arrow_3d(draw, cam, pivot, r_point, (84, 111, 142, 180), width=4, head=14)
    draw_label_box(draw, cam.project((0.0, 0.0, 0.58)), "r", font_small, fill=(84, 111, 142, 255))

    draw_arrow_3d(draw, cam, pivot, l0, (232, 138, 38, 92), width=5, head=17)

    draw_arrow_3d(draw, cam, pivot, l_after, PALETTE["spin"], width=8, head=23)

    if show_push:
        force_alpha = int(255 * max(0.20, 1.0 - progress / 0.48))
        force_color = (215, 68, 76, force_alpha)
        force_start = (-0.68, 0.0, 1.02)
        force_end = (0.35, 0.0, 1.02)
        draw_arrow_3d(draw, cam, force_start, force_end, force_color, width=8, head=24)

    tau_start = add(r_point, (0.0, -0.24, 0.0))
    tau_end = add(r_point, (0.0, 0.58, 0.0))
    draw_arrow_3d(draw, cam, tau_start, tau_end, PALETTE["b1"], width=7, head=22)

    dl_start = l0
    dl_end = add(l0, mul(tau_dir, 0.52 * impulse))
    draw_arrow_3d(draw, cam, dl_start, dl_end, PALETTE["y"], width=6, head=19)

    legend_x = size - 162
    legend_y = 168
    legend = [
        ("initial L", (232, 138, 38, 120)),
        ("short push F = +x", PALETTE["x"]),
        ("tau = r x F = +y", PALETTE["b1"]),
        ("dL is +y", PALETTE["y"]),
        ("L after impulse", PALETTE["spin"]),
    ]
    for i, (label, color) in enumerate(legend):
        y = legend_y + i * 25
        draw.line([(legend_x, y), (legend_x + 22, y)], fill=rgba(color), width=4)
        draw.text((legend_x + 30, y), label, font=font_small, fill=rgba(PALETTE["ink"]), anchor="lm")

    panel_x = 28
    panel_y = size - 124
    lines = [
        "1. Push is along +x at a point above the pivot.",
        "2. The lever arm r is roughly +z.",
        "3. z x x = +y, so the impulse changes L toward +y.",
    ]
    for i, line in enumerate(lines):
        draw.text((panel_x, panel_y + i * 24), line, font=font_small, fill=rgba(PALETTE["muted"]), anchor="la")

    draw_label_box(draw, (size - 132, size - 76), f"impulse = {impulse * 100:5.1f}%", font_label)
    return image.convert("RGB")


def save_gif(path: Path, frames: Iterable[Image.Image], duration_ms: int) -> None:
    frames_list = list(frames)
    if not frames_list:
        raise ValueError("No frames to save")
    path.parent.mkdir(parents=True, exist_ok=True)
    frames_list[0].save(
        path,
        save_all=True,
        append_images=frames_list[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
    )


def sweep_values(frames: int) -> list[float]:
    if frames < 2:
        return [0.0]
    return [2 * math.pi * i / (frames - 1) for i in range(frames)]


def generate_all(size: int, frames: int, duration_ms: int, out_dir: Path) -> list[Path]:
    values = sweep_values(frames)
    jobs = [
        ("rf_phase_sweep.gif", render_rf_phase_frame, "RF phase sweep"),
        ("rf_flip_angle_0_360.gif", render_flip_frame, "RF flip angle"),
        ("rotating_frame_precession.gif", render_precession_frame, "Rotating frame precession"),
        ("gyroscope_torque_precession.gif", render_gyroscope_frame, "Gyroscope torque precession"),
        ("gyroscope_short_x_push.gif", render_short_x_push_frame, "Gyroscope short x push"),
    ]
    written: list[Path] = []
    for filename, renderer, label in jobs:
        print(f"Rendering {label} -> {filename}")
        output = out_dir / filename
        save_gif(output, (renderer(size, value) for value in values), duration_ms=duration_ms)
        written.append(output)
    return written


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate MR physics rotating-frame GIF visualizations.")
    parser.add_argument("--size", type=int, default=640, help="Square output size in pixels.")
    parser.add_argument("--frames", type=int, default=73, help="Number of frames from 0 to 360 degrees.")
    parser.add_argument("--duration-ms", type=int, default=60, help="Milliseconds per GIF frame.")
    parser.add_argument("--out-dir", type=Path, default=OUTPUT_DIR, help="Output directory.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    written = generate_all(size=args.size, frames=args.frames, duration_ms=args.duration_ms, out_dir=args.out_dir)
    print("Done:")
    for path in written:
        print(f"  {path}")


if __name__ == "__main__":
    main()
