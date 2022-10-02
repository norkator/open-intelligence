import os
from module.face_recognition import recognize
from module import database

# App config
app_config = database.get_application_config()
output_root_folder_path = database.find_config_value(app_config, 'output_folder')

# Paths
person_path = output_root_folder_path + '/person/'
output_faces_path = output_root_folder_path + '/faces/'
classifier_path = os.getcwd() + '/classifiers/'


# Main method to call
def recognize_person(image_file_path_name_extension, output_file_name):
    # Recognize
    detection_name_and_probability = None
    try:
        detection_name_and_probability = recognize.recognize(
            output_file_name=output_file_name, input_confidence=0.5,
            input_image=image_file_path_name_extension
        )
    except Exception as e:
        print(e)
    '''
    if detection_name_and_probability is None:
        haarcascade_face_detection(image_file_path_name_extension, output_file_name)
        return ''
    else:
    '''
    return detection_name_and_probability


# If person recognition fails (face + person)
# then try detect only face with haarcascade, write small image out
# TODO: validate later is this section usable anywhere
'''
def haarcascade_face_detection(image_file_path_name_extension, output_file_name):
    object_cascade = cv2.CascadeClassifier(classifier_path + 'haarcascade_frontalface_default.xml')

    img = cv2.imread(image_file_path_name_extension)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_img = img.copy()

    # image, reject levels level weights.
    faces = object_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    # add this
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 0), 1)
        roi = face_img[y:y + h, x:x + w]

        # Write small face images
        try:
            Path(output_faces_path).mkdir(parents=True, exist_ok=True)
            cv2.imwrite(output_faces_path + output_file_name, roi)
        except Exception as e:
            print(e)

    cv2.imshow('face', img)
    cv2.waitKey(1)  # no freeze, refreshes for a millisecond
'''