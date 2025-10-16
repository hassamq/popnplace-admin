import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Edit Owner - ${CONFIG.appName}` };

export default function OwnerEditPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Edit Owner" />
    </>
  );
}
