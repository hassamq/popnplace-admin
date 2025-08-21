import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StorageListView } from 'src/sections/parking/view';

// ----------------------------------------------------------------------

const metadata = { title: `Parking Spaces - ${CONFIG.appName}` };

export default function ParkingSpacesListPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

  <StorageListView />
    </>
  );
}
