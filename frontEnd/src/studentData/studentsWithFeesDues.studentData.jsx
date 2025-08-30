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
  const [statusFilter, setStatusFilter] = useState("active");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilterType, setDateFilterType] = useState("AdmissionDate");
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

  // Filter students with unpaid fees
  const studentsWithDues = students.filter((student) => {
    const amountDue = parseFloat(student.AmountDue) || 0;
    return amountDue > 0;
  });

  // Filter based on search term, status, and date filters
  const filteredStudents = studentsWithDues.filter((student) => {
    const matchesSearch = Object.values(student).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          {/* Search and Filter Toggle Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search students with dues..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full h-12 pl-12 pr-12 bg-white/95 border border-orange-300/50 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 shadow"
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
                className="h-12 px-3 bg-white/90 border border-orange-300/50 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 shadow"
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
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-white/90 hover:bg-white text-gray-700 border border-orange-300/50'
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
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-orange-300/30 p-4 mb-4 animate-fadeIn">
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
                    className="w-full h-10 px-3 bg-white/90 border border-orange-300/50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
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
                    className="w-full h-10 px-3 bg-white/90 border border-orange-300/50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
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
                    className="w-full h-10 px-3 bg-white/90 border border-orange-300/50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
                    min={startDate || undefined}
                  />
                </div>
                
                {/* Month Filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full h-10 px-3 bg-white/90 border border-orange-300/50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
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
                    className="w-full h-10 px-3 bg-white/90 border border-orange-300/50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-800 text-sm shadow"
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
                <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-400/30">
                  <p className="text-orange-200 text-sm">
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
