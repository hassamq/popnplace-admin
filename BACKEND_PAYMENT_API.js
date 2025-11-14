/**
 * Payment Controller
 * Handles all payment-related operations
 * Location: routes/admin/payments.js or controllers/paymentController.js
 */

const express = require('express');
const router = express.Router();

// Middleware to verify admin role
const { verifyAdmin } = require('../../middleware/auth');

/**
 * GET /api/v1/admin/payments
 * Get all payment records with filtering, sorting, and pagination
 *
 * Query Parameters:
 * - page (number): Page number (default: 1)
 * - limit (number): Records per page (default: 20)
 * - status (string): Payment status filter
 * - paymentType (string): Payment type filter
 * - method (string): Payment method filter
 * - startDate (string): ISO 8601 date string for filtering
 * - endDate (string): ISO 8601 date string for filtering
 * - sortBy (string): Field to sort by (default: createdAt)
 * - sortOrder (string): asc or desc (default: desc)
 */
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentType,
      method,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filters = {};
    if (status) filters.status = status;
    if (paymentType) filters.paymentType = paymentType;
    if (method) filters.method = method;

    // Date range filtering
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = endDateTime;
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Query payment collection
    // Note: Replace 'Payment' with your actual Mongoose model or database query
    const payments = await Payment.find(filters)
      .populate('booking', 'startDate endDate totalAmount bookingReference')
      .populate('payer', 'firstName lastName email phoneNumber isVerified')
      .populate('recipient', 'firstName lastName email phoneNumber isVerified')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Payment.countDocuments(filters);

    // Calculate summary statistics
    const summaryData = await Payment.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalProcessingFees: { $sum: { $ifNull: ['$stripeData.processorFee', 0] } },
          totalServiceFees: { $sum: { $ifNull: ['$breakdown.serviceFee', 0] } },
          totalHostAmount: { $sum: '$hostAmount' },
          totalRenterPaid: { $sum: '$amount' },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
          refundedPayments: {
            $sum: {
              $cond: [
                {
                  $in: ['$status', ['refunded', 'partially_refunded']],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const summary = summaryData[0] || {
      totalAmount: 0,
      totalProcessingFees: 0,
      totalServiceFees: 0,
      totalHostAmount: 0,
      totalRenterPaid: 0,
      completedPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
    };

    // Calculate average payment amount
    summary.averagePaymentAmount =
      summary.completedPayments > 0
        ? (summary.totalAmount / summary.completedPayments).toFixed(2)
        : 0;

    res.json({
      success: true,
      data: payments,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
      summary,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/v1/admin/payments/:id
 * Get single payment details
 */
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('booking')
      .populate('payer')
      .populate('recipient')
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * DELETE /api/v1/admin/payments/:id
 * Delete a payment record
 */
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully',
      data: payment,
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/v1/admin/payments/export/:format
 * Export payment records as CSV or PDF
 */
router.get('/export/:format', verifyAdmin, async (req, res) => {
  try {
    const { format } = req.params;
    const { status, paymentType, method, startDate, endDate } = req.query;

    if (!['csv', 'pdf'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format. Use csv or pdf',
      });
    }

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (paymentType) filters.paymentType = paymentType;
    if (method) filters.method = method;

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = endDateTime;
      }
    }

    // Fetch payment data
    const payments = await Payment.find(filters)
      .populate('booking', 'startDate endDate totalAmount bookingReference')
      .populate('payer', 'firstName lastName email phoneNumber')
      .populate('recipient', 'firstName lastName email phoneNumber');

    if (format === 'csv') {
      // Generate CSV
      const csv = generatePaymentCSV(payments);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="payments-${new Date().toISOString()}.csv"`
      );
      res.send(csv);
    } else if (format === 'pdf') {
      // Generate PDF using a library like pdfkit
      const pdf = await generatePaymentPDF(payments);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="payments-${new Date().toISOString()}.pdf"`
      );
      res.send(pdf);
    }
  } catch (error) {
    console.error('Error exporting payments:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * Helper function to generate CSV
 */
function generatePaymentCSV(payments) {
  const headers = [
    'Payment ID',
    'Payer',
    'Recipient',
    'Amount',
    'Status',
    'Method',
    'Type',
    'Transaction ID',
    'Processing Fee',
    'Host Amount',
    'Date',
  ];

  const rows = payments.map((p) => [
    p._id,
    `${p.payer.firstName} ${p.payer.lastName}`,
    `${p.recipient.firstName} ${p.recipient.lastName}`,
    p.amount,
    p.status,
    p.method,
    p.paymentType,
    p.stripeData?.transactionId || '-',
    p.stripeData?.processorFee || 0,
    p.hostAmount,
    new Date(p.createdAt).toISOString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  return csv;
}

/**
 * Helper function to generate PDF (requires pdfkit or similar library)
 */
async function generatePaymentPDF(payments) {
  // Implementation would use pdfkit or similar library
  // This is a placeholder
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();

  doc.fontSize(16).text('Payment Records Report', { align: 'center' });
  doc.moveDown();

  payments.forEach((payment) => {
    doc.fontSize(10).text(`Payment ID: ${payment._id}`);
    doc.text(`Payer: ${payment.payer.firstName} ${payment.payer.lastName}`);
    doc.text(`Recipient: ${payment.recipient.firstName} ${payment.recipient.lastName}`);
    doc.text(`Amount: €${payment.amount}`);
    doc.text(`Status: ${payment.status}`);
    doc.moveDown();
  });

  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

module.exports = router;
