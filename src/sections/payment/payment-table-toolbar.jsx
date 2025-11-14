import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PaymentTableToolbar({
  filters,
  onFilters,
  statusOptions,
  typeOptions,
  methodOptions,
}) {
  return (
    <Toolbar
      sx={{
        height: 'auto',
        px: { xs: 1, sm: 2 },
        py: 2,
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ width: 1, flexWrap: 'wrap' }}>
        {/* Search */}
        <OutlinedInput
          placeholder="Search payment..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          size="small"
          sx={{ maxWidth: { sm: 200 } }}
        />

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) => onFilters('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Payment Type Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Payment Type</InputLabel>
          <Select
            value={filters.paymentType || ''}
            label="Payment Type"
            onChange={(e) => onFilters('paymentType', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Payment Method Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Method</InputLabel>
          <Select
            value={filters.method || ''}
            label="Method"
            onChange={(e) => onFilters('method', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {methodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'createdAt'}
            label="Sort By"
            onChange={(e) => onFilters('sortBy', e.target.value)}
          >
            <MenuItem value="createdAt">Date</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Order */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={filters.sortOrder || 'desc'}
            label="Order"
            onChange={(e) => onFilters('sortOrder', e.target.value)}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Toolbar>
  );
}

PaymentTableToolbar.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    paymentType: PropTypes.string,
    method: PropTypes.string,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
  }).isRequired,
  onFilters: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  typeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  methodOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};
