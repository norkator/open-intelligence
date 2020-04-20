from module import license_plate_detection, face_detection
from module.vehicle_color import vehicle_color_detect


def detect(label, crop_image_file_path_name_extension, file_name, output_file_name, use_rotation=True):
    # Label based detection
    detection_result = ''
    color = ''
    try:
        if (label == 'car') or (label == 'truck') or (label == 'bus'):
            detection_result = license_plate_detection.detect_license_plate(
                crop_image_file_path_name_extension,
                file_name,
                use_rotation
            )
            try:
                color = vehicle_color_detect.detect_color(crop_image_file_path_name_extension)
            except Exception as e:
                print(e)
        if label == 'person':
            detection_result = face_detection.recognize_person(
                crop_image_file_path_name_extension,
                output_file_name
            )
        # Add more here later and so on...

        # Return result
        return detection_result, color
    except Exception as e:
        print(e)
        return detection_result, color
