from module import configparser
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
import pickle
import os

# App config
app_config = configparser.any_config(filename=os.getcwd() + '/config.ini', section='app')
output_root_folder_path = app_config['output_folder']


def train_model(cwd_path):
    # Output paths
    recognizer_output_path = output_root_folder_path + '/faces_models/' + 'recognizer.pickle'
    label_encoder_output_path = output_root_folder_path + '/faces_models/' + 'label_encoder.pickle'

    # load the face embeddings
    print("[INFO] loading face embeddings...")
    embeddings_path = output_root_folder_path + '/faces_models/' + 'embeddings.pickle'
    data = pickle.loads(open(embeddings_path, "rb").read())

    # encode the labels
    print("[INFO] encoding labels...")
    le = LabelEncoder()
    labels = le.fit_transform(data["names"])

    # train the model used to accept the 128-d embeddings of the face and
    # then produce the actual face recognition
    print("[INFO] training model...")
    recognizer = SVC(C=1.0, kernel="linear", probability=True)
    recognizer.fit(data["embeddings"], labels)

    # write the actual face recognition model to disk
    f = open(recognizer_output_path, "wb")
    f.write(pickle.dumps(recognizer))
    f.close()

    # write the label encoder to disk
    f = open(label_encoder_output_path, "wb")
    f.write(pickle.dumps(le))
    f.close()

    # Completion
    print("[INFO] training completed...")
