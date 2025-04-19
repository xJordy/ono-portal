import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
            <Route path="/" element={<StudentPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/guide" element={<UserGuide />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;