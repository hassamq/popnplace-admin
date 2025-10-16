import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { BlankView } from 'src/sections/blank/view';

const metadata = { title: `General Settings - ${CONFIG.appName}` };

export default function SettingsGeneralPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <BlankView title="General Settings" />
    </>
  );
}
