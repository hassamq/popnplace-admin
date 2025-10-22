import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { AnalyticsWidgetSummary } from 'src/sections/overview/analytics/analytics-widget-summary';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics/analytics-website-visits';
import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics/analytics-current-visits';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';
import { dashboardService } from 'src/services/api';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { AppTopInstalledCountries } from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();
  const theme = useTheme();

  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardStats();
        setDashboardStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to mock data if API fails
        setDashboardStats({
          userStats: {
            totalUsers: 8,
            totalHosts: 3,
            totalRenters: 4,
            totalAdmins: 1,
            activeUsers: 8,
            verifiedUsers: 4,
            newUsersThisMonth: 8,
            newUsersLastMonth: 0,
          },
          storageStats: {
            totalSpaces: 8,
            activeSpaces: 8,
            pendingSpaces: 0,
            verifiedSpaces: 6,
            totalViews: 0,
            avgRating: 0,
            newSpacesThisMonth: 8,
          },
          bookingStats: {
            totalBookings: 0,
            pendingBookings: 0,
            activeBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
            totalRevenue: 0,
            avgBookingValue: 0,
            newBookingsThisMonth: 0,
            revenueThisMonth: 0,
          },
          paymentStats: {
            totalPayments: 0,
            totalAmount: 0,
            totalServiceFees: 0,
            totalProcessingFees: 0,
            paymentsThisMonth: 0,
            revenueThisMonth: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Calculate percentage changes for metrics
  const calculatePercentChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const userPercentChange = dashboardStats
    ? calculatePercentChange(
        dashboardStats.userStats.newUsersThisMonth,
        dashboardStats.userStats.newUsersLastMonth
      )
    : 0;

  const spacesPercentChange = dashboardStats
    ? calculatePercentChange(
        dashboardStats.storageStats.newSpacesThisMonth,
        0 // Assuming no previous month data for now
      )
    : 0;

  const bookingsPercentChange = dashboardStats
    ? calculatePercentChange(
        dashboardStats.bookingStats.newBookingsThisMonth,
        0 // Assuming no previous month data for now
      )
    : 0;

  const revenuePercentChange = dashboardStats
    ? calculatePercentChange(
        dashboardStats.bookingStats.revenueThisMonth,
        0 // Assuming no previous month data for now
      )
    : 0;

  // Prepare chart data using analytics logic
  const processMonthlyData = () => {
    if (!dashboardStats?.monthlyData) return { categories: [], series: [] };
    const categories = dashboardStats.monthlyData.map((item) => {
      const date = new Date(`${item.month}-01`);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const series = [
      { name: 'Users', data: dashboardStats.monthlyData.map((item) => item.users) },
      { name: 'Bookings', data: dashboardStats.monthlyData.map((item) => item.bookings) },
      { name: 'Revenue', data: dashboardStats.monthlyData.map((item) => item.revenue) },
    ];
    return { categories, series };
  };

  const processBookingStats = () => {
    if (!dashboardStats?.bookingStats) return { series: [] };
    const bookingStats = dashboardStats.bookingStats;
    return {
      series: [
        { label: 'Total Bookings', value: bookingStats.totalBookings || 0 },
        { label: 'Pending Bookings', value: bookingStats.pendingBookings || 0 },
        { label: 'Active Bookings', value: bookingStats.activeBookings || 0 },
        { label: 'Completed Bookings', value: bookingStats.completedBookings || 0 },
        { label: 'Cancelled Bookings', value: bookingStats.cancelledBookings || 0 },
      ],
    };
  };

  const processPaymentStats = () => {
    if (!dashboardStats?.paymentStats) return { series: [] };
    const paymentStats = dashboardStats.paymentStats;
    return {
      series: [
        { label: 'Total Payments', value: paymentStats.totalPayments || 0 },
        { label: 'Total Amount', value: paymentStats.totalAmount || 0 },
        { label: 'Service Fees', value: paymentStats.totalServiceFees || 0 },
        { label: 'Processing Fees', value: paymentStats.totalProcessingFees || 0 },
      ],
    };
  };

  const monthlyChart = processMonthlyData();
  const bookingChart = processBookingStats();
  const paymentChart = processPaymentStats();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Welcome back 👋 ${user?.data?.firstName} ${user?.data?.lastName}!`}
            description="Manage your parking spaces and rental properties efficiently with PopnPlace Admin Panel."
            // img={<SeoIllustration hideBackground />}
          />
        </Grid>
        {/* <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

        {/* Modern Analytics Widgets - All Cards, Equal Height */}
        <Grid xs={12}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Total Parking Spaces */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Total Parking Spaces"
                percent={spacesPercentChange}
                total={dashboardStats?.storageStats?.totalSpaces || 0}
                icon={<Iconify icon="mdi:car" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[1]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Active Bookings */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Active Bookings"
                percent={bookingsPercentChange}
                total={dashboardStats?.bookingStats?.activeBookings || 0}
                color="info"
                icon={<Iconify icon="mdi:calendar-check" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[1]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Monthly Revenue */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Monthly Revenue"
                percent={revenuePercentChange}
                total={dashboardStats?.bookingStats?.revenueThisMonth || 0}
                color="warning"
                icon={<Iconify icon="mdi:currency-usd" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[2]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Registered Users */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Registered Users"
                percent={userPercentChange}
                total={dashboardStats?.userStats?.totalUsers || 0}
                color="error"
                icon={<Iconify icon="mdi:account-group" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[0]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Space Owners */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Space Owners"
                percent={0}
                total={dashboardStats?.userStats?.totalHosts || 0}
                color="success"
                icon={<Iconify icon="mdi:account-star" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[1]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Total Revenue */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Total Revenue"
                percent={0}
                total={dashboardStats?.bookingStats?.totalRevenue || 0}
                color="primary"
                icon={<Iconify icon="mdi:bank" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[2]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Verified Users */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Verified Users"
                percent={0}
                total={dashboardStats?.userStats?.verifiedUsers || 0}
                color="info"
                icon={<Iconify icon="mdi:shield-check" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[0]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            {/* Active Spaces */}
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <AnalyticsWidgetSummary
                title="Active Spaces"
                percent={0}
                total={dashboardStats?.storageStats?.activeSpaces || 0}
                color="warning"
                icon={<Iconify icon="mdi:parking" />}
                chart={{
                  categories: monthlyChart.categories,
                  series: monthlyChart.series[1]?.data || [],
                }}
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Main Trends and Booking Distribution - 100% width, stacked column */}
        <Grid xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <AnalyticsWebsiteVisits
                title="Monthly Trends"
                subheader="Yearly overview of users, bookings, and revenue"
                chart={monthlyChart}
              />
            </Box>
            <Box>
              <AnalyticsCurrentVisits
                title="Booking Distribution"
                chart={{
                  ...bookingChart,
                  series: bookingChart.series.every((item) => item.value === 0)
                    ? bookingChart.series.map((item, idx) => ({
                        ...item,
                        value: idx === 0 ? 1 : 0,
                      }))
                    : bookingChart.series,
                  colors: bookingChart.series.every((item) => item.value === 0)
                    ? [
                        theme.palette.grey[400],
                        theme.palette.grey[400],
                        theme.palette.grey[400],
                        theme.palette.grey[400],
                        theme.palette.grey[400],
                      ]
                    : [
                        theme.palette.primary.main,
                        theme.palette.warning.light,
                        theme.palette.info.dark,
                        theme.palette.error.main,
                        theme.palette.success.main,
                      ],
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Payment Distribution Pie Chart - 100% width, always rendered */}
        <Grid xs={12}>
          <AnalyticsWebsiteVisits
            title="Payment Distribution"
            subheader="Payments, Amount, Service & Processing Fees"
            chart={{
              categories: ['Total Payments', 'Total Amount', 'Service Fees', 'Processing Fees'],
              series: [
                {
                  name: 'Payments',
                  data: paymentChart.series.map((item) => item.value),
                },
              ],
              colors: paymentChart.series.every((item) => item.value === 0)
                ? [theme.palette.grey[400]]
                : [theme.palette.primary.main],
              options: {
                chart: { type: 'line' },
                stroke: { curve: 'smooth', width: 3 },
                markers: { size: 6 },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.5,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.7,
                    opacityTo: 0.2,
                  },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
