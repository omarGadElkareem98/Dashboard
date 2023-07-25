import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/Navbar';
import ImageComponent from '../components/ImageComponent';

const PopularTechniciansPage = () => {
    const [popularTechnicians, setPopularTechnicians] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);
    const [technicianToDelete, setTechnicianToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPopularTechnicians();
    }, []);

    const fetchPopularTechnicians = async () => {
        try {
            const response = await axios.get('http://154.56.60.119:3000//popularTechnicians');
            setPopularTechnicians(response.data);
        } catch (error) {
            console.error('Failed to fetch popular technicians:', error);
        }
    };

    const handleAddPopularTechnician = () => {
        navigate('/popularTechnicians/create');
    };

    const handleDeleteTechnician = async (technicianId) => {
        try {
            let response = await axios.delete(`http://154.56.60.119:3000//popularTechnicians/${technicianId}`);
            setShowErrorModal(true)
            if (response.status === 200) {
                fetchPopularTechnicians();
            }
        } catch (error) {
            console.error('Error deleting technician:', error);
        }
    };

    const handleDeleteAllTechnicians = async () => {
        try {
            let response = await axios.delete('http://154.56.60.119:3000//popularTechnicians');
            alert(response.data);
            if (response.status === 200) {
                fetchPopularTechnicians();
            }
        } catch (error) {
            console.error('Error deleting all technicians:', error);
        }
    };

    const handleUpdateTechnician = (technicianId) => {
        navigate(`/popularTechnicians/update/${technicianId}`);
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setTechnicianToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (technicianToDelete) {
            handleDeleteTechnician(technicianToDelete);
        }
        handleCloseDeleteConfirmation();
    };

    const handleShowDeleteConfirmation = (technicianId) => {
        setTechnicianToDelete(technicianId);
        setShowDeleteConfirmation(true);
    };

    const handleCloseDeleteAllConfirmation = () => {
        setShowDeleteAllConfirmation(false);
    };


    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleConfirmDeleteAll = () => {
        handleDeleteAllTechnicians();
        handleCloseDeleteAllConfirmation();
    };

    const handleShowDeleteAllConfirmation = () => {
        setShowDeleteAllConfirmation(true);
    };

    return (
        <>
            <CustomNavbar />

            <Container>
                <div className="d-flex justify-content-end mt-5">
                    <div className="me-3">
                        <Button className="mb-3" variant="primary" onClick={handleAddPopularTechnician}>
                            Add Products
                        </Button>
                    </div>

                    <div className="">
                        <Button className="mb-3" variant="danger" onClick={handleShowDeleteAllConfirmation}>
                            Delete All
                        </Button>
                    </div>
                </div>

                <Table striped bordered hover className="m-4 text-center">
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {popularTechnicians.length == 0 ? <tr>
                        <td colSpan="5">No Products Yet</td>
                    </tr> : popularTechnicians.map((technician) => (
                        <tr key={technician._id}>
                            <td>
                                <ImageComponent image={technician.image} />
                            </td>
                            <td>{technician.name}</td>
                            <td>{technician.description}</td>
                            <td>{technician.price}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleShowDeleteConfirmation(technician._id)}>
                                    Delete
                                </Button>
                                <Button
                                    className="ms-2"
                                    variant="info"
                                    onClick={() => handleUpdateTechnician(technician._id)}
                                >
                                    Update
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Product?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete All Confirmation Modal */}
                <Modal show={showDeleteAllConfirmation} onHide={handleCloseDeleteAllConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete all Products?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteAllConfirmation}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDeleteAll}>
                            Delete All
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Product Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Product Was Successfully Deleted</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseErrorModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default PopularTechniciansPage;
