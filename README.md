![Open-Intelligence-title-logo](docs/img/oi_title_logo.png) 

# Open-Intelligence

Open Intelligence processes <b>any camera</b> motion triggered images and sorts seen objects using Yolo, 
it provides easy to use front end web interface with rich features so that you can have up to date
intel what is the current status on your property. Open Intelligence uses license plate detection (ALPR) 
to detect vehicle plates and face detection to detect people faces which then can be sorted into person folders
and then can be trained so that Open Intelligence can try to identify seen people. All this can be done from front end interface.

Open Intelligence uses super resolution neural network to process super resolution images for improved 
license plate detection.

Project goal is to be useful information gathering tool to provide data for easy property monitoring without
need for expensive camera systems because any existing cameras are suitable.

I developed this to my own use because were tired to use existing monitoring tools to go through 
recorded video. I wanted to know what has been happening quickly.

<br>

![docker](docs/img/docker.png)

![Open-Intelligence-Front-Page](docs/img/frontpage_2.png) 

This is small part of front page.

<br>

Cameras view             |  Plate calendar
:-------------------------:|:-------------------------:
![cameras_1](docs/img/cameras_1.PNG)   |  ![plates_1](docs/img/plates_1.PNG)

<br> 

Open Intelligence is suitable from private properties to small businesses with medium activity.

-------------------------------------------------------------

