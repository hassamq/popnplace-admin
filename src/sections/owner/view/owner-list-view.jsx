import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { _ownerList } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Owner' },
  { id: 'totalSpaces', label: 'Total Spaces' },
  { id: 'activeSpaces', label: 'Active Spaces' },
  { id: 'monthlyRevenue', label: 'Monthly Revenue' },
  { id: 'rating', label: 'Rating' },
  { id: 'verificationStatus', label: 'Verification' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function OwnerListView() {
  const table = useTable();
  const router = useRouter();

  const [tableData, setTableData] = useState(_ownerList);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 56 : 56 + 20;

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.owners.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.owners.edit(id));
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Space Owners"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Owners', href: paths.dashboard.owners.root },
          { name: 'List' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.owners.new)}
          >
            Add Owner
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell>
                      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.name} src={row.avatarUrl} sx={{ width: 40, height: 40 }} />
                        <ListItemText
                          primary={row.name}
                          secondary={row.email}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ typography: 'caption', color: 'text.disabled' }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>{row.totalSpaces}</TableCell>
                    <TableCell>{row.activeSpaces}</TableCell>
                    <TableCell>{fCurrency(row.monthlyRevenue)}</TableCell>
                    <TableCell>⭐ {row.rating?.toFixed(1) || 'N/A'}</TableCell>

                    <TableCell>
                      <Label
                        variant="soft"
                        color={
                          (row.verificationStatus === 'verified' && 'success') ||
                          (row.verificationStatus === 'pending' && 'warning') ||
                          (row.verificationStatus === 'rejected' && 'error') ||
                          'default'
                        }
                      >
                        {row.verificationStatus}
                      </Label>
                    </TableCell>

                    <TableCell>
                      <Label
                        variant="soft"
                        color={
                          (row.status === 'active' && 'success') ||
                          (row.status === 'inactive' && 'warning') ||
                          (row.status === 'suspended' && 'error') ||
                          'default'
                        }
                      >
                        {row.status}
                      </Label>
                    </TableCell>

                    <TableCell align="right" sx={{ px: 1 }}>
                      <Button size="small" onClick={() => handleViewRow(row.id)}>
                        View
                      </Button>
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

  return stabilizedThis.map((el) => el[0]);
}
