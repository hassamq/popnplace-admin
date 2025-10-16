import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { PaymentListView } from 'src/sections/payment/view';

const metadata = { title: `Methods - ${CONFIG.appName}` };

export default function PaymentMethodsPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <PaymentListView />
    </>
  );
}
