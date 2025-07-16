import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
// Import ikon dengan nama yang sudah benar
import { 
    FaGaugeHigh,
    FaUser, 
    FaArrowUpFromBracket,
    FaClipboardList,
    FaUsers,
    FaFileSignature
} from 'react-icons/fa6';

// Definisikan menu untuk setiap peran
const menuConfig = {
    guru: [
        // UBAH PATH DI SINI
        { path: '/dashboard', icon: <FaGaugeHigh />, text: 'Beranda' },
        { path: '/dashboard/biodata', icon: <FaUser />, text: 'Biodata Diri' },
        { path: '/dashboard/upload-rpp', icon: <FaArrowUpFromBracket />, text: 'Upload RPP' },
        { path: '/dashboard/hasil-kinerja', icon: <FaClipboardList />, text: 'Hasil Kinerja' },
    ],
    kepala_sekolah: [
        // UBAH PATH DI SINI
        { path: '/dashboard', icon: <FaGaugeHigh />, text: 'Beranda' },
        { path: '/dashboard/validasi-rpp', icon: <FaClipboardList />, text: 'Validasi RPP' },
        { path: '/dashboard/penilaian-guru', icon: <FaFileSignature />, text: 'Penilaian Guru' },
    ],
    admin_yayasan: [
        // UBAH PATH DI SINI
        { path: '/dashboard', icon: <FaGaugeHigh />, text: 'Beranda' },
        { path: '/dashboard/manajemen-pengguna', icon: <FaUsers />, text: 'Manajemen Pengguna' },
        { path: '/dashboard/laporan-kinerja', icon: <FaClipboardList />, text: 'Laporan Kinerja' },
    ]
};


const Sidebar = ({ userRole }) => {
    // Ambil menu sesuai peran, jika tidak ada, gunakan array kosong
    const menuItems = menuConfig[userRole] || []; 

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
                        // Tambahkan 'end' untuk NavLink ke path root dasbor
                        end={item.path === '/dashboard'}
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
