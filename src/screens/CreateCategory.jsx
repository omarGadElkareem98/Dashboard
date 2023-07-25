import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/Navbar';

const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [image, setImage] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNameArChange = (e) => {
    setNameAr(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('nameAr', nameAr);
    formData.append('image', image);

    try {
      const response = await fetch('http://154.56.60.119:3000//categories', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Category created successfully, handle the response as needed
        console.log('Category created successfully');
        navigate('/categories');
      } else {
        // Error creating category
        console.log('Error creating category');
      }
    } catch (error) {
      console.log('Error creating category:', error);
    }
  };

  return (
      <>
        <CustomNavbar />

        <Container className='mt-4'>
          <Form onSubmit={handleSubmit}>
            <div style={{ width:'100%', height:'200px',marginBottom:'40px', display:`${image ? 'flex' : 'none'}`, justifyContent:'center', alignItems:'center' }}>
              { image && <img src={URL.createObjectURL(image)} alt="Category Image"/>}
            </div>
            <Form.Group controlId='name'>
              <Form.Control
                  type='text'
                  name='name'
                  placeholder='Enter category name'
                  value={name}
                  onChange={handleNameChange}
              />
            </Form.Group>
            <Form.Group controlId='nameAr'>
              <Form.Control
                  type='text'
                  name='nameAr'
                  className="mt-4"
                  placeholder='Enter category name (Arabic)'
                  value={nameAr}
                  onChange={handleNameArChange}
              />
            </Form.Group>
            <Form.Group controlId='image'>
              <Form.Control
                  type='file'
                  name='image'
                  className="mt-4"
                  onChange={handleImageChange}
                  accept='image/*'
              />
            </Form.Group>
            <div className='d-flex justify-content-end mt-4'>
              <Button variant='primary' type='submit' style={{ width:'100%', fontWeight:'500' }}>
                Create
              </Button>
            </div>
          </Form>
        </Container>
      </>
  );
};

export default CreateCategoryPage;
