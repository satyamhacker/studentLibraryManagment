# 📚 Smart Library 360 - Complete API Service Documentation

**NestJS + TypeORM | Production Ready | Complete Feature Coverage**

---

## 1. INTRODUCTION

Ye documentation **Smart Library 360 Management System** ke liye hai with **10+ microservices** covering complete library operations from enquiry to alumni management.

### 1.1 Project Overview
- **Architecture**: NestJS Modular Architecture
- **Total Services**: 14 Feature Modules
- **Total Models**: 30 TypeORM Entities
- **Database**: PostgreSQL (production) / MySQL (compatible)
- **Authentication**: JWT-based with role-based access control
- **Language**: TypeScript with NestJS 10+

### 1.2 Technology Stack
- **Backend**: NestJS, TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT (@nestjs/jwt)
- **Validation**: class-validator, class-transformer
- **File Storage**: MulterModule + S3 (documents/photos)
- **Communication**: WhatsApp API (messages), SMS API (alerts)
- **Caching**: Redis (optional)

### 1.3 Common Patterns

**Standard Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

**Standard Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

**HTTP Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 500 (Server Error)

### 1.4 Authentication

**JWT Token Header**:
```
Authorization: Bearer <access_token>
```

**Token Payload**:
```json
{
  "userId": "uuid",
  "role": "superadmin|owner|manager|staff",
  "branchId": "uuid",
  "permissions": ["view_revenue", "collect_fee"]
}
```

**Permission Matrix**:
| Role | Revenue | Delete | Collect Fee | Mark Attendance |
|------|---------|--------|-------------|-----------------|
| SuperAdmin | ✅ | ✅ | ✅ | ✅ |
| Owner | ✅ | ✅ | ✅ | ✅ |
| Manager | ✅ | ❌ | ✅ | ✅ |
| Staff | ❌ | ❌ | ✅ | ✅ |

---

## SERVICE 1: USER MANAGEMENT (`/api/v1/users`)

**Purpose**: Authentication, role management, RBAC

**Models**: User, Branch

### 1.1 User Registration
**POST** `/api/v1/auth/register`

**Business Logic**:
1. Validate input (phone, email, password strength)
2. Check duplicate user (phone/email unique)
3. Hash password (bcrypt)
4. Create User with role
5. Assign to branch
6. Return access + refresh tokens

**Request**:
```json
{
  "name": "Rahul Kumar",
  "phone": "+919876543210",
  "email": "rahul@library.com",
  "password": "Pass@123",
  "role": "manager",
  "branchId": "uuid"
}
```

**Validation**:
- Phone: 10 digits, unique
- Email: Valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 digit, 1 special
- Role: Enum (superadmin, owner, manager, staff)

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

### 1.2 User Login
**POST** `/api/v1/auth/login`

**Flow**: Verify credentials → Generate JWT → Log audit trail

**Request**:
```json
{
  "phone": "+919876543210",
  "password": "Pass@123"
}
```

**Response**: Same as registration

---

## SERVICE 2: BRANCH MANAGEMENT (`/api/v1/branches`)

**Purpose**: Multi-location support

**Models**: Branch

### 2.1 Create Branch
**POST** `/api/v1/branches`

**Auth**: SuperAdmin only

**Request**:
```json
{
  "name": "Smart Library - Connaught Place",
  "address": "CP, New Delhi",
  "gstNumber": "07AAACH7409R1ZN"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Smart Library - CP"
  }
}
```

### 2.2 List Branches
**GET** `/api/v1/branches`

**Query Params**: `?isActive=true&page=1&limit=10`

**Response**: Paginated branch list

---

## SERVICE 3: ENQUIRY & CRM (`/api/v1/enquiries`)

**Purpose**: Lead management, conversion tracking

**Models**: Enquiry, Student, User

### 3.1 Create Enquiry
**POST** `/api/v1/enquiries`

**Business Logic**:
1. Capture lead details
2. Assign to current user
3. Set status = 'new'
4. Schedule follow-up reminder

