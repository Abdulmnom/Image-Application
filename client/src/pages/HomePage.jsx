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
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { token, user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/images");
      setImages(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch images", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleLike = async (imageId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/images/${imageId}/like`,
        {},
        { headers: { Authorization: token } }
      );
      fetchImages();
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("⚠️ Failed to like image. Please try again.");
      }
      console.error("❌ Like error:", error);
    }
  };

  const handleUnlike = async (imageId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/images/${imageId}/unlike`,
        {},
        { headers: { Authorization: token } }
      );
      fetchImages();
    } catch (error) {
      console.error("❌ Failed to unlike image", error);
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
        {isLoading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-muted my-5">{t('no_images_found') || "No images found."}</p>
          ) : (
            <Row className="g-4">
              {images.map((img) => {
                
              
                return (
                  <Col xs={12} md={6} lg={4} key={img._id}>
                    
                  </Col>
                );
              })}
            </Row>
          )}
        {errorMessage && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {errorMessage}
            <button type="button" className="btn-close" onClick={() => setErrorMessage(null)}></button>
          </div>
        )}

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
                      <span style={{ color: "#e53935", fontWeight: "bold" }}>
                        ❤️ {img.likes} {t('likes')}
                      </span>

                      {token && (
                        <>
                          {!hasLiked && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleLike(img._id)}
                            >
                              <FaRegHeart className="me-1" /> {t('like')}
                            </Button>
                          )}
                          {hasLiked && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleUnlike(img._id)}
                            >
                              <FaHeart className="me-1" /> {t('unlike')}
                            </Button>
                          )}
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => fetchLikedUsers(img)}
                          >
                            {t('who_give_like')}
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Image Preview Modal */}
        <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedImage?.title || t('image_preview')}</Modal.Title>
          </Modal.Header>
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

        {/* Likes Modal */}
        <Modal show={showLikesModal} onHide={() => setShowLikesModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('who_give_like')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {likedUsers.length > 0 ? (
              <ListGroup>
                {likedUsers.map((u, index) => (
                  <ListGroup.Item key={u._id || index}>
                    {u.username || u.email || 'Unknown User'}
                  </ListGroup.Item>
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
