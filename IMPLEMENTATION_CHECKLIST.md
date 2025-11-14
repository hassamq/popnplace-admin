# Payment System - Implementation Checklist & Database Setup

## ✅ Frontend Implementation Status

### Components Created

- [x] Payment List View (`src/sections/payment/view/payment-list-view.jsx`)
- [x] Payment Details View (`src/sections/payment/view/payment-details-view.jsx`)
- [x] Payment Table Row (`src/sections/payment/payment-table-row.jsx`)
- [x] Payment Table Toolbar (`src/sections/payment/payment-table-toolbar.jsx`)
- [x] Payment Table Filters (`src/sections/payment/payment-table-filters-result.jsx`)
- [x] Pages: List and Details (`src/pages/dashboard/payments/`)
- [x] Routes Configuration (`src/routes/sections/dashboard.jsx`)
- [x] API Service (`src/services/api.js` - paymentService)
- [x] View Index Export (`src/sections/payment/view/index.js`)

### Features Implemented

- [x] Paginated table with sortable columns
- [x] Multi-filter system (status, type, method, date range)
- [x] Summary statistics card
- [x] Payment details view with breadcrumbs
- [x] Row actions (view, delete)
- [x] Loading and error states
- [x] Toast notifications
- [x] Responsive design
- [x] Currency formatting
- [x] Status/method/type badges

## ⚙️ Backend Implementation Checklist

### Phase 1: Setup & Configuration

- [ ] Install dependencies: `npm install mongoose express cors pdfkit`
- [ ] Create `.env` file with database URL and JWT secret
- [ ] Ensure authentication middleware exists

### Phase 2: Database

- [ ] Create `models/Payment.js` with schema from `BACKEND_PAYMENT_MODEL.js`
- [ ] Create database indexes:
  ```bash
  npm run create:indexes
  # or manually in MongoDB shell
  ```
- [ ] Verify collection created with indexes

### Phase 3: API Implementation

- [ ] Copy routes from `BACKEND_PAYMENT_API.js` to `routes/admin/payments.js`
- [ ] Create `middleware/auth.js` if doesn't exist
- [ ] Register routes in main `app.js`:
  ```javascript
  const paymentRoutes = require('./routes/admin/payments');
  app.use('/api/v1/admin/payments', paymentRoutes);
  ```
- [ ] Ensure CORS is configured for frontend domain

### Phase 4: Testing

- [ ] Test GET /api/v1/admin/payments
- [ ] Test GET /api/v1/admin/payments/:id
- [ ] Test DELETE /api/v1/admin/payments/:id
- [ ] Test filtering by status, type, method
- [ ] Test date range filtering
- [ ] Test sorting options
- [ ] Test pagination (page, limit)
- [ ] Verify summary statistics calculation
- [ ] Test authentication/authorization

### Phase 5: Enhancement

- [ ] Implement CSV export functionality
- [ ] Implement PDF export functionality
- [ ] Add advanced search by payment ID or email
- [ ] Add refund management endpoints
- [ ] Add payment status update endpoints

## 📦 Installation Commands

### Backend Dependencies

```bash
# Navigate to backend directory
cd your-backend-project

# Install required packages
npm install mongoose express cors dotenv axios

# Optional: For PDF export
npm install pdfkit

# Optional: For advanced features
npm install stripe joi
```

## 🗄️ MongoDB Setup

### Create Indexes for Performance

```javascript
// In MongoDB shell or MongoDB Compass

// Single field indexes
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ paymentType: 1 });
db.payments.createIndex({ method: 1 });
db.payments.createIndex({ payer: 1 });
db.payments.createIndex({ recipient: 1 });
db.payments.createIndex({ booking: 1 });
db.payments.createIndex({ createdAt: -1 });
db.payments.createIndex({ amount: 1 });
db.payments.createIndex({ hostAmount: 1 });
db.payments.createIndex({ 'stripeData.transactionId': 1 });

// Compound indexes for common queries
db.payments.createIndex({ status: 1, createdAt: -1 });
db.payments.createIndex({ paymentType: 1, createdAt: -1 });
db.payments.createIndex({ method: 1, status: 1 });
db.payments.createIndex({ payer: 1, createdAt: -1 });
db.payments.createIndex({ recipient: 1, createdAt: -1 });

// Text index for search
db.payments.createIndex({
  'payer.firstName': 'text',
  'payer.lastName': 'text',
  'recipient.firstName': 'text',
  'recipient.lastName': 'text',
});
```

### Sample Data for Testing