**Request**:
```json
{
  "name": "Priya Sharma",
  "phone": "+919988776655",
  "preferredShift": "Morning",
  "source": "walk-in"
}
```

**Response**: Created enquiry with ID

### 3.2 Convert to Student
**POST** `/api/v1/enquiries/:id/convert`

**Flow**: 
1. Create Student from enquiry data
2. Generate Smart ID (gap-filling algorithm)
3. Update enquiry status = 'converted'
4. Link enquiry → student

**Response**: Student ID + Smart ID

### 3.3 Add Follow-up
**POST** `/api/v1/enquiries/:id/followups`

**Request**:
```json
{
  "remark": "Called, interested in evening shift",
  "nextFollowupDate": "2024-02-20"
}
```

**Business Logic**: Append to `followUps` JSONB array

---

## SERVICE 4: STUDENT MANAGEMENT (`/api/v1/students`)

**Purpose**: Complete student lifecycle - admission to exit

**Models**: Student, StudentSlot, Subscription, SecurityDeposit

### 4.1 Create Student (Admission)
**POST** `/api/v1/students`

**Business Logic**:
1. Generate Smart ID (gap-filling: reuse deleted IDs)
2. Upload documents (Aadhar, photo) to S3
3. Create Student record
4. Create StudentSlot (seat + shift assignment)
5. Create Subscription (plan-based)
6. Collect Security Deposit (if applicable)
7. Generate ID Card PDF with QR code
8. Send Welcome WhatsApp message

**Request**:
```json
{
  "name": "Amit Kumar",
  "phone": "+919876543210",
  "parentPhone": "+919123456789",
  "email": "amit@gmail.com",
  "college": "Delhi University",
  "photoUrl": "s3://...",
  "documents": {
    "aadhar": "s3://...",
    "idProof": "s3://..."
  },
  "referredBy": "studentId-uuid",
  "seatId": 1,
  "shiftId": "uuid",
  "planId": "uuid",
  "lockerId": 5,
  "securityDeposit": 500
}
```

**Validation**:
- Phone unique per branch
- Seat + Shift conflict check (time-slot blocking)
- Plan must be active
- Locker must be available

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "studentId": "uuid",
    "smartId": "LIB001",
    "subscriptionId": "uuid",
    "idCardUrl": "s3://idcards/LIB001.pdf"
  }
}
```

### 4.2 Smart ID Gap Filling Algorithm
**Logic**:
```
1. Query all active students ordered by smartId
2. Find first gap in sequence (e.g., LIB001, LIB002, [GAP], LIB004)
3. Assign missing ID (LIB003)
4. If no gaps, assign next incremental ID
```

### 4.3 Referral Bonus
**Business Logic**:
1. If `referredBy` provided, validate student exists
2. Add ₹200 to referrer's `referralBonusBalance`
3. Create audit log entry

### 4.4 Mark Student as Exited
**PATCH** `/api/v1/students/:id/exit`

**Flow**:
1. Set status = 'exited', exitDate = today
2. Set isAlumni = true
3. Free assigned seat + locker (set StudentSlot.isActive = false)
4. Refund security deposit (minus deductions)
5. Move student to alumni group

---

## SERVICE 5: SEAT & SHIFT ALLOCATION (`/api/v1/seats`, `/api/v1/shifts`)

**Purpose**: Seat matrix, conflict detection, shift management

**Models**: Seat, Shift, StudentSlot

### 5.1 Seat Allocation
**POST** `/api/v1/student-slots`

**Conflict Detection**:
```sql
SELECT * FROM student_slots 
WHERE seat_id = :seatId 
AND shift_id = :shiftId 
AND :newStartDate < validTill 
AND :newEndDate > validFrom
AND isActive = true
```

**Business Logic**: If conflict found → Error 409, else create slot

### 5.2 Multi-Slot Booking (Hybrid Schedule)
**Request**:
```json
{
  "studentId": "uuid",
  "slots": [
    {
      "seatId": 1,
      "customSlots": [
        {"start": "08:00", "end": "10:00"},
        {"start": "17:00", "end": "20:00"}
      ]
    }
  ]
}
```

**Logic**: Create multiple StudentSlot records for same student

### 5.3 Shift Migration
**POST** `/api/v1/students/:id/migrate-shift`

**Flow**:
1. Free old seat + shift
2. Check new seat availability
3. Calculate fee adjustment (price difference)
4. Create ShiftMigration record
5. Update StudentSlot
6. Create SeatHistory entry

**Request**:
```json
{
  "fromShiftId": "uuid",
  "toShiftId": "uuid",
  "fromSeatId": 1,
  "toSeatId": 15
}
```

**Response**: Fee adjustment amount

---

## SERVICE 6: SUBSCRIPTION & FEES (`/api/v1/subscriptions`)

**Purpose**: Plan management, fee calculation, late fees

**Models**: Plan, Subscription, Coupon

### 6.1 Create Subscription
**POST** `/api/v1/subscriptions`

**Fee Calculation**:
```
baseAmount = plan.price
discountApplied = coupon.discountAmount || (baseAmount * coupon.discountPercent / 100)
lateFeeAdded = 0
totalAmount = baseAmount - discountApplied + lateFeeAdded
paidAmount = 0
dueAmount = totalAmount
```

**Request**:
```json
{
  "studentId": "uuid",
  "planId": "uuid",
  "couponCode": "NEWYEAR50",
  "isGroupDiscount": false
}
```

**Response**: Subscription with calculated amounts

### 6.2 Apply Late Fee
**Cron Job** (Runs daily):
```typescript
const overdueSubscriptions = await subscriptionRepo.find({
  where: { 
    status: 'active',
    dueAmount: MoreThan(0),
    endDate: LessThan(new Date())
  }
});

