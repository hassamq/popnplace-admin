import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentDetailsView } from 'src/sections/payment/view';

// ----------------------------------------------------------------------

const metadata = { title: `Payment Details - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <PaymentDetailsView />
    </>
  );
}
