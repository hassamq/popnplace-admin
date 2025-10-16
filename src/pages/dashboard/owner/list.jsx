import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { OwnerListView } from 'src/sections/owner/view';

const metadata = { title: `All Owners - ${CONFIG.appName}` };

export default function OwnerListPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <OwnerListView />
    </>
  );
}
