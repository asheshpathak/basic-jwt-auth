import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/protected/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="user-card">
          <h3>User Information</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Roles:</strong> {user?.roles.join(', ')}</p>
        </div>

        {dashboardData && (
          <div className="dashboard-data">
            <h3>Dashboard Data</h3>
            <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
          </div>
        )}

        <div className="navigation">
          {user?.roles.includes('admin') && (
            <Link to="/admin" className="nav-link">Admin Panel</Link>
          )}
        </div>
      </div>
    </div>
  );
};