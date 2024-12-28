# Use an official Miniconda image as the base image
FROM continuumio/miniconda3:latest

# Install ffmpeg for audio files
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory in the container
WORKDIR /app

# add application code to /app
COPY . .

# Create the Conda environment
RUN conda env create -f conda-env-docker.yml

# Activate the Conda environment
SHELL ["conda", "run", "-n", "whisper-app-be", "/bin/bash", "-c"]

# Expose the port that the Python app will run on as documentation
EXPOSE 5000

# Specify the command to run on container start
CMD ["conda", "run", "--no-capture-output", "-n", "whisper-app-be", "gunicorn", "--workers", "1", "--threads", "4", "-b", "0.0.0.0:5000", "app:app"]

