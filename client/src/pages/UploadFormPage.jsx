import React from 'react'
import axios from 'axios'
import { AuthContext } from '../ContextApi/auth-context'
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap'

const UploadForm = () => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const { token } = React.useContext(AuthContext);

  // Handle form submit for uploading image
  const handleSubmit = async (e) => {
    e.preventDefault();
    const PORT = `http://localhost:4000/api/images/upload`;
    if (!image) {
      setMessage('Please select an image');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const res = await axios.post(PORT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
      setMessage(res?.data?.message || 'Image uploaded successfully');
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to upload image');
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
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg" style={{ borderRadius: '20px' }}>
              <Card.Body>
                <Card.Title className="mb-4 text-center" style={{ fontWeight: 'bold', fontSize: '2rem', color: '#28a745' }}>
                  📤 Upload New Image
                </Card.Title>
                {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Image Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter image title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Image Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter image description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formImage">
                    <Form.Label>Choose Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" className="w-100">
                    Upload Image
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UploadForm