<h1 align="center">
  <a href="http://www.nitramite.com/"><img src="https://github.com/norkator/Open-Intelligence/blob/master/other/oi_title_logo.png" alt="Open-Intelligence"></a>
</h1>

# Open-Intelligence

Open Intelligence processes <b>any camera</b> motion triggered images and sorts seen objects using Yolo, 
it provides easy to use front end web interface with rich features so that you can have up to date
intel what is the current status on your property. Open Intelligence also uses license plate detection (ALPR) 
to detect vehicle plates and face detection to detect people faces which then can be sorted into person folders
and then can be trained so that Open Intelligence can try to identify seen people. All this can be done from front end interface.

Open Intelligence also uses super resolution neural network to process super resolution images for improved 
license plate detection.

Target goal is to make this useful information gathering tool to provide data for easy property monitoring without
need for expensive camera systems because any existing cameras are suitable. 

<p align="start">
  <img src="https://github.com/norkator/Open-Intelligence/blob/master/other/frontpage_1.png" alt="oi-frontpage">
</p>

Open Intelligence is suitable from private properties to small businesses with medium activity.

### Frontend user manual
https://docs.google.com/document/d/1BwjXO0tUM9aemt1zNzofSY-DKeno321zeqpcmPI-wEw/edit?usp=sharing


### Installing

I am later making installation more automatic but for now, 
here's steps to get environment running.

