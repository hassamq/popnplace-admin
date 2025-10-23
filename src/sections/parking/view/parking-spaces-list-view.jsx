import { useState, useCallback, useEffect } from 'react';
import { adminStorageService, storageService } from 'src/services/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
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
import ParkingTableRow from '../parking-table-row';
import StorageDetailsDialog from '../storage-details-dialog';
import { ParkingTableToolbar } from '../parking-table-toolbar';
import { ParkingTableFiltersResult } from '../parking-table-filters-result';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'image', label: 'Image', width: 80 },
  { id: 'space', label: 'Space Name' },
  { id: 'type', label: 'Type' },
  { id: 'location', label: 'Location' },
  { id: 'price', label: 'Price/Day' },
  { id: 'availability', label: 'Availability' },
  { id: 'action', label: 'Action' },
];

const defaultFilters = {
  status: '', // draft, active, inactive, pending_approval, suspended, archived
  verified: '', // true/false
  page: 1,
  limit: 20,
};

// ----------------------------------------------------------------------

export function StorageListView() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStorageId, setSelectedStorageId] = useState(null);
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);
  // Fetch storage data from API
  const fetchStorage = useCallback(async () => {
    setLoading(true);
    try {
      // Map only admin filters to API params
      const params = {
        status: filters.status || undefined,
        verified: filters.verified !== '' ? filters.verified : undefined,
        page: table.page + 1,
        limit: table.rowsPerPage,
      };
      const data = await adminStorageService.getAdminStorageSpaces(params);
      console.log('API Response:', data);
      // Try to find the correct data key
      if (Array.isArray(data?.data?.storageSpaces)) {
        // Map API data to expected table row format
        const mappedRows = data.data.storageSpaces.map((item) => ({
          id: item.id || item._id,
          image:
            item.primaryImage ||
            (item.images && item.images[0]?.url) ||
            'https://placehold.co/80x80',
          name: item.title,
          type: item.storageCategory?.name || item.spaceType || '',
          location: [item.address?.city, item.address?.state, item.address?.country]
            .filter(Boolean)
            .join(', '),
          price: item.pricing?.dailyRate || '',
          status: item.status,
          availability: item.status,
          owner: {
            avatarUrl: item.host?.profilePicture || '',
            name: `${item.host?.firstName ?? ''} ${item.host?.lastName ?? ''}`.trim(),
          },
        }));
        setTableData(mappedRows);
        setTotalCount(data.data.pagination?.total || mappedRows.length);
      } else {
        setTableData([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('API Error:', err);
      setTableData([]);
    }
    setLoading(false);
  }, [filters, table.page, table.rowsPerPage]);

  useEffect(() => {
    fetchStorage();
  }, [fetchStorage]);

  // No local filtering, data is filtered by API
  const dataFiltered = Array.isArray(tableData) ? tableData : [];
  const dataInPage = Array.isArray(tableData) ? tableData : [];

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = Object.values(filters).some((v, i) => {
    // Don't count default values for page, limit, sortBy, radius
    const keys = Object.keys(filters);
    const key = keys[i];
    if (['page', 'limit', 'sortBy', 'radius'].includes(key)) return false;
    if (typeof v === 'string') return v.trim() !== '';
    return v !== '' && v !== undefined && v !== null;
  });

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.parking.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback((id) => {
    setSelectedStorageId(id);
    setDetailsOpen(true);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await storageService.updateStorageStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      await fetchStorage();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };



  return (
    <>
      <DashboardContent>
        <Card>
          <ParkingTableToolbar
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            isFiltered={canReset}
          />
          <ParkingTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2, pt: 0 }}
          />
          <Box>
            <Scrollbar>
              <Table>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} numSelected={table.selected.length} />
                <TableBody>
                  {loading ? (
                    <tr>
                      <td colSpan={TABLE_HEAD.length}>Loading...</td>
                    </tr>
                  ) : (
                    dataFiltered.map((row) => (
                      <ParkingTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          <TablePaginationCustom
            count={totalCount}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </DashboardContent>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      <StorageDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        storageId={selectedStorageId}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, type } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (parking) => parking.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((parking) => parking.status === status);
  }

  if (type.length) {
    inputData = inputData.filter((parking) => type.includes(parking.type));
  }

  return inputData;
}
