import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function ParkingTableRow({ row, onViewRow, onStatusChange }) {
  const { image, name, type, location, price, status, availability, id } = row;
  return (
    <TableRow hover>
      <TableCell>
        <Avatar
          alt={name}
          src={image}
          sx={{ width: 56, height: 56, borderRadius: 1 }}
          variant="rounded"
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component="span" sx={{ typography: 'body2', color: 'text.primary' }}>
            {name}
          </Box>
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            Space ID: #PS{id}
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Label variant="soft" color="info">
          {type}
        </Label>
      </TableCell>
      <TableCell>{location}</TableCell>
      <TableCell>€{price}/day</TableCell>
      <TableCell>
        <Label variant="soft" color={availability === 'available' ? 'success' : 'error'}>
          {availability}
        </Label>
      </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="View Details">
          <IconButton onClick={onViewRow}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
        {/* Admin actions by status */}
        {status === 'pending_approval' && (
          <>
            <Tooltip title="Mark as Active">
              <IconButton
                color="success"
                onClick={() => onStatusChange && onStatusChange(id, 'active')}
              >
                <Iconify icon="solar:check-circle-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject (Admin)">
              <IconButton
                color="error"
                onClick={() => onStatusChange && onStatusChange(id, 'admin-rejected')}
              >
                <Iconify icon="solar:close-circle-bold" />
              </IconButton>
            </Tooltip>
          </>
        )}
        {status === 'admin-rejected' && (
          <Tooltip title="Mark as Active">
            <IconButton
              color="success"
              onClick={() => onStatusChange && onStatusChange(id, 'active')}
            >
              <Iconify icon="solar:check-circle-bold" />
            </IconButton>
          </Tooltip>
        )}
        {status === 'active' && (
          <Tooltip title="Set Inactive">
            <IconButton
              color="warning"
              onClick={() => onStatusChange && onStatusChange(id, 'inactive')}
            >
              <Iconify icon="solar:pause-circle-bold" />
            </IconButton>
          </Tooltip>
        )}
        {status === 'inactive' && (
          <Tooltip title="Mark as Active">
            <IconButton
              color="success"
              onClick={() => onStatusChange && onStatusChange(id, 'active')}
            >
              <Iconify icon="solar:check-circle-bold" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}
