import { Label } from 'src/components/label';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { useState } from 'react';
import BookingDetailsDialog from './booking-details-dialog';

// ----------------------------------------------------------------------

export function BookingDetails({ title, subheader, headLabel, tableData, ...other }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 462 }}>
        <Table sx={{ minWidth: 960 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>
            {tableData.map((row) => (
              <RowItem key={row.id} row={row} onView={handleView} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View all
        </Button>
      </Box>
      <BookingDetailsDialog open={dialogOpen} onClose={handleClose} booking={selectedBooking} />
    </Card>
  );
}

// ----------------------------------------------------------------------

function RowItem({ row, onView }) {
  const theme = useTheme();
  const lightMode = theme.palette.mode === 'light';

  const handleView = () => {
    if (onView) onView(row);
  };

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            variant="rounded"
            alt={row.destination.name}
            src={row.destination.coverUrl}
            sx={{ width: 48, height: 48 }}
          />
          {row.destination.name}
        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={row.customer.name}
          secondary={row.customer.phoneNumber}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.checkIn)}
          secondary={fTime(row.checkIn)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.checkOut)}
          secondary={fTime(row.checkOut)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant={lightMode ? 'soft' : 'filled'}
          color={
            (row.status === 'Paid' && 'success') ||
            (row.status === 'Pending' && 'warning') ||
            'error'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ pr: 1 }}>
        <IconButton color="primary" onClick={handleView}>
          <Iconify icon="eva:eye-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
