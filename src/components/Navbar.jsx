import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const CustomNavbar = ({ onLogout }) => {
  const navigate = useNavigate()
  const onLogoutHandler = () =>{
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <Navbar bg="light" expand="lg" className='p-3'>
      <Navbar.Brand as={Link} to="/">Zainlak</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/users">Users</Nav.Link>
          <Nav.Link as={Link} to="/technicians">Technicians</Nav.Link>
          <Nav.Link as={Link} to="/reservations">Reservations</Nav.Link>
          <Nav.Link as={Link} to="/completedReservations">Completed-Reservations</Nav.Link>
          <Nav.Link as={Link} to="/popularTechnicians">Products</Nav.Link>
          <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
          <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          <Nav.Link as={Link} to="/terms">Terms</Nav.Link>
        </Nav>
        <Button variant="link" style={{ color:'red',fontWeight:'500',textDecoration:'none' }} onClick={onLogoutHandler}>Logout</Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;