from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/tycoon_launch_assets/The_Digital_Tycoon_Playbook_Cover.png')
destination = Path('/home/ubuntu/tycoon_launch_assets/The_Digital_Tycoon_Playbook_Payhip_Cover_1600x2400.png')

with Image.open(source) as image:
    image = image.convert('RGB')
    resized = image.resize((1600, 2400), Image.Resampling.LANCZOS)
    resized.save(destination, format='PNG', optimize=True)

print(destination)
