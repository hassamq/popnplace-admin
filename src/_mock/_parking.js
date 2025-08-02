import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const PARKING_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Under Maintenance' },
];

export const PARKING_TYPE_OPTIONS = [
  { value: 'covered', label: 'Covered' },
  { value: 'uncovered', label: 'Uncovered' },
  { value: 'garage', label: 'Garage' },
  { value: 'street', label: 'Street' },
];

export const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
];

// ----------------------------------------------------------------------

export const _parkingList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  name: `Parking Space ${index + 1}`,
  type: _mock.role(['covered', 'uncovered', 'garage', 'street']),
  location: _mock.companyNames(1),
  address: _mock.fullAddress(index),
  price: _mock.number.price(5, 50),
  status: _mock.role(['active', 'inactive', 'maintenance']),
  availability: _mock.role(['available', 'occupied', 'reserved']),
  description: 'Secure parking space with 24/7 access and security monitoring.',
  features: _mock.role([
    ['Security Camera', 'Well Lit'],
    ['Covered', 'EV Charging'],
    ['24/7 Access', 'Close to Entrance'],
    ['Handicap Accessible', 'Valet Service'],
  ]),
  maxVehicleSize: _mock.role(['Compact', 'Sedan', 'SUV', 'Large Vehicle']),
  accessHours: '24/7',
  owner: {
    id: _mock.id(index + 100),
    name: _mock.fullName(index),
    email: _mock.email(index),
    phone: _mock.phoneNumber(index),
    avatarUrl: _mock.image.avatar(index),
  },
  images: [
    _mock.image.product(index),
    _mock.image.product(index + 1),
    _mock.image.product(index + 2),
  ],
  coordinates: {
    lat: _mock.number.latitude(),
    lng: _mock.number.longitude(),
  },
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index),
}));

// Single parking space
export const _parkingSpace = {
  id: _mock.id(1),
  name: 'Premium Covered Parking Space A1',
  type: 'covered',
  location: 'Downtown Business Center',
  address: '123 Main Street, Business District, City, State 12345',
  price: 25,
  status: 'active',
  availability: 'available',
  description:
    'Premium covered parking space in the heart of downtown business district. Features include security cameras, well-lit area, and easy access to building entrance. Perfect for daily commuters and business professionals.',
  features: ['Security Camera', 'Covered', 'Well Lit', '24/7 Access', 'Close to Entrance'],
  maxVehicleSize: 'SUV',
  accessHours: '24/7',
  owner: {
    id: _mock.id(101),
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: _mock.image.avatar(1),
  },
  images: [
    _mock.image.product(1),
    _mock.image.product(2),
    _mock.image.product(3),
    _mock.image.product(4),
  ],
  coordinates: {
    lat: 40.7128,
    lng: -74.006,
  },
  bookings: [
    {
      id: _mock.id(201),
      user: {
        name: _mock.fullName(1),
        email: _mock.email(1),
        phone: _mock.phoneNumber(1),
      },
      startDate: _mock.time(1),
      endDate: _mock.time(2),
      status: 'confirmed',
      totalAmount: 150,
    },
    {
      id: _mock.id(202),
      user: {
        name: _mock.fullName(2),
        email: _mock.email(2),
        phone: _mock.phoneNumber(2),
      },
      startDate: _mock.time(3),
      endDate: _mock.time(4),
      status: 'pending',
      totalAmount: 200,
    },
  ],
  revenue: {
    thisMonth: 1250,
    lastMonth: 980,
    total: 15600,
  },
  utilization: {
    thisMonth: 85,
    lastMonth: 72,
    average: 78,
  },
  createdAt: _mock.time(1),
  updatedAt: _mock.time(1),
};
