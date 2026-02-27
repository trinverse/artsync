from PIL import Image
import sys

def crop_transparency(img_path, output_path):
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        bbox = img.getbbox()
        if bbox:
            cropped_img = img.crop(bbox)
            # Resize to square (optional, but good for favicon)
            # Determine new size (max dimension)
            w, h = cropped_img.size
            max_dim = max(w, h)
            new_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
            # Paste centered
            new_img.paste(cropped_img, ((max_dim - w) // 2, (max_dim - h) // 2))
            new_img.save(output_path)
            print(f"Successfully cropped and saved to {output_path}")
        else:
            print("Image is fully transparent or empty.")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    crop_transparency("tab-icon.png", "tab-icon-large.png")
