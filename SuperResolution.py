from libraries.fast_srgan import infer
import os
from pathlib import Path

# Paths
input_car_path = os.getcwd() + '/output/car/'
output_car_path = os.getcwd() + '/output/car/super_resolution/'
model_path_file_name = os.getcwd() + '/libraries/fast_srgan/models/generator.h5'

# Check path existence
Path(output_car_path).mkdir(parents=True, exist_ok=True)

infer.main(image_dir=input_car_path, output_dir=output_car_path, model_path_file_name=model_path_file_name)
