import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Owner Details - ${CONFIG.appName}` };

export default function OwnerDetailsPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Owner Details" />
    </>
  );
}
