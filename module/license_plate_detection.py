import os
from os import environ
from pathlib import Path
import imutils
from libraries.openalpr_64.openalpr import Alpr
from module import configparser
import numpy as np
import cv2
from objects import Plate

# Custom config
open_alpr_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='openalpr')
alpr_enabled = open_alpr_config['enabled'] == 'True'
region = open_alpr_config['region']
use_plate_char_length = open_alpr_config['use_plate_char_length'] == 'True'
plate_char_length = int(open_alpr_config['plate_char_length'])

# Paths
car_labels_path = os.getcwd() + '/output/car/'
rotation_temp_images_path = os.getcwd() + '/output/rotation_temp/'
alpr_dir = os.getcwd() + '/libraries/openalpr_64'
open_alpr_conf = os.getcwd() + '/libraries/openalpr_64/openalpr.conf'
open_alpr_runtime_data = os.getcwd() + '/libraries/openalpr_64/runtime_data'


def detect_license_plate(input_image, file_name, use_rotation=False):
    try:

        if alpr_enabled:

            # Validate file path
            if os.path.exists(input_image):

                result_plates = []  # From here we pick one with highest confidence
                result_plate = None

                # Set path for alpr
                environ['PATH'] = alpr_dir + ';' + environ['PATH']

                all_images = [input_image]
                rotation_images = get_rotation_images(use_rotation, input_image, file_name)
                all_images = all_images + rotation_images  # append together
                for image in all_images:

                    # Initialize openalpr
                    alpr = Alpr(region, open_alpr_conf, open_alpr_runtime_data)
                    if not alpr.is_loaded():
                        print("Error loading OpenALPR")
                        return ''

                    alpr.set_top_n(20)
                    alpr.set_default_region("md")

                    # Image file is loaded here
                    results = alpr.recognize_file(image)
                    print("Run ALPR for: " + image)

                    i = 0
                    for plate in results['results']:
                        i += 1
                        print("Plate #%d" % i)
                        print("   %12s %12s" % ("Plate", "Confidence"))
                        for candidate in plate['candidates']:
                            prefix = "-"
                            if candidate['matches_template']:
                                prefix = "*"

                            print("  %s %12s%12f" % (prefix, candidate['plate'], candidate['confidence']))
                            license_plate = candidate['plate']
                            confidence = candidate['confidence']

                            if use_plate_char_length:
                                if len(license_plate) == plate_char_length:
                                    # Take specified length one
                                    result_plates.append(
                                        Plate.Plate(
                                            region_filter(license_plate, region),
                                            confidence
                                        )
                                    )
                                    break
                            else:
                                # Take first one (highest confidence)
                                result_plates.append(
                                    Plate.Plate(
                                        region_filter(license_plate, region),
                                        confidence
                                    )
                                )
                                break

                    # Call when completely done to release memory
                    try:
                        alpr.unload()
                    except Exception as e:
                        print(e)

                # Delete temporary rotation images
                if len(rotation_images) > 0:
                    for ri in rotation_images:
                        os.remove(ri)

                # Sort array
                result_plates.sort(key=lambda x: x.confidence, reverse=True)

                # Take first if has one
                if len(result_plates) > 0:
                    result_plate = result_plates[0].plate

                # Final result
                if result_plate is not None:
                    print('Result plate: ' + result_plate)
                else:
                    print('Did not recognize any license plate.')

                return result_plate

            else:
                # Invalid file path
                return ''

        else:
            # Alpr not enabled
            return ''

    except AssertionError as e:
        print(e)
        return ''


# Rotate image to boost plate finding probability
def get_rotation_images(use_rotation, input_image, image_name):
    rotation_images = []
    if use_rotation is True:
        # Check temp folder existence
        Path(rotation_temp_images_path).mkdir(parents=True, exist_ok=True)
        # Rotation with no part of the image is cut off
        image = cv2.imread(input_image)
        i = 0
        for angle in np.arange(-30, 30, 4):
            rotated = imutils.rotate_bound(image, angle)
            try:
                file_name = rotation_temp_images_path + 'rotation_' + image_name + '_' + str(i) + '.jpg'
                cv2.imwrite(file_name, rotated)
                rotation_images.append(file_name)
                i = i + 1
            except Exception as e:
                print(e)
    return rotation_images


# Filter plate based on region
def region_filter(license_plate, region='eu'):
    # Europe
    if region == 'eu':
        if len(license_plate) >= 6:
            a = license_plate[0:3]
            b = license_plate[3:len(license_plate)] \
                .replace('I', '1') \
                .replace('O', '0') \
                .replace('S', '5') \
                .replace('B', '8') \
                .replace('D', '0') \
                .replace('Z', '2')
            license_plate = a + b
    # More region specific rules?
    return license_plate
