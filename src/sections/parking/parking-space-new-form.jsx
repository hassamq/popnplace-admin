import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const NewParkingSpaceSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  type: zod.string().min(1, { message: 'Type is required!' }),
  location: zod.string().min(1, { message: 'Location is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  price: zod.number().min(0, { message: 'Price must be a positive number!' }),
  description: zod.string().optional(),
  features: zod.array(zod.string()).optional(),
  images: zod.array(zod.any()).optional(),
  availability: zod.string().min(1, { message: 'Availability is required!' }),
  maxVehicleSize: zod.string().optional(),
  accessHours: zod.string().optional(),
});

const TYPE_OPTIONS = [
  { value: 'covered', label: 'Covered Parking' },
  { value: 'uncovered', label: 'Uncovered Parking' },
  { value: 'garage', label: 'Garage' },
  { value: 'street', label: 'Street Parking' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
];

const FEATURE_OPTIONS = [
  'Security Camera',
  'Covered',
  'EV Charging',
  '24/7 Access',
  'Well Lit',
  'Close to Entrance',
  'Handicap Accessible',
  'Valet Service',
];

// ----------------------------------------------------------------------

export function ParkingSpaceNewForm() {
  const router = useRouter();

  const defaultValues = {
    name: '',
    type: '',
    location: '',
    address: '',
    price: 0,
    description: '',
    features: [],
    images: [],
    availability: 'available',
    maxVehicleSize: '',
    accessHours: '24/7',
  };

  const methods = useForm({
    resolver: zodResolver(NewParkingSpaceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Creating parking space:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Parking space created successfully!');
      reset();
      router.push(paths.dashboard.parking.list);
    } catch (error) {
      console.error('Error creating parking space:', error);
      toast.error('Failed to create parking space');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader title="Parking Space Details" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text name="name" label="Space Name" />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Field.Select name="type" label="Type">
                  <MenuItem value="">Select Type</MenuItem>
                  {TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Text name="price" label="Price per Hour ($)" type="number" />
              </Box>

              <Field.Text name="location" label="Location/Building" />
              <Field.Text name="address" label="Full Address" multiline rows={2} />
              <Field.Text name="description" label="Description" multiline rows={4} />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Features
                </Typography>
                <Field.MultiCheckbox
                  name="features"
                  options={FEATURE_OPTIONS.map((feature) => ({
                    label: feature,
                    value: feature,
                  }))}
                  sx={{ gap: 2 }}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Availability & Access" />
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Select name="availability" label="Availability Status">
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
                <Field.Text name="maxVehicleSize" label="Max Vehicle Size" />
                <Field.Text name="accessHours" label="Access Hours" />
              </Stack>
            </Card>

            <Card>
              <CardHeader title="Images" />
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Upload
                  name="images"
                  multiple
                  thumbnail
                  maxSize={3145728}
                  helperText="Upload parking space images (max 3MB each)"
                />
              </Stack>
            </Card>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{ mt: 3 }}
            >
              Create Parking Space
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
