import { React, useReducer, useState, useEffect } from "react";
import { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileSelect } from "../helper/dropzone";
import { transcribeURL } from "../props/urls";

const Upload = () => {
  // reducer function to handle state changes
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE":
        return { ...state, file: action.file };
      case "REMOVE":
        return { ...state, file: null }
      default:
        return state;
    }
  };

  // destructuring state and dispatch, initializing fileList to empty array
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    file: null,
  });

  useEffect(() => {
    let fileReader = false;
    if (data.file) {
      fileReader = new FileReader();
      fileReader.readAsDataURL(data.file);
    }
    return () => {
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [data.file]);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  const submitTask = () => {
    // initialize formData object
    const formData = new FormData();
    formData.append("uploaded_file", data.file);

    // Upload the files as a POST request to the server using fetch
    fetch(transcribeURL, {
      method: "POST",
      body: formData,
    }).then((res) =>
      res.json()
    ).then((data) => {
      if (data["status"] === "success") {
        setSubmitSuccess(true);
        setSubmitError(false);
        setSubmitErrorMessage("");
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
        let errorMessage = "Error encounted."
        if ("message" in data) {
          errorMessage = data["message"]
        }
        setSubmitErrorMessage(errorMessage);
      }
    });
  }

  const removeFile = () => {
    dispatch({ type: "REMOVE" });
  }

  const resetForm = () => {
    removeFile();
    setSubmitSuccess(false);
    setSubmitError(false);
    setSubmitErrorMessage("");
  }

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-5 bg-white sm:p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Audio File</label>
          {data.file == null && <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            onDrop={(e) => handleDrop(e, data, dispatch)}
            onDragOver={(e) => handleDragOver(e, dispatch)}
            onDragEnter={(e) => handleDragEnter(e, dispatch)}
            onDragLeave={(e) => handleDragLeave(e, dispatch)}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".mp3,.zip"
                    className="sr-only"
                    onChange={(e) => handleFileSelect(e, data, dispatch)}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">Only .mp3 and .zip allowed</p>
            </div>
          </div>}
        </div>
        {data.file != null && <div className="mt-6 inline-flex">
          <p className="mt-2 text-sm">Uploaded File: {data.file.name}</p>
          {!submitSuccess && <button
            type="button"
            className="ml-2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={() => removeFile()}
          >
            Remove File
          </button>}

        </div>}
        {!submitSuccess && <div><button
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => submitTask()}
          disabled={data.file == null}
        >
          Submit
        </button></div>}
        {submitSuccess && <p className="mt-6 rounded-md bg-green-300 py-2 px-2">Your task is submitted successfully and transcription is in progress.</p>}
        {submitError && <p className="mt-6 rounded-md bg-red-300 py-2 px-2">{submitErrorMessage}</p>}
        {submitSuccess && <button
          className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => resetForm()}
        >
          Submit Another Task
        </button>}
      </div>
    </div>
  )
}

export default Upload;