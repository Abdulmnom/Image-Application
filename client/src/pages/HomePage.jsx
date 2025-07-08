import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../ContextApi/auth-context";
import { LanguageContext } from "../components/LanguageContext";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

function HomePage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = React.useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  // Fetch all public images from the server
  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/images");
      setImages(res.data);
    } catch (error) {
      console.log('Failed to fetch images', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle like button click
  const handleLike = async (id) => {
    try {
      await axios.post(
        `http://localhost:4000/api/images/${id}/like`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchImages(); // Refresh images to update likes
    } catch (error) {
      console.error('Failed to like image', error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <Container>
        <h2 className="text-center mb-4" style={{ color: "#1565c0", fontWeight: "bold" }}>
          📸 {t('public_gallery')}
        </h2>
        <Row className="g-4">
          {images.map((img) => (
            <Col xs={12} md={6} lg={4} key={img._id}>
              <Card className="shadow-sm" style={{ borderRadius: "18px", minHeight: "350px" }}>
                <Card.Img
                  variant="top"
                  src={`http://localhost:4000/${img.imagePath.replace(/\\/g, "/")}`}
                  alt={img.title}
                  style={{ height: "200px", objectFit: "cover", borderRadius: "18px 18px 0 0", cursor: "pointer" }}
                  onClick={() => setSelectedImage(img)}
                />
                <Card.Body>
                  <Card.Title style={{ color: "#1565c0", fontWeight: "bold" }}>{img.title}</Card.Title>
                  <Card.Text>{img.description}</Card.Text>
                  <div className="d-flex align-items-center justify-content-between">
                    <span style={{ color: "#e53935", fontWeight: "bold" }}>❤️ {img.likes} {t('likes')}</span>
                    {token && (
                      <Button variant="outline-primary" size="sm" onClick={() => handleLike(img._id)}>
                        {t('like')}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal for image preview */}
        <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="lg">
          <Modal.Body className="d-flex justify-content-center align-items-center" style={{ background: "#f8f9fa" }}>
            {selectedImage && (
              <img
                src={`http://localhost:4000/uploads/${selectedImage.imagePath}`}
                alt={selectedImage.title}
                style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: "12px" }}
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default HomePage;