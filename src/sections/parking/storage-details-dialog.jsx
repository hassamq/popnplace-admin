import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import React, { useEffect, useState } from 'react';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';

const StorageDetailsDialog = ({ open, onClose, storageId }) => {
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open && storageId) {
      setLoading(true);
      fetch(`https://dev-api.popnplace.nl/api/v1/storage/${storageId}`)
        .then((res) => res.json())
        .then((data) => {
          setStorage(data?.data?.storageSpace || null);
        })
        .catch(() => setStorage(null))
        .finally(() => setLoading(false));
    }
  }, [open, storageId]);

  if (!open) return null;
  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <Typography>Loading storage details...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  if (!storage) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>Storage details not found.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  const imageSrc =
    storage.primaryImage || (storage.images && storage.images[0]) || PLACEHOLDER_IMAGE;
  // ...existing helper functions and rendering code...
  const formatLocation = () => {
    if (!storage.address) return 'N/A';
    const { street, city, state, zipCode, country, coordinates } = storage.address;
    let loc = [street, city, state, zipCode, country].filter(Boolean).join(', ');
    if (coordinates && (coordinates.latitude || coordinates.longitude)) {
      loc += `\nLat: ${coordinates.latitude ?? 'N/A'}, Lng: ${coordinates.longitude ?? 'N/A'}`;
    }
    return loc || 'N/A';
  };
  const formatDimensions = () => {
    if (!storage.dimensions) return 'N/A';
    const { length, width, height, unit } = storage.dimensions;
    if (length && width && height) {
      return `${length} x ${width} x ${height} ${unit || ''}`;
    }
    return 'N/A';
  };
  const formatPrice = () => {
    if (!storage.pricing) return 'N/A';
    const { dailyRate, weeklyRate, monthlyRate, currency } = storage.pricing;
    return `Daily: €${dailyRate ?? 'N/A'} | Weekly: €${weeklyRate ?? 'N/A'} | Monthly: €${monthlyRate ?? 'N/A'}${currency ? ` (${currency})` : ''}`;
  };
  const formatDiscounts = () => {
    if (!storage.pricing?.discounts) return 'N/A';
    const { weekly, monthly } = storage.pricing.discounts;
    return `Weekly: ${weekly ?? 'N/A'}%, Monthly: ${monthly ?? 'N/A'}%`;
  };
  const formatAvailability = () => {
    if (!storage.availability) return 'N/A';
    const { isAvailable, availableFrom, availableUntil, minimumRental, accessHours } =
      storage.availability;
    return `${isAvailable ? 'Available' : 'Unavailable'}\nFrom: ${availableFrom ?? 'N/A'}\nUntil: ${availableUntil ?? 'N/A'}\nMinimum Rental: ${minimumRental?.duration ?? 'N/A'} ${minimumRental?.unit ?? ''}\nAccess Hours: ${accessHours ?? 'N/A'}`;
  };
  const formatRestrictions = () => {
    if (!storage.restrictions) return 'N/A';
    const { maxWeight, allowedItems, prohibitedItems, requiresInsurance } = storage.restrictions;
    return `Max Weight: ${maxWeight?.unit ?? 'N/A'}\nAllowed Items: ${allowedItems && allowedItems.length ? allowedItems.join(', ') : 'None'}\nProhibited Items: ${prohibitedItems && prohibitedItems.length ? prohibitedItems.join(', ') : 'None'}\nRequires Insurance: ${requiresInsurance ? 'Yes' : 'No'}`;
  };
  const formatVerification = () => {
    if (!storage.verification) return 'N/A';
    const { isVerified, verifiedAt } = storage.verification;
    return `Verified: ${isVerified ? 'Yes' : 'No'}\nVerified At: ${verifiedAt ?? 'N/A'}`;
  };
  const formatAnalytics = () => {
    if (!storage.analytics) return 'N/A';
    const { bookings, earnings, rating, views, inquiries } = storage.analytics;
    return `Bookings: ${bookings?.total ?? 'N/A'} (Completed: ${bookings?.completed ?? 'N/A'}, Cancelled: ${bookings?.cancelled ?? 'N/A'})\nEarnings: ${earnings?.total ?? 'N/A'} (This Month: ${earnings?.thisMonth ?? 'N/A'}, Last Month: ${earnings?.lastMonth ?? 'N/A'})\nRating: ${rating?.average ?? 'N/A'} (${rating?.count ?? 'N/A'} reviews)\nViews: ${views ?? 'N/A'}, Inquiries: ${inquiries ?? 'N/A'}`;
  };
  const formatHost = () => {
    if (!storage.host) return 'N/A';
    const { firstName, lastName, hostProfile } = storage.host;
    return `${firstName ?? ''} ${lastName ?? ''}\nAvg Rating: ${hostProfile?.avgRating ?? 'N/A'}, Total Reviews: ${hostProfile?.totalReviews ?? 'N/A'}`;
  };
  const formatFeatures = () => {
    if (!storage.features || !Array.isArray(storage.features) || storage.features.length === 0)
      return 'None';
    return storage.features.join(', ');
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{storage.title ?? 'N/A'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box>
            <img
              src={imageSrc}
              alt={storage.title}
              style={{ width: 400, height: 300, objectFit: 'cover', borderRadius: 8 }}
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.description ?? 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Location
            </Typography>
            <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {formatLocation()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Dimensions
            </Typography>
            <Typography variant="body2" gutterBottom>
              {formatDimensions()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Square Footage
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.squareFootage ?? 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Cubic Footage
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.cubicFootage ?? 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Price
            </Typography>
            <Typography variant="body2" gutterBottom>
              {formatPrice()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Discounts
            </Typography>
            <Typography variant="body2" gutterBottom>
              {formatDiscounts()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Availability
            </Typography>
            <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {formatAvailability()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Restrictions
            </Typography>
            <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {formatRestrictions()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Verification
            </Typography>
            <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {formatVerification()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Analytics
            </Typography>
            <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {formatAnalytics()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Host
            </Typography>
            <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
              {formatHost()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Status
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.status ?? 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Features
            </Typography>
            <Typography variant="body2" gutterBottom>
              {formatFeatures()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Created At
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.createdAt ?? 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Updated At
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.updatedAt ?? 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              ID
            </Typography>
            <Typography variant="body2" gutterBottom>
              {storage.id ?? 'N/A'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StorageDetailsDialog;
