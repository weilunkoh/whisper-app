
import { React, useState, useEffect } from "react";
import { format_timestamp_ms } from "../helper/misc";
import { DotsHorizontalIcon } from '@heroicons/react/outline';
import { transcriptionsURL, searchURL } from "../props/urls";

const Search = () => {
  const [predictionRecords, setPredictionRecords] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const pageLimit = 5;

  const [searchQuery, setSearchQuery] = useState("");

  const [submitError, setSubmitError] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("")

  const handleResponse = (res, currentPageNum) => {
    if (res.status === 200) {
      res.json().then((data) => {
        const sortedResults = data.result.sort(function (a, b) { return a["id"] - b["id"] });
        const totalNumRecords = data.total_num_records;

        setPredictionRecords(sortedResults);
        setShowLoading(false);
        setCurrentPageNum(currentPageNum);
        setTotalPageNum(Math.ceil(totalNumRecords / pageLimit));
        setSubmitError(false);
        setSubmitErrorMessage("");
      });
    } else {
      res.json().then((data) => {
        setPredictionRecords([]);
        setShowLoading(false);
        setCurrentPageNum(0);
        setTotalPageNum(0);
        setSubmitError(true);
        let errorMessage = "Error encounted."
        if ("message" in data) {
          errorMessage = data["message"]
        }
        setSubmitErrorMessage(errorMessage);
      });
    }
  };

  const getAllRecords = (currentPageNum) => {
    setShowLoading(true);
    setPredictionRecords([]);
    if (searchQuery === "") {
      fetch(`${transcriptionsURL}?limit=${pageLimit}&offset=${currentPageNum * pageLimit}`, {
        method: "GET",
      }).then((res) => {
        handleResponse(res, currentPageNum);
      });
    } else {
      fetch(`${searchURL}?limit=${pageLimit}&offset=${currentPageNum * pageLimit}&filtered_term=${searchQuery}`, {
        method: "GET",
      }).then((res) => {
        handleResponse(res, currentPageNum);
      });
    }
  };

  useEffect(() => {
    getAllRecords(0);
  }, [searchQuery]);

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
        <div>
          <label htmlFor="searchQuery">
            <p className="inline-flex">Search:</p>
          </label>
          <input
            id="searchQuery"
            name="searchQuery"
            type="text"
            className="mx-2 py-1 px-2 rounded-md border border-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
            placeholder="Enter file name here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {!showLoading && <button
            className="inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={currentPageNum === 0}
            onClick={() => {
              getAllRecords(currentPageNum - 1);
            }}
          >
            Previous
          </button>}
          {!showLoading && <button
            className="inline-flex justify-center mx-2 py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={currentPageNum === totalPageNum - 1}
            onClick={() => {
              getAllRecords(currentPageNum + 1);
            }}
          >
            Next
          </button>}
          {!showLoading && <p className="inline-flex">
            Showing page {currentPageNum + 1} of {totalPageNum}
          </p>}
          {!showLoading && <select
            className="inline-flex ml-2 w-1/12 rounded-md border border-gray-300 bg-white py-1 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={currentPageNum}
            onChange={(e) => {
              getAllRecords(parseInt(e.target.value));
            }}
          >
            {/* loop based on given number */}
            {Array.from(Array(totalPageNum).keys()).map((pageNum) => (
              <option key={pageNum} value={pageNum}>{pageNum + 1}</option>
            ))}
          </select>}
        </div>
        <table className="table-auto border text-center">
          <thead>
            <tr className="border">
              {["Task ID", "File Name", "Transcribed Text", "Upload Timestamp", "Task Status", "Transcription Timestamp"].map((table_header) => (
                <th key={table_header} className="border px-2">{table_header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {showLoading && <tr>
              <th colSpan={3} />
              <th colSpan={3}><DotsHorizontalIcon className="animate-bounce max-h-20 " /></th>
            </tr>}
            {predictionRecords.map((record) => (
              <tr key={record["id"]} className="border">
                <td className="border"><p className="px-2 py-2">{record["id"]}</p></td>
                <td className="border"><p className="px-2 py-2 w-40">{record["filename"]}</p></td>
                <td className="border text-left"><p className="px-2 py-2">{record["transcribed_text"]}</p></td>
                <td className="border"><p className="px-2 py-2 w-36">{format_timestamp_ms(record["upload_timestamp"])}</p></td>
                <td className="border"><p className="px-2 py-2">{record["status"]}</p></td>
                <td className="border"><p className="px-2 py-2">{format_timestamp_ms(record["transcription_timestamp"])}</p></td>
              </tr>
            ))}
          </tbody>
        </table>
        {submitError && <p className="mt-6 rounded-md bg-red-300 py-2 px-2">{submitErrorMessage}</p>}
      </div>
    </div>
  )
}

export default Search;