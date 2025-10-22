import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { useEffect, useState } from 'react';
import { bookingsService } from 'src/services/api';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';

import { BookingBooked } from '../booking-booked';
import { BookingNewest } from '../booking-newest';
import { BookingDetails } from '../booking-details';
import { BookingAvailable } from '../booking-available';
import { BookingStatistics } from '../booking-statistics';
import { BookingTotalIncomes } from '../booking-total-incomes';
import { BookingWidgetSummary } from '../booking-widget-summary';
import { BookingCheckInWidgets } from '../booking-check-in-widgets';
import { BookingCustomerReviews } from '../booking-customer-reviews';

// ----------------------------------------------------------------------

export function OverviewBookingView() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalBookings: 0,
    sold: 0,
    canceled: 0,
    incomes: 0,
    incomesPercent: 0,
    booked: [],
    available: { total: 0, soldOut: 0, available: 0 },
  });

  const fetchBookings = async (page = 1, limit = 10) => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingsService.getBookings({ page, limit });
      const data = res.data;
      // Map bookings for table
      const mapped = (data?.bookings || []).map((b) => ({
        id: b.id || b._id,
        destination: {
          name: b.storageSpace?.title || '-',
          coverUrl:
            b.storageSpace?.primaryImage ||
            (b.storageSpace?.images?.length ? b.storageSpace.images[0].url : undefined) ||
            '',
        },
        customer: {
          name: `${b.renter?.firstName || ''} ${b.renter?.lastName || ''}`.trim(),
          phoneNumber: b.renter?.email || '-',
        },
        checkIn: b.bookingDetails?.startDate,
        checkOut: b.bookingDetails?.endDate,
        status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : '-',
      }));
      setBookings(mapped);
      setPagination(data?.pagination || { current: 1, pages: 1, total: 0 });

      // Map stats from API response
      const apiStats = data?.stats || {};
      setStats({
        totalBookings: apiStats.totalBookings || 0,
        sold: apiStats.activeBookings || 0,
        canceled: apiStats.completedBookings || 0, // Adjust if you have a separate canceled stat
        incomes: apiStats.totalAmount || 0,
        incomesPercent: 0, // You can calculate this if you have previous month data
        booked: [
          { status: 'Pending', quantity: apiStats.pendingBookings || 0, value: 0 },
          { status: 'Active', quantity: apiStats.activeBookings || 0, value: 0 },
          { status: 'Completed', quantity: apiStats.completedBookings || 0, value: 0 },
        ],
        available: { total: 0, soldOut: 0, available: 0 }, // Fill if you have this data
      });
    } catch (e) {
      setError(e?.message || 'Failed to fetch bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings(1, 10);
    // eslint-disable-next-line
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} disableEqualOverflow>
        {/* Top summary widgets */}
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Total booking"
            total={stats.totalBookings}
            percent={stats.incomesPercent}
            icon={<BookingIllustration />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Sold"
            total={stats.sold}
            percent={stats.incomesPercent}
            icon={<CheckInIllustration />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Completed"
            total={stats.canceled}
            percent={stats.incomesPercent}
            icon={<CheckoutIllustration />}
          />
        </Grid>

        {/* Incomes, Booked, Available */}
        <Grid xs={12} md={8}>
          <BookingTotalIncomes
            title="Total incomes"
            total={stats.incomes}
            percent={stats.incomesPercent}
            chart={{
              colors: undefined,
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              options: {},
            }}
          />
        </Grid>
        {/* Optionally update or remove BookingAvailable if you have available data */}
        <Grid xs={12} md={4}>
          <BookingAvailable
            title="Tours available"
            chart={{
              series: [
                { label: 'Sold out', value: stats.available.soldOut },
                { label: 'Available', value: stats.available.available },
              ],
              colors: undefined,
            }}
          />
        </Grid>
        <Grid xs={12} md={8}>
          <BookingBooked title="Booked" data={stats.booked} />
        </Grid>

        {/* Booking Table */}
        <Grid xs={12}>
          <BookingDetails
            title="Booking details"
            tableData={bookings}
            headLabel={[
              { id: 'destination', label: 'Destination' },
              { id: 'customer', label: 'Customer' },
              { id: 'checkIn', label: 'Check in' },
              { id: 'checkOut', label: 'Check out' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
            <Button
              size="small"
              disabled={pagination.current <= 1 || loading}
              onClick={() => fetchBookings(pagination.current - 1)}
            >
              Previous
            </Button>
            <Box sx={{ mx: 2 }}>{`Page ${pagination.current} of ${pagination.pages}`}</Box>
            <Button
              size="small"
              disabled={pagination.current >= pagination.pages || loading}
              onClick={() => fetchBookings(pagination.current + 1)}
            >
              Next
            </Button>
          </Box>
          {loading && <Box sx={{ p: 2 }}>Loading...</Box>}
          {error && <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
