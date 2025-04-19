import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import onoLogo from '../../assets/ono-logo.png'; // Import the logo

const Header = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  
  const handleLogoClick = () => {
    navigate('/admin'); // Navigate to admin portal when logo is clicked
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#B3D136' }}>
      <Toolbar>
        {/* Logo container with click handler */}
        <Box 
          component="div" 
          onClick={handleLogoClick}
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* White background container */}
          <Box 
            sx={{
              backgroundColor: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src={onoLogo} 
              alt="ONO Academic College Logo" 
              style={{ 
                height: '50px', // Increased from 40px to 50px
                maxWidth: '100%'
              }}
            />
          </Box>
        </Box>

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