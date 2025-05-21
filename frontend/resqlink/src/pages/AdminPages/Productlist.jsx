import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash2, FiSave, FiX, FiImage, FiPackage } from "react-icons/fi";
import "./productlist.css";

const Productlist = () => {
  const [productData, setProductData] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    product_name: "",
    product_price: "",
    image: null,
    product_description: "",
    category_name: "",
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProductData(response.data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProductData();
  }, []);

  const handleProductDelete = async (id) => {
    const confirmDelete = window.confirm("Confirm product deletion?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/updatepro/${id}/`);
        setProductData(productData.filter((item) => item.id !== id));
        toast.success("Product removed successfully");
      } catch (error) {
        toast.error("Deletion failed");
      }
    }
  };

  const initiateProductEdit = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      product_name: product.product_name,
      product_price: product.product_price,
      image: null,
      product_description: product.product_description,
      category_name: product.category_name,
    });
  };

  const submitProductUpdate = async (id) => {
    try {
      const formPayload = new FormData();
      formPayload.append("product_name", productForm.product_name);
      formPayload.append("product_price", productForm.product_price);
      formPayload.append("product_description", productForm.product_description);
      formPayload.append("category_name", productForm.category_name);
      if (productForm.image) {
        formPayload.append("image", productForm.image);
      }

      await axios.put(`http://127.0.0.1:8000/updatepro/${id}/`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated!");
      window.location.reload(); // Refresh the page after successful update
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleImageUpload = (e) => {
    setProductForm({ ...productForm, image: e.target.files[0] });
  };

  return (
    <div className="inventory-management-panel">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        theme="colored"
      />
      
      <div className="inventory-header-section">
        <div className="inventory-title-wrapper">
          <FiPackage className="inventory-icon" />
          <h2 className="inventory-main-title">Product Inventory</h2>
        </div>
        <p className="inventory-subtitle">
          Manage your product catalog with ease
        </p>
      </div>

      {isLoadingProducts ? (
        <div className="inventory-loading-state">
          <div className="inventory-spinner-animation"></div>
          <p>Loading product data...</p>
        </div>
      ) : (
        <div className="product-table-container">
          <div className="table-responsive-wrapper">
            <table className="inventory-data-table">
              <thead className="table-header-section">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`product-data-row ${
                      editingProductId === item.id ? "row-editing-mode" : ""
                    }`}
                  >
                    <td className="product-name-cell">
                      {editingProductId === item.id ? (
                        <input
                          type="text"
                          name="product_name"
                          value={productForm.product_name}
                          onChange={handleFormChange}
                          className="inventory-edit-field"
                        />
                      ) : (
                        <span className="product-name-text">{item.product_name}</span>
                      )}
                    </td>
                    <td className="product-price-cell">
                      {editingProductId === item.id ? (
                        <input
                          type="text"
                          name="product_price"
                          value={productForm.product_price}
                          onChange={handleFormChange}
                          className="inventory-edit-field"
                        />
                      ) : (
                        <span className="price-value">Rs. {item.product_price}</span>
                      )}
                    </td>
                    <td className="product-image-cell">
                      {editingProductId === item.id ? (
                        <label className="image-upload-control">
                          <input
                            type="file"
                            onChange={handleImageUpload}
                          />
                          <FiImage className="upload-icon" />
                          <span>Change Image</span>
                        </label>
                      ) : (
                        <div className="product-thumbnail-container">
                          <img 
                            src={item.image} 
                            alt={item.product_name} 
                            className="product-thumbnail"
                          />
                        </div>
                      )}
                    </td>
                    <td className="product-description-cell">
                      {editingProductId === item.id ? (
                        <textarea
                          name="product_description"
                          value={productForm.product_description}
                          onChange={handleFormChange}
                          className="inventory-edit-textarea"
                        />
                      ) : (
                        <p className="description-text">{item.product_description}</p>
                      )}
                    </td>
                    <td className="product-category-cell">
                      {editingProductId === item.id ? (
                        <input
                          type="text"
                          name="category_name"
                          value={productForm.category_name}
                          onChange={handleFormChange}
                          className="inventory-edit-field"
                        />
                      ) : (
                        <span className="category-badge">{item.category_name}</span>
                      )}
                    </td>
                    <td className="product-actions-cell">
                      {editingProductId === item.id ? (
                        <div className="edit-mode-actions">
                          <button
                            className="confirm-edit-button"
                            onClick={() => submitProductUpdate(item.id)}
                          >
                            <FiSave className="action-icon" /> Save
                          </button>
                          <button
                            className="cancel-edit-button"
                            onClick={() => setEditingProductId(null)}
                          >
                            <FiX className="action-icon" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="view-mode-actions">
                          <button
                            className="edit-action-button"
                            onClick={() => initiateProductEdit(item)}
                          >
                            <FiEdit className="action-icon" /> Edit
                          </button>
                          <button
                            className="delete-action-button"
                            onClick={() => handleProductDelete(item.id)}
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

export default Productlist;