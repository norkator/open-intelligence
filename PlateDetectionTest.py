import os
from tesserocr import PyTessBaseAPI, PSM
import numpy as np
from PIL import Image
import cv2
import imutils

# Variables
image_path = os.getcwd() + '/images/'

# Read the image file
image = cv2.imread(image_path + '2020_03_22_16_54_40_0.jpg')

# Resize the image - change width to 500
image = imutils.resize(image, width=500)

# Display the original image
cv2.imshow("Original Image", image)
cv2.waitKey(1)

# RGB to Gray scale conversion
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imshow("Grayscale Conversion", gray)
cv2.waitKey(1)

# Convert to PIL image
pil_img = Image.fromarray(gray)
with PyTessBaseAPI(path=os.getcwd() + '/libraries/tesserocr/tessdata_fast-master/.', lang='eng', psm=PSM.AUTO) as api:
    api.SetImage(pil_img)
    print(api.GetUTF8Text())
    print(api.AllWordConfidences())
