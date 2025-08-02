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

export function ParkingTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow }) {
  const { name, type, location, price, status, availability, owner } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={owner?.avatarUrl} sx={{ mr: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component="span" sx={{ typography: 'body2', color: 'text.primary' }}>
              {name}
            </Box>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              Space ID: #PS{row.id}
            </Box>
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
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={availability === 'available' ? 'success' : 'error'}
          >
            {availability}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick actions">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete this parking space?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
