import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '..//components/Navbar'

const TermsPage = () => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        fetchDescription();
    }, []);

    const fetchDescription = async () => {
        try {
            const response = await axios.get('http://154.56.60.119:3000//informations/terms');
            setDescription(response.data);
        } catch (error) {
            console.error('Error fetching description:', error);
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleEditDescription = async () => {
        try {
            await axios.post('http://154.56.60.119:3000//informations/terms', {
                terms: description
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });

            console.log('Description updated:', description);
        } catch (error) {
            setError('Error updating description.');
            setShowErrorModal(true);
        }
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <>
            <CustomNavbar />

            <Container>
                <Form.Group>
                    <Form.Label>Terms And Conditions:</Form.Label>
                    <Form.Control as="textarea" rows={20} dir="rtl" value={description} onChange={handleDescriptionChange} />
                </Form.Group>
                <Button variant="primary" className="mt-3" onClick={handleEditDescription}>Edit</Button>

                <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{error}</Modal.Body>
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

export default TermsPage;
