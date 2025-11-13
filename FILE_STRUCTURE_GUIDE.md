# Payment System - Complete File Structure & Navigation Guide

## 📂 Complete Project Structure

```
popnplace-admin/
│
├── 📄 PAYMENT_IMPLEMENTATION_COMPLETE.md    (Project status)
├── 📄 PAYMENT_QUICK_START.md               (Quick reference)
├── 📄 PAYMENT_SYSTEM_GUIDE.md              (Full setup guide)
├── 📄 IMPLEMENTATION_CHECKLIST.md          (Setup checklist)
├── 📄 BACKEND_PAYMENT_API.js               (Backend code)
├── 📄 BACKEND_PAYMENT_MODEL.js             (Database schema)
│
├── src/
│   ├── services/
│   │   └── api.js                          ✅ UPDATED (Added paymentService)
│   │
│   ├── routes/
│   │   └── sections/
│   │       └── dashboard.jsx               ✅ UPDATED (Added payment routes)
│   │
│   ├── pages/
│   │   └── dashboard/
│   │       ├── payments/                   📁 NEW
│   │       │   ├── list.jsx                ✅ NEW (List page)
│   │       │   └── details.jsx             ✅ NEW (Details page)
│   │       └── ... (other pages)
│   │
│   ├── sections/
│   │   ├── payment/                        📁 ENHANCED
│   │   │   ├── view/
│   │   │   │   ├── index.js                ✅ UPDATED (Exports)
│   │   │   │   ├── payment-view.jsx        (Existing - checkout)
│   │   │   │   ├── payment-list-view.jsx   ✅ NEW
│   │   │   │   └── payment-details-view.jsx ✅ NEW
│   │   │   │
│   │   │   ├── payment-table-row.jsx       ✅ NEW (Table row)
│   │   │   ├── payment-table-toolbar.jsx   ✅ NEW (Filters)
│   │   │   ├── payment-table-filters-result.jsx ✅ NEW (Filter display)
│   │   │   │
│   │   │   ├── payment-billing-address.jsx (Existing)
│   │   │   ├── payment-card-item.jsx       (Existing)
│   │   │   ├── payment-methods.jsx         (Existing)
│   │   │   └── ... (other payment components)
│   │   │
│   │   └── ... (other sections)
│   │
│   ├── layouts/
│   │   ├── config-nav-dashboard.jsx        (Payments menu already configured)
│   │   └── ... (other layouts)
│   │
│   ├── components/ (UI components)
│   ├── hooks/      (Custom hooks)
│   ├── auth/       (Authentication)
│   ├── utils/      (Utilities)
│   └── ... (other source files)
│
└── ... (configuration files)
```

## 🗺️ Navigation Map

### Frontend Routes

```
Dashboard
├── /dashboard/payments/list
│   ├── URL: http://localhost:3030/dashboard/payments/list
│   ├── Component: PaymentListView
│   ├── Features:
│   │   ├── Table with pagination
│   │   ├── Advanced filtering
│   │   ├── Sorting options
│   │   ├── Summary statistics
│   │   └── Row actions
│   │
│   └── Available Actions:
│       ├── View Payment Details (→ /dashboard/payments/:id)
│       ├── Delete Payment
│       └── Filter & Sort
│
└── /dashboard/payments/:id
    ├── URL: http://localhost:3030/dashboard/payments/507f1f77bcf86cd799439011
    ├── Component: PaymentDetailsView
    ├── Sections:
    │   ├── Header with amount
    │   ├── Payment parties
    │   ├── Booking information
    │   ├── Payment breakdown
    │   ├── Stripe details
    │   ├── Card details
    │   ├── Payout information
    │   ├── Timeline
    │   └── Additional info
    │
    └── Available Actions:
        └── Back to List (← /dashboard/payments/list)
```

### Menu Navigation

```
Dashboard Sidebar
├── Dashboard (Overview)
├── Storage Management
├── Bookings & Reservations
│   ├── Bookings
│   └── Payments ← NEW
│       └── Leads to: /dashboard/payments/list
├── User Management
└── ... (other sections)
```

## 🔗 Component Relationships

```
PaymentListView
├── PaymentTableToolbar (Filters & Sorting)
├── PaymentTableFiltersResult (Filter Display)
├── PaymentTableRow (×20 per page)
│   ├── Status Badge
│   ├── Method Badge
│   ├── Type Badge
│   └── Action Menu
│       ├── View Details → PaymentDetailsView
│       └── Delete
└── Summary Statistics Card

PaymentDetailsView
├── Header Section
│   ├── Amount Display
│   └── Status Badges
├── Main Content (Left)
│   ├── Payment Parties
│   ├── Booking Information
│   ├── Payment Breakdown
│   ├── Stripe Details
│   └── Card Details
└── Sidebar (Right)
    ├── Amount Summary
    ├── Payment Timeline
    ├── Refund Information
    └── Additional Metadata
```

## 📡 API Service Layer

```
src/services/api.js

paymentService
├── getPayments(params)
│   ├── Query: page, limit, status, paymentType, method, etc.
│   └── Returns: {data, pagination, summary}
│
├── getPaymentById(id)
│   ├── Param: payment ID
│   └── Returns: {data}
│
├── deletePayment(id)
│   ├── Param: payment ID
│   └── Returns: {success, message}
│
└── exportPayments(params, format)
    ├── Params: filters, format (csv/pdf)
    └── Returns: Blob (file)
```

