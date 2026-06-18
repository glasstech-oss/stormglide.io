from PIL import Image

img = Image.open('public/logo-image.png').convert('RGB')
width, height = img.size

blue_pixels = []
for x in range(int(width * 0.3), width): # Skip the logo mark
    for y in range(height):
        r,g,b = img.getpixel((x,y))
        if b > 150 and r < 100:
            blue_pixels.append((x,y))

if blue_pixels:
    min_x = min(p[0] for p in blue_pixels)
    max_x = max(p[0] for p in blue_pixels)
    print(f"Found blue pixels in text! X-range: {min_x} to {max_x}. Total width: {width}")
else:
    print("No blue pixels in text.")
