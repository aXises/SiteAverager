import sys
import requests
import json
from io import BytesIO
from PIL import Image

# Averages the RGB values on a given image
def average(image):
    file = None
    if "\n" in image:
        image = image[:len(image) - 1]
    result = {
        "url": image
    }
    try:
        file = Image.open(BytesIO(requests.get(image).content), "r")
    except (OSError, RuntimeError):
        result["err"] = True
        print(json.dumps(result))
        return
    if not file:
        result["err"] = True
        print(json.dumps(result))
        return
    data = file.getdata()
    ar = 0
    ag = 0
    ab = 0
    pixels = 0
    for pixels, rgb in enumerate(data):
        if isinstance(rgb, int):
            ar += rgb
            ag += rgb
            ab += rgb
        elif isinstance(rgb, tuple):
            if len(rgb) == 2:
                ar += rgb[0]
                ag += rgb[0]
                ab += rgb[0]
            else:
                ar += rgb[0]
                ag += rgb[1]
                ab += rgb[2]
        else:
            result["err"] = True
            print(json.dumps(result))
            return
    result = {
        "url": image,
        "size": [file.size[0], file.size[1]],
        "format": file.format,
        "rgb": [ar / pixels, ag / pixels, ab / pixels],
        "pixels": pixels
    }
    print(json.dumps(result))


def main(argv):
    for image in argv:
        average(image)
    sys.stdout.flush()


if __name__ == "__main__":
    main(sys.stdin.readlines())
