import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [instagramPhotos, setInstagramPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  // Preload frames for buttery smooth playback on scroll
  useEffect(() => {
    for (let i = 1; i <= 240; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/images/ezgif-frames/ezgif-frame-${frameNum}.jpg`;
    }
  }, []);

  // Handle scroll progress mapping to frames
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const scrollTop = -rect.top;
      const totalScrollHeight = rect.height - window.innerHeight;

      if (totalScrollHeight <= 0) return;

      const progress = Math.min(1, Math.max(0, scrollTop / totalScrollHeight));
      setScrollProgress(progress);

      const frameIndex = Math.min(240, Math.max(1, Math.round(progress * 239) + 1));
      setCurrentFrame(frameIndex);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Fetch featured products and Instagram photos
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/products'),
      fetch('http://localhost:5000/api/instagram')
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
      {/* Scroll-controlled Sequence Hero Section */}
      <div ref={scrollContainerRef} style={{ height: '220vh', position: 'relative' }}>
        <div style={{
          position: 'sticky',
          top: '0px',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--dark-choco)'
        }}>
          {/* Active Frame Background (Vibrant & Full Screen) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <img
              src={`/images/ezgif-frames/ezgif-frame-${String(currentFrame).padStart(3, '0')}.jpg`}
              alt="Artisan Chocolate Experience"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Premium Scroll Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'white',
            opacity: Math.max(0, 1 - scrollProgress * 15),
            transition: 'opacity 0.15s ease-out',
            pointerEvents: 'none'
          }}>
            <span style={{ 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              color: 'var(--luxury-gold)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
            }}>
              Scroll to Melt
            </span>
            <div className="scroll-mouse" style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.4)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="scroll-wheel"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Static Hero Section (appears after scroll sequence completion) */}
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
                  href={photo.link || 'https://www.instagram.com/pallom369?igsh=eXcwZTdqejFlcnVm'}
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
                href="https://www.instagram.com/pallom369?igsh=eXcwZTdqejFlcnVm"
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
