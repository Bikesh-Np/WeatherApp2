import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const dataQuery = search.get("data");
  const [data, setData] = useState({});
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (dataQuery) {
      const resData = atob(dataQuery);
      const resObject = JSON.parse(resData);
      setData(resObject);
    }

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [dataQuery, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="success-card text-center shadow-lg">
        <div className="success-circle">
          <span className="checkmark">&#10004;</span>
        </div>
        <h2 className="text-dark mt-3 fw-bold">Payment Successful!</h2>
        <p className="fs-5 text-muted">Thank you for your payment.</p>
        <p className="fs-3 text-success fw-bold">Rs. {data.total_amount}</p>
        <p className="redirect-message">
          Redirecting to homepage in <span className="countdown">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
