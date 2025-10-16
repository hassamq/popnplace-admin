import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppWidgetSummary } from '../app-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 
 ${user?.displayName}`}
            description="Manage your parking spaces and rental properties efficiently with PopnPlace Admin Panel."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Add New Space
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        {/* PopnPlace specific metrics */}
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Parking Spaces"
            percent={2.6}
            total={1245}
            icon={<Box component="span" sx={{ ...svgColorClasses.root }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active Bookings"
            percent={-0.1}
            total={387}
            color="info"
            icon={<Box component="span" sx={{ ...svgColorClasses.root }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Monthly Revenue"
            percent={0.6}
            total={48576}
            color="warning"
            icon={<Box component="span" sx={{ ...svgColorClasses.root }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Registered Users"
            percent={2.8}
            total={1897}
            color="error"
            icon={<Box component="span" sx={{ ...svgColorClasses.root }} />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