```javascript
// Insert sample payment records for testing

db.payments.insertMany([
  {
    _id: ObjectId(),
    booking: ObjectId('507f1f77bcf86cd799439012'),
    payer: ObjectId('507f1f77bcf86cd799439013'),
    recipient: ObjectId('507f1f77bcf86cd799439014'),
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
      taxes: 0,
      discounts: 0,
      securityDeposit: 0,
    },
    stripeData: {
      transactionId: 'pi_1234567890abcdef',
      externalTransactionId: 'pi_1234567890abcdef',
      processorFee: 15.45,
      netAmount: 484.55,
      exchangeRate: 1.0,
      processedAt: new Date('2024-11-14T10:30:00Z'),
    },
    cardDetails: {
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiry: '12/2025',
    },
    payoutInfo: {
      payoutId: 'po_1234567890abcdef',
      payoutAmount: 434.55,
      payoutFee: 0,
      payoutDate: new Date('2024-11-16'),
      payoutMethod: 'stripe_transfer',
      payoutStatus: 'paid',
    },
    refundInfo: {
      totalRefunded: 0,
      remainingAmount: 500,
      refundCount: 0,
      refunds: [],
    },
    timeline: {
      initiatedAt: new Date('2024-11-14T10:00:00Z'),
      authorizedAt: new Date('2024-11-14T10:15:00Z'),
      capturedAt: new Date('2024-11-14T10:30:00Z'),
      settledAt: new Date('2024-11-14T10:30:00Z'),
    },
    notes: {
      internal: 'Verified payment',
      customer: 'Payment received',
    },
    metadata: {
      source: 'web',
      ipAddress: '192.168.1.100',
    },
    createdAt: new Date('2024-11-14T10:00:00Z'),
    updatedAt: new Date('2024-11-14T10:30:00Z'),
  },
]);
```

### Verify Database Connection

```javascript
// In MongoDB shell
use popnplace  // or your database name
db.payments.countDocuments()  // Should return number of records
db.payments.findOne()  // Should return a payment document
db.payments.getIndexes()  // Should show all created indexes
```

## 🧪 API Testing with cURL

### 1. Get All Payments (Basic)

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. Get Payments with Pagination

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Payments with Filters

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments?status=completed&method=stripe" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Payments with Date Range

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments?startDate=2024-11-01T00:00:00Z&endDate=2024-11-30T23:59:59Z" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Payments with Sorting

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments?sortBy=amount&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Get Single Payment

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Delete Payment

```bash
curl -X DELETE "http://localhost:3030/api/v1/admin/payments/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Export as CSV

```bash
curl -X GET "http://localhost:3030/api/v1/admin/payments/export/csv?status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o payments.csv
```

## 🔑 Environment Variables Template

Create `.env` file in your backend root:

```env
# Server Configuration
NODE_ENV=development
PORT=3030

# Database
MONGODB_URI=mongodb://localhost:27017/popnplace
MONGODB_USER=admin
MONGODB_PASSWORD=your_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# CORS
CORS_ORIGIN=http://localhost:3030

# Logging
LOG_LEVEL=debug
```

## 🚀 Startup Script

Add to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "create:indexes": "node scripts/createIndexes.js",
    "seed:payments": "node scripts/seedPayments.js",
    "test": "jest --watchAll"
  }
}
```

Create `scripts/createIndexes.js`:

```javascript
const mongoose = require('mongoose');
const Payment = require('../models/Payment');

const createIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Mongoose automatically creates indexes defined in schema
    await Payment.collection.createIndexes();
    console.log('✅ All indexes created successfully');

    // List all indexes
    const indexes = await Payment.collection.getIndexes();
    console.log('Indexes:', Object.keys(indexes));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
```

## 📊 Query Examples

### Count Payments by Status

```javascript
db.payments.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
    },
  },
]);
```

### Total Revenue by Month

```javascript
db.payments.aggregate([
  {
    $match: { status: 'completed' },
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      total: { $sum: '$amount' },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: -1 } },
]);
```

### Top Payment Methods

```javascript
db.payments.aggregate([
  {
    $group: {
      _id: '$method',
      total: { $sum: '$amount' },
      count: { $sum: 1 },
    },
  },
  { $sort: { total: -1 } },
]);
```

### Pending Payments

```javascript
db.payments.find({ status: 'pending' }).sort({ createdAt: -1 });
```

### Failed Payments

```javascript
db.payments.find({ status: 'failed' }).sort({ createdAt: -1 });
```

## 🔍 Troubleshooting

### Issue: "Payment not found" Error

**Solution:**

- Verify payment ID is correct
- Check database connection
- Ensure record exists: `db.payments.findById(id)`

### Issue: Empty Results

**Solution:**

- Insert sample data
- Verify filters are correct
- Check date format (ISO 8601)

### Issue: Authentication Error

**Solution:**

- Verify JWT token validity
- Check token includes admin role
- Ensure Authorization header format: `Bearer <token>`

### Issue: Slow Queries

**Solution:**

- Create missing indexes
- Use explain() to analyze queries
- Consider pagination for large datasets

## 📈 Performance Metrics

Expected performance with indexes:

| Operation                       | Without Indexes | With Indexes |
| ------------------------------- | --------------- | ------------ |
| Get all payments (1000 records) | ~500ms          | ~50ms        |
| Filter by status                | ~400ms          | ~30ms        |
| Sort by date                    | ~300ms          | ~20ms        |
| Get single payment              | ~200ms          | ~5ms         |

## 🎯 Final Verification

Before going live:

- [ ] All endpoints tested and working
- [ ] Database indexes created
- [ ] Authentication middleware functional
- [ ] CORS properly configured
- [ ] Frontend connected to backend
- [ ] Sample data inserted
- [ ] Error handling working
- [ ] Logging configured
- [ ] Environment variables set
- [ ] Rate limiting considered
- [ ] Security headers added
- [ ] Input validation implemented

---

**Created**: November 14, 2024
**Status**: Ready for Backend Implementation
