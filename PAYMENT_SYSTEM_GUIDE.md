# PaynPlace Admin Payment Management System - Implementation Guide

## Overview

This guide provides complete instructions for implementing the payment records management system in the PopnPlace admin panel, including both frontend components and backend API endpoints.

## Project Structure

```
Frontend (React/Vite):
├── src/
│   ├── pages/dashboard/payments/
│   │   ├── list.jsx                 (Payment list page)
│   │   └── details.jsx              (Payment details page)
│   ├── sections/payment/
│   │   ├── view/
│   │   │   ├── index.js
│   │   │   ├── payment-list-view.jsx        ✅ CREATED
│   │   │   ├── payment-details-view.jsx     ✅ CREATED
│   │   │   └── payment-view.jsx             (Existing checkout view)
│   │   ├── payment-table-row.jsx            ✅ CREATED
│   │   ├── payment-table-toolbar.jsx        ✅ CREATED
│   │   └── payment-table-filters-result.jsx ✅ CREATED
│   ├── routes/
│   │   └── sections/
│   │       └── dashboard.jsx         ✅ UPDATED
│   └── services/
│       └── api.js                    ✅ UPDATED

Backend (Express/Node.js):
├── routes/
│   └── admin/
│       └── payments.js               (Backend API endpoints - see BACKEND_PAYMENT_API.js)
├── models/
│   └── Payment.js                    (Mongoose schema - see BACKEND_PAYMENT_MODEL.js)
└── middleware/
    └── auth.js                       (Admin verification middleware - existing)
```

## Frontend Implementation - COMPLETED ✅

### 1. Payment List View Component

**File:** `src/sections/payment/view/payment-list-view.jsx`

Features:

- Table display of all payments with pagination
- Advanced filtering by status, type, method, and date range
- Sorting options (by date, amount, status)
- Summary statistics card showing totals, fees, and metrics
- Row actions (view details, delete)
- Loading and error states

### 2. Payment Details View Component

**File:** `src/sections/payment/view/payment-details-view.jsx`

Features:

- Comprehensive payment information display
- Organized into logical sections:
  - Header with amount and status badges
  - Payment parties (payer/recipient information)
  - Booking information
  - Payment breakdown
  - Stripe transaction details
  - Card/payment method details
  - Payout information
  - Timeline of payment events
  - Refund information
  - Additional metadata
- Sidebar with summary and quick stats

### 3. Table Components

**Files:**

- `payment-table-row.jsx` - Individual row rendering with actions
- `payment-table-toolbar.jsx` - Filter and sort controls
- `payment-table-filters-result.jsx` - Active filters display

### 4. API Service

**File:** `src/services/api.js` - Added `paymentService` with methods:

- `getPayments(params)` - List all payments
- `getPaymentById(id)` - Get single payment
- `deletePayment(id)` - Delete payment record
- `exportPayments(params, format)` - Export as CSV/PDF

### 5. Routing

**File:** `src/routes/sections/dashboard.jsx` - Updated to include:

- Payment list route: `/dashboard/payments/list`
- Payment details route: `/dashboard/payments/:id`

### 6. Navigation

**File:** `src/layouts/config-nav-dashboard.jsx` - Already configured with:

- "Payments" menu item linking to `/dashboard/payments/list`

## Backend Implementation - SETUP GUIDE

### Step 1: Install Dependencies

```bash
cd your-backend-project

# Install required packages
npm install mongoose express cors dotenv axios pdfkit

# For Stripe integration (if not already installed)
npm install stripe
```

### Step 2: Create Payment Model

**File:** `models/Payment.js`

- Copy the schema from `BACKEND_PAYMENT_MODEL.js`
- Add to your backend project
- Set up MongoDB indexes for optimal query performance

### Step 3: Create Payment Routes & Controller

**File:** `routes/admin/payments.js`

- Copy the code from `BACKEND_PAYMENT_API.js`
- Ensure admin authentication middleware is in place
- Update import paths to match your project structure

### Step 4: Register Routes in Main App

**File:** `app.js` or `server.js`

```javascript
const paymentRoutes = require('./routes/admin/payments');

// Register payment routes
app.use('/api/v1/admin/payments', paymentRoutes);
```

