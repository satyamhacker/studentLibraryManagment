import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/neonTable.css";
import { getApi, deleteApiById, updateApiById } from "../api/api.js";
import { fetchAllStudentDataUrl, deleteStudentUrl, updateStudentUrl, exportStudentDataUrl } from "../url/index.url.js";

// Icons as components for better performance
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ExportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const paymentModeOptions = [
  { label: "Online", value: "online" },
  { label: "Cash", value: "cash" },
];

const ShowStudentData = () => {
  const [students, setStudents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const timeOptions = [
    { label: "06:00 - 10:00", value: "06:00-10:00" },
    { label: "10:00 - 14:00", value: "10:00-14:00" },
    { label: "14:00 - 18:00", value: "14:00-18:00" },
    { label: "18:00 - 22:00", value: "18:00-22:00" },
    { label: "22:00 - 06:00", value: "22:00-06:00" },
    { label: "Reserved", value: "reserved" },
  ];

  const fetchStudentData = async () => {
    try {
      const response = await getApi(fetchAllStudentDataUrl);
      if (response && response.success) {
        const data = response.data || [];
        if (data.length === 0) {
          alert("Please add Student data.");
          navigate("/addStudent");
        } else {
          setStudents(data);
        }
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

  const handleUpdateStudent = async () => {
    try {
      if (!currentStudent?.TimeSlots || currentStudent.TimeSlots.length === 0) {
        setErrors({ TimeSlots: "At least one time slot is required" });
        return;
      }
      const response = await updateApiById(updateStudentUrl, currentStudent.id, currentStudent);
      if (response && response.success) {
        setShowEditModal(false);
        fetchStudentData();
      } else if (response && response.error) {
        setErrors({ ...errors, api: response.error });
      } else {
        setErrors({ ...errors, api: "Failed to update student." });
      }
    } catch (error) {
      setErrors({ ...errors, api: "Error updating student." });
      console.error("Error updating student:", error);
    }
  };
  // Use deleteApiById for deleting a student
  const deleteStudent = async (id) => {
    try {
      await deleteApiById(deleteStudentUrl, id);
      fetchStudentData();
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
  };

  const showEditModalForStudent = (student) => {
    setCurrentStudent(student);
    setShowEditModal(true);
    setErrors({});
  };

  const confirmDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePaymentModeChange = (e) => {
    const { value } = e.target;
    setCurrentStudent((prev) => ({
      ...prev,
      PaymentMode: value,
    }));
    setErrors((prev) => ({
      ...prev,
      PaymentMode: "",
    }));
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleTimeChange = (e) => {
    const selectedTimes = e.target.value;
    setCurrentStudent((prev) => ({
      ...prev,
      TimeSlots: selectedTimes,
    }));
    setErrors((prev) => ({
      ...prev,
      TimeSlots:
        selectedTimes.length > 0 ? "" : "At least one time slot is required",
    }));
  };

  const exportStudentDataToExcel = async () => {
    try {
      const response = await getApi(exportStudentDataUrl, { responseType: "blob" });
      if (response && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "students_data.xlsx");
        document.body.appendChild(link);
        link.click();
      } else {
        alert("Error exporting student data");
      }
    } catch (error) {
      console.error("Error exporting student data:", error);
      alert("Error exporting student data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              📚 Student Management
            </h1>
            <p className="text-blue-100 text-lg opacity-90">Manage your library's student records efficiently</p>
            <div className="mt-4 flex justify-center items-center gap-2 text-blue-200">
              <span className="text-sm">Total Students:</span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">{students.length}</span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
            <button
              onClick={exportStudentDataToExcel}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ExportIcon />
              Export to Excel
            </button>
          </div>
        </div>
        {/* Main Content */}
        {students.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Students Found</h3>
            <p className="text-blue-200 mb-6">Start by adding your first student to the library system.</p>
            <button
              onClick={() => navigate('/addStudent')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Add First Student
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Student Info</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                    <th className="px-6 py-4 text-left font-semibold">Seat & Locker</th>
                    <th className="px-6 py-4 text-left font-semibold">Payment</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className={`hover:bg-white/5 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                    }`}>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{student.StudentName}</div>
                        <div className="text-blue-200 text-sm">Reg: {student.RegistrationNumber}</div>
                        <div className="text-blue-300 text-sm">Father: {student.FatherName}</div>
                        <div className="text-blue-300 text-sm">Admitted: {formatDate(student.AdmissionDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.ContactNumber}</div>
                        <div className="text-blue-200 text-sm">{student.Address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{student.TimeSlots.join(", ")}</div>
                        <div className="text-blue-200 text-sm">Shift: {student.Shift}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">Seat: {student.SeatNumber}</div>
                        <div className="text-blue-200 text-sm">Locker: {student.LockerNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-green-400 font-semibold">₹{student.AmountPaid}</div>
                        <div className="text-red-400 text-sm">Due: ₹{student.AmountDue || '0'}</div>
                        <div className="text-blue-200 text-sm">{student.PaymentMode}</div>
                        <div className="text-blue-300 text-sm">Admission: ₹{student.AdmissionAmount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => showEditModalForStudent(student)}
                            className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-white p-2 rounded-lg transition-all duration-200 border border-blue-500/30"
                            title="Edit Student"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => confirmDeleteStudent(student)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white p-2 rounded-lg transition-all duration-200 border border-red-500/30"
                            title="Delete Student"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">✏️ Edit Student</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-red-300 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={currentStudent?.RegistrationNumber || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, RegistrationNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Date</label>
                  <input
                    type="date"
                    value={currentStudent?.AdmissionDate ? formatDateForInput(currentStudent.AdmissionDate) : ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AdmissionDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={currentStudent?.StudentName || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, StudentName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
                  <input
                    type="text"
                    value={currentStudent?.FatherName || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, FatherName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={currentStudent?.Address || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, Address: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={currentStudent?.ContactNumber || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, ContactNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slots</label>
                  <select
                    multiple
                    value={currentStudent?.TimeSlots || []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      handleTimeChange({ target: { value: selected } });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    size={4}
                  >
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.TimeSlots && <p className="text-red-500 text-sm mt-1">{errors.TimeSlots}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shift</label>
                  <input
                    type="text"
                    value={currentStudent?.Shift || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, Shift: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Seat Number</label>
                  <input
                    type="text"
                    value={currentStudent?.SeatNumber || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, SeatNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Locker Number</label>
                  <input
                    type="text"
                    value={currentStudent?.LockerNumber || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, LockerNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={currentStudent?.AmountPaid || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AmountPaid: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Due (₹)</label>
                  <input
                    type="number"
                    value={currentStudent?.AmountDue || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AmountDue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Amount (₹)</label>
                  <input
                    type="number"
                    value={currentStudent?.AdmissionAmount || ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AdmissionAmount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fees Paid Till Date</label>
                  <input
                    type="date"
                    value={currentStudent?.FeesPaidTillDate ? formatDateForInput(currentStudent.FeesPaidTillDate) : ""}
                    onChange={(e) => setCurrentStudent((prev) => ({ ...prev, FeesPaidTillDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Mode</label>
                  <select
                    value={currentStudent?.PaymentMode || ""}
                    onChange={handlePaymentModeChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.PaymentMode && <p className="text-red-500 text-sm mt-1">{errors.PaymentMode}</p>}
                </div>
              </div>
              {errors.api && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                <p className="text-red-600 text-sm">{errors.api}</p>
              </div>}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">🗑️ Delete Student</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white hover:text-red-200 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-lg text-gray-700 mb-2">Are you sure you want to delete</p>
                <p className="text-xl font-bold text-gray-900">{studentToDelete?.StudentName}?</p>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-3xl flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStudent(studentToDelete?.id)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🗑️ Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowStudentData;
