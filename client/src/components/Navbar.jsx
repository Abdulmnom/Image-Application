import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../ContextApi/auth-context';
import { ThemeContext } from './ThemeContext';
import { LanguageContext } from './LanguageContext';
import logo from '../image/icon.png';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { t, toggleLang, lang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" className="mb-4">
      <Container>
              <BsNavbar.Brand as={Link} to="/home">
         <img
           src={logo}
           alt="App Logo"
           style={{ width: 32, height: 32, marginRight: 8, verticalAlign: 'middle' }}
         />
         {t('app_name') || 'Image Gallery'}
       </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && (
              <>
                <Nav.Link as={Link} to="/upload">{t('upload')}</Nav.Link>
                <Nav.Link as={Link} to="/my-gallery">{t('my_gallery')}</Nav.Link>
                <Nav.Link as={Link} to="/profile">{t('profile')}</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center gap-2">
            <Button variant={darkMode ? 'secondary' : 'outline-secondary'} onClick={toggleTheme}>
              {darkMode ? t('light') : t('dark')}
            </Button>
            {token ? (
              <>
                <span className="text-success fw-bold">
                  {t('welcome')}, {user?.username || user?.email || ''}
                </span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm">
                  {t('login')}
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  {t('register')}
                </Button>
              </>
            )}
            <Button variant="outline-secondary" size="sm" onClick={toggleLang}>
              🌐 {lang === 'ar' ? 'English' : 'عربي'}
            </Button>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
