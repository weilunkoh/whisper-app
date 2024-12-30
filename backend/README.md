# Whisper App Backend Folder

This folder serves as the backend component for a full stack application that consists of a Whisper transcribing model from HuggingFace. This backend component is a REST API server built with Python Flask.

## Pre-requisites

Python via Miniconda:
- Install [Miniconda](https://docs.anaconda.com/free/miniconda/index.html).
- Create a new `Python 3.11` environment via [Conda](https://towardsdatascience.com/a-guide-to-conda-environments-bc6180fc533) by running the following command that creates an environment and installs Python packages via `pip`.
  ```bash
  conda env create -f ./conda-env.yml
  ```

  If there are subsequent changes to the pip requirements, the following command can be used to update the environment.
  ```bash
  conda env update -f ./conda-env.yml
  ```
- Create `.env` file based on the given `.env-template` file. Fill the `OPENAI_API_KEY` value with your own OpenAI API key to enable the bonus postprocessing feature for editing transcripts with gpt-4o-mini.
    - The `docker-compose.yml` from the parent folder also reads the OpenAI API key from this `.env` file.

Docker:
- Set up Docker on your local environment. (e.g. [Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/), [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/))
- Docker is needed to wrap the various applications into Docker images and run the Docker images as containers.

## Running App Locally

1) Run the following command to get the application running.
     ```bash
     python app.py
     ``` 
2) View the `Swagger` documentation of REST API endpoints at `localhost:5000`. Quick testing of each of the APIs can also be done on the Swagger UI.


## Running Unit Tests Locally

The following command is used to run unit tests.

### `pytest`

This command looks for all pytest files for unit testing. The files are organised such that it follows the file structure of the codes. 

For example, at the top level, the unit tests for `app.py` can be be found in `test_app.py`. For `.py` files in the `src` folder, the corresponding test files can be found in `test_src` folder.

## Docker Scripts
All provided `.bat` scripts are `docker` scripts which can be run in the command line after cloning this repository and navigating the command line to the cloned folder. 

The purpose of each `docker` script is as follows:

### 01_build_image.bat
This is used to build the Docker images for the frontend container. Run this `.bat` file simply by running `01_build_image.bat <version number>`. 
```bash
01_build_image.bat <version number>
#e.g. 01_build_image.bat 0.0.1
```

### 02_run_container.bat
This is used to run the frontend container. Run this `.bat` file simply by running `02_run_container.bat <version number>`. 
```bash
02_run_container.bat <version number>
#e.g. 02_run_container.bat 0.0.1
```

### 03_stop_container.bat
This is used to stop the frontend container. Run this `.bat` file simply by running `03_stop_container.bat`.   No version number is needed as compared to the other scripts because the container is stopped based on the container name.
