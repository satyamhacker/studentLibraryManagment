import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApi } from "../api/api.js";
import { filterStudentsDataUrl } from "../url/index.url.js";

// Icons as components
const FilterIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const FilterStudentData = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleApplyFilter = async () => {
    setLoading(true);
    const filterData = {
      year: selectedYear,
      month: selectedMonth,
      startDate,
      endDate,
      paymentMode
    };

    try {
      const response = await createApi(filterStudentsDataUrl, filterData);
      if (response && response.success) {
        setFilteredData(response.data || []);
        setShowModal(false);
      } else {
        alert(response?.message || "Failed to filter data");
      }
    } catch (error) {
      console.error("Error filtering data:", error);
      alert("Failed to filter student data");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setStartDate("");
    setEndDate("");
    setPaymentMode("");
    setFilteredData([]);
    setSearchTerm("");
  };

  const filteredResults = filteredData.filter((student) =>
    Object.values(student).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getTotals = () => {
    const totalPaid = filteredResults.reduce((sum, student) => sum + parseFloat(student.AmountPaid || 0), 0);
    const totalDue = filteredResults.reduce((sum, student) => sum + parseFloat(student.AmountDue || 0), 0);
    const totalAdmission = filteredResults.reduce((sum, student) => sum + parseFloat(student.AdmissionAmount || 0), 0);
    return { totalPaid, totalDue, totalAdmission };
  };

  const { totalPaid, totalDue, totalAdmission } = getTotals();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              🔍 Filter Students
            </h1>
            <p className="text-indigo-100 text-lg opacity-90">Advanced filtering and data analysis</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FilterIcon />
              Open Filters
            </button>

            {filteredData.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Clear Filters
                </button>
                <div className="text-white bg-white/10 px-4 py-2 rounded-lg">
                  {filteredResults.length} Results
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Section */}
        {filteredData.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search filtered results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/20">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <MoneyIcon />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">₹{totalPaid.toLocaleString()}</div>
                  <div className="text-green-200 text-sm">Total Paid</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-red-400/20">
              <div className="flex items-center gap-4">
                <div className="bg-red-500/20 p-3 rounded-xl">
                  <MoneyIcon />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">₹{totalDue.toLocaleString()}</div>
                  <div className="text-red-200 text-sm">Total Due</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/20">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <MoneyIcon />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">₹{totalAdmission.toLocaleString()}</div>
                  <div className="text-blue-200 text-sm">Total Admission</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {filteredResults.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Student Info</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                    <th className="px-6 py-4 text-left font-semibold">Allocation</th>
                    <th className="px-6 py-4 text-left font-semibold">Payment Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredResults.map((student, index) => (
                    <tr key={student.id} className={`hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                      }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-500/20 p-2 rounded-lg">
                            <UserIcon />
                          </div>
                          <div>
                            <div className="text-white font-semibold">{student.StudentName}</div>
                            <div className="text-purple-200 text-sm">Reg: {student.RegistrationNumber}</div>
                            <div className="text-purple-300 text-sm">Father: {student.FatherName}</div>
                            <div className="text-purple-300 text-sm">Admitted: {formatDate(student.AdmissionDate)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.ContactNumber}</div>
                        <div className="text-purple-200 text-sm">{student.Address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.TimeSlots?.join(", ") || "N/A"}</div>
                        <div className="text-purple-200 text-sm">Shift: {student.Shift}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">Seat: {student.SeatNumber}</div>
                        <div className="text-purple-200 text-sm">Locker: {student.LockerNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-green-400 font-semibold">Paid: ₹{student.AmountPaid}</div>
                        <div className="text-red-400 font-semibold">Due: ₹{student.AmountDue || 0}</div>
                        <div className="text-purple-300 text-sm">{student.PaymentMode}</div>
                        <div className="text-purple-300 text-sm">Till: {formatDate(student.FeesPaidTillDate)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Filters Applied</h3>
            <p className="text-purple-200 mb-6">Use the filter button above to search and analyze student data.</p>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Filter Options</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white/90 border border-white/30 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-white/90 border border-white/30 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/90 border border-white/30 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/90 border border-white/30 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-white/90 border border-white/30 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">All Payment Modes</option>
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 px-4 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilter}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Filtering..." : "Apply Filter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterStudentData;
