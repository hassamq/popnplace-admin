import { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { dashboardService } from 'src/services/api';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardStats();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to mock data if API fails
        setDashboardData({
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
          reviewStats: {
            totalReviews: 0,
            publishedReviews: 0,
            pendingReviews: 0,
            flaggedReviews: 0,
            avgRating: 0,
            reviewsThisMonth: 0,
          },
          monthlyData: [
            {
              month: '2025-02',
              users: 0,
              bookings: 0,
              revenue: 0,
            },
            {
              month: '2025-03',
              users: 0,
              bookings: 0,
              revenue: 0,
            },
            {
              month: '2025-04',
              users: 0,
              bookings: 0,
              revenue: 0,
            },
            {
              month: '2025-05',
              users: 0,
              bookings: 0,
              revenue: 0,
            },
            {
              month: '2025-06',
              users: 0,
              bookings: 0,
              revenue: 0,
            },
            {
              month: '2025-07',
              users: 0,
              bookings: 0,
              revenue: 0,
            },
            {
              month: '2025-08',
              users: 8,
              bookings: 0,
              revenue: 0,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Process monthly data for charts
  const processMonthlyData = () => {
    if (!dashboardData?.monthlyData) return { categories: [], series: [] };

    const categories = dashboardData.monthlyData.map((item) => {
      const date = new Date(`${item.month}-01`);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    const series = [
      {
        name: 'Users',
        data: dashboardData.monthlyData.map((item) => item.users),
      },
      {
        name: 'Bookings',
        data: dashboardData.monthlyData.map((item) => item.bookings),
      },
      {
        name: 'Revenue',
        data: dashboardData.monthlyData.map((item) => item.revenue),
      },
    ];

    return { categories, series };
  };

  // Process booking stats for pie chart
  const processBookingStats = () => {
    if (!dashboardData?.bookingStats) return { series: [] };

    const bookingStats = dashboardData.bookingStats;

    return {
      series: [
        {
          label: 'Total Bookings',
          value: bookingStats.totalBookings || 0,
        },
        {
          label: 'Pending Bookings',
          value: bookingStats.pendingBookings || 0,
        },
        {
          label: 'Active Bookings',
          value: bookingStats.activeBookings || 0,
        },
        {
          label: 'Completed Bookings',
          value: bookingStats.completedBookings || 0,
        },
        {
          label: 'Cancelled Bookings',
          value: bookingStats.cancelledBookings || 0,
        },
      ],
    };
  };

  // Process payment stats for pie chart
  const processPaymentStats = () => {
    if (!dashboardData?.paymentStats) return { series: [] };

    const paymentStats = dashboardData.paymentStats;

    return {
      series: [
        {
          label: 'Total Payments',
          value: paymentStats.totalPayments || 0,
        },
        {
          label: 'Total Amount',
          value: paymentStats.totalAmount || 0,
        },
        {
          label: 'Service Fees',
          value: paymentStats.totalServiceFees || 0,
        },
        {
          label: 'Processing Fees',
          value: paymentStats.totalProcessingFees || 0,
        },
      ],
    };
  };

  const monthlyChart = processMonthlyData();
  const bookingChart = processBookingStats();
  const paymentChart = processPaymentStats();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* User Metrics */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Users"
            percent={0}
            total={dashboardData?.userStats?.totalUsers || 0}
            icon={<Iconify icon="mdi:account-group" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Spaces"
            percent={0}
            total={dashboardData?.storageStats?.totalSpaces || 0}
            color="secondary"
            icon={<Iconify icon="mdi:car" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Bookings"
            percent={0}
            total={dashboardData?.bookingStats?.totalBookings || 0}
            color="warning"
            icon={<Iconify icon="mdi:calendar-check" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Revenue"
            percent={0}
            total={dashboardData?.bookingStats?.totalRevenue || 0}
            color="error"
            icon={<Iconify icon="mdi:currency-usd" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* Monthly Trends Chart */}
        <Grid xs={12} md={8}>
          <AnalyticsWebsiteVisits
            title="Monthly Trends"
            subheader="Yearly overview of users, bookings, and revenue"
            chart={monthlyChart}
          />
        </Grid>

        {/* Booking Distribution */}
        <Grid xs={12} md={4}>
          <AnalyticsCurrentVisits title="Booking Distribution" chart={bookingChart} />
        </Grid>

        {/* Payment Distribution */}
        <Grid xs={12} md={4}>
          <AnalyticsCurrentVisits title="Payment Distribution" chart={paymentChart} />
        </Grid>

        {/* Additional Metrics */}
        <Grid xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  User Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hosts: {dashboardData?.userStats?.totalHosts || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Renters: {dashboardData?.userStats?.totalRenters || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified Users: {dashboardData?.userStats?.verifiedUsers || 0}
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Space Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Spaces: {dashboardData?.storageStats?.activeSpaces || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified Spaces: {dashboardData?.storageStats?.verifiedSpaces || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Rating: {dashboardData?.storageStats?.avgRating || 0}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
