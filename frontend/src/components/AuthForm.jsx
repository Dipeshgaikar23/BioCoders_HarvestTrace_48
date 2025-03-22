import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import custom styles
import axios from 'axios';

const AuthForm = () => {
  const [userType, setUserType] = useState('farmer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    document: null,
    password: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] }); // ✅ Use only first file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚀 Backend API - Comment this out if backend is not ready
    const apiUrl = userType === 'farmer'
      ? 'http://localhost:5000/farmers/register'
      : 'http://localhost:5000/consumer/register';

    // Convert form data to JSON
    const formDataToSend = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      ...(userType === 'farmer' && { location: formData.location }),
    };

    try {
      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert(`${userType.toUpperCase()} Registered Successfully!`);
      navigate('/login');
    } catch (error) {
      console.error('🔥 Registration Error:', error);
      alert(`Error: ${error.response?.data?.message || 'Server Error'}`);
    }
  };

  return (
    <div className=" auth-container">
      <div className="toggle-buttons">
        <button
          className={`btn ${userType === 'farmer' ? 'btn-success' : 'btn-light'}`}
          onClick={() => setUserType('farmer')}
        >
          Farmer
        </button>
        <button
          className={`btn ${userType === 'consumer' ? 'btn-success' : 'btn-light'}`}
          onClick={() => setUserType('consumer')}
        >
          Consumer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <h2>{userType === 'farmer' ? 'Farmer Registration' : 'Consumer Registration'}</h2>
        
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

        {userType === 'farmer' && (
          <>
            <div className="form-group">
              <label>Farm Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Enter your farm location"
                required
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Upload Document for Verification</label>
              <input type="file" className="form-control" required multiple onChange={handleFileChange} />
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

        <button type="submit" className="btn w-100 text-white" style={{background:"#01c64b"}}>Register</button>
        <p className="login-text">Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
};

export default AuthForm;
