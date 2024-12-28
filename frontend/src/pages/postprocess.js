import { React, useState, useEffect } from "react";
import { postprocessURL } from "../props/urls";

const Postprocess = () => {
  useEffect(() => {
    // TODO: Add code here
  }, []);

  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [streamedOutput, setStreamedOutput] = useState([]);

  const decoder = new TextDecoder("utf-8");

  const submitTask = async () => {
    resetForm();
    // initialize formData object
    const formData = new FormData();
    formData.append("system_prompt", systemPrompt);
    formData.append("user_prompt", userPrompt);

    console.log("system_prompt: ", systemPrompt);
    console.log("user_prompt: ", userPrompt);

    // Upload the files as a POST request to the server using fetch
    fetch(postprocessURL, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (res.status !== 200) {
        setSubmitError(true);
        let errorMessage = "Error encounted."
        setSubmitErrorMessage(errorMessage);
      } else {
        setSubmitError(false);
        setSubmitErrorMessage("");

        const reader = res.body.getReader();

        while (true) {
          const { value, done } = await reader.read();
          const stringValue = decoder.decode(value);
          if (done) {
            break;
          }
          setStreamedOutput((prevWords) => [...prevWords, stringValue]);
        };
      }
    });
  }

  const resetForm = () => {
    setSubmitError(false);
    setSubmitErrorMessage("");
    setStreamedOutput([]);
  }

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-5 bg-white sm:p-6">
        <div>

          <label htmlFor="system_prompt" className="block mb-2 text-sm font-medium text-gray-900">System Prompt</label>
          <textarea
            id="system_prompt"
            rows="5"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="e.g. Format the given text into proper paragraphs."
            onChange={(e) => setSystemPrompt(e.target.value)}
          ></textarea>

          <label htmlFor="user_prompt" className="block mt-6 mb-2 text-sm font-medium text-gray-900">Your Transcribed Text</label>
          <textarea
            id="user_prompt"
            rows="10"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Provide the transcribed text you would like to have edited here."
            onChange={(e) => setUserPrompt(e.target.value)}
          ></textarea>

          <button
            className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => submitTask()}
            disabled={userPrompt === ""}
          >
            Submit
          </button>

          <label htmlFor="postprocessed_text" className="block mt-6 mb-2 text-sm font-medium text-gray-900">Your Finetuned Transcribed Text</label>
          <textarea
            id="postprocessed_text"
            rows="10"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your finetuned transcribed text will be found here."
            value={streamedOutput.join('')}
          >{streamedOutput.join('')}</textarea>
        </div>
        {submitError && <p className="mt-6 rounded-md bg-red-300 py-2 px-2">{submitErrorMessage}</p>}
      </div>
    </div>
  )
}

export default Postprocess;