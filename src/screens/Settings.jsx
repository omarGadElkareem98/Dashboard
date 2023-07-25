import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [adminCredentials, setAdminCredentials] = useState({
    username: JSON.parse(localStorage.getItem('user')).username,
    password: '',
    email:JSON.parse(localStorage.getItem('user')).email
  });
  const [siteName, setSiteName] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedTitle = localStorage.getItem('websiteTitle') ?? 'Zainlak';
    if (storedTitle) {
      setSiteName(storedTitle);
    }
  }, []);

  const handleCredentialsChange = (e) => {
    setAdminCredentials({
      ...adminCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSiteNameChange = (e) => {
    setSiteName(e.target.value);
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
    setLogoUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleAdminCredentialsSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.put('http://154.56.60.119:3000/0/managers/credentials', adminCredentials);
      const { username, email } = response.data
      localStorage.setItem('user',JSON.stringify({
        username,
        email
      }))
      setSuccessMessage('Admin credentials updated successfully.');
    } catch (error) {
      console.log(error.message);
      setErrorMessage('Error updating admin credentials.');
    }
  };

  const handleSiteNameSubmit = async (e) => {
    e.preventDefault();

    try {
      localStorage.setItem('websiteTitle', siteName);
      setSuccessMessage('Site name updated successfully.');
    } catch (error) {
      setErrorMessage('Error updating site name.');
    }
  };

  const handleLogoSubmit = (e) => {
    e.preventDefault();
  
    if (logo) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const imageBase64 = reader.result;
        // Store the base64 string in localStorage
        localStorage.setItem('logoBase64', imageBase64);
        setSuccessMessage('Logo updated successfully.');
      };
  
      reader.onerror = () => {
        setErrorMessage('Error updating logo.');
      };
  
      reader.readAsDataURL(logo);
    }
  };

  const getBase64FromImageUrl = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageUrl;
    });
  };

  return (
    <>
      <Navbar />

      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="settings-container">
              <h1 className="mb-4">Settings</h1>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              <Form onSubmit={handleAdminCredentialsSubmit} className="mb-4">
                <h2>Admin Credentials</h2>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder='write username here'
                    value={adminCredentials.username}
                    onChange={handleCredentialsChange}
                  />
                </Form.Group>
                
                <Form.Group controlId="formUsername">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder='write email here'
                    value={adminCredentials.email}
                    onChange={handleCredentialsChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder='write password here'
                    value={adminCredentials.password}
                    onChange={handleCredentialsChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="save-button">
                  Save Admin Credentials
                </Button>
              </Form>

              <Form onSubmit={handleSiteNameSubmit} className="mb-4">
                <h2>Site Settings</h2>
                <Form.Group controlId="formSiteName">
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control type="text" value={siteName} onChange={handleSiteNameChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="save-button">
                  Save Site Name
                </Button>
              </Form>

              <Form onSubmit={handleLogoSubmit} className="mb-4">
                <h2>Logo</h2>
                <Form.Group controlId="formLogo">
                  <Form.Control type="file" onChange={handleLogoChange} />
                  {logoUrl && <img src={logoUrl} alt="Logo" className="logo-preview" />}
                </Form.Group>

                <Button variant="primary" type="submit" className="save-button">
                  Save Logo
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .settings-container {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin-top: 40px;
        }

        .save-button {
          margin-top: 20px;
          align-self: flex-end;
        }

        .logo-preview {
          margin-top: 20px;
          max-width: 200px;
        }
      `}</style>
    </>
  );
};

export default Settings;
