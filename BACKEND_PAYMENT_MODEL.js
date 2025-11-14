/**
 * Payment Model Schema (Mongoose)
 * Location: models/Payment.js
 *
 * This schema defines the payment record structure for the PopnPlace admin system.
 * Includes all transaction details, fees, refunds, and Stripe integration data.
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // RELATIONS
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Renter
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Host/Owner
    },

    // PAYMENT AMOUNTS
    amount: {
      type: Number,
      required: true,
      min: 0,
      description: 'Total amount charged to renter',
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP', 'CHF'],
    },
    renterPaid: {
      type: Number,
      required: true,
      min: 0,
      description: 'Amount paid by renter (same as amount)',
    },
    hostAmount: {
      type: Number,
      required: true,
      min: 0,
      description: 'Amount host receives after all deductions',
    },

    // PAYMENT TYPE & STATUS
    paymentType: {
      type: String,
      enum: ['booking_payment', 'security_deposit', 'additional_fee', 'refund', 'payout'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'refunded',
        'partially_refunded',
        'disputed',
        'on_hold',
      ],
      default: 'pending',
    },

    // PAYMENT METHOD
    method: {
      type: String,
      enum: ['stripe', 'credit_card', 'debit_card', 'paypal', 'bank_transfer', 'square'],
      required: true,
    },

    // PAYMENT BREAKDOWN
    breakdown: {
      subtotal: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      processingFee: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      discounts: { type: Number, default: 0 },
      securityDeposit: { type: Number, default: 0 },
    },

    // STRIPE DETAILS
    stripeData: {
      transactionId: { type: String }, // Payment Intent ID (pi_xxx)
      externalTransactionId: { type: String },
      processorFee: { type: Number, default: 0 },
      netAmount: { type: Number, default: 0 },
      exchangeRate: { type: Number, default: 1.0 },
      processedAt: { type: Date },
    },

    // CARD DETAILS
    paymentMethod: {
      type: { type: String, enum: ['card', 'bank_account', 'digital_wallet'] },
      brand: { type: String }, // visa, mastercard, amex, etc.
      last4: { type: String },
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
    },
    cardDetails: {
      type: { type: String, enum: ['card', 'bank_account'] },
      brand: { type: String },
      last4: { type: String },
      expiry: { type: String }, // MM/YYYY format
    },

    // PAYOUT INFO
    payoutInfo: {
      payoutId: { type: String },
      payoutAmount: { type: Number, default: 0 },
      payoutFee: { type: Number, default: 0 },
      payoutDate: { type: Date },
      payoutMethod: { type: String },
      payoutStatus: {
        type: String,
        enum: ['pending', 'in_transit', 'paid', 'failed', 'cancelled'],
      },
    },

    // REFUND INFORMATION
    refundInfo: {
      totalRefunded: { type: Number, default: 0 },
      remainingAmount: { type: Number, default: 0 },
      refundCount: { type: Number, default: 0 },
      refunds: [
        {
          refundId: String,
          amount: Number,
          reason: String,
          status: String,
          refundedAt: Date,
        },
      ],
    },

    // SECURITY DEPOSIT
    securityDepositInfo: {
      amount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['held', 'released', 'deducted', 'pending_release'],
      },
      releaseDate: { type: Date },
      deductions: [
        {
          amount: Number,
          reason: String,
          deductedAt: Date,
        },
      ],
    },

    // TIMELINE
    timeline: {
      initiatedAt: { type: Date },
      authorizedAt: { type: Date },
      capturedAt: { type: Date },
      settledAt: { type: Date },
      failedAt: { type: Date },
      refundedAt: { type: Date },
    },

    // NOTES
    notes: {
      internal: { type: String }, // Admin notes
      customer: { type: String }, // Customer-facing message
    },

    // METADATA
    metadata: {
      source: { type: String, enum: ['web', 'mobile', 'api'] },
      ipAddress: { type: String },
      userAgent: { type: String },
      webhookData: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: 'payments',
  }
);

// INDEXES for better query performance
paymentSchema.index({ booking: 1 });
paymentSchema.index({ payer: 1 });
paymentSchema.index({ recipient: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ 'stripeData.transactionId': 1 });
paymentSchema.index({ amount: 1 });
paymentSchema.index({ hostAmount: 1 });

// Compound indexes for common queries
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ paymentType: 1, createdAt: -1 });
paymentSchema.index({ method: 1, status: 1 });

// TEXT INDEX for search functionality
paymentSchema.index({
  'payer.firstName': 'text',
  'payer.lastName': 'text',
  'recipient.firstName': 'text',
  'recipient.lastName': 'text',
});

// VIRTUAL for formatted amounts
paymentSchema.virtual('formattedAmount').get(function () {
  return `€${this.amount.toFixed(2)}`;
});

// VIRTUAL for formatted host amount
paymentSchema.virtual('formattedHostAmount').get(function () {
  return `€${this.hostAmount.toFixed(2)}`;
});

// Pre-save validation
paymentSchema.pre('save', async function (next) {
  // Validate that amount is consistent
  if (this.renterPaid !== this.amount) {
    this.renterPaid = this.amount;
  }

  // Calculate hostAmount if not set
  if (!this.hostAmount) {
    const totalFees =
      (this.breakdown?.serviceFee || 0) +
      (this.stripeData?.processorFee || 0) +
      (this.breakdown?.processingFee || 0);
    this.hostAmount = this.amount - totalFees;
  }

  // Update refund remaining amount
  if (this.refundInfo) {
    this.refundInfo.remainingAmount = this.amount - (this.refundInfo.totalRefunded || 0);
  }

  next();
});

// Method to mark as completed
paymentSchema.methods.markAsCompleted = function () {
  this.status = 'completed';
  this.timeline.settledAt = new Date();
  return this.save();
};

// Method to issue refund
paymentSchema.methods.issueRefund = function (amount, reason = '') {
  if (!this.refundInfo) {
    this.refundInfo = { totalRefunded: 0, refunds: [] };
  }

  if (amount > this.refundInfo.remainingAmount) {
    throw new Error('Refund amount exceeds remaining amount');
  }

  const refund = {
    refundId: `ref_${Date.now()}`,
    amount,
    reason,
    status: 'pending',
    refundedAt: new Date(),
  };

  this.refundInfo.refunds.push(refund);
  this.refundInfo.totalRefunded += amount;
  this.refundInfo.refundCount += 1;

  if (this.refundInfo.totalRefunded === this.amount) {
    this.status = 'refunded';
    this.timeline.refundedAt = new Date();
  } else if (this.refundInfo.totalRefunded > 0) {
    this.status = 'partially_refunded';
  }

  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);
