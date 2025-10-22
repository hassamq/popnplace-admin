import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ICONS = {
  // PopnPlace specific icons using Iconify
  parking: <Iconify icon="mdi:car" />,
  spaces: <Iconify icon="mdi:parking" />,
  bookings: <Iconify icon="mdi:calendar-check" />,
  payments: <Iconify icon="mdi:credit-card" />,
  analytics: <Iconify icon="mdi:chart-line" />,
  settings: <Iconify icon="mdi:cog" />,
  users: <Iconify icon="mdi:account-group" />,
  owners: <Iconify icon="mdi:account-star" />,
  tenants: <Iconify icon="mdi:account" />,
  reports: <Iconify icon="mdi:file-chart" />,
  communication: <Iconify icon="mdi:message-text" />,
  dashboard: <Iconify icon="mdi:view-dashboard" />,
  types: <Iconify icon="mdi:format-list-bulleted" />,
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Dashboard
   */
  {
    subheader: 'Dashboard',
    items: [
      { title: 'Overview', path: paths.dashboard.root, icon: ICONS.dashboard },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
    ],
  },
  /**
   * Space Management
   */
  {
    subheader: 'Storage Management',
    items: [
      {
        title: 'Storage',
        path: paths.dashboard.parking.list,
        icon: ICONS.parking,
        // children: [
        //   { title: 'All Spaces', path: paths.dashboard.parking.list },
        //   { title: 'Add New Space', path: paths.dashboard.parking.new },
        //   { title: 'Space Types', path: paths.dashboard.parking.types },
        //   { title: 'Pricing Rules', path: paths.dashboard.parking.pricing },
        // ],
      },
      {
        title: 'Storage Types',
        path: paths.dashboard.parking.types,
        icon: ICONS.types,
      }
    ],
  },
  /**
   * Bookings & Reservations
   */
  {
    subheader: 'Bookings & Reservations',
    items: [
      {
        title: 'Bookings',
        path: paths.dashboard.bookings.list,
        icon: ICONS.bookings,
        // children: [
        //   { title: 'All Bookings', path: paths.dashboard.bookings.list },
        //   { title: 'Active Bookings', path: paths.dashboard.bookings.active },
        //   { title: 'Pending Approval', path: paths.dashboard.bookings.pending },
        //   { title: 'Calendar View', path: paths.dashboard.bookings.calendar },
        // ],
      },
      {
        title: 'Payments',
        path: paths.dashboard.payments.list,
        icon: ICONS.payments,
        // children: [
        //   { title: 'All Transactions', path: paths.dashboard.payments.list },
        //   { title: 'Pending Payments', path: paths.dashboard.payments.pending },
        //   { title: 'Payment Methods', path: paths.dashboard.payments.methods },
        //   { title: 'Refunds', path: paths.dashboard.payments.refunds },
        // ],
      },
    ],
  },
  /**
   * User Management
   */
  {
    subheader: 'User Management',
    items: [
      {
        title: 'Space Owners',
        path: paths.dashboard.owners.list, // now links to hosts page
        icon: ICONS.owners,
        // children: [
        //   { title: 'All Owners', path: paths.dashboard.owners.list },
        //   { title: 'Add Owner', path: paths.dashboard.owners.new },
        //   { title: 'Owner Profiles', path: paths.dashboard.owners.profiles },
        //   { title: 'Verification', path: paths.dashboard.owners.verification },
        // ],
      },
      {
        title: 'Renters',
        path: paths.dashboard.renters.list,
        icon: ICONS.tenants,
        // children: [
        //   { title: 'All Renters', path: paths.dashboard.renters.list },
        //   { title: 'Renter Profiles', path: paths.dashboard.renters.profiles },
        //   { title: 'Background Checks', path: paths.dashboard.renters.checks },
        // ],
      },
    ],
  },
  /**
   * System Management
   */
  // {
  //   subheader: 'System Management',
  //   items: [
  //     {
  //       title: 'Reports & Analytics',
  //       path: paths.dashboard.reports.root,
  //       icon: ICONS.reports,
  //       children: [
  //         { title: 'Revenue Reports', path: paths.dashboard.reports.revenue },
  //         { title: 'Space Utilization', path: paths.dashboard.reports.utilization },
  //         { title: 'User Analytics', path: paths.dashboard.reports.users },
  //         { title: 'Market Insights', path: paths.dashboard.reports.market },
  //       ],
  //     },
  //     {
  //       title: 'Communication',
  //       path: paths.dashboard.communication.root,
  //       icon: ICONS.communication,
  //       children: [
  //         { title: 'Messages', path: paths.dashboard.communication.messages },
  //         { title: 'Notifications', path: paths.dashboard.communication.notifications },
  //         { title: 'Email Templates', path: paths.dashboard.communication.templates },
  //         { title: 'Support Tickets', path: paths.dashboard.communication.support },
  //       ],
  //     },
  //     // {
  //     //   title: 'Settings',
  //     //   path: paths.dashboard.settings.root,
  //     //   icon: ICONS.settings,
  //     //   children: [
  //     //     { title: 'General Settings', path: paths.dashboard.settings.general },
  //     //     { title: 'Payment Settings', path: paths.dashboard.settings.payment },
  //     //     { title: 'Notification Settings', path: paths.dashboard.settings.notifications },
  //     //     { title: 'API Configuration', path: paths.dashboard.settings.api },
  //     //   ],
  //     // },
  //   ],
  // },
];
