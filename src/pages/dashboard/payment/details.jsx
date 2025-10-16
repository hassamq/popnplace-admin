import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentListView } from 'src/sections/payment/view';

const metadata = { title: `Details - ${CONFIG.appName}` };

export default function PaymentDetailsPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <PaymentListView />
    </>
  );
}
