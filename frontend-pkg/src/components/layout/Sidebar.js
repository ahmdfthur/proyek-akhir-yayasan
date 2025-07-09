// frontend-pkg/src/components/layout/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Import ikon dengan nama yang sudah diperbarui
import { 
    FaGaugeHigh,            // <-- Pengganti FaTachometerAlt
    FaUser, 
    FaArrowUpFromBracket,   // <-- Pengganti FaFileUpload
    FaClipboardList 
} from 'react-icons/fa6';

// Definisikan menu untuk setiap peran dengan ikon yang benar
const menuConfig = {
    guru: [
        { path: '/dashboard/beranda', icon: <FaGaugeHigh />, text: 'Beranda' },
        { path: '/dashboard/biodata', icon: <FaUser />, text: 'Biodata Diri' },
        { path: '/dashboard/upload-rpp', icon: <FaArrowUpFromBracket />, text: 'Upload RPP' },
        { path: '/dashboard/hasil-kinerja', icon: <FaClipboardList />, text: 'Hasil Kinerja' },
    ],
    kepala_sekolah: [
        { path: '/dashboard/beranda', icon: <FaGaugeHigh />, text: 'Beranda' },
        { path: '/dashboard/validasi-rpp', icon: <FaClipboardList />, text: 'Validasi RPP' },
        { path: '/dashboard/penilaian-guru', icon: <FaUser />, text: 'Penilaian Guru' },
    ],
    admin_yayasan: [
        { path: '/dashboard/beranda', icon: <FaGaugeHigh />, text: 'Beranda' },
        { path: '/dashboard/manajemen-pengguna', icon: <FaUser />, text: 'Manajemen Pengguna' },
        { path: '/dashboard/laporan-kinerja', icon: <FaClipboardList />, text: 'Laporan Kinerja' },
    ]
    // Tambahkan peran 'yayasan' jika diperlukan
};


const Sidebar = ({ userRole }) => {
    const menuItems = menuConfig[userRole] || []; // Ambil menu sesuai peran

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>PKG System</h3>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;