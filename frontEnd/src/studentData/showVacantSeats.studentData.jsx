
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/neonSeats.css";
import { getApi } from "../api/api.js";
import { fetchAllStudentDataUrl } from "../url/index.url.js";

const ShowVacantSeats = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
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

  const totalSeats = 136;
  const seats = Array.from({ length: totalSeats }, (_, index) => index + 1);

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
          <div className="mb-0 text-blue-100 text-sm">Click on an occupied seat to view student details.</div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-3 justify-center">
            {seats.map((seatNumber) => {
              const isOccupied = occupiedSeats.includes(seatNumber);
              return (
                <button
                  key={seatNumber}
                  onClick={() => isOccupied && handleSeatClick(seatNumber)}
                  className={`neon-seat-ui font-bold text-lg rounded-lg shadow-md transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${isOccupied
                    ? "bg-gradient-to-br from-green-400 via-green-600 to-emerald-700 text-white border-green-400 neon-glow cursor-pointer hover:scale-110 hover:shadow-green-400/60 hover:ring-4"
                    : "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-500 border-gray-300 cursor-not-allowed opacity-60"
                    }`}
                  style={{ minWidth: 48, minHeight: 48 }}
                  title={isOccupied ? "Occupied" : "Vacant"}
                  tabIndex={isOccupied ? 0 : -1}
                  aria-label={`Seat ${seatNumber} ${isOccupied ? "Occupied" : "Vacant"}`}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
          {occupiedSeats.length === 0 && (
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
