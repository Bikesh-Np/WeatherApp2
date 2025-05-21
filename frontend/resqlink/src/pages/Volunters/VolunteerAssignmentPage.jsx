import React, { useEffect, useState } from "react";

const VolunteerAssignmentPage = () => {
  const [verifiedVolunteers, setVerifiedVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    startTime: "08:00",
    endTime: "17:00",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const locations = [
    { id: 1, name: "Central Relief Camp" },
    { id: 2, name: "North District Hospital" },
    { id: 3, name: "Southwest Shelter" },
    { id: 4, name: "East Food Distribution Center" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchVerifiedVolunteers = async () => {
      try {
        const response = await fetch(
          "/regvol/?verified=true"
        );
        if (response.ok) {
          const data = await response.json();
          setVerifiedVolunteers(data);
        } else {
          showNotification("Failed to fetch verified volunteers", "error");
        }
      } catch (error) {
        showNotification("Network error while fetching volunteers", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedVolunteers();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      5000
    );
  };

  const handleAssignClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setFormData({
      location: "",
      date: volunteer.doa ? formatDate(volunteer.doa) : "",
      startTime: "08:00",
      endTime: "17:00",
    });
    setIsModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/assignments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteer: selectedVolunteer.id,
          location: formData.location,
          date: formData.date,
          start_time: formData.startTime,
          end_time: formData.endTime,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        showNotification(
          `Assignment created successfully! ID: ${data.id}`,
          "success"
        );
        setIsModalVisible(false);

        // Refresh the assignments list if needed
        const refreshResponse = await fetch(
          "/regvol/?verified=true"
        );
        if (refreshResponse.ok) {
          setVerifiedVolunteers(await refreshResponse.json());
        }
      } else {
        showNotification(
          data.message || "Failed to create assignment",
          "error"
        );
      }
    } catch (error) {
      showNotification("An error occurred while creating assignment", "error");
      console.error("Error:", error);
    }
  };

  // Premium Green Theme Styles
  const styles = {
    container: {
      padding: "32px",
      maxWidth: "1200px",
      marginLeft: "300px",      
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
    },
    header: {
      marginBottom: "40px",
      textAlign: "left",
      padding: "24px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      borderLeft: "4px solid #10b981",
    },
    title: {
      color: "#1e293b",
      fontWeight: "600",
      marginBottom: "8px",
      fontSize: "28px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    titleIcon: {
      color: "#10b981",
      fontSize: "28px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      fontWeight: "400",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f1f5f9",
      padding: "16px 24px",
      textAlign: "left",
      fontWeight: "600",
      color: "#334155",
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tableRow: {
      borderBottom: "1px solid #e2e8f0",
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: "#f8fafc",
      },
    },
    tableCell: {
      padding: "16px 24px",
      color: "#475569",
      fontSize: "14px",
    },
    assignButton: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      ":hover": {
        backgroundColor: "#059669",
        transform: "translateY(-1px)",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      },
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: isModalVisible ? "flex" : "none",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
      backdropFilter: "blur(4px)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "12px",
      width: "500px",
      maxWidth: "90%",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      borderTop: "4px solid #10b981",
    },
    modalHeader: {
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e293b",
      margin: "0",
    },
    modalIcon: {
      color: "#10b981",
      fontSize: "24px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    formLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#334155",
      fontSize: "14px",
    },
    formControl: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.2s",
      ":focus": {
        outline: "none",
        borderColor: "#10b981",
        boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
      },
    },
    selectControl: {
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      backgroundSize: "16px",
    },
    timeContainer: {
      display: "flex",
      gap: "16px",
    },
    timeInput: {
      flex: "1",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "32px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    primaryButton: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      ":hover": {
        backgroundColor: "#059669",
        transform: "translateY(-1px)",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      },
    },
    secondaryButton: {
      backgroundColor: "white",
      color: "#64748b",
      border: "1px solid #e2e8f0",
      ":hover": {
        backgroundColor: "#f8fafc",
        borderColor: "#cbd5e1",
      },
    },
    notification: {
      position: "fixed",
      top: "24px",
      right: "24px",
      padding: "16px 24px",
      borderRadius: "8px",
      color: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: "1100",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      transform: notification.show ? "translateX(0)" : "translateX(120%)",
    },
    successNotification: {
      backgroundColor: "#10b981",
    },
    errorNotification: {
      backgroundColor: "#e2e8f0",
    },
    notificationIcon: {
      fontSize: "20px",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    },
    loadingSpinner: {
      border: "4px solid #e2e8f0",
      borderTop: "4px solid #10b981",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
      marginBottom: "20px",
    },
    loadingText: {
      color: "#64748b",
      fontSize: "16px",
      fontWeight: "500",
    },
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      textAlign: "center",
    },
    emptyIcon: {
      fontSize: "48px",
      color: "#cbd5e1",
      marginBottom: "20px",
    },
    emptyText: {
      color: "#64748b",
      fontSize: "16px",
      marginBottom: "16px",
    },
    emptyAction: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
      ":hover": {
        backgroundColor: "#059669",
      },
    },
    badge: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#d1fae5",
      color: "#065f46",
    },
  };

  return (
    <div style={styles.container}>
      {/* Notification */}
      <div
        style={{
          ...styles.notification,
          ...(notification.type === "success"
            ? styles.successNotification
            : styles.errorNotification),
        }}
      >
        <span style={styles.notificationIcon}>
          {notification.type === "success" ? "✓" : "⚠"}
        </span>
        {notification.message}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>👥</span>
          Volunteer Assignments
        </h1>
        <p style={styles.subtitle}>
          Manage and assign tasks to verified volunteers
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading volunteers...</div>
        </div>
      ) : verifiedVolunteers.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={{ ...styles.emptyText, fontWeight: "600" }}>
            No Verified Volunteers Found
          </h3>
          <p style={styles.emptyText}>
            Currently there are no volunteers to display. Check back later or
            verify more volunteers.
          </p>
          <button style={styles.emptyAction}>Refresh List</button>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Volunteer</th>
                <th style={styles.tableHeader}>Contact</th>
                <th style={styles.tableHeader}>Availability</th>
                <th style={styles.tableHeader}>Skills</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiedVolunteers.map((volunteer) => (
                <tr key={volunteer.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <strong>
                      {volunteer.first_name} {volunteer.last_name}
                    </strong>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      ID: {volunteer.id}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div>{volunteer.email}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {volunteer.phone || "No phone provided"}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {volunteer.doa ? (
                      <>
                        <div>Arrives: {formatDate(volunteer.doa)}</div>
                        <div style={{ marginTop: "4px" }}>
                          <span style={styles.badge}>Available</span>
                        </div>
                      </>
                    ) : (
                      "No date provided"
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {volunteer.skill || (
                      <span style={{ color: "#94a3b8" }}>Not specified</span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.assignButton}
                      onClick={() => handleAssignClick(volunteer)}
                    >
                      <span>✏️</span> Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
              Assign {selectedVolunteer?.first_name}{" "}
              {selectedVolunteer?.last_name}
            </h2>
            <form onSubmit={handleAssignmentSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Assignment Location</label>
                <input
                  type="text"
                  name="location"
                  style={{
                    ...styles.formControl,
                    border: "1px solid #10b981",
                    boxShadow: "0 0 0 2px rgba(16,185,129,0.1)",
                    borderRadius: "8px",
                  }}
                  placeholder="Enter location manually (e.g., Chapali Shelter)"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Assignment Date</label>
                <input
                  type="date"
                  name="date"
                  style={styles.formControl}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Time Range</label>
                <div style={styles.timeContainer}>
                  <div style={styles.timeInput}>
                    <label style={styles.formLabel}>Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      style={styles.formControl}
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div style={styles.timeInput}>
                    <label style={styles.formLabel}>End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      style={styles.formControl}
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => setIsModalVisible(false)}
                >
                  <span>✕</span> Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                >
                  <span>✓</span> Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default VolunteerAssignmentPage;


