import React from 'react';
import { PhoneCall, Mail } from 'lucide-react';

export default function B2B() {
  return (
    <main style={{ background: '#001226', color: '#fdfbf7', minHeight: '90vh', padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background radial glows */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)', top: '-150px', right: '-150px', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)', bottom: '-200px', left: '-150px', pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
        
        <span className="detail-badge" style={{ background: 'rgba(212, 175, 55, 0.1)', borderColor: 'var(--luxury-gold)', color: 'var(--luxury-gold)' }}>
          Premium B2B Sourcing
        </span>
        
        <h1 style={{ color: 'var(--luxury-gold)', fontSize: 'clamp(2.8rem, 8vw, 4.8rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '-1px' }}>
          Love Melt
        </h1>
        
        <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: 'white', fontWeight: 300, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '50px' }}>
          The Art of Melting Hearts
        </p>

        {/* Chocolates Visual Circular Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '800px', margin: '0 auto 60px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(212, 175, 55, 0.3)', margin: '0 auto 15px', background: '#f4efeb' }}>
              <img src="https://images.unsplash.com/photo-1548907040-4d42b52125bf?auto=format&fit=crop&w=600&q=80" alt="Gourmet Truffles" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ color: 'white', fontSize: '1.25rem' }}>Gourmet Truffles</h4>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(212, 175, 55, 0.3)', margin: '0 auto 15px', background: '#f4efeb' }}>
              <img src="https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&w=600&q=80" alt="Artisan Chocolate Bars" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ color: 'white', fontSize: '1.25rem' }}>Artisan Bars</h4>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(212, 175, 55, 0.3)', margin: '0 auto 15px', background: '#f4efeb' }}>
              <img src="https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80" alt="Luxury Gift Assortments" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ color: 'white', fontSize: '1.25rem' }}>Luxury Gift Boxes</h4>
          </div>
        </div>

        {/* Content Block */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'rgba(253, 251, 247, 0.85)', marginBottom: '50px' }}>
            We supply premium, handcrafted chocolates, Belgian truffles, and gourmet gift assortments. Specializing in luxury corporate gifting, custom brand events, and cafe distributions. We source the finest single-origin cacao to guarantee unparalleled taste and texture.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '20px', padding: '30px', margin: '0 auto 50px', maxWidth: '650px', textAlign: 'left', borderLeft: '5px solid var(--luxury-gold)' }}>
            <h3 style={{ color: 'var(--luxury-gold)', fontSize: '1.4rem', marginBottom: '10px' }}>Our B2B Promise</h3>
            <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'white' }}>
              "Exceptional cacao sourcing, custom batch flexibility, premium packaging, and elite corporate partnership rates."
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <a
              href="https://wa.me/919063454241?text=Hi, I'm interested in wholesale rates for Love Melt premium chocolates."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-premium"
              style={{ padding: '16px 40px', borderRadius: '50px' }}
            >
              <PhoneCall size={18} /> Contact for Wholesale Rates
            </a>
            <div style={{ fontSize: '1.1rem', color: 'var(--luxury-gold)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} /> rajukpta@gmail.com
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
