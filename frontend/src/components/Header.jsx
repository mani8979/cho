import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, PhoneCall } from 'lucide-react';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Fetch categories for menu
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetch(`http://localhost:5000/api/products/search-suggestions?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(err => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (item.type === 'product') {
      navigate(`/product/${item.id}`);
    } else {
      navigate(`/shop?category=${encodeURIComponent(item.text)}`);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const currentPath = location.pathname;
  const [scrolledPastIntro, setScrolledPastIntro] = useState(currentPath !== '/');

  useEffect(() => {
    if (currentPath !== '/') {
      setScrolledPastIntro(true);
      return;
    }

    const handleScroll = () => {
      // 1.1 * window.innerHeight is the threshold where the sequence is finished
      const threshold = window.innerHeight * 1.1;
      setScrolledPastIntro(window.scrollY >= threshold);
    };

    handleScroll(); // Run immediately on mount or path change
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentPath]);

  return (
    <>
      <header 
        className="header-container"
        style={{
          transform: scrolledPastIntro ? 'translateY(0)' : 'translateY(-100%)',
          opacity: scrolledPastIntro ? 1 : 0,
          transition: 'transform 0.4s ease, opacity 0.4s ease',
          pointerEvents: scrolledPastIntro ? 'auto' : 'none'
        }}
      >
        <div className="container header-inner">
          
          {/* Logo */}
          <Link to="/" className="logo-wrap" onClick={() => setDrawerOpen(false)}>
            <img src="/images/love_melt_logo.jpg" alt="Love Melt Logo" className="logo-img" onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/100x100?text=LOVE+MELT";
            }} />
            <h1 className="brand-title">LOVE <span>MELT</span></h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-menu">
            <Link to="/" className={`nav-link-item ${currentPath === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/shop" className={`nav-link-item ${currentPath === '/shop' ? 'active' : ''}`}>Shop</Link>
            
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="search-bar-wrap" ref={suggestionsRef}>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="search-btn">
                <Search size={18} />
              </button>

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-box">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="suggestion-row"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item.image ? (
                        <img src={item.image.startsWith('http') ? item.image : `/${item.image}`} className="suggestion-img" alt="" />
                      ) : (
                        <span className="suggestion-icon">🏷️</span>
                      )}
                      <div className="suggestion-details">
                        <span className="suggestion-name">{item.text}</span>
                        <span className="suggestion-type">{item.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </nav>

          {/* Hamburger Menu Mobile */}
          <button className="hamburger" onClick={() => setDrawerOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`drawer-overlay ${drawerOpen ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}></div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <Link to="/" className="logo-wrap" onClick={() => setDrawerOpen(false)}>
            <img src="/images/love_melt_logo.jpg" alt="Love Melt Logo" className="logo-img" style={{ height: '40px' }} />
            <span className="brand-title" style={{ fontSize: '1.2rem' }}>LOVE MELT</span>
          </Link>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
            <X size={28} />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search collection..."
            className="search-input"
            style={{ width: '100%', paddingRight: '40px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" style={{ right: '15px' }}>
            <Search size={18} />
          </button>
        </form>

        <div className="drawer-links">
          <Link to="/" className={`drawer-link-item ${currentPath === '/' ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>Home</Link>
          <Link to="/shop" className={`drawer-link-item ${currentPath === '/shop' ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>Shop All</Link>
          
          <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="drawer-link-item"
              style={{ fontSize: '0.95rem', color: 'var(--luxury-gold)' }}
              onClick={() => setDrawerOpen(false)}
            >
              🍫 {cat.name}
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <a
            href="https://wa.me/919581108448"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-premium"
            style={{ width: '100%', padding: '12px' }}
          >
            <PhoneCall size={18} /> Chat with Us
          </a>
        </div>
      </div>
      
      {/* Spacer to push content below fixed header */}
      {currentPath !== '/' && <div style={{ height: '80px' }}></div>}
    </>
  );
}