for (const sub of overdueSubscriptions) {
  const daysLate = daysBetween(sub.endDate, today);
  if (daysLate > 5) {
    sub.lateFeeAdded += 50 * Math.floor(daysLate / 5);
    sub.totalAmount += 50;
    sub.dueAmount += 50;
  }
}
```

### 6.3 Auto-Downgrade on Non-Payment
**Logic**: If `dueAmount > 0` for 10+ days, set status = 'suspended'

---

## SERVICE 7: PAYMENT PROCESSING (`/api/v1/payments`)

**Purpose**: Fee collection, partial payments, receipts

**Models**: Payment, Subscription, Student

### 7.1 Collect Payment
**POST** `/api/v1/payments`

**Business Logic**:
1. Validate payment amount
2. Update subscription: `paidAmount += amount`, `dueAmount -= amount`
3. If `dueAmount == 0`, set status = 'active'
4. Generate receipt PDF
5. Send WhatsApp receipt
6. Log payment in audit trail

**Request**:
```json
{
  "studentId": "uuid",
  "subscriptionId": "uuid",
  "amount": 500,
  "mode": "upi",
  "transactionId": "UPI20240215...",
  "remark": "Partial payment"
}
```

**Response**: Receipt ID + PDF URL

### 7.2 Partial Payment Support
**Example**:
```
Total: ₹1000
Payment 1: ₹500 → Paid: ₹500, Due: ₹500
Payment 2: ₹300 → Paid: ₹800, Due: ₹200
Payment 3: ₹200 → Paid: ₹1000, Due: ₹0
```

---

## SERVICE 8: PROMISE TO PAY (PTP) (`/api/v1/payment-promises`)

**Purpose**: Track payment commitments, calculate trust score

**Models**: PaymentPromise, Student

### 8.1 Create Promise
**POST** `/api/v1/payment-promises`

**Request**:
```json
{
  "studentId": "uuid",
  "promisedAmount": 450,
  "expectedDate": "2024-02-20"
}
```

### 8.2 Update Promise (Date Change)
**PATCH** `/api/v1/payment-promises/:id`

**Logic**:
```typescript
promise.timesChanged += 1;
student.commitmentReliabilityScore = promise.timesChanged;
if (student.commitmentReliabilityScore > 3) {
  // Send alert to manager: "Low Trust Student"
}
```

### 8.3 Mark as Fulfilled
**Logic**: When payment received, set `fulfilled = true`

---

## SERVICE 9: ATTENDANCE TRACKING (`/api/v1/attendance`)

**Purpose**: Daily attendance, absentee reports

**Models**: Attendance, Student, User

### 9.1 Mark Attendance
**POST** `/api/v1/attendance`

**Request**:
```json
{
  "studentId": "uuid",
  "date": "2024-02-15",
  "inTime": "09:30",
  "outTime": "17:00",
  "status": "present"
}
```

### 9.2 Absentee Report
**GET** `/api/v1/attendance/absentees?date=2024-02-15`

**Logic**:
```sql
SELECT s.* FROM students s
LEFT JOIN attendance a ON s.id = a.student_id AND a.date = :date
WHERE a.id IS NULL AND s.status = 'active'
```

**Auto SMS**: Send to parents if absent > 3 consecutive days

---

## SERVICE 10: COMPLAINT MANAGEMENT (`/api/v1/complaints`)

**Purpose**: Complaint box with anonymous support

**Models**: Complaint, Student, User

### 10.1 Create Complaint
**POST** `/api/v1/complaints`

**Request**:
```json
{
  "title": "AC not cooling",
  "description": "AC in Room A not working since yesterday",
  "isAnonymous": false,
  "studentId": "uuid"
}
```

**Response**: Complaint ID

### 10.2 Resolve Complaint
**PATCH** `/api/v1/complaints/:id/resolve`

**Logic**:
1. Set status = 'resolved'
2. Set resolvedAt = now
3. Set resolvedBy = currentUser
4. Notify student via WhatsApp

---

## SERVICE 11: NOTICE BOARD (`/api/v1/notices`)

**Purpose**: Announcements, WhatsApp broadcast

**Models**: Notice, WhatsAppMessage

### 11.1 Create Notice
**POST** `/api/v1/notices`

**Request**:
```json
{
  "title": "Holiday Notice",
  "message": "Library closed on 25th March - Holi",
  "validTill": "2024-03-25",
  "sendWhatsApp": true
}
```

**Business Logic**:
1. Create Notice
2. If `sendWhatsApp = true`:
   - Get all active students
   - Queue WhatsApp messages
   - Create WhatsAppMessage records

---

## SERVICE 12: EXPENSE MANAGEMENT (`/api/v1/expenses`)

**Purpose**: Track operating costs, P&L calculation

**Models**: Expense, ExpenseCategory

### 12.1 Add Expense
**POST** `/api/v1/expenses`

**Request**:
```json
{
  "categoryId": "uuid",
  "amount": 15000,
  "description": "February rent",
  "expenseDate": "2024-02-01"
}
```

### 12.2 Net Profit Calculation
**GET** `/api/v1/reports/profit-loss?startDate=2024-02-01&endDate=2024-02-28`

**Formula**:
```typescript
const totalIncome = await paymentRepo
  .createQueryBuilder()
  .select('SUM(amount)', 'total')
  .where('paymentDate BETWEEN :start AND :end')
  .getRawOne();

