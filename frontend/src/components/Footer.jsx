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
            <a href="https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
              Instagram
            </a>
            <a href="https://wa.me/919063454241" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
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
              <span>+91 90634 54241</span>
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
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Developed by <strong style={{ color: 'white' }}>Kalla Manibabu</strong></span>
          <a 
            href="https://wa.me/919581108448" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '5px', 
              color: 'var(--luxury-gold)', 
              fontWeight: 500 
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ verticalAlign: 'middle' }}>
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.13-1.343a9.921 9.921 0 004.877 1.28c5.508 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.912 9.912 0 0012.012 2zm5.781 14.282c-.25.705-1.464 1.34-2.006 1.425-.494.077-1.13.136-3.284-.753-2.753-1.137-4.502-3.93-4.64-4.113-.138-.182-1.12-1.488-1.12-2.84 0-1.35.704-2.013.955-2.274.25-.262.545-.327.728-.327.182 0 .363.002.522.01.168.01.394-.064.618.476.223.54.764 1.86.83 1.992.066.132.11.285.022.464-.088.178-.132.29-.263.443-.132.152-.276.339-.395.454-.131.129-.268.27-.116.53.152.261.677 1.114 1.454 1.808.997.893 1.834 1.17 2.1 1.3.264.13.417.11.572-.07.155-.178.66-.767.836-1.026.177-.258.354-.216.598-.126.244.09 1.55.73 1.815.86.265.132.442.197.508.31.066.113.066.657-.184 1.362z" />
            </svg>
            +91 9581108448
          </a>
        </p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Shield size={12} /> Crafted for Chocolate Luxury
        </p>
      </div>
    </footer>
  );
}
