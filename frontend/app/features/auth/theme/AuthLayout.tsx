import * as React from 'react';
import { CssBaseline, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Outlet, Link as RouterLink} from 'react-router-dom';
import { Link } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: 450,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    background:
      'radial-gradient(ellipse at center, hsl(210,100%,97%), hsl(0,0%,100%))',
  },
}));

const SignContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  minHeight: '100dvh',
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function AuthLayout() {
  return (
    <>
      <CssBaseline />
      <SignContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Link to="/" style={{ textDecoration: 'none' }}>
          {/* Logo */}
            <Typography
             variant="h5"
             sx={{
              color: '#f05537',
              fontWeight: 'bold',
               fontSize: '1.5rem',
               textAlign: 'left',
              }}
            >
             eventflow
            </Typography>
          </Link>
          <Outlet />
        </Card>
      </SignContainer>
    </>
  );
}