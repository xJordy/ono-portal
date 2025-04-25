import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/common/Header';
import AdminPortal from './components/admin/AdminPortal';
import StudentPortal from './components/student/StudentPortal';
import UserGuide from './components/guide/UserGuide';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Container>
        <Routes>
            {/* Redirect root path to admin portal */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            
            {/* Admin routes with nested structure */}
            <Route path="/admin/*" element={<AdminPortal />} />
            
            {/* Keep student portal accessible via its path */}
            <Route path="/student/*" element={<StudentPortal />} />
            <Route path="/guide" element={<UserGuide />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;