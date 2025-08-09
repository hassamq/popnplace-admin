import { RentersView } from 'src/sections/renters';

export default function OwnersListPage() {
  // Pass userRole='host' to RentersView
  return <RentersView userRole="host" />;
}
