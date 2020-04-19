# from module import vehicle_brand
# print(vehicle_brand.detect_vehicle_brand())

# from module.vehicle_color import vehicle_color_train
# vehicle_color_train.train_color_net()

import os
from module.vehicle_color import vehicle_color_detect
vehicle_color_detect.detect_color(os.getcwd() + '/images/test.jpg')
