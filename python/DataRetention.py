import sys
import threading
import os

import psycopg2

from module import process_utils, database

# Config
app_config = database.get_application_config()
output_root_folder_path = database.find_config_value(app_config, 'output_folder')
data_retention_days = int(database.find_config_value(app_config, 'data_retention_days'))
data_retention_enabled = True if database.find_config_value(app_config, 'data_retention_enabled') == 'True' else False

print(output_root_folder_path)
print(data_retention_days)


def retention_app():
    if data_retention_enabled:
        print('running data retention cycle')

        # Do work
        dr_work_records = database.get_data_retention_data(data_retention_days)
        for row in dr_work_records:
            # Get db row fields
            id = row[0]
            label = row[1]
            file_name = row[2]
            cropped_file_name = row[3]
            sr_image_name = row[4]

            print('deleting', id, label, file_name)
            try:
                os.remove(output_root_folder_path + 'object_detection/' + file_name + '.jpg')
            except Exception as e:
                print(e)
            try:
                os.remove(output_root_folder_path + label + '/' + cropped_file_name)
            except Exception as e:
                print(e)
            try:
                os.remove(output_root_folder_path + label + '/' + 'super_resolution/' + cropped_file_name)
            except Exception as e:
                print(e)

            # update as deleted
            database.update_data_retention_data_deleted(id)
    else:
        print('data retention is disabled')


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    try:
        process_utils.set_instance_status()
        retention_app()
        threading.Timer((3 * 60 * 60), retention_app).start()
    except psycopg2.OperationalError as e:
        print(e)


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
