import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#24120b', color: '#fdfbf7', padding: '60px 0 20px', borderTop: '2px solid var(--luxury-gold)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        {/* Brand Block */}
        <div>
          <h3 style={{ color: 'var(--luxury-gold)', fontSize: '1.6rem', marginBottom: '15px' }}>LOVE MELT</h3>
          <p style={{ color: 'rgba(253, 251, 247, 0.75)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
            Experience the gold standard of premium artisan chocolates handcrafted with love.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="https://instagram.com/pallom369?igsh=eXcwZTdqejFlcnVm" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
              Instagram
            </a>
            <a href="https://wa.me/919581108448" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/" style={{ color: 'rgba(253,251,247,0.8)' }}>Home</Link></li>
            <li><Link to="/shop" style={{ color: 'rgba(253,251,247,0.8)' }}>All Collections</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Get in Touch</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', color: 'rgba(253,251,247,0.8)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} style={{ color: 'var(--luxury-gold)' }} />
              <span>+91 95811 08448</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} style={{ color: 'var(--luxury-gold)' }} />
              <span>Visakhapatnam, Andhra Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', fontSize: '0.85rem', color: 'rgba(253,251,247,0.5)' }}>
        <p>&copy; {new Date().getFullYear()} Love Melt Chocolates. All Rights Reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Shield size={12} /> Crafted for Chocolate Luxury
        </p>
      </div>
    </footer>
  );
}
