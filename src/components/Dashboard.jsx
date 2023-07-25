import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import Navbar from './Navbar';

const Dashboard = ({ onLogout }) => {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfTechnicians, setNumberOfTechnicians] = useState(0);
  const [totalPendingReservations, setTotalPendingReservations] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalDoneReservations, setTotalDoneReservations] = useState(0);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const responseUsers = await fetch('http://154.56.60.119:3000//statistics/users');
      const dataUsers = await responseUsers.json();
      setNumberOfUsers(dataUsers.numberOfUsers);

      const responseTechnicians = await fetch('http://154.56.60.119:3000//statistics/technicians');
      const dataTechnicians = await responseTechnicians.json();
      setNumberOfTechnicians(dataTechnicians.numberOfTechnicians);

      const responsePendingReservations = await fetch('http://154.56.60.119:3000//statistics/pending-reservations');
      const dataPendingReservations = await responsePendingReservations.json();
      setTotalPendingReservations(dataPendingReservations.totalPendingReservations);

      const responseTotalReservations = await fetch('http://154.56.60.119:3000//statistics/reservations');
      const dataTotalReservations = await responseTotalReservations.json();
      setTotalReservations(dataTotalReservations.totalReservations);

      const responseDoneReservations = await fetch('http://154.56.60.119:3000//statistics/done-reservations');
      const dataDoneReservations = await responseDoneReservations.json();
      setTotalDoneReservations(dataDoneReservations.totalDoneReservations);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div>
      <Navbar onLogout={onLogout} />
      <h1 className="m-4">Welcome: {JSON.parse(localStorage.getItem('user')).username}</h1>

      <div className="container mt-4">
        <Row className="g-4">
          <Col lg={4} md={6}>
            <Card bg="primary" text="white" className="h-100">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="fw-bold fs-4">Total Users</Card.Title>
                <Card.Text className="fs-2">{numberOfUsers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card bg="success" text="white" className="h-100">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="fw-bold fs-4">Total Orders</Card.Title>
                <Card.Text className="fs-2">{totalReservations}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card bg="warning" text="white" className="h-100">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="fw-bold fs-4">Revenue</Card.Title>
                <Card.Text className="fs-2">$10,000</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card bg="info" text="white" className="h-100">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="fw-bold fs-4">Active Technicians</Card.Title>
                <Card.Text className="fs-2">{numberOfTechnicians}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card bg="danger" text="white" className="h-100">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="fw-bold fs-4">Completed Orders</Card.Title>
                <Card.Text className="fs-2">{totalDoneReservations}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6}>
            <Card bg="secondary" text="white" className="h-100">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="fw-bold fs-4">Average Rating</Card.Title>
                <Card.Text className="fs-2">4.5</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} md={6}>
            <Card>
              <Card.Body>
                <Card.Title className="fw-bold fs-4">Monthly Revenue Progress</Card.Title>
                <ProgressBar variant="success" now={70} label={`${70}%`} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} md={6}>
            <Card>
              <Card.Body>
                <Card.Title className="fw-bold fs-4">New Users This Month</Card.Title>
                <ProgressBar variant="primary" now={50} label={`${50}%`} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
