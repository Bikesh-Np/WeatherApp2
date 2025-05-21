import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Moneypg.css";
import axios from "axios";

const Moneypg = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    amount: location.state?.amount || "100",
    product_name: "General Donation",
    quantity: "1",
    full_name: "",
    phone_number: "",
    tax_amount: "0",
    total_amount: location.state?.amount || "100",
    transaction_uuid: CryptoJS.lib.WordArray.random(16).toString(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:3000/paymentsuccess",
    failure_url: "http://localhost:3000/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  const [loading, setLoading] = useState(false);
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
  }, [formData.amount, formData.total_amount]);

  // Handle amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      amount: value,
      total_amount: value,
    }));
  };

  // Handle name change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({...prev, full_name: value}));
    validateFullName(value);
  };

  // Handle phone change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData(prev => ({...prev, phone_number: value}));
    validatePhoneNumber(value);
  };

  // Validate full name
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

  // Validate phone number
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

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    const isFullNameValid = validateFullName(formData.full_name);
    const isPhoneNumberValid = validatePhoneNumber(formData.phone_number);
    
    if (!isFullNameValid || !isPhoneNumberValid) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/save-product/", {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        amount: formData.amount,
        product_name: formData.product_name,
        quantity: formData.quantity
      });

      setTimeout(() => {
        e.target.submit();
      }, 2000);
    } catch (error) {
      console.error("Error saving payment details:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container payment-container">
      <h2 className="text-center mb-4">Make a Donation</h2>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Redirecting to payment gateway...</p>
            </div>
          )}

          <div className="cardee shadow-sm p-3 mb-4">
            <h5 className="text-center">General Donation</h5>
            <p className="text-center">Thank you for your generous contribution</p>
          </div>

          <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="payment-form"
            onSubmit={handlePaymentSubmit}
          >
            <div className="mb-3">
              <label className="form-label">Amount (Rs.)</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                min="1"
                required
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="quick-amounts mb-3">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  amount: "500",
                  total_amount: "500"
                }))}
              >
                500
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  amount: "1000",
                  total_amount: "1000"
                }))}
              >
                1,000
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  amount: "2000",
                  total_amount: "2000"
                }))}
              >
                2,000
              </button>
            </div>

            {/* Hidden required fields */}
            <input type="hidden" name="tax_amount" value={formData.tax_amount} required />
            <input type="hidden" name="total_amount" value={formData.total_amount} required />
            <input type="hidden" name="transaction_uuid" value={formData.transaction_uuid} required />
            <input type="hidden" name="product_code" value={formData.product_code} required />
            <input type="hidden" name="product_service_charge" value={formData.product_service_charge} required />
            <input type="hidden" name="product_delivery_charge" value={formData.product_delivery_charge} required />
            <input type="hidden" name="product_name" value={formData.product_name} required />
            <input type="hidden" name="success_url" value={formData.success_url} required />
            <input type="hidden" name="failure_url" value={formData.failure_url} required />
            <input type="hidden" name="signed_field_names" value={formData.signed_field_names} required />
            <input type="hidden" name="signature" value={formData.signature} required />
            <input type="hidden" name="quantity" value={formData.quantity} required />

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                value={formData.full_name}
                onChange={handleNameChange}
                onBlur={() => validateFullName(formData.full_name)}
                required
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                value={formData.phone_number}
                onChange={handlePhoneChange}
                onBlur={() => validatePhoneNumber(formData.phone_number)}
                maxLength="10"
                required
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Donate via E-Sewa
            </button>

            <div className="text-center mt-3">
              <Link to="/" className="text-muted">Cancel and return</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Moneypg;