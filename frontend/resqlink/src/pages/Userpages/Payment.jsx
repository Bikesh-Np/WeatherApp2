import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Payment.css";
import axios from "axios";
import { Link } from "react-router-dom";

// Function to send product details to Django backend
const sendProductDetails = async (productData) => {
  try {
    const response = await axios.post(
      "/api/save-product/",
      {
        full_name: productData.fullName,
        phone_number: productData.phoneNumber,
        amount: productData.amount,
        product_name: productData.name,
        quantity: productData.quantity,
      }
    );

    if (response.status === 200) {
      console.log("Payment details saved successfully");
    } else {
      console.error("Failed to save payment details");
    }
  } catch (error) {
    console.error("Error saving payment details:", error);
  }
};

const Payment = () => {
  const [formData, setFormData] = useState({
    amount: "10",
    product_name: "",
    quantity: "",
    full_name: "",
    phone_number: "",
    tax_amount: "0",
    total_amount: "10",
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:3000/paymentsuccess",
    failure_url: "http://localhost:3000/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
  });

  // Generate signature for payment
  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  // Load selected product from localStorage
  useEffect(() => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (product) {
      setSelectedProduct(product);
      setFormData((prevData) => ({
        ...prevData,
        amount: product.product_price.toString(),
        total_amount: product.product_price.toString(),
        product_name: product.product_name,
      }));
    }
  }, []);

  // Update signature when amount changes
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );
    setFormData((prevState) => ({ ...prevState, signature: hashedSignature }));
  }, [formData.amount]);

  // Handle quantity change
  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) => {
      const newQuantity =
        type === "increase"
          ? prevQuantity + 1
          : prevQuantity > 1
          ? prevQuantity - 1
          : 1;

      // Update amount and total_amount dynamically
      if (selectedProduct) {
        const updatedAmount = selectedProduct.product_price * newQuantity;
        setFormData((prevData) => ({
          ...prevData,
          quantity: newQuantity,
          amount: updatedAmount.toString(),
          total_amount: updatedAmount.toString(),
        }));
      }

      return newQuantity;
    });
  };

  // Validate full name (no numbers or symbols)
  const validateFullName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(name)) {
      setErrors((prev) => ({
        ...prev,
        fullName: "Name should only contain letters and spaces",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, fullName: "" }));
    return true;
  };

  // Validate phone number (exactly 10 digits)
  const validatePhoneNumber = (number) => {
    const regex = /^\d{10}$/;
    if (!regex.test(number)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone number must be exactly 10 digits",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    return true;
  };

  // Handle full name change
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    validateFullName(value);
    setFullName(value);
  };

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(numericValue);
    // Only validate if the user has entered something
    if (numericValue) {
      validatePhoneNumber(numericValue);
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isFullNameValid = validateFullName(fullName);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    
    if (!isFullNameValid || !isPhoneNumberValid || !selectedProduct) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    setLoading(true);

    // Prepare product data to send to the backend
    const productData = {
      name: selectedProduct.product_name,
      image: productImage,
      quantity,
      fullName,
      phoneNumber,
      amount: selectedProduct.product_price * quantity,
    };

    // Send product details to the backend
    await sendProductDetails(productData);

    setTimeout(() => {
      e.target.submit(); // Submit form after showing the loading effect
    }, 2000);
  };

  return (
    <div className="container payment-container">
      <h2 className="text-center mb-4">Checkout</h2>
      <div className="row">
        {/* Left side: Selected Product */}
        <div className="col-md-5">
          {selectedProduct && (
            <div className="cardee shadow-sm p-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                className="img-fluid rounded mb-3"
              />
              <h5>{selectedProduct.product_name}</h5>
              <p>{selectedProduct.product_description}</p>
              <h6 className="text-primary">
                Rs. {selectedProduct.product_price}
              </h6>
            </div>
          )}
        </div>

        {/* Right side: Payments Form */}
        <div className="col-md-7">
          {/* Loading Effect */}
          {loading && (
            <div className="loading-overlay">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Redirecting to esewa page...</p>
            </div>
          )}

          <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="payment-form"
            onSubmit={handlePaymentSubmit}
          >
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="text"
                className="form-control"
                name="amount"
                value={formData.amount}
                readOnly
                required
              />
            </div>

            <input
              type="hidden"
              name="tax_amount"
              value={formData.tax_amount}
              required
            />
            <input
              type="hidden"
              name="total_amount"
              value={formData.total_amount}
              required
            />
            <input
              type="hidden"
              name="transaction_uuid"
              value={formData.transaction_uuid}
              required
            />
            <input
              type="hidden"
              name="product_code"
              value={formData.product_code}
              required
            />
            <input
              type="hidden"
              name="product_service_charge"
              value={formData.product_service_charge}
              required
            />
            <input
              type="hidden"
              name="product_delivery_charge"
              value={formData.product_delivery_charge}
              required
            />
            <input
              type="hidden"
              name="success_url"
              value={formData.success_url}
              required
            />
            <input
              type="hidden"
              name="failure_url"
              value={formData.failure_url}
              required
            />
            <input
              type="hidden"
              name="signed_field_names"
              value={formData.signed_field_names}
              required
            />
            <input
              type="hidden"
              name="signature"
              value={formData.signature}
              required
            />

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                value={fullName}
                onChange={handleFullNameChange}
                onBlur={() => validateFullName(fullName)}
                required
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel" // Changed from number to tel for better mobile keyboard
                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onBlur={() => validatePhoneNumber(phoneNumber)}
                maxLength="10"
                required
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <div className="quantity-container">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  −
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => handleQuantityChange("increase")}
                >
                  +
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Pay via E-Sewa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;