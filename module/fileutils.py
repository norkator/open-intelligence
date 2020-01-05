from os import listdir
from os.path import isfile, join
import os

# Variables
path = os.getcwd() + '/images/'


def get_camera_image_path():
    return path


def get_camera_image_names():
    return os.listdir(path)
