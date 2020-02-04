from module import license_plate_detection, face_detection


def detect(label, crop_image_file_path_name_extension, output_file_name):
    # Label based detection
    detection_result = ''
    try:
        if (label == 'car') or (label == 'truck'):
            detection_result = license_plate_detection.detect_license_plate(
                crop_image_file_path_name_extension
            )
        if label == 'person':
            detection_result = face_detection.recognize_person(
                crop_image_file_path_name_extension,
                output_file_name
            )
        # Add more here later and so on...

        # Return result
        return detection_result
    except Exception as e:
        print(e)
        return detection_result
