import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { PuffLoader } from "react-spinners";
import { FaMoneyBillWave } from "react-icons/fa";
import { FiUser, FiPhone, FiPackage, FiCalendar, FiHash, FiSearch } from "react-icons/fi";
import './PaymentList.css';

const PaymentList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to mask first three characters with *
  const maskData = (data) => {
    if (!data) return '';
    if (data.length <= 2) return '*'.repeat(data.length);
    return '*'.repeat(2) + data.slice(2);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("/api/get-payments/");
        setRecords(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredRecords = records.filter(record =>
    Object.values(record).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.amount), 0);

  if (loading) {
    return (
      <div className="loader-container">
        <PuffLoader color="#6366f1" size={80} />
      </div>
    );
  }

  return (
    <div className="payment-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Transaction Records</h1>
          <p className="dashboard-subtitle">View and manage all payment transactions</p>
        </div>
        
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="dashboard-content">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon purple">
              <FiHash />
            </div>
            <div className="card-content">
              <span className="card-label">Total Transactions</span>
              <span className="card-value">{records.length}</span>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-icon green">
              Rs. 
            </div>
            <div className="card-content">
              <span className="card-label">Total Amount</span>
              <span className="card-value">Rs.{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="transactions-table-container">
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th><FiHash className="th-icon" /> ID</th>
                  <th><FiUser className="th-icon" /> Customer</th>
                  <th><FiPhone className="th-icon" /> Phone</th>
                  <th><FaMoneyBillWave className="th-icon" />Amount</th>
                  <th><FiPackage className="th-icon" /> Product</th>
                  <th>Qty</th>
                  <th><FiCalendar className="th-icon" /> Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="text-muted">#{record.id}</td>
                      <td>
                        <span className="customer-name">{maskData(record.full_name)}</span>
                      </td>
                      <td>{maskData(record.phone_number)}</td>
                      <td className="amount-cell">
                        <span className="amount-badge">
                          Rs.{parseFloat(record.amount).toLocaleString()}
                        </span>
                      </td>
                      <td>{record.product_name}</td>
                      <td>
                        <span className="quantity-badge">
                          {record.quantity}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-results-row">
                    <td colSpan="7">
                      <div className="no-results">
                        <FiSearch size={48} />
                        <h4>No transactions found</h4>
                        <p>
                          {searchTerm ? "Try adjusting your search" : "No records available yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;