import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Renter Profiles - ${CONFIG.appName}` };

export default function RenterProfilesPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Renter Profiles" />
    </>
  );
}
