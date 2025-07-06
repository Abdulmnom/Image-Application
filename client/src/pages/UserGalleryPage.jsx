import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../ContextApi/auth-context';
import { Card, Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';

const UserGalleryPage = () => {
  const { token } = useContext(AuthContext);

  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [message, setMessage] = useState('');

  // Fetch user's images from the server
  const fetchUserImages = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/images/my', {
        headers: { Authorization: token }
      });
      setImages(res.data);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  // Handle image deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/images/${id}`, {
        headers: { Authorization: token }
      });
      setMessage('✅ Image deleted successfully');
      fetchUserImages();
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  // Handle image update
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/images/${id}`,
        {
          title: newTitle,
          description: newDescription
        },
        {
          headers: { Authorization: token }
        }
      );
      setMessage('✅ Image updated successfully');
      setEditingId(null);
      fetchUserImages();
    } catch (err) {
      console.error('Failed to update image:', err);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        padding: '40px 0'
      }}
    >
      <Container>
        <h2 className="text-center mb-4" style={{ color: '#28a745', fontWeight: 'bold' }}>
          🖼️ My Gallery
        </h2>
        {message && <Alert variant="info" className="text-center">{message}</Alert>}
        <Row className="g-4">
          {images.map((img) => (
            <Col xs={12} md={6} lg={4} key={img._id}>
              <Card className="shadow" style={{ borderRadius: '18px', minHeight: '320px' }}>
                <Card.Img
                  variant="top"
                  // ضروري كتبات replace لإزالة السلاش
                  src={`http://localhost:4000/${img.imagePath.replace('\\', '/')}`}
                  alt={img.title}
                  style={{ height: '180px', objectFit: 'cover', borderRadius: '18px 18px 0 0' }}
                />
                <Card.Body>
                  {editingId === img._id ? (
                    <Form>
                      <Form.Group className="mb-2">
                        <Form.Control
                          type="text"
                          value={newTitle}
                          placeholder="New title"
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Control
                          as="textarea"
                          value={newDescription}
                          placeholder="New description"
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="success" size="sm" className="me-2" onClick={() => handleUpdate(img._id)}>
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <Card.Title style={{ color: '#1565c0', fontWeight: 'bold' }}>{img.title}</Card.Title>
                      <Card.Text>{img.description}</Card.Text>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setEditingId(img._id);
                          setNewTitle(img.title);
                          setNewDescription(img.description);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(img._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {images.length === 0 && (
          <div className="text-center mt-5" style={{ color: '#1565c0', fontWeight: 'bold' }}>
            No images to display.
          </div>
        )}
      </Container>
    </div>
  );
};
export default UserGalleryPage;