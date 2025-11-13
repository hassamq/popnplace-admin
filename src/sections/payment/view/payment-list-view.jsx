import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

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

import { paymentService } from 'src/services/api';
import { PaymentTableRow } from '../payment-table-row';
import { PaymentTableToolbar } from '../payment-table-toolbar';
import { PaymentTableFiltersResult } from '../payment-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Payment ID' },
  { id: 'payer', label: 'Payer' },
  { id: 'recipient', label: 'Recipient' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
  { id: 'method', label: 'Method' },
  { id: 'type', label: 'Type' },
  { id: 'date', label: 'Date' },
  { id: 'action', label: 'Action' },
];

const defaultFilters = {
  search: '',
  status: '',
  paymentType: '',
  method: '',
  startDate: null,
  endDate: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

// Status options
const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partially_refunded', label: 'Partially Refunded' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'on_hold', label: 'On Hold' },
];

const PAYMENT_TYPE = [
  { value: 'booking_payment', label: 'Booking Payment' },
  { value: 'security_deposit', label: 'Security Deposit' },
  { value: 'additional_fee', label: 'Additional Fee' },
  { value: 'refund', label: 'Refund' },
  { value: 'payout', label: 'Payout' },
];

const PAYMENT_METHOD = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'square', label: 'Square' },
];

// ----------------------------------------------------------------------

export function PaymentListView() {
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch payment data from API
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: table.page + 1,
        limit: table.rowsPerPage,
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentType && { paymentType: filters.paymentType }),
        ...(filters.method && { method: filters.method }),
        ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
        ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response = await paymentService.getPayments(params);

      if (response?.data) {
        setTableData(response.data || []);
        setSummary(response.summary || null);
        setTotalCount(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error(error.message || 'Failed to fetch payments');
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilters = useCallback(
    (name, value) => {
      table.setPage(0);
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    table.setPage(0);
  }, [table]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await paymentService.deletePayment(id);
        setTableData((prevData) => prevData.filter((row) => row._id !== id));
        toast.success('Payment deleted successfully');
        confirm.onFalse();
      } catch (error) {
        toast.error(error.message || 'Failed to delete payment');
      }
    },
    [confirm]
  );

  const handleViewDetails = useCallback(
    (id) => {
      router.push(paths.dashboard.payments.details(id));
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Payment Records"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Payments' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <PaymentTableToolbar
          filters={filters}
          onFilters={handleFilters}
          statusOptions={PAYMENT_STATUS}
          typeOptions={PAYMENT_TYPE}
          methodOptions={PAYMENT_METHOD}
        />

        {filters.status !== defaultFilters.status ||
        filters.paymentType !== defaultFilters.paymentType ||
        filters.method !== defaultFilters.method ||
        filters.startDate !== defaultFilters.startDate ||
        filters.endDate !== defaultFilters.endDate ? (
          <PaymentTableFiltersResult
            filters={filters}
            onResetFilters={handleResetFilters}
            results={tableData.length}
          />
        ) : null}

        <Scrollbar>
          <Table size="small">
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {loading ? (
                <TableEmptyRows height={52 * table.rowsPerPage} />
              ) : tableData.length > 0 ? (
                tableData.map((row) => (
                  <PaymentTableRow
                    key={row._id}
                    row={row}
                    onViewDetails={() => handleViewDetails(row._id)}
                    onDeleteRow={() => {
                      setDeleteId(row._id);
                      confirm.onTrue();
                    }}
                  />
                ))
              ) : (
                <TableNoData notFound />
              )}
            </TableBody>
          </Table>
        </Scrollbar>

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

      {/* Summary Section */}
      {summary && (
        <Card sx={{ mt: 3, p: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(6, 1fr)',
              },
              gap: 2,
            }}
          >
            <Box>
              <Label sx={{ mb: 0.5 }}>Total Amount</Label>
              <Box sx={{ typography: 'h6' }}>€{summary.totalAmount?.toFixed(2) || 0}</Box>
            </Box>
            <Box>
              <Label sx={{ mb: 0.5 }}>Processing Fees</Label>
              <Box sx={{ typography: 'h6' }}>€{summary.totalProcessingFees?.toFixed(2) || 0}</Box>
            </Box>
            <Box>
              <Label sx={{ mb: 0.5 }}>Service Fees</Label>
              <Box sx={{ typography: 'h6' }}>€{summary.totalServiceFees?.toFixed(2) || 0}</Box>
            </Box>
            <Box>
              <Label sx={{ mb: 0.5 }}>Host Amount</Label>
              <Box sx={{ typography: 'h6' }}>€{summary.totalHostAmount?.toFixed(2) || 0}</Box>
            </Box>
            <Box>
              <Label sx={{ mb: 0.5 }}>Completed</Label>
              <Box sx={{ typography: 'h6' }}>{summary.completedPayments || 0}</Box>
            </Box>
            <Box>
              <Label sx={{ mb: 0.5 }}>Failed</Label>
              <Box sx={{ typography: 'h6' }}>{summary.failedPayments || 0}</Box>
            </Box>
          </Box>
        </Card>
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Payment"
        content="Are you sure you want to delete this payment record?"
        action={
          <button
            type="button"
            onClick={() => {
              handleDeleteRow(deleteId);
            }}
          >
            Delete
          </button>
        }
      />
    </DashboardContent>
  );
}
