import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BookingListView } from 'src/sections/booking/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pending Bookings - ${CONFIG.appName}` };

export default function PendingBookingPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BookingListView />
    </>
  );
}
