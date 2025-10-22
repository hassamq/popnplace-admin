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
  const [showFilters, setShowFilters] = useState(false);
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (event) => {
      onFilters(
        'type',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Button
        variant="text"
        onClick={() => setShowFilters((prev) => !prev)}
        sx={{ textTransform: 'none', fontWeight: 500 }}
      >
        {showFilters ? 'Hide filters' : 'Show filters'}
      </Button>

      {showFilters && (
        <Stack spacing={2} sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              fullWidth
              value={filters.category}
              onChange={(e) => onFilters('category', e.target.value)}
              label="Filter by storage category"
              placeholder="category"
            />
            <TextField
              fullWidth
              value={filters.spaceType}
              onChange={(e) => onFilters('spaceType', e.target.value)}
              label="Filter by space type"
              placeholder="spaceType"
            />
            <TextField
              fullWidth
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilters('minPrice', e.target.value)}
              label="Minimum monthly price"
              placeholder="minPrice"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              fullWidth
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilters('maxPrice', e.target.value)}
              label="Maximum monthly price"
              placeholder="maxPrice"
            />
            <TextField
              fullWidth
              value={filters.city}
              onChange={(e) => onFilters('city', e.target.value)}
              label="Filter by city"
              placeholder="city"
            />
            <TextField
              fullWidth
              value={filters.state}
              onChange={(e) => onFilters('state', e.target.value)}
              label="Filter by state"
              placeholder="state"
            />
          </Stack>
          <FormControl sx={{ minWidth: { xs: 120, md: 200 } }}>
            <InputLabel id="sortBy-label">Sort By</InputLabel>
            <Select
              labelId="sortBy-label"
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => onFilters('sortBy', e.target.value)}
              input={<OutlinedInput label="Sort By" />}
            >
              <MenuItem value="price_low">Price Low</MenuItem>
              <MenuItem value="price_high">Price High</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="distance">Distance</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
}
