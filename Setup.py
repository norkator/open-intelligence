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
print('Download yolov3.cfg')
url = 'https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3.cfg'
urllib.request.urlretrieve(url, models_folder + 'yolov3.cfg')

# Download weights
print('Download yolov3.weights')
url = 'https://pjreddie.com/media/files/yolov3.weights'
urllib.request.urlretrieve(url, models_folder + 'yolov3.weights')

# Completed
print('Setup finished!')
