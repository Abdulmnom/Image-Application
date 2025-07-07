import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../ContextApi/auth-context'
import { ThemeContext } from './ThemeContext'
import { LanguageContext } from './LanguageContext';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { t , toggleLang , lang} = useContext(LanguageContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg">
      <Container>
        <BsNavbar.Brand as={Link} to="/home">📸 Image Gallery</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && (
              <>
                <Nav.Link as={Link} to="/upload">Upload Image</Nav.Link>
                <Nav.Link as={Link} to="/my-gallery">My Gallery</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center gap-2">
            <Button variant={darkMode ? 'secondary' : 'outline-secondary'} onClick={toggleTheme}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </Button>
            {token ? (
              <>
                <span className="text-success fw-bold">Welcome, {user?.username}</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm">Login</Button>
                <Button as={Link} to="/register" variant="primary" size="sm">Register</Button>
              </>
            )}
            <Button variant="outline-secondary" size="sm" onClick={toggleLang}>
  🌐          {lang === 'ar' ? 'English' : 'عربي'}
            </Button>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar