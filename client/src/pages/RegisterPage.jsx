import React, { useState, useContext } from 'react'
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../ContextApi/auth-context'
import axios from 'axios'

const RegisterPage = () => {
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    try {
        setLoading(true);
        await axios.post('http://localhost:4000/api/auth/register', { username, email, password });
        setError('');
        navigate('/login');
    } catch (err) {
        setError('Registration failed');
    } finally {
        setLoading(false);
    }
};

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} lg={4}>
                        <Card className="shadow-lg" style={{ borderRadius: '20px' }}>
                            <Card.Body>
                                <Card.Title className="mb-4 text-center" style={{ fontWeight: 'bold', fontSize: '2rem', color: '#28a745' }}>
                                    Create New Account
                                </Card.Title>
                                {error && (
                                    <Alert variant="danger">{error}</Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="registerUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="registerEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="registerPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="registerConfirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Re-enter password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="w-100 mb-2" disabled={loading}>
                                        {loading ? 'Registering...' : 'Register'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <span>Already have an account? </span>
                                    <Button variant="outline-success" size="sm" onClick={() => navigate('/login')}>
                                        Login
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default RegisterPage