const totalExpenses = await expenseRepo
  .createQueryBuilder()
  .select('SUM(amount)', 'total')
  .where('expenseDate BETWEEN :start AND :end')
  .getRawOne();

const netProfit = totalIncome.total - totalExpenses.total;
```

---

## SERVICE 13: DAILY SETTLEMENT (`/api/v1/daily-settlements`)

**Purpose**: End-of-day report

**Models**: DailySettlement, Payment, Expense

### 13.1 Close Day
**POST** `/api/v1/daily-settlements`

**Business Logic**:
```typescript
const cashTotal = await paymentRepo.sum('amount', { mode: 'cash', date: today });
const upiTotal = await paymentRepo.sum('amount', { mode: 'upi', date: today });
const cardTotal = await paymentRepo.sum('amount', { mode: 'card', date: today });
const expensesTotal = await expenseRepo.sum('amount', { date: today });

const settlement = {
  totalCashCollected: cashTotal,
  totalUPICollected: upiTotal,
  totalCardCollected: cardTotal,
  totalExpenses: expensesTotal,
  netProfit: (cashTotal + upiTotal + cardTotal) - expensesTotal
};
```

**SMS to Owner**: "Aaj ka cash ₹5000, UPI ₹3000. Total ₹8000"

---

## SERVICE 14: BULK IMPORT (`/api/v1/bulk-import`)

**Purpose**: Excel upload for migration

**Models**: BulkImport, Student

### 14.1 Upload Students
**POST** `/api/v1/bulk-import/students`

**Content-Type**: `multipart/form-data`

**Business Logic**:
1. Parse Excel file
2. Validate each row
3. Create students in transaction
4. Track errors

**Response**:
```json
{
  "success": true,
  "data": {
    "totalRows": 100,
    "successCount": 95,
    "failureCount": 5,
    "errors": [
      {"row": 5, "error": "Missing phone number"},
      {"row": 12, "error": "Invalid email"}
    ]
  }
}
```

---

## SERVICE 15: REPORTS & ANALYTICS (`/api/v1/reports`)

**Purpose**: Business intelligence

### 15.1 Dashboard Stats
**GET** `/api/v1/reports/dashboard`

**Response**:
```json
{
  "liveOccupancy": {
    "morning": "95%",
    "evening": "40%"
  },
  "todayCollection": 8000,
  "todayExpense": 1500,
  "renewalsDue": 5,
  "newEnquiries": 2,
  "complaintsPending": 1
}
```

### 15.2 Seat Matrix
**GET** `/api/v1/reports/seat-matrix?shift=morning`

**Response**: Grid with seat status (free, occupied, expiring)

---

## SERVICE 16: ID CARD GENERATION (`/api/v1/id-cards`)

**Purpose**: Click & Print ID cards

**Models**: IDCard, Student

### 16.1 Generate ID Card
**POST** `/api/v1/id-cards`

**Business Logic**:
1. Fetch student details + photo
2. Generate QR code (student info encoded)
3. Create PDF using template
4. Upload to S3
5. Mark as generated

**Response**: PDF URL

---

## SERVICE 17: WAITLIST MANAGEMENT (`/api/v1/waitlist`)

**Purpose**: Notify when seats available

**Models**: Waitlist, Student, Shift

### 17.1 Add to Waitlist
**POST** `/api/v1/waitlist`

**Request**:
```json
{
  "studentId": "uuid",
  "preferredShiftId": "uuid"  
}
```

### 17.2 Auto-Notify
**Cron Job**: When seat freed, notify waitlist

---

## SERVICE 18: BLACKLIST MANAGEMENT (`/api/v1/blacklist`)

**Purpose**: Block troublemakers

**Models**: Blacklist

### 18.1 Add to Blacklist
**POST** `/api/v1/blacklist`

**Request**:
```json
{
  "phone": "+919876543210",
  "name": "Ravi Kumar",
  "reason": "Non-payment and misbehavior"
}
```


**Validation**: Check blacklist before admission

---

## SERVICE 19: LOCKER MANAGEMENT (`/api/v1/lockers`)

**Purpose**: Locker assignment and management

**Models**: Locker, StudentSlot

### 19.1 Assign Locker
**POST** `/api/v1/lockers/assign`

**Request**:
```json
{
  "studentSlotId": "uuid",
  "lockerNumber": "L-05"
}
```

**Business Logic**:
1. Check locker availability
2. Link locker to StudentSlot
3. Add locker fee to subscription

### 19.2 Release Locker
**POST** `/api/v1/lockers/:id/release`

**Logic**: Set locker as available, remove from StudentSlot

---

## SERVICE 20: PLAN MANAGEMENT (`/api/v1/plans`)

**Purpose**: Create and manage subscription plans

**Models**: Plan

### 20.1 Create Plan
**POST** `/api/v1/plans`

**Auth**: Owner/SuperAdmin only

**Request**:
```json
{
  "name": "Monthly Premium",
  "durationDays": 30,
  "price": 1200,
  "branchId": "uuid"
}
```

### 20.2 Update Plan
**PATCH** `/api/v1/plans/:id`

**Note**: Existing subscriptions not affected, only new ones

---

## SERVICE 21: COUPON MANAGEMENT (`/api/v1/coupons`)

**Purpose**: Create and track discount codes

**Models**: Coupon, Subscription

### 21.1 Create Coupon
**POST** `/api/v1/coupons`

**Request**:
```json
{
  "code": "NEWYEAR50",
  "discountAmount": 50,
  "validTill": "2024-12-31",
  "maxUses": 100
}
```

### 21.2 Validate Coupon
**GET** `/api/v1/coupons/validate/:code`

**Business Logic**:
1. Check if active
2. Check expiry date
3. Check usage limit
4. Return discount amount

---

## SERVICE 22: ASSET & MAINTENANCE (`/api/v1/assets`)

**Purpose**: Track library assets and maintenance

**Models**: Asset, AssetMaintenanceLog

### 22.1 Add Asset
**POST** `/api/v1/assets`

**Request**:
```json
{
  "name": "AC",
  "quantity": 2,
  "purchaseDate": "2023-12-01"
}
```

### 22.2 Log Maintenance
**POST** `/api/v1/assets/:id/maintenance`

**Request**:
```json
{
  "remark": "AC gas refilled, deep cleaning",
  "cost": 1500,
  "servicedDate": "2024-02-01",
  "nextDueDate": "2024-08-01"
}
```

**Cron Job**: Send alert when nextDueDate approaching

---

## SERVICE 23: SEAT HISTORY (`/api/v1/seat-history`)

**Purpose**: Security feature - track who sat where

**Models**: SeatHistory, Seat, Student

### 23.1 Get Seat History
**GET** `/api/v1/seat-history/:seatId?startDate=2024-01-01&endDate=2024-06-30`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "student": "Amit Kumar (LIB001)",
      "occupiedFrom": "2024-02-01",
      "occupiedTill": "2024-03-01",
      "shift": "Morning"
    }
  ]
}
```

