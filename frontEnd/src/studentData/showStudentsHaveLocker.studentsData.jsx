import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/api.js";
import { fetchAllStudentDataUrl } from "../url/index.url.js";

// Icons as components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const LockerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShowLockers = () => {
  const [occupiedLockers, setOccupiedLockers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilterType, setDateFilterType] = useState("AdmissionDate");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();

  // Fetch occupied locker data from backend
  useEffect(() => {
    fetchOccupiedLockers();
  }, []);

  const fetchOccupiedLockers = async () => {
    try {
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const data = response.data || [];
        setStudents(data);

        // Only consider lockers with LockerNumber as a valid integer > 0
        const lockerNumbers = data
          .map((student) => Number(student.LockerNumber))
          .filter((locker) => Number.isInteger(locker) && locker > 0);
        setOccupiedLockers(lockerNumbers);
      } else {
        setStudents([]);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      console.error("Error fetching occupied lockers:", error);
      alert("Failed to fetch locker data.");
    }
  };

  // Create an array of locker numbers from 1 to 100
  const totalLockers = 100;
  const lockers = Array.from({ length: totalLockers }, (_, index) => index + 1);

  // Filter lockers based on search term and other filters
  const getFilteredLockers = () => {
    const filteredStudents = students.filter(student => {
      // Search filter
      const matchesSearch = !searchTerm.trim() || [
        student.StudentName, student.FatherName, student.RegistrationNumber,
        student.ContactNumber, student.Address, student.SeatNumber,
        student.LockerNumber, student.Shift, student.PaymentMode,
        ...(student.TimeSlots || [])
      ].some(field => field?.toString().toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && student.StudentActiveStatus === true) ||
        (statusFilter === "inactive" && student.StudentActiveStatus === false);

      // Date filters - filter by specific date field
      let matchesDate = true;
      if (startDate || endDate || selectedMonth || selectedYear) {
        const dateVal = new Date(student[dateFilterType]);
        if (startDate && dateVal < new Date(startDate)) matchesDate = false;
        if (endDate && dateVal > new Date(endDate)) matchesDate = false;
        if (selectedMonth && dateVal.getMonth() + 1 !== parseInt(selectedMonth)) matchesDate = false;
        if (selectedYear && dateVal.getFullYear() !== parseInt(selectedYear)) matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    if (!searchTerm.trim() && statusFilter === "active" && !startDate && !endDate && !selectedMonth && !selectedYear) {
      return lockers;
    }

    const matchingLockerNumbers = filteredStudents
      .map(student => Number(student.LockerNumber))
      .filter(locker => Number.isInteger(locker) && locker > 0);

    return lockers.filter(locker => 
      matchingLockerNumbers.includes(locker) || 
      (searchTerm && locker.toString().includes(searchTerm))
    );
  };

  const displayedLockers = getFilteredLockers();

  // Handle locker click to show modal
  const handleLockerClick = (lockerNumber) => {
    // Find student with this locker number (as integer)
    const student = students.find(
      (s) => Number(s.LockerNumber) === lockerNumber
    );
    if (student) {
      setSelectedStudent(student);
      setShowModal(true);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchTerm("");
    setStatusFilter("active");
    setDateFilterType("AdmissionDate");
    setStartDate("");
    setEndDate("");
    setSelectedMonth("");
    setSelectedYear("");
  };

  const hasActiveFilters = startDate || endDate || selectedMonth || selectedYear || statusFilter !== "active" || searchTerm;

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              🔒 Locker Management
            </h1>
            <p className="text-blue-100 text-lg opacity-90">View and manage student locker allocations</p>
            <div className="mt-4 flex justify-center items-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-sm">Total Lockers:</span>
                <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{totalLockers}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Occupied:</span>
                <span className="bg-green-500/30 px-3 py-1 rounded-full font-semibold">{occupiedLockers.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Available:</span>
                <span className="bg-blue-500/30 px-3 py-1 rounded-full font-semibold">{totalLockers - occupiedLockers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          {/* Search and Filter Toggle Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, registration, contact, address, locker number..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-12 pl-12 pr-12 bg-white/95 border border-blue-300/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 shadow"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 px-3 bg-white/90 border border-blue-300/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
              >
                <option value="active">Active Students</option>
                <option value="inactive">Inactive Students</option>
                <option value="all">All Status</option>
              </select>
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 h-12 px-4 rounded-xl font-medium transition-all duration-200 shadow ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-700 border border-blue-300/50'
                }`}
              >
                <FilterIcon />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">•</span>
                )}
              </button>
              
              {/* Clear All Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearSearch}
                  className="h-12 px-4 bg-red-500/80 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow hover:shadow-lg"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-blue-300/30 p-4 mb-4 animate-fadeIn">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FilterIcon />
                Date Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                {/* Date Field Selector */}
                <div className="lg:col-span-2">
                  <label className="block text-white text-sm font-medium mb-2">Filter by Date Field:</label>
                  <select
                    value={dateFilterType}
                    onChange={(e) => setDateFilterType(e.target.value)}
                    className="w-full h-10 px-3 bg-white/90 border border-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
                  >
                    <option value="AdmissionDate">Admission Date</option>
                    <option value="FeesPaidTillDate">Fees Paid Till Date</option>
                    <option value="PaymentExpectedDate">Payment Expected Date</option>
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                  </select>
                </div>
                
                {/* Start Date */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">From Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && new Date(e.target.value) > new Date(endDate)) setEndDate("");
                    }}
                    className="w-full h-10 px-3 bg-white/90 border border-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
                    max={endDate || undefined}
                  />
                </div>
                
                {/* End Date */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">To Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white/90 border border-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
                    min={startDate || undefined}
                  />
                </div>
                
                {/* Month Filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full h-10 px-3 bg-white/90 border border-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
                  >
                    <option value="">All Months</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{new Date(2025, i).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
                
                {/* Year Filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Year:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full h-10 px-3 bg-white/90 border border-blue-300/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
                  >
                    <option value="">All Years</option>
                    {[...Array(6)].map((_, i) => {
                      const year = 2022 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>
              
              {/* Filter Summary */}
              {hasActiveFilters && (
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-400/30">
                  <p className="text-blue-200 text-sm">
                    <span className="font-medium">Active Filters:</span>
                    {statusFilter !== "active" && ` Status: ${statusFilter}`}
                    {dateFilterType !== "AdmissionDate" && ` | Date Field: ${dateFilterType.replace(/([A-Z])/g, ' $1').trim()}`}
                    {startDate && ` | From: ${formatDate(startDate)}`}
                    {endDate && ` | To: ${formatDate(endDate)}`}
                    {selectedMonth && ` | Month: ${new Date(2025, selectedMonth - 1).toLocaleString('default', { month: 'long' })}`}
                    {selectedYear && ` | Year: ${selectedYear}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 mb-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg shadow-lg"></div>
              <span className="text-white font-medium">Occupied (Click to view details)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-lg shadow-lg"></div>
              <span className="text-white font-medium">Available</span>
            </div>
            {searchTerm && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-lg shadow-lg animate-pulse"></div>
                <span className="text-white font-medium">Search Results</span>
              </div>
            )}
          </div>
        </div>

        {/* Lockers Grid */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          {displayedLockers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-blue-200 mb-4">No lockers match your search criteria.</p>
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-10 md:grid-cols-20 gap-2">
              {displayedLockers.map((lockerNumber) => {
                const isOccupied = occupiedLockers.includes(lockerNumber);
                const isSearchResult = searchTerm && displayedLockers.includes(lockerNumber);
                return (
                  <div
                    key={lockerNumber}
                    onClick={() => isOccupied && handleLockerClick(lockerNumber)}
                    className={`
                      relative w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-200 transform hover:scale-110 shadow-lg
                      ${isOccupied
                        ? isSearchResult
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white cursor-pointer hover:from-yellow-500 hover:to-orange-600 hover:shadow-xl animate-pulse'
                          : 'bg-gradient-to-br from-green-400 to-green-600 text-white cursor-pointer hover:from-green-500 hover:to-green-700 hover:shadow-xl'
                        : 'bg-gradient-to-br from-gray-500 to-gray-700 text-gray-300 cursor-default'
                      }
                    `}
                    title={isOccupied ? 'Click to view student details' : 'Available locker'}
                  >
                    {lockerNumber}
                    {isOccupied && (
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                        isSearchResult ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <UserIcon />
                  Student Details
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-red-300 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {selectedStudent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <UserIcon />
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{selectedStudent.StudentName}</span></div>
                      <div><span className="font-medium text-gray-700">Father's Name:</span> <span className="text-gray-900">{selectedStudent.FatherName}</span></div>
                      <div><span className="font-medium text-gray-700">Registration:</span> <span className="text-gray-900">{selectedStudent.RegistrationNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{selectedStudent.ContactNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-900">{selectedStudent.Address}</span></div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <LockerIcon />
                      Allocation Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-700">Locker Number:</span> <span className="text-green-600 font-bold text-lg">{selectedStudent.LockerNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Seat Number:</span> <span className="text-gray-900">{selectedStudent.SeatNumber}</span></div>
                      <div><span className="font-medium text-gray-700">Time Slots:</span> <span className="text-gray-900">{selectedStudent.TimeSlots.join(", ")}</span></div>
                      <div><span className="font-medium text-gray-700">Shift:</span> <span className="text-gray-900">{selectedStudent.Shift}</span></div>
                      <div><span className="font-medium text-gray-700">Admission Date:</span> <span className="text-gray-900">{formatDate(selectedStudent.AdmissionDate)}</span></div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl md:col-span-2">
                    <h4 className="font-semibold text-yellow-800 mb-3">💰 Payment Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="font-medium text-gray-700">Amount Paid:</span> <span className="text-green-600 font-semibold">₹{selectedStudent.AmountPaid}</span></div>
                      <div><span className="font-medium text-gray-700">Amount Due:</span> <span className="text-red-600 font-semibold">₹{selectedStudent.AmountDue || "0"}</span></div>
                      <div><span className="font-medium text-gray-700">Admission Amount:</span> <span className="text-gray-900">₹{selectedStudent.AdmissionAmount}</span></div>
                      <div><span className="font-medium text-gray-700">Payment Mode:</span> <span className="text-gray-900">{selectedStudent.PaymentMode}</span></div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Fees Paid Till:</span> <span className="text-gray-900">{formatDate(selectedStudent.FeesPaidTillDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowLockers;
