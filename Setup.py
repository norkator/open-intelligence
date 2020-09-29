import os
import urllib.request
from pathlib import Path

models_folder = os.getcwd() + '/models/'

# Create models folder
print('Creating models folder')
Path(models_folder).mkdir(parents=True, exist_ok=True)

# Download names
print('Download coco.names')
url = 'https://raw.githubusercontent.com/ayooshkathuria/pytorch-yolo-v3/master/data/coco.names'
urllib.request.urlretrieve(url, models_folder + 'coco.names')

# Download cfg
print('Download yolovX cfg')
url = 'https://raw.githubusercontent.com/AlexeyAB/darknet/master/cfg/yolov4.cfg'
urllib.request.urlretrieve(url, models_folder + 'yolov4.cfg')

# Download weights
print('Download yolovX weights')
url = 'https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights'
urllib.request.urlretrieve(url, models_folder + 'yolov4.weights')

# Completed
print('Setup finished!')
