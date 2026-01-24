# 📚 Smart Library 360 - Complete Database Field Descriptions

**100% Field Coverage | Production Ready | TypeORM Models**

This document explains **every field** in all 28 database entities with:
- **Type & Constraints**
- **Purpose (Why)**
- **Real-world Examples**

---

## 1. Branch Entity

**Purpose**: Library ke branches ko manage karta hai - Multi-branch support ke liye

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each branch, scalable across multiple locations
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `name` (String, Unique)
  - **Why**: Branch ka naam uniquely identify karne ke liye
  - **Example**: `"Smart Library - Connaught Place"`

- `address` (String, Nullable)
  - **Why**: Branch ka physical location store karne ke liye
  - **Example**: `"Shop 23, CP Market, New Delhi - 110001"`

- `gstNumber` (String, Nullable)
  - **Why**: GST invoice generation ke liye (if library is registered)
  - **Example**: `"07AAACH7409R1ZN"`

- `isActive` (Boolean, Default: true)
  - **Why**: Branch temporarily close karne ke liye without deleting data
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Branch kab create hui - audit trail ke liye
  - **Example**: `2024-01-15T10:30:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Last modification timestamp
  - **Example**: `2024-02-20T15:45:00Z`

### Relationships:
- `users` → One-to-Many with User
- `shifts` → One-to-Many with Shift
- `seats` → One-to-Many with Seat
- `lockers` → One-to-Many with Locker
- `students` → One-to-Many with Student

---

## 2. User Entity

**Purpose**: Staff aur admin ka data - Role-based access control ke liye

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each user (admin/staff)
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `phone` (String, Unique)
  - **Why**: Primary login method via OTP, India mein phone most reliable
  - **Example**: `"+919876543210"`

- `email` (Email, Nullable)
  - **Why**: Official communication aur password reset ke liye
  - **Example**: `"rahul.manager@smartlibrary.com"`

- `name` (String)
  - **Why**: User ka full name display karne ke liye
  - **Example**: `"Rahul Kumar"`

- `password` (String, Hashed)
  - **Why**: Authentication ke liye (hashed with bcrypt)
  - **Example**: `"$2b$10$EixZaYVK1fsbw1ZfbX3OXe..."`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: User kis branch se belong karta hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `role` (String, Default: 'staff')
  - **Why**: Access level determine karta hai (superadmin, owner, manager, staff)
  - **Example**: `"manager"`

- `permissions` (JSONB Array, Default: [])
  - **Why**: Fine-grained permissions define karne ke liye
  - **Example**: `["view_revenue", "collect_fee", "mark_attendance"]`

- `isActive` (Boolean, Default: true)
  - **Why**: Employee ko suspend karne ke liye without deleting
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: User kab join kiya
  - **Example**: `2024-01-10T09:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Profile last kab update hui
  - **Example**: `2024-03-15T14:20:00Z`

---

## 3. Shift Entity

**Purpose**: Library ke time slots - Morning, Evening, Night shifts

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each shift
  - **Example**: `750e8400-e29b-41d4-a716-446655440002`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Shift kis branch ka hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `name` (String)
  - **Why**: Shift ka readable name
  - **Example**: `"Morning Shift"` or `"Custom-1"`

- `startTime` (Time)
  - **Why**: Shift kab start hoti hai
  - **Example**: `"06:00:00"`

- `endTime` (Time)
  - **Why**: Shift kab end hoti hai
  - **Example**: `"12:00:00"`

- `isActive` (Boolean, Default: true)
  - **Why**: Shift temporarily disable karne ke liye
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Shift kab create hui
  - **Example**: `2024-01-15T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Last modification time
  - **Example**: `2024-01-15T10:00:00Z`

---

## 4. Seat Entity

**Purpose**: Library ke har seat ka record - A-01, B-12 jaise seat numbers

### Fields:

- `id` (Integer, Auto-increment Primary Key)
  - **Why**: Unique identifier for each seat
  - **Example**: `1`

- `seatNumber` (String)
  - **Why**: Human-readable seat identifier
  - **Example**: `"A-01"` or `"Corner-5"`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Seat kis branch mein hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `status` (String, Default: 'working')
  - **Why**: Seat ki current condition (working, maintenance, broken)
  - **Example**: `"working"`

- `maintenanceLog` (JSONB Array, Default: [])
  - **Why**: Seat repair history track karne ke liye
  - **Example**: `[{"date": "2024-02-10", "remark": "Chair leg replaced", "doneBy": "Staff-1"}]`

- `isActive` (Boolean, Default: true)
  - **Why**: Seat permanently retire karne ke liye
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Seat kab add hui library mein
  - **Example**: `2024-01-01T08:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Last maintenance/update time
  - **Example**: `2024-02-10T16:30:00Z`

---

