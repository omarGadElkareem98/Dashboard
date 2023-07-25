import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import Navbar from '../components/Navbar';

const CreateTechnician = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    email: '',
    phone: '',
    location: '',
    numServicesDone: 0,
    price: 0,
    rating: 0,
    category: '',
    subCategory: '',
    from: '',
    to: '',
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://154.56.60.119:3000//categories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(`http://154.56.60.119:3000//subCategories/${categoryId}`);
      setSubCategories(response.data);
    } catch (error) {
      console.log('Error fetching subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData({
      ...formData,
      category: categoryId,
      subCategory: '',
    });

    if (categoryId === '') {
      setSubCategories([]);
    } else {
      fetchSubCategories(categoryId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData_x = new FormData();
      formData_x.append('image', formData.image);
      formData_x.append('name', formData.name);
      formData_x.append('email', formData.email);
      formData_x.append('phone', formData.phone);
      formData_x.append('location', formData.location);
      formData_x.append('category', formData.category);
      formData_x.append('price', formData.price);
      formData_x.append('subCategory', formData.subCategory);
      formData_x.append('from', formData.from);
      formData_x.append('to', formData.to);

      const response = await axios.post('http://154.56.60.119:3000//technicians', formData_x);
      console.log(response);
      navigate('/technicians'); // Redirect to technicians screen after successful creation
    } catch (error) {
      console.log('Error creating technician:', error);
      setError(error.message);
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
      <>
        <Navbar />

        <div className="container">

          <div style={{ width:'100%', height:'200px', display:`${formData.image ? 'flex' : 'none'}`, justifyContent:'center', alignItems:'center' }}>
              {formData.image && (
                  <img
                      src={URL.createObjectURL(formData.image)}
                      style={{ width:'150px', height:'150px' }}
                      alt="Uploaded"
                      className="mt-2 img-thumbnail square-image"
                  />
              )}
          </div>
          <Form>

            <Row className="mt-4">
              <Col md={6} style={{ height:'300px', display:'flex', justifyContent:'space-between', flexDirection: 'column' }}>
                <Form.Group controlId="name" >
                  <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      required
                  />
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                  />
                </Form.Group>

                <Form.Group controlId="phone">
                  <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                  />
                </Form.Group>

                <Form.Group controlId="location">
                  <Form.Control
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                  />
                </Form.Group>

                <Form.Group controlId="price">
                  <Form.Control
                      type="number"
                      name="price"
                      min="0"
                      placeholder="Price"
                      onChange={handleInputChange}
                      required
                  />
                </Form.Group>
              </Col>

              <Col md={6} style={{ height:'300px', display:'flex', justifyContent:'space-between', flexDirection: 'column' }}>
                <Form.Group controlId="category" className="d-flex justify-content-between align-items-center">
                  <Form.Control
                      as="select"
                      placeholder="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="subCategory">
                  <Form.Control
                      as="select"
                      name="subCategory"
                      value={formData.subCategory}
                      placeholder="Sub Category"
                      onChange={handleInputChange}
                      required
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="from" className="d-flex justify-content-between align-items-center">
                  <Form.Control
                      type="time"
                      name="from"
                      placeholder="Start Time"
                      value={formData.from}
                      onChange={handleInputChange}
                      required
                  />
                </Form.Group>

                <Form.Group controlId="to">
                  <Form.Control
                      type="time"
                      name="to"
                      placeholder="End Time"
                      value={formData.to}
                      onChange={handleInputChange}
                      required
                  />
                </Form.Group>

                <Form.Group>
                  <div className="custom-file">
                    <Form.Control
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4 btn btn-primary" style={{ width:'100%'}}>
              <Button type="submit" variant="primary" style={{ width:'100%' }}>
                Create Technician
              </Button>
            </div>
          </Form>

          <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>An error occurred while creating the technician. Please try again later.</p>
              {error && <p>Error message: {error}</p>}
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

export default CreateTechnician;
