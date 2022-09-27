OpenALPR Pre-compiled 64-bit binaries for Windows
=================================================

In order to run OpenALPR, you must first install the Windows Visual C++ runtime libraries.  The installer (vcredist_x64.exe) is included in the package.

Test the program by opening the openalprnet-windemo.exe file.  Click the "Detect License Plate" button and select the "samples/us-1.jpg" image.
The top 20 possible results should show up on the middle-right pane.  The image of the cropped license plate should show up in the bottom-right pane.

CLI Application
---------------

alpr.exe is a command-line application that can analyze license plates.  Type alpr --help from the Windows command prompt for more information.

Examples: 

    # Recognize a US-style plate
    alpr -c us samples/us-1.jpg

    # Recognize a US-style plate and measure the processing time
    alpr -c us --clock samples/us-1.jpg

    # Recognize a European-style plate with JSON output
    alpr -c eu -j samples/eu-1.jpg

    # Recognize a video clip
    alpr -c eu samples/eu-clip.mp4

    # Get the top 30 possible plate numbers and match it against the Texas (tx) format
    alpr -p tx -n 30 samples/us-4.jpg



API Integration
----------

OpenALPR is written in C++ and has native support for integrating with C/C++ applications.

To include OpenALPR in your C/C++ application, include the alpr.h file in the include directory.  You must also link the openalpr.dll shared library to your code. 
openalpr-static.lib is also included in case you prefer to statically link the OpenALPR library into your program.

The following DLLs are required at runtime:
  
  - openalpr.dll
  - liblept170.dll
  - opencv_*.dll


OpenALPR also includes bindings for C#, Java, and Python.  Each of these bindings fully implement the OpenALPR API.

C#
----

The C# integration is bundled into the DLL file "openalpr-net.dll"  You should add this as a reference to your .NET application to use the functionality.

The openalprnet-windemo.exe and openalprnet-cli.exe are both C# example applications.  The full source code is available at 
https://github.com/openalpr/openalpr/tree/master/src/bindings/csharp

Java
-------

Run the java_test.bat program to test the Java integration.  This assumes that javac and java are available on your system PATH.  

The java integration uses Java Native Interface (JNI) to connect java code to OpenALPR.  This requires the openalprjni.dll file is available at runtime. 
The java source code is in java/com/openalpr/jni and there is in example located in java/Main.java

Python
--------

Run the python_test.bat program to test the Python integration.  This assumes that python is available on your system PATH.

The Python integration uses ctypes to bind the OpenALPR functions to Python code.  This requires the openalprpy.dll file is available at runtime.
The python code is located in python/openalpr.py.  There is a test program in python/test.py
