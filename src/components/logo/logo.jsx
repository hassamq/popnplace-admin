import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export const Logo = forwardRef(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const gradientId = useId();

    const TEXT_PRIMARY = theme.vars.palette.text.primary;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    const singleLogo = (
      <Box
        alt="PopnPlace Logo"
        component="img"
        src="/logo/logo-single.png"
        width="100%"
        height="100%"
        sx={{
          objectFit: 'contain',
        }}
      />
    );

    const fullLogo = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {/* Logo Image */}
        <Box
          alt="PopnPlace Logo"
          component="img"
          src="/logo/logo-single.png"
          sx={{
            width: 40,
            height: 40,
            objectFit: 'contain',
          }}
        />

        {/* Text */}
        <Box>
          <Box
            component="span"
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1,
            }}
          >
            PopnPlace
          </Box>
          <Box
            component="div"
            sx={{
              fontSize: 10,
              fontWeight: 500,
              color: PRIMARY_MAIN,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1,
              marginTop: 0.2,
            }}
          >
            PARKING SOLUTIONS
          </Box>
        </Box>
      </Box>
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
