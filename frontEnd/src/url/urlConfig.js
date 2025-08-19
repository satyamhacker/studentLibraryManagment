const localStorageToken = localStorage.getItem("jwtToken");

const signupUrl = '/auth/signup'
const loginUrl = '/auth/login';

//ForgotPassword
const sendOtpUrl = '/auth/send-otp'
const verifyOtpUrl = '/auth/verify-otp'
const resetPasswordUrl = '/auth/reset-password'

const addStudentDataUrl = '/student-data/add-student-data'





export {
    localStorageToken,
    signupUrl,
    loginUrl,
    sendOtpUrl,
    verifyOtpUrl,
    resetPasswordUrl,
    addStudentDataUrl
}