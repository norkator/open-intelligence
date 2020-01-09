# Open-Intelligence

Tools to process security camera (<b>any camera</b>) motion triggered images and sort seen objects (labels) in different categories. 
Inserts data into Postgresql database for further processing. For now mostly crafted based on different tutorials.

Goal is to make this fairly easy to setup and powerful so.. say goodbye to privacy. 


### Installing

Steps to get environment running

###### Python side
1. Download Python 3.6 ( https://www.python.org/ftp/python/3.6.0/python-3.6.0-amd64.exe ) 
2. Install dependencies, list is below
3. Run `Setup.py` OR Download <b>YOLOv3-608</b> weights, cfg, coco.names https://pjreddie.com/darknet/yolo/
4. Extract weights, cfg and coco to `models` folder
5. Download Postgresql ( https://www.postgresql.org/ )
6. Rename `database.ini.tpl` to `database.ini` and fill details

###### Api side
1. Go to `/api` folder and run `npm install`
2. ...


#### Dependencies list

Install all following dependencies using console
 
```
python -m pip install --upgrade pip
pip install numpy
pip install matplotlib
pip install pillow
pip install opencv-python  (I have 4.1.2.30)
```  


#### Project folder structure

    .
    ├── api                      # Api which is serving small static web page
    ├── images                   # Input images to process
    ├── models                   # Trained models
    ├── module                   # Source files
    ├── output                   # Analyse results
    ├── LICENSE
    └── README.md


#### Postgresql notes

All datetime fields are inserted without timezone so that:

```
File     : 2020-01-03 08:51:43
Database : 2020-01-03 06:51:43.000000
```

Database timestamp need's to be shifted later to your local timezone. I have that +2 hours difference.


#### Trouble shooting
Got `ImportError: DLL load failed: The specified module could not be found.` ???  
=> try `import cv2`, not working -> packages missing, vc redistributable etc?  
=> Windows Server for example requires desktop experience features installed.


#### Todo

Here's some ideas

- [x] implement usable **base** structure;
- [x] basic api for serving small static statistics/status web page 'command center';
- [ ] license plate recognition from normal camera images;
- [ ] possibility to train model... maybe coming;
- [ ] possibility to detect persons, car owners from sub result folders;
- [ ] camera microphone access and speech to text conversion tools;

## Authors

* **Norkator** - *Initial work* - [norkator](https://github.com/norkator)
