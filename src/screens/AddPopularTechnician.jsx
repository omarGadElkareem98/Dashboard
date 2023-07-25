import React, { useState } from 'react';
import {Form, Button, Container, Image, Spinner, Col, Row} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/Navbar';

const AddPopularTechnicianPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [link, setLink] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setNameError('');
    setDescriptionError('');
    setPriceError('');

    let isError = false;

    if (!name) {
      setNameError('Name is required');
      isError = true;
    }

    if (!description) {
      setDescriptionError('Description is required');
      isError = true;
    }

    if (!price) {
      setPriceError('Price is required');
      isError = true;
    }

    if (isError) {
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('image', image);
      formData.append('link', link);

      let response = await axios.post('http://154.56.60.119:3000//popularTechnicians', formData);
      if (response.status === 201) {
        navigate('/popularTechnicians');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed To Add A New Product:', error);
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  return (
      <>
        <CustomNavbar />

        <Container>
          {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Adding product...</p>
              </div>
          ) : (
              <Form onSubmit={handleFormSubmit} style={{ marginTop:'100px' }}>
                <div style={{ width:'100%', height:'200px', display:`${imagePreview ? 'flex' : 'none'}`, justifyContent:'center', alignItems:'center' }}>
                  {imagePreview && <Image src={imagePreview} alt="Preview" fluid className="mb-5" />}

                </div>
                <Row className="mt-4">
                  <Col md={6} style={{ height:'100px', display:'flex', justifyContent:'space-between', flexDirection:'column' }}>
                    <Form.Group controlId="formName">
                      <Form.Control
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                      />
                      {nameError && <Form.Text className="text-danger">{nameError}</Form.Text>}
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                      <Form.Control
                          type="text"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                      />
                      {descriptionError && <Form.Text className="text-danger">{descriptionError}</Form.Text>}
                    </Form.Group>
                  </Col>
                  <Col md={6} style={{ height:'100px', display:'flex', justifyContent:'space-between', flexDirection:'column' }}>
                    <Form.Group controlId="formPrice">
                      <Form.Control
                          type="number"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                      />
                      {priceError && <Form.Text className="text-danger">{priceError}</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="formLink">
                      <Form.Control
                          type="text"
                          placeholder="Link"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>


                <Form.Group controlId="formImage" className="mt-4">
                  <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                  />
                </Form.Group>


                <Button variant="primary" type="submit" className="mt-4" style={{ width:'100%' }}>
                  Add Product
                </Button>
              </Form>
          )}
        </Container>
      </>
  );
};

export default AddPopularTechnicianPage;
