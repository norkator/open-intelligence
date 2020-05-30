from pathlib import Path
from module import configparser
import numpy as np
import shutil
import imutils
import pickle
import cv2
import os

# Config
face_recognition_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='facerecognition')
file_name_prefix = str(face_recognition_config['file_name_prefix'])
cv2_imshow_enabled = True if configparser.any_config(section='app')['cv2_imshow_enabled'] == 'True' else False

# Paths
recognizer_path = None
label_encoder_path = None
output_faces_path = None
output_faces_dataset = None

# Set paths
output_root_path = face_recognition_config['output_root_path']
if str(output_root_path) == 'cwd':
    # Stock paths
    recognizer_path = os.getcwd() + '/output/faces_models/' + 'recognizer.pickle'
    label_encoder_path = os.getcwd() + '/output/faces_models/' + 'label_encoder.pickle'
    output_faces_path = os.getcwd() + '/output/faces/'
    output_faces_dataset = os.getcwd() + '/output/faces_dataset/'
else:
    # Custom paths
    recognizer_path = output_root_path + '/faces_models/' + 'recognizer.pickle'
    label_encoder_path = output_root_path + '/faces_models/' + 'label_encoder.pickle'
    output_faces_path = output_root_path + '/faces/'
    output_faces_dataset = output_root_path + '/faces_dataset/'


def recognize(output_file_name=None, input_confidence=0.5, input_image=None):
    # Output field
    detection_name_and_probability = None

    # load our serialized face detector from disk
    print("[INFO] loading face detector...")
    proto_path = os.getcwd() + '/models/face_detection_model/' + 'deploy.prototxt'
    model_path = os.getcwd() + '/models/face_detection_model/' + 'res10_300x300_ssd_iter_140000.caffemodel'
    detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)

    # load our serialized face embedding model from disk
    print("[INFO] loading face recognizer...")
    embedding_model_path = os.getcwd() + '/models/face_detection_model/' + 'openface_nn4.small2.v1.t7'
    embedder = cv2.dnn.readNetFromTorch(embedding_model_path)

    # load the actual face recognition model along with the label encoder
    recognizer = pickle.loads(open(recognizer_path, "rb").read())
    label_encoder = pickle.loads(open(label_encoder_path, "rb").read())

    # load the image, resize it to have a width of 600 pixels (while
    # maintaining the aspect ratio), and then grab the image dimensions
    image = cv2.imread(input_image)
    image = imutils.resize(image, width=600)
    (h, w) = image.shape[:2]

    # construct a blob from the image
    image_blob = cv2.dnn.blobFromImage(
        cv2.resize(image, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0), swapRB=False, crop=False
    )

    # apply OpenCV's deep learning-based face detector to localize
    # faces in the input image
    detector.setInput(image_blob)
    detections = detector.forward()

    # loop over the detections
    for i in range(0, detections.shape[2]):
        # extract the confidence (i.e., probability) associated with the
        # prediction
        confidence = detections[0, 0, i, 2]

        # filter out weak detections
        if confidence > input_confidence:
            # compute the (x, y)-coordinates of the bounding box for the
            # face
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            # extract the face ROI
            face = image[startY:endY, startX:endX]
            (fH, fW) = face.shape[:2]

            # ensure the face width and height are sufficiently large
            if fW < 20 or fH < 20:
                continue

            # construct a blob for the face ROI, then pass the blob
            # through our face embedding model to obtain the 128-d
            # quantification of the face
            face_blob = cv2.dnn.blobFromImage(face, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False)
            embedder.setInput(face_blob)
            vec = embedder.forward()

            # perform classification to recognize the face
            preds = recognizer.predict_proba(vec)[0]
            j = np.argmax(preds)
            proba = preds[j]
            name = label_encoder.classes_[j]

            # draw the bounding box of the face along with the associated
            # probability
            text = "{}: {:.2f}%".format(name, proba * 100)
            detection_name_and_probability = text
            print("[INFO] " + text)
            y = startY - 10 if startY - 10 > 10 else startY + 10
            cv2.rectangle(image, (startX, startY), (endX, endY), (0, 255, 255), 2)
            cv2.putText(image, text, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 2)

            # Write small face images
            if output_file_name is not None:
                try:
                    Path(output_faces_path).mkdir(parents=True, exist_ok=True)
                    cv2.imwrite(output_faces_path + file_name_prefix + output_file_name, face)
                except Exception as e:
                    print(e)

            # Copy original image to faces dataset for later training,
            # also create image having bounding box for front end ui validation
            try:
                Path(output_faces_dataset).mkdir(parents=True, exist_ok=True)
                shutil.copy(input_image, output_faces_dataset + file_name_prefix + output_file_name)
                cv2.imwrite(output_faces_dataset + 'RECT_' + file_name_prefix + output_file_name, image)
            except Exception as e:
                print(e)

    # show the output image
    if cv2_imshow_enabled is True:
        cv2.imshow("PickleFaceRec", image)
        cv2.waitKey(1)  # no freeze, refreshes for a millisecond

    # Return result
    return detection_name_and_probability


# Customized to suit for insight face
def recognize_for_insight_face(input_face, input_confidence=0.5):
    # Output field
    detection_name_and_probability = None

    # Resize input image
    input_face = imutils.resize(input_face, width=600)

    # load our serialized face embedding model from disk
    print("[INFO] loading face recognizer...")
    embedding_model_path = os.getcwd() + '/models/face_detection_model/' + 'openface_nn4.small2.v1.t7'
    embedder = cv2.dnn.readNetFromTorch(embedding_model_path)

    # load the actual face recognition model along with the label encoder
    recognizer = pickle.loads(open(recognizer_path, "rb").read())
    label_encoder = pickle.loads(open(label_encoder_path, "rb").read())

    # construct a blob for the face ROI, then pass the blob
    # through our face embedding model to obtain the 128-d
    # quantification of the face
    face_blob = cv2.dnn.blobFromImage(input_face, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False)
    embedder.setInput(face_blob)
    vec = embedder.forward()

    # perform classification to recognize the face
    preds = recognizer.predict_proba(vec)[0]
    j = np.argmax(preds)
    proba = preds[j]
    name = label_encoder.classes_[j]

    # draw the bounding box of the face along with the associated
    # probability
    text = "{}: {:.2f}%".format(name,
                                proba * 100) + ' (if)'  # Added 'if' to the end to detect that this is from insightface
    detection_name_and_probability = text

    # Return result
    return detection_name_and_probability
