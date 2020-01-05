import os
import os.path
import time

# Variables
path = os.getcwd() + '/images/'


def get_camera_image_path():
    return path


def get_camera_image_names():
    return os.listdir(path)


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
