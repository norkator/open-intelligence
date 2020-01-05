from module import fileutils, analyser
from objects import File

# Image objects stored here
image_file_objects = []

# Create image objects
for file_name in fileutils.get_camera_image_names():
    gm_time = fileutils.get_file_create_time(file_name)
    file = File.File(
        file_name,
        fileutils.get_file_extension(file_name),
        fileutils.get_file_create_year(gm_time),
        fileutils.get_file_create_month(gm_time),
        fileutils.get_file_create_day(gm_time),
        fileutils.get_file_create_hour(gm_time),
        fileutils.get_file_create_minute(gm_time),
        fileutils.get_file_create_second(gm_time)
    )
    image_file_objects.append(file)

# Analyze image objects
for image_object in image_file_objects:
    result = analyser.analyze_image(image_object)