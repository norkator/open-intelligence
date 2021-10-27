#!/bin/bash
fileid="1dSJuxpwSFfF7SIJg8NMKG5yCIG9CHQKw"
filename="models.zip"
curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}" > /dev/null
curl -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $NF}' ./cookie`&id=${fileid}" -o ${filename}


