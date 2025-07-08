import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../ContextApi/auth-context';
import { LanguageContext } from '../components/LanguageContext';
import { Card, Button, Form, Container, Alert } from 'react-bootstrap';

const ProfilePage = () => {
  const { token, user, login } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.put(
        'http://localhost:4000/api/auth/update',
        { username, email, newPassword },
        { headers: { Authorization: token } }
      );
      login(res.data.token, res.data.user); // update user context
      setMessage(res.data.message || t('profile_updated'));
      setNewPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || t('profile_update_failed'));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Card className="shadow-lg" style={{ borderRadius: '20px', maxWidth: 500, margin: 'auto' }}>
          <Card.Body>
            <Card.Title className="mb-4 text-center" style={{ fontWeight: 'bold', fontSize: '2rem', color: '#28a745' }}>
              👤 {t('profile')}
            </Card.Title>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>{t('username')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t('email')}</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>{t('new_password')}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t('new_password')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100">
                {t('update')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;