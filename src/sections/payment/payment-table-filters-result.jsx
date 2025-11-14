import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';

// Helper to format filter label
function getFilterLabel(key, value) {
  const labelMap = {
    status: `Status: ${value}`,
    paymentType: `Type: ${value}`,
    method: `Method: ${value}`,
    startDate: `From: ${value}`,
    endDate: `To: ${value}`,
  };
  return labelMap[key] || `${key}: ${value}`;
}

// ----------------------------------------------------------------------

export function PaymentTableFiltersResult({ filters, onResetFilters, results }) {
  const hasFilters =
    filters.status || filters.paymentType || filters.method || filters.startDate || filters.endDate;

  return (
    <Stack spacing={1.5} sx={{ px: 2, py: 2 }}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        &nbsp;result found
      </Box>

      {hasFilters && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {filters.status && (
            <Chip
              label={getFilterLabel('status', filters.status)}
              onDelete={() => {}}
              size="small"
            />
          )}
          {filters.paymentType && (
            <Chip
              label={getFilterLabel('paymentType', filters.paymentType)}
              onDelete={() => {}}
              size="small"
            />
          )}
          {filters.method && (
            <Chip
              label={getFilterLabel('method', filters.method)}
              onDelete={() => {}}
              size="small"
            />
          )}
          {filters.startDate && (
            <Chip
              label={getFilterLabel('startDate', filters.startDate.toLocaleDateString())}
              onDelete={() => {}}
              size="small"
            />
          )}
          {filters.endDate && (
            <Chip
              label={getFilterLabel('endDate', filters.endDate.toLocaleDateString())}
              onDelete={() => {}}
              size="small"
            />
          )}

          <Button
            color="error"
            sx={{ borderRadius: 0.75 }}
            size="small"
            onClick={onResetFilters}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            Clear
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

PaymentTableFiltersResult.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    paymentType: PropTypes.string,
    method: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }).isRequired,
  onResetFilters: PropTypes.func.isRequired,
  results: PropTypes.number,
};
