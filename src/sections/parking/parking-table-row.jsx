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

export default function ParkingTableRow({ row, onViewRow }) {
  const { name, type, location, price, status, owner, availability } = row;
  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={owner?.avatarUrl} sx={{ mr: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box component="span" sx={{ typography: 'body2', color: 'text.primary' }}>{name}</Box>
        </Box>
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (type === 'covered' && 'success') ||
            (type === 'uncovered' && 'warning') ||
            (type === 'garage' && 'info') ||
            'default'
          }
        >
          {type}
        </Label>
      </TableCell>
      <TableCell>{location}</TableCell>
      <TableCell>${price}/hr</TableCell>
      <TableCell>
        <Label variant="soft" color={availability === 'available' ? 'success' : 'error'}>
          {availability}
        </Label>
      </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') ||
            (status === 'inactive' && 'error') ||
            (status === 'maintenance' && 'warning') ||
            'default'
          }
        >
          {status}
        </Label>
        <Tooltip title="View">
          <IconButton color="primary" onClick={onViewRow}>
            <Iconify icon="eva:eye-fill" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