**Business Logic**: Auto-create SeatHistory when StudentSlot expires

---

## SERVICE 24: SECURITY DEPOSIT (`/api/v1/security-deposits`)

**Purpose**: Manage refundable deposits

**Models**: SecurityDeposit, Student

### 24.1 Collect Deposit
**POST** `/api/v1/security-deposits`

**Request**:
```json
{
  "studentId": "uuid",
  "amount": 500
}
```

### 24.2 Refund Deposit
**POST** `/api/v1/security-deposits/:id/refund`

**Request**:
```json
{
  "deductionAmount": 100,
  "deductionReason": "Damaged locker lock"
}
```

**Business Logic**:
```typescript
const refundAmount = deposit.amount - deductionAmount;
// Process refund
deposit.status = 'refunded';
deposit.refundDate = new Date();
```

---

## SERVICE 25: AUDIT LOGS (`/api/v1/audit-logs`)

**Purpose**: System activity tracking for fraud detection

**Models**: AuditLog, User

### 25.1 View Audit Logs
**GET** `/api/v1/audit-logs?entity=Payment&action=deleted&userId=uuid&startDate=2024-02-01`

**Auth**: Owner/SuperAdmin only

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "entity": "Payment",
      "entityId": "uuid",
      "action": "deleted",
      "oldValues": {"amount": 500, "status": "paid"},
      "newValues": {"isDeleted": true},
      "performedBy": "Priya (Staff)",
      "ipAddress": "192.168.1.100",
      "timestamp": "2024-02-15T16:30:45Z"
    }
  ]
}
```

**Auto-Logging**: Every create/update/delete triggers audit entry

---

## SERVICE 26: GROUP ADMISSION (`/api/v1/students/group-admission`)

**Purpose**: Batch student admission with group discount

**Models**: Student, Subscription

### 26.1 Bulk Student Admission
**POST** `/api/v1/students/group-admission`

**Request**:
```json
{
  "students": [
    {"name": "Amit", "phone": "+919876543210"},
    {"name": "Priya", "phone": "+919988776655"}
  ],
  "groupDiscount": 10,
  "planId": "uuid"
}
```

**Business Logic**:
1. Create all students with same `groupAdmissionId`
2. Apply group discount percentage
3. Set `isGroupDiscount = true` on subscriptions
4. Calculate: `totalAmount = baseAmount * (1 - groupDiscount/100)`

**Response**: Array of created students with Smart IDs

---

## ADDITIONAL FEATURES

### Gap Filling Algorithm (Service)
```typescript
async generateSmartId(branchId: string): Promise<string> {
  const students = await studentRepo.find({
    where: { branchId, status: Not('exited') },
    order: { smartId: 'ASC' }
  });
  
  const ids = students.map(s => parseInt(s.smartId.replace('LIB', '')));
  for (let i = 1; i <= ids.length; i++) {
    if (!ids.includes(i)) return `LIB${String(i).padStart(3, '0')}`;
  }
  return `LIB${String(ids.length + 1).padStart(3, '0')}`;
}
```

### WhatsApp Integration
**Templates**:
- Welcome: "Welcome to Smart Library! Your ID: {smartId}"
- Fee Reminder: "Your fee of ₹{amount} is due on {date}"
- Receipt: "Payment received: ₹{amount}. Receipt: {url}"

### Security Features
- JWT expiry: 1 hour (access), 7 days (refresh)
- Rate limiting: 100 requests/15 min per IP
- CORS: Restricted to frontend domains
- Input sanitization: class-validator decorators
- SQL injection prevention: TypeORM parameterized queries

---

## COMPLETE FEATURE COVERAGE

### All 30 Entities Covered:
✅ Branch ✅ User ✅ Shift ✅ Seat ✅ Locker  
✅ Plan ✅ Coupon ✅ Student ✅ StudentSlot ✅ Subscription  
✅ Payment ✅ PaymentPromise ✅ Enquiry ✅ ExpenseCategory ✅ Expense  
✅ Attendance ✅ Complaint ✅ Waitlist ✅ Blacklist ✅ Notice  
✅ AuditLog ✅ Asset ✅ AssetMaintenanceLog ✅ SeatHistory ✅ ShiftMigration  
✅ IDCard ✅ WhatsAppMessage ✅ SecurityDeposit ✅ DailySettlement ✅ BulkImport

### All 10 Modules from ProjectSummaryFeatures.md:
✅ Smart Dashboard (Reports)
✅ Enquiry & Lead CRM
✅ Admission & Seat Allocation
✅ Fees & Subscription Engine
✅ Operations & Resource Management (Locker, ID Card, Asset)
✅ Expense Manager
✅ Attendance & Access Control
✅ Student Engagement & Alerts (Notice, Complaint)
✅ Security & Admin Control (RBAC, Audit Logs)
✅ Onboarding & Migration (Bulk Import, Group Admission)

### All Killer USPs:
✅ Smart ID gap-filling ✅ Referral system ✅ Multi-slot booking  
✅ Partial payments ✅ Late fees ✅ Promise to Pay tracking  
✅ Trust score calculation ✅ Shift migration ✅ Seat conflict detection  
✅ WhatsApp integration ✅ Security deposit handling ✅ Daily settlement  
✅ Bulk import ✅ ID card generation ✅ Waitlist automation  
✅ Blacklist management ✅ Complaint resolution ✅ P&L reporting  
✅ RBAC with 4 roles ✅ Seat history tracking ✅ Group admission discount  
✅ Asset maintenance scheduling ✅ Audit trail for fraud detection

**Total Services: 26**  
**100% Entity Coverage**  
**100% Feature Coverage**  
**Production Ready!** 🚀

