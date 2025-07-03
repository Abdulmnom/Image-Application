import React, { useState, useContext } from 'react'
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../ContextApi/auth-context'

const RegisterPage = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading , setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }
        // منطق التسجيل هنا
        setError(' تم انشاء الحساب بنجاح مرحبا بك ',auth.username);
        navigate('/login');
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
                                    إنشاء حساب جديد
                                </Card.Title>
                                {error && (
                                    <Alert variant="danger">{error}</Alert>
                                )}
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="registerUsername">
                                        <Form.Label>اسم المستخدم</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="ادخل اسم المستخدم"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="registerPassword">
                                        <Form.Label>كلمة المرور</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="ادخل كلمة المرور"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="registerConfirmPassword">
                                        <Form.Label>تأكيد كلمة المرور</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="اعد كتابة كلمة المرور"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="w-100 mb-2">
                                        إنشاء حساب
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <span>لديك حساب بالفعل؟ </span>
                                    <Button variant="outline-success" size="sm" onClick={() => navigate('/login')}>
                                        تسجيل الدخول
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