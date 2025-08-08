import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export function RentersTableRow({ row, selected, onSelectRow, onDeleteRow, onEditRow }) {
  const {
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    isActive,
    isVerified,
    emailVerification,
    createdAt,
    profilePicture,
  } = row;

  const popover = usePopover();

  const confirm = usePopover();

  const name = `${firstName} ${lastName}`;

  const getStatusColor = (status) => {
    if (status) return 'success';
    return 'error';
  };

  const getStatusLabel = (status) => {
    if (status) return 'Active';
    return 'Inactive';
  };

  const getVerificationColor = (verified) => {
    if (verified) return 'success';
    return 'warning';
  };

  const getVerificationLabel = (verified) => {
    if (verified) return 'Verified';
    return 'Unverified';
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={profilePicture} sx={{ mr: 2 }}>
            {name.charAt(0)}
          </Avatar>

          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{phoneNumber}</TableCell>

        <TableCell>
          <Chip label={getStatusLabel(isActive)} color={getStatusColor(isActive)} size="small" />
        </TableCell>

        <TableCell>
          <Chip
            label={getVerificationLabel(emailVerification?.isVerified || isVerified)}
            color={getVerificationColor(emailVerification?.isVerified || isVerified)}
            size="small"
          />
        </TableCell>

        <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
