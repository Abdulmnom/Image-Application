import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../ContextApi/auth-context'

const Navbar = () => {
    const auth = useContext(AuthContext);
    return (
        <BsNavbar expand="md" bg="light" variant="light" dir="rtl" className="main-navigation shadow-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 'bold' }}>
            <Container fluid>
                <BsNavbar.Brand as={NavLink} to="/events" style={{ color: '#007bff', fontSize: '1.5rem' }}>
                    مناسباتنا يا زينها
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="navbarContent" />
                <BsNavbar.Collapse id="navbarContent" className="main-navigation-items">
                    <Nav className="me-auto">
                        
                        {auth.token && (
                            <Nav.Link as={NavLink} to="/bookings" className="nav-link">
                              صوري
                            </Nav.Link>
                        )}
                        {!auth.token && (
                            <Nav.Link as={NavLink} to="/login" className="nav-link">
                                تسجيل الدخول
                            </Nav.Link>
                        )}
                    </Nav>
                    {auth.token && (
                        <Nav>
                            <Nav.Link as={NavLink} to="/profile" className="nav-link" style={{ color: '#28a745' }}>
                                {auth.username}
                            </Nav.Link>
                            <Button variant="outline-danger" className="ms-2" onClick={() => auth.logout()}>
                                تسجيل الخروج
                            </Button>
                        </Nav>
                    )}
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default Navbar