## 🔐 Authentication Flow

```
User Login
    ↓
JWT Token (localStorage)
    ↓
API Request with Token
    ├── Authorization: Bearer <token>
    └── verifyAdmin middleware
        ├── Valid token + Admin role
        │   └── ✅ Request allowed
        └── Invalid token / Non-admin
            └── ❌ Request denied (401/403)
```

## 📊 Data Flow

```
User Action (Filter/Sort/Paginate)
    ↓
PaymentListView (State Update)
    ↓
paymentService.getPayments()
    ↓
apiClient.get('/api/v1/admin/payments')
    ↓
Backend API
    ├── Filter
    ├── Sort
    ├── Paginate
    └── Calculate Summary
    ↓
Response {data, pagination, summary}
    ↓
PaymentListView (Render Table + Stats)
    ↓
User Sees Results
```

## 🎯 Key Files Reference

### Frontend Implementation Files

| File                                                    | Purpose                      | Status      |
| ------------------------------------------------------- | ---------------------------- | ----------- |
| `src/sections/payment/view/payment-list-view.jsx`       | Main list view               | ✅ Complete |
| `src/sections/payment/view/payment-details-view.jsx`    | Details view                 | ✅ Complete |
| `src/sections/payment/payment-table-row.jsx`            | Table row component          | ✅ Complete |
| `src/sections/payment/payment-table-toolbar.jsx`        | Filters/sort toolbar         | ✅ Complete |
| `src/sections/payment/payment-table-filters-result.jsx` | Filter chips                 | ✅ Complete |
| `src/pages/dashboard/payments/list.jsx`                 | List page wrapper            | ✅ Complete |
| `src/pages/dashboard/payments/details.jsx`              | Details page wrapper         | ✅ Complete |
| `src/services/api.js`                                   | API service (paymentService) | ✅ Updated  |
| `src/routes/sections/dashboard.jsx`                     | Route configuration          | ✅ Updated  |
| `src/sections/payment/view/index.js`                    | Component exports            | ✅ Updated  |

### Backend Documentation Files

| File                                 | Purpose           | Use Case                 |
| ------------------------------------ | ----------------- | ------------------------ |
| `BACKEND_PAYMENT_API.js`             | Complete API code | Copy to backend          |
| `BACKEND_PAYMENT_MODEL.js`           | Mongoose schema   | Create models/Payment.js |
| `PAYMENT_SYSTEM_GUIDE.md`            | Full setup guide  | Follow for setup         |
| `IMPLEMENTATION_CHECKLIST.md`        | Setup checklist   | Step-by-step guide       |
| `PAYMENT_QUICK_START.md`             | Quick reference   | Quick lookup             |
| `PAYMENT_IMPLEMENTATION_COMPLETE.md` | Project status    | Overview                 |

## 🚀 Quick Navigation

### To View Payment List:

1. Open app: `http://localhost:3030`
2. Click "Payments" in sidebar
3. Or direct: `http://localhost:3030/dashboard/payments/list`

### To View Payment Details:

1. On list page, click "View Details"
2. Or direct: `http://localhost:3030/dashboard/payments/{id}`

### To Set Up Backend:

1. Read: `PAYMENT_SYSTEM_GUIDE.md`
2. Copy: Code from `BACKEND_PAYMENT_API.js`
3. Create: `models/Payment.js` from `BACKEND_PAYMENT_MODEL.js`
4. Follow: `IMPLEMENTATION_CHECKLIST.md`

### To Understand Errors:

1. Check: `PAYMENT_IMPLEMENTATION_COMPLETE.md` (fixes applied)
2. Review: Component files for prop types
3. Check: Import paths and exports

## 📝 Component Import Hierarchy

```
Pages (src/pages/dashboard/payments/)
├── list.jsx
│   └── imports PaymentListView from sections/payment/view
│
└── details.jsx
    └── imports PaymentDetailsView from sections/payment/view

Views (src/sections/payment/view/)
├── payment-list-view.jsx
│   ├── imports PaymentTableRow
│   ├── imports PaymentTableToolbar
│   ├── imports PaymentTableFiltersResult
│   └── imports paymentService
│
└── payment-details-view.jsx
    └── imports paymentService

Services (src/services/)
└── api.js
    └── exports paymentService

Routes (src/routes/sections/)
└── dashboard.jsx
    ├── imports PaymentListPage
    └── imports PaymentDetailsPage
```

## 🔄 State Management Flow

```
PaymentListView
├── State: tableData, filters, loading, summary
├── Actions:
│   ├── fetchPayments() - Load data
│   ├── handleFilters() - Update filters
│   ├── handleResetFilters() - Reset filters
│   └── handleDeleteRow() - Delete payment
└── Effects:
    └── useEffect(() => fetchPayments()) - On mount & deps change

PaymentDetailsView
├── State: payment, loading
└── Effects:
    └── useEffect(() => fetchPayment()) - On mount
```

## 📱 Responsive Breakpoints

The components are responsive across:

- **Mobile**: xs (0px+)
- **Tablet**: sm (600px+), md (900px+)
- **Desktop**: lg (1200px+), xl (1536px+)

---

**Last Updated**: November 14, 2025  
**Status**: ✅ Complete and Production Ready
