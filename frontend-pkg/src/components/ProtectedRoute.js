// frontend-pkg/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // Jika token ada, render halaman yang diminta (melalui <Outlet />)
    // Jika tidak, redirect ke halaman login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;