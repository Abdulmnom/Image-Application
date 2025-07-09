import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Card, Button, Container, Row, Col, Form, Modal, Toast, ToastContainer
 , } from 'react-bootstrap';
import { AuthContext } from '../ContextApi/auth-context';
import { LanguageContext } from '../components/LanguageContext';


const UserGalleryPage = () => {
  const { token } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUserImages = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/images/my', {
        headers: { Authorization: token }
      });
      setImages(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch images:', err);
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:4000/api/images/${deleteId}`, {
        headers: { Authorization: token }
      });
      setToastMessage(t('image_deleted'));
      setShowToast(true);
      fetchUserImages();
    } catch (err) {
      console.error('❌ Failed to delete image:', err);
    }
    setDeleteId(null);
    setEditingId(null);        
    setNewTitle('');            
    setNewDescription('');  
      };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/images/${id}`,
        { title: newTitle, description: newDescription },
        { headers: { Authorization: token } }
      );
      setToastMessage(t('image_updated'));
      setShowToast(true);
      setEditingId(null);
      fetchUserImages();
    } catch (err) {
      console.error('❌ Failed to update image:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <Container>
        <h2 className="text-center mb-4" style={{ color: '#28a745', fontWeight: 'bold' }}>
          🖼️ {t('my_gallery')}
        </h2>

        <Row className="g-4">
          {images.map((img) => (
            <Col xs={12} md={6} lg={4} key={img._id}>
              <Card className="shadow" style={{ borderRadius: '18px', minHeight: '320px' }}>
                <Card.Img
                  variant="top"
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
                          placeholder={t('new_title')}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Control
                          as="textarea"
                          value={newDescription}
                          placeholder={t('new_description')}
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="success" size="sm" className="me-2" onClick={() => handleUpdate(img._id)}>
                        {t('update')}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>
                        {t('cancel')}
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
                        {t('edit')}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setDeleteId(img._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        {t('delete')}
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
            {t('no_images')}
          </div>
        )}
      </Container>

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false)
        setEditingId(null);
        setNewTitle('');
        setNewDescription('');
      }} centered>
        
        <Modal.Body className="text-center">
          <h5>{t('confirm_delete')}</h5>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="danger" onClick={handleDelete}>{t('delete')}</Button>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>{t('cancel')}</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserGalleryPage;
