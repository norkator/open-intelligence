import os
import time

from module import fileutils, person_detection, configparser
from objects import File

# Configure input image folder
image_folders = [
    # os.getcwd() + '/output/person/',
    os.getcwd() + '/images/',
]


def app():
    # Image objects stored here
    image_file_objects = []

    # Create image objects
    for image_folder in image_folders:
        # Check for 'processed' folder existence
        fileutils.create_directory(image_folder + 'processed/')
        # Process files
        for file_name in fileutils.get_camera_image_names(image_folder):
            if file_name != 'processed':
                gm_time = fileutils.get_file_create_time(image_folder, file_name)
                file = File.File(
                    image_folder,
                    file_name,
                    fileutils.get_file_extension(image_folder, file_name),
                    fileutils.get_file_create_year(gm_time),
                    fileutils.get_file_create_month(gm_time),
                    fileutils.get_file_create_day(gm_time),
                    fileutils.get_file_create_hour(gm_time),
                    fileutils.get_file_create_minute(gm_time),
                    fileutils.get_file_create_second(gm_time)
                )
                image_file_objects.append(file)

    # Analyze image objects
    for image_object in image_file_objects:
        try:
            person_detection.analyze_image(
                image_object,
                configparser.app_config()['move_to_processed'] == 'True'
            )
        except Exception as e:
            print(e)
        time.sleep(1)


app()
