import React from 'react';
import axios from 'axios';
import { AuthContext } from '../ContextApi/auth-context';
import { LanguageContext } from '../components/LanguageContext';
import {
  Form, Button, Container, Card, Row, Col,
  Toast, ToastContainer
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

const UploadForm = () => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [toastMessage, setToastMessage] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);

  const { token } = React.useContext(AuthContext);
  const { t } = React.useContext(LanguageContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const PORT = `http://localhost:4000/api/images/upload`;

    if (!image) {
      setToastMessage(t('select_image'));
      setShowToast(true);
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

      setToastMessage(res?.data?.message || t('upload_success'));
      setShowToast(true);
      setTitle('');
      setDescription('');
      setImage(null);
      // Redirect to the home page after 1.5 seconds
       setTimeout(() => {
        navigate('/home'); 
      }, 1500);

    } catch (err) {
      setToastMessage(err?.response?.data?.message || t('upload_failed'));
      setShowToast(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg" style={{ borderRadius: '20px' }}>
              <Card.Body>
                <Card.Title className="mb-4 text-center" style={{ fontWeight: 'bold', fontSize: '2rem', color: '#28a745' }}>
                  📤 {t('upload_image')}
                </Card.Title>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>{t('image_title')}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t('image_title_placeholder')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>{t('image_description')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={t('image_description_placeholder')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formImage">
                    <Form.Label>{t('choose_image')}</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" className="w-100">
                    {t('upload')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ✅ Toast Container */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default UploadForm;
