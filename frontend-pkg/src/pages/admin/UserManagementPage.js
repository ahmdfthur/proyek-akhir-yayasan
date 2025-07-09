// frontend-pkg/src/pages/admin/UserManagementPage.js
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import './UserManagementPage.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const handleDelete = async (userId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            try {
                await apiClient.delete(`/admin/users/${userId}`);
                // Hapus user dari state untuk update UI secara real-time
                setUsers(users.filter(user => user.id !== userId));
                alert('Pengguna berhasil dihapus.');
            } catch (error) {
                alert('Gagal menghapus pengguna.');
            }
        }
      }

    useEffect(() => {
        setLoading(true);
        apiClient.get('/admin/users')
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.error("Gagal mengambil data pengguna:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Memuat data pengguna...</div>;

    return (
        <div className="user-management-container">
            <div className="page-header">
                <h2>Manajemen Pengguna</h2>
                <Link to="/dashboard/manajemen-pengguna/tambah" className="add-user-button">
                Tambah Pengguna Baru
            </Link>
            </div>
            <div className="card">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Peran</th>
                            <th>Tempat Tugas</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge role-${user.role}`}>{user.role.replace('_', ' ')}</span></td>
                                <td>{user.school_name || 'Yayasan'}</td>
                                <td>
                                    <Link to={`/dashboard/manajemen-pengguna/edit/${user.id}`} className="action-btn edit">Edit</Link>
                                    <button onClick={() => handleDelete(user.id)} className="action-btn delete">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPage;