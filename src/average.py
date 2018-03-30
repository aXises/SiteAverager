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
        "err": "None",
        "image": image
    }
    try:
        file = Image.open(BytesIO(requests.get(image).content), "r")
    except (OSError, RuntimeError):
        result["err"] = "readErr"
        print(json.dumps(result))
        return
    if file == None:
        result["err"] = "badInput"
        print(json.dumps(result))
        return
    x = file.getdata()
    ar = 0
    ag = 0
    ab = 0
    pixels = 0
    for i, a in enumerate(x):
        pixels = i
        if isinstance(a, int):
            ar += a
            ag += a
            ab += a
        elif isinstance(a, tuple):
            if len(a) == 2:
                ar += a[0]
                ag += a[0]
                ab += a[0]
            else:
                ar += a[0]
                ag += a[1]
                ab += a[2]
        else:
            result["err"] = "parsePixelErr"
            print(json.dumps(result))
            return
    result["averageRGB"] = [round(ar / i), round(ag / i), round(ab / i)]
    result["prop"] = {
        "size": [file.size[0], file.size[1]],
        "format": file.format,
        "pixels": pixels
    }
    print(json.dumps(result))


def main(argv):
    for image in argv:
        average(image)
    sys.stdout.flush()


if __name__ == "__main__":
    main(sys.stdin.readlines())