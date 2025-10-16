import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RenterListView } from 'src/sections/renter/view';

const metadata = { title: `All Renters - ${CONFIG.appName}` };

export default function RenterListPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <RenterListView title="All Renters" />
    </>
  );
}
