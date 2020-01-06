import os
import cv2

# Paths
person_path = os.getcwd() + '/output/person/'
classifier_path = os.getcwd() + '/classifiers/'


def analyze_image(image_object, bool_move_processed):
    object_cascade = cv2.CascadeClassifier(classifier_path + 'haarcascade_frontalface_alt.xml')

    img = cv2.imread(image_object.file_path + image_object.file_name)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # image, reject levels level weights.
    faces = object_cascade.detectMultiScale(gray, 1.3, 5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

    # add this
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 0), 1)

    cv2.imshow('img', img)
    cv2.waitKey(1)  # no freeze, refreshes for a millisecond
