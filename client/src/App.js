import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadForm from './pages/UploadFormPage';
import UserGalleryPage from './pages/UserGalleryPage';
import ProfilePage from './pages/ProfilePage.jsx';
import Navbar from './components/Navbar';

import { AuthContext } from './ContextApi/auth-context';

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <Router>
       <Navbar />
      <Routes>
       
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={ <HomePage /> } />
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/home" />} />
        <Route path="/upload" element={token ? <UploadForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/my-gallery" element={token ? <UserGalleryPage token={token} /> : <Navigate to="/login" />} />
        <Route path="*" element={<h2>❌ الصفحة غير موجودة</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
