import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryFilter = searchParams.get('category') || '';
  const searchQ = searchParams.get('q') || '';

  // Fetch categories and products
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products';
    const params = [];
    if (categoryFilter) params.push(`category=${encodeURIComponent(categoryFilter)}`);
    if (searchQ) params.push(`q=${encodeURIComponent(searchQ)}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryFilter, searchQ]);

  const selectCategory = (categoryName) => {
    if (categoryName) {
      setSearchParams({ category: categoryName });
    } else {
      setSearchParams({});
    }
  };

  return (
    <section className="section bg-products" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        {/* Shop Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="detail-badge">Artisan Collections</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '10px', marginBottom: '5px' }}>
            {categoryFilter ? categoryFilter : searchQ ? `Search Results for "${searchQ}"` : 'Luxury Chocolate Catalog'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Sourced with love, selected with care.</p>
        </div>

        <div className="shop-layout">
          {/* Categories Sidebar */}
          <aside className="shop-sidebar">
            <div className="sidebar-sticky glass-card" style={{ padding: '25px' }}>
              <h3 className="sidebar-title">Collections</h3>
              <div className="category-filter-list">
                <button
                  className={`category-filter-btn ${!categoryFilter ? 'active' : ''}`}
                  onClick={() => selectCategory('')}
                >
                  All Collections <span>📦</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className={`category-filter-btn ${categoryFilter === cat.name ? 'active' : ''}`}
                    onClick={() => selectCategory(cat.name)}
                  >
                    {cat.name} <span>🍫</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Catalog Grid */}
          <div className="shop-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
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
              <div className="glass-card" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>🍫</span>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>No items found</h3>
                <p style={{ maxWidth: '400px', margin: '0 auto 25px' }}>We couldn't find any products matching your selection. Please search for another collection.</p>
                <button className="btn btn-premium" onClick={() => selectCategory('')}>View All Collections</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
