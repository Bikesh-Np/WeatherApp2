import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlusCircle, FiImage, FiDollarSign, FiTag, FiAlignLeft } from 'react-icons/fi';
import './Addproducts.css';
import AxiosInstance from '../../components/AxiosInstance';

const Addproducts = () => {
    const [productCategories, setProductCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        product_price: '',
        category: '',
        image: null,
        product_description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchProductCategories = async () => {
            try {
                const response = await AxiosInstance.get('/api/category/');
                if (Array.isArray(response.data)) {
                    setProductCategories(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchProductCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewProduct(prev => ({ ...prev, image: file }));
        
        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const submitProductForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formPayload = new FormData();
        formPayload.append('product_name', newProduct.product_name);
        formPayload.append('product_price', newProduct.product_price);
        formPayload.append('category', newProduct.category);
        if (newProduct.image) {
            formPayload.append('image', newProduct.image);
        }
        formPayload.append('product_description', newProduct.product_description);

        try {
            await AxiosInstance.post('/api/createproduct/', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Reset form
            setNewProduct({
                product_name: '',
                product_price: '',
                category: '',
                image: null,
                product_description: ''
            });
            setImagePreview(null);
            
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="product-creation-dashboard">
            <div className="creation-header-section">
                <FiPlusCircle className="creation-header-icon" />
                <h2 className="creation-title">Add New Product</h2>
                <p className="creation-subtitle">Fill in the details to add a new product to your inventory</p>
            </div>

            <form onSubmit={submitProductForm} className="product-form-container">
                <div className="form-input-group">
                    <label className="input-label">
                        <FiTag className="input-icon" />
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="product_name"
                        value={newProduct.product_name}
                        onChange={handleInputChange}
                        className="form-input-field"
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <div className="form-input-group">
                    <label className="input-label">
                        <FiDollarSign className="input-icon" />
                        Product Price
                    </label>
                    <input
                        type="number"
                        name="product_price"
                        value={newProduct.product_price}
                        onChange={handleInputChange}
                        className="form-input-field"
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-input-group">
                    <label className="input-label">
                        <FiTag className="input-icon" />
                        Product Category
                    </label>
                    <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="form-select-field"
                        required
                    >
                        <option value="">Select a category</option>
                        {productCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-input-group">
                    <label className="input-label">
                        <FiImage className="input-icon" />
                        Product Image
                    </label>
                    <div className="image-upload-container">
                        <label className="image-upload-wrapper">
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="image-upload-input"
                            />
                            <div className="image-upload-content">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="image-preview"
                                    />
                                ) : (
                                    <>
                                        <FiImage className="upload-placeholder-icon" />
                                        <span>Click to upload image</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                <div className="form-input-group">
                    <label className="input-label">
                        <FiAlignLeft className="input-icon" />
                        Product Description
                    </label>
                    <textarea
                        name="product_description"
                        value={newProduct.product_description}
                        onChange={handleInputChange}
                        className="form-textarea-field"
                        placeholder="Enter detailed product description"
                        rows="4"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-product-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default Addproducts;