import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Modal, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ImageComponent from '../components/ImageComponent';
import axios from 'axios';
import * as MyNavbar from '../components/Navbar';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch categories from API and update the state
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://154.56.60.119:3000//categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        const response = await axios.delete(`http://154.56.60.119:3000//categories/${selectedCategory._id}`);
        if (response.status === 200) {
          console.log('Category deleted successfully');
          // Perform any additional actions after successful deletion
          fetchCategories(); // Refresh the category list
        } else {
          console.log('Error deleting category');
          // Handle error case
        }
      } catch (error) {
        console.log('Error deleting category:', error);
        // Handle error case
      } finally {
        // Reset selectedCategory and close the delete dialog
        setSelectedCategory(null);
        setShowDeleteDialog(false);
      }
    }
  };

  const handleConfirmDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedCategory(null);
    setShowDeleteDialog(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleDeleteAllCategories = async () => {
    try {
      const response = await axios.delete('http://154.56.60.119:3000//categories');
      if (response.status === 200) {
        console.log('All categories deleted successfully');
        // Perform any additional actions after successful deletion
        fetchCategories(); // Refresh the category list
        setShowErrorModal(true); // Show success modal
      } else {
        console.log('Error deleting all categories');
        // Handle error case
      }
    } catch (error) {
      console.log('Error deleting all categories:', error);
      // Handle error case
    } finally {
      setShowDeleteAllDialog(false);
    }
  };

  const handleCloseDeleteAllDialog = () => {
    setShowDeleteAllDialog(false);
  };

  const handleShowSubcategories = (categoryId) => {
    navigate(`/subcategories/${categoryId}`);
  };

  return (
      <>
        <MyNavbar.default />

        <Container>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <Link to="/categories/create">
                <Button variant="primary">Create Category</Button>
              </Link>
            </div>
            <div>
              <Button variant="danger" onClick={() => setShowDeleteAllDialog(true)}>
                Delete All
              </Button>
            </div>
          </div>
          <Row className="mt-4">
            {categories.length === 0 ? (
                <Col>
                  <p>No categories available.</p>
                </Col>
            ) : (
                categories.map((category) => (
                    <Col key={category._id} md={4} className="mb-4">
                      <Card className="h-100">
                        <div className="fluid">
                          <Image src={category.image} width="100%" height="400px"/>
                        </div>
                        <Card.Body>
                          <Card.Title className="text-center">{category.name}</Card.Title>
                          <div className="category-actions">
                            <Button variant="primary" className="me-2" onClick={() => handleShowSubcategories(category._id)}>
                              Show Subcategories
                            </Button>
                            <Button variant="danger" onClick={() => handleConfirmDelete(category)}>
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                ))
            )}
          </Row>

          {/* Delete Confirmation Dialog */}
          <Modal show={showDeleteDialog} onHide={handleCloseDeleteDialog}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteDialog}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteCategory}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Delete All Confirmation Dialog */}
          <Modal show={showDeleteAllDialog} onHide={handleCloseDeleteAllDialog}>
            <Modal.Header closeButton>
              <Modal.Title>Delete All Categories</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete all categories?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteAllDialog}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAllCategories}>
                Delete All
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Success Modal */}
          <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
            <Modal.Header closeButton>
              <Modal.Title>Categories Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>All Categories Were Successfully Deleted</p>
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

export default CategoriesPage;
