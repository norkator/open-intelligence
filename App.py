import os
from module import fileutils, object_detection, configparser, actions
from objects import File
import sys
import time

app_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='app')
time_offset_hours = int(app_config['time_offset_hours'])
print('time offset: ' + str(time_offset_hours))

# Specify your names and folders at config.ini
# split them by a,b,c,d
names = ['App1']
folders = [os.getcwd() + '/images/']

# Parse camera name and folder config
camera_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='camera')
camera_names_config = camera_config['camera_names'].split(',')
camera_folders_config = camera_config['camera_folders'].split(',')

# Append in names and folders
for n, f in zip(camera_names_config, camera_folders_config):
    names.append(n)
    folders.append(f)


def app():
    # Image objects stored here
    image_file_objects = []

    # Create image objects
    for name, folder in zip(names, folders):
        # Check for 'processed' folder existence
        fileutils.create_directory(folder + 'processed/')
        # Process files
        for file_name in fileutils.get_camera_image_names(folder):
            if file_name != 'processed' and file_name != 'Thumbs.db':
                gm_time = fileutils.get_file_create_time(folder, file_name)
                file = File.File(
                    name,
                    folder,
                    file_name,
                    fileutils.get_file_extension(folder, file_name),
                    fileutils.get_file_create_year(gm_time),
                    fileutils.get_file_create_month(gm_time),
                    fileutils.get_file_create_day(gm_time),
                    fileutils.get_file_create_hour(gm_time, time_offset_hours),
                    fileutils.get_file_create_minute(gm_time),
                    fileutils.get_file_create_second(gm_time)
                )
                image_file_objects.append(file)

    # Analyze image objects
    for image_object in image_file_objects:
        try:
            # Also runs all sub processes
            object_detection.analyze_image(
                image_object,
                app_config['move_to_processed'] == 'True',
                app_config['use_database'] == 'True',
                app_config['write_object_detection_images'] == 'True',
            )
        except Exception as e:
            print(e)


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        actions.check_for_tasks()
        app()
        print('... running')
        time.sleep(int(app_config['process_sleep_seconds']))


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
