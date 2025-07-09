import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../ContextApi/auth-context";
import { LanguageContext } from "../components/LanguageContext";
import { Container, Row, Col, Card, Button, Modal, ListGroup } from "react-bootstrap";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function HomePage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const { token, user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/images");
      setImages(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch images", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);
// like and unlike
  const handleToggleLike = async (image) => {
    const hasLiked = image.likesBy.includes(user?.userId);
    const endpoint = hasLiked ? "unlike" : "like";

    try {
      await axios.post(`http://localhost:4000/api/images/${image._id}/${endpoint}`, {}, {
        headers: { Authorization: token }
      });
      fetchImages();
    } catch (error) {
      console.error(`❌ Failed to ${endpoint} image`, error);
    }
  };

  const fetchLikedUsers = async (image) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/images/${image._id}/likes`, {
        headers: { Authorization: token }
      });
      setLikedUsers(res.data.users || []);
      setShowLikesModal(true);
    } catch (error) {
      console.error('❌ Failed to fetch liked users', error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 0" }}>
      <Container>
        <h2 className="text-center mb-4" style={{ color: "#1565c0", fontWeight: "bold" }}>
          📸 {t('public_gallery')}
        </h2>
        <Row className="g-4">
          {images.map((img) => {
            const hasLiked = token && img.likesBy.includes(user?.userId);

            return (
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
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span style={{ color: "#e53935", fontWeight: "bold" }}>❤️ {img.likes} {t('likes')}</span>
                      {token && (
                        <Button
                          variant={hasLiked ? "danger" : "outline-primary"}
                          size="sm"
                          onClick={() => handleToggleLike(img)}
                        >
                          {hasLiked ? t('unlike') : t('like')}
                        </Button>
                      )}

                      {token && (
                        <Button variant="outline-info" size="sm" onClick={() => fetchLikedUsers(img)}>
                          {t('who_give_like')}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Image Modal Preview */}
        <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="lg">
          <Modal.Body className="d-flex justify-content-center align-items-center" style={{ background: "#f8f9fa" }}>
            {selectedImage && (
              <img
                src={`http://localhost:4000/${selectedImage.imagePath.replace(/\\/g, "/")}`}
                alt={selectedImage.title}
                style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: "12px" }}
              />
            )}
          </Modal.Body>
        </Modal>

        {/* Who liked modal */}
        <Modal show={showLikesModal} onHide={() => setShowLikesModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('who_give_like')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {likedUsers.length > 0 ? (
              <ListGroup>
                {likedUsers.map((u, index) => (
                  <ListGroup.Item key={index}>{u.username || u.email}</ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-center">{t('no_likes_yet')}</p>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default HomePage;
