import os
from datetime import datetime
from argparse import ArgumentParser
from module import fileutils, object_detection, actions, process_utils, database
from objects import File
import psycopg2
import sys
import time

# Config
app_config = database.get_application_config()
move_to_processed = database.find_config_value(app_config, 'move_to_processed') == 'True'
process_sleep_seconds = int(database.find_config_value(app_config, 'process_sleep_seconds'))

# Get current time offset
ts = time.time()
utc_offset = (datetime.fromtimestamp(ts) - datetime.utcfromtimestamp(ts)).total_seconds()
time_offset_hours = int(utc_offset / 60 / 60)
print('Time offset: ' + str(time_offset_hours))

# Specify your names and folders at ui configuration page
# split them by a,b,c,d
names = []  # ['App1']
folders = []  # [os.getcwd() + '/images/']

# Process arguments
parser = ArgumentParser()
parser.add_argument('--bool_slave_node', type=str, help='Multi node support, give string True as input if slave.')
args = parser.parse_args()

# Parse camera name and folder config
cameras_root_path = database.find_config_value(app_config, 'cameras_root_path')
camera_names_config = database.find_config_value(app_config, 'camera_names').split(',')
camera_folders_config = database.find_config_value(app_config, 'camera_folders').split(',')

# Append in names and folders
for n, f in zip(camera_names_config, camera_folders_config):
    names.append(n)
    folders.append(f)


# Return source folder files but from old to last
def get_time_sorted_files():
    time_sorted_files = []
    for name, folder in zip(names, folders):
        fileutils.create_directory(cameras_root_path + folder + 'processed/')
        for file_name in fileutils.get_camera_image_names(cameras_root_path + folder):
            if file_name != 'processed' and file_name != 'Thumbs.db' and file_name.find('.lock') is -1:
                try:
                    time_sorted_files.append(
                        File.File(
                            name,
                            cameras_root_path,
                            folder,
                            file_name,
                            None,
                            None,
                            None,
                            None,
                            None,
                            None,
                            None,
                            fileutils.get_file_mtime(cameras_root_path, folder, file_name)
                        )
                    )
                except Exception as e:
                    print(e)
                    print(file_name + ' file is already taken.')

    time_sorted_files.sort(key=lambda x: x.getmtime, reverse=False)
    return time_sorted_files


def remove_file_lock(path_name_lock):
    try:
        os.remove(path_name_lock)
    except FileNotFoundError as e:
        print('No locking file was found to be deleted')
    except PermissionError as e:
        print('No permission, access denied for deletion')
    except Exception as e:
        print(e)


# Pick files for processing, lock and process them
def app():
    # Files for processing
    sorted_files = get_time_sorted_files()

    # Image objects ready for processing are stored here
    image_file_objects = []

    # Count of files taken / to take
    taken_files_count = 0
    max_files_to_take = 4

    # Create image objects
    for sorted_file in sorted_files:

        # File locking check and locking
        if not os.path.isfile(sorted_file.root_path + sorted_file.file_path + sorted_file.file_name + '.lock'):
            try:
                # Limited amount of files
                taken_files_count = taken_files_count + 1
                if taken_files_count > max_files_to_take:
                    break

                # Lock file and process
                open(sorted_file.root_path + sorted_file.file_path + sorted_file.file_name + '.lock', 'a').close()
                # Append for processing
                gm_time = fileutils.get_file_create_time(sorted_file.root_path, sorted_file.file_path,
                                                         sorted_file.file_name)
                file = File.File(
                    sorted_file.name,
                    sorted_file.root_path,
                    sorted_file.file_path,
                    sorted_file.file_name,
                    fileutils.get_file_extension(sorted_file.root_path, sorted_file.file_path, sorted_file.file_name),
                    fileutils.get_file_create_year(gm_time),
                    fileutils.get_file_create_month(gm_time),
                    fileutils.get_file_create_day(gm_time),
                    fileutils.get_file_create_hour(gm_time, time_offset_hours),
                    fileutils.get_file_create_minute(gm_time),
                    fileutils.get_file_create_second(gm_time),
                    None
                )
                image_file_objects.append(file)
            except FileNotFoundError as e:
                print(e)
                pass

    # Analyze image objects
    for image_object in image_file_objects:
        try:
            # Also runs all sub processes
            object_detection.analyze_image(
                image_object,
                move_to_processed,
            )
        except AttributeError as a:
            print('Invalid image file or storage may be run out', a)
            database.insert_notification(
                'Invalid image file or camera storage may be run out for camera ' +
                image_object.name
            )
            # try remove the file
            os.remove(image_object.root_path + image_object.file_path + image_object.file_name)
        except Exception as e:
            print(e)
        finally:
            # Finally remove lock file so those don't pile up
            remove_file_lock(image_object.root_path + image_object.file_path + image_object.file_name + '.lock')


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        try:
            process_utils.set_instance_status()
            actions.check_for_tasks()
            app()
            print('... running')
        except psycopg2.OperationalError as e:
            print(e)
        time.sleep(process_sleep_seconds)


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
