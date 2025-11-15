# Quick Start Guide - Stripe Transactions Integration

## What Changed?

The payment system now displays real Stripe transaction data from the endpoint:

```
GET https://dev-api.popnplace.nl/api/v1/stripe/fetch-all-transactions
```

## How to Use

### 1. View All Transactions

- Navigate to the **Payments** section in the admin dashboard
- You'll see all 81 Stripe transactions automatically loaded
- Each transaction shows:
  - Payment ID (last 8 characters of Stripe ID)
  - Payer name and email
  - Recipient (host) name and email
  - Amount paid and host amount
  - Payment status with color coding
  - Payment method (card, link, etc.)
  - Transaction date and time

### 2. Filter Transactions

**By Status:**

- Use the status dropdown to filter by:
  - Pending (requires_payment_method)
  - Completed (succeeded)
  - Processing
  - Cancelled
  - Failed

**By Payment Method:**

- Filter by payment method type:
  - Stripe
  - Card
  - Link
  - PayPal
  - Bank Transfer

### 3. View Transaction Summary

At the bottom of the page, you'll see:

- **Total Amount**: Sum of all renter payments
- **Processing Fees**: Sum of all platform fees
- **Host Amount**: Total amount paid to hosts
- **Completed**: Count of successful transactions
- **Failed**: Count of failed/pending transactions

### 4. View Transaction Details

- Click the **three-dot menu** (⋮) on any row
- Select **View Details** to see full transaction information
- Select **Delete** to remove a transaction (use with caution)

## Data Structure Reference

### Payment Status Colors

- 🟢 **Green (Success)**: Completed transactions
- 🟡 **Yellow (Warning)**: Pending transactions
- 🔵 **Blue (Info)**: Processing transactions
- 🔴 **Red (Error)**: Failed or disputed transactions
- ⚪ **Gray (Default)**: Cancelled transactions

### Transaction Fields

| Field        | Source                  | Description                          |
| ------------ | ----------------------- | ------------------------------------ |
| Payment ID   | `stripe.id`             | Unique Stripe payment intent ID      |
| Payer        | `localData.renter`      | User who made the payment            |
| Recipient    | `localData.host`        | Host receiving the payment           |
| Total Amount | `financial.renterPaid`  | Amount paid by renter                |
| Host Amount  | `financial.hostAmount`  | Amount received by host (after fees) |
| Platform Fee | `financial.platformFee` | Commission taken by platform         |
| Status       | `stripe.status`         | Payment status from Stripe           |
| Method       | `paymentMethod.type`    | Payment method used                  |
| Date         | `stripe.created`        | When transaction was created         |

## Example Transaction Data

```javascript
{
  stripe: {
    id: "pi_3STFq1IUtODlGjTQ15hZ8jR5",
    amount: 33,
    status: "succeeded",
    created: "2025-11-14T05:46:25.000Z"
  },
  financial: {
    renterPaid: 33,
    platformFee: 3.14,
    hostAmount: 29.86,
    currency: "EUR"
  },
  localData: {
    renter: {
      name: "Bilal Sajid",
      email: "mianbilalsajid81@gmail.com"
    },
    host: {
      name: "iffi victorious",
      email: "irtazakhanx2003@gmail.com"
    },
    booking: {
      _id: "6916c2278a5812f03be7aa61",
      status: "active"
    }
  },
  paymentMethod: {
    type: "card",
    card: {
      brand: "visa",
      last4: "4242"
    }
  }
}
```

## Troubleshooting

### Issue: No transactions showing

**Solution**:

1. Check your internet connection
2. Verify you're logged in with proper admin credentials
3. Check browser console for API errors
4. Ensure the API endpoint is accessible

### Issue: Wrong data displaying

**Solution**:

1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear browser cache
3. Check if filters are applied - reset them if needed

### Issue: Summary shows zeros

**Solution**:

1. Ensure transactions are loaded (check the table)
2. Verify financial data exists in transactions
3. Refresh the page to recalculate

## API Endpoint Details

**Endpoint**: `/api/v1/stripe/fetch-all-transactions`  
**Method**: GET  
**Authentication**: Required (JWT token)  
**Response Format**: JSON

**Response Structure**:

```json
{
  "success": true,
  "totalTransactions": 81,
  "transactions": [...],
  "message": "81 transactions fetched with full enriched data"
}
```

## Notes

- The system supports both old payment records and new Stripe transactions
- Filtering is done client-side for now (all transactions loaded at once)
- Pagination works with the filtered/loaded transactions
- Summary statistics are calculated from all loaded transactions
- Transaction IDs shown are the last 8 characters for brevity (hover to see full ID)

## Support

For issues or questions about the integration, please contact the development team or check the main integration summary document.
