// frontend/src/components/layout/Navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Kita akan buat file CSS untuk styling
import logo from '../../assets/logo.png'; // Asumsikan Anda punya file logo.png di src/assets

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="logo-container">
          <NavLink to="/">
            <img src={logo} alt="Logo Yayasan" className="footer-logo" />
          </NavLink>
        </div>
        <nav className="nav-links">
          <NavLink to="/profil-yayasan" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Profil Yayasan
          </NavLink>
          <NavLink to="/pendidikan" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Pendidikan
          </NavLink>
          <NavLink to="/artikel" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Artikel
          </NavLink>
          <NavLink to="/galeri" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Galeri
          </NavLink>
          <NavLink to="/hubungi-kami" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Hubungi Kami
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;