import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Spinner, Alert, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';

const ReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletingReservationId, setDeletingReservationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  useEffect(() => {
    fetchReservations();
    fetchCategories();
    fetchTechnicians();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://154.56.60.119:3000//reservations');
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching reservations:', error);
      setLoading(false);
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
      await axios.delete(`http://154.56.60.119:3000//reservations/${id}`);
      fetchReservations(); // Refresh the reservations list after deletion
    } catch (error) {
      console.log('Error deleting reservation:', error);
    }
  };

  const completeReservation = async (id) => {
    try {
      const reservation = reservations.find((item) => item._id === id);

      let response = await axios.post(
          'http://154.56.60.119:3000//completedReservations',
          {
            completeTime: Date.now().toString(),
            user: reservation.userId.name,
            technician: reservation.technicianId.name,
            category: reservation.technicianId.category.name,
            price: reservation.technicianId.price,
            id: id,
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          }
      );
      if (response.status === 200) {
        fetchReservations();
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      if(error.response.status == 400){
        alert(error.response.data)
      }
      console.log('Error completing reservation:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingReservationId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    deleteReservation(deletingReservationId);
    setShowConfirmModal(false);
  };

  const handleCompleteClick = (id) => {
    completeReservation(id);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleDeleteAll = async () => {
    try {
      let response = await axios.delete('http://154.56.60.119:3000//reservations/');
      alert(response.data);
      if (response.status === 200) {
        fetchReservations();
      }
    } catch (error) {
      console.log('Error deleting all reservations:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset current page to 1 when search query changes
  };

  const handleTechnicianSelect = (technician) => {
    setSelectedTechnician(technician);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const filterReservations = (reservation) => {
    const isTechnicianMatch = selectedTechnician
        ? reservation.technicianId?.name === selectedTechnician
        : true;
    const isCategoryMatch = selectedCategory
        ? reservation.technicianId?.category?.name === selectedCategory
        : true;
    const isStatusMatch = selectedStatus
        ? reservation.status === selectedStatus
        : true;
    const isSearchMatch =
        reservation.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.technicianId?.name.toLowerCase().includes(searchQuery.toLowerCase());

    return isTechnicianMatch && isCategoryMatch && isStatusMatch && isSearchMatch;
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const filteredReservations = reservations.filter(filterReservations);
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
      <>
        <CustomNavbar />

        <div className="container mt-4">
          <div className=" mb-3">
            <div className="d-flex">
              <FormControl
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="me-2 "
              />

              <DropdownButton id="technician-dropdown" className="me-2" title={selectedTechnician === "" ? "Technician" : selectedTechnician}>
                <Dropdown.Item onClick={() => handleTechnicianSelect('')} active={!selectedTechnician}>
                  All Technicians
                </Dropdown.Item>
                {technicians.map((technician) => (
                    <Dropdown.Item
                        key={technician._id}
                        onClick={() => handleTechnicianSelect(technician.name)}
                        active={technician.name === selectedTechnician}
                    >
                      {technician.name}
                    </Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton id="category-dropdown" className="me-2" title={selectedCategory === "" ? "Category" : selectedCategory}>
                <Dropdown.Item onClick={() => handleCategorySelect('')} active={!selectedCategory}>
                  All Categories
                </Dropdown.Item>
                {categories.map((category) => (
                    <Dropdown.Item
                        key={category._id}
                        onClick={() => handleCategorySelect(category.name)}
                        active={category.name === selectedCategory}
                    >
                      {category.name}
                    </Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton id="status-dropdown" title={selectedStatus === "" ? "Status" : selectedStatus}>
                <Dropdown.Item onClick={() => handleStatusSelect('')} active={!selectedStatus}>
                  All Statuses
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusSelect('pending')} active={selectedStatus === 'pending'}>
                  Pending
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => handleStatusSelect('completed')}
                    active={selectedStatus === 'completed'}
                >
                  Completed
                </Dropdown.Item>
              </DropdownButton>
            </div>

            <div className="mt-2 d-flex justify-content-end">
              <Button variant="danger" onClick={handleDeleteAll}>
                Delete All
              </Button>
            </div>
          </div>

          {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status" />
              </div>
          ) : (
              <>
                {filteredReservations.length > reservationsPerPage && (
                    <Pagination
                        reservationsPerPage={reservationsPerPage}
                        totalReservations={filteredReservations.length}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                )}

                {filteredReservations.length === 0 ? (
                    <Alert variant="info">No reservations found.</Alert>
                ) : (
                    <>
                      {currentReservations.map((reservation) => (
                          <Card key={reservation._id} className="mb-3">
                            <Card.Body>
                              <Card.Title>Reservation ID: {reservation._id}</Card.Title>
                              <Card.Text>
                                <strong>User:</strong> {reservation.userId?.name ?? 'Deleted User'}
                                <br />
                                <strong>Technician:</strong> {reservation.technicianId?.name ?? 'Not Found'}
                                <br />
                                <strong>Category:</strong> {reservation.technicianId?.category?.name ?? 'Unknown'}
                                <br />
                                <strong>Date:</strong> {reservation.date}
                                <br />
                                <strong>Time:</strong> {reservation.time}
                                <br />
                                <strong>Status:</strong> {reservation.status}
                              </Card.Text>
                              <Button
                                  className="me-2"
                                  variant="danger"
                                  onClick={() => handleDeleteClick(reservation._id)}
                              >
                                Delete
                              </Button>
                              <Button variant="success" onClick={() => handleCompleteClick(reservation._id)}>
                                Complete
                              </Button>
                            </Card.Body>
                          </Card>
                      ))}
                    </>
                )}

              </>
          )}
        </div>

        <Modal show={showConfirmModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this reservation?</Modal.Body>
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
            <Modal.Title>Confirmation Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Couldn't Confirm User Reservation. Please Try Again Later.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseErrorModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
  );
};

const Pagination = ({ reservationsPerPage, totalReservations, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalReservations / reservationsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
      <nav>
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number) => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button onClick={() => paginate(number)} className="page-link">
                  {number}
                </button>
              </li>
          ))}
        </ul>
      </nav>
  );
};

export default ReservationPage;