Table of contents
=================
* [Environment](#environment)
* [Installing with Docker](#installing-with-docker)
* [Installing manually](#installing-manually)
    * [Api side](#api-side)
    * [Build react front end](#build-react-front-end)
    * [Python side (Windows)](#python-side)    
* [Process drawing](#process-drawing) 
* [Project folder structure](#project-folder-structure) 
* [Python Apps](#python-apps)
    * [App.py](#app)
    * [StreamGrab.py](#streamgrab)
    * [SuperResolution.py](#superresolution)
    * [InsightFace.py](#insightface)
    * [SimilarityProcess.py](#similarityprocess)
* [Config ini](#config-ini)
* [Multi node support](#multi-node-support)
* [Cuda GPU Support](#cuda-gpu-support)
* [Postgresql notes](#postgresql-notes)
* [Openalpr notes](#openalpr-notes)
* [Front end development](#front-end-development)
* [Troubleshooting](#troubleshooting)
* [Todo](#todo)
* [Authors](#authors)
* [License](#license)


Environment
============

Everything can be installed on one server or to separate servers meaning that database 
is at server one, python application at server two and api hosting at server three.

![Environment](docs/environment.png) 


Installing with Docker
============
Follow [Installation-using-Docker](https://github.com/norkator/open-intelligence/wiki/Installation-using-Docker) 
instruction from Wiki page.


Installing manually
============

Terminology for words like API side and Python side:
* "API Side" is `/api` folder containing node api process `intelligence.js` and web user interface served by same process.
* "Python side" is project root folder containing different python processes.

See [Project folder structure](#project-folder-structure)  for more details about folders.

API side
-----
1. Go to `/api` folder and run `npm install`
2. Install PostgreSQL server: https://www.postgresql.org/
    * Accessing postgres you need to find tool like pgAdmin which comes with postgres, 
    command line or some IDE having db tools.
3. Rename `.env_tpl` to `.env` and fill details.
4. Run `intelligence-tasks.js` or with PM2 process manager `pm2 start intelligence-tasks.js`.
5. Run `node intelligence.js` or with PM2 process manager `pm2 start intelligence.js -i 2`.
6. Running these NodeJS scripts will create database and table structures, if you see error run it again.
7. Go to `/api/front-end` folder and rename `.env_tpl` to `.env`.
8. At `/api/front-end` run `npm start` so you have both api and front end running.
9. Access `localhost:3000` if react app doesn't open browser window automatically.
10. Outdated frontend user manual for old ui version https://docs.google.com/document/d/1BwjXO0tUM9aemt1zNzofSY-DKeno321zeqpcmPI-wEw/edit?usp=sharing

Build react front end
-----
1. Go to `/api/front-end`
2. Check your `.env` REACT_APP_API_BASE_URL that it corresponds your machine ip address where node js api is running.
3. Build react front end via running `npm run build`
4. Copy/replace `/build` folder contents into `/api/html` folder so that api can serve build webpage.


Python side
-----
(Windows)
1. Download Python 3.6 ( https://www.python.org/ftp/python/3.6.0/python-3.6.0-amd64.exe ) 
    * Only tested to work with Python 3.6. Newer ones caused problems with packages when tested.
2. Activate python virtual env.
   ```shell script
   .\venv\Scripts\activate.bat
   ```
3. Install dependencies `pip install -r requirements_windows.txt`
4. Get models using these instruction https://github.com/norkator/open-intelligence/wiki/Models
5. Download PostgreSQL server ( https://www.postgresql.org/ ) I am using version <b>11.6</b> but
its also tested with version 12. (if you didn't install at upper api section)
6. Rename `config.ini.tpl` to `config.ini` and fill details. 
    * Config.ini content settings explained, see [Config ini](#config-ini)
    * For multiple nodes, see [Multi node support](#multi-node-support))
7. Ensure you have `Microsoft Visual C++ 2015 Redistributable (x64)` installed.
    * This is needed by openALPR
8. Separate camera and folder names with comma just like at base config template
9. Run wanted python apps, see `Python Apps` section.

It's critical to setup ini configuration right.
 

Python side
-----
(Linux)

1. Install required Python version.
    ```shell script
    sudo add-apt-repository ppa:deadsnakes/ppa
    sudo apt-get install python3.6
    virtualenv --python=/usr/bin/python3.6 ./
   source ./bin/activate
    ```
2. Install dependencies `pip install -r requirements_linux.txt`
3. Get models using these instruction https://github.com/norkator/open-intelligence/wiki/Models
4. Download PostgreSQL server ( https://www.postgresql.org/ ) I am using version <b>11.6</b> but
its also tested with version 12. (if you didn't install at upper api section)
5. Rename `config.ini.tpl` to `config.ini` and fill details. 
    * Config.ini content settings explained, see [Config ini](#config-ini)
    * For multiple nodes, see [Multi node support](#multi-node-support))
6. Separate camera and folder names with comma just like at base config template
7. Run wanted python apps, see `Python Apps` section.


Process drawing
============
Overall process among different python processes for Open Intelligence.

![ProcessDrawing](docs/process_drawing.png) 


Project folder structure
============

    Default folders
    .
    ├── api                      # Front end API which is also serving react js based web page
    ├── classifiers              # Classifiers for different detectors like faces
    ├── docs                     # Documents folder containing images and drawings
    ├── libraries                # Modified third party libraries
    ├── models                   # Yolo and other detector model files
    ├── module                   # Python side application logic, source files 
    ├── objects                  # Base objects for internal logic
    ├── scripts                  # Scripts to ease things      


Python Apps
============
This part is explaining in better detail what each of base python app scripts is meant for. Many 
tasks are separated for each part. App.py is always main process, the first thing that sees images.

App
-----
* File: `App.py`
* Status: *Mandatory*  
* This is main app which is responsible for processing input images from configured sources.
* Cluster support: Yes.
* One computer, multiple instances: Just open app.py on multiple shell's like `python .\App.py`
* Multi instance command when run on network computer: `\.App.py --bool_slave_node True`
This slave node option means that script uses `config_slave.ini` instead of stock `config.ini`
Reason is that in this case master node has database installation. If database and camera images 
are accessible else where like other ip and camera images on smb share having same mount letter/path 
then it's possible to run only `python .\App.py` on multiple individual machines.

StreamGrab
-----
* File: `StreamGrab.py`
* Status: *Optional* 
* If you don't have cameras which are outputting images, you can configure multiple camera streams using
this stream grabber tool to create constant input images.
* Cluster support: No.

SuperResolution
-----
* File: `SuperResolution.py`
* Status: *Optional* 
* This tool processes super resolution images and run's new detections for these processed sr images.
This is no way mandatory for process.
* Cluster support: No.
* Mainly meant for improved license plate detection.
* Testing: use command `python SuperResolutionTest.py --testfile="some_file.jpg"` which will load 
image by given name from `/images` folder. 

InsightFace
-----
* File: `InsightFace.py`
* Status: *Optional* 
* Processes faces page 'face wall' images using InsightFace retina model. This is currently for testing use.
* Cluster support: No.

SimilarityProcess
-----
* File: `SimilarityProcess.py`
* Status: *Optional* 
* Compares current running day images for close duplicates and deletes images determined as duplicate
having no higher value (no detection result). Processes images in one hour chunks.
* Cluster support: No.
* Process is trying to save some space.

<br>


Config ini 
============

This section explains `config.ini` file contents which are used by python processes. 
Config ini start with contents like below.

```ini
[app]
move_to_processed=True
process_sleep_seconds=4
cv2_imshow_enabled=True
...
```

* `move_to_processed` => When set to True, processed input image is moved into /processed folder, 
otherwise file is deleted.
* `process_sleep_seconds` => After every batch of files, process will sleep this amount of seconds.
* `cv2_imshow_enabled` => Set to True will show window showing processed images, bounding boxes and more.
* `ignored_labels` => This will ignore labels, example if you get a lot of false positives from umbrellas 
and you don't care saving any images of umbrellas anyway then ignore it.
* `camera_names` => Camera name/location name, up to you. Must of separated with comma ,
* `camera_folders` => Input image folders, same camera names and folders must be in same order and same count
* postgresql section => fill in database credentials. This should not need explaining. 

Other parameters are case specific.


Multi node support
============
Multi node support requires little bit more work to configure but it's doable. Follow instructions below.
1. Each node needs to have access to source files hosted by one main node via network share.
2. Create configuration file `config_slave.ini` from template `config_slave.ini.tpl`
3. Fill in postgres connection details having server running postgres as target location.
4. Fill [camera] section folders, these should be behind same mount letter+path on each node. 
5. Point your command prompt into network share folder containing `App.py` and other files.
6. On each slave node run `App.py` via giving argument: `\.App.py --bool_slave_node True`


Cuda GPU Support
============
Cuda only works with some processes like super resolution and insightface. Requirements are:
1. NVIDIA only; GPU hardware compute capability: The minimum required Cuda capability is 3.5 so old GPU's won't work.  
2. CUDA toolkit version. Windows link for right 10.0 is https://developer.nvidia.com/cuda-10.0-download-archive?target_os=Windows&target_arch=x86_64
3. Download cuDNN "Download cuDNN v7.6.3 (August 23, 2019), for CUDA 10.0" https://developer.nvidia.com/rdp/cudnn-archive
4. Place cuDNN files inside proper Cuda toolkit installation folders. cuDNN archive has folder structure.


-------------------------------------------------------------

Postgresql notes
============
All datetime fields are inserted without timezone so that:

```
File     : 2020-01-03 08:51:43
Database : 2020-01-03 06:51:43.000000
```

Database timestamps are shifted on use based on local time offset.


Openalpr notes
============
These notes are for Windows. Current Docker way makes this installation automatic.

Got it running with following works.
Downloaded `2.3.0` release from here https://github.com/openalpr/openalpr/releases

1. Unzipped `openalpr-2.3.0-win-64bit.zip` to `/libraries` folder
2. Downloaded and unzipped `Source code(zip)`
3. Navigated to `src/bindings/python`
4. Run `python setup.py install`
5. From appeared `build/lib` moved contents to project `libraries/openalpr_64/openalpr` folder.
6. At license plate detection file imported contents with `from libraries.openalpr_64.openalpr import Alpr`

Now works without any python site-package installation.


Front end development
============
There is separate Readme for this side so 
see more at `./api/front-end/README.md`  
![link](api/front-end/README.md) 


Troubleshooting
============
Refer to [troubleshooting wiki](https://github.com/norkator/open-intelligence/wiki/Troubleshooting).


Authors
============

* **Norkator** - *Initial work* - [norkator](https://github.com/norkator)


Note that `/libraries` folder has Python applications made by other people. 
I have needed to make small changes to them, that's why those are included here.


License
============
See [LICENSE](./LICENSE) file.


