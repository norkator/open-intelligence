import os
from pathlib import Path
from module import database
from objects import TrainingFile

# Paths
output_root_folder_path = os.getcwd() + '/output/'
output_lp_training_path = os.getcwd() + '/output/lp_training/'

# Check path existence
Path(output_lp_training_path).mkdir(parents=True, exist_ok=True)


def app():
    rows = database.get_labeled_for_training_lp_images()
    lp_training_image_objects = []
    for row in rows:
        # Get db row fields
        # noinspection PyShadowingBuiltins
        id = row[0]
        label = row[1]
        file_name_cropped = row[2]
        labeling_image_x = row[3]
        labeling_image_y = row[4]
        labeling_image_x2 = row[5]
        labeling_image_y2 = row[6]

        # Construct paths
        input_image = output_root_folder_path + label + '/' + file_name_cropped

        # Make objects
        lp_training_image_object = TrainingFile.TrainingFile(
            id, label, file_name_cropped,
            labeling_image_x, labeling_image_y, labeling_image_x2, labeling_image_y2,
            input_image
        )
        lp_training_image_objects.append(lp_training_image_object)

    # Export process
    if len(lp_training_image_objects) > 0:
        for trainingFile in lp_training_image_objects:
            print(trainingFile.file_full_path)
    else:
        print('No new sr image objects to process')


app()
