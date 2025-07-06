import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../ContextApi/auth-context'

const Navbar = () => {
    const { user, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <BsNavbar
            expand="md"
            bg="primary"
            variant="light"
            dir="rtl"
            className="main-navigation shadow-sm"
            style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #e3f0ff 0%, #b3d8fd 100%)'
            }}
        >
            <Container fluid>
                <BsNavbar.Brand
                    as={NavLink}
                    to="/home"
                    style={{ color: '#1565c0', fontSize: '1.5rem', fontWeight: 'bold' }}
                >
                    Gallery
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="navbarContent" />
                <BsNavbar.Collapse id="navbarContent" className="main-navigation-items">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/home" className="nav-link" style={{ color: '#1565c0' }}>
                            Home
                        </Nav.Link>
                        {token && (
                            <Nav.Link as={NavLink} to="/my-gallery" className="nav-link" style={{ color: '#1565c0' }}>
                                My Images
                            </Nav.Link>
                        )}
                        {token && (
                            <Nav.Link as={NavLink} to="/upload" className="nav-link" style={{ color: '#1565c0' }} >
                             upload image
                            </Nav.Link>
                        )}
                         {!token && (
                            <Nav.Link as={NavLink} to="/login" className="nav-link" style={{ color: '#1565c0' }}>
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                    {token && (
                        <Nav>
                            <Nav.Link as={NavLink} to="/profile" className="nav-link" style={{ color: '#28a745' }}>
                                {user?.username || user?.email || 'User'}
                            </Nav.Link>
                            <Button
                                variant="outline-danger"
                                className="ms-2"
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                            >
                                Logout
                            </Button>
                        </Nav>
                    )}
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default Navbar