## 5. Locker Entity

**Purpose**: Students ke liye locker facility - apna saman rakhne ke liye

### Fields:

- `id` (Integer, Auto-increment Primary Key)
  - **Why**: Unique identifier for each locker
  - **Example**: `5`

- `lockerNumber` (String)
  - **Why**: Locker ka display number
  - **Example**: `"L-05"`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Locker kis branch mein hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `status` (String, Default: 'working')
  - **Why**: Locker ka current status
  - **Example**: `"working"` or `"maintenance"`

- `isActive` (Boolean, Default: true)
  - **Why**: Locker out of service karne ke liye
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Locker kab install hua
  - **Example**: `2024-01-01T08:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Last update time
  - **Example**: `2024-01-01T08:00:00Z`

---

## 6. Plan Entity

**Purpose**: Fee plans - Monthly ₹1000, Quarterly ₹2800, etc.

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each subscription plan
  - **Example**: `850e8400-e29b-41d4-a716-446655440003`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Plan kis branch ke liye hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `name` (String)
  - **Why**: Plan ka readable name
  - **Example**: `"Monthly Basic"` or `"Quarterly Premium"`

- `durationDays` (Integer)
  - **Why**: Plan kitne din ka hai
  - **Example**: `30` (for monthly), `90` (for quarterly)

- `price` (Decimal, Precision: 10,2)
  - **Why**: Plan ka price in rupees
  - **Example**: `1000.00`

- `isActive` (Boolean, Default: true)
  - **Why**: Plan ko discontinue karne ke liye
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Plan kab launch hua
  - **Example**: `2024-01-01T00:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Price update history
  - **Example**: `2024-02-01T10:00:00Z`

---

## 7. Coupon Entity

**Purpose**: Discount coupons - NEWYEAR50, FRIEND100 jaise codes

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each coupon
  - **Example**: `950e8400-e29b-41d4-a716-446655440004`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Coupon kis branch ke liye valid hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `code` (String, Unique)
  - **Why**: User-friendly coupon code
  - **Example**: `"NEWYEAR50"` or `"FRIEND100"`

- `discountAmount` (Decimal, Precision: 10,2, Nullable)
  - **Why**: Fixed discount amount (e.g., ₹50 off)
  - **Example**: `50.00`

- `discountPercent` (Integer, Nullable)
  - **Why**: Percentage discount (e.g., 10% off)
  - **Example**: `10`

- `validTill` (Date, Nullable)
  - **Why**: Coupon expiry date
  - **Example**: `"2024-12-31"`

- `usedCount` (Integer, Default: 0)
  - **Why**: Kitni baar use hua - ROI tracking ke liye
  - **Example**: `45`

- `maxUses` (Integer, Nullable)
  - **Why**: Maximum kitni baar use ho sakta hai
  - **Example**: `100`

- `isActive` (Boolean, Default: true)
  - **Why**: Coupon disable karne ke liye
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Coupon kab create hua
  - **Example**: `2024-01-01T00:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Coupon last kab modify hua
  - **Example**: `2024-01-15T12:00:00Z`

---

## 8. Student Entity (THE KING ENTITY)

**Purpose**: Sabse main table - students ki complete details

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each student
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `smartId` (String, Unique per branch)
  - **Why**: Gap-filling serial ID (LIB001, LIB002, etc.)
  - **Example**: `"LIB001"`

- `name` (String)
  - **Why**: Student ka full name
  - **Example**: `"Amit Kumar"`

- `phone` (String)
  - **Why**: Student ka contact number
  - **Example**: `"+919876543210"`

- `parentPhone` (String, Nullable)
  - **Why**: Parent ko absentee alerts bhejne ke liye
  - **Example**: `"+919123456789"`

- `email` (Email, Nullable)
  - **Why**: Email notifications ke liye
  - **Example**: `"amit.kumar@gmail.com"`

- `college` (String, Nullable)
  - **Why**: Student ka college/school name
  - **Example**: `"Delhi University"`

- `photoUrl` (String, Nullable)
  - **Why**: ID card aur visual identification ke liye
  - **Example**: `"https://s3.aws/students/amit.jpg"`

- `documents` (JSONB, Nullable)
  - **Why**: Aadhar, ID proof store karne ke liye
  - **Example**: `{"aadhar": "url1", "idProof": "url2", "photo": "url3"}`

- `status` (String, Default: 'active')
  - **Why**: Student ki current status (active, suspended, exited, blacklisted)
  - **Example**: `"active"`

- `exitDate` (Date, Nullable)
  - **Why**: Student kab leave kiya
  - **Example**: `"2024-06-30"`

- `commitmentReliabilityScore` (Integer, Default: 0)
  - **Why**: Trust score - kitni baar payment promise toda
  - **Example**: `3` (3 times promise changed)

- `referralBonusBalance` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Referral rewards track karne ke liye
  - **Example**: `200.00`

- `isAlumni` (Boolean, Default: false)
  - **Why**: Alumni group mein rakhneke liye (future marketing)
  - **Example**: `false`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Student kis branch se hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `referredBy` (UUID, Foreign Key → Student, Nullable)
  - **Why**: Kis student ne refer kiya
  - **Example**: `a50e8400-e29b-41d4-a716-446655440006`

- `joinDate` (Timestamp)
  - **Why**: Student kab join kiya
  - **Example**: `2024-02-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Profile last kab update hui
  - **Example**: `2024-03-15T14:00:00Z`

