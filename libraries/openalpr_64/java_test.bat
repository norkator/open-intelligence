@ECHO OFF

rem compile the class files
echo Compiling Java
javac.exe java/Main.java java/com/openalpr/jni/*.java java/com/openalpr/jni/json/*.java

echo Executing OpenALPR JNI
java -classpath java Main "us" "openalpr.conf" "runtime_data" "samples/us-1.jpg"

pause