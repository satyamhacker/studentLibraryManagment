# Student Study Library Management System

## Overview
A comprehensive web-based library management system designed specifically for study libraries. The system helps administrators manage student registrations, track payments, allocate seats and lockers, and monitor subscription periods.

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for hashing
- **Email Service**: Nodemailer
- **File Processing**: ExcelJS for data export
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 18 with Vite
- **UI Libraries**: 
  - Material-UI (MUI)
  - React Bootstrap
  - Tailwind CSS
- **Icons**: FontAwesome
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Date Handling**: React DatePicker

## Core Features

### 1. Authentication & User Management
- **User Registration**: Secure signup with email validation
- **Login System**: JWT-based authentication
- **Password Reset**: Email-based password recovery with OTP
- **Session Management**: Secure token-based sessions

### 2. Student Management
- **Student Registration**: Complete student profile creation
- **Student Data Fields**:
  - Registration Number (unique identifier)
  - Personal Information (Name, Father's Name, Address)
  - Contact Details (10-digit phone number)
  - Admission Date
  - Time Slots (multiple slots support)
  - Shift Information
  - Seat Number (optional, use "0" for unallocated)
  - Locker Number (optional, use "0" for no locker)
  - Payment Details (Amount Paid, Amount Due, Payment Mode)
  - Subscription Dates (Fees Paid Till Date, Payment Expected Date)
  - Admission Amount

### 3. Payment Management
- **Payment Tracking**: Monitor fees paid and due amounts
- **Payment Modes**: Support for online and cash payments
- **Due Date Management**: Track and update payment expected dates
- **Payment History**: Complete payment records
- **Overdue Notifications**: Identify students with pending payments

### 4. Seat & Locker Management
- **Seat Allocation**: Assign and manage student seating
- **Locker Assignment**: Track locker allocations
- **Unallocated Tracking**: Monitor students without assigned seats/lockers
- **Availability Reports**: View available seats and lockers

### 5. Data Management & Reporting
- **Student Search & Filter**: Advanced filtering capabilities
- **Data Export**: Export student data to Excel format
- **Bulk Operations**: Mass updates and operations
- **Data Validation**: Comprehensive input validation

### 6. Dashboard & Analytics
- **Home Dashboard**: Overview of key metrics
- **Student Statistics**: Total registrations, active students
- **Payment Analytics**: Due amounts, payment trends
- **Subscription Monitoring**: Track subscription end dates

## API Endpoints Structure


### Authentication Routes
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/send-otp` - Send OTP for password reset
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/reset-password` - Password reset request


### Student Management Routes
- `POST /studentData/add-student-data` - Add new student
- `GET /studentData/fetch-all-student-data` - Fetch all students
- `DELETE /studentData/delete-student-data/:id` - Remove student
- `PATCH /studentData/update-student-data/:id` - Update student information
- `PATCH /studentData/update-payment-expected-date/:id` - Update payment expected date
- `POST /studentData/filter-student-data` - Filter students by various criteria


### Data Export Routes
- `GET /studentData/export-student-data-excel` - Export student data to Excel


### Filter & Search Routes
- `POST /studentData/filter-student-data` - Filter students by various criteria
// (Other specialized filter/search endpoints can be added as needed)

## Database Schema


### Students Table
```sql
id (Primary Key, UUID)
RegistrationNumber (String, Required, Unique)
AdmissionDate (Date, Required)
StudentName (String, Required)
FatherName (String, Required)
Address (String, Required)
ContactNumber (String, 10 digits, Required)
TimeSlots (JSON Array, Required)
Shift (String, Required)
SeatNumber (String, Optional)
FeesPaidTillDate (Date, Required)
AmountPaid (Decimal, Required)
AmountDue (Decimal, Optional)
LockerNumber (String, Optional)
PaymentExpectedDate (Date, Optional)
PaymentExpectedDateChanged (Integer, Optional)
PaymentMode (Enum: 'online'/'cash', Optional)
AdmissionAmount (Decimal, Required)
createdAt (Timestamp)
updatedAt (Timestamp)
```


### Signup Data Table
```sql
id (Primary Key, UUID)
email (String, Required, Unique)
password (String, Hashed, Required)
createdAt (Timestamp)
updatedAt (Timestamp)
```


### OTP Table
```sql
id (Primary Key, UUID)
email (String, Required)
otp (String, Required)
createdAt (Timestamp)
updatedAt (Timestamp)
```

## Frontend Components Structure

### Authentication Components
- `Login.jsx` - User login interface
- `Signup.jsx` - User registration interface
- `ResetPassword.jsx` - Password reset functionality
- `PrivateRoute.jsx` - Protected route wrapper
- `PublicRoute.jsx` - Public route wrapper

### Student Management Components
- `Add_student_data.jsx` - Student registration form
- `Show_student_data.jsx` - Display all students
- `Filter_student_data.jsx` - Advanced filtering interface
- `Update_student_data.jsx` - Edit student information

### Specialized Views
- `Student_with_dues.jsx` - Students with pending payments
- `Students_subscription_ends.jsx` - Subscription expiry tracking
- `Unallocated_students_seat.jsx` - Seat allocation management
- `Show_students_haveLocker.jsx` - Locker assignment view
- `Show_studentsName_seatsUnallocated.jsx` - Unallocated seats report

### Dashboard
- `Home_page.jsx` - Main dashboard with key metrics

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Database
- npm or yarn package manager

### Backend Setup
1. Navigate to the `backEnd` directory
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=library_management
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```
4. Start the server: `node src/api/v1/Controller/Route.mjs`

### Frontend Setup
1. Navigate to the `frontEnd` directory
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the development server: `npm run dev`
5. For production: `npm run preview`

### Quick Start
Use the provided `run.bat` file to start both backend and frontend servers automatically.

## Security Features
- **Password Hashing**: bcrypt encryption for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive data validation on both client and server
- **CORS Protection**: Configured cross-origin resource sharing
- **SQL Injection Prevention**: Sequelize ORM protection

## Data Validation Rules
- **Registration Number**: Required, unique identifier
- **Contact Number**: Exactly 10 digits, numeric only
- **Email**: Valid email format, unique
- **Dates**: Valid date format validation
- **Amount Fields**: Decimal validation for monetary values
- **Time Slots**: Non-empty array validation

## Special Handling
- **Seat Numbers**: Use "0" for students without assigned seats
- **Locker Numbers**: Use "0" for students without lockers
- **Payment Modes**: Supports both online and cash transactions
- **Time Slots**: Multiple time slot selection support

## Future Enhancements (Planned)
- **SMS Integration**: Fast2SMS integration for payment reminders
- **Bulk SMS**: Send payment due notifications to multiple students
- **Advanced Analytics**: Detailed reporting and analytics dashboard
- **Mobile App**: React Native mobile application
- **Automated Reminders**: Scheduled payment reminder system

## File Structure
```
studentStudyLibraryManagment/
├── backEnd/
│   ├── src/api/v1/
│   │   ├── Controller/         # API controllers
│   │   ├── Models/             # Database models
│   │   ├── Middleware/         # Authentication & validation middleware
│   │   ├── exportsStudentData/ # Exported Excel files
│   │   ├── Routes/             # Express route files
│   │   └── Validators/         # Joi validation schemas
│   └── package.json
├── frontEnd/
│   ├── src/
│   │   ├── Student_data/   # Student management components
│   │   ├── signup_login/   # Authentication components
│   │   ├── Context/        # React context providers
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS styles
│   └── package.json
├── run.bat                 # Quick start script
└── README.md
```

## Support & Maintenance
- **Testing**: Jest framework configured for unit testing
- **Code Quality**: ESLint configured for code standards
- **Version Control**: Git repository with proper branching
- **Documentation**: Comprehensive inline code documentation

## License
This project is developed for educational and commercial use in library management systems.

---

*Last Updated: December 2024*
*Version: 1.0.0*