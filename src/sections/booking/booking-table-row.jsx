import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  usePopover,
  CustomPopover,
} from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function BookingTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow }) {
  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <ListItemText
              disableTypography
              primary={
                <Link
                  noWrap
                  color="inherit"
                  variant="subtitle2"
                  onClick={onViewRow}
                  sx={{ cursor: 'pointer' }}
                >
                  {row.bookingNumber}
                </Link>
              }
              secondary={
                <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                  {row.spaceName}
                </Box>
              }
            />
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.renter.name} src={row.renter.avatarUrl} sx={{ width: 32, height: 32 }} />
            <ListItemText
              disableTypography
              primary={
                <Box component="span" sx={{ typography: 'body2' }}>
                  {row.renter.name}
                </Box>
              }
              secondary={
                <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                  {row.renter.email}
                </Box>
              }
            />
          </Box>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.startDate)}
            secondary={fTime(row.startDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.endDate)}
            secondary={fTime(row.endDate)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.totalAmount)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'completed' && 'info') ||
              (row.status === 'cancelled' && 'error') ||
              (row.status === 'pending' && 'warning') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.paymentStatus === 'paid' && 'success') ||
              (row.paymentStatus === 'pending' && 'warning') ||
              (row.paymentStatus === 'refunded' && 'info') ||
              'default'
            }
          >
            {row.paymentStatus}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
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
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete this booking?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
