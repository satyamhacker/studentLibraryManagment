
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/neonSeats.css";
import { getApi } from "../api/api.js";
import { fetchAllStudentDataUrl } from "../url/index.url.js";

// Icon components
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

const ShowVacantSeats = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilterType, setDateFilterType] = useState("AdmissionDate");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOccupiedSeats();
    // eslint-disable-next-line
  }, []);

  const fetchOccupiedSeats = async () => {
    try {
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const data = response.data || [];
        setStudents(data);
        // Only consider seats with SeatNumber as a valid integer > 0
        const seatNumbers = data
          .map((student) => Number(student.SeatNumber))
          .filter((seat) => Number.isInteger(seat) && seat > 0);
        setOccupiedSeats(seatNumbers);
      } else {
        setStudents([]);
        setOccupiedSeats([]);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      setOccupiedSeats([]);
      console.error("Error fetching occupied seats:", error);
      alert("Failed to fetch student data.");
    }
  };

  const timeSlotToIndex = (timeSlot) => {
    const slotMap = {
      "06:00-10:00": 0,
      "10:00-14:00": 1,
      "14:00-18:00": 2,
      "18:00-22:00": 3,
      "22:00-06:00": 4
    };
    return slotMap[timeSlot];
  };

  const getSeatOccupancy = (seatNumber) => {
    const seatStudents = students.filter(s => Number(s.SeatNumber) === seatNumber);
    const occupiedSlots = new Set();
    seatStudents.forEach(student => {
      if (student.TimeSlots && Array.isArray(student.TimeSlots)) {
        student.TimeSlots.forEach(slot => {
          const index = timeSlotToIndex(slot);
          if (index !== undefined) {
            occupiedSlots.add(index);
          }
        });
      }
    });
    return Array.from(occupiedSlots).sort();
  };

  const isSeatReserved = (seatNumber) => {
    const seatStudents = students.filter(s => Number(s.SeatNumber) === seatNumber);
    const hasReservedTimeSlot = seatStudents.some(student => 
      student.TimeSlots && student.TimeSlots.includes("reserved")
    );
    const occupiedSlots = getSeatOccupancy(seatNumber);
    return hasReservedTimeSlot || occupiedSlots.length === 5;
  };

  const totalSeats = 136;
  const seats = Array.from({ length: totalSeats }, (_, index) => index + 1);

  // Filter seats based on search term and other filters
  const getFilteredSeats = () => {
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
      return seats;
    }

    const matchingSeatNumbers = filteredStudents
      .map(student => Number(student.SeatNumber))
      .filter(seat => Number.isInteger(seat) && seat > 0);

    return seats.filter(seat => 
      matchingSeatNumbers.includes(seat) || 
      (searchTerm && seat.toString().includes(searchTerm))
    );
  };

  const displayedSeats = getFilteredSeats();

  const handleSeatClick = (seatNumber) => {
    // Find students with this seat number (as integer)
    const selected = students.filter(
      (s) => Number(s.SeatNumber) === seatNumber
    );
    if (selected.length > 0) {
      setSelectedStudents(selected);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudents([]);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-300 p-0 sm:p-0 overflow-hidden">
        <div className="w-full px-0 py-8 bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-500 flex flex-col items-center gap-3">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-white drop-shadow neon-header tracking-wider">Seat Allocation List</h2>
          <div className="mb-0 text-blue-100 text-sm">Click on an occupied seat to view student details. Reserved seats (5) have all time slots occupied.</div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="p-6 pb-4">
          {/* Search and Filter Toggle Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, registration, contact, address, seat number..."
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
        
        <div className="px-6 pb-6">
          {displayedSeats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-blue-200 mb-4">No seats match your search criteria.</p>
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-3 justify-center">
              {displayedSeats.map((seatNumber) => {
                const isOccupied = occupiedSeats.includes(seatNumber);
                const occupiedSlots = getSeatOccupancy(seatNumber);
                const isReserved = isSeatReserved(seatNumber);
                const isSearchResult = searchTerm && displayedSeats.includes(seatNumber);
                return (
                  <div key={seatNumber} className="relative flex flex-col items-center group">
                    <div className="relative">
                      <button
                        onClick={() => isOccupied && handleSeatClick(seatNumber)}
                        className={`relative w-14 h-10 rounded-xl font-bold text-sm transition-all duration-300 transform border-2 shadow-lg ${
                          isOccupied
                            ? isReserved
                              ? isSearchResult
                                ? "bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400 text-white cursor-pointer hover:scale-110 hover:shadow-yellow-400/50 hover:shadow-xl group-hover:border-yellow-300 animate-pulse"
                                : "bg-gradient-to-br from-green-600 to-green-800 border-green-400 text-white cursor-pointer hover:scale-110 hover:shadow-green-400/50 hover:shadow-xl group-hover:border-green-300"
                              : isSearchResult
                                ? "bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400 text-white cursor-pointer hover:scale-110 hover:shadow-yellow-400/50 hover:shadow-xl group-hover:border-yellow-300 animate-pulse"
                                : "bg-gradient-to-br from-slate-700 to-slate-800 border-emerald-400 text-white cursor-pointer hover:scale-110 hover:shadow-emerald-400/50 hover:shadow-xl group-hover:border-emerald-300"
                            : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 border-gray-400 cursor-not-allowed opacity-70"
                        }`}
                        title={isOccupied ? (isReserved ? "Reserved (All time slots)" : `Occupied (${occupiedSlots.length}/5 time slots)`) : "Vacant"}
                        tabIndex={isOccupied ? 0 : -1}
                        aria-label={`Seat ${seatNumber} ${isOccupied ? (isReserved ? "Reserved" : "Occupied") : "Vacant"}`}
                      >
                        {seatNumber}
                        {isOccupied && !isReserved && (
                          <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                            isSearchResult ? 'bg-gradient-to-br from-red-400 to-red-500' : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          }`}>
                            <span className="text-xs font-bold text-white">{occupiedSlots.length}</span>
                          </div>
                        )}
                      </button>
                    </div>
                    {isOccupied && (
                      <div className="flex gap-1 mt-2 p-1 bg-black/20 rounded-full backdrop-blur-sm">
                        {[0,1,2,3,4].map(slot => {
                          const seatStudents = students.filter(s => Number(s.SeatNumber) === seatNumber);
                          const hasReservedTimeSlot = seatStudents.some(student => 
                            student.TimeSlots && student.TimeSlots.includes("reserved")
                          );
                          return (
                            <div
                              key={slot}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                hasReservedTimeSlot || occupiedSlots.includes(slot)
                                  ? "bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50 scale-110"
                                  : "bg-gray-500/60"
                              }`}
                              title={`Time slot ${slot + 1}: ${hasReservedTimeSlot || occupiedSlots.includes(slot) ? 'Occupied' : 'Vacant'}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {!searchTerm && occupiedSeats.length === 0 && (
            <div className="text-center text-blue-200 mt-8 text-lg">No seats are currently occupied.</div>
          )}
        </div>
      </div>

      {/* Modal for displaying student details */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl shadow-2xl border-4 border-green-400 max-w-xl w-full p-8 relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-green-400 hover:text-red-400 text-3xl font-bold focus:outline-none"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-3xl font-extrabold text-green-400 mb-6 neon-header flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" /></svg>
              Student Details
            </h3>
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              {selectedStudents.map((student, index) => (
                <div key={index} className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-slate-600 via-slate-500 to-slate-600 border border-green-400 shadow-lg">
                  <div className="text-2xl font-bold text-green-300 mb-3 flex items-center gap-2">
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6 text-green-300'><path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' /><path strokeLinecap='round' strokeLinejoin='round' d='M4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368' /></svg>
                    {student.StudentName}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-200 text-base">
                    <div><span className="font-bold text-green-400">Reg. No:</span> <span className="text-white">{student.RegistrationNumber}</span></div>
                    <div><span className="font-bold text-green-400">Admission:</span> <span className="text-white">{formatDate(student.AdmissionDate)}</span></div>
                    <div><span className="font-bold text-green-400">Father's Name:</span> <span className="text-white">{student.FatherName}</span></div>
                    <div><span className="font-bold text-green-400">Contact:</span> <span className="text-white">{student.ContactNumber}</span></div>
                    <div className="sm:col-span-2"><span className="font-bold text-green-400">Address:</span> <span className="text-white">{student.Address}</span></div>
                    <div><span className="font-bold text-green-400">Time Slots:</span> <span className="text-white">{student.TimeSlots.join(", ")}</span></div>
                    <div><span className="font-bold text-green-400">Shift:</span> <span className="text-white">{student.Shift}</span></div>
                    <div><span className="font-bold text-green-400">Seat:</span> <span className="text-white">{student.SeatNumber}</span></div>
                    <div><span className="font-bold text-green-400">Paid:</span> <span className="text-white">₹{student.AmountPaid}</span></div>
                    <div><span className="font-bold text-green-400">Due:</span> <span className="text-white">₹{student.AmountDue || "0"}</span></div>
                    <div><span className="font-bold text-green-400">Locker:</span> <span className="text-white">{student.LockerNumber}</span></div>
                    <div><span className="font-bold text-green-400">Fees Till:</span> <span className="text-white">{formatDate(student.FeesPaidTillDate)}</span></div>
                    <div><span className="font-bold text-green-400">Payment Mode:</span> <span className="text-white">{student.PaymentMode}</span></div>
                    <div><span className="font-bold text-green-400">Admission Amt:</span> <span className="text-white">₹{student.AdmissionAmount}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow hover:from-emerald-700 hover:to-green-700 neon-button-ui text-lg"
                onClick={handleCloseModal}
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

export default ShowVacantSeats;