### Relationships:
- `slots` → One-to-Many with StudentSlot
- `subscriptions` → One-to-Many with Subscription
- `referrals` → One-to-Many with Student (self-referencing)

---

## 9. StudentSlot Entity

**Purpose**: Student ko kon si seat, kon sa shift - Multi-slot support

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each slot booking
  - **Example**: `b50e8400-e29b-41d4-a716-446655440007`

- `student` (UUID, Foreign Key → Student, Cascade Delete)
  - **Why**: Slot kis student ka hai
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `shift` (UUID, Foreign Key → Shift, Nullable)
  - **Why**: Fixed shift selection (if using predefined shifts)
  - **Example**: `750e8400-e29b-41d4-a716-446655440002`

- `customSlots` (JSONB Array, Default: [])
  - **Why**: Flexible timings ke liye (8-10 AM aur 5-8 PM)
  - **Example**: `[{"start": "08:00", "end": "10:00", "days": ["Mon","Wed","Fri"]}, {"start": "17:00", "end": "20:00"}]`

- `seat` (Integer, Foreign Key → Seat, Nullable)
  - **Why**: Student ko kon si seat assign hui
  - **Example**: `1` (refers to Seat A-01)

- `locker` (Integer, Foreign Key → Locker, Nullable)
  - **Why**: Student ko locker chahiye to assign ho
  - **Example**: `5` (refers to Locker L-05)

- `validFrom` (Date)
  - **Why**: Slot kab se valid hai
  - **Example**: `"2024-02-01"`

- `validTill` (Date)
  - **Why**: Slot kab tak valid hai (subscription end date)
  - **Example**: `"2024-03-01"`

- `isActive` (Boolean, Default: true)
  - **Why**: Slot expire hone par inactive ho jayega
  - **Example**: `true`

- `createdAt` (Timestamp)
  - **Why**: Slot kab create hua
  - **Example**: `2024-02-01T10:30:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Slot change history
  - **Example**: `2024-02-15T11:00:00Z`

---

## 10. Subscription Entity

**Purpose**: Student ka subscription track karta hai - fees, due amount, etc.

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each subscription
  - **Example**: `c50e8400-e29b-41d4-a716-446655440008`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Subscription kis student ka hai
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `plan` (UUID, Foreign Key → Plan)
  - **Why**: Kon sa plan select kiya
  - **Example**: `850e8400-e29b-41d4-a716-446655440003`

- `startDate` (Date)
  - **Why**: Subscription kab start hua
  - **Example**: `"2024-02-01"`

- `endDate` (Date)
  - **Why**: Subscription kab expire hoga
  - **Example**: `"2024-03-01"`

- `baseAmount` (Decimal, Precision: 10,2)
  - **Why**: Original plan price (before discounts)
  - **Example**: `1000.00`

- `discountApplied` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Total discount amount (coupons + referrals)
  - **Example**: `100.00`

- `lateFeeAdded` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Penalty for late payment
  - **Example**: `50.00`

- `totalAmount` (Decimal, Precision: 10,2)
  - **Why**: Final payable amount (base - discount + late fee)
  - **Example**: `950.00`

- `paidAmount` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Total kitna pay kiya (partial payments support)
  - **Example**: `500.00`

- `dueAmount` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Kitna baaki hai (totalAmount - paidAmount)
  - **Example**: `450.00`

- `status` (String, Default: 'active')
  - **Why**: Subscription status (active, expired, suspended, cancelled)
  - **Example**: `"active"`

- `couponUsed` (UUID, Foreign Key → Coupon, Nullable)
  - **Why**: Kon sa coupon apply hua
  - **Example**: `950e8400-e29b-41d4-a716-446655440004`

- `isGroupDiscount` (Boolean, Default: false)
  - **Why**: Group admission discount track karne ke liye
  - **Example**: `false`

- `groupAdmissionId` (String, Nullable)
  - **Why**: Same group ke students ko link karne ke liye
  - **Example**: `"GROUP-2024-001"`

- `createdAt` (Timestamp)
  - **Why**: Subscription kab create hua
  - **Example**: `2024-02-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Last payment/renewal time
  - **Example**: `2024-02-15T14:30:00Z`

