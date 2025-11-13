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

// ----------------------------------------------------------------------

export function PaymentTableRow({ row, onViewDetails, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const shortPaymentId = row._id ? row._id.substring(0, 8) : '-';
  const payerName = getPersonName(row.payer);
  const recipientName = getPersonName(row.recipient);

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 120 }}>
          <Tooltip title={row._id || '-'}>
            <Box sx={{ fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
              {shortPaymentId}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ width: 150 }}>
          <Box sx={{ fontSize: '0.875rem' }}>{payerName}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{row.payer?.email || '-'}</Box>
        </TableCell>

        <TableCell sx={{ width: 150 }}>
          <Box sx={{ fontSize: '0.875rem' }}>{recipientName}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {row.recipient?.email || '-'}
          </Box>
        </TableCell>

        <TableCell align="right" sx={{ width: 100 }}>
          <Tooltip title={`Net: ${formatCurrency(row.hostAmount)}`}>
            <Box>
              <Box sx={{ fontWeight: 600 }}>{formatCurrency(row.amount)}</Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                Host: {formatCurrency(row.hostAmount)}
              </Box>
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ width: 110 }}>
          <Chip
            label={row.status}
            size="small"
            color={STATUS_COLORS[row.status] || 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ width: 110 }}>
          <Chip
            label={row.method}
            size="small"
            color={METHOD_COLORS[row.method] || 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ width: 110 }}>
          <Chip
            label={row.paymentType ? row.paymentType.replace('_', ' ') : '-'}
            size="small"
            color={TYPE_COLORS[row.paymentType] || 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell sx={{ width: 140 }}>
          <Box sx={{ fontSize: '0.875rem' }}>{formatDate(row.createdAt)}</Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatTime(row.createdAt)}
          </Box>
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
  }).isRequired,
  onViewDetails: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
