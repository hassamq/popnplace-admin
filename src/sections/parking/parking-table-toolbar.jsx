import { useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PARKING_TYPES = [
  'Standard',
  'Compact',
  'SUV/Truck',
  'Motorcycle',
  'Electric Vehicle',
  'Disabled',
  'VIP/Premium',
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

// ----------------------------------------------------------------------

export function ParkingTableToolbar({ filters, onFilters }) {
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          value={filters.status}
          onChange={(e) => onFilters('status', e.target.value)}
          input={<OutlinedInput label="Status" />}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="pending_approval">Pending Approval</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 160 }} size="small">
        <InputLabel id="verified-label">Verified</InputLabel>
        <Select
          labelId="verified-label"
          value={filters.verified}
          onChange={(e) => onFilters('verified', e.target.value)}
          input={<OutlinedInput label="Verified" />}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Verified</MenuItem>
          <MenuItem value="false">Not Verified</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
