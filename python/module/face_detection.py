import os
from module.face_recognition import recognize
from module import database

# App config
app_config = database.get_application_config()
output_root_folder_path = database.find_config_value(app_config, 'output_folder')

# Paths
person_path = output_root_folder_path + 'person/'
output_faces_path = output_root_folder_path + 'faces/'


# Main method to call
def recognize_person(image_file_path_name_extension, output_file_name):
    # Recognize
    detection_name_and_probability = None
    try:
        detection_name_and_probability = recognize.recognize(
            output_file_name=output_file_name, input_confidence=0.5,
            input_image=image_file_path_name_extension
        )
    except Exception as e:
        print(e)
    return detection_name_and_probability
