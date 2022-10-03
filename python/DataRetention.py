import sys
import threading

import psycopg2

from module import process_utils, database

# Config
app_config = database.get_application_config()


def retention_app():
    print('... running data retention cycle')
    # os.remove(image_object.root_path + image_object.file_path + image_object.file_name)


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
