import { Iconify } from 'src/components/iconify';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function BookingDetailsDialog({ open, onClose, booking }) {
  if (!booking) return null;
  // Try to get the original API booking object if passed, else fallback to mapped
  const b = booking._original || booking;
  // Try to get image
  const image =
    b?.storageSpace?.primaryImage ||
    (b?.storageSpace?.images?.length ? b.storageSpace.images[0].url : undefined) ||
    booking.destination?.coverUrl;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Booking Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" gap={3}>
          {image && (
            <Box flexShrink={0}>
              <img
                src={image}
                alt={b?.storageSpace?.title || booking.destination?.name}
                style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12 }}
              />
            </Box>
          )}
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {b?.storageSpace?.title || booking.destination?.name}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Booking ID:</b> {b?.id || b?._id}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Customer:</b> {b?.renter?.firstName} {b?.renter?.lastName} ({b?.renter?.email})
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Host:</b> {b?.host?.firstName} {b?.host?.lastName} ({b?.host?.email})
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Status:</b> {b?.status}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Check In:</b> {b?.bookingDetails?.startDate || booking.checkIn}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Check Out:</b> {b?.bookingDetails?.endDate || booking.checkOut}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Duration:</b> {b?.bookingDetails?.duration?.value}{' '}
              {b?.bookingDetails?.duration?.unit}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Auto Renewal:</b> {b?.bookingDetails?.autoRenewal?.enabled ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Storage Address:</b> {b?.storageSpace?.address?.street},{' '}
              {b?.storageSpace?.address?.city}, {b?.storageSpace?.address?.state},{' '}
              {b?.storageSpace?.address?.zipCode}, {b?.storageSpace?.address?.country}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Pricing:</b> {b?.pricing?.totalAmount} {b?.pricing?.currency} (Base:{' '}
              {b?.pricing?.baseRate} {b?.pricing?.rateType})
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Payment Method:</b> {b?.payment?.method}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Payment Status:</b> {b?.payment?.status}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Insurance Required:</b> {b?.insurance?.isRequired ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Created At:</b> {b?.createdAt}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <b>Updated At:</b> {b?.updatedAt}
            </Typography>
            {/* Add more fields as needed */}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
