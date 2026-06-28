import os
from PIL import Image

logo_path = 'src/assets/images/logo.png'

if os.path.exists(logo_path):
    try:
        img = Image.open(logo_path)
        # Convert to RGBA to ensure alpha channel is evaluated
        img = img.convert("RGBA")
        
        # Get bounding box of non-transparent pixels
        bbox = img.getbbox()
        if bbox:
            # Crop the image to the bounding box
            cropped_img = img.crop(bbox)
            cropped_img.save(logo_path)
            print("Logo cropped successfully! Transparent padding removed.")
        else:
            print("Could not calculate bounding box. The image might be empty or has no alpha channel.")
    except Exception as e:
        print(f"Error cropping logo: {e}")
else:
    print(f"Logo file not found at {logo_path}")
