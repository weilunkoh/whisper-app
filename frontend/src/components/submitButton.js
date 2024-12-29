const SubmitButton = ({ action, disabledCondtion, displayText }) => {
  return (
    <button
      className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={action}
      disabled={disabledCondtion}
    >
      {displayText}
    </button>
  );
}

export default SubmitButton;

