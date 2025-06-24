import React from 'react';
import { Link } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  return (
    <div className="unauthorized">
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};