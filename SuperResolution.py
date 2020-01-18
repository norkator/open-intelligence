from libraries.fast_srgan import infer
import os
from pathlib import Path
from module import configparser, database

# Parse config
super_resolution_config = configparser.super_resolution_config()

# Paths
# Output root folder path can be anything, same computer or smb share
output_root_folder_path = super_resolution_config['root_file_path']
model_path_file_name = os.getcwd() + '/libraries/fast_srgan/models/generator.h5'

# Do work
sr_work_records = database.get_super_resolution_images_to_compute()
for row in sr_work_records:
    # Check path existence
    Path(output_car_path).mkdir(parents=True, exist_ok=True)

    # Super resolution image
    infer.main(image_dir=input_car_path, output_dir=output_car_path, model_path_file_name=model_path_file_name)

    #    print("Id = ", row[0], )
    #    print("Label = ", row[1])
    #    print("Cropped  = ", row[2], "\n")