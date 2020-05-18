# from module import vehicle_brand
# print(vehicle_brand.detect_vehicle_brand())

# '''
# TRAIN VEHICLE COLOR MODEL
from module.vehicle_color import vehicle_color_train

vehicle_color_train.train_color_net()
# '''

'''
# TEST VEHICLE COLOR MODEL
import os
from module.vehicle_color import vehicle_color_detect

# vehicle_color_detect.detect_color(os.getcwd() + '/images/test.jpg')

vehicle_color_detect.detect_colors_from_folder(os.getcwd() + '/output/dataset/train/black/')
'''