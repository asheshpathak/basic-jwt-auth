import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/protected/admin', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAdminData(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <p>This page is only accessible to admin users.</p>
      
      {adminData && (
        <div className="admin-data">
          <h3>Admin Data</h3>
          <pre>{JSON.stringify(adminData, null, 2)}</pre>
        </div>
      )}
      
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};