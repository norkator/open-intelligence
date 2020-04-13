import os
import sys
from module import configparser, database, gpu_utils, insightface_utils
from objects import SrFile
import time

# Check does system has GPU support
print('GPU support available: ' + str(gpu_utils.is_gpu_available()))

# Parse configs
app_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='app')
process_sleep_seconds = app_config['process_sleep_seconds']

# Output path
output_root_folder_path = os.getcwd() + '/output/'


def is_null(input_variable):
    return input_variable is None or input_variable == '' or input_variable == ' '


def app():
    # Do work
    if_work_records = database.get_insight_face_images_to_compute()
    if_image_objects = []
    for row in if_work_records:
        # Get db row fields
        id = row[0]
        label = row[1]
        cropped_file_name = row[2]
        detection_result = row[3]

        # Construct paths
        input_image = output_root_folder_path + label + '/' + cropped_file_name
        output_image_path = output_root_folder_path + label + '/' + 'super_resolution/'
        output_image = output_image_path + cropped_file_name

        # Make objects
        if_image_object = SrFile.SrFile(id, label, cropped_file_name, input_image, output_image, detection_result)
        if_image_objects.append(if_image_object)

    # Super resolution image
    if len(if_image_objects) > 0:

        temp_detection_result = None

        # Process insightface
        for if_image_object in if_image_objects:
            try:
                temp_detection_result = insightface_utils.face_detection(
                    image_path_name_extension=if_image_object.input_image,
                    file_name=if_image_object.image_name
                )
            except Exception as e:
                print(e)

            # Save result if specified conditions are true
            # if is_null(if_image_object.detection_result):
            if temp_detection_result is not None:
                if_image_object.detection_result = temp_detection_result

            # Write database, set as computed
            database.update_insight_face_as_computed(if_image_object.detection_result, if_image_object.id)

    else:
        print('No insightface images to process')


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        app()
        print('... running')
        time.sleep(int(process_sleep_seconds))


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------


'''
from module import gpu_utils, fileutils
import insightface
import cv2
import os

# Testing to get speedup
# os.environ["MXNET_CUDNN_AUTOTUNE_DEFAULT"] = "0"

# Paths
input_images_path = 'U:' + '/output/person/'


# If GPU available, use GPU else CPU (0 = GPU0)
ctx_id = -1 if gpu_utils.is_gpu_available() is False else 0

# noinspection PyRedeclaration
ctx_id = -1

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

            # Draw boxes
            for box in boxes:
                cv2.rectangle(img_show, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (255, 0, 0), 2)
    
            cv2.imshow('image', img_show)
            cv2.waitKey(1)
'''
