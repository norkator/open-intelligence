import os
import cv2
import imutils
import numpy as np
from module import gpu_utils


'''
file_path = os.getcwd() + '/output/car/' + '2020_03_25_17_42_16_0.jpg'

# load the image from disk
image = cv2.imread(file_path)

# Rotation with no part of the image is cut off
for angle in np.arange(-30, 30, 4):
    rotated = imutils.rotate_bound(image, angle)
    cv2.imshow("Rotated (Correct)", rotated)
    cv2.waitKey(0)
'''


