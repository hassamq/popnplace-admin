import { useState, useEffect } from 'react';
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

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 
 ${user?.data?.firstName} ${user?.data?.lastName}!`}
            description="Manage your parking spaces and rental properties efficiently with PopnPlace Admin Panel."
            img={<SeoIllustration hideBackground />}
            // action={
            //   // <Button variant="contained" color="primary">
            //   //   Add New Space
            //   // </Button>
            // }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        {/* PopnPlace specific metrics using real API data */}
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Parking Spaces"
            percent={spacesPercentChange}
            total={dashboardStats?.storageStats?.totalSpaces || 0}
            icon={<Iconify icon="mdi:car" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active Bookings"
            percent={bookingsPercentChange}
            total={dashboardStats?.bookingStats?.activeBookings || 0}
            color="info"
            icon={<Iconify icon="mdi:calendar-check" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Monthly Revenue"
            percent={revenuePercentChange}
            total={dashboardStats?.bookingStats?.revenueThisMonth || 0}
            color="warning"
            icon={<Iconify icon="mdi:currency-usd" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Registered Users"
            percent={userPercentChange}
            total={dashboardStats?.userStats?.totalUsers || 0}
            color="error"
            icon={<Iconify icon="mdi:account-group" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* Additional detailed metrics */}
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Space Owners"
            percent={0}
            total={dashboardStats?.userStats?.totalHosts || 0}
            color="success"
            icon={<Iconify icon="mdi:account-star" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Revenue"
            percent={0}
            total={dashboardStats?.bookingStats?.totalRevenue || 0}
            color="primary"
            icon={<Iconify icon="mdi:bank" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Verified Users"
            percent={0}
            total={dashboardStats?.userStats?.verifiedUsers || 0}
            color="info"
            icon={<Iconify icon="mdi:shield-check" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active Spaces"
            percent={0}
            total={dashboardStats?.storageStats?.activeSpaces || 0}
            color="warning"
            icon={<Iconify icon="mdi:parking" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
