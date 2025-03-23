import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams } from "react-router-dom";

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Ensure Leaflet CSS is imported
import 'leaflet/dist/leaflet.css';

// Main component that contains everything
const PaymentConfirmation = () => {
  const [isMapInteractive, setIsMapInteractive] = useState(false);  // State to toggle interactivity
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        // Use the specific order ID you provided
        const response = await axios.get(`http://localhost:4000/orders/67df617db4d2b232b4fa3a90`);
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setOrderData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);
  console.log(orderData);

  if (isLoading) return <div className="text-center mt-5">Loading Order Details...</div>;
  if (!orderData) return <div className="text-center text-danger mt-5">Order Not Found</div>;

  const { farmer } = orderData;
  console.log(farmer);

  // Custom CSS
  const styles = {
    logo: {
      color: '#2e7d32',
      fontWeight: 'bold'
    },
    card: {
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: 'none'
    },
    mapContainer: {
      height: '300px',
      overflow: 'hidden',
      borderRadius: '8px'
    },
    mapWrapper: {
      position: 'relative',
      height: '300px',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    stepCircle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    activeStep: {
      backgroundColor: '#2e7d32',
      color: 'white'
    },
    inactiveStep: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32'
    },
    stepConnector: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '2px',
      backgroundColor: '#e0e0e0',
      zIndex: 1,
      transform: 'translateY(-50%)'
    },
    badge: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      marginRight: '0.5rem',
      fontSize: '0.75rem'
    },
    farmerAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#f0f0f0',
      marginRight: '15px'
    },
    productImage: {
      width: '60px',
      height: '60px',
      backgroundColor: '#f0f0f0',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    primaryButton: {
      backgroundColor: '#2e7d32',
      borderColor: '#2e7d32',
      padding: '0.5rem 1.5rem'
    },
    secondaryButton: {
      color: '#2e7d32',
      borderColor: '#2e7d32',
      padding: '0.5rem 1.5rem'
    }
  };

  // Function to activate the map's interactivity
  const handleMapClick = () => {
    setIsMapInteractive(true);
  };

  // Make sure we have location data before rendering
  const farmerLatitude = farmer?.latitude || 0;
  const farmerLongitude = farmer?.longitude || 0;

  return (
    <Container className="py-4">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center py-3 border-bottom mb-4">
        <div className="h4 mb-0" style={styles.logo}>Farm Fresh Connect</div>
        <div>Order #{orderData.orderId}</div>
      </header>

      {/* Confirmation Banner */}
      <Alert variant="success" className="mb-4">
        <h4 className="alert-heading">Thank you for your purchase!</h4>
        <p className="mb-0">Your order has been successfully placed and the farmer has been notified.</p>
      </Alert>

      {/* Farmer Map */}
      <Card className="mb-4" style={styles.card}>
        <div style={styles.mapWrapper} onClick={handleMapClick}>
          <div className="position-absolute top-0 end-0 bg-white m-2 p-2 rounded shadow-sm" style={{ zIndex: 1000 }}>
            <small className="fw-bold">Farm Location</small>
            <div>
              <small>{farmer?.address||"address not available"}</small>
            </div>
          </div>
          {/* Leaflet Map */}
          <MapContainer
            center={[farmerLatitude, farmerLongitude]}
            zoom={13}
            style={styles.mapContainer}
            whenCreated={(map) => {
              // Disable interactivity initially
              if (!isMapInteractive) {
                map.dragging.disable();
                map.touchZoom.disable();
                map.scrollWheelZoom.disable();
                map.boxZoom.disable();
                map.keyboard.disable();
              }
            }}
            zoomControl={false}
            interactive={isMapInteractive}  // Make the map interactive once clicked
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[farmerLatitude, farmerLongitude]}
              icon={new L.Icon({
                iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>{farmer?.name || "Farmer"} - {farmer?.location || "Location unavailable"}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card>

      {/* Order Steps */}
      <div className="mb-4">
        <Row className="g-0 position-relative">
          {orderData.steps && orderData.steps.map((step, index) => (
            <Col key={step.id} className="position-relative">
              {/* Connector line */}
              {index < orderData.steps.length - 1 && (
                <div style={styles.stepConnector}></div>
              )}

              {/* Step circle */}
              <div className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 2 }}>
                <div style={{
                  ...styles.stepCircle,
                  ...(step.isActive ? styles.activeStep : styles.inactiveStep)
                }} className="mb-2">
                  {step.id}
                </div>
                <div className="text-center">
                  <div className="fw-bold small">{step.title}</div>
                  <div className="text-muted smaller">{step.date}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Order Details */}
      <Row className="g-4 mb-4">
        {/* Order Summary */}
        <Col lg={6}>
          <Card className="h-100" style={styles.card}>
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 text-success">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {orderData.products && orderData.products.map(product => (
                  <ListGroup.Item key={product.id} className="px-0 py-3 border-bottom">
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <div style={styles.productImage}>
                          <img
                            src={`/${product.imageUrl}`}
                            alt={product.name}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="fw-bold">{product.name}</div>
                        <div className="d-flex justify-content-between text-muted small">
                          <span>{product.quantity}</span>
                          <span>₹{parseFloat(product.price).toFixed(2)}</span>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-3">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">₹{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-bold">₹{orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Tax</span>
                  <span className="fw-bold">₹{orderData.tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-3 mt-2">
                  <span className="h5 mb-0">Total</span>
                  <span className="h5 mb-0 text-success">₹{orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Farmer & Payment Info */}
        <Col lg={6}>
          <Card className="h-100" style={styles.card}>
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 text-success">Farmer & Payment Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div style={styles.farmerAvatar}></div>
                <div>
                  <div className="fw-bold">{orderData.farmer.name}</div>
                  <div className="small text-muted">{orderData.farmer.owner}</div>
                  <div className="mt-1">
                    {farmer?.badges && farmer.badges.map((badge, index) => (
                      <span key={index} style={styles.badge}>{badge}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Row className="border-bottom py-2">
                  <Col xs={6} className="text-muted">Farm Distance</Col>
                  <Col xs={6} className="text-end fw-bold">{farmer?.distance}</Col>
                </Row>
                <Row className="border-bottom py-2">
                  <Col xs={6} className="text-muted">Farm Location</Col>
                  <Col xs={6} className="text-end fw-bold">{farmer?.address}</Col>
                </Row>
              </div>

              <h5 className="text-success mt-4 mb-3">Payment Method</h5>
              <Row className="border-bottom py-2">
                <Col xs={6} className="text-muted">Method</Col>
                <Col xs={6} className="text-end fw-bold">{orderData.payment.method}</Col>
              </Row>
              <Row className="border-bottom py-2">
                <Col xs={6} className="text-muted">Card</Col>
                <Col xs={6} className="text-end fw-bold">{orderData.payment.cardNumber}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-success" style={styles.secondaryButton}>Continue Shopping</Button>
        <Button variant="success" style={styles.primaryButton}>Contact Farmer</Button>
      </div>
    </Container>
  );
};

export default PaymentConfirmation;