---

## 11. Payment Entity

**Purpose**: Har payment ka record - cash, UPI, card

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each payment transaction
  - **Example**: `d50e8400-e29b-41d4-a716-446655440009`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Payment kis student ka hai
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `subscription` (UUID, Foreign Key → Subscription, Nullable)
  - **Why**: Payment kis subscription ke against hai
  - **Example**: `c50e8400-e29b-41d4-a716-446655440008`

- `amount` (Decimal, Precision: 10,2)
  - **Why**: Payment amount
  - **Example**: `500.00`

- `mode` (String, Default: 'cash')
  - **Why**: Payment method (cash, upi, card, bank_transfer)
  - **Example**: `"upi"`

- `transactionId` (String, Nullable)
  - **Why**: UPI/Card transaction reference
  - **Example**: `"UPI20240215T143000123456"`

- `lateFee` (Decimal, Nullable)
  - **Why**: Is payment mein late fee included hai kya
  - **Example**: `50.00`

- `remark` (String, Nullable)
  - **Why**: Additional notes (partial payment, advance, etc.)
  - **Example**: `"Partial payment - 1st installment"`

- `receivedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne payment collect ki (staff tracking)
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `isDeleted` (Boolean, Default: false)
  - **Why**: Receipt cancelled/deleted (fraud detection)
  - **Example**: `false`

- `paymentDate` (Timestamp)
  - **Why**: Payment kab collect hui
  - **Example**: `2024-02-15T14:30:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Payment record last kab modify hua
  - **Example**: `2024-02-15T14:30:00Z`

---

## 12. PaymentPromise Entity

**Purpose**: Student ne bola "20th ko dunga" - promise tracking

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each promise
  - **Example**: `e50e8400-e29b-41d4-a716-446655440010`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Kis student ne promise kiya
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `promisedAmount` (Decimal, Precision: 10,2)
  - **Why**: Kitna payment karne ka promise
  - **Example**: `450.00`

- `expectedDate` (Date)
  - **Why**: Kis date tak payment karenge
  - **Example**: `"2024-02-20"`

- `timesChanged` (Integer, Default: 0)
  - **Why**: Kitni baar date change ki (trust score calculate karne ke liye)
  - **Example**: `2`

- `fulfilled` (Boolean, Default: false)
  - **Why**: Promise fulfill hua ya nahi
  - **Example**: `false`

- `createdAt` (Timestamp)
  - **Why**: Promise kab kiya
  - **Example**: `2024-02-15T16:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Promise last kab update hua
  - **Example**: `2024-02-16T10:00:00Z`

---

## 13. Enquiry Entity (CRM)

**Purpose**: Lead management - jo log sirf poochne aate hain

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each enquiry/lead
  - **Example**: `f50e8400-e29b-41d4-a716-446655440011`

- `name` (String)
  - **Why**: Lead ka naam
  - **Example**: `"Priya Sharma"`

- `phone` (String)
  - **Why**: Follow-up ke liye contact number
  - **Example**: `"+919988776655"`

- `preferredShift` (String, Nullable)
  - **Why**: Student ko kon sa shift chahiye
  - **Example**: `"Morning"`

- `status` (String, Default: 'new')
  - **Why**: Lead status (new, visited, interested, converted, lost)
  - **Example**: `"interested"`

- `followUps` (JSONB Array, Default: [])
  - **Why**: Follow-up history track karne ke liye
  - **Example**: `[{"date": "2024-02-16", "remark": "Called, interested in evening shift", "by": "Manager"}]`

- `handledBy` (UUID, Foreign Key → User)
  - **Why**: Kis staff member ne handle kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `convertedToStudent` (UUID, Foreign Key → Student, Nullable)
  - **Why**: Agar convert hua to kis student mein
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `createdAt` (Timestamp)
  - **Why**: Enquiry kab aayi
  - **Example**: `2024-02-15T11:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Last follow-up kab hua
  - **Example**: `2024-02-16T15:00:00Z`

---

## 14. ExpenseCategory Entity

**Purpose**: Expense categories - Rent, Salary, Electricity

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each category
  - **Example**: `g50e8400-e29b-41d4-a716-446655440012`

