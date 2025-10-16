import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentListView } from 'src/sections/payment/view';

const metadata = { title: `Refunds - ${CONFIG.appName}` };

export default function PaymentRefundsPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <PaymentListView />
    </>
  );
}
