import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css"; // Import custom styles

const AuthForm = () => {
  const [userType, setUserType] = useState("farmer"); // Default is farmer
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    document: null,
    password: "",
  });

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  // Function to fetch current location & convert it to an address
  const fetchCurrentLocation = async () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          setFormData({ ...formData, location: address });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location: ", error);
          alert("Unable to fetch location. Please enter manually.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Convert Latitude & Longitude to Human-Readable Address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      return response.data.display_name;
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Location not found";
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl =
      userType === "farmer"
        ? "http://localhost:5000/farmers/register"
        : "http://localhost:5000/consumer/register";

    try {
      await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(`${userType.toUpperCase()} Registered Successfully!`);
      navigate("/login");
    } catch (error) {
      console.error("🔥 Registration Error:", error);
      alert(`Error: ${error.response?.data?.message || "Server Error"}`);
    }
  };

  return (
    <div className="auth-container">
      {/* ✅ Toggle Buttons for Switching Between Farmer & Consumer */}
      <div className="toggle-buttons d-flex justify-content-center mb-4">
        <button
          className={`btn ${
            userType === "farmer" ? "btn-success" : "btn-outline-success"
          } me-2`}
          onClick={() => setUserType("farmer")}
        >
          Farmer
        </button>
        <button
          className={`btn ${
            userType === "consumer" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setUserType("consumer")}
        >
          Consumer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <h2>
          {userType === "farmer"
            ? "Farmer Registration"
            : "Consumer Registration"}
        </h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter your full name"
            required
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="Enter your phone number"
            required
            onChange={handleChange}
          />
        </div>

        {userType === "farmer" && (
          <>
            {/* Farm Location - Manual Entry or Auto-Detect */}
            <div className="form-group">
              <label>Farm Location</label>
              <div className="mb-2">
                <button
                  type="button"
                  className={`btn ${
                    useCurrentLocation ? "btn-success" : "btn-outline-success"
                  } me-2`}
                  onClick={() => {
                    setUseCurrentLocation(true);
                    fetchCurrentLocation();
                  }}
                  disabled={loadingLocation}
                >
                  {loadingLocation
                    ? "Fetching Location..."
                    : "Use Current Location"}
                </button>

                <button
                  type="button"
                  className={`btn ${
                    !useCurrentLocation ? "btn-success" : "btn-outline-success"
                  }`}
                  onClick={() => setUseCurrentLocation(false)}
                >
                  Enter Manually
                </button>
              </div>

              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Enter your farm location"
                required
                value={formData.location}
                onChange={handleChange}
                disabled={useCurrentLocation} // Disable if using GPS
              />
            </div>

            <div className="form-group">
              <label>Upload Document for Verification</label>
              <input
                type="file"
                className="form-control"
                required
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            required
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn w-100 text-white"
          style={{ background: "#01c64b" }}
        >
          Register
        </button>
        <p className="login-text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
