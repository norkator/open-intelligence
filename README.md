# Open-Intelligence

Tools to process security camera motion triggered images and sort seen objects in different categories


### Installing

Steps to get environment running

1. Download Python 3.6 ( https://www.python.org/ftp/python/3.6.0/python-3.6.0-amd64.exe ) 
2. Run `pip install opencv-python` on console
3. Download <b>YOLOv3-416</b> weights, cfg, coco.names https://pjreddie.com/darknet/yolo/
4. Extract weights, cfg and coco to `models` folder



#### Project folder structure

    .
    ├── images                   # Input images to process
    ├── models                   # Trained models
    ├── module                   # Source files (alternatively `lib` or `app`)
    ├── output                   # Analyse results
    ├── LICENSE
    └── README.md



## Authors

* **Norkator** - *Initial work, code owner* - [norkator](https://github.com/norkator)
