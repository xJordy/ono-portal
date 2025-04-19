import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#B3D135' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ONO Portal
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/guide"
            startIcon={<HelpOutlineIcon />}
          >
            מדריך למשתמש
          </Button>
          <Button color="inherit" component={Link} to="/admin">פורטל מנהל</Button>
          <Button color="inherit" component={Link} to="/student">פורטל הסטודנט</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;