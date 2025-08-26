const localStorageToken = localStorage.getItem("jwtToken");

const signupUrl = '/auth/signup'
const loginUrl = '/auth/login';

//ForgotPassword
const sendOtpUrl = '/auth/send-otp'
const verifyOtpUrl = '/auth/verify-otp'
const resetPasswordUrl = '/auth/reset-password'

const addStudentDataUrl = '/student-data/add-student-data'
const fetchAllStudentDataUrl = '/student-data/fetch-all-student-data'
const deleteStudentUrl = '/student-data/delete-student-data'
const updateStudentUrl = '/student-data/update-student-data'
const exportStudentDataUrl = '/student-data/export-student-data-excel'
const filterStudentsDataUrl = '/student-data/filter-student-data'
const updateStudentStatusUrl = '/student-data/update-student-status'
const getNextRegistrationNumberUrl = '/student-data/next-registration-number'

export {
    localStorageToken,
    signupUrl,
    loginUrl,
    sendOtpUrl,
    verifyOtpUrl,
    resetPasswordUrl,
    addStudentDataUrl,
    fetchAllStudentDataUrl,
    deleteStudentUrl,
    updateStudentUrl,
    exportStudentDataUrl,
    filterStudentsDataUrl,
    updateStudentStatusUrl,
    getNextRegistrationNumberUrl
}