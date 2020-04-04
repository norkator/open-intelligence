import tensorflow
# from tensorflow import keras
from tensorflow.python.client import device_lib


def get_available_gpus():
    # tensorflow.config.experimental.list_physical_devices('GPU')
    local_device_protos = device_lib.list_local_devices()
    return [x.name for x in local_device_protos if x.device_type == 'GPU']


def is_gpu_available():
    return tensorflow.test.is_gpu_available()


print(is_gpu_available())
