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

const SeatIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UnallocatedStudentsSeat = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [statusFilter, setStatusFilter] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
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
        const unallocatedStudents = data.filter(
          (student) => student.SeatNumber === "0" || student.SeatNumber === 0
        );

        setStudents(unallocatedStudents);
        setLoading(false);
      } else {
        setStudents([]);
        setLoading(false);
        if (response && response.error) {
          alert(response.error);
        }
      }
    } catch (error) {
      setStudents([]);
      setLoading(false);
      console.error("Error fetching students:", error);
      alert("Failed to fetch student data.");
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term, status, and date/month/year filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch = Object.values(student).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && student.StudentActiveStatus === true) ||
      (statusFilter === "inactive" && student.StudentActiveStatus === false);

    // Date filter (AdmissionDate, FeesPaidTillDate, PaymentExpectedDate, createdAt, updatedAt)
    let matchesDate = true;
    if (startDate) {
      matchesDate = ["AdmissionDate", "FeesPaidTillDate", "PaymentExpectedDate", "createdAt", "updatedAt"].some((field) => {
        const dateVal = new Date(student[field]);
        return dateVal >= new Date(startDate);
      });
    }
    if (endDate) {
      matchesDate = matchesDate && ["AdmissionDate", "FeesPaidTillDate", "PaymentExpectedDate", "createdAt", "updatedAt"].some((field) => {
        const dateVal = new Date(student[field]);
        return dateVal <= new Date(endDate);
      });
    }

    // Month filter
    let matchesMonth = true;
    if (selectedMonth) {
      matchesMonth = ["AdmissionDate", "FeesPaidTillDate", "PaymentExpectedDate", "createdAt", "updatedAt"].some((field) => {
        const dateVal = new Date(student[field]);
        return dateVal.getMonth() + 1 === parseInt(selectedMonth);
      });
    }

    // Year filter
    let matchesYear = true;
    if (selectedYear) {
      matchesYear = ["AdmissionDate", "FeesPaidTillDate", "PaymentExpectedDate", "createdAt", "updatedAt"].some((field) => {
        const dateVal = new Date(student[field]);
        return dateVal.getFullYear() === parseInt(selectedYear);
      });
    }

    return matchesSearch && matchesStatus && matchesDate && matchesMonth && matchesYear;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              💺 Unallocated Students
            </h1>
            <p className="text-orange-100 text-lg opacity-90">Students waiting for seat allocation</p>
            <div className="mt-4 flex justify-center items-center gap-2 text-orange-200">
              <span className="text-sm">Pending Allocations:</span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{students.length}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-end">
            {/* Search */}
            <div className="relative md:col-span-2 lg:col-span-2 xl:col-span-2">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full h-12 pl-12 pr-4 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 shadow"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                <SearchIcon />
              </div>
            </div>
            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-3 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="all">All Status</option>
              </select>
            </div>
            {/* Start Date Filter */}
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && new Date(e.target.value) > new Date(endDate)) setEndDate("");
                }}
                className="w-full h-12 px-3 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
                max={endDate || undefined}
                title="Start Date"
              />
            </div>
            {/* End Date Filter */}
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-12 px-3 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
                min={startDate || undefined}
                title="End Date"
              />
            </div>
            {/* Month Filter */}
            <div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-12 px-3 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
              >
                <option value="">All Months</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(2025, i).toLocaleString('default', { month: 'short' })}</option>
                ))}
              </select>
            </div>
            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-12 px-3 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
              >
                <option value="">All Years</option>
                {[...Array(6)].map((_, i) => {
                  const year = 2022 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            {/* Clear Filters Button */}
            <div className="md:col-span-2 lg:col-span-4 xl:col-span-1">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("active");
                  setStartDate("");
                  setEndDate("");
                  setSelectedMonth("");
                  setSelectedYear("");
                }}
                className="w-full h-12 bg-red-500/80 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow hover:shadow-lg"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold text-white mb-2">All Students Allocated!</h3>
            <p className="text-orange-200 mb-6">Great news! All students have been assigned seats.</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Student Info</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className={`hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
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
                        <div className="text-white">{student.TimeSlots.join(", ")}</div>
                        <div className="text-orange-200 text-sm">Shift: {student.Shift}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-red-500/20 p-2 rounded-lg">
                            <SeatIcon />
                          </div>
                          <div>
                            <div className="text-red-400 font-semibold">No Seat Assigned</div>
                            <div className="text-red-300 text-sm">Seat: {student.SeatNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-green-400 font-semibold">₹{student.AmountPaid}</div>
                        <div className="text-red-400 text-sm">Due: ₹{student.AmountDue || '0'}</div>
                        <div className="text-orange-200 text-sm">{student.PaymentMode}</div>
                        <div className="text-orange-300 text-sm">Admission: ₹{student.AdmissionAmount}</div>
                        <div className="text-orange-300 text-sm">Fees Till: {formatDate(student.FeesPaidTillDate)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnallocatedStudentsSeat;
