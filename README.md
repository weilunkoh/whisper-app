# Whisper APP Code Repository 

This code repository is for a full stack application that consists of a Whisper transcribing model from HuggingFace. The frontend is built on JavaScript React while the backend is REST API server built via Python Flask. 

Containerisation of both frontend and backend applications are also available in this repository. The containers are designed for docker-compose such that there is only a need to expose one port of the host machine. This is enabled via Nginx reverse proxying and more details on the technical considerations can be found in `architecture.pdf`
