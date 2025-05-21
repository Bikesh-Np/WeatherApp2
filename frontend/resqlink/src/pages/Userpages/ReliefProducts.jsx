import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaDonate, FaSearch, FaTimes, FaHeart, FaRegHeart, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "./ReliefProducts.css";
import axios from "axios";

const ReliefProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setData(res.data);
        const uniqueCategories = [...new Set(res.data.map(item => item.category_name))];
        setCategories(uniqueCategories);
      })
      .catch((e) => console.log(e));
  }, []);

  const filteredProducts = useMemo(() => {
    return data.filter(product => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        searchTerm === '' || 
        product.product_name.toLowerCase().includes(searchTermLower) ||
        product.product_description.toLowerCase().includes(searchTermLower) ||
        product.category_name.toLowerCase().includes(searchTermLower);
      
      const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
      const matchesPrice = product.product_price >= priceRange[0] && product.product_price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [data, searchTerm, selectedCategory, priceRange]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDonateClick = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/donatepg");
    }, 1500);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value) || 0;
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
    setCurrentPage(1); // Reset to first page when price changes
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  const resetAllFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="relief-home-container">
      {loading && (
        <div className="relief-loading-overlay">
          <div className="relief-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <p>Processing your donation...</p>
        </div>
      )}

      <section className="relief-products-section">
        <div className="relief-section-header">
          <div className="header-text">
            <span className="section-subtitle">Support the Cause</span>
            <h2 className="section-title">
              <FaDonate className="title-icon" />
              Relief Products
            </h2>
          </div>
        </div>

        <div className="relief-filters-container">
          <div className="relief-search-container relief-filter-group">
            <label htmlFor="product-search">Search:</label>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                id="product-search"
                type="text"
                placeholder="Search by name, description or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={clearSearch}>
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="relief-filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="relief-filter-group">
            <label>Price Range (Rs):</label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                min={priceRange[0]}
              />
            </div>
          </div>

          <button className="filter-reset-btn" onClick={resetAllFilters}>
            Reset All
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="relief-empty-state">
            <img src="/images/no-products.svg" alt="No products found" />
            <h3>No relief products found</h3>
            <p>Try adjusting your search or check back later</p>
          </div>
        ) : (
          <>
            <div className="relief-products-grid">
              {currentProducts.map((item) => (
                <div className="relief-product-card" key={item.id}>
                  <div className="product-image-container">
                    <img src={item.image} alt={item.product_name} className="product-image" />
          
                    <div className="product-tag">Popular</div>
                  </div>
                  
                  <div className="product-details">
                    <div className="product-meta">
                      <h3 className="product-name">{item.product_name}</h3>
                      <span className="product-price">Rs. {item.product_price}</span>
                      <span className="product-category">{item.category_name}</span>
                    </div>
                    
                    <p className="product-description">
                      {item.product_description}
                    </p>
                    
                    <div className="product-footer">
                      <button
                        className="relief-donate-button"
                        onClick={() => handleDonateClick(item)}
                      >
                        <FaDonate className="button-icon" /> Donate Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredProducts.length > productsPerPage && (
              <div className="relief-pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                >
                  <FaAngleLeft />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-arrow"
                >
                  <FaAngleRight />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ReliefProducts;