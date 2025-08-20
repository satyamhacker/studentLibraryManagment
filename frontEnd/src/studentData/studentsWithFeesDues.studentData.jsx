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

const MoneyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const StudentWithDues = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); // Define navigate

  // Fetch student data from backend
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const data = response.data || [];
        setStudents(data);
      } else {
        setStudents([]);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      console.error("Error fetching students:", error);
      alert("Failed to fetch student data.");
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students with unpaid fees
  const studentsWithDues = students.filter((student) => {
    const amountDue = parseFloat(student.AmountDue) || 0;
    return amountDue > 0;
  });

  // Filter based on search term
  const filteredStudents = studentsWithDues.filter((student) =>
    Object.values(student).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const getTotalDues = () => {
    return studentsWithDues.reduce((total, student) => total + parseFloat(student.AmountDue || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-orange-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              💰 Outstanding Dues
            </h1>
            <p className="text-orange-100 text-lg opacity-90">Students with pending fee payments</p>
            <div className="mt-4 flex justify-center items-center gap-6 text-orange-200">
              <div className="flex items-center gap-2">
                <span className="text-sm">Students with Dues:</span>
                <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{studentsWithDues.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Total Amount:</span>
                <span className="bg-red-500/30 px-3 py-1 rounded-full font-semibold">₹{getTotalDues().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search students with dues..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {studentsWithDues.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold text-white mb-2">All Fees Collected!</h3>
            <p className="text-orange-200 mb-6">Excellent! No students have outstanding dues.</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Student Info</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                    <th className="px-6 py-4 text-left font-semibold">Allocation</th>
                    <th className="px-6 py-4 text-left font-semibold">Payment Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className={`hover:bg-white/5 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                    }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-500/20 p-2 rounded-lg">
                            <UserIcon />
                          </div>
                          <div>
                            <div className="text-white font-semibold">{student.StudentName}</div>
                            <div className="text-orange-200 text-sm">Reg: {student.RegistrationNumber}</div>
                            <div className="text-orange-300 text-sm">Father: {student.FatherName}</div>
                            <div className="text-orange-300 text-sm">Admitted: {formatDate(student.AdmissionDate)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.ContactNumber}</div>
                        <div className="text-orange-200 text-sm">{student.Address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.TimeSlots?.join(", ") || "N/A"}</div>
                        <div className="text-orange-200 text-sm">Shift: {student.Shift}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">Seat: {student.SeatNumber}</div>
                        <div className="text-orange-200 text-sm">Locker: {student.LockerNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-2 rounded-lg">
                            <AlertIcon />
                          </div>
                          <div>
                            <div className="text-red-400 font-bold text-lg">₹{student.AmountDue}</div>
                            <div className="text-orange-200 text-sm">Due Amount</div>
                            <div className="text-green-400 text-sm">Paid: ₹{student.AmountPaid}</div>
                            <div className="text-orange-300 text-sm">{student.PaymentMode}</div>
                            <div className="text-orange-300 text-sm">Fees Till: {formatDate(student.FeesPaidTillDate)}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Footer */}
            <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 p-6 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="bg-orange-500/20 p-3 rounded-xl">
                    <MoneyIcon />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Total Outstanding</div>
                    <div className="text-orange-200 text-sm">{studentsWithDues.length} students</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-400">₹{getTotalDues().toLocaleString()}</div>
                  <div className="text-orange-200 text-sm">Total Amount Due</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentWithDues;
