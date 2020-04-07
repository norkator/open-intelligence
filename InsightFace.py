from module import gpu_utils, fileutils
import insightface
import cv2
import os

# Testing to get speedup
os.environ["MXNET_CUDNN_AUTOTUNE_DEFAULT"] = "0"

# Paths
input_images_path = os.getcwd() + '/output/person/'
output_images_path = os.getcwd() + '/output/insightface/faces/'

# Check folder existence
fileutils.create_directory(output_images_path)

# If GPU available, use GPU else CPU (0 = GPU0)
ctx_id = -1 if gpu_utils.is_gpu_available() is False else 0

# Load model
model = insightface.model_zoo.get_model('retinaface_r50_v1')
model.prepare(ctx_id=ctx_id, nms=0.4)

# Process images
for file_name in fileutils.get_camera_image_names(input_images_path):
    if file_name != 'processed' and file_name != 'Thumbs.db' and file_name.find('.lock') is -1:
        # Loading image
        image = cv2.imread(input_images_path + file_name)
        img_show = image.copy()

        # Detect face
        boxes, landmarks = model.detect(image, threshold=0.2, scale=1.0)

        if len(boxes) > 0:
            # Save face containing image
            try:
                cv2.imwrite(output_images_path + file_name, image)
            except Exception as e:
                print(e)

            '''
            # Draw boxes
            for box in boxes:
                cv2.rectangle(img_show, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (255, 0, 0), 2)
    
            cv2.imshow('image', img_show)
            cv2.waitKey(0)
            '''