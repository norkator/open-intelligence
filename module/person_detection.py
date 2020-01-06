import os
import cv2

# Paths
person_path = os.getcwd() + '/output/person/'


def analyze_image(image_object, bool_move_processed):
    object_cascade = cv2.CascadeClassifier('person_cascade.xml')

    ret, img = cv2.imread(image_object.file_path + image_object.file_name)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # image, reject levels level weights.
    img_object = object_cascade.detectMultiScale(gray, 50, 50)

    # add this
    for (x, y, w, h) in img_object:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 0), 2)

    cv2.imshow('img', img)
    cv2.waitKey(1)  # no freeze, refreshes for a millisecond
