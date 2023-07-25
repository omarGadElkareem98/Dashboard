import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Col, Row } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import ImageComponent from '../components/ImageComponent';

const UpdateTechnician = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [technician, setTechnician] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(false);
  const [popular, setPopular] = useState(false);
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTechnician();
    fetchCategories();
  }, []);

  const fetchTechnician = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://154.56.60.119:3000//technicians/${id}`);
      const technicianData = response.data;
      setTechnician(technicianData);
      setName(technicianData.name);
      setEmail(technicianData.email);
      setPhone(technicianData.phone);
      setLocation(technicianData.location);
      setCategoryId(technicianData.category._id);
      setSubCategory(technicianData.subCategory._id);
      setFrom(technicianData.from);
      setTo(technicianData.to);
      setPrice(technicianData.price);
      setAvailable(technicianData.available);
      setPopular(technicianData.popular);
      setImage(technicianData.image);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching technician:', error);
      setIsLoading(false);
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

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(`http://154.56.60.119:3000//subCategories/${categoryId}`);
      setSubCategories(response.data);
    } catch (error) {
      console.log('Error fetching subcategories:', error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setCategoryId(categoryId);
    setSubCategory('');
    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
  };

  const handleUpdateTechnician = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('category', categoryId);
      formData.append('subCategory', subCategory);
      formData.append('from', from);
      formData.append('to', to);
      formData.append('price', price);
      formData.append('available', available);
      formData.append('popular', popular);
      formData.append('image', image);

      let response = await axios.put(`http://154.56.60.119:3000//technicians/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data)
      if(response.status === 200){
        navigate('/technicians');
      }
    } catch (error) {
      console.log('Error updating technician:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
      <>
        <Navbar onLogout={onLogout} />

        <div className="container">

          {isLoading ? (
              <p>Loading technician data...</p>
          ) : (
              <Form onSubmit={handleUpdateTechnician}>
                <div style={{ width:'100%',height:'200', display:'flex', justifyContent:'center', alignItems:'center', marginTop:'20px', marginBottom:'20px' }}>
                  {previewImage === '' ? (
                      <img
                          src={technician.image}
                          alt="Preview"
                          style={{ width: '150px', height:'150px' }}
                      />
                  ) : (
                      <img
                          src={previewImage}
                          alt="Preview"
                          style={{ width: '150px', height:'150px' }}
                      />
                  )}
                </div>
                <Row>
                  <Col md={6} style={{ height:'300px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                    <Form.Group controlId="name">
                      <Form.Control
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="email">
                      <Form.Control
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="phone">
                      <Form.Control
                          type="text"
                          placeholder="Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="location">
                      <Form.Control
                          type="text"
                          placeholder="Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="price">
                      <Form.Control
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                      />
                    </Form.Group>

                  </Col>

                  <Col md={6} style={{ height:'300px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                    <Form.Group controlId="category">
                      <Form.Control
                          as="select"
                          placeholder="Category"
                          value={categoryId}
                          onChange={handleCategoryChange}
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
                          placeholder="Sub Category"
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                      >
                        <option value="">Select Subcategory</option>
                        {subCategories.map((subcategory) => (
                            <option key={subcategory._id} value={subcategory._id}>
                              {subcategory.name}
                            </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="from">
                      <Form.Control
                          type="text"
                          placeholder="Start Time"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="to">
                      <Form.Control
                          type="text"
                          placeholder="End Time"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="image">
                      <Form.Control
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                      />
                    </Form.Group>


                  </Col>
                </Row>

                <Row style={{ display:'flex',marginTop:'20px', justifyContent:'space-between', alignItems:'center' }}>
                  <Col md={6}>
                    <Form.Group controlId="available" style={{ display:'flex', alignItems:'center' }}>
                      <Form.Label className="me-5">Available</Form.Label>
                      <div style={{ display:'flex',alignItems:'center' }}>
                        <Form.Check
                            type="radio"
                            id="available-yes"
                            label="Yes"
                            className="me-4"
                            checked={available}
                            onChange={() => setAvailable(true)}
                        />
                        <Form.Check
                            type="radio"
                            id="available-no"
                            label="No"
                            checked={!available}
                            onChange={() => setAvailable(false)}
                        />
                      </div>

                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="popular" style={{ display:'flex' }}>
                      <Form.Label className="me-5">Popular</Form.Label>
                      <div style={{ display:'flex' }}>
                        <Form.Check
                            type="radio"
                            id="popular-yes"
                            label="Yes"
                            className="me-4"
                            checked={popular}
                            onChange={() => setPopular(true)}
                        />
                        <Form.Check
                            type="radio"
                            id="popular-no"
                            label="No"
                            checked={!popular}
                            onChange={() => setPopular(false)}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/*
                <Form.Group controlId="available">
                      <Form.Label>Available</Form.Label>
                      <Form.Check
                          type="radio"
                          id="available-yes"
                          label="Yes"
                          checked={available}
                          onChange={() => setAvailable(true)}
                      />
                      <Form.Check
                          type="radio"
                          id="available-no"
                          label="No"
                          checked={!available}
                          onChange={() => setAvailable(false)}
                      />
                    </Form.Group>

                    <Form.Group controlId="popular">
                      <Form.Label>Popular</Form.Label>
                      <Form.Check
                          type="radio"
                          id="popular-yes"
                          label="Yes"
                          checked={popular}
                          onChange={() => setPopular(true)}
                      />
                      <Form.Check
                          type="radio"
                          id="popular-no"
                          label="No"
                          checked={!popular}
                          onChange={() => setPopular(false)}
                      />
                    </Form.Group>
                */}

                <div className="mt-4" style={{ width:'100%' }}>
                  <Button type="submit" variant="primary" style={{ width:'100%' }}>
                    Update Technician
                  </Button>
                </div>
              </Form>
          )}
        </div>
      </>
  );
};

export default UpdateTechnician;
