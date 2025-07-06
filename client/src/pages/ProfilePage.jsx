import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../ContextApi/auth-context';
import { Card, Button, Form, Container, Alert } from 'react-bootstrap';

const ProfilePage = () => {
  const { token, user, login } = useContext(AuthContext);
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
      setMessage(res.data.message || 'Profile updated successfully');
      setNewPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Card className="shadow-lg" style={{ borderRadius: '20px', maxWidth: 500, margin: 'auto' }}>
          <Card.Body>
            <Card.Title className="mb-4 text-center" style={{ fontWeight: 'bold', fontSize: '2rem', color: '#28a745' }}>
              👤 Profile
            </Card.Title>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>New Password (optional)</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100">
                Update Profile
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ProfilePage;