// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            // Jika berhasil, simpan token di localStorage
            localStorage.setItem('token', response.data.token);
            
            // Arahkan ke halaman dashboard (yang akan kita buat selanjutnya)
            navigate('/dashboard'); 

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat login.';
            setError(errorMessage);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Sistem Penilaian Kinerja Guru</h2>
                <p>Silakan masuk untuk melanjutkan</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Masuk</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;