- `name` (String)
  - **Why**: Category naam (Rent, Electricity, Salary, etc.)
  - **Example**: `"Rent"`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Category kis branch ke liye hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `createdAt` (Timestamp)
  - **Why**: Category kab add hui
  - **Example**: `2024-01-01T00:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Category last kab modify hui
  - **Example**: `2024-01-01T00:00:00Z`

---

## 15. Expense Entity

**Purpose**: Library ke kharche track karne ke liye

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each expense
  - **Example**: `h50e8400-e29b-41d4-a716-446655440013`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Expense kis branch ka hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `category` (UUID, Foreign Key → ExpenseCategory)
  - **Why**: Expense kis category mein hai
  - **Example**: `g50e8400-e29b-41d4-a716-446655440012`

- `amount` (Decimal, Precision: 10,2)
  - **Why**: Kitna paisa kharcha hua
  - **Example**: `15000.00`

- `description` (String)
  - **Why**: Expense ka detail description
  - **Example**: `"February month rent payment"`

- `expenseDate` (Date)
  - **Why**: Expense kis date ko hua
  - **Example**: `"2024-02-01"`

- `addedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne expense add kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Expense kab record hua
  - **Example**: `2024-02-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Expense record last kab modify hua
  - **Example**: `2024-02-01T10:00:00Z`

---

## 16. Attendance Entity

**Purpose**: Daily attendance tracking - kon aaya, kon nahi

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each attendance record
  - **Example**: `i50e8400-e29b-41d4-a716-446655440014`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Attendance kis student ka hai
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `date` (Date)
  - **Why**: Kis din ka attendance
  - **Example**: `"2024-02-15"`

- `inTime` (Time, Nullable)
  - **Why**: Student kitne baje aaya
  - **Example**: `"09:30:00"`

- `outTime` (Time, Nullable)
  - **Why**: Student kitne baje gaya
  - **Example**: `"17:00:00"`

- `markedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne attendance mark ki
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `status` (String, Default: 'present')
  - **Why**: Attendance status (present, absent, late)
  - **Example**: `"late"`

- `createdAt` (Timestamp)
  - **Why**: Attendance kab mark hui
  - **Example**: `2024-02-15T09:30:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Attendance record last kab update hua
  - **Example**: `2024-02-15T17:00:00Z`

---

## 17. Complaint Entity

**Purpose**: Students ki complaints - AC nahi chal raha, WiFi slow hai

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each complaint
  - **Example**: `j50e8400-e29b-41d4-a716-446655440015`

- `student` (UUID, Foreign Key → Student, Nullable)
  - **Why**: Complaint kis student ne ki (anonymous allowed)
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `title` (String)
  - **Why**: Complaint ka short title
  - **Example**: `"AC not cooling"`

- `description` (Text)
  - **Why**: Complaint ka detailed description
  - **Example**: `"The AC in Room A has not been cooling properly since yesterday. It's very hot."`

- `status` (String, Default: 'open')
  - **Why**: Complaint status (open, in-progress, resolved)
  - **Example**: `"in-progress"`

- `isAnonymous` (Boolean, Default: false)
  - **Why**: Anonymous complaint hai ya nahi
  - **Example**: `false`

- `createdAt` (Timestamp)
  - **Why**: Complaint kab raise hui
  - **Example**: `2024-02-15T14:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Complaint last kab update hui
  - **Example**: `2024-02-16T10:00:00Z`

- `resolvedAt` (Date, Nullable)
  - **Why**: Complaint kab resolve hui
  - **Example**: `"2024-02-16"`

- `resolvedBy` (UUID, Foreign Key → User, Nullable)
  - **Why**: Kisne complaint resolve ki
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

---

## 18. Waitlist Entity

**Purpose**: Jab seats full hain - waitlist management

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each waitlist entry
  - **Example**: `k50e8400-e29b-41d4-a716-446655440016`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Kis student ko seat chahiye
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `preferredShift` (UUID, Foreign Key → Shift, Nullable)
  - **Why**: Student ko kon sa shift chahiye
  - **Example**: `750e8400-e29b-41d4-a716-446655440002`

- `preferredSlots` (JSONB Array, Nullable)
  - **Why**: Flexible timings preferences
  - **Example**: `[{"start": "06:00", "end": "12:00"}]`

- `isActive` (Boolean, Default: true)
  - **Why**: Seat mil gayi to inactive ho jayega
  - **Example**: `true`

