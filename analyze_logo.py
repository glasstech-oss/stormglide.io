from PIL import Image

# Load the image
img = Image.open('public/logo-image.png').convert('RGB')

# Resize to something manageable like 80x20
img = img.resize((120, 30), Image.Resampling.LANCZOS)

pixels = img.load()
width, height = img.size

ascii_art = ""
for y in range(height):
    for x in range(width):
        r, g, b = pixels[x, y]
        # Check if it's blue (high B, low R/G)
        if b > 150 and r < 100 and g < 150:
            ascii_art += "\033[94mB\033[0m" # Blue
        # Check if it's dark navy (low RGB)
        elif r < 100 and g < 100 and b < 150:
            ascii_art += "\033[90mN\033[0m" # Navy
        else:
            ascii_art += " "
    ascii_art += "\n"

print(ascii_art)
