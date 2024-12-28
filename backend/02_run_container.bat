set version_num=%1
set image_name=whisper-app/be
set container_name=whisper-app-be

docker run -p 5000:5000 --rm --name %container_name% %image_name%:%version_num%