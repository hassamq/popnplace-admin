import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
// Parking
const ParkingListPage = lazy(() => import('src/pages/dashboard/parking/list'));
const ParkingNewPage = lazy(() => import('src/pages/dashboard/parking/new'));
const ParkingDetailsPage = lazy(() => import('src/pages/dashboard/parking/details'));
const ParkingEditPage = lazy(() => import('src/pages/dashboard/parking/edit'));
const ParkingTypesPage = lazy(() => import('src/pages/dashboard/parking/types'));
const ParkingPricingPage = lazy(() => import('src/pages/dashboard/parking/pricing'));
// Bookings
const BookingListPage = lazy(() => import('src/pages/dashboard/booking/list'));
const BookingActivePage = lazy(() => import('src/pages/dashboard/booking/active'));
const BookingPendingPage = lazy(() => import('src/pages/dashboard/booking/pending'));
const BookingCalendarPage = lazy(() => import('src/pages/dashboard/booking/calendar'));
const BookingDetailsPage = lazy(() => import('src/pages/dashboard/booking/details'));
// Payments
const PaymentListPage = lazy(() => import('src/pages/dashboard/payment/list'));
const PaymentPendingPage = lazy(() => import('src/pages/dashboard/payment/pending'));
const PaymentMethodsPage = lazy(() => import('src/pages/dashboard/payment/methods'));
const PaymentRefundsPage = lazy(() => import('src/pages/dashboard/payment/refunds'));
const PaymentDetailsPage = lazy(() => import('src/pages/dashboard/payment/details'));
// Owners
const OwnerListPage = lazy(() => import('src/pages/dashboard/owner/list'));
const OwnerNewPage = lazy(() => import('src/pages/dashboard/owner/new'));
const OwnerProfilesPage = lazy(() => import('src/pages/dashboard/owner/profiles'));
const OwnerVerificationPage = lazy(() => import('src/pages/dashboard/owner/verification'));
const OwnerDetailsPage = lazy(() => import('src/pages/dashboard/owner/details'));
const OwnerEditPage = lazy(() => import('src/pages/dashboard/owner/edit'));
// Renters
const RenterListPage = lazy(() => import('src/pages/dashboard/renter/list'));
const RenterProfilesPage = lazy(() => import('src/pages/dashboard/renter/profiles'));
const RenterChecksPage = lazy(() => import('src/pages/dashboard/renter/checks'));
const RenterDetailsPage = lazy(() => import('src/pages/dashboard/renter/details'));
const RenterEditPage = lazy(() => import('src/pages/dashboard/renter/edit'));
// Reports
const RevenueReportPage = lazy(() => import('src/pages/dashboard/report/revenue'));
const UtilizationReportPage = lazy(() => import('src/pages/dashboard/report/utilization'));
const UsersReportPage = lazy(() => import('src/pages/dashboard/report/users'));
const MarketReportPage = lazy(() => import('src/pages/dashboard/report/market'));
// Communication
const MessagesPage = lazy(() => import('src/pages/dashboard/communication/messages'));
const NotificationsPage = lazy(() => import('src/pages/dashboard/communication/notifications'));
const TemplatesPage = lazy(() => import('src/pages/dashboard/communication/templates'));
const SupportPage = lazy(() => import('src/pages/dashboard/communication/support'));
// Settings
const GeneralSettingsPage = lazy(() => import('src/pages/dashboard/settings/general'));
const PaymentSettingsPage = lazy(() => import('src/pages/dashboard/settings/payment'));
const NotificationSettingsPage = lazy(() => import('src/pages/dashboard/settings/notifications'));
const ApiSettingsPage = lazy(() => import('src/pages/dashboard/settings/api'));
// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// Tour
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
      {
        path: 'parking',
        children: [
          { element: <ParkingListPage />, index: true },
          { path: 'list', element: <ParkingListPage /> },
          { path: 'new', element: <ParkingNewPage /> },
          { path: 'types', element: <ParkingTypesPage /> },
          { path: 'pricing', element: <ParkingPricingPage /> },
          { path: ':id', element: <ParkingDetailsPage /> },
          { path: ':id/edit', element: <ParkingEditPage /> },
        ],
      },
      {
        path: 'bookings',
        children: [
          { element: <BookingListPage />, index: true },
          { path: 'list', element: <BookingListPage /> },
          { path: 'active', element: <BookingActivePage /> },
          { path: 'pending', element: <BookingPendingPage /> },
          { path: 'calendar', element: <BookingCalendarPage /> },
          { path: ':id', element: <BookingDetailsPage /> },
        ],
      },
      {
        path: 'payments',
        children: [
          { element: <PaymentListPage />, index: true },
          { path: 'list', element: <PaymentListPage /> },
          { path: 'pending', element: <PaymentPendingPage /> },
          { path: 'methods', element: <PaymentMethodsPage /> },
          { path: 'refunds', element: <PaymentRefundsPage /> },
          { path: ':id', element: <PaymentDetailsPage /> },
        ],
      },
      {
        path: 'owners',
        children: [
          { element: <OwnerListPage />, index: true },
          { path: 'list', element: <OwnerListPage /> },
          { path: 'new', element: <OwnerNewPage /> },
          { path: 'profiles', element: <OwnerProfilesPage /> },
          { path: 'verification', element: <OwnerVerificationPage /> },
          { path: ':id', element: <OwnerDetailsPage /> },
          { path: ':id/edit', element: <OwnerEditPage /> },
        ],
      },
      {
        path: 'tenants',
        children: [
          { element: <RenterListPage />, index: true },
          { path: 'list', element: <RenterListPage /> },
          { path: 'profiles', element: <RenterProfilesPage /> },
          { path: 'checks', element: <RenterChecksPage /> },
          { path: ':id', element: <RenterDetailsPage /> },
          { path: ':id/edit', element: <RenterEditPage /> },
        ],
      },
      {
        path: 'reports',
        children: [
          { element: <RevenueReportPage />, index: true },
          { path: 'revenue', element: <RevenueReportPage /> },
          { path: 'utilization', element: <UtilizationReportPage /> },
          { path: 'users', element: <UsersReportPage /> },
          { path: 'market', element: <MarketReportPage /> },
        ],
      },
      {
        path: 'communication',
        children: [
          { element: <MessagesPage />, index: true },
          { path: 'messages', element: <MessagesPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'templates', element: <TemplatesPage /> },
          { path: 'support', element: <SupportPage /> },
        ],
      },
      {
        path: 'settings',
        children: [
          { element: <GeneralSettingsPage />, index: true },
          { path: 'general', element: <GeneralSettingsPage /> },
          { path: 'payment', element: <PaymentSettingsPage /> },
          { path: 'notifications', element: <NotificationSettingsPage /> },
          { path: 'api', element: <ApiSettingsPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
