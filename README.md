# Whisper App Code Repository 

This code repository is for a full stack application that consists of a Whisper transcribing model from HuggingFace. The frontend is built on JavaScript React while the backend is REST API server built via Python Flask. 

Containerisation of both frontend and backend applications are also available in this repository via Docker. The containers are designed for docker-compose such that there is only a need to expose one port of the host machine. This is enabled via Nginx reverse proxying.

More details on the architecture system design and other technical considerations can be found in `architecture.pdf`

## Docker Pre-requisites
- Set up Docker on your local environment. (e.g. [Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/), [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/))
- Docker is needed to wrap the various applications into Docker images and run the Docker images as containers.

## Docker Compose Scripts
All provided `.bat` scripts are `docker-compose` scripts which can be run in the command line after cloning this repository and navigating the command line to the cloned folder. The `tag` environment attribute that defines the version number of the Docker images can be found in the `.env` file.

The purpose of each `docker-compose` script is as follows:

### 01_compose_build.bat
This is used to build the Docker images for frontend and backend containers. Run this `.bat` file simply by running `01_compose_build.bat`. 

### 02_compose_run.bat
This is used to run the frontend and backend containers. Run this `.bat` file simply by running `02_compose_run.bat`. 

### 03_compose_stop.bat
This is used to stop the frontend and backend containers. Run this `.bat` file simply by running `03_compose_stop.bat`. 

## Other Docker Scripts
It is also possible to build Docker images individually for frontend and backend without Docker compose. Please refer to the individual `frontend` and `backend` folders for the `.bat` scripts to build Docker images individually.
