set version_num=%1
set image_name=whisper-app/fe
set container_name=whisper-app-fe

docker run -d -p 80:80 --rm --name %container_name% %image_name%:%version_num%