- `addedAt` (Timestamp)
  - **Why**: Waitlist mein kab add hua
  - **Example**: `2024-02-15T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Status last kab update hui
  - **Example**: `2024-02-16T11:00:00Z`

---

## 19. Blacklist Entity

**Purpose**: Troublemaker students ko block karne ke liye

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each blacklist entry
  - **Example**: `l50e8400-e29b-41d4-a716-446655440017`

- `phone` (String)
  - **Why**: Blacklisted person ka phone number
  - **Example**: `"+919876543210"`

- `name` (String, Nullable)
  - **Why**: Blacklisted person ka naam
  - **Example**: `"Ravi Kumar"`

- `reason` (String)
  - **Why**: Blacklist kyun kiya
  - **Example**: `"Repeated misbehavior and non-payment"`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Kis branch ne blacklist kiya
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `addedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne blacklist kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Blacklist kab hua
  - **Example**: `2024-02-10T15:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Record last kab update hua
  - **Example**: `2024-02-10T15:00:00Z`

---

## 20. Notice Entity

**Purpose**: General announcements - "Library Holi par band rahegi"

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each notice
  - **Example**: `m50e8400-e29b-41d4-a716-446655440018`

- `title` (String)
  - **Why**: Notice ka heading
  - **Example**: `"Holiday Notice"`

- `message` (Text)
  - **Why**: Notice ka detailed message
  - **Example**: `"The library will remain closed on 25th March due to Holi. Happy Holi!"`

- `validTill` (Date)
  - **Why**: Notice kab tak relevant hai
  - **Example**: `"2024-03-25"`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Notice kis branch ke liye hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `createdBy` (UUID, Foreign Key → User)
  - **Why**: Kisne notice create kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Notice kab create hua
  - **Example**: `2024-03-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Notice last kab update hua
  - **Example**: `2024-03-01T10:00:00Z`

---

## 21. AuditLog Entity

**Purpose**: Fraud detection - har important action ka log

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each audit log entry
  - **Example**: `n50e8400-e29b-41d4-a716-446655440019`

- `entity` (String)
  - **Why**: Kis entity mein action hua (Student, Payment, etc.)
  - **Example**: `"Payment"`

- `entityId` (String)
  - **Why**: Entity ka ID
  - **Example**: `"d50e8400-e29b-41d4-a716-446655440009"`

- `action` (String)
  - **Why**: Kya action hua (created, updated, deleted, fee_collected)
  - **Example**: `"deleted"`

- `oldValues` (JSONB)
  - **Why**: Change se pehle kya values thi
  - **Example**: `{"amount": 500, "status": "paid"}`

- `newValues` (JSONB)
  - **Why**: Change ke baad kya values hain
  - **Example**: `{"amount": 500, "status": "deleted"}`

- `performedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne action perform kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `ipAddress` (String)
  - **Why**: Action kis IP se hua (security tracking)
  - **Example**: `"192.168.1.100"`

- `timestamp` (Timestamp)
  - **Why**: Action kab hua (exact time)
  - **Example**: `2024-02-15T16:30:45Z`

---

## 22. Asset Entity

**Purpose**: Library ke assets - AC, fans, chairs ka inventory

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each asset
  - **Example**: `o50e8400-e29b-41d4-a716-446655440020`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Asset kis branch ka hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `name` (String)
  - **Why**: Asset ka naam
  - **Example**: `"AC"` or `"Fan"` or `"Projector"`

- `quantity` (Integer)
  - **Why**: Kitne units hain
  - **Example**: `2` (2 ACs)

- `purchaseDate` (Date, Nullable)
  - **Why**: Asset kab purchase kiya
  - **Example**: `"2023-12-01"`

- `status` (String, Default: 'working')
  - **Why**: Asset ki current condition
  - **Example**: `"working"`

- `createdAt` (Timestamp)
  - **Why**: Asset kab add hua inventory mein
  - **Example**: `2023-12-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Asset record last kab update hua
  - **Example**: `2024-01-15T14:00:00Z`

---

## 23. AssetMaintenanceLog Entity

**Purpose**: Asset maintenance tracking - AC service due, etc.

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each maintenance log
  - **Example**: `p50e8400-e29b-41d4-a716-446655440021`

- `asset` (UUID, Foreign Key → Asset)
  - **Why**: Kis asset ka maintenance hua
  - **Example**: `o50e8400-e29b-41d4-a716-446655440020`

- `remark` (String)
  - **Why**: Maintenance ka description
  - **Example**: `"AC gas refilled, deep cleaning done"`

- `nextDueDate` (Date)
  - **Why**: Next maintenance kab due hai
  - **Example**: `"2024-08-01"`

- `cost` (Decimal, Precision: 10,2)
  - **Why**: Maintenance mein kitna kharcha hua
  - **Example**: `1500.00`

- `servicedDate` (Date)
  - **Why**: Service kis date ko hui
  - **Example**: `"2024-02-01"`

- `servicedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne service arrange ki
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Log kab create hua
  - **Example**: `2024-02-01T15:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Log last kab update hua
  - **Example**: `2024-02-01T15:00:00Z`

---

## 24. SeatHistory Entity

**Purpose**: Security feature - pichle 6 mahine mein kaun kaun baitha

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each history record
  - **Example**: `q50e8400-e29b-41d4-a716-446655440022`

- `seat` (Integer, Foreign Key → Seat)
  - **Why**: Kis seat ka history
  - **Example**: `1` (Seat A-01)

- `student` (UUID, Foreign Key → Student)
  - **Why**: Kis student ne use kiya
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `shift` (UUID, Foreign Key → Shift, Nullable)
  - **Why**: Kon sa shift tha
  - **Example**: `750e8400-e29b-41d4-a716-446655440002`

