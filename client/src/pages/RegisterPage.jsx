import React, { useState, useContext } from 'react'
import { Card, Button, Form, Container, Row, Col, Alert ,Toast , ToastContainer } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../ContextApi/auth-context'
import { LanguageContext } from '../components/LanguageContext'
import axios from 'axios'

const RegisterPage = () => {
    const navigate = useNavigate();
    const {  login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false); // [value , set]
    const [loading, setLoading] = useState(false);
    const { t } = useContext(LanguageContext);

const handleSubmit = async (e) => {
  // check for inputs validation
    e.preventDefault();
    if (password !== confirmPassword) {
        setError(`❌ ${t('password_not_match')}`);
        return;
    }
    if (!email.includes('@')) {
      setError(`❌ ${t('invalid_email')}`);
      return;
    }
    if (password.length < 6) {
      setError(` ❌ ${t('password_too_short')}` );
      return;
    };
    try {
        setLoading(true);
        // to register
        await axios.post('http://localhost:4000/api/auth/register', { username, email, password });
        // to login after register 
        const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
        const { token, user } = res.data;
        login(token, user);
        setShowToast(true);
        setError('');
        navigate('/home');
    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
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
                {t('register')}
              </Card.Title>

              {error && (
                <Alert variant="danger">{error}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerUsername">
                  <Form.Label>{t('username')}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t('username')}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label>{t('password')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="registerConfirmPassword">
                  <Form.Label>{t('confirm_password')}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t('confirm_password')}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100 mb-2" disabled={loading}>
                  {loading ? t('registering') : t('register')}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span>{t('already_have_account')} </span>
                <Button variant="outline-success" size="sm" onClick={() => navigate('/login')}>
                  {t('login')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <ToastContainer position="bottom-end" className="p-3">
  <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
      <Toast.Header>
        <strong className="me-auto">🎉 {t('register_success') || 'Success'}</strong>
      </Toast.Header>
      <Toast.Body className="text-white">{t('welcome')}, {username}!</Toast.Body>
    </Toast>
    </ToastContainer>
  </div>
);

}

export default RegisterPage