// frontend/src/components/layout/Footer.js

import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';

const Footer = () => {
  // Data ini nantinya akan diambil dari API
  const footerData = {
    about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse gravida dignissim mauris, eu faucibus ipsum aliquam id. Proin vulputate pellentesque lorem. Phasellus nec ligula tempus.",
    address: "Jalan Padang Savana, Lampung",
    phone: "(+62) 858-8888-8888",
    email: "email@email.com"
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section logo-section">
          <img src={logo} alt="Logo Yayasan" className="footer-logo" />
        </div>
        <div className="footer-section about-section">
          <h4>About Us</h4>
          <p>{footerData.about}</p>
        </div>
        <div className="footer-section contact-section">
          <h4>Lokasi</h4>
          <p>{footerData.address}</p>
          <h4>Kontak</h4>
          <p>Phone: {footerData.phone}</p>
          <p>Email: {footerData.email}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Yayasan Baitul Muslim. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;