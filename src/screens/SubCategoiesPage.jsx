import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import CustomNavbar from '../components/Navbar';
import {Table, Button, Modal, Alert} from 'react-bootstrap';

const SubCategoriesPage = () => {
    const { id } = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    useEffect(() => {
        fetchSubCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get(`http://154.56.60.119:3000//subCategories/${id}`);
            setSubCategories(response.data);
        } catch (error) {
            console.log('Error fetching subcategories:', error);
        }
    };

    const handleConfirmDelete = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setShowDeleteDialog(true);
    };

    const handleConfirmDeleteAll = () => {
        setShowDeleteAllDialog(true);
    };

    const handleDeleteSubCategory = async () => {
        if (selectedSubCategory) {
            try {
                const response = await axios.delete(`http://154.56.60.119:3000//subCategories/${selectedSubCategory._id}`);
                if (response.status === 200) {
                    console.log('Subcategory deleted successfully');
                    // Perform any additional actions after successful deletion
                    fetchSubCategories(); // Refresh the subcategory list
                } else {
                    console.log('Error deleting subcategory');
                    // Handle error case
                }
            } catch (error) {
                console.log('Error deleting subcategory:', error);
                // Handle error case
            } finally {
                // Reset selectedSubCategory and close the delete dialog
                setSelectedSubCategory(null);
                setShowDeleteDialog(false);
            }
        }
    };

    const handleDeleteAllSubCategories = async () => {
        try {
            const response = await axios.delete(`http://154.56.60.119:3000//subCategories/parentCategory/${id}`);
            if (response.status === 200) {
                console.log('All subcategories deleted successfully');
                // Perform any additional actions after successful deletion
                fetchSubCategories(); // Refresh the subcategory list
            } else {
                console.log('Error deleting all subcategories');
                // Handle error case
            }
        } catch (error) {
            console.log('Error deleting all subcategories:', error);
            // Handle error case
        } finally {
            setShowDeleteAllDialog(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        setSelectedSubCategory(null);
        setShowDeleteDialog(false);
    };

    const handleCloseDeleteAllDialog = () => {
        setShowDeleteAllDialog(false);
    };

    return (
        <>
            <CustomNavbar />
            <div className="container">
                <div className="d-flex justify-content-between mt-4">
                    <div>
                        <Link to={`/subcategories/${id}/create`} className="btn btn-primary">
                            Add SubCategory
                        </Link>
                    </div>
                    <div>
                        <Button variant="danger" onClick={handleConfirmDeleteAll}>
                            Delete All
                        </Button>
                    </div>
                </div>

                {subCategories.length === 0 ? (
                    <Alert variant="secondary">
                        No SubCategories Were Found
                    </Alert>
                ) : (
                    <Table striped bordered hover responsive style={{ textAlign: 'center' }} className="mt-4">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Options</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subCategories.map((subcategory) => (
                            <tr key={subcategory._id}>
                                <td>{subcategory.name}</td>
                                <td>{subcategory.parentCategory.name}</td>
                                <td>{subcategory.price}</td>
                                <td>
                                    <Link to={`/subcategories/${subcategory._id}/update`} className="btn btn-primary me-2">
                                        Update
                                    </Link>
                                    <Button variant="danger" onClick={() => handleConfirmDelete(subcategory)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}

                {/* Delete Confirmation Dialog */}
                <Modal show={showDeleteDialog} onHide={handleCloseDeleteDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Subcategory</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this subcategory?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteDialog}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteSubCategory}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete All Confirmation Dialog */}
                <Modal show={showDeleteAllDialog} onHide={handleCloseDeleteAllDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete All Subcategories</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete all subcategories?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteAllDialog}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteAllSubCategories}>
                            Delete All
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default SubCategoriesPage;
