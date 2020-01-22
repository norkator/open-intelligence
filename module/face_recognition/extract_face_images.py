from pathlib import Path
from imutils import paths
import shutil
import numpy as np
import imutils
import cv2
import os

# Paths
face_extraction_output_path = os.getcwd() + '/output/face_extractions/'

# Check path existence
Path(face_extraction_output_path).mkdir(parents=True, exist_ok=True)


# Only sort out images which has face detector
# so we can automatically go thru huge amount of images suitable for training
def extract_face_images(cwd_path, input_confidence=0.5):
    # load our serialized face detector from disk
    print("[INFO] loading face detector...")
    proto_path = cwd_path + '/models/face_detection_model/' + 'deploy.prototxt'
    model_path = cwd_path + '/models/face_detection_model/' + 'res10_300x300_ssd_iter_140000.caffemodel'
    detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)

    # load our serialized face embedding model from disk
    print("[INFO] loading face recognizer...")
    embedding_model_path = cwd_path + '/models/face_detection_model/' + 'openface_nn4.small2.v1.t7'
    embedder = cv2.dnn.readNetFromTorch(embedding_model_path)

    # grab the paths to the input images in our dataset
    print("[INFO] quantifying faces...")
    input_images_path = cwd_path + '/images/'
    image_paths = list(paths.list_images(input_images_path))

    # initialize the total number of faces processed
    total = 0

    # loop over the image paths
    for (i, imagePath) in enumerate(image_paths):
        # extract the person name from the image path
        print("[INFO] processing image {}/{}".format(i + 1, len(image_paths)))
        file_name = os.path.basename(imagePath)

        # load the image, resize it to have a width of 600 pixels (while
        # maintaining the aspect ratio), and then grab the image
        # dimensions
        image = cv2.imread(imagePath)
        image = imutils.resize(image, width=600)
        (h, w) = image.shape[:2]

        # construct a blob from the image
        image_blob = cv2.dnn.blobFromImage(
            cv2.resize(image, (300, 300)), 1.0, (300, 300),
            (104.0, 177.0, 123.0), swapRB=False, crop=False)

        # apply OpenCV's deep learning-based face detector to localize
        # faces in the input image
        detector.setInput(image_blob)
        detections = detector.forward()

        # ensure at least one face was found
        if len(detections) > 0:
            # we're making the assumption that each image has only ONE
            # face, so find the bounding box with the largest probability
            i = np.argmax(detections[0, 0, :, 2])
            confidence = detections[0, 0, i, 2]

            # ensure that the detection with the largest probability also
            # means our minimum probability test (thus helping filter out
            # weak detections)
            if confidence > input_confidence:
                total += 1
                print('[INFO] Found face from ' + file_name)
                # Move original image to face including output folder
                shutil.move(imagePath, face_extraction_output_path + file_name)

    print('[INFO] Processing completed!')
