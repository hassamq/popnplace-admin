import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Notifications - ${CONFIG.appName}` };

export default function CommunicationNotificationsPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Notifications" />
    </>
  );
}
