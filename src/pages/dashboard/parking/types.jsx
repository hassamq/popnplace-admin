import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Parking Space Types - ${CONFIG.appName}` };

export default function ParkingTypesPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Parking Space Types" />
    </>
  );
}
