import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./DashboardStats.css";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard/stats/")
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch dashboard stats");
        setLoading(false);
      });
  }, []);

  const handleSeeMore = (type) => {
    const routes = {
      user: "/admin/userverify",
      Volunteer: "/admin/listvolunteer",
      payments: "/admin/donations",
      products: "/admin/productlist",
      categories: "/admin/category",
    };
    navigate(routes[type]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="success" />
      </div>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );

  return (
    <Container fluid className="dashboard-container px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="admin-dashboard-title">
          <i className="fas fa-chart-line me-3 text-success"></i>
          Dashboard Overview
        </h1>
        <div className="dashboard-date-badge bg-success-light text-success">
          <i className="fas fa-calendar-alt me-2"></i>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Summary Row */}
      <Row className="g-4 mb-4">
        {/* Users Card */}
        <Col xl={4} lg={4} md={6}>
          <Card className="stat-card user-stat-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="stat-category text-muted">REGISTERED USERS</h6>
                  <div className="stat-circle">
                    <h2 className="stat-value">{stats?.user_count || 0}</h2>
                  </div>

                  <div className="stat-trend text-success"></div>
                </div>
                <div className="stat-icon-circle bg-success-light">
                  <i className="fas fa-user text-success"></i>
                </div>
              </div>
              <Button
                variant="outline-success"
                className="w-100 mt-5 stat-action-btt"
                onClick={() => handleSeeMore("user")}
              >
                Manage Users <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Messages Card */}
        <Col xl={4} lg={4} md={6}>
          <Card className="stat-card message-stat-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="stat-category text-muted">
                    REGISTERED VOLUNTEER
                  </h6>
                  <div className="stat-circle">
                    <h2 className="stat-value">
                      {stats?.volunteer_count || 0}
                    </h2>
                  </div>

                  <div className="stat-trend text-success"></div>
                </div>
                <div className="stat-icon-circle bg-success-light">
                  <i className="fas fa-users text-success"></i>
                </div>
              </div>
              <Button
                variant="outline-success"
                className="w-100 mt-5 stat-action-btt"
                onClick={() => handleSeeMore("Volunteer")}
              >
                Manage Volunteer{" "}
                <i className="fas fa-external-link-alt ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Payments Card */}
        <Col xl={4} lg={4} md={6}>
          <Card className="stat-card payment-stat-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="stat-category text-muted">TOTAL PAYMENTS</h6>
                  <div className="stat-circle">
                    <h2 className="stat-value">{stats?.payment_count || 0}</h2>
                  </div>

                  <div className="stat-amount text-success">
                    {formatCurrency(stats?.total_payments || 0)}
                  </div>
                </div>
                <div className="stat-icon-circle bg-success-light">
                  <i className="fas fa-credit-card text-success"></i>
                </div>
              </div>
              <Button
                variant="outline-success"
                className="w-100 mt-4 stat-action-btt"
                onClick={() => handleSeeMore("payments")}
              >
                View Payments <i className="fas fa-chart-pie ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Inventory Overview Card */}
      <Card className="inventory-overview-card mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="card-title text-dark">
                <i className="fas fa-boxes text-success me-3"></i>
                Inventory Management
              </h2>
              <p className="text-muted mb-0">
                Overview of your product inventory
              </p>
            </div>
            <Badge pill bg="success" className="px-3 py-2 fs-6">
              <i className="fas fa-cubes me-2"></i>
              {stats?.product_count || 0} Total Products
            </Badge>
          </div>

          <Row className="g-4">
            {/* Products Card */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary-light text-primary p-2 rounded me-3">
                      <i className="fas fa-box-open"></i>
                    </div>
                    <div>
                      <h4 className="mb-0">Products</h4>
                      <p className="text-muted mb-0">Total inventory items</p>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <h1 className="display-4 text-dark">
                      {stats?.product_count || 0}
                    </h1>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-success"
                        onClick={() => handleSeeMore("products")}
                      >
                        View Products
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => navigate("/admin/addproduct")}
                      >
                        <i className="fas fa-plus me-2"></i> Add New
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Categories Card */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success-light text-success p-2 rounded me-3">
                      <i className="fas fa-tags"></i>
                    </div>
                    <div>
                      <h4 className="mb-0">Categories</h4>
                      <p className="text-muted mb-0">Product categories</p>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <h1 className="display-4 text-dark">
                      {stats?.category_count || 0}
                    </h1>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-success"
                        onClick={() => handleSeeMore("categories")}
                      >
                        View Categories
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => navigate("/admin/addcategory")}
                      >
                        <i className="fas fa-plus me-2"></i> Add New
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardStats;
