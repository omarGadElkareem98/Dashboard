import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';

const UpdateSubCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchSubCategory();
        fetchCategories();
    }, []);

    const fetchSubCategory = async () => {
        try {
            const response = await axios.get(`http://154.56.60.119:3000//subCategories/self/${id}`);
            const subCategoryData = response.data;
            setName(subCategoryData.name);
            setCategory(subCategoryData.parentCategory._id);
            setPrice(subCategoryData.price);
        } catch (error) {
            console.log('Error fetching subcategory:', error);
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

    const handleUpdateSubCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://154.56.60.119:3000//subCategories/${id}`, {
                name,
                nameAr,
                parentCategory: category,
                price,
            });
            console.log('Subcategory updated successfully');
            // Perform any additional actions after successful update
            navigate(`/subcategories/${category}`);
        } catch (error) {
            console.log('Error updating subcategory:', error);
            // Handle error case
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="container mt-5">
                <form onSubmit={handleUpdateSubCategory}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter New SubCategory Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label>Arabic Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter New SubCategory Name (Arabic)"
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label>Category</label>
                        <select
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mt-4">
                        <label>Price</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Price"
                            min={0}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="w-100 mt-4">
                        <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>
                            Update Subcategory
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateSubCategoryPage;
