"""
Todo: needs total refactoring to make simple and suitable for OI
Todo: make function based structure
"""
import numpy as np
import tensorflow as tf
import cv2
import glob
from keras.models import load_model
from keras.optimizers import SGD

confidence = 0.7

labels_path = 'labels.txt'
with open(labels_path) as f:
    labels = f.readlines()
labels = [s.strip() for s in labels]

# Path to frozen detection graph. This is the actual model that is used for the object detection.
PATH_TO_CKPT = '/media/spectra/GMS/CarColorDataset/downloads/frozen_inference_graph.pb'
cv2.namedWindow('object detection', cv2.WINDOW_NORMAL)

### Load a (frozen) Tensorflow model into memory.

detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

directory = 'images'
labels = ['black', 'blue', 'brown', 'green', 'pink', 'red', 'silver', 'white', 'yellow']
config = tf.ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction = 0.2

with detection_graph.as_default():
    sess = tf.Session(graph=detection_graph, config=config)
    # init of keras model for color recognition
    sgd = SGD(lr=1e-3, decay=1e-6, momentum=0.9, nesterov=True)
    model = load_model('color_weights.hdf5')
    model.compile(optimizer=sgd, loss='categorical_crossentropy', metrics=['accuracy'])

    for file in glob.glob("{}/*".format(directory)):
        image_np = cv2.imread(file)  # Start time

        # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image_np, axis=0)
        image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
        # Each box represents a part of the image where a particular object was detected.
        boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
        # Each score represent how level of confidence for each of the objects.
        # Score is shown on the result image, together with the class label.
        scores = detection_graph.get_tensor_by_name('detection_scores:0')
        classes = detection_graph.get_tensor_by_name('detection_classes:0')
        num_detections = detection_graph.get_tensor_by_name('num_detections:0')
        # Actual detection.
        (boxes, scores, classes, num_detections) = sess.run(
            [boxes, scores, classes, num_detections],
            feed_dict={image_tensor: image_np_expanded})
        height, width, channels = image_np.shape

        # converting nn output from tensorflow format to normal
        all_boxes = []

        for i in range(boxes.shape[1]):
            all_boxes.append((int(boxes[0, i, 1] * width),
                              int(boxes[0, i, 0] * height),
                              int(boxes[0, i, 3] * width),
                              int(boxes[0, i, 2] * height)))

        all_scores = scores[0].tolist()
        all_classes = [int(x) for x in classes[0].tolist()]
        all_labels = [labels[int(x) - 1] for x in all_classes]

        ret_boxes = []
        ret_scores = []
        ret_labels = []

        for i in range(len(all_boxes)):
            if all_classes[i] in [3, 4, 6, 8] and all_scores[i] > confidence:
                ret_boxes.append(all_boxes[i])
                ret_scores.append(all_scores[i])
                ret_labels.append(all_labels[i])

        # making color prediction for every bbox from output
        for i in range(len(ret_boxes)):
            cv2.imshow('object detection', image_np[ret_boxes[i][1]:ret_boxes[i][3], ret_boxes[i][0]:ret_boxes[i][2]])
            img = cv2.resize(image_np[ret_boxes[i][1]:ret_boxes[i][3], ret_boxes[i][0]:ret_boxes[i][2]], (224, 224))

            x = np.expand_dims(img, axis=0)

            classes = model.predict(x, batch_size=1)
            print(labels[np.argmax(classes)])

            cv2.waitKey(0)
