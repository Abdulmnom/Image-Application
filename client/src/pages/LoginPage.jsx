import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap'
import { AuthContext } from '../ContextApi/auth-context'
import { useContext } from 'react'

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        setError('تم تسجيل الدخول بنجاح');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
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
                                        <Form.Label>اسم المستخدم</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="ادخل اسم المستخدم"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label>كلمة المرور</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="ادخل كلمة المرور"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="w-100 mb-2">
                                        دخول
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <span>ليس لديك حساب؟ </span>
                                    <Button variant="outline-success" size="sm" onClick={() => navigate('/register')}>
                                        إنشاء حساب
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