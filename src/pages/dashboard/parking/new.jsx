import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ParkingSpaceNewView } from 'src/sections/parking/view';

// ----------------------------------------------------------------------

const metadata = { title: `Add New Parking Space - ${CONFIG.appName}` };

export default function ParkingSpaceNewPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ParkingSpaceNewView />
    </>
  );
}
