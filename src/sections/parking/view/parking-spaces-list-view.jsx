import { useState, useCallback, useEffect } from 'react';
import { storageService } from 'src/services/api';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

// import { _parkingList } from 'src/_mock/_parking';
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
import { ParkingTableToolbar } from '../parking-table-toolbar';
import { ParkingTableFiltersResult } from '../parking-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'space', label: 'Space' },
  { id: 'type', label: 'Type' },
  { id: 'location', label: 'Location' },
  { id: 'price', label: 'Price/Hour' },
  { id: 'availability', label: 'Status' },
  { id: 'view', label: 'View' },
];

const defaultFilters = {
  category: '',
  spaceType: '',
  minPrice: '',
  maxPrice: '',
  city: '',
  state: '',
  features: '',
  latitude: '',
  longitude: '',
  radius: 25,
  sortBy: 'newest',
};

// ----------------------------------------------------------------------

export function StorageListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);
  // Fetch storage data from API
  useEffect(() => {
    async function fetchStorage() {
      setLoading(true);
      try {
        // Map filters to API params
        const params = {
          category: filters.category || undefined,
          spaceType: filters.spaceType || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          city: filters.city || undefined,
          state: filters.state || undefined,
          features: filters.features || undefined,
          latitude: filters.latitude || undefined,
          longitude: filters.longitude || undefined,
          radius: filters.radius || 25,
          page: table.page + 1,
          limit: table.rowsPerPage,
          sortBy: filters.sortBy || 'newest',
        };
        const data = await storageService.getStorageSpaces(params);
        console.log('API Response:', data);
        // Try to find the correct data key
        if (Array.isArray(data?.data?.storageSpaces)) {
          // Map API data to expected table row format
          const mappedRows = data.data.storageSpaces.map((item) => ({
            id: item.id || item._id,
            name: item.title,
            type: item.spaceType,
            location: item.address?.city || '',
            price: item.pricing?.dailyRate || item.pricing?.monthlyRate || '',
            status: item.status,
            availability: item.availability?.isAvailable ? 'available' : 'unavailable',
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
    }
    fetchStorage();
  }, [filters, table.page, table.rowsPerPage]);

  // No local filtering, data is filtered by API
  const dataFiltered = Array.isArray(tableData) ? tableData : [];
  const dataInPage = Array.isArray(tableData) ? tableData : [];

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = Object.values(filters).some(
    (v, i) => {
      // Don't count default values for page, limit, sortBy, radius
      const keys = Object.keys(filters);
      const key = keys[i];
      if (["page", "limit", "sortBy", "radius"].includes(key)) return false;
      if (typeof v === "string") return v.trim() !== "";
      return v !== '' && v !== undefined && v !== null;
    }
  );

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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.parking.details(id));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Storage"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Storage', href: paths.dashboard.parking.root }, { name: 'List' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.parking.new)}
            >
              Add New Storage
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ParkingTableToolbar filters={filters} onFilters={handleFilters} />
          {/* SortBy Dropdown */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <label htmlFor="sortBy">
              Sort By:&nbsp;
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={e => handleFilters('sortBy', e.target.value)}
                style={{ minWidth: 120, padding: '6px 12px', borderRadius: 4 }}
              >
                <option value="price_low">Price Low</option>
                <option value="price_high">Price High</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </Box>

          {canReset && (
            <ParkingTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            {/* Removed TableSelectedAction and bulk actions */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                  {loading ? (
                    <tr><td colSpan={TABLE_HEAD.length}>Loading...</td></tr>
                  ) : (
                    dataFiltered.map((row) => (
                      <ParkingTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
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
