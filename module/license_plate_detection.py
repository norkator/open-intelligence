import os
from os import environ
from libraries.openalpr_64.openalpr import Alpr
import sys
from module import configparser

# Custom config
open_alpr_config = configparser.open_alpr_config()

# Paths
car_labels_path = os.getcwd() + '/output/car/'
alpr_dir = os.getcwd() + '/libraries/openalpr_64'
open_alpr_conf = os.getcwd() + '/libraries/openalpr_64/openalpr.conf'
open_alpr_runtime_data = os.getcwd() + '/libraries/openalpr_64/runtime_data'


def detect_license_plate(image_object, bool_move_processed, bool_use_database):
    try:

        result_plate = None

        # Set path for alpr
        environ['PATH'] = alpr_dir + ';' + environ['PATH']

        # Initialize openalpr
        alpr = Alpr(open_alpr_config['region'], open_alpr_conf, open_alpr_runtime_data)
        if not alpr.is_loaded():
            print("Error loading OpenALPR")
            sys.exit(1)

        alpr.set_top_n(20)
        alpr.set_default_region("md")

        # Image file is loaded here
        results = alpr.recognize_file(image_object.file_path + image_object.file_name)

        i = 0
        for plate in results['results']:
            i += 1
            # print("Plate #%d" % i)
            # print("   %12s %12s" % ("Plate", "Confidence"))
            for candidate in plate['candidates']:
                prefix = "-"
                if candidate['matches_template']:
                    prefix = "*"

                # print("  %s %12s%12f" % (prefix, candidate['plate'], candidate['confidence']))
                license_plate = candidate['plate']

                if open_alpr_config['use_plate_char_length'] == 'True':
                    if (len(license_plate) == int(open_alpr_config['plate_char_length'])):
                        # Take specified length one
                        result_plate = license_plate
                        break
                else:
                    # Take first one (highest confidence)
                    result_plate = license_plate
                    break

        # Call when completely done to release memory
        try:
            alpr.unload()
        except Exception as e:
            print(e)

        # Final result
        if result_plate is not None:
            print('Result plate: ' + license_plate)
        else:
            print('Could not determine license plate!')

    except AssertionError as e:
        print(e)
