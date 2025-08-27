
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/neonSeats.css";
import { getApi } from "../api/api.js";
import { fetchAllStudentDataUrl } from "../url/index.url.js";

// Search Icon component
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ShowVacantSeats = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter seats based on search term
  const getFilteredSeats = () => {
    if (!searchTerm.trim()) {
      return seats;
    }

    const matchingStudents = students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.StudentName?.toLowerCase().includes(searchLower) ||
        student.FatherName?.toLowerCase().includes(searchLower) ||
        student.RegistrationNumber?.toString().includes(searchLower) ||
        student.ContactNumber?.toString().includes(searchLower) ||
        student.Address?.toLowerCase().includes(searchLower) ||
        student.SeatNumber?.toString().includes(searchLower) ||
        student.LockerNumber?.toString().includes(searchLower) ||
        student.TimeSlots?.some(slot => slot.toLowerCase().includes(searchLower)) ||
        student.Shift?.toString().includes(searchLower) ||
        student.PaymentMode?.toLowerCase().includes(searchLower)
      );
    });

    const matchingSeatNumbers = matchingStudents
      .map(student => Number(student.SeatNumber))
      .filter(seat => Number.isInteger(seat) && seat > 0);

    return seats.filter(seat => 
      matchingSeatNumbers.includes(seat) || 
      seat.toString().includes(searchTerm)
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

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-300 p-0 sm:p-0 overflow-hidden">
        <div className="w-full px-0 py-8 bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-500 flex flex-col items-center gap-3">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-white drop-shadow neon-header tracking-wider">Seat Allocation List</h2>
          <div className="mb-0 text-blue-100 text-sm">Click on an occupied seat to view student details. Reserved seats (5) have all time slots occupied.</div>
        </div>
        
        {/* Search Section */}
        <div className="p-6 pb-4">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, registration, contact, address, seat number..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-4 bg-white/95 border-2 border-blue-300/50 rounded-2xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 text-gray-800 placeholder-gray-500 text-lg shadow-lg backdrop-blur-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-3 text-center">
                <span className="text-blue-200 text-sm">
                  Showing {displayedSeats.filter(seat => occupiedSeats.includes(seat)).length} matching occupied seats
                </span>
              </div>
            )}
          </div>
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
                Clear Search
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
