from PIL import Image

img = Image.open('public/logo-image.png').convert('RGB')
width, height = img.size

# Find bounds of the logo mark (leftmost part)
# It's darker pixels.
dark_pixels = []
for y in range(height):
    for x in range(width):
        r,g,b = img.getpixel((x,y))
        if r < 200 and g < 200 and b < 200:
            dark_pixels.append((x,y))

if dark_pixels:
    min_x = min(p[0] for p in dark_pixels)
    max_x = max(p[0] for p in dark_pixels if p[0] < width * 0.3) # Just the mark
    min_y = min(p[1] for p in dark_pixels if p[0] < width * 0.3)
    max_y = max(p[1] for p in dark_pixels if p[0] < width * 0.3)
    
    mark = img.crop((min_x, min_y, max_x, max_y))
    # Resize to 20x20
    mark = mark.resize((24, 24), Image.Resampling.NEAREST)
    
    for y in range(24):
        line = ""
        for x in range(24):
            r,g,b = mark.getpixel((x,y))
            if b > 150 and r < 100:
                line += "B "
            elif r < 150:
                line += "# "
            else:
                line += ". "
        print(line)
