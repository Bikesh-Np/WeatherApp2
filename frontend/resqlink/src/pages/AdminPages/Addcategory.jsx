import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { FiPlusCircle, FiTag } from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';
import "./Addcategory.css";

const Addcategory = () => {
  const [categoryData, setCategoryData] = useState({
    category_name: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitCategoryForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formPayload = new FormData();
    formPayload.append("category_name", categoryData.category_name);

    try {
      await axios.post(
        "/api/createcategory/",
        formPayload
      );
      
      toast.success("Category created successfully!");
      setCategoryData({ category_name: "" });
    } catch (error) {
      toast.error("Failed to create category: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="category-creation-dashboard">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        theme="colored"
      />
      
      <div className="creation-header-section">
        <FiPlusCircle className="creation-header-icon" />
        <h2 className="creation-title">Create New Category</h2>
        <p className="creation-subtitle">Add a new product category to your inventory</p>
      </div>

      <form onSubmit={submitCategoryForm} className="category-form-container">
        <div className="form-input-group">
          <label className="input-label">
            <FiTag className="input-icon" />
            Category Name
          </label>
          <input
            type="text"
            name="category_name"
            id="category_name"
            placeholder="e.g. Electronics, Clothing, Food"
            onChange={handleInputChange}
            value={categoryData.category_name}
            className="form-input-field"
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-category-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};

export default Addcategory;