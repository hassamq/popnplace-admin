import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Payment Settings - ${CONFIG.appName}` };

export default function SettingsPaymentPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Payment Settings" />
    </>
  );
}
