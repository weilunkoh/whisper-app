set version_num=%1
set image_name=whisper-app/fe
ECHO "Building %image_name% version %version_num%"
docker build -t %image_name%:%version_num% .