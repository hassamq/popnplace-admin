import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _paymentList, PAYMENT_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'transactionId', label: 'Transaction ID' },
  { id: 'payer', label: 'Payer' },
  { id: 'bookingNumber', label: 'Booking' },
  { id: 'amount', label: 'Amount' },
  { id: 'method', label: 'Method' },
  { id: 'status', label: 'Status' },
  { id: 'date', label: 'Date' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PaymentListView() {
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState(_paymentList);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 56 : 56 + 20;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataFiltered.length);
    },
    [dataFiltered.length, table, tableData]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.payments.details(id));
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Payment Transactions"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Payments', href: paths.dashboard.payments.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <TableRow hover key={row.id} selected={table.selected.includes(row.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={table.selected.includes(row.id)}
                          onClick={() => table.onSelectRow(row.id)}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ cursor: 'pointer' }} onClick={() => handleViewRow(row.id)}>
                          {row.transactionId}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            alt={row.payer.name}
                            src={row.payer.avatarUrl}
                            sx={{ width: 32, height: 32 }}
                          />
                          <ListItemText
                            primary={row.payer.name}
                            secondary={row.payer.email}
                            primaryTypographyProps={{ typography: 'body2' }}
                            secondaryTypographyProps={{ typography: 'caption' }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>{row.bookingNumber}</TableCell>

                      <TableCell>{fCurrency(row.amount)}</TableCell>

                      <TableCell>{row.paymentMethod}</TableCell>

                      <TableCell>
                        <Label
                          variant="soft"
                          color={
                            (row.status === 'completed' && 'success') ||
                            (row.status === 'pending' && 'warning') ||
                            (row.status === 'failed' && 'error') ||
                            'default'
                          }
                        >
                          {row.status}
                        </Label>
                      </TableCell>

                      <TableCell>
                        <ListItemText
                          primary={fDate(row.paymentDate)}
                          secondary={fTime(row.paymentDate)}
                          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                          secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ px: 1 }}>
                        <IconButton onClick={() => handleViewRow(row.id)}>
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={!dataFiltered.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