###### Python side
1. Download Python 3.6 ( https://www.python.org/ftp/python/3.6.0/python-3.6.0-amd64.exe ) 
2. Install dependencies `pip install -r requirements.txt`
3. Run `Setup.py` OR Download <b>YOLOv3-608</b> weights, cfg, coco.names https://pjreddie.com/darknet/yolo/
4. Extract weights, cfg and coco to `models` folder
5. Download Postgresql server ( https://www.postgresql.org/ ) I am using version <b>11.6</b>
6. Rename `config.ini.tpl` to `config.ini` and fill details. (for multi nodes, see own section)
7. Separate camera and folder names with comma just like at base config template
8. Run wanted python apps, see `Python Apps` section.

###### Api side
1. Go to `/api` folder and run `npm install`
2. Install Postgresql server: https://www.postgresql.org/ (if you didn't at upper python section)
3. Rename `.env_tpl` to `.env` and fill details.
4. Run `intelligence-tasks.js` or with PM2 process manager `pm2 start intelligence-tasks.js`.
5. Run `node intelligence.js` or with PM2 process manager `pm2 start intelligence.js -i 2`.
6. Access `localhost:4300` unless port modified at .env file. 


#### Project folder structure

    .
    ├── android                  # Simple Android viewing client app source code for this project
    ├── api                      # Api which is serving small static web page
    ├── classifiers              # Classifiers for different detectors like faces
    ├── dataset                  # Images of people to be detected
    ├── images                   # Input images to process 
    ├── libraries                # Modified third party libraries
    ├── models                   # Yolo and other files
    ├── module                   # Source files
    ├── objects                  # Just objects
    ├── output                   # Analyse results, labels, detection images, ...
    ├── scripts                  # Scripts to ease things
    ├── LICENSE
    └── README.md
    
        
<br>
    
#### Python Apps

##### `App.py`
* Status: *Mandatory*  
* This is main app which is responsible for processing input images from configured sources.
* Cluster support: Yes.
* Multi instance command: `\.App.py --bool_slave_node True`

##### `StreamGrab.py`
* Status: *Optional* 
* If you don't have cameras which are outputting images, you can configure multiple camera streams using
this stream grabber tool to create input images.
* Cluster support: No.

##### `SuperResolution.py`
* Status: *Optional* 
* This tool processes super resolution images and run's new detections for these processed sr images.
This is no way mandatory for process.
* Cluster support: No.

##### `InsightFace.py`
* Status: *Optional* 
* Processes faces page images using InsightFace retina model. This is currently for testing use.
* Cluster support: No.

##### `SimilarityProcess.py`
* Status: *Optional* 
* Compares current running day images for close duplicates and deletes images determined as duplicate
having no higher value (no detection result). Processes images in one hour chunks.
* Cluster support: No.

<br>

#### Multi node support
Multi node support requires little bit more work to configure but it's doable. Follow instructions below.
1. Each node needs to have access to source files hosted by one main node via network share.
2. Create configuration file `config_slave.ini` from template `config_slave.ini.tpl`
3. Fill in postgres connection details having server running postgres as target location.
4. Point your command prompt into network share folder containing `App.py` and other files.
5. On each slave node run `App.py` via giving argument: `\.App.py --bool_slave_node True`


### Cuda GPU Support
Cuda only works for Super Resolution image processing at the moment. Requirements are:
1. NVIDIA only; GPU hardware compute capability: The minimum required Cuda capability is 3.5 so old GPU's won't work.  
2. CUDA toolkit version. Windows link for right 10.0 is https://developer.nvidia.com/cuda-10.0-download-archive?target_os=Windows&target_arch=x86_64
3. Download cuDNN "Download cuDNN v7.6.3 (August 23, 2019), for CUDA 10.0" https://developer.nvidia.com/rdp/cudnn-archive
4. Place cuDNN files inside proper Cuda toolkit installation folders. cuDNN archive has folder structure.


#### Postgresql notes

All datetime fields are inserted without timezone so that:

```
File     : 2020-01-03 08:51:43
Database : 2020-01-03 06:51:43.000000
```

Database timestamps are shifted on use based on local time offset.


#### Openalpr notes

Got it running with following works.
Downloaded `2.3.0` release from here https://github.com/openalpr/openalpr/releases

1. Unzipped `openalpr-2.3.0-win-64bit.zip` to `/libraries` folder
2. Downloaded and unzipped `Source code(zip)`
3. Navigated to `src/bindings/python`
4. Run `python setup.py install`
5. From appeared `build/lib` moved contents to project `libraries/openalpr_64/openalpr` folder.
6. At license plate detection file imported contents with `from libraries.openalpr_64.openalpr import Alpr`

Now works without any python site-package installation.



#### Troubleshooting
Got `ImportError: DLL load failed: The specified module could not be found.` ???  
=> try `import cv2`, not working -> packages missing, vc redistributable etc?  
=> Windows Server for example requires desktop experience features installed.

Got `Could not load dynamic library 'cudart64_100.dll'; dlerror: cudart64_100.dll not found`
=> Check that you have correct CUDA toolkit version with cuDNN.
=> Windows link for right 10.0 is https://developer.nvidia.com/cuda-10.0-download-archive?target_os=Windows&target_arch=x86_64
=> Download cuDNN "Download cuDNN v7.6.3 (August 23, 2019), for CUDA 10.0"
https://developer.nvidia.com/rdp/cudnn-archive

Python crashes with error like `python.exe with problem event BEX64, ucrtbase.DLL...`
This happened with SuperResolution.py
=> Reason is missing Visual C++ Redistributable Packages related on Python and Tensorflow requirements.

#### Todo

Here's some ideas

- [x] implement usable **base** structure;
- [x] basic api for serving small static statistics/status web page 'command center';
- [x] voice intelligence support (web page can talk);
- [x] license plate recognition from normal camera images;
- [x] basic face detection from cropped person images;
- [x] detect faces;
- [x] recognize faces via user trained person face model;
- [x] web interface supports face sorting to provide data for training;
- [x] web interface section for face data model training;
- [x] basic license plate detection (Automatic number-plate recognition);
- [x] identify car owners from license plates (user determines owners at web ui);
- [x] send emails on new license plate detections based on known plate records;
- [x] main App.py multiple processing nodes support;
- [x] email intelligence statistics (partially implemented, plates for now);
- [ ] camera microphone access;
- [ ] microphone sound -> heard text contents -> find interests -> collect speech;
- [ ] better data analysis methods, needs defining;
- [ ] make own ALPR based on deep neural nets and TensorFlow.;
- [ ] multi site combiner tools to be able to request intelligence from multiple OI sites at once;
- [ ] api's for multi site combining to be able to request seen plates, person face lookup, analysis;


## Authors

* **Norkator** - *Initial work* - [norkator](https://github.com/norkator)


Note that `/libraries` folder has Python applications made by other people. 
I have needed to make small changes to them, that's why those are included here.


### About license
Current license is not fully suitable. I don't allow commercial use.  
NonCommercial use only.
