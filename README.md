# Open-Intelligence

Tools to process security camera motion triggered images and sort seen objects (labels) in different categories. 
Inserts data into Postgresql database for further processing. For now mostly crafted based on different tutorials.


### Installing

Steps to get environment running

1. Download Python 3.6 ( https://www.python.org/ftp/python/3.6.0/python-3.6.0-amd64.exe ) 
2. Run `pip install opencv-python` on console
3. Run `Setup.py` OR Download <b>YOLOv3-608</b> weights, cfg, coco.names https://pjreddie.com/darknet/yolo/
4. Extract weights, cfg and coco to `models` folder
5. Download Postgresql ( https://www.postgresql.org/ )
6. Rename `database.ini.tpl` to `database.ini` and fill details


#### Project folder structure

    .
    ├── images                   # Input images to process
    ├── models                   # Trained models
    ├── module                   # Source files
    ├── output                   # Analyse results
    ├── LICENSE
    └── README.md


#### Postgresql table

You need table for recognized labels

```database
CREATE TABLE data
(
    id serial PRIMARY KEY,
    label varchar(50),
    file_name varchar(100),
    createdate timestamp DEFAULT now()
);
```

#### Todo

Here's some ideas

- [x] implement usable **base** structure;
- [ ] possibility to train model;
- [ ] possibility to detect persons, car owners from sub result folders;
- [ ] api for serving front end;
- [ ] simple front end to make data usable;

## Authors

* **Norkator** - *Initial work* - [norkator](https://github.com/norkator)
