import os
import sys
from argparse import ArgumentParser
from libraries.fast_srgan import infer_oi
from pathlib import Path
from module import configparser, database, detection_utils, gpu_utils
from objects import SrFile
import time

# Parse arguments
parser = ArgumentParser()
parser.add_argument('--testfile', type=str,
                    help='Test mode loads image from project /images folder. Specify image name.')

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
    sr_work_records = database.get_super_resolution_images_to_compute()
    sr_image_objects = []
    for row in sr_work_records:
        # Get db row fields
        id = row[0]
        label = row[1]
        cropped_file_name = row[2]
        detection_result = row[3]

        # Construct paths
        input_image = output_root_folder_path + label + '/' + cropped_file_name
        output_image_path = output_root_folder_path + label + '/' + 'super_resolution/'
        output_image = output_image_path + cropped_file_name

        # Check path existence
        Path(output_image_path).mkdir(parents=True, exist_ok=True)

        # Make objects
        sr_image_object = SrFile.SrFile(id, label, cropped_file_name, input_image, output_image, detection_result, '')
        sr_image_objects.append(sr_image_object)

    # Super resolution image
    if len(sr_image_objects) > 0:
        # Process super resolution images
        sr_image_objects = infer_oi.process_super_resolution_images(
            sr_image_objects=sr_image_objects
        )

        # Process results
        for sr_image_object in sr_image_objects:
            # Label based detection if not detected earlier
            if is_null(sr_image_object.detection_result):
                sr_image_object.detection_result = detection_utils.detect(
                    label=sr_image_object.label,
                    crop_image_file_path_name_extension=sr_image_object.output_image,
                    file_name=sr_image_object.image_name,
                    output_file_name=sr_image_object.label + '_' + sr_image_object.image_name,
                    use_rotation=True
                )
            # Write database, row no longer processed later
            database.update_super_resolution_row_result(
                sr_image_object.detection_result,
                sr_image_object.color,
                sr_image_object.image_name,
                sr_image_object.id
            )
    else:
        print('No new sr image objects to process')


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        app()
        print('... running')
        time.sleep(int(process_sleep_seconds))


if __name__ == '__main__':
    try:
        args = parser.parse_args()
        if args.testfile is None:
            # Normal process mode
            main_loop()
        else:
            # Test mode
            sr_test_images = [SrFile.SrFile(
                None, None, None,
                os.getcwd() + '/images/' + args.testfile, os.getcwd() + '/images/' + 'sr_' + args.testfile, None)]
            infer_oi.process_super_resolution_images(sr_test_images)
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
