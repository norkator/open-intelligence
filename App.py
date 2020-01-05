from module import fileutils, analyser

print(fileutils.get_camera_image_path())

print(fileutils.get_camera_image_names())

analyser.analyze_image('192.168.1.64_01_20200105114524095_MOTION_DETECTION.jpg')