- `occupiedFrom` (Date)
  - **Why**: Seat kab se occupied thi
  - **Example**: `"2024-02-01"`

- `occupiedTill` (Date)
  - **Why**: Seat kab tak occupied thi
  - **Example**: `"2024-03-01"`

- `reason` (String, Nullable)
  - **Why**: Seat kyun change hui (admission, shift_change, seat_change)
  - **Example**: `"admission"`

- `createdAt` (Timestamp)
  - **Why**: History record kab create hua
  - **Example**: `2024-02-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Record last kab modify hua
  - **Example**: `2024-02-01T10:00:00Z`

---

## 25. ShiftMigration Entity

**Purpose**: Shift change tracking - Morning se Evening

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each migration
  - **Example**: `r50e8400-e29b-41d4-a716-446655440023`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Kis student ne shift change ki
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `fromShift` (UUID, Foreign Key → Shift)
  - **Why**: Purani shift kya thi
  - **Example**: `750e8400-e29b-41d4-a716-446655440002` (Morning)

- `toShift` (UUID, Foreign Key → Shift)
  - **Why**: Nayi shift kya hai
  - **Example**: `850e8400-e29b-41d4-a716-446655440024` (Evening)

- `fromSeat` (Integer, Foreign Key → Seat, Nullable)
  - **Why**: Purani seat number
  - **Example**: `1` (Seat A-01)

- `toSeat` (Integer, Foreign Key → Seat, Nullable)
  - **Why**: Nayi seat number
  - **Example**: `15` (Seat B-15)

- `feeAdjustment` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Fee difference (positive = pay more, negative = refund)
  - **Example**: `200.00` (Evening shift is costlier)

- `processedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne migration process ki
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `migratedAt` (Timestamp)
  - **Why**: Migration kab hua
  - **Example**: `2024-02-15T11:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Record last kab update hua
  - **Example**: `2024-02-15T11:00:00Z`

---

## 26. IDCard Entity

**Purpose**: ID card generation log - QR code, PDF, print status

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each ID card
  - **Example**: `s50e8400-e29b-41d4-a716-446655440025`

- `student` (UUID, Foreign Key → Student)
  - **Why**: ID card kis student ka hai
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `cardNumber` (String)
  - **Why**: ID card ka unique number
  - **Example**: `"IDC-2024-001"`

- `qrCode` (String, Nullable)
  - **Why**: QR code data/URL (for scanning)
  - **Example**: `"https://api.qrserver.com/v1/create-qr-code/?data=LIB001"`

- `pdfUrl` (String, Nullable)
  - **Why**: Generated PDF ka URL/path
  - **Example**: `"https://s3.aws/idcards/LIB001.pdf"`

- `isPrinted` (Boolean, Default: false)
  - **Why**: Card print ho gaya ya nahi
  - **Example**: `true`

- `printedAt` (Date, Nullable)
  - **Why**: Card kab print hua
  - **Example**: `"2024-02-02"`

- `generatedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne card generate kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Card kab generate hua
  - **Example**: `2024-02-01T12:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Card record last kab update hua
  - **Example**: `2024-02-02T10:00:00Z`

---

## 27. WhatsAppMessage Entity

**Purpose**: WhatsApp communication log - fee reminder, receipt

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each message
  - **Example**: `t50e8400-e29b-41d4-a716-446655440026`

- `student` (UUID, Foreign Key → Student, Nullable)
  - **Why**: Message kis student ko bheja (notice ke liye null ho sakta hai)
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `phoneNumber` (String)
  - **Why**: Message kis number par bheja
  - **Example**: `"+919876543210"`

- `messageType` (String)
  - **Why**: Message ka type (welcome, fee_reminder, renewal_alert, receipt, notice)
  - **Example**: `"fee_reminder"`

- `messageContent` (Text)
  - **Why**: Actual message text
  - **Example**: `"Dear Amit, Your fee of Rs. 450 is due on 20th Feb. Please pay soon."`

- `status` (String, Default: 'pending')
  - **Why**: Message send hua ya nahi (pending, sent, failed, delivered)
  - **Example**: `"sent"`

- `externalMessageId` (String, Nullable)
  - **Why**: WhatsApp API ka message ID
  - **Example**: `"wamid.HBgNOTE1NDkxNzAyNTk1FRUCABABGA"`

- `errorMessage` (String, Nullable)
  - **Why**: Agar fail hua to error message
  - **Example**: `"Invalid phone number"`

- `sentAt` (Timestamp)
  - **Why**: Message kab bheja gaya
  - **Example**: `2024-02-15T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Status last kab update hui
  - **Example**: `2024-02-15T10:00:05Z`

---

## 28. SecurityDeposit Entity

