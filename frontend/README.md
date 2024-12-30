# Whisper App Frontend Code Repository

This folder serves as the frontend component for a full stack application that consists of a Whisper transcribing model from HuggingFace. It is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Pre-requisites

Node:
- Install Node Package Manager (NPM): https://www.npmjs.com/package/npm

Docker:
- Set up Docker on your local environment. (e.g. [Rancher Desktop](https://docs.rancherdesktop.io/getting-started/installation/), [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/))
- Docker is needed to wrap the various applications into Docker images and run the Docker images as containers.

## Running App Locally

The following commands are available to run the web application.

### `npm start`

This command runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. \

The page will reload when you make changes. You may also see any lint errors in the console. \

### `npm run build`

This command builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.


## Running Unit Tests Locally

The following command is used to run unit tests.

### `npm test`

This command launches the test runner in the interactive watch mode.\
The files for unit tests are found in `src/__test__` folder. The files are organised such that it follows the file structure of the codes.

## Docker Scripts
TODO
