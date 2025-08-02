import { fSub } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _fileNames,
  _postTitles,
  _firstNames,
  _eventNames,
  _courseNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
  _countryNames,
} from './assets';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index) => _id[index],
  time: (index) => fSub({ days: index, hours: index }),
  boolean: (index) => _booleans[index],
  role: (index) => _roles[index],
  // Text
  courseNames: (index) => _courseNames[index],
  fileNames: (index) => _fileNames[index],
  eventNames: (index) => _eventNames[index],
  taskNames: (index) => _taskNames[index],
  postTitle: (index) => _postTitles[index],
  jobTitle: (index) => _jobTitles[index],
  tourName: (index) => _tourNames[index],
  productName: (index) => _productNames[index],
  sentence: (index) => _sentences[index],
  description: (index) => _descriptions[index],
  // Contact
  email: (index) => _emails[index],
  phoneNumber: (index) => _phoneNumbers[index],
  fullAddress: (index) => _fullAddress[index],
  // Name
  firstName: (index) => _firstNames[index],
  lastName: (index) => _lastNames[index],
  fullName: (index) => _fullNames[index],
  companyNames: (index) => _companyNames[index],
  countryNames: (index) => _countryNames[index],
  // Number
  number: {
    percent: (index) => _percents[index],
    rating: (index) => _ratings[index],
    age: (index) => _ages[index],
    price: (index) => _prices[index],
    nativeS: (index) => _nativeS[index],
    nativeM: (index) => _nativeM[index],
    nativeL: (index) => _nativeL[index],
    latitude: (index) => 40.7128 + index * 0.01 - 0.1, // NYC area with variation
    longitude: (index) => -74.006 + index * 0.01 - 0.1, // NYC area with variation
  },
  // Image
  image: {
    cover: (index) => `${CONFIG.assetsDir}/assets/images/mock/cover/cover-${index + 1}.webp`,
    avatar: (index) => `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index + 1}.webp`,
    travel: (index) => `${CONFIG.assetsDir}/assets/images/mock/travel/travel-${index + 1}.webp`,
    course: (index) => `${CONFIG.assetsDir}/assets/images/mock/course/course-${index + 1}.webp`,
    company: (index) => `${CONFIG.assetsDir}/assets/images/mock/company/company-${index + 1}.webp`,
    product: (index) =>
      `${CONFIG.assetsDir}/assets/images/mock/m-product/product-${index + 1}.webp`,
    portrait: (index) =>
      `${CONFIG.assetsDir}/assets/images/mock/portrait/portrait-${index + 1}.webp`,
  },
  // Parking specific mock data
  parkingType: (index) => {
    const types = [
      'Standard',
      'Compact',
      'SUV/Truck',
      'Motorcycle',
      'Electric Vehicle',
      'Disabled',
      'VIP/Premium',
    ];
    return types[index % types.length];
  },
  parkingLocation: (index) => {
    const locations = [
      'Downtown Plaza',
      'Mall Parking',
      'Business District',
      'Residential Area',
      'Airport Terminal',
      'Hospital Complex',
      'University Campus',
      'Shopping Center',
    ];
    return locations[index % locations.length];
  },
  parkingStatus: (index) => {
    const statuses = ['available', 'occupied', 'maintenance', 'reserved'];
    return statuses[index % statuses.length];
  },
  parkingFeatures: (index) => {
    const allFeatures = [
      'Covered',
      'Security Camera',
      'EV Charging',
      'Disabled Access',
      '24/7 Access',
      'Lighting',
      'Security Guard',
    ];
    const numFeatures = Math.floor(Math.random() * 4) + 1;
    return allFeatures.slice(0, numFeatures);
  },
};
