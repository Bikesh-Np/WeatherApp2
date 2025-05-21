import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaDonate, FaHandsHelping, FaUsers, FaHome, FaSearch, FaChevronLeft, FaChevronRight, FaTimes, FaHeart, FaShieldAlt } from "react-icons/fa";
import "./Homepage.css";
import AxiosInstance from "../../components/AxiosInstance";

const Homepage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [donationAmount, setDonationAmount] = useState('');
  const [carouselItems, setCarouselItems] = useState([
    {
      image_url: "/images/default-carousel-1.jpg",
      title: "Loading...",
      description: "Please wait while we load content"
    }
  ]);
  const navigate = useNavigate();

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await AxiosInstance.get("/api/products");
        setData(productsResponse.data);
        
        // Fetch carousel items
        const carouselResponse = await AxiosInstance.get("/api/carousel");
        if (carouselResponse.data.length > 0) {
          setCarouselItems(carouselResponse.data);
        }
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsResponse.data.map(item => item.category_name))];
        setCategories(uniqueCategories);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback carousel items if API fails
        setCarouselItems([
          {
            image_url: "/images/default-carousel-1.jpg",
            title: "Emergency Relief Efforts",
            description: "Our team is working hard to provide assistance"
          },
          {
            image_url: "/images/default-carousel-2.jpg",
            title: "Community Support",
            description: "Join us in helping those affected"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carousel auto-rotation effect
  useEffect(() => {
    if (carouselItems.length > 1) { // Only rotate if we have multiple items
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev === carouselItems.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselItems.length]);

  const filteredProducts = useMemo(() => {
    return data.filter(product => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        searchTerm === '' || 
        product.product_name?.toLowerCase().includes(searchTermLower) ||
        product.product_description?.toLowerCase().includes(searchTermLower) ||
        product.category_name?.toLowerCase().includes(searchTermLower);
      
      const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
      const matchesPrice = product.product_price >= priceRange[0] && product.product_price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [data, searchTerm, selectedCategory, priceRange]);

  const handleDonateClick = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/donatepg");
    }, 1500);
  };

  const handleMoneyDonation = () => {
    const amount = parseFloat(donationAmount);
    if (amount && amount > 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/moneydonatepg", { state: { amount } });
      }, 1500);
    } else {
      alert('Please enter a valid donation amount');
    }
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value) || 0;
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    if (index === 1 && value < newPriceRange[0]) {
      newPriceRange[0] = value;
    }
    setPriceRange(newPriceRange);
  };

  const clearSearch = () => setSearchTerm('');
  const resetAllFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSearchTerm('');
  };

  return (
    <div className="premium-home-container">
      {loading && (
        <div className="premium-loading-overlay">
          <div className="premium-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <p>Processing your donation...</p>
        </div>
      )}

      <section className="premium-carousel-section">
        <div className="premium-carousel">
          {carouselItems.map((item, index) => (
            <div 
              key={item.id || index}
              className={`premium-carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{
                opacity: index === activeIndex ? 1 : 0,
                transform: `scale(${index === activeIndex ? 1 : 0.95})`
              }}
            >
              <img 
                src={item.image_url}
                className="premium-carousel-image" 
                alt={item.title} 
                loading={index === activeIndex ? "eager" : "lazy"}
                onError={(e) => {
                  e.target.src = "/images/default-carousel.jpg";
                }}
              />
              <div className="premium-carousel-overlay"></div>
              <div 
                className="premium-carousel-content"
                style={{
                  transform: `translateY(${index === activeIndex ? 0 : '50px'})`,
                  opacity: index === activeIndex ? 1 : 0
                }}
              >
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
          
          {carouselItems.length > 1 && (
            <>
              <button className="premium-carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
                <FaChevronLeft />
              </button>
              <button className="premium-carousel-control next" onClick={nextSlide} aria-label="Next slide">
                <FaChevronRight />
              </button>
            </>
          )}
          
          <div className="premium-carousel-indicators">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="premium-products-section">
        <div className="premium-section-header">
          <div className="header-text">
            <span className="section-subtitle">Support the Cause</span>
            <h2 className="section-title">
              <FaDonate className="title-icon" />
              Relief Products
            </h2>
          </div>
        </div>

        <div className="premium-filters-container">
          <div className="premium-search-container premium-filter-group">
            <label htmlFor="product-search">Search:</label>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                id="product-search"
                type="text"
                placeholder="Search by name, description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={clearSearch} aria-label="Clear search">
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="premium-filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="premium-filter-group">
            <label>Price Range (Rs):</label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                min="0"
                aria-label="Minimum price"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                min={priceRange[0]}
                aria-label="Maximum price"
              />
            </div>
          </div>

          <button className="filter-res-btn" onClick={resetAllFilters} aria-label="Reset all filters">
            Reset All
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="premium-empty-state">
            <div className="empty-state-image" aria-hidden="true"></div>
            <h3>No relief products found</h3>
            <p>Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="premium-products-grid">
            {filteredProducts.map((item) => (
              <div className="premium-product-card" key={item.id}>
                <div className="product-image-container">
                  <img 
                    src={item.image_url || "/images/placeholder-product.jpg"}
                    alt={item.product_name} 
                    className="product-image" 
                    onError={(e) => {
                      e.target.src = "/images/placeholder-product.jpg";
                    }}
                  />
                  {item.is_popular && <div className="product-tag">Popular</div>}
                </div>
                
                <div className="product-details">
                  <div className="product-meta">
                    <h3 className="product-name">{item.product_name}</h3>
                    <span className="product-price">Rs. {item.product_price?.toLocaleString()}</span>
                    <span className="product-category">{item.category_name}</span>
                  </div>
                  
                  <p className="product-description">
                    {item.product_description}
                  </p>
                  
                  <div className="product-footer">
                    <button
                      className="premium-donate-button"
                      onClick={() => handleDonateClick(item)}
                      aria-label={`Donate ${item.product_name}`}
                    >
                      <FaDonate className="button-icon" /> Donate Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="premium-products-section">
        <div className="premium-section-header">
          <div className="header-text">
            <span className="section-subtitle">Direct Support</span>
            <h2 className="section-title">
              <FaHeart className="title-icon" />
              Make a Donation
            </h2>
          </div>
        </div>
  
        <div className="relief-container">
          <div className="relief-image-wrapper">
            <img 
              src="/images/donation-banner.jpg"
              alt="Disaster victims receiving aid" 
              className="relief-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/images/default-donation-banner.jpg";
              }}
            />
            <div className="image-overlay">
              <h3>Your Help Matters</h3>
              <p>Join us in supporting disaster victims</p>
            </div>
          </div>
          
          <div className="donation-card">
            <div className="card-header">
              <div className="icon-circle">
                <FaHandsHelping className="help-icon" />
              </div>
              <h2>Emergency Relief Fund</h2>
              <p className="subtitle">Provide immediate assistance to affected families</p>
            </div>
            
            <div className="donation-form">
              <div className="form-group">
                <label htmlFor="donation-amount">Your Donation Amount</label>
                <div className="input-container">
                  <span className="currency">Rs.</span>
                  <input
                    id="donation-amount"
                    type="number"
                    placeholder="0.00"
                    min="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    aria-label="Donation amount"
                  />
                </div>
              </div>
              
              <div className="quick-donations">
                <p>Quick Donation:</p>
                <div className="amount-buttons">
                  {[500, 1000, 2000, 5000].map((amount) => (
                    <button 
                      key={amount} 
                      onClick={() => setDonationAmount(amount)}
                      aria-label={`Donate Rs. ${amount}`}
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="impact-stats">
                <div className="stat-item">
                  <FaUsers className="stat-icon" />
                  <span>1,000+ families helped</span>
                </div>
                <div className="stat-item">
                  <FaHome className="stat-icon" />
                  <span>200+ shelters built</span>
                </div>
              </div>
            </div>
            
            <button 
              className="donate-button" 
              onClick={handleMoneyDonation}
              aria-label="Donate now"
            >
              <FaDonate className="button-icon" />
              Donate Now
            </button>
            
            <div className="security-badge">
              <FaShieldAlt className="shield-icon" />
              <span>100% Secure Donation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;