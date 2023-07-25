import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Row, Col, FormControl, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import './Users.css';
import ImageComponent from '../components/ImageComponent';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://154.56.60.119:3000//users', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://154.56.60.119:3000//users/${id}`);
      fetchUsers(); // Refresh the users list after deletion
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingUserId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    deleteUser(deletingUserId);
    setShowConfirmModal(false);
  };

  const handleDeleteAll = async () => {
    try {
      let response = await axios.delete('http://154.56.60.119:3000//users');
      alert(response.data);
      if (response.status === 200) {
        fetchUsers();
      }
      // Refresh the users list after deletion
    } catch (error) {
      console.log('Error deleting all users:', error);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // Filtered and paginated users based on search query
  const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
      <>
        <Navbar />

        <div className="container">
          <Row className="mt-4">
            <Col md={10}>
              <FormControl
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
              />
            </Col>
            <Col className="text-end" md={2}>
              <Button variant="danger" onClick={handleDeleteAll}>
                Delete All
              </Button>
            </Col>
          </Row>

          {currentUsers.length === 0 ? (
              <Alert variant="info" className="text-center mt-4">
                No search results found.
              </Alert>
          ) : (
              <>
                <Table striped bordered hover responsive className="mt-4" style={{ textAlign: 'center' }}>
                  <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <ImageComponent image={user.image} />
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button variant="danger" onClick={() => handleDeleteClick(user._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
                <Pagination usersPerPage={usersPerPage} totalUsers={filteredUsers.length} paginate={paginate} />
              </>
          )}

          <Modal show={showConfirmModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
            <Modal.Header closeButton>
              <Modal.Title>Login Failed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Invalid email or password. Please try again.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseErrorModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
  );
};

const Pagination = ({ usersPerPage, totalUsers, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
      <nav>
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number) => (
              <li key={number} className="page-item">
                <a onClick={() => paginate(number)} className="page-link">
                  {number}
                </a>
              </li>
          ))}
        </ul>
      </nav>
  );
};

export default Users;
