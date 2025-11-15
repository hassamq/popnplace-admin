import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// Status color mapping
const STATUS_COLORS = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'error',
  cancelled: 'default',
  refunded: 'secondary',
  partially_refunded: 'secondary',
  disputed: 'error',
  on_hold: 'warning',
};

// Payment type color mapping
const TYPE_COLORS = {
  booking_payment: 'primary',
  security_deposit: 'info',
  additional_fee: 'warning',
  refund: 'error',
  payout: 'success',
};

// Payment method color mapping
const METHOD_COLORS = {
  stripe: 'primary',
  credit_card: 'info',
  debit_card: 'info',
  paypal: 'secondary',
  bank_transfer: 'secondary',
  square: 'warning',
};

// Format date
function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format time
function formatTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format currency
function formatCurrency(amount, currency = 'EUR') {
  if (amount === null || amount === undefined) return '-';
  return `€${amount.toFixed(2)}`;
}

// Get payer or recipient name
function getPersonName(person) {
  if (!person) return '-';
  return `${person.firstName || ''} ${person.lastName || ''}`.trim() || person.email || '-';
}

// Get name from localData structure
function getLocalDataName(localData) {
  if (!localData) return '-';
  return localData.name || localData.email || '-';
}

// Map Stripe status to internal status
function mapStripeStatus(stripeStatus) {
  const statusMap = {
    succeeded: 'completed',
    requires_payment_method: 'pending',
    processing: 'processing',
    canceled: 'cancelled',
  };
  return statusMap[stripeStatus] || stripeStatus;
}

// ----------------------------------------------------------------------

export function PaymentTableRow({ row, onViewDetails, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  // Handle both old and new data structures
  const isStripeTransaction = !!row.stripe;

  const shortPaymentId = isStripeTransaction
    ? row.stripe?.id
      ? row.stripe.id.substring(row.stripe.id.length - 8)
      : '-'
    : row._id
      ? row._id.substring(0, 8)
      : '-';

  const payerName = isStripeTransaction
    ? getLocalDataName(row.localData?.renter)
    : getPersonName(row.payer);

  const recipientName = isStripeTransaction
    ? getLocalDataName(row.localData?.host)
    : getPersonName(row.recipient);

  const amount = isStripeTransaction ? row.financial?.renterPaid : row.amount;

  const hostAmount = isStripeTransaction ? row.financial?.hostAmount : row.hostAmount;

  const status = isStripeTransaction ? mapStripeStatus(row.stripe?.status) : row.status;

  const method = isStripeTransaction ? row.paymentMethod?.type || 'stripe' : row.method;

  const paymentType = isStripeTransaction ? 'booking_payment' : row.paymentType;

  const createdAt = isStripeTransaction ? row.stripe?.created : row.createdAt;

  const payerEmail = isStripeTransaction ? row.localData?.renter?.email : row.payer?.email;

  const recipientEmail = isStripeTransaction ? row.localData?.host?.email : row.recipient?.email;

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 120 }}>
          <Tooltip title={isStripeTransaction ? row.stripe?.id : row._id || '-'}>
            <Box sx={{ fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
              {shortPaymentId}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ width: 150 }}>
          <Box sx={{ fontSize: '0.875rem' }}>{payerName}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{payerEmail || '-'}</Box>
        </TableCell>

        <TableCell sx={{ width: 150 }}>
          <Box sx={{ fontSize: '0.875rem' }}>{recipientName}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{recipientEmail || '-'}</Box>
        </TableCell>

        <TableCell align="right" sx={{ width: 100 }}>
          <Tooltip title={`Net: ${formatCurrency(hostAmount)}`}>
            <Box>
              <Box sx={{ fontWeight: 600 }}>{formatCurrency(amount)}</Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                Host: {formatCurrency(hostAmount)}
              </Box>
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ width: 110 }}>
          <Chip
            label={status}
            size="small"
            color={STATUS_COLORS[status] || 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ width: 110 }}>
          <Chip
            label={method}
            size="small"
            color={METHOD_COLORS[method] || 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ width: 110 }}>
          <Chip
            label={paymentType ? paymentType.replace('_', ' ') : '-'}
            size="small"
            color={TYPE_COLORS[paymentType] || 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ width: 140 }}>
          <Box sx={{ fontSize: '0.875rem' }}>{formatDate(createdAt)}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{formatTime(createdAt)}</Box>
        </TableCell>

        <TableCell align="right" sx={{ width: 80 }}>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        slotProps={{
          arrow: { placement: 'right-top' },
        }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onViewDetails();
            }}
          >
            <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
            View Details
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDeleteRow();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

PaymentTableRow.propTypes = {
  row: PropTypes.shape({
    // Old payment structure
    _id: PropTypes.string,
    amount: PropTypes.number,
    status: PropTypes.string,
    method: PropTypes.string,
    paymentType: PropTypes.string,
    createdAt: PropTypes.string,
    payer: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }),
    recipient: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }),
    hostAmount: PropTypes.number,
    // New Stripe transaction structure
    stripe: PropTypes.shape({
      id: PropTypes.string,
      amount: PropTypes.number,
      status: PropTypes.string,
      created: PropTypes.string,
      currency: PropTypes.string,
    }),
    financial: PropTypes.shape({
      renterPaid: PropTypes.number,
      platformFee: PropTypes.number,
      hostAmount: PropTypes.number,
      currency: PropTypes.string,
    }),
    localData: PropTypes.shape({
      renter: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      host: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      booking: PropTypes.shape({
        _id: PropTypes.string,
        status: PropTypes.string,
        amount: PropTypes.number,
      }),
    }),
    paymentMethod: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      card: PropTypes.shape({
        brand: PropTypes.string,
        last4: PropTypes.string,
        expMonth: PropTypes.number,
        expYear: PropTypes.number,
        funding: PropTypes.string,
        country: PropTypes.string,
      }),
    }),
  }).isRequired,
  onViewDetails: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
