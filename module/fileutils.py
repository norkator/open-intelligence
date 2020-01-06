import os
import os.path
import time
from pathlib import Path

# Variables
path = os.getcwd() + '/images/'


# -----------------------------------------
# Camera image processing

# def get_camera_image_path():
#     return path


def get_camera_image_names(directory_path):
    return os.listdir(directory_path)


def get_file_extension(file_name):
    filename, file_extension = os.path.splitext(path + file_name)
    return file_extension


def get_file_create_time(file_name):
    return time.gmtime(os.path.getmtime(path + file_name))


def get_file_create_year(gm_time):
    return time.strftime('%Y', gm_time)


def get_file_create_month(gm_time):
    return time.strftime('%m', gm_time)


def get_file_create_day(gm_time):
    return time.strftime('%d', gm_time)


def get_file_create_hour(gm_time):
    return time.strftime('%H', gm_time)


def get_file_create_minute(gm_time):
    return time.strftime('%M', gm_time)


def get_file_create_second(gm_time):
    return time.strftime('%S', gm_time)


# -----------------------------------------
# Directory tools

def bool_directory_exists(directory_path):
    return Path.exists(directory_path)


def create_directory(directory_path):
    Path(directory_path).mkdir(parents=True, exist_ok=True)

# -----------------------------------------
