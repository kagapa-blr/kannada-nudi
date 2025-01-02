import React from 'react'

const SearchModal = ({ isModalOpen, closeModal, setSearchWord, searchWord, onSearch }) => {
  return (
    isModalOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-96 p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">ಶೋಧನ ಪದ</h2>{' '}
            {/* "Search Word" in Kannada */}
            <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 text-2xl">
              &times;
            </button>
          </div>

          {/* Input Field */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="ನಿಮ್ಮ ಶೋಧವನ್ನು ನಮೂದಿಸಿ..." // "Enter your search..." in Kannada
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)} // Update the state via setSearchWord
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Modal Footer with Buttons */}
          <div className="mt-6 flex justify-between">
            {/* Cancel Button */}
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            >
              ರದ್ದುಮಾಡಿ {/* "Cancel" in Kannada */}
            </button>

            {/* Search Button */}
            <button
              onClick={() => onSearch(searchWord)} // Trigger the search action
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ಶೋಧನೆ 
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default SearchModal
