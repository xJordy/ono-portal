import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Typography,
  Paper
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Sidebar = ({ onNavigate, currentPage }) => {
  // Simple navigation items
  const navItems = [
    { id: 'dashboard', label: 'לוח בקרה', icon: <DashboardIcon /> },
    { id: 'courses', label: 'רשימת קורסים', icon: <ViewListIcon /> },
    { id: 'addCourse', label: 'הוספת קורס', icon: <AddIcon /> }
  ];

  return (
    <Paper sx={{ width: 200, height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" align="center">
          ניהול המערכת
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton 
              selected={currentPage === item.id}
              onClick={() => onNavigate(item.id)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;