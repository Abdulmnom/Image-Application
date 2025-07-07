import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap'
import { AuthContext } from '../ContextApi/auth-context'
import { useContext } from 'react'
import axios from 'axios'

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useContext(AuthContext);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {

    const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
        const { token, user } = res.data;
        login(token, user);
       navigate('/home');
    } catch (error) {
        console.log(error);
            setError(error?.response?.data?.message || 'Login failed error in the server');
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
                                    تسجيل الدخول
                                </Card.Title>
                               {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formUsername">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="User Name"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label>password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="w-100 mb-2">
                                      Login
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <span>You don't have an account? </span>
                                    <Button variant="outline-success" size="sm" onClick={() => navigate('/register')}>
                                       Create Account
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

export default LoginPage