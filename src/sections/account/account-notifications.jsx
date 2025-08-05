import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const NOTIFICATION_TYPES = [
  {
    type: 'email',
    title: 'Email Notifications',
    description: 'Receive notifications via email',
    items: [
      { id: 'bookings', label: 'Booking notifications' },
      { id: 'messages', label: 'Message notifications' },
      { id: 'marketing', label: 'Marketing communications' },
    ],
  },
  {
    type: 'sms',
    title: 'SMS Notifications',
    description: 'Receive notifications via SMS',
    items: [
      { id: 'bookings', label: 'Booking notifications' },
      { id: 'messages', label: 'Message notifications' },
    ],
  },
];

// ----------------------------------------------------------------------

export function AccountNotifications() {
  const { user } = useAuthContext();

  const [defaultValues, setDefaultValues] = useState({
    email: {
      bookings: true,
      messages: true,
      marketing: false,
    },
    sms: {
      bookings: true,
      messages: false,
    },
  });

  useEffect(() => {
    if (user?.notifications) {
      setDefaultValues(user.notifications);
    }
  }, [user]);

  const methods = useForm({
    defaultValues,
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Here you would typically make an API call to update the user's notification preferences
      console.log('Updating notification preferences:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update notification preferences');
    }
  });

  const handleNotificationChange = (type, itemId, checked) => {
    const currentValues = methods.getValues();
    const updatedValues = {
      ...currentValues,
      [type]: {
        ...currentValues[type],
        [itemId]: checked,
      },
    };
    methods.setValue(type, updatedValues[type]);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        {NOTIFICATION_TYPES.map((notificationType, index) => (
          <div key={notificationType.type}>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <ListItemText
                  primary={notificationType.title}
                  secondary={notificationType.description}
                  primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                  secondaryTypographyProps={{ component: 'span' }}
                />
              </Grid>

              <Grid xs={12} md={8}>
                <Stack spacing={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.neutral' }}>
                  {notificationType.items.map((item) => (
                    <FormControlLabel
                      key={item.id}
                      label={item.label}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={values[notificationType.type]?.[item.id] || false}
                          onChange={(e) =>
                            handleNotificationChange(
                              notificationType.type,
                              item.id,
                              e.target.checked
                            )
                          }
                        />
                      }
                      sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>

            {index < NOTIFICATION_TYPES.length - 1 && <Divider sx={{ my: 3 }} />}
          </div>
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save changes
        </LoadingButton>
      </Card>
    </Form>
  );
}
