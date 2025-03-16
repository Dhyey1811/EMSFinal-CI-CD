import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#00468b' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            EMS
          </Link>
        </Typography>
        <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ marginLeft: 2 }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            color="primary"
            sx={{ marginLeft: 2 }}
          >
            Create Employee
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
