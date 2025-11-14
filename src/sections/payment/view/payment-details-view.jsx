import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useParams } from 'react-router-dom';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { paymentService } from 'src/services/api';

// Status color mapping
const STATUS_COLORS = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'error',
  cancelled: 'default',
  refunded: 'secondary',
  partially_refunded: 'secondary',
  disputed: 'error',
  on_hold: 'warning',
};

// Format date time
function formatDateTime(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Format currency
function formatCurrency(amount, currency = 'EUR') {
  if (amount === null || amount === undefined) return '-';
  return `€${amount.toFixed(2)}`;
}

// Render info box
function InfoBox({ label, value, secondary }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      {secondary && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {secondary}
        </Typography>
      )}
    </Box>
  );
}

// Render section
function SectionCard({ title, children }) {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Card>
  );
}

// Render info grid
function InfoGrid({ children }) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}

function InfoGridItem({ xs = 12, sm = 6, label, value, secondary }) {
  return (
    <Grid xs={xs} sm={sm}>
      <InfoBox label={label} value={value} secondary={secondary} />
    </Grid>
  );
}

// ----------------------------------------------------------------------

export function PaymentDetailsView() {
  const { id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPayment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await paymentService.getPaymentById(id);
      setPayment(response?.data || null);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch payment details');
      router.push(paths.dashboard.payments.list);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!payment) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Payment Details"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Payments', href: paths.dashboard.payments.list },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Payment not found
          </Typography>
        </Card>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Payment Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Payments', href: paths.dashboard.payments.list },
          { name: payment._id?.substring(0, 8) },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            onClick={() => router.push(paths.dashboard.payments.list)}
          >
            Back
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {/* Header Card */}
        <Grid xs={12}>
          <Card sx={{ p: 3, background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {formatCurrency(payment.amount)}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={payment.status}
                    color={STATUS_COLORS[payment.status] || 'default'}
                    variant="soft"
                  />
                  <Chip
                    label={payment.paymentType?.replace('_', ' ')}
                    color="primary"
                    variant="soft"
                  />
                  <Chip label={payment.method} color="secondary" variant="soft" />
                </Stack>
              </Box>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Payment ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {payment._id}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 1 }}
                >
                  Created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatDateTime(payment.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid xs={12} md={8}>
          {/* Parties */}
          <SectionCard title="Payment Parties">
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Payer (Renter)
                </Typography>
                <InfoBox
                  label="Name"
                  value={`${payment.payer?.firstName} ${payment.payer?.lastName}`}
                />
                <InfoBox label="Email" value={payment.payer?.email} />
                <InfoBox label="Phone" value={payment.payer?.phoneNumber} />
                <InfoBox label="Verified" value={payment.payer?.isVerified ? 'Yes' : 'No'} />
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Recipient (Host)
                </Typography>
                <InfoBox
                  label="Name"
                  value={`${payment.recipient?.firstName} ${payment.recipient?.lastName}`}
                />
                <InfoBox label="Email" value={payment.recipient?.email} />
                <InfoBox label="Phone" value={payment.recipient?.phoneNumber} />
                <InfoBox label="Verified" value={payment.recipient?.isVerified ? 'Yes' : 'No'} />
              </Grid>
            </Grid>
          </SectionCard>

          {/* Booking Information */}
          {payment.booking && (
            <SectionCard title="Booking Information">
              <InfoGrid>
                <InfoGridItem label="Booking ID" value={payment.booking._id} />
                <InfoGridItem label="Booking Reference" value={payment.booking.bookingReference} />
                <InfoGridItem
                  label="Start Date"
                  value={formatDateTime(payment.booking.startDate)}
                />
                <InfoGridItem label="End Date" value={formatDateTime(payment.booking.endDate)} />
              </InfoGrid>
            </SectionCard>
          )}

          {/* Payment Breakdown */}
          <SectionCard title="Payment Breakdown">
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(payment.breakdown?.subtotal)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Service Fee:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(payment.breakdown?.serviceFee)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Processing Fee (Stripe):</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(
                      payment.breakdown?.processingFee || payment.stripeData?.processorFee
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Taxes:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(payment.breakdown?.taxes)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Discounts:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(payment.breakdown?.discounts)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Renter Paid:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(payment.renterPaid || payment.amount)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </SectionCard>

          {/* Stripe Details */}
          {payment.stripeData && (
            <SectionCard title="Stripe Transaction Details">
              <InfoGrid>
                <InfoGridItem
                  label="Transaction ID"
                  value={payment.stripeData.transactionId}
                  xs={12}
                />
                <InfoGridItem
                  label="External Transaction ID"
                  value={payment.stripeData.externalTransactionId}
                  xs={12}
                />
                <InfoGridItem
                  label="Processor Fee"
                  value={formatCurrency(payment.stripeData.processorFee)}
                />
                <InfoGridItem
                  label="Net Amount"
                  value={formatCurrency(payment.stripeData.netAmount)}
                />
                <InfoGridItem
                  label="Exchange Rate"
                  value={payment.stripeData.exchangeRate || '1.0'}
                />
                <InfoGridItem
                  label="Processed At"
                  value={formatDateTime(payment.stripeData.processedAt)}
                  xs={12}
                />
              </InfoGrid>
            </SectionCard>
          )}

          {/* Card Details */}
          {payment.cardDetails && (
            <SectionCard title="Payment Method Details">
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:credit-card-fill" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {payment.cardDetails.brand?.toUpperCase()} Card
                    </Typography>
                  </Box>
                  <InfoBox
                    label="Last 4 Digits"
                    value={`**** **** **** ${payment.cardDetails.last4}`}
                  />
                  <InfoBox label="Expiry Date" value={payment.cardDetails.expiry} />
                </Stack>
              </Box>
            </SectionCard>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid xs={12} md={4}>
          {/* Amount Summary */}
          <SectionCard title="Amount Summary">
            <Stack spacing={2}>
              <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Amount Paid by Renter
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(payment.renterPaid || payment.amount)}
                </Typography>
              </Box>
              <Divider />
              <InfoBox
                label="Host Receives"
                value={formatCurrency(payment.hostAmount)}
                secondary={`After all fees (€${(payment.breakdown?.serviceFee || 0) + (payment.stripeData?.processorFee || 0)})`}
              />
              <Divider />
              <Box sx={{ p: 1.5, bgcolor: 'success.lighter', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  Net Amount (Platform)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {formatCurrency(
                    payment.stripeData?.netAmount || payment.breakdown?.serviceFee || 0
                  )}
                </Typography>
              </Box>
            </Stack>
          </SectionCard>

          {/* Timeline */}
          {payment.timeline && (
            <SectionCard title="Payment Timeline">
              <Stack spacing={1.5}>
                {payment.timeline.initiatedAt && (
                  <Box sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Initiated
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {formatDateTime(payment.timeline.initiatedAt)}
                    </Typography>
                  </Box>
                )}
                {payment.timeline.authorizedAt && (
                  <Box sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Authorized
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {formatDateTime(payment.timeline.authorizedAt)}
                    </Typography>
                  </Box>
                )}
                {payment.timeline.capturedAt && (
                  <Box sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Captured
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {formatDateTime(payment.timeline.capturedAt)}
                    </Typography>
                  </Box>
                )}
                {payment.timeline.settledAt && (
                  <Box sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Settled
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      {formatDateTime(payment.timeline.settledAt)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </SectionCard>
          )}

          {/* Refund Info */}
          {payment.refundInfo && payment.refundInfo.totalRefunded > 0 && (
            <SectionCard title="Refund Information">
              <Stack spacing={1}>
                <InfoBox
                  label="Total Refunded"
                  value={formatCurrency(payment.refundInfo.totalRefunded)}
                />
                <InfoBox label="Refund Count" value={payment.refundInfo.refundCount} />
                <InfoBox
                  label="Remaining"
                  value={formatCurrency(payment.refundInfo.remainingAmount)}
                />
              </Stack>
            </SectionCard>
          )}

          {/* Status & Metadata */}
          <SectionCard title="Additional Information">
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Currency
                </Typography>
                <Chip label={payment.currency} size="small" variant="soft" />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Created At
                </Typography>
                <Typography variant="body2">{formatDateTime(payment.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Last Updated
                </Typography>
                <Typography variant="body2">{formatDateTime(payment.updatedAt)}</Typography>
              </Box>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
