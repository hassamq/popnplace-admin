import { useCallback } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ParkingSpaceNewForm } from '../parking-space-new-form';

// ----------------------------------------------------------------------

export function ParkingSpaceNewView() {
  const router = useRouter();

  const handleCreateSpace = useCallback(
    async (data) => {
      try {
        console.log('Creating parking space:', data);
        toast.success('Parking space created successfully!');
        router.push(paths.dashboard.parking.list);
      } catch (error) {
        console.error('Error creating parking space:', error);
        toast.error('Failed to create parking space');
      }
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Parking Space"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Parking Spaces', href: paths.dashboard.parking.list },
          { name: 'New Space' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CardHeader
          title="Parking Space Information"
          subheader="Fill in the details below to add a new parking space to your inventory"
          sx={{ mb: 3 }}
        />

        <ParkingSpaceNewForm onSubmit={handleCreateSpace} />
      </Card>
    </DashboardContent>
  );
}
