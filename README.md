# Open-Intelligence

Tools to process security camera motion triggered images and sort seen objects in different categories

Nice tutorial: https://www.geeksforgeeks.org/ml-training-image-classifier-using-tensorflow-object-detection-api/


### Installing

Steps to get environment running

1. Download Python 3.6 ( https://www.python.org/ftp/python/3.6.0/python-3.6.0-amd64.exe ) 
2. Run `pip3 install --upgrade tensorflow` on console
3. Run `pip install protobuf==3.6.1` on console
4. Install all packages described below
5. Download https://github.com/tensorflow/models
6. Extract `research\object_detection` folder to project root as `object_detection`
7. Run `protoc object_detection/protos/*.proto --python_out=.` ( uses protoc.exe on windows )



##
Install all these packages (make script for it later)
```
pip install protobuf
pip install pillow
pip install lxml
pip install Cython
pip install jupyter
pip install matplotlib
pip install pandas
pip install opencv-python
```
##


## Authors

* **Norkator** - *Initial work, code owner* - [norkator](https://github.com/norkator)
