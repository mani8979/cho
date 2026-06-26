import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [instagramPhotos, setInstagramPhotos] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch featured products and Instagram photos
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/products`),
      fetch(`${API_BASE_URL}/api/instagram`)
    ])
      .then(([resProd, resInsta]) => Promise.all([resProd.json(), resInsta.json()]))
      .then(([prodData, instaData]) => {
        setProducts(prodData.slice(0, 8)); // Display 8 featured products
        setInstagramPhotos(instaData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-radial-glow"></div>
        {/* Centered stylized +91 background number */}
        <div className="hero-phone-bg">91</div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Artisan Crafted</div>
            <h1 className="hero-title">
              Every Bite <br />
              <span>Feels Like Love</span>
            </h1>
            <p className="hero-desc">
              Discover the gold standard of premium artisan chocolates handcrafted with love. Premium cocoa truffles, velvety chocolate bars, and customized gift assortments designed to melt your heart.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-premium">
                Shop the Collection <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section">
        <div className="container">
          <div className="home-section-title">
            <p>Signature Collections</p>
            <h2>Customer Favorites</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="chocolate-loader" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => {
                const isSaved = product.mrp > product.price;
                const discount = isSaved ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
                
                return (
                  <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                    <div className="card-img-wrap">
                      {isSaved && <span className="card-badge">Save {discount}%</span>}
                      <img
                        src={product.image.startsWith('http') ? product.image : `/${product.image}`}
                        alt={product.name}
                        className="card-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/300x300?text=Premium+Chocolates";
                        }}
                      />
                    </div>
                    <div className="card-details">
                      <h3 className="card-title">{product.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--luxury-gold)', gap: '2px', marginBottom: '12px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(product.adminRating) ? "currentColor" : "none"} />
                        ))}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({product.adminRating})</span>
                      </div>
                      <div className="card-price-row">
                        <span className="card-price">₹{product.price.toFixed(2)}</span>
                        {isSaved && <span className="card-mrp">₹{product.mrp.toFixed(2)}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</p>
          )}
        </div>
      </section>



      {/* Instagram Feed Section */}
      {instagramPhotos.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="home-section-title">
              <p>Follow Our Journey</p>
              <h2>Instagram Gallery</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {instagramPhotos.map((photo) => (
                <a
                  href={photo.link || 'https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2'}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={photo._id}
                  style={{ display: 'block', borderRadius: '15px', overflow: 'hidden', aspectRatio: '1/1', position: 'relative' }}
                >
                  <img
                    src={photo.imagePath.startsWith('http') ? photo.imagePath : `/${photo.imagePath}`}
                    alt="Instagram Post"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x300?text=Instagram+Feed";
                    }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '15px', color: 'white' }}>
                    <span>📸</span>
                  </div>
                </a>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <a
                href="https://www.instagram.com/love.melt_91?utm_source=qr&igsh=Nzg0bnNyN3MweXh2"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ borderRadius: '50px', padding: '12px 35px', borderColor: 'var(--luxury-gold)', color: 'var(--primary-choco)' }}
              >
                View on Instagram
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
