import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `Email Templates - ${CONFIG.appName}` };

export default function CommunicationTemplatesPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="Email Templates" />
    </>
  );
}
