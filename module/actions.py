import os
from module import database
from module.face_recognition import extract_embeddings, train_model


def check_for_actions():
    # Face model training commands
    if database.bool_run_train_face_model():
        # Extract embeddings
        extract_embeddings.extract_embeddings(cwd_path=os.getcwd(), input_confidence=0.5)

        # Train model
        train_model.train_model(cwd_path=os.getcwd())

    # Detection tasks for re processing
    detection_tasks = database.get_detection_tasks()
    # TODO: needs work

    # Some other commands...