### Step 5: Set Up Authentication Middleware

**File:** `middleware/auth.js` (if not exists)

```javascript
const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied - Admin role required',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

module.exports = { verifyAdmin };
```

## API Endpoints

### 1. Get All Payments

```
GET /api/v1/admin/payments
```

**Query Parameters:**

```
page=1
limit=20
status=completed
paymentType=booking_payment
method=stripe
startDate=2024-11-01T00:00:00Z
endDate=2024-11-30T23:59:59Z
sortBy=createdAt
sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "amount": 500,
      "status": "completed",
      "paymentType": "booking_payment",
      "method": "stripe",
      "payer": { "firstName": "John", "lastName": "Doe", "email": "john@example.com" },
      "recipient": { "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com" },
      "hostAmount": 434.55,
      "stripeData": { "transactionId": "pi_...", "processorFee": 15.45 },
      "createdAt": "2024-11-14T10:00:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 92,
    "hasNext": true,
    "hasPrev": false
  },
  "summary": {
    "totalAmount": 15000,
    "totalProcessingFees": 450,
    "totalServiceFees": 1500,
    "totalHostAmount": 13050,
    "completedPayments": 85,
    "failedPayments": 3,
    "refundedPayments": 4,
    "averagePaymentAmount": 163.04
  }
}
```

### 2. Get Single Payment

```
GET /api/v1/admin/payments/{id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "booking": { "_id": "...", "startDate": "2024-11-20", "totalAmount": 500 },
    "payer": { "_id": "...", "firstName": "John", "lastName": "Doe", "email": "john@example.com" },
    "recipient": { "_id": "...", "firstName": "Jane", "lastName": "Smith" },
    "amount": 500,
    "renterPaid": 500,
    "hostAmount": 434.55,
    "status": "completed",
    "paymentType": "booking_payment",
    "method": "stripe",
    "breakdown": {
      "subtotal": 450,
      "serviceFee": 50,
      "processingFee": 0,
      "taxes": 0,
      "discounts": 0
    },
    "stripeData": {
      "transactionId": "pi_1234567890abcdef",
      "processorFee": 15.45,
      "netAmount": 484.55,
      "processedAt": "2024-11-14T10:30:00Z"
    },
    "cardDetails": {
      "type": "card",
      "brand": "visa",
      "last4": "4242",
      "expiry": "12/2025"
    },
    "payoutInfo": {
      "payoutId": "po_...",
      "payoutAmount": 434.55,
      "payoutStatus": "paid"
    },
    "timeline": {
      "initiatedAt": "2024-11-14T10:00:00Z",
      "authorizedAt": "2024-11-14T10:15:00Z",
      "capturedAt": "2024-11-14T10:30:00Z",
      "settledAt": "2024-11-14T10:30:00Z"
    },
    "createdAt": "2024-11-14T10:00:00Z",
    "updatedAt": "2024-11-14T10:30:00Z"
  }
}
```

### 3. Delete Payment

```
DELETE /api/v1/admin/payments/{id}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment deleted successfully"
}
```

### 4. Export Payments

```
GET /api/v1/admin/payments/export/csv
GET /api/v1/admin/payments/export/pdf
```

**Query Parameters:**

```
status=completed
paymentType=booking_payment
method=stripe
startDate=2024-11-01
endDate=2024-11-30
```

**Response:** Binary file (CSV or PDF)

## Usage Examples

### Frontend - Using the Payment Service

```javascript
import { paymentService } from 'src/services/api';

// Get all payments with filters
const response = await paymentService.getPayments({
  page: 1,
  limit: 20,
  status: 'completed',
  method: 'stripe',
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

// Get single payment
const payment = await paymentService.getPaymentById('507f1f77bcf86cd799439011');

// Delete payment
await paymentService.deletePayment('507f1f77bcf86cd799439011');

// Export as CSV
const csvFile = await paymentService.exportPayments({ status: 'completed' }, 'csv');
```

### Backend - Creating Payments

