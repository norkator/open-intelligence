"""
This is like App.py, base process running /module/hikvision_sound/hk_sound_extractor.py
which purpose is to look for images requiring audio extracting
"""
import os
from module.hikvision_sound import hk_sound_extractor
from module import configparser, actions, process_utils
import sys
import time

# Config
app_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='app')
move_to_processed = app_config['move_to_processed'] == 'True'
process_sleep_seconds = int(app_config['process_sleep_seconds'])


def app():
    hk_sound_extractor.app()


# ---------------------------------------------------------------------
# Keeps program running

def main_loop():
    while 1:
        process_utils.set_instance_status()
        actions.check_for_tasks()
        app()
        print('... sound extractor running')
        time.sleep(process_sleep_seconds)


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print >> sys.stderr, '\nExiting by user request.\n'
        sys.exit(0)

# ---------------------------------------------------------------------
