# 🔗 Smart Library 360 - Complete Database Relationships Documentation

**TypeORM Models | Entity Relationships | Business Logic Explained**

This document details **all relationships** between 30 database entities with:
- **Relationship Type** (1:1, 1:N, N:1, N:M)
- **Field Definitions**
- **Real-world Examples**
- **Business Logic Rationale**

---

## Table of Contents
1. [Branch Entity](#1-branch-entity)
2. [User Entity](#2-user-entity)
3. [Shift Entity](#3-shift-entity)
4. [Seat Entity](#4-seat-entity)
5. [Locker Entity](#5-locker-entity)
6. [Plan Entity](#6-plan-entity)
7. [Coupon Entity](#7-coupon-entity)
8. [Student Entity](#8-student-entity)
9. [StudentSlot Entity](#9-studentslot-entity)
10. [Subscription Entity](#10-subscription-entity)
11. [Payment Entity](#11-payment-entity)
12. [PaymentPromise Entity](#12-paymentpromise-entity)
13. [Enquiry Entity](#13-enquiry-entity)
14. [ExpenseCategory Entity](#14-expensecategory-entity)
15. [Expense Entity](#15-expense-entity)
16. [Attendance Entity](#16-attendance-entity)
17. [Complaint Entity](#17-complaint-entity)
18. [Waitlist Entity](#18-waitlist-entity)
19. [Blacklist Entity](#19-blacklist-entity)
20. [Notice Entity](#20-notice-entity)
21. [AuditLog Entity](#21-auditlog-entity)
22. [Asset Entity](#22-asset-entity)
23. [AssetMaintenanceLog Entity](#23-assetmaintenancelog-entity)
24. [SeatHistory Entity](#24-seathistory-entity)
25. [ShiftMigration Entity](#25-shiftmigration-entity)
26. [IDCard Entity](#26-idcard-entity)
27. [WhatsAppMessage Entity](#27-whatsappmessage-entity)
28. [SecurityDeposit Entity](#28-securitydeposit-entity)
29. [DailySettlement Entity](#29-dailysettlement-entity)
30. [BulkImport Entity](#30-bulkimport-entity)

---

## 1. Branch Entity

**Purpose:** Library ke branches ko manage karta hai - Multi-location support ke liye

### Relationships:

**1. `Branch` ↔ `User` (users) - 1:N Relationship**
- **Field:** `@OneToMany(() => User, user => user.branch)`
- **Meaning:** Ek branch mein multiple users (staff, managers) kaam kar sakte hain
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  User 1: Rahul (Manager, branch_id: 550e8400)
  User 2: Priya (Staff, branch_id: 550e8400)
  User 3: Amit (Receptionist, branch_id: 550e8400)
  ```
- **Why This Design:** Multi-branch businesses ke liye staff ko branch-wise organize karna

**2. `Branch` ↔ `Shift` (shifts) - 1:N Relationship**
- **Field:** `@OneToMany(() => Shift, shift => shift.branch)`
- **Meaning:** Har branch ke apne time slots ho sakte hain
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Shift 1: Morning (6AM-12PM, branch_id: 550e8400)
  Shift 2: Evening (12PM-6PM, branch_id: 550e8400)
  Shift 3: Night (6PM-12AM, branch_id: 550e8400)
  ```
- **Why This Design:** Different branches ke different operating hours ho sakte hain

**3. `Branch` ↔ `Seat` (seats) - 1:N Relationship**
- **Field:** `@OneToMany(() => Seat, seat => seat.branch)`
- **Meaning:** Har branch mein multiple seats hain
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Seat 1: A-01 (branch_id: 550e8400)
  Seat 2: A-02 (branch_id: 550e8400)
  ...
  Seat 50: E-10 (branch_id: 550e8400)
  ```
- **Why This Design:** Branch capacity ko dynamically manage karne ke liye

**4. `Branch` ↔ `Locker` (lockers) - 1:N Relationship**
- **Field:** `@OneToMany(() => Locker, locker => locker.branch)`
- **Meaning:** Har branch ke apne lockers hain
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Locker 1: L-01 (branch_id: 550e8400)
  Locker 2: L-02 (branch_id: 550e8400)
  ...
  Locker 20: L-20 (branch_id: 550e8400)
  ```
- **Why This Design:** Branch-wise locker inventory management

**5. `Branch` ↔ `Student` (students) - 1:N Relationship**
- **Field:** `@OneToMany(() => Student, student => student.branch)`
- **Meaning:** Har branch ke apne students hain
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Student 1: Amit Kumar (LIB001, branch_id: 550e8400)
  Student 2: Priya Sharma (LIB002, branch_id: 550e8400)
  ...
  Student 150: Rahul Singh (LIB150, branch_id: 550e8400)
  ```
- **Why This Design:** Multi-branch business mein student data segregate karne ke liye

---

## 2. User Entity

**Purpose:** Staff aur admin ka data - Role-based access control

### Relationships:

**1. `User` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch, branch => branch.users)`
- **Meaning:** Har user ek specific branch se belong karta hai
- **Real Example:**
  ```
  User: Rahul Kumar (ID: 650e8400, Role: Manager)
  Branch: Smart Library - CP (ID: 550e8400)
  Assignment: Rahul manages CP branch
  ```
- **Why This Design:** User ko specific branch tak limit karne ke liye (security + data isolation)

**2. `User` ↔ Multiple Entities (Foreign Key References) - 1:N Relationships**
- **Entities:** Payment, Enquiry, Expense, Attendance, Complaint, Blacklist, Notice, AuditLog, AssetMaintenanceLog, ShiftMigration, IDCard, SecurityDeposit, DailySettlement, BulkImport
- **Meaning:** User (staff) performs various actions across the system
- **Real Example:**
  ```
  User: Priya (ID: 650e8400, Role: Staff)
  Actions performed:
  - Collected 5 payments today
  - Marked 20 attendance entries
  - Created 2 expenses
  - Resolved 1 complaint
  ```
- **Why This Design:** Audit trail - har action ko user se link karna (fraud detection)

---

## 3. Shift Entity

**Purpose:** Library ke time slots define karta hai - Morning, Evening, Night

### Relationships:

**1. `Shift` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Har shift ek branch ka part hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Shift: Morning Shift (6AM-12PM, branch_id: 550e8400)
  ```
- **Why This Design:** Different branches ke different shift timings allow karne ke liye

**2. `Shift` ↔ `StudentSlot` - 1:N Relationship**
- **Field:** Referenced by `StudentSlot.shift`
- **Meaning:** Ek shift mein multiple students assign ho sakte hain
- **Real Example:**
  ```
  Shift: Morning (6AM-12PM, ID: 750e8400)
  Student 1: Amit (Seat A-01, shift_id: 750e8400)
  Student 2: Priya (Seat A-02, shift_id: 750e8400)
  Student 3: Rahul (Seat B-05, shift_id: 750e8400)
  ```
- **Why This Design:** Time-based seat allocation management

**3. `Shift` ↔ `Waitlist` - 1:N Relationship**
- **Field:** Referenced by `Waitlist.preferredShift`
- **Meaning:** Students waitlist mein specific shift prefer kar sakte hain
- **Real Example:**
  ```
  Shift: Evening (12PM-6PM, ID: 850e8400)
  Waitlist Entry 1: Ravi wants Evening shift
  Waitlist Entry 2: Neha wants Evening shift
  ```
- **Why This Design:** Seat availability notification ko shift-wise target karna

---

## 4. Seat Entity

**Purpose:** Library ke har seat ka record - A-01, B-12 jaise numbers

### Relationships:

**1. `Seat` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Har seat ek branch ka part hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Seat: A-01 (ID: 1, branch_id: 550e8400)
  ```
- **Why This Design:** Branch-wise seat inventory management

**2. `Seat` ↔ `StudentSlot` - 1:N Relationship**
- **Field:** Referenced by `StudentSlot.seat`
- **Meaning:** Ek seat ko different time slots mein different students assign ho sakte hain
- **Real Example:**
  ```
  Seat: A-01 (ID: 1)
  Morning Slot: Amit (6AM-12PM)
  Evening Slot: Priya (12PM-6PM)
  Night Slot: Available
  ```
- **Why This Design:** Maximum seat utilization - ek hi seat ko multiple shifts mein use karna

**3. `Seat` ↔ `SeatHistory` - 1:N Relationship**
- **Field:** Referenced by `SeatHistory.seat`
- **Meaning:** Har seat ka complete occupancy history track hota hai
- **Real Example:**
  ```
  Seat: A-01 (ID: 1)
  History:
  - Feb 1-28: Amit Kumar
  - Mar 1-31: Priya Sharma
  - Apr 1-15: Rahul Singh
  ```
- **Why This Design:** Security purposes - kaun kaun baitha tha kis seat par

---

## 5. Locker Entity

**Purpose:** Students ke liye locker facility

### Relationships:

**1. `Locker` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Har locker ek branch ka part hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Locker: L-05 (ID: 5, branch_id: 550e8400)
  ```
- **Why This Design:** Branch-wise locker inventory

**2. `Locker` ↔ `StudentSlot` - 1:N Relationship**
- **Field:** Referenced by `StudentSlot.locker`
- **Meaning:** Locker students ko assign hota hai
- **Real Example:**
  ```
  Locker: L-05 (ID: 5)
  Assigned to: Amit Kumar (Student ID: a50e8400)
  Duration: Feb 1 - Mar 1
  ```
- **Why This Design:** Locker assignment ko subscription period se link karna

---

## 6. Plan Entity

**Purpose:** Fee plans define karta hai - Monthly, Quarterly, etc.

### Relationships:

**1. `Plan` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Har plan ek branch ka part hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Plan 1: Monthly Basic - ₹1000 (branch_id: 550e8400)
  Plan 2: Quarterly Premium - ₹2800 (branch_id: 550e8400)
  ```
- **Why This Design:** Different branches ke different pricing allow karna

**2. `Plan` ↔ `Subscription` - 1:N Relationship**
- **Field:** Referenced by `Subscription.plan`
- **Meaning:** Ek plan se multiple subscriptions create ho sakte hain
- **Real Example:**
  ```
  Plan: Monthly Basic - ₹1000 (ID: 850e8400)
  Subscriptions:
  - Amit's Feb subscription
  - Priya's Feb subscription
  - Rahul's Mar subscription
  ```
- **Why This Design:** Plan changes ko centralize karna - plan update hone par pricing automatically reflect ho

---

## 7. Coupon Entity

**Purpose:** Discount coupons manage karta hai

### Relationships:

**1. `Coupon` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Coupon specific branch ke liye valid hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Coupon: NEWYEAR50 - ₹50 off (branch_id: 550e8400)
  ```
- **Why This Design:** Branch-specific promotions run karne ke liye

**2. `Coupon` ↔ `Subscription` - 1:N Relationship**
- **Field:** Referenced by `Subscription.couponUsed`
- **Meaning:** Ek coupon multiple subscriptions mein use ho sakta hai
- **Real Example:**
  ```
  Coupon: NEWYEAR50 (ID: 950e8400, Max Uses: 100)
  Used by:
  - Amit's subscription (₹50 discount)
  - Priya's subscription (₹50 discount)
  - Rahul's subscription (₹50 discount)
  Total uses: 3/100
  ```
- **Why This Design:** Coupon usage tracking aur ROI calculation ke liye

---

## 8. Student Entity (THE KING ENTITY)

**Purpose:** Sabse main table - students ki complete details

### Relationships:

**1. `Student` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Har student ek branch se belong karta hai
- **Real Example:**
  ```
  Student: Amit Kumar (LIB001)
  Branch: Smart Library - CP (ID: 550e8400)
  ```
- **Why This Design:** Multi-branch student management

**2. `Student` ↔ `Student` (referredBy, referrals) - N:1 + 1:N Self-Referencing**
- **Field:** `@ManyToOne(() => Student)` + `@OneToMany(() => Student, student => student.referredBy)`
- **Meaning:** Students ek dusre ko refer kar sakte hain (referral chain)
- **Real Example:**
  ```
  Student: Amit Kumar (LIB001)
  Referred Students:
  - Priya Sharma (LIB015) → Amit gets ₹200 bonus
  - Rahul Singh (LIB032) → Amit gets ₹200 bonus
  Total Referral Balance: ₹400
  ```
- **Why This Design:** Viral marketing - students ko incentivize karna naaye students laane ke liye

**3. `Student` ↔ `StudentSlot` (slots) - 1:N Relationship**
- **Field:** `@OneToMany(() => StudentSlot, slot => slot.student)`
- **Meaning:** Ek student ke multiple time slots ho sakte hain
- **Real Example:**
  ```
  Student: Amit Kumar (LIB001)
  Slots:
  - Morning: 8AM-10AM (Seat A-01)
  - Evening: 5PM-8PM (Seat B-15)
  ```
- **Why This Design:** Hybrid schedules support - college + library dono manage karna

**4. `Student` ↔ `Subscription` (subscriptions) - 1:N Relationship**
- **Field:** `@OneToMany(() => Subscription, subscription => subscription.student)`
- **Meaning:** Student ke multiple subscriptions (renewals) track hote hain
- **Real Example:**
  ```
  Student: Amit Kumar (LIB001)
  Subscription History:
  - Feb 2024: Monthly Plan (Paid)
  - Mar 2024: Monthly Plan (Paid)
  - Apr 2024: Quarterly Plan (Active)
  ```
- **Why This Design:** Subscription history aur renewal tracking

**5. `Student` ↔ Multiple Entities - 1:N Relationships**
- **Entities:** Payment, PaymentPromise, Enquiry (convertedToStudent), Attendance, Complaint, Waitlist, SeatHistory, ShiftMigration, IDCard, WhatsAppMessage, SecurityDeposit
- **Meaning:** Student se related sab kuch centrally linked hai
- **Real Example:**
  ```
  Student: Amit Kumar (LIB001)
  Related Records:
  - 12 Payments
  - 2 Payment Promises
  - 45 Attendance entries
  - 1 Complaint
  - 1 ID Card
  - 15 WhatsApp messages
  - ₹500 Security Deposit
  ```
- **Why This Design:** Student ka complete 360° view - sab data ek jagah

---

## 9. StudentSlot Entity

**Purpose:** Student ko seat aur shift assign karta hai - Multi-slot support

### Relationships:

**1. `StudentSlot` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student, student => student.slots, { onDelete: 'CASCADE' })`
- **Meaning:** Har slot ek student ka hai (CASCADE: student delete hone par slots bhi delete)
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Slot: Morning 8-10AM, Seat A-01 (student_id: a50e8400)
  ```
- **Why This Design:** Student exit karne par automatically sab slots free ho jaayein

**2. `StudentSlot` ↔ `Shift` (shift) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Shift)`
- **Meaning:** Slot ek predefined shift use kar sakta hai (optional)
- **Real Example:**
  ```
  Shift: Morning (6AM-12PM, ID: 750e8400)
  Slot: Amit's morning slot (shift_id: 750e8400)
  ```
- **Why This Design:** Fixed shifts ko reuse karna - custom timing nahi chahiye to

**3. `StudentSlot` ↔ `Seat` (seat) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Seat)`
- **Meaning:** Slot ko ek seat assign hoti hai
- **Real Example:**
  ```
  Seat: A-01 (ID: 1)
  Slot: Amit's slot (seat_id: 1, time: 8-10AM)
  ```
- **Why This Design:** Seat tracking - kon kis seat par baitha hai

**4. `StudentSlot` ↔ `Locker` (locker) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Locker)`
- **Meaning:** Student ko locker assign ho sakta hai (optional)
- **Real Example:**
  ```
  Locker: L-05 (ID: 5)
  Slot: Amit's slot (locker_id: 5, extra fee: ₹200)
  ```
- **Why This Design:** Locker ko subscription se link karna

---

## 10. Subscription Entity

**Purpose:** Student ka subscription track karta hai - fees, payments, etc.

### Relationships:

**1. `Subscription` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student, student => student.subscriptions)`
- **Meaning:** Har subscription ek student ka hai
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Subscription: Feb 2024 - Monthly Plan (student_id: a50e8400)
  ```
- **Why This Design:** Student ki subscription history track karna

**2. `Subscription` ↔ `Plan` (plan) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Plan)`
- **Meaning:** Subscription ek plan follow karta hai
- **Real Example:**
  ```
  Plan: Monthly Basic - ₹1000 (ID: 850e8400)
  Subscription: Amit ka Feb subscription (plan_id: 850e8400)
  ```
- **Why This Design:** Pricing consistency - plan ka price automatically apply ho

**3. `Subscription` ↔ `Coupon` (couponUsed) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Coupon)`
- **Meaning:** Subscription mein coupon apply ho sakta hai
- **Real Example:**
  ```
  Coupon: NEWYEAR50 - ₹50 off (ID: 950e8400)
  Subscription: Amit's Feb sub (Base: ₹1000, After discount: ₹950)
  ```
- **Why This Design:** Discount tracking aur coupon ROI calculation

**4. `Subscription` ↔ `Payment` - 1:N Relationship**
- **Field:** Referenced by `Payment.subscription`
- **Meaning:** Ek subscription ke multiple payments ho sakte hain (partial payments)
- **Real Example:**
  ```
  Subscription: Amit's Feb (Total: ₹1000)
  Payments:
  - Feb 1: ₹500 (partial)
  - Feb 15: ₹500 (complete)
  Total Paid: ₹1000, Due: ₹0
  ```
- **Why This Design:** Partial payment support - installments allow karna

---

## 11. Payment Entity

**Purpose:** Har payment ka record - cash, UPI, card

### Relationships:

**1. `Payment` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Payment student ne kiya hai
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Payment: ₹500 via UPI (student_id: a50e8400)
  ```
- **Why This Design:** Student ki complete payment history

**2. `Payment` ↔ `Subscription` (subscription) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Subscription)`
- **Meaning:** Payment kis subscription ke against hai
- **Real Example:**
  ```
  Subscription: Amit's Feb sub (ID: c50e8400)
  Payment: ₹500 (subscription_id: c50e8400)
  ```
- **Why This Design:** Payment ko subscription se link karna - due amount calculate karne ke liye

**3. `Payment` ↔ `User` (receivedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne payment collect ki (staff tracking)
- **Real Example:**
  ```
  User: Priya (Staff, ID: 650e8400)
  Payment: ₹500 collected by Priya (receivedBy_id: 650e8400)
  ```
- **Why This Design:** Staff accountability - kon kitna collection kar raha hai

---

## 12. PaymentPromise Entity

**Purpose:** "20th ko dunga" - promise tracking for trust score

### Relationships:

**1. `PaymentPromise` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Student ne promise kiya hai payment ka
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Promise: ₹450 by 20th Feb (student_id: a50e8400)
  Times Changed: 2 (trust score decreasing)
  ```
- **Why This Design:** Student ki reliability track karna - kitni baar promise toda

---

## 13. Enquiry Entity

**Purpose:** Lead management - jo log sirf poochne aate hain

### Relationships:

**1. `Enquiry` ↔ `User` (handledBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kis staff ne enquiry handle ki
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Enquiry: Priya Sharma's enquiry (handledBy_id: 650e8400)
  ```
- **Why This Design:** Staff performance tracking - kitne leads convert hue

**2. `Enquiry` ↔ `Student` (convertedToStudent) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Enquiry convert hone par student ID link hota hai
- **Real Example:**
  ```
  Enquiry: Priya Sharma (Created: Feb 1)
  Converted to: Student LIB002 (Feb 5)
  Conversion Rate: 100%
  ```
- **Why This Design:** Lead to customer conversion tracking

---

## 14. ExpenseCategory Entity

**Purpose:** Expense categories define karta hai

### Relationships:

**1. `ExpenseCategory` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Category branch-specific hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Categories: Rent, Electricity, Salaries, Maintenance
  ```
- **Why This Design:** Branch-wise expense categorization

**2. `ExpenseCategory` ↔ `Expense` - 1:N Relationship**
- **Field:** Referenced by `Expense.category`
- **Meaning:** Ek category ke multiple expenses ho sakte hain
- **Real Example:**
  ```
  Category: Rent (ID: g50e8400)
  Expenses:
  - Jan: ₹15,000
  - Feb: ₹15,000
  - Mar: ₹15,000
  ```
- **Why This Design:** Category-wise expense reporting

---

## 15. Expense Entity

**Purpose:** Library ke kharche track karna

### Relationships:

**1. `Expense` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Expense kis branch ka hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Expense: Feb Rent - ₹15,000 (branch_id: 550e8400)
  ```
- **Why This Design:** Branch-wise P&L calculation

**2. `Expense` ↔ `ExpenseCategory` (category) - N:1 Relationship**
- **Field:** `@ManyToOne(() => ExpenseCategory)`
- **Meaning:** Expense kis category mein hai
- **Real Example:**
  ```
  Category: Rent (ID: g50e8400)
  Expense: Feb Rent - ₹15,000 (category_id: g50e8400)
  ```
- **Why This Design:** Category-wise breakdown for analysis

**3. `Expense` ↔ `User` (addedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne expense add kiya
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Expense: Feb Rent (addedBy_id: 650e8400)
  ```
- **Why This Design:** Audit trail - expense entry accountability

---

## 16. Attendance Entity

**Purpose:** Daily attendance tracking

### Relationships:

**1. `Attendance` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Attendance kis student ka hai
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Attendance: Feb 15, 2024 - Present, In: 9:30AM, Out: 5:00PM
  ```
- **Why This Design:** Student-wise attendance history

**2. `Attendance` ↔ `User` (markedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne attendance mark ki
- **Real Example:**
  ```
  User: Priya (Staff, ID: 650e8400)
  Attendance: Amit's attendance marked by Priya
  ```
- **Why This Design:** Staff accountability - galat entry ki responsibility

---

## 17. Complaint Entity

**Purpose:** Students ki complaints track karna

### Relationships:

**1. `Complaint` ↔ `Student` (student) - N:1 Relationship (Nullable)**
- **Field:** `@ManyToOne(() => Student, { nullable: true })`
- **Meaning:** Complaint kis student ne ki (anonymous allowed, isliye nullable)
- **Real Example:**
  ```
  Anonymous Complaint: "AC not working" (student_id: null)
  Named Complaint: "WiFi slow" by Amit (student_id: a50e8400)
  ```
- **Why This Design:** Anonymous complaints allow karna - students ko freedom dena

**2. `Complaint` ↔ `User` (resolvedBy) - N:1 Relationship (Nullable)**
- **Field:** `@ManyToOne(() => User, { nullable: true })`
- **Meaning:** Kisne complaint resolve ki
- **Real Example:**
  ```
  Complaint: "AC not working" (Created: Feb 15)
  Resolved by: Rahul (Manager) on Feb 16
  ```
- **Why This Design:** Resolution tracking aur staff performance

---

## 18. Waitlist Entity

**Purpose:** Jab seats full hain - waitlist management

### Relationships:

**1. `Waitlist` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Kis student ko seat chahiye
- **Real Example:**
  ```
  Student: Neha Gupta (ID: a50e8400)
  Waitlist: Morning shift preferred, added on Feb 15
  ```
- **Why This Design:** Student ko auto-notify karna jab seat available ho

**2. `Waitlist` ↔ `Shift` (preferredShift) - N:1 Relationship (Nullable)**
- **Field:** `@ManyToOne(() => Shift, { nullable: true })`
- **Meaning:** Student ko kon sa shift chahiye
- **Real Example:**
  ```
  Shift: Morning (6AM-12PM, ID: 750e8400)
  Waitlist: Neha wants morning shift specifically
  ```
- **Why This Design:** Shift-specific notification - relevant students ko hi notify karo

---

## 19. Blacklist Entity

**Purpose:** Troublemaker students ko block karna

### Relationships:

**1. `Blacklist` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Blacklist entry kis branch ki hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Blacklist: +919876543210 (Ravi Kumar - non-payment)
  ```
- **Why This Design:** Branch-specific blacklist - ek branch se ban, doosre mein allow

**2. `Blacklist` ↔ `User` (addedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne blacklist kiya
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Blacklist Entry: Ravi Kumar (addedBy_id: 650e8400)
  ```
- **Why This Design:** Accountability - galat blacklist ki responsibility

---

## 20. Notice Entity

**Purpose:** General announcements - "Holi par band"

### Relationships:

**1. `Notice` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Notice kis branch ke liye hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Notice: "Library closed on 25th March - Holi"
  ```
- **Why This Design:** Branch-specific announcements

**2. `Notice` ↔ `User` (createdBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne notice create kiya
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Notice: Holi holiday notice (createdBy_id: 650e8400)
  ```
- **Why This Design:** Notice creation tracking

---

## 21. AuditLog Entity

**Purpose:** Fraud detection - har important action ka log

### Relationships:

**1. `AuditLog` ↔ `User` (performedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne action perform kiya
- **Real Example:**
  ```
  User: Priya (Staff, ID: 650e8400)
  Audit Log: Deleted payment #123 at 4:30 PM
  Old Values: {amount: 500, status: "paid"}
  New Values: {isDeleted: true}
  ```
- **Why This Design:** Fraud detection - kisne kya kiya track karo

**2. `AuditLog` → Multiple Entities (Generic Reference)**
- **Fields:** `entity` (string), `entityId` (string)
- **Meaning:** Kisi bhi entity ka action log ho sakta hai
- **Real Example:**
  ```
  Entity: "Payment", EntityID: "d50e8400"
  Action: "deleted"
  Performed By: Priya (Staff)
  ```
- **Why This Design:** Flexible audit logging - sab entities track karo

---

## 22. Asset Entity

**Purpose:** Library ke assets - AC, fans, chairs

### Relationships:

**1. `Asset` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Asset kis branch ka hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Asset: AC (Quantity: 2, branch_id: 550e8400)
  ```
- **Why This Design:** Branch-wise asset inventory

**2. `Asset` ↔ `AssetMaintenanceLog` - 1:N Relationship**
- **Field:** Referenced by `AssetMaintenanceLog.asset`
- **Meaning:** Ek asset ke multiple maintenance records ho sakte hain
- **Real Example:**
  ```
  Asset: AC (ID: o50e8400)
  Maintenance Logs:
  - Dec 2023: Gas refill - ₹1500
  - Jun 2024: Annual service - ₹2000
  - Next Due: Dec 2024
  ```
- **Why This Design:** Asset maintenance history aur scheduling

---

## 23. AssetMaintenanceLog Entity

**Purpose:** Asset maintenance tracking

### Relationships:

**1. `AssetMaintenanceLog` ↔ `Asset` (asset) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Asset)`
- **Meaning:** Log kis asset ka hai
- **Real Example:**
  ```
  Asset: AC (ID: o50e8400)
  Maintenance: Gas refill on Feb 1, Cost: ₹1500
  ```
- **Why This Design:** Asset-wise maintenance grouping

**2. `AssetMaintenanceLog` ↔ `User` (servicedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne maintenance arrange ki
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Maintenance: AC service (servicedBy_id: 650e8400)
  ```
- **Why This Design:** Maintenance responsibility tracking

---

## 24. SeatHistory Entity

**Purpose:** Security feature - pichle 6 mahine mein kaun baitha

### Relationships:

**1. `SeatHistory` ↔ `Seat` (seat) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Seat)`
- **Meaning:** History kis seat ki hai
- **Real Example:**
  ```
  Seat: A-01 (ID: 1)
  History: Feb 1-28, 2024 occupied by Amit Kumar
  ```
- **Why This Design:** Seat-wise historical tracking

**2. `SeatHistory` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Kis student ne seat occupy ki thi
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Seat History: Occupied A-01 from Feb 1-28
  ```
- **Why This Design:** Student ka seating history

**3. `SeatHistory` ↔ `Shift` (shift) - N:1 Relationship (Nullable)**
- **Field:** `@ManyToOne(() => Shift, { nullable: true })`
- **Meaning:** Kon sa shift tha
- **Real Example:**
  ```
  Shift: Morning (6AM-12PM, ID: 750e8400)
  History: Amit occupied A-01 in morning shift
  ```
- **Why This Design:** Time-specific seat tracking

---

## 25. ShiftMigration Entity

**Purpose:** Shift change tracking - Morning se Evening

### Relationships:

**1. `ShiftMigration` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Kis student ne shift change ki
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Migration: Morning → Evening on Feb 15
  ```
- **Why This Design:** Student ki shift change history

**2. `ShiftMigration` ↔ `Shift` (fromShift, toShift) - N:1 Relationships**
- **Fields:** `@ManyToOne(() => Shift)` (2 fields)
- **Meaning:** Purani aur nayi shift kya hai
- **Real Example:**
  ```
  From: Morning (6AM-12PM, ID: 750e8400)
  To: Evening (12PM-6PM, ID: 850e8400)
  Fee Adjustment: +₹200 (evening costlier)
  ```
- **Why This Design:** Shift pricing difference calculate karna

**3. `ShiftMigration` ↔ `Seat` (fromSeat, toSeat) - N:1 Relationships (Nullable)**
- **Fields:** `@ManyToOne(() => Seat)` (2 fields)
- **Meaning:** Purani aur nayi seat kya hai
- **Real Example:**
  ```
  From Seat: A-01 (ID: 1)
  To Seat: B-15 (ID: 15)
  ```
- **Why This Design:** Seat change bhi track karna

**4. `ShiftMigration` ↔ `User` (processedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne migration process ki
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Migration: Processed Amit's shift change
  ```
- **Why This Design:** Staff accountability

---

## 26. IDCard Entity

**Purpose:** ID card generation log

### Relationships:

**1. `IDCard` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** ID card kis student ka hai
- **Real Example:**
  ```
  Student: Amit Kumar (LIB001, ID: a50e8400)
  ID Card: IDC-2024-001, QR Code, PDF generated
  ```
- **Why This Design:** Student को ID card issue tracking

**2. `IDCard` ↔ `User` (generatedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne card generate kiya
- **Real Example:**
  ```
  User: Priya (Staff, ID: 650e8400)
  ID Card: Generated for Amit (generatedBy_id: 650e8400)
  ```
- **Why This Design:** Generation tracking

---

## 27. WhatsAppMessage Entity

**Purpose:** WhatsApp communication log

### Relationships:

**1. `WhatsAppMessage` ↔ `Student` (student) - N:1 Relationship (Nullable)**
- **Field:** `@ManyToOne(() => Student, { nullable: true })`
- **Meaning:** Message kis student ko bheja (notice ke liye null)
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Message: "Your fee of ₹450 is due on 20th Feb"
  Status: Sent
  ```
- **Why This Design:** Student-wise message history

---

## 28. SecurityDeposit Entity

**Purpose:** Refundable security deposit management

### Relationships:

**1. `SecurityDeposit` ↔ `Student` (student) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Student)`
- **Meaning:** Deposit kis student ka hai
- **Real Example:**
  ```
  Student: Amit Kumar (ID: a50e8400)
  Deposit: ₹500 (Status: Held)
  ```
- **Why This Design:** Student ka deposit track karna

**2. `SecurityDeposit` ↔ `User` (collectedBy, refundedBy) - N:1 Relationships**
- **Fields:** `@ManyToOne(() => User)` (2 fields)
- **Meaning:** Kisne collect kiya aur kisne refund kiya
- **Real Example:**
  ```
  Collected By: Priya (Staff, Feb 1)
  Refunded By: Rahul (Manager, Jun 30)
  Deduction: ₹100 (damaged locker)
  ```
- **Why This Design:** Deposit lifecycle tracking

---

## 29. DailySettlement Entity

**Purpose:** End of day report - total collection

### Relationships:

**1. `DailySettlement` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Settlement kis branch ka hai
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Settlement: Feb 15 - Cash: ₹5000, UPI: ₹3000, Net Profit: ₹6500
  ```
- **Why This Design:** Branch-wise daily P&L

**2. `DailySettlement` ↔ `User` (closedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne day close kiya
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Settlement: Closed by Rahul at 11:00 PM
  ```
- **Why This Design:** Settlement responsibility

---

## 30. BulkImport Entity

**Purpose:** Excel upload tracking - bulk data import

### Relationships:

**1. `BulkImport` ↔ `Branch` (branch) - N:1 Relationship**
- **Field:** `@ManyToOne(() => Branch)`
- **Meaning:** Import kis branch ke liye hua
- **Real Example:**
  ```
  Branch: Smart Library - CP (ID: 550e8400)
  Import: 100 students uploaded, 95 success, 5 failed
  ```
- **Why This Design:** Branch-wise bulk operations

**2. `BulkImport` ↔ `User` (uploadedBy) - N:1 Relationship**
- **Field:** `@ManyToOne(() => User)`
- **Meaning:** Kisne file upload ki
- **Real Example:**
  ```
  User: Rahul (Manager, ID: 650e8400)
  Import: Students file uploaded by Rahul
  Errors: Row 5 (missing phone), Row 12 (invalid email)
  ```
- **Why This Design:** Upload accountability aur error tracking

---

## 📊 Relationship Summary

### Total Relationships: 100+

**By Type:**
- **1:N (One-to-Many):** ~70 relationships
- **N:1 (Many-to-One):** ~70 relationships (reverse of above)
- **1:1 (One-to-One):** 0 (not needed in this schema)
- **Self-Referencing:** 1 (Student → Student for referrals)

**By Entity:**
- **Most Connected:** Student (15+ relationships)
- **Central Hubs:** Branch, User, Student
- **Support Tables:** History, Log, Tracking entities

---

## ✅ Design Principles

1. **Cascade Deletes:** StudentSlot uses CASCADE - student delete hone par slots auto-delete
2. **Nullable Foreign Keys:** Anonymous complaints, optional fields
3. **Audit Trail:** User tracking on all important actions
4. **Branch Isolation:** Multi-tenant design - har entity branch se linked
5. **Referential Integrity:** All foreign keys properly constrained
6. **Soft Deletes:** isActive, isDeleted flags instead of hard deletes

---

**Production Ready!** 🚀