```javascript
const Payment = require('./models/Payment');

// Create a new payment record
const payment = new Payment({
  booking: bookingId,
  payer: renterId,
  recipient: hostId,
  amount: 500,
  currency: 'EUR',
  renterPaid: 500,
  hostAmount: 434.55,
  paymentType: 'booking_payment',
  status: 'completed',
  method: 'stripe',
  breakdown: {
    subtotal: 450,
    serviceFee: 50,
    processingFee: 0,
  },
  stripeData: {
    transactionId: 'pi_1234567890abcdef',
    processorFee: 15.45,
    netAmount: 484.55,
    processedAt: new Date(),
  },
  cardDetails: {
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiry: '12/2025',
  },
  timeline: {
    initiatedAt: new Date(),
    capturedAt: new Date(),
    settledAt: new Date(),
  },
});

await payment.save();

// Mark payment as completed
await payment.markAsCompleted();

// Issue refund
await payment.issueRefund(100, 'Customer requested');
```

## Environment Variables

**Backend `.env`:**

```
NODE_ENV=development
PORT=3030
MONGODB_URI=mongodb://localhost:27017/popnplace
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Testing

### Manual Testing with Curl

```bash
# Get all payments
curl -X GET "http://localhost:3030/api/v1/admin/payments" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get payment details
curl -X GET "http://localhost:3030/api/v1/admin/payments/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Delete payment
curl -X DELETE "http://localhost:3030/api/v1/admin/payments/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Export as CSV
curl -X GET "http://localhost:3030/api/v1/admin/payments/export/csv?status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o payments.csv
```

## Frontend Features Summary

### Payment List View

- ✅ Paginated table with 20 records per page
- ✅ Advanced filtering by status, type, method
- ✅ Sorting by date, amount, or status
- ✅ View individual payment details
- ✅ Delete payment records
- ✅ Summary statistics showing:
  - Total amount collected
  - Processing fees
  - Service fees
  - Amount to hosts
  - Completed/failed payment counts

### Payment Details View

- ✅ Complete payment information display
- ✅ Payment parties (payer and recipient)
- ✅ Booking information
- ✅ Detailed amount breakdown
- ✅ Stripe transaction details
- ✅ Card information (masked)
- ✅ Payout details
- ✅ Payment timeline
- ✅ Refund information
- ✅ Security deposit details
- ✅ Back navigation to list

## Integration Checklist

### Frontend ✅

- [x] Create payment list view
- [x] Create payment details view
- [x] Create table row component
- [x] Create toolbar/filters component
- [x] Create filter results component
- [x] Add payment service to API
- [x] Add routes to dashboard
- [x] Navigation menu already configured

### Backend (To Do)

- [ ] Create Payment model/schema
- [ ] Create payment routes
- [ ] Set up admin authentication middleware
- [ ] Register routes in main app
- [ ] Add database indexes
- [ ] Create CSV/PDF export functionality
- [ ] Test all endpoints
- [ ] Deploy to production

## Common Issues & Solutions

### 1. API Not Found (404)

**Solution:** Ensure backend routes are registered in main app.js:

```javascript
app.use('/api/v1/admin/payments', paymentRoutes);
```

### 2. Authentication Error (401/403)

**Solution:** Verify JWT token is properly set and admin role is verified:

```javascript
// Check token in request headers
Authorization: Bearer <
  jwt_token >
  // Verify role in token
  {
    sub: 'user_id',
    role: 'admin',
    iat: 1234567890,
  };
```

### 3. Empty Results

**Solution:** Ensure Payment records exist in database and filters match:

```javascript
// Check database
db.payments.find({}).count()

// Verify filter syntax
GET /api/v1/admin/payments?status=completed
```

### 4. Performance Issues

**Solution:** Ensure all indexes are created on Payment collection:

```javascript
// Create indexes in MongoDB
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ createdAt: -1 });
db.payments.createIndex({ payer: 1 });
db.payments.createIndex({ status: 1, createdAt: -1 });
```

## Support & Documentation

For additional information, refer to:

- Backend Payment API: `BACKEND_PAYMENT_API.js`
- Payment Model Schema: `BACKEND_PAYMENT_MODEL.js`
- Original specification: User's endpoint documentation

## License

Part of PopnPlace Admin Panel - Internal Use Only
