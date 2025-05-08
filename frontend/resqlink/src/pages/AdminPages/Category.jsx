import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FiEdit, FiTrash2, FiSave, FiX, FiLayers } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/category");
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/updatecate/${id}/`);
        setCategories(categories.filter((category) => category.id !== id));
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const initiateCategoryEdit = (id, name) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const submitCategoryUpdate = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/updatecate/${id}/`, {
        category_name: editingCategoryName,
      });

      setCategories(categories.map((category) => 
        category.id === id ? { ...category, category_name: editingCategoryName } : category
      ));
      
      setEditingCategoryId(null);
      setEditingCategoryName("");
      toast.success("Category updated successfully!");
    } catch (error) {
      toast.error("Failed to update category!");
    }
  };

  return (
    <div className="category-management-panel">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        theme="colored"
      />
      
      <div className="category-header-section">
        <FiLayers className="category-header-icon" />
        <h2 className="category-management-title">Category Management</h2>
        <p className="category-subtitle">Manage your product categories</p>
      </div>

      {isLoading ? (
        <div className="category-loading-state">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="category-table-container">
          <div className="table-responsive-wrapper">
            <table className="category-data-table">
              <thead className="table-header-section">
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr 
                    key={category.id}
                    className={editingCategoryId === category.id ? "category-editing-row" : ""}
                  >
                    <td className="category-id-cell">{category.id}</td>
                    <td className="category-name-cell">
                      {editingCategoryId === category.id ? (
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="category-edit-input"
                        />
                      ) : (
                        <span className="category-name-text">{category.category_name}</span>
                      )}
                    </td>
                    <td className="category-actions-cell">
                      {editingCategoryId === category.id ? (
                        <div className="edit-mode-actions">
                          <button
                            className="confirm-edit-button"
                            onClick={() => submitCategoryUpdate(category.id)}
                          >
                            <FiSave className="action-icon" /> Save
                          </button>
                          <button
                            className="cancel-edit-button"
                            onClick={() => setEditingCategoryId(null)}
                          >
                            <FiX className="action-icon" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="view-mode-actions">
                          <button
                            className="edit-action-button"
                            onClick={() => initiateCategoryEdit(category.id, category.category_name)}
                          >
                            <FiEdit className="action-icon" /> Edit
                          </button>
                          <button
                            className="delete-action-button"
                            onClick={() => handleCategoryDelete(category.id)}
                          >
                            <FiTrash2 className="action-icon" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;