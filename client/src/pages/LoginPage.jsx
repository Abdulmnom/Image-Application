import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Container, Row, Col, Alert, Toast , ToastContainer } from 'react-bootstrap'
import { AuthContext } from '../ContextApi/auth-context'
import { useContext } from 'react'
import { LanguageContext } from '../components/LanguageContext'
import axios from 'axios'

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const {login} = useContext(AuthContext);
    const {t } = useContext(LanguageContext);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
             const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
             const { token, user } = res.data;
             login(token, user);
             navigate('/home');
        } catch (error) {
            setError(error?.response?.data?.message || 'Login failed error in the server');
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
                                    {t('login_title')}
                                </Card.Title>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>{t('email')}</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder={t('email_placeholder')}
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label>{t('password')}</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder={t('password_placeholder')}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="w-100 mb-2" disabled={loading}>
                                        { loading ? t('loading') : t('login')}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <span>{t('no_account')}</span>
                                    <Button variant="outline-success" size="sm" onClick={() => navigate('/register')}>
                                        {t('create_account')}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer position='top-center' className="p-3" style={{ zIndex: 1 }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">{t('success')}</strong>
                    </Toast.Header>
                    <Toast.Body>{t('login_success')}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default LoginPage