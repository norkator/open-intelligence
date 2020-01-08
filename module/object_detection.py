# Responsible for first stage object detection
# then sorts objects to specific categories (labels)
# which are in corresponding folders

import os
from pathlib import Path
import cv2
import numpy as np
import shutil
from module import database

# Paths
models_path = os.getcwd() + '/models/'
output_path = os.getcwd() + '/output/'
object_detection_image_path = os.getcwd() + '/output/object_detection/'


def analyze_image(image_object, bool_move_processed, bool_use_database, bool_write_object_detection_images):
    try:
        # Load Yolo
        net = cv2.dnn.readNet(models_path + "yolov3.weights", models_path + "yolov3.cfg")
        classes = []
        with open(models_path + "coco.names", "r") as f:
            classes = [line.strip() for line in f.readlines()]
        layer_names = net.getLayerNames()
        output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
        colors = np.random.uniform(0, 255, size=(len(classes), 3))

        # Loading image
        img = cv2.imread(image_object.file_path + image_object.file_name)
        img = cv2.resize(img, None, fx=0.4, fy=0.4)
        img_box = img.copy()
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
                if confidence > 0.5:
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
        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

        # Output file name
        out_file_name = image_object.year + '_' + image_object.month + '_' + image_object.day + '_' + image_object.hours + '_' + image_object.minutes + '_' + image_object.seconds

        # We finally extract all the information's and show them on the screen.
        font = cv2.FONT_HERSHEY_PLAIN
        for i in range(len(boxes)):
            if i in indexes:
                x, y, w, h = boxes[i]
                roi = img_box[y:y + h, x:x + w]
                label = str(classes[class_ids[i]])
                color = colors[i]

                cv2.rectangle(img, (x, y), (x + w, y + h), color, 1)
                cv2.putText(img, label, (x, y + 20), font, 2, color, 2)

                # Write small image
                try:
                    Path(output_path + label + '/').mkdir(parents=True, exist_ok=True)
                    cv2.imwrite(output_path + label + '/' + out_file_name + '_' + str(i) + image_object.file_extension,
                                roi)
                except Exception as e:
                    print(e)

                # Insert database intelligence
                if bool_use_database:
                    try:
                        database.insert_value(
                            label, image_object.file_path, image_object.file_name,
                            image_object.year, image_object.month, image_object.day,
                            image_object.hours, image_object.minutes, image_object.seconds
                        )
                    except Exception as e:
                        print(e)

        # Move processed image
        if bool_move_processed:
            shutil.move(image_object.file_path + image_object.file_name,
                        image_object.file_path + 'processed/' + image_object.file_name)

        # Show preview
        cv2.imshow("Image", img)
        cv2.waitKey(1)  # no freeze, refreshes for a millisecond

        # Write full detection image
        if bool_write_object_detection_images:
            try:
                Path(object_detection_image_path).mkdir(parents=True, exist_ok=True)
                cv2.imwrite(
                    object_detection_image_path + '/' + image_object.file_name + image_object.file_extension, img
                )
            except Exception as e:
                print(e)

        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
    except AssertionError as e:
        print(e)