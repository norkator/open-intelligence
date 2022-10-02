import os
from module import database, detection_utils
from module.face_recognition import extract_embeddings, train_model

# Path
app_config = database.get_application_config()
output_root_folder_path = database.find_config_value(app_config, 'output_folder')


def check_for_tasks():
    # Face model training commands
    if database.bool_run_train_face_model():
        print('[INFO] Training face model')

        # Extract embeddings
        extract_embeddings.extract_embeddings(cwd_path=os.getcwd(), input_confidence=0.5)

        # Train model
        train_model.train_model(cwd_path=os.getcwd())

    # Detection tasks for re processing
    detection_tasks = database.get_detection_tasks()
    for row in detection_tasks:
        # Get db row fields
        id = row[0]
        label = row[1]
        file_name_cropped = row[2]
        print('[INFO] Processing re-recognition task ' + file_name_cropped)

        # Path
        output_image = output_root_folder_path + label + '/' + file_name_cropped

        # Label based detection if not detected earlier
        detection_result, color = detection_utils.detect(
            label=label,
            crop_image_file_path_name_extension=output_image,
            file_name=label + '_' + file_name_cropped,
            output_file_name=None
        )

        # Write new detection result
        database.update_detection_task_result(id, detection_result)

    # Some other commands...
