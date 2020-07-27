Hikvision camera settings
============
Had big trouble to get RTSP stream audio to work but it was simply audio 
encoding problem. Below is settings that worked with older Hikvision Dome camera.

Point is to set sub stream video quality as low as possible, we are only interested in 
audio stream.

Video stream
-----
Stream type: `Sub Stream`  
Video Type: `Video&Audio`  
Resolution: `320x240`  
...   
Video Encoding: `MJPEG`  

Audio stream
-----
Audio Encoding: `MP2L2`  
Sampling Rate: `48kHz`  
Audio Stream Bitrate: `64kbps`  
Audio Input: `lineIn`  
Input Volume: `20`  

RTSP
-----
Use VLC Media Player to test that camera RTSP is providing working audio track  
`rtsp://admin:<password>@<ip-address>:554/Streaming/Channels/102/*`