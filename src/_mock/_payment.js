import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partially_refunded', label: 'Partially Refunded' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'ideal', label: 'iDEAL' },
];

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'booking', label: 'Booking Payment' },
  { value: 'deposit', label: 'Security Deposit' },
  { value: 'refund', label: 'Refund' },
  { value: 'fee', label: 'Service Fee' },
];

// ----------------------------------------------------------------------

export const _paymentList = [...Array(48)].map((_, index) => ({
  id: _mock.id(index),
  transactionId: `TXN-${String(10000 + index).padStart(6, '0')}`,
  bookingId: _mock.id(index % 36),
  bookingNumber: `BK-${String(1000 + (index % 36)).padStart(4, '0')}`,
  spaceId: _mock.id(index % 24),
  spaceName: `Parking Space ${(index % 24) + 1}`,
  payer: {
    id: _mock.id(index + 200),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
  },
  recipient: {
    id: _mock.id(index + 100),
    name: _mock.fullName(index + 50),
    email: _mock.email(index + 50),
  },
  amount: _mock.number.price(50, 1500),
  currency: 'EUR',
  paymentMethod: _mock.role(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'ideal']),
  paymentType: _mock.role(['booking', 'deposit', 'refund', 'fee']),
  status: _mock.role(['pending', 'completed', 'failed', 'refunded', 'partially_refunded']),
  fee: _mock.number.price(2, 50),
  netAmount: _mock.number.price(45, 1450),
  cardLast4: `****${Math.floor(1000 + Math.random() * 9000)}`,
  cardBrand: _mock.role(['Visa', 'Mastercard', 'American Express', 'Maestro']),
  description: 'Payment for parking space booking',
  paymentDate: _mock.time(index),
  settledDate: index % 3 === 0 ? _mock.time(index + 1) : null,
  refundedAmount: index % 10 === 0 ? _mock.number.price(10, 100) : 0,
  failureReason: index % 15 === 0 ? 'Insufficient funds' : null,
  metadata: {
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0',
  },
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
}));

// Single payment detail
export const _payment = {
  id: _mock.id(1),
  transactionId: 'TXN-010001',
  bookingId: _mock.id(1),
  bookingNumber: 'BK-1001',
  spaceId: _mock.id(1),
  spaceName: 'Premium Covered Parking Space A1',
  spaceLocation: 'Downtown Business Center',
  payer: {
    id: _mock.id(201),
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 987-6543',
    avatarUrl: _mock.image.avatar(1),
  },
  recipient: {
    id: _mock.id(101),
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    bankAccount: '****5678',
  },
  amount: 500,
  currency: 'EUR',
  paymentMethod: 'credit_card',
  paymentType: 'booking',
  status: 'completed',
  fee: 15,
  netAmount: 485,
  cardLast4: '****4242',
  cardBrand: 'Visa',
  cardExpiry: '12/25',
  billingAddress: {
    street: '456 Oak Avenue',
    city: 'Amsterdam',
    state: 'North Holland',
    zipCode: '1012 AB',
    country: 'Netherlands',
  },
  description: 'Payment for 5 days parking at Downtown Business Center',
  paymentDate: _mock.time(1),
  settledDate: _mock.time(2),
  refundedAmount: 0,
  timeline: [
    {
      id: 1,
      title: 'Payment Initiated',
      description: 'Payment request created',
      time: _mock.time(1),
    },
    {
      id: 2,
      title: 'Payment Authorized',
      description: 'Payment authorized by payment processor',
      time: _mock.time(1),
    },
    {
      id: 3,
      title: 'Payment Captured',
      description: 'Payment successfully captured',
      time: _mock.time(1),
    },
    {
      id: 4,
      title: 'Payment Settled',
      description: 'Payment settled to recipient account',
      time: _mock.time(2),
    },
  ],
  metadata: {
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    deviceId: 'device-abc-123',
    sessionId: 'session-xyz-789',
  },
  createdAt: _mock.time(1),
  updatedAt: _mock.time(2),
};

// Payment methods
export const _paymentMethodList = [
  {
    id: _mock.id(1),
    type: 'credit_card',
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    holderName: 'Jane Doe',
    isDefault: true,
    createdAt: _mock.time(1),
  },
  {
    id: _mock.id(2),
    type: 'credit_card',
    brand: 'Mastercard',
    last4: '5555',
    expMonth: 6,
    expYear: 2024,
    holderName: 'Jane Doe',
    isDefault: false,
    createdAt: _mock.time(2),
  },
  {
    id: _mock.id(3),
    type: 'paypal',
    email: 'jane.doe@example.com',
    isDefault: false,
    createdAt: _mock.time(3),
  },
];

// Refund list
export const _refundList = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  refundId: `REF-${String(5000 + index).padStart(5, '0')}`,
  transactionId: `TXN-${String(10000 + index).padStart(6, '0')}`,
  bookingId: _mock.id(index % 36),
  bookingNumber: `BK-${String(1000 + (index % 36)).padStart(4, '0')}`,
  amount: _mock.number.price(50, 500),
  currency: 'EUR',
  reason: _mock.role([
    'Customer request',
    'Booking cancellation',
    'Service not provided',
    'Duplicate payment',
  ]),
  status: _mock.role(['pending', 'completed', 'failed']),
  requestedBy: {
    id: _mock.id(index + 200),
    name: _mock.fullName(index),
    email: _mock.email(index),
  },
  processedBy: {
    id: _mock.id(1),
    name: 'Admin User',
    email: 'admin@popnplace.com',
  },
  requestDate: _mock.time(index),
  processedDate: index % 3 === 0 ? _mock.time(index + 1) : null,
  notes: 'Refund processed due to early cancellation',
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
}));
