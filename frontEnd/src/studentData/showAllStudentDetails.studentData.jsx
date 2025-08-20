import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/neonTable.css";
import { getApi, deleteApiById, updateApiById } from "../api/api.js";
import { fetchAllStudentDataUrl, deleteStudentUrl, updateStudentUrl, exportStudentDataUrl } from "../url/index.url.js";

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
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-300 p-0 sm:p-0 overflow-hidden">
        <div className="w-full px-0 py-8 bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-500 flex flex-col items-center gap-3">
          <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-white drop-shadow neon-header tracking-wider">All Students Data</h1>
          <div className="mb-0 text-blue-100 text-sm">Search, edit, delete, or export student records.</div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
            <input
              type="text"
              placeholder="Search by any field..."
              value={searchTerm}
              onChange={handleSearch}
              className="neon-input px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 w-full sm:w-96 shadow"
            />
            <button
              className="neon-button bg-pink-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-pink-600 transition-all"
              onClick={exportStudentDataToExcel}
            >
              Export Student Data to Excel
            </button>
          </div>
          {students.length === 0 ? (
            <p className="text-center text-blue-200 mt-8 text-lg">No student data available.</p>
          ) : (
            <div className="overflow-x-auto neon-table-container rounded-xl shadow-lg">
              <table className="min-w-full divide-y divide-blue-200 neon-table">
                <thead className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-3">Registration Number</th>
                    <th className="px-4 py-3">Admission Date</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Father's Name</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Contact Number</th>
                    <th className="px-4 py-3">Time Slots</th>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Seat Number</th>
                    <th className="px-4 py-3">Amount Paid</th>
                    <th className="px-4 py-3">Amount Due</th>
                    <th className="px-4 py-3">Locker Number</th>
                    <th className="px-4 py-3">Fees Paid Till Date</th>
                    <th className="px-4 py-3">Payment Mode</th>
                    <th className="px-4 py-3">Admission Amount</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 divide-y divide-blue-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50 transition-all">
                      <td className="px-4 py-2">{student.RegistrationNumber}</td>
                      <td className="px-4 py-2">{formatDate(student.AdmissionDate)}</td>
                      <td className="px-4 py-2">{student.StudentName}</td>
                      <td className="px-4 py-2">{student.FatherName}</td>
                      <td className="px-4 py-2">{student.Address}</td>
                      <td className="px-4 py-2">{student.ContactNumber}</td>
                      <td className="px-4 py-2">{student.TimeSlots.join(", ")}</td>
                      <td className="px-4 py-2">{student.Shift}</td>
                      <td className="px-4 py-2">{student.SeatNumber}</td>
                      <td className="px-4 py-2">{"₹" + student.AmountPaid}</td>
                      <td className="px-4 py-2">{"₹" + (student.AmountDue || "0")}</td>
                      <td className="px-4 py-2">{student.LockerNumber}</td>
                      <td className="px-4 py-2">{formatDate(student.FeesPaidTillDate)}</td>
                      <td className="px-4 py-2">{student.PaymentMode}</td>
                      <td className="px-4 py-2">{"₹" + student.AdmissionAmount}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => showEditModalForStudent(student)}
                          className="neon-icon-button text-blue-600 hover:text-blue-900 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 12.362-12.3z" /></svg>
                        </button>
                        <button
                          onClick={() => confirmDeleteStudent(student)}
                          className="neon-icon-button text-red-600 hover:text-red-900 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white/90 rounded-2xl shadow-2xl border-2 border-blue-400 max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-blue-700 hover:text-red-500 text-2xl font-bold focus:outline-none"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 neon-header">Edit Student Data</h3>
            <form className="space-y-4">
              {/* Registration Number */}
              <div>
                <label className="block font-semibold mb-1">Registration Number</label>
                <input
                  type="text"
                  value={currentStudent?.RegistrationNumber || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, RegistrationNumber: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Admission Date */}
              <div>
                <label className="block font-semibold mb-1">Admission Date</label>
                <input
                  type="date"
                  value={currentStudent?.AdmissionDate ? formatDateForInput(currentStudent.AdmissionDate) : ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AdmissionDate: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Student Name */}
              <div>
                <label className="block font-semibold mb-1">Student Name</label>
                <input
                  type="text"
                  value={currentStudent?.StudentName || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, StudentName: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Father's Name */}
              <div>
                <label className="block font-semibold mb-1">Father's Name</label>
                <input
                  type="text"
                  value={currentStudent?.FatherName || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, FatherName: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Address */}
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={currentStudent?.Address || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, Address: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Contact Number */}
              <div>
                <label className="block font-semibold mb-1">Contact Number</label>
                <input
                  type="text"
                  value={currentStudent?.ContactNumber || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, ContactNumber: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Time Slots */}
              <div>
                <label className="block font-semibold mb-1">Time Slots</label>
                <select
                  multiple
                  value={currentStudent?.TimeSlots || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    handleTimeChange({ target: { value: selected } });
                  }}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.TimeSlots && <p className="text-red-600 text-sm mt-1">{errors.TimeSlots}</p>}
              </div>
              {/* Shift */}
              <div>
                <label className="block font-semibold mb-1">Shift</label>
                <input
                  type="text"
                  value={currentStudent?.Shift || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, Shift: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Seat Number */}
              <div>
                <label className="block font-semibold mb-1">Seat Number</label>
                <input
                  type="text"
                  value={currentStudent?.SeatNumber || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, SeatNumber: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Amount Paid */}
              <div>
                <label className="block font-semibold mb-1">Amount Paid</label>
                <input
                  type="number"
                  value={currentStudent?.AmountPaid || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AmountPaid: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Amount Due */}
              <div>
                <label className="block font-semibold mb-1">Amount Due</label>
                <input
                  type="number"
                  value={currentStudent?.AmountDue || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AmountDue: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Locker Number */}
              <div>
                <label className="block font-semibold mb-1">Locker Number</label>
                <input
                  type="text"
                  value={currentStudent?.LockerNumber || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, LockerNumber: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Fees Paid Till Date */}
              <div>
                <label className="block font-semibold mb-1">Fees Paid Till Date</label>
                <input
                  type="date"
                  value={currentStudent?.FeesPaidTillDate ? formatDateForInput(currentStudent.FeesPaidTillDate) : ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, FeesPaidTillDate: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {/* Payment Mode */}
              <div>
                <label className="block font-semibold mb-1">Payment Mode</label>
                <select
                  value={currentStudent?.PaymentMode || ""}
                  onChange={handlePaymentModeChange}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.PaymentMode && <p className="text-red-600 text-sm mt-1">{errors.PaymentMode}</p>}
              </div>
              {/* Admission Amount */}
              <div>
                <label className="block font-semibold mb-1">Admission Amount</label>
                <input
                  type="number"
                  value={currentStudent?.AdmissionAmount || ""}
                  onChange={(e) => setCurrentStudent((prev) => ({ ...prev, AdmissionAmount: e.target.value }))}
                  className="neon-input px-3 py-2 rounded-lg border border-blue-300 w-full"
                />
              </div>
              {errors.api && <p className="text-red-600 text-sm mt-2">{errors.api}</p>}
            </form>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="neon-button bg-black text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-800"
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>
              <button
                className="neon-button bg-blue-800 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-900"
                onClick={handleUpdateStudent}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white/90 rounded-2xl shadow-2xl border-2 border-red-400 max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-red-700 hover:text-black text-2xl font-bold focus:outline-none"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-red-700 mb-4 neon-header">Confirm Deletion</h3>
            <div className="mb-4 text-lg">Are you sure you want to delete the student <span className="font-bold">{studentToDelete?.StudentName}</span>?</div>
            <div className="flex justify-end gap-2">
              <button
                className="neon-button bg-black text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-800"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="neon-button bg-red-700 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-900"
                onClick={() => deleteStudent(studentToDelete?.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ...all modals and containers from the old implementation are removed; only the new return block and modals remain...
};

export default ShowStudentData;