**Purpose**: Refundable security deposit management

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each deposit
  - **Example**: `u50e8400-e29b-41d4-a716-446655440027`

- `student` (UUID, Foreign Key → Student)
  - **Why**: Deposit kis student ka hai
  - **Example**: `a50e8400-e29b-41d4-a716-446655440005`

- `amount` (Decimal, Precision: 10,2)
  - **Why**: Deposit amount
  - **Example**: `500.00`

- `status` (String, Default: 'held')
  - **Why**: Deposit status (held, refunded, forfeited)
  - **Example**: `"held"`

- `refundDate` (Date, Nullable)
  - **Why**: Deposit kab refund hua
  - **Example**: `"2024-06-30"`

- `deductionAmount` (Decimal, Precision: 10,2, Default: 0)
  - **Why**: Kitna amount deduct hua (damages, etc.)
  - **Example**: `100.00`

- `deductionReason` (String, Nullable)
  - **Why**: Deduction kyun kiya
  - **Example**: `"Damaged locker lock"`

- `collectedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne deposit collect kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `refundedBy` (UUID, Foreign Key → User, Nullable)
  - **Why**: Kisne refund kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Deposit kab collect hua
  - **Example**: `2024-02-01T10:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Record last kab update hua
  - **Example**: `2024-06-30T14:00:00Z`

---

## 29. DailySettlement Entity

**Purpose**: End of day report - total collection aur profit

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each settlement
  - **Example**: `v50e8400-e29b-41d4-a716-446655440028`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Settlement kis branch ka hai
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `settlementDate` (Date)
  - **Why**: Kis date ka settlement
  - **Example**: `"2024-02-15"`

- `totalCashCollected` (Decimal, Precision: 10,2)
  - **Why**: Total cash collection
  - **Example**: `5000.00`

- `totalUPICollected` (Decimal, Precision: 10,2)
  - **Why**: Total UPI collection
  - **Example**: `3000.00`

- `totalCardCollected` (Decimal, Precision: 10,2)
  - **Why**: Total card payment collection
  - **Example**: `2000.00`

- `totalExpenses` (Decimal, Precision: 10,2)
  - **Why**: Din ke total expenses
  - **Example**: `1500.00`

- `netProfit` (Decimal, Precision: 10,2)
  - **Why**: Net profit (Total collection - expenses)
  - **Example**: `8500.00`

- `closedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne day close kiya
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `createdAt` (Timestamp)
  - **Why**: Settlement kab create hui
  - **Example**: `2024-02-15T23:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Settlement last kab update hui
  - **Example**: `2024-02-15T23:00:00Z`

---

## 30. BulkImport Entity

**Purpose**: Excel upload tracking - bulk data import

### Fields:

- `id` (UUID, Primary Key)
  - **Why**: Unique identifier for each bulk import
  - **Example**: `w50e8400-e29b-41d4-a716-446655440029`

- `branch` (UUID, Foreign Key → Branch)
  - **Why**: Import kis branch ke liye hua
  - **Example**: `550e8400-e29b-41d4-a716-446655440000`

- `entityType` (String)
  - **Why**: Kis entity ka import hua (student, seat, locker, etc.)
  - **Example**: `"student"`

- `fileName` (String)
  - **Why**: Uploaded file ka naam
  - **Example**: `"students_data_feb2024.xlsx"`

- `totalRows` (Integer)
  - **Why**: Total kitni rows thi file mein
  - **Example**: `100`

- `successCount` (Integer)
  - **Why**: Kitni rows successfully import hui
  - **Example**: `95`

- `failureCount` (Integer)
  - **Why**: Kitni rows fail hui
  - **Example**: `5`

- `errors` (JSONB Array, Default: [])
  - **Why**: Detailed error log (row number + error message)
  - **Example**: `[{"row": 5, "error": "Mobile number missing"}, {"row": 12, "error": "Invalid email format"}]`

- `uploadedBy` (UUID, Foreign Key → User)
  - **Why**: Kisne file upload ki
  - **Example**: `650e8400-e29b-41d4-a716-446655440001`

- `uploadedAt` (Timestamp)
  - **Why**: File kab upload hui
  - **Example**: `2024-02-01T15:00:00Z`

- `updatedAt` (Timestamp)
  - **Why**: Import process last kab update hua
  - **Example**: `2024-02-01T15:05:00Z`

---

## ✅ Summary

**Total Entities**: 30  
**Total Fields Documented**: 200+  
**All Fields Have**: Type, Purpose, Real Examples  
**Status**: 100% Complete ✅

---

**Remember**: 
- UUID fields are scalable and globally unique
- JSONB fields provide flexibility for complex data
- Timestamps help in audit trails
- Foreign keys maintain referential integrity
- Status fields enable soft deletes and state management

**Production Ready!** 🚀


