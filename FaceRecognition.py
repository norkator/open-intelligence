# Includes some tools, directly not part of process

import os
from module.face_recognition import extract_embeddings, train_model, recognize, extract_face_images

# ---------------------------------
# Training part

# Extract embeddings
# extract_embeddings.extract_embeddings(cwd_path=os.getcwd(), input_confidence=0.5)

# Train model
# train_model.train_model(cwd_path=os.getcwd())

# ---------------------------------
# Recognition part
# input_image = os.getcwd() + '/images/' + 'a.jpg'
# recognize.recognize(cwd_path=os.getcwd(), input_confidence=0.5, input_image=input_image)

# ---------------------------------
# Sorting face including images tool
# extract_face_images.extract_face_images(cwd_path=os.getcwd(), input_confidence=0.5)
