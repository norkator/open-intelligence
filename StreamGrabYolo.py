# Just simple tool to grab jpeg stream from any camera, show constantly yolo detections
from module import configparser
import numpy as np
import os
import sys
import time

import cv2

# Paths
models_path = os.getcwd() + '/models/'

# Config
steam_url = str(configparser.any_config(section='streamgrab')['jpegstream'])
confidence_ = float(configparser.any_config(section='streamgrab')['confidence'])

# Load Yolo
net = cv2.dnn.readNet(models_path + "yolov3.weights", models_path + "yolov3.cfg")
classes = []
with open(models_path + "coco.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]
layer_names = net.getLayerNames()
output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
colors = np.random.uniform(0, 255, size=(len(classes), 3))


def grab():
    cap = cv2.VideoCapture(steam_url)
    ret, img = cap.read()

    # img = cv2.resize(img, None, fx=0.4, fy=0.4)
    height, width, channels = img.shape

    # Detecting objects
    blob = cv2.dnn.blobFromImage(img, 0.00392, (608, 608), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)

    # Showing information's on the screen
    class_ids = []
    confidences = []
    boxes = []
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > confidence_:
                # Object detected
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                # Rectangle coordinates
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    # When we perform the detection, it happens that we have more boxes for the same object, so we should use
    # another function to remove this “noise”. It’s called Non maximum suppression.
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, confidence_, 0.4)

    # We finally extract all the information's and show them on the screen.
    font = cv2.FONT_HERSHEY_PLAIN
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(classes[class_ids[i]])
            color = colors[i]

            cv2.rectangle(img, (x, y), (x + w, y + h), color, 1)
            cv2.putText(img, label, (x, y+10), font, 1, color, 2)

    cv2.imshow('Stream', img)
    cv2.waitKey(1)  # no freeze, refreshes for a millisecond


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        grab()
        # time.sleep(1)


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
