import os
from module.face_recognition import extract_embeddings, train_model, recognize

# ---------------------------------
# Training part
# TODO: UNDER DEVELOPMENT!

# Extract embeddings
extract_embeddings.extract_embeddings(cwd_path=os.getcwd(), input_confidence=0.5)

# Train model
train_model.train_model(cwd_path=os.getcwd())

# ---------------------------------
# Recolonization part
# TODO: UNDER DEVELOPMENT!
# input_image = os.getcwd() + '/images/' + 'a.jpg'
# recognize.recognize(cwd_path=os.getcwd(), input_confidence=0.7, input_image=input_image)

# ---------------------------------
