import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const BOOKING_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const BOOKING_TYPE_OPTIONS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// ----------------------------------------------------------------------

export const _bookingList = [...Array(36)].map((_, index) => ({
  id: _mock.id(index),
  bookingNumber: `BK-${String(1000 + index).padStart(4, '0')}`,
  spaceId: _mock.id(index % 24),
  spaceName: `Parking Space ${(index % 24) + 1}`,
  spaceType: _mock.role(['covered', 'uncovered', 'garage', 'street']),
  spaceLocation: _mock.companyNames(1),
  renter: {
    id: _mock.id(index + 200),
    name: _mock.fullName(index),
    email: _mock.email(index),
    phone: _mock.phoneNumber(index),
    avatarUrl: _mock.image.avatar(index),
  },
  owner: {
    id: _mock.id(index + 100),
    name: _mock.fullName(index + 50),
    email: _mock.email(index + 50),
    phone: _mock.phoneNumber(index + 50),
  },
  bookingType: _mock.role(['hourly', 'daily', 'weekly', 'monthly']),
  startDate: _mock.time(index),
  endDate: _mock.time(index + 1),
  duration: _mock.number.nativeL(1, 30),
  pricePerHour: _mock.number.price(5, 50),
  totalAmount: _mock.number.price(50, 1500),
  paidAmount: _mock.number.price(50, 1500),
  status: _mock.role(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  paymentStatus: _mock.role(['pending', 'paid', 'partially_paid', 'refunded']),
  vehicleInfo: {
    make: _mock.role(['Toyota', 'Honda', 'Ford', 'Tesla', 'BMW', 'Mercedes', 'Audi']),
    model: _mock.role(['Camry', 'Accord', 'F-150', 'Model 3', 'X5', 'C-Class', 'A4']),
    licensePlate: `${_mock.role(['ABC', 'XYZ', 'DEF', 'GHI'])}-${Math.floor(1000 + Math.random() * 9000)}`,
    color: _mock.role(['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray']),
  },
  checkIn: index % 3 === 0 ? _mock.time(index) : null,
  checkOut: index % 5 === 0 ? _mock.time(index + 1) : null,
  notes: 'Special instructions or notes about the booking',
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
}));

// Single booking detail
export const _booking = {
  id: _mock.id(1),
  bookingNumber: 'BK-1001',
  spaceId: _mock.id(1),
  spaceName: 'Premium Covered Parking Space A1',
  spaceType: 'covered',
  spaceLocation: 'Downtown Business Center',
  spaceAddress: '123 Main Street, Business District, City, State 12345',
  renter: {
    id: _mock.id(201),
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 987-6543',
    avatarUrl: _mock.image.avatar(1),
    rating: 4.8,
    totalBookings: 25,
  },
  owner: {
    id: _mock.id(101),
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: _mock.image.avatar(2),
  },
  bookingType: 'daily',
  startDate: _mock.time(1),
  endDate: _mock.time(5),
  duration: 5,
  pricePerHour: 25,
  totalAmount: 500,
  paidAmount: 500,
  status: 'active',
  paymentStatus: 'paid',
  vehicleInfo: {
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    licensePlate: 'ABC-1234',
    color: 'Silver',
    vin: '1HGBH41JXMN109186',
  },
  checkIn: _mock.time(1),
  checkOut: null,
  checkInPhoto: _mock.image.product(1),
  checkOutPhoto: null,
  notes: 'Requested space close to elevator',
  paymentHistory: [
    {
      id: _mock.id(301),
      amount: 500,
      method: 'credit_card',
      status: 'completed',
      transactionId: 'TXN-001-ABC',
      date: _mock.time(1),
    },
  ],
  timeline: [
    {
      id: 1,
      title: 'Booking Created',
      description: 'Booking request submitted by customer',
      time: _mock.time(1),
    },
    {
      id: 2,
      title: 'Payment Received',
      description: 'Payment of $500 received via credit card',
      time: _mock.time(1),
    },
    {
      id: 3,
      title: 'Booking Confirmed',
      description: 'Booking confirmed by space owner',
      time: _mock.time(1),
    },
    {
      id: 4,
      title: 'Check-in Completed',
      description: 'Customer checked in to parking space',
      time: _mock.time(1),
    },
  ],
  createdAt: _mock.time(1),
  updatedAt: _mock.time(1),
};
