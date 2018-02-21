import sys
import requests
import json
from io import BytesIO
from PIL import Image

# Averages the RGB values on a given image
def average(image):
    file = None
    err = None
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
    for i in range(len(x)):
        if type(x[i]) != type(tuple()):
            result["err"] = "corruptPixel"
            break
        ar += x[i][0]
        ag += x[i][1]
        ab += x[i][2]
    result["averageRGB"] = [round(ar / len(x)), round(ag / len(x)), round(ab / len(x))]
    result["prop"] = {
        "size": [file.size[0], file.size[1]],
        "format": file.format
    }
    print(json.dumps(result))


def main(argc, argv):
    data = sys.stdin.readlines()
    for image in data:
        average(image)
    sys.stdout.flush()


if __name__ == "__main__":
    main(len(sys.argv), sys.argv)