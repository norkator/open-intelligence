import os
import sys
from module import configparser, database, insightface_utils, process_utils
from objects import SrFile
import psycopg2
import time

# Check does system has GPU support
# print('GPU support available: ' + str(gpu_utils.is_gpu_available()))

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

        print(str(row))

        # Construct paths
        try:
            input_image = output_root_folder_path + label + '/' + cropped_file_name
            output_image_path = output_root_folder_path + label + '/' + 'super_resolution/'
            output_image = output_image_path + cropped_file_name

            # Make objects
            if_image_object = SrFile.SrFile(id, label, cropped_file_name, input_image, output_image, detection_result, '')
            if_image_objects.append(if_image_object)
        except Exception as e:
            database.update_insight_face_as_computed('', id)  # Problem with input data, skip
            print(e)

    if len(if_image_objects) > 0:

        temp_detection_result = None

        # Process insightFace
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
            if temp_detection_result is not None and if_image_object.detection_result is None:
                if_image_object.detection_result = temp_detection_result

            # Write database, set as computed
            database.update_insight_face_as_computed(if_image_object.detection_result, if_image_object.id)

    else:
        print('No insightFace images to process')


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        try:
            process_utils.set_instance_status()
            app()
            print('... running')
        except psycopg2.OperationalError as e:
            print(e)
        time.sleep(int(process_sleep_seconds))


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
