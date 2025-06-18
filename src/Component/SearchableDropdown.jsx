import React, { useState, useRef, useEffect } from "react";
import getInstitute from "../APIs/getInstitute";

const SearchableDropdown = ({setSelectedOption, selectedOption}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sample data - you can replace this with your own data
const [options, setoptions] = useState([]); // ✅ Correct way to initialize state

  useEffect(() => {

    const fetchInstitutes = async () => {
      try {
        const data = await getInstitute();
        setoptions(data);
      } catch (err) {
        console.error("Failed to fetch institutes:", err);
      }
    };
    fetchInstitutes();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(""); // Clear search when closing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setSearchTerm(option.label); // Show selected option in input
    setIsOpen(false);
    // You can add your logic here for what happens when an option is selected
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // If user is typing and there's a selected option, clear it
    if (selectedOption && e.target.value !== selectedOption.label) {
      setSelectedOption(null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // If there's a selected option, clear the input to allow new search
    if (selectedOption) {
      setSearchTerm("");
    }
  };
  const filteredOptions = options.filter(option =>
  option.label.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="w-full">
      {/* Label for the dropdown */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Your Institute
      </label>
      
      <div className="relative w-full" ref={dropdownRef}>
        {/* Direct Search Input */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder={selectedOption ? selectedOption.label : "Search options..."}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            selectedOption && !isOpen ? 'border-green-400 bg-green-50' : 'border-gray-300'
          }`}
        />

        {/* Dropdown arrow indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                <ul className="py-1">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center text-sm"
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center text-sm">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Display selected option info - only show during development/testing */}
      {selectedOption && process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-xs">
          <p className="text-green-800">
            <span className="font-semibold">Selected:</span> {selectedOption.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;