import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { paths } from 'src/routes/paths';
import { userService } from 'src/services/api';

import { RentersTableRow } from '../renters-table-row';
import { RentersTableToolbar } from '../renters-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'status', label: 'Status' },
  { id: 'verification', label: 'Verification' },
  { id: 'createdAt', label: 'Created' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

const defaultFilters = {
  name: '',
  role: 'renter',
  status: 'all',
  verification: 'all',
};

// ----------------------------------------------------------------------

export default function RentersView() {
  const theme = useTheme();

  const table = useTable();

  const confirm = useBoolean();

  const popover = usePopover();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Use API data directly, no local filtering/slicing
  const denseHeight = table.dense ? 52 : 72;

  const canReset = !Object.values(filters).every(
    (value) => value === defaultFilters[value] || value === ''
  );

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row._id !== id);
      setTableData(deleteRow);
      toast.success('Delete success!');
    },
    [tableData]
  );

  const handleEditRow = useCallback((id) => {
    // Handle edit functionality
    toast.info('Edit functionality coming soon!');
  }, []);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        role: 'renter',
        page: page + 1,
        limit: rowsPerPage,
        name: filters.name,
      };

      // Map status filter to isActive
      if (filters.status !== 'all') {
        params.isActive = filters.status === 'active';
      }

      // Map verification filter to isVerified
      if (filters.verification !== 'all') {
        params.isVerified = filters.verification === 'verified';
      }

      const response = await userService.getUsers(params);

      // Use API response directly, check for array or object
      if (response.success) {
        setTableData(response.data.users || response.data || []);
        setPagination(
          response.data.pagination || response.data.meta || { current: 1, pages: 1, total: 0 }
        );
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  return (
    <>
      <Container maxWidth={false}>
        <CustomBreadcrumbs
          heading="Renters"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User Management', href: paths.dashboard.renters.root },
            { name: 'Renters' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.renters.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Renter
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <RentersTableToolbar
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            canReset={canReset}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row._id)
                  )
                }
                headLabel={TABLE_HEAD}
              />

              <TableBody>
                {tableData.map((row) => (
                  <RentersTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                    onEditRow={() => handleEditRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </TableContainer>

          <TablePaginationCustom
            count={pagination.total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={confirm.onFalse}>
            Delete
          </Button>
        }
      />
    </>
  );
}
