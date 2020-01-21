import os
import cv2
from pathlib import Path

# Paths
person_path = os.getcwd() + '/output/person/'
output_faces_path = os.getcwd() + '/output/faces/'
classifier_path = os.getcwd() + '/classifiers/'


def recognize_face(image_file_path_name_extension, output_file_name):
    object_cascade = cv2.CascadeClassifier(classifier_path + 'haarcascade_frontalface_default.xml')

    img = cv2.imread(image_file_path_name_extension)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_img = img.copy()

    # image, reject levels level weights.
    faces = object_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    # add this
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 0), 1)
        roi = face_img[y:y + h, x:x + w]

        # Write small images
        try:
            Path(output_faces_path).mkdir(parents=True, exist_ok=True)
            cv2.imwrite(output_faces_path + output_file_name, roi)
        except Exception as e:
            print(e)

    cv2.imshow('face', img)
    cv2.waitKey(1)  # no freeze, refreshes for a millisecond
