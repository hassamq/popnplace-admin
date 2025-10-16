import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const OWNER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

export const VERIFICATION_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'incomplete', label: 'Incomplete' },
];

// ----------------------------------------------------------------------

export const _ownerList = [...Array(30)].map((_, index) => ({
  id: _mock.id(index + 100),
  name: _mock.fullName(index),
  email: _mock.email(index),
  phone: _mock.phoneNumber(index),
  avatarUrl: _mock.image.avatar(index),
  status: _mock.role(['active', 'inactive', 'suspended']),
  verificationStatus: _mock.role(['pending', 'verified', 'rejected', 'incomplete']),
  totalSpaces: _mock.number.nativeL(1, 15),
  activeSpaces: _mock.number.nativeL(1, 10),
  totalRevenue: _mock.number.price(1000, 50000),
  monthlyRevenue: _mock.number.price(500, 5000),
  rating: _mock.number.rating(3.5, 5),
  totalReviews: _mock.number.nativeL(5, 100),
  totalBookings: _mock.number.nativeL(10, 200),
  joinedDate: _mock.time(index),
  lastActive: _mock.time(index),
  address: {
    street: _mock.fullAddress(index),
    city: _mock.role(['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven']),
    zipCode: `${Math.floor(1000 + Math.random() * 9000)} ${_mock.role(['AB', 'CD', 'EF', 'GH'])}`,
    country: 'Netherlands',
  },
  bankAccount: {
    accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
    bankName: _mock.role(['ING Bank', 'ABN AMRO', 'Rabobank', 'SNS Bank']),
    verified: index % 3 === 0,
  },
  documents: {
    idVerified: index % 2 === 0,
    addressVerified: index % 3 === 0,
    bankVerified: index % 3 === 0,
    taxInfoProvided: index % 4 === 0,
  },
  payoutSchedule: _mock.role(['daily', 'weekly', 'monthly']),
  commission: 15, // percentage
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
}));

// Single owner detail
export const _owner = {
  id: _mock.id(100),
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+31 6 1234 5678',
  avatarUrl: _mock.image.avatar(1),
  status: 'active',
  verificationStatus: 'verified',
  bio: 'Experienced parking space owner with multiple locations in Amsterdam. Committed to providing quality parking services.',
  totalSpaces: 8,
  activeSpaces: 7,
  totalRevenue: 25600,
  monthlyRevenue: 3200,
  yearlyRevenue: 38400,
  rating: 4.7,
  totalReviews: 45,
  totalBookings: 156,
  completedBookings: 148,
  cancelledBookings: 8,
  joinedDate: _mock.time(1),
  lastActive: _mock.time(0),
  address: {
    street: 'Keizersgracht 123',
    city: 'Amsterdam',
    zipCode: '1015 CJ',
    country: 'Netherlands',
  },
  bankAccount: {
    accountNumber: 'NL91 ABNA 0417 1643 00',
    accountNumberMasked: '****1643',
    accountHolder: 'John Smith',
    bankName: 'ABN AMRO',
    bic: 'ABNANL2A',
    verified: true,
    verifiedDate: _mock.time(2),
  },
  documents: {
    idType: 'passport',
    idNumber: '****6789',
    idVerified: true,
    idVerifiedDate: _mock.time(2),
    addressVerified: true,
    addressVerifiedDate: _mock.time(2),
    bankVerified: true,
    bankVerifiedDate: _mock.time(2),
    taxInfoProvided: true,
    taxNumber: 'NL****123B01',
  },
  payoutSchedule: 'weekly',
  nextPayout: _mock.time(7),
  commission: 15,
  spaces: [
    {
      id: _mock.id(1),
      name: 'Parking Space 1',
      type: 'covered',
      status: 'active',
      price: 25,
      monthlyRevenue: 800,
    },
    {
      id: _mock.id(2),
      name: 'Parking Space 2',
      type: 'garage',
      status: 'active',
      price: 35,
      monthlyRevenue: 1200,
    },
  ],
  recentBookings: [
    {
      id: _mock.id(201),
      bookingNumber: 'BK-1001',
      spaceName: 'Parking Space 1',
      renterName: _mock.fullName(1),
      amount: 500,
      status: 'completed',
      date: _mock.time(1),
    },
    {
      id: _mock.id(202),
      bookingNumber: 'BK-1002',
      spaceName: 'Parking Space 2',
      renterName: _mock.fullName(2),
      amount: 700,
      status: 'active',
      date: _mock.time(2),
    },
  ],
  recentReviews: [
    {
      id: _mock.id(1),
      rating: 5,
      comment: 'Great parking space, very secure and clean.',
      reviewer: _mock.fullName(1),
      date: _mock.time(1),
    },
    {
      id: _mock.id(2),
      rating: 4,
      comment: 'Good location, easy access.',
      reviewer: _mock.fullName(2),
      date: _mock.time(2),
    },
  ],
  statistics: {
    occupancyRate: 85,
    averageBookingDuration: 5.2,
    repeatCustomerRate: 42,
    cancellationRate: 5,
  },
  createdAt: _mock.time(30),
  updatedAt: _mock.time(0),
};

// Verification requests
export const _verificationList = [...Array(15)].map((_, index) => ({
  id: _mock.id(index + 500),
  ownerId: _mock.id(index + 100),
  ownerName: _mock.fullName(index),
  ownerEmail: _mock.email(index),
  verificationType: _mock.role(['identity', 'address', 'bank', 'tax']),
  status: _mock.role(['pending', 'verified', 'rejected', 'incomplete']),
  documentType: _mock.role(['passport', 'id_card', 'driver_license', 'utility_bill', 'bank_statement']),
  documentUrl: _mock.image.product(index),
  submittedDate: _mock.time(index),
  reviewedDate: index % 3 === 0 ? _mock.time(index + 1) : null,
  reviewedBy: index % 3 === 0 ? 'Admin User' : null,
  notes: index % 3 === 1 ? 'Document unclear, please resubmit' : '',
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
}));
