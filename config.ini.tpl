[app]
move_to_processed=True
process_sleep_seconds=4
cv2_imshow_enabled=True

[yolo]
ignored_labels=pottedplant,tennis racket,umbrella

[camera]
camera_names=TestCamera1,TestCamera2
camera_folders=D:/testCamera1Folder/,D:/testCamera2Folder/,

[postgresql]
host=localhost
database=intelligence
user=postgres
password=

[openalpr]
enabled=True
region=eu
use_plate_char_length=True
plate_char_length=6

[facerecognition]
file_name_prefix=
output_root_path=cwd

[streamgrab]
sleep_seconds=4
jpeg_stream_names=name
jpeg_streams=http://127.0.0.1/mjpg/video.mjpg

[similarity]
delete_files=False

[super_resolution]
use_gpu=True
max_width=1000
max_height=1000