import os
from os import environ
from libraries.openalpr_64.openalpr import Alpr
import sys

# Paths
car_labels_path = os.getcwd() + '/output/car/'
alpr_dir = os.getcwd() + '/libraries/openalpr_64'
open_alpr_conf = os.getcwd() + '/libraries/openalpr_64/openalpr.conf'
open_alpr_runtime_data = os.getcwd() + '/libraries/openalpr_64/runtime_data'


def detect_license_plate(image_object, bool_move_processed, bool_use_database):
    try:

        # Set path for alpr
        environ['PATH'] = alpr_dir + ';' + environ['PATH']

        # Initialize openalpr
        alpr = Alpr("eu", open_alpr_conf, open_alpr_runtime_data)
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
            print("Plate #%d" % i)
            print("   %12s %12s" % ("Plate", "Confidence"))
            for candidate in plate['candidates']:
                prefix = "-"
                if candidate['matches_template']:
                    prefix = "*"

                print("  %s %12s%12f" % (prefix, candidate['plate'], candidate['confidence']))

        # Call when completely done to release memory
        try:
            alpr.unload()
        except Exception as e:
            print(e)


        # Show preview
        # cv2.imshow("Image", img)
        # cv2.waitKey(1)  # no freeze, refreshes for a millisecond

    except AssertionError as e:
        print(e)
