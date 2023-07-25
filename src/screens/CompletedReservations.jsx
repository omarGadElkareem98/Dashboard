import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Modal, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';

const CompletedReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingReservationId, setDeletingReservationId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    fetchReservations();
    fetchCategories();
    fetchTechnicians();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://154.56.60.119:3000//completedReservations');
      setReservations(response.data);
    } catch (error) {
      console.log('Error fetching completed reservations:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://154.56.60.119:3000//categories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get('http://154.56.60.119:3000//technicians');
      setTechnicians(response.data);
    } catch (error) {
      console.log('Error fetching technicians:', error);
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`http://154.56.60.119:3000//completedReservations/${id}`);
      fetchReservations(); // Refresh the completed reservations list after deletion
    } catch (error) {
      console.log('Error deleting completed reservation:', error);
    }
  };

  const deleteAllReservations = async () => {
    try {
      const response = await axios.delete('http://154.56.60.119:3000//completedReservations');
      if (response.status === 200) {
        fetchReservations(); // Refresh the completed reservations list after deletion
        setShowDeleteModal(false); // Close the delete confirmation modal
      }
    } catch (error) {
      console.log('Error deleting all completed reservations:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingReservationId(id);
  };

  const handleConfirmDelete = () => {
    deleteReservation(deletingReservationId);
    setDeletingReservationId('');
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteAll = () => {
    setShowDeleteModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleTechnicianFilter = (technician) => {
    setSelectedTechnician(technician);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchCategory = selectedCategory ? reservation.category.toLowerCase() === selectedCategory.toLowerCase() : true;
    const matchTechnician = selectedTechnician ? reservation.technician.toLowerCase() === selectedTechnician.toLowerCase() : true;
    const matchSearchQuery = reservation.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchTechnician && matchSearchQuery;
  });

  return (
      <>
        <CustomNavbar />

        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <FormControl
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="me-2 search-input"
            />

            <DropdownButton title={selectedCategory || 'Category'} variant="secondary" className="me-2">
              <Dropdown.Item onClick={() => handleCategoryFilter('')}>All Categories</Dropdown.Item>
              {categories.map((category) => (
                  <Dropdown.Item key={category._id} onClick={() => handleCategoryFilter(category.name)}>
                    {category.name}
                  </Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton title={selectedTechnician || 'Technician'} className="me-2" variant="secondary">
              <Dropdown.Item onClick={() => handleTechnicianFilter('')}>All Technicians</Dropdown.Item>
              {technicians.map((technician) => (
                  <Dropdown.Item key={technician._id} onClick={() => handleTechnicianFilter(technician.name)}>
                    {technician.name}
                  </Dropdown.Item>
              ))}
            </DropdownButton>

            <div style={{ width:'200px' }} className="d-flex justify-content-end">
              <Button variant="danger" onClick={handleDeleteAll}>
                Delete All
              </Button>
            </div>
          </div>

          {filteredReservations.length === 0 ? (
              <p className="text-center">No completed reservations found.</p>
          ) : (
              <Table striped bordered hover style={{ textAlign: 'center' }}>
                <thead>
                <tr>
                  <th>Complete Time</th>
                  <th>User</th>
                  <th>Technician</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Options</th>
                </tr>
                </thead>
                <tbody>
                {filteredReservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>{new Date(+reservation.completeTime).toLocaleString()}</td>
                      <td>{reservation.user}</td>
                      <td>{reservation.technician}</td>
                      <td>{reservation.category}</td>
                      <td>{reservation.price}</td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteClick(reservation._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </Table>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete all completed reservations?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteAllReservations}>
              Delete All
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Individual Delete Confirmation Modal */}
        <Modal show={Boolean(deletingReservationId)} onHide={() => setDeletingReservationId('')}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this completed reservation?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeletingReservationId('')}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
};

export default CompletedReservationsPage;
