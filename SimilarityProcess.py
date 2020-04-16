from skimage.metrics import structural_similarity as ssim
from pathlib import Path
from module import configparser, database
from objects import SrFile
import shutil
import os
import cv2
import sys
import time

# Parse configs
app_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='app')
process_sleep_seconds = app_config['process_sleep_seconds']

# Define paths
output_root_folder_path = os.getcwd() + '/output/'
test_move_path = output_root_folder_path + 'recycle/'

# Check directory existence
Path(test_move_path).mkdir(parents=True, exist_ok=True)


# Image compare process
def image_is_similar(image_a, image_b):
    # compute the mean squared error and structural similarity
    # m = mse(image_a, image_b)
    if image_a is not None or image_b is not None:
        s = ssim(image_a, image_b)
        print('Similarity: ' + str(s))
        return True if s > 0.40 else False
    else:
        return False


def app():
    # Do work
    records = database.get_images_for_similarity_check_process()
    similarity_image_objects = []
    for row in records:
        # Get db row fields
        id = row[0]
        label = row[1]
        cropped_file_name = row[2]

        # Construct paths
        input_image = output_root_folder_path + label + '/' + cropped_file_name

        # Make objects
        similarity_image_object = SrFile.SrFile(id, label, cropped_file_name, input_image, None, None)
        similarity_image_objects.append(similarity_image_object)

    # Super resolution image
    if len(similarity_image_objects) > 0:

        index = 0
        img1 = None
        img2 = None

        for similarity_image_object in similarity_image_objects:
            try:
                if index % 2:
                    print('Loading img1 ' + similarity_image_object.image_name)
                    img1 = cv2.imread(similarity_image_object.input_image)
                    img1 = cv2.resize(img1, (200, 200))
                    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
                    if image_is_similar(img1, img2):
                        # os.remove(similarity_image_object.input_image)  # Todo: take in use after working is verified
                        shutil.move(similarity_image_object.input_image,
                                    test_move_path + similarity_image_object.image_name)
                        print('Similar image removed: ' + similarity_image_object.image_name)
                        try:
                            # Try delete also super resolution image
                            os.remove(
                                output_root_folder_path + similarity_image_object.label + '/super_resolution/' +
                                similarity_image_object.image_name)
                        except Exception as e:
                            print(e)
                else:
                    print('Loading img2 ' + similarity_image_object.image_name)
                    img2 = cv2.imread(similarity_image_object.input_image)
                    img2 = cv2.resize(img2, (200, 200))
                    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
            except Exception as e:
                print(e)

            # Increment as last
            index = index + 1

            # Write database, row no longer processed later
            database.update_similarity_check_row_checked(similarity_image_object.id)
    else:
        print('No similar images to process')


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
