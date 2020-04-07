from module import gpu_utils
import insightface
import cv2
import os

# If GPU available, use GPU else CPU
ctx_id = -1 if gpu_utils.is_gpu_available() is False else 1

# Loading image
imgSrc = os.getcwd() + '/images/' + '192.168.2.61_01_20200406080028946_MOTION_DETECTION.jpg'
image = cv2.imread(imgSrc)

model = insightface.model_zoo.get_model('retinaface_r50_v1')

model.prepare(ctx_id=ctx_id, nms=0.4)

boxes, landmarks = model.detect(image, threshold=0.2, scale=1.0)

# Draw boxes
for box in boxes:
    cv2.rectangle(image, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (255, 0, 0), 2)

cv2.imshow('image', image)
cv2.waitKey(0)
