from PIL import Image
import random
import os

output_dir = "concert-2025\songs\img"
os.makedirs(output_dir, exist_ok=True)

# 고정된 색상 목록 또는 랜덤 컬러
base_colors = [
    (255, 99, 71),    # tomato
    (135, 206, 250),  # light sky blue
    (144, 238, 144),  # light green
    (255, 182, 193),  # light pink
    (221, 160, 221),  # plum
    (255, 215, 0),    # gold
    (100, 149, 237),  # cornflower blue
    (255, 160, 122),  # light salmon
    (186, 85, 211),   # medium orchid
    (240, 230, 140),  # khaki
    (255, 105, 180),  # hot pink
    (72, 209, 204),   # medium turquoise
    (60, 179, 113),   # medium sea green
    (123, 104, 238),  # medium slate blue
    (255, 228, 181),  # moccasin
    (32, 178, 170),   # light sea green
    (199, 21, 133),   # medium violet red
    (176, 196, 222),  # light steel blue
    (255, 250, 205),  # lemon chiffon
    (210, 105, 30)    # chocolate
]

# 이미지 생성
file_paths = []
for i in range(25):
    color = base_colors[i % len(base_colors)]
    img = Image.new("RGB", (500, 500), color)
    filename = f"track_{i+1:02d}.jpg"
    filepath = os.path.join(output_dir, filename)
    img.save(filepath)
    file_paths.append(filepath)

file_paths
