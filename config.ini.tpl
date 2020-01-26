[app]
move_to_processed=True
process_sleep_seconds=4
use_database=True
write_object_detection_images=True
time_offset_hours=2

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

[superresolution]
root_folder_path=Z:/path/to/project/folder/output/

[facerecognition]
file_name_prefix=
output_root_path=cwd

[streamgrab]
jpegstream=http://0.0.0.0/oneshotimage1
confidence=0.5
