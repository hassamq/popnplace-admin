import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';

import { Iconify } from 'src/components/iconify';
import { userService } from 'src/services/api';

// ----------------------------------------------------------------------

import { useState } from 'react';

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

  const [statusLoading, setStatusLoading] = useState(false);

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

  const handleToggleStatus = async () => {
    setStatusLoading(true);
    try {
      await userService.toggleUserStatus(_id);
      window.location.reload(); // reload to reflect status change
    } catch (error) {
      alert(`Failed to update status: ${error?.message || error}`);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
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
        <Chip
          label={getStatusLabel(isActive)}
          color={getStatusColor(isActive)}
          size="small"
          sx={{ fontSize: 13, height: 28, minWidth: 90, fontWeight: 500 }}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={getVerificationLabel(emailVerification?.isVerified || isVerified)}
          color={getVerificationColor(emailVerification?.isVerified || isVerified)}
          size="small"
          sx={{ fontSize: 13, height: 28, minWidth: 90, fontWeight: 500 }}
        />
      </TableCell>
      <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>
      <TableCell align="right">
        <Tooltip title={isActive ? 'Deactivate User' : 'Activate User'} placement="top">
          <span>
            <IconButton
              color={isActive ? 'error' : 'success'}
              onClick={handleToggleStatus}
              disabled={statusLoading}
              size="small"
            >
              {isActive ? (
                <Iconify icon="mdi:account-off-outline" width={24} height={24} />
              ) : (
                <Iconify icon="mdi:account-check-outline" width={24} height={24} />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
