import numpy as np
from PIL import Image, ImageDraw, ImageFont

img_path = r'E:\projects\digitalstoregamesproject\emuladores.github.io\xbox360\images\299por30.png'
output_path = r'E:\projects\digitalstoregamesproject\emuladores.github.io\xbox360\images\299por47_new.png'

# Load the image
img = Image.open(img_path)
draw = ImageDraw.Draw(img)

# Convert to grayscale and invert (so text is > 0, background is 0)
gray = img.convert('L')
img_np = np.array(gray)
binary = img_np < 250  # True for text, False for white background

# Sum horizontally to find rows containing text
row_sums = binary.sum(axis=1)
active_rows = row_sums > 0

# Group active rows into lines
lines = []
in_line = False
start = 0
for y, active in enumerate(active_rows):
    if active and not in_line:
        start = y
        in_line = True
    elif not active and in_line:
        lines.append((start, y))
        in_line = False
if in_line:
    lines.append((start, len(active_rows)))

print("Detected lines:", lines)

if len(lines) < 4:
    raise ValueError(f"Expected at least 4 lines of text, found {len(lines)}")

def draw_centered_text(draw, text, cx, cy, font, fill=(0, 0, 0)):
    bbox = font.getbbox(text)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = cx - w / 2 - bbox[0]
    y = cy - h / 2 - bbox[1]
    draw.text((x, y), text, fill=fill, font=font)

# 1. Erase and replace Line 3 ("R$ 5,68" -> "R$ 7,83")
y3_start, y3_end = lines[2]
# Erase Line 3
draw.rectangle([0, y3_start, img.width, y3_end], fill=(255, 255, 255))
# Find best font size
target_h = y3_end - y3_start
font_size = target_h
for fs in range(int(target_h * 2), 1, -1):
    try:
        font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", fs)
    except:
        font = ImageFont.truetype("arialbd.ttf", fs)
    bbox = font.getbbox("R$ 7,83")
    h = bbox[3] - bbox[1]
    if h <= target_h:
        font_size = fs
        break

font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", font_size) if font_size else ImageFont.load_default()
cx = img.width / 2
cy = (y3_start + y3_end) / 2
draw_centered_text(draw, "R$ 7,83", cx, cy, font)

# 2. Erase and replace Line 4 ("No Cartão ou R$ 30,00 á vista." -> "No Cartão ou R$ 47,00 á vista.")
y4_start, y4_end = lines[3]
# Erase Line 4
draw.rectangle([0, y4_start, img.width, y4_end], fill=(255, 255, 255))
# Find best font size
target_h4 = y4_end - y4_start
font_size_4 = target_h4
for fs in range(int(target_h4 * 2), 1, -1):
    try:
        font_4 = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", fs)
    except:
        font_4 = ImageFont.truetype("arialbd.ttf", fs)
    bbox = font_4.getbbox("No Cartão ou R$ 47,00 á vista.")
    h = bbox[3] - bbox[1]
    if h <= target_h4:
        font_size_4 = fs
        break

font_4 = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", font_size_4) if font_size_4 else ImageFont.load_default()
cy4 = (y4_start + y4_end) / 2
draw_centered_text(draw, "No Cartão ou R$ 47,00 á vista.", cx, cy4, font_4)

img.save(output_path)
print("Saved edited image to", output_path)
