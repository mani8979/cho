import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Boxes, PlusCircle, Star, Camera, LogOut, Upload, Trash2, Edit2, Check, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab management
  const [activeTab, setActiveTab] = useState('overview');

  // Overview stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalReviews: 0,
    pendingReviews: 0
  });

  // Data arrays
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [instagramPhotos, setInstagramPhotos] = useState([]);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDisplayOrder, setCatDisplayOrder] = useState('0');
  const [catMinOrder, setCatMinOrder] = useState('0');
  const [catMaxOrder, setCatMaxOrder] = useState('0');
  const [catImage, setCatImage] = useState('');
  const [uploadingCatImg, setUploadingCatImg] = useState(false);

  // Product Form State (Add / Edit)
  const [editingProductId, setEditingProductId] = useState(null); // null means adding
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMrp, setProdMrp] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodGallery, setProdGallery] = useState([]);
  const [prodDesc, setProdDesc] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodWeight, setProdWeight] = useState('');
  const [prodLength, setProdLength] = useState('10');
  const [prodBreadth, setProdBreadth] = useState('10');
  const [prodHeight, setProdHeight] = useState('5');
  const [prodStock, setProdStock] = useState('0');
  const [prodRating, setProdRating] = useState('5.0');
  const [uploadingProdImg, setUploadingProdImg] = useState(false);
  const [uploadingGalleryImg, setUploadingGalleryImg] = useState(false);

  // Instagram Form State
  const [instaPath, setInstaPath] = useState('');
  const [instaLink, setInstaLink] = useState('');
  const [uploadingInstaImg, setUploadingInstaImg] = useState(false);

  // Review Form State
  const [reviewProdId, setReviewProdId] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [uploadingReviewImg, setUploadingReviewImg] = useState(false);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setUsername('');
        setPassword('');
      } else {
        setAuthError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Connection error');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    navigate('/admin/login');
  };

  // Fetch admin stats & tables data
  const fetchData = async () => {
    if (!token) return;
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // Stats
      const resStats = await fetch(`${API_BASE_URL}/api/orders/stats`, { headers });
      if (resStats.status === 401) {
        handleLogout();
        return;
      }
      const dataStats = await resStats.json();
      setStats(dataStats);

      // Categories
      const resCats = await fetch(`${API_BASE_URL}/api/categories`);
      const dataCats = await resCats.json();
      setCategories(dataCats);

      // Products
      const resProds = await fetch(`${API_BASE_URL}/api/products`);
      const dataProds = await resProds.json();
      setProducts(dataProds);

      // Reviews
      const resRevs = await fetch(`${API_BASE_URL}/api/reviews`, { headers });
      const dataRevs = await resRevs.json();
      setReviews(dataRevs);

      // Instagram
      const resInsta = await fetch(`${API_BASE_URL}/api/instagram`);
      const dataInsta = await resInsta.json();
      setInstagramPhotos(dataInsta);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  // Image Upload helper
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      return data.url;
    }
    throw new Error(data.message || 'Cloudinary upload failed');
  };

  // Add Category Handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: catName,
          displayOrder: Number(catDisplayOrder),
          minOrder: Number(catMinOrder),
          maxOrder: Number(catMaxOrder),
          image: catImage
        })
      });

      if (res.ok) {
        setCatName('');
        setCatDisplayOrder('0');
        setCatMinOrder('0');
        setCatMaxOrder('0');
        setCatImage('');
        fetchData();
        alert('Category added successfully!');
      } else {
        alert('Failed to add category');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Product Handler (Add & Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodCat) {
      alert('Please fill in required fields (Name, Price, Category)');
      return;
    }

    const payload = {
      name: prodName,
      price: Number(prodPrice),
      mrp: prodMrp ? Number(prodMrp) : undefined,
      image: prodImage,
      galleryImages: prodGallery,
      description: prodDesc,
      category: prodCat,
      weight: prodWeight,
      length: Number(prodLength),
      breadth: Number(prodBreadth),
      height: Number(prodHeight),
      stockQuantity: Number(prodStock),
      adminRating: Number(prodRating)
    };

    const url = editingProductId
      ? `${API_BASE_URL}/api/products/${editingProductId}`
      : `${API_BASE_URL}/api/products`;
    
    const method = editingProductId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        resetProductForm();
        fetchData();
        alert(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice('');
    setProdMrp('');
    setProdImage('');
    setProdGallery([]);
    setProdDesc('');
    setProdCat('');
    setProdWeight('');
    setProdLength('10');
    setProdBreadth('10');
    setProdHeight('5');
    setProdStock('0');
    setProdRating('5.0');
  };

  const startEditProduct = (p) => {
    setEditingProductId(p._id);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdMrp(p.mrp || '');
    setProdImage(p.image);
    setProdGallery(p.galleryImages || []);
    setProdDesc(p.description || '');
    setProdCat(p.category);
    setProdWeight(p.weight || '');
    setProdLength(p.length || '10');
    setProdBreadth(p.breadth || '10');
    setProdHeight(p.height || '5');
    setProdStock(p.stockQuantity || '0');
    setProdRating(p.adminRating || '5.0');
    setActiveTab('products-form');
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Review Status Handler (Approve / Reject)
  const handleReviewStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Review Handler
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Instagram Photo Handler
  const handleAddInstagram = async (e) => {
    e.preventDefault();
    if (!instaPath) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imagePath: instaPath,
          link: instaLink
        })
      });

      if (res.ok) {
        setInstaPath('');
        setInstaLink('');
        fetchData();
        alert('Instagram photo added successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Instagram Photo Handler
  const handleDeleteInstagram = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/instagram/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Review Images Upload (Admin)
  const handleReviewImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingReviewImg(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadImageToCloudinary(file);
        urls.push(url);
      }
      setReviewImages(prev => [...prev, ...urls]);
    } catch (err) {
      console.error(err);
      alert('Error uploading review images: ' + err.message);
    } finally {
      setUploadingReviewImg(false);
    }
  };

  // Add Official Admin Review Handler
  const handleAddAdminReview = async (e) => {
    e.preventDefault();
    if (!reviewProdId || !reviewName || !reviewComment) {
      alert('Please fill in all required fields (Product, Reviewer Name, Message)');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product: reviewProdId,
          userName: reviewName,
          rating: Number(reviewRating),
          comment: reviewComment,
          reviewImages: reviewImages
        })
      });

      if (res.ok) {
        setReviewProdId('');
        setReviewName('');
        setReviewRating(5);
        setReviewComment('');
        setReviewImages([]);
        fetchData();
        alert('Review added successfully!');
      } else {
        const data = await res.json();
        alert('Failed to add review: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error adding review: ' + err.message);
    }
  };

  // If not logged in, show Login Screen
  if (!token) {
    return (
      <section className="section bg-products" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '450px' }}>
          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img src="/images/love_melt_logo.jpg" alt="Logo" style={{ height: '60px', borderRadius: '10px', marginBottom: '15px' }} />
              <h2>LOVE MELT Admin</h2>
              <p style={{ color: 'var(--text-muted)' }}>Enter credentials to manage your store</p>
            </div>

            {authError && (
              <div style={{ background: 'rgba(216, 79, 92, 0.1)', color: '#d84f5c', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-products" style={{ minHeight: '90vh' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem' }}>Store Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Control panel for categories, products, and reviews</p>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="admin-container">
          {/* Sidebar Menu */}
          <aside className="admin-sidebar-menu">
            <button className={`admin-sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Overview
            </button>
            <button className={`admin-sidebar-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
              <List size={18} /> Categories
            </button>
            <button className={`admin-sidebar-link ${activeTab.startsWith('products') ? 'active' : ''}`} onClick={() => { setActiveTab('products-list'); resetProductForm(); }}>
              <Boxes size={18} /> Products
            </button>
            <button className={`admin-sidebar-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              <Star size={18} /> Reviews {stats.pendingReviews > 0 && <span style={{ background: '#d84f5c', color: 'white', fontSize: '10px', borderRadius: '50%', padding: '2px 6px', marginLeft: '5px' }}>{stats.pendingReviews}</span>}
            </button>
            <button className={`admin-sidebar-link ${activeTab === 'instagram' ? 'active' : ''}`} onClick={() => setActiveTab('instagram')}>
              <Camera size={18} /> Instagram Feed
            </button>
          </aside>

          {/* Main Panel Content */}
          <main className="admin-main-panel">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fade-up">
                <div className="admin-stats-row">
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">Live Products</div>
                    <div className="admin-stat-value">{stats.totalProducts}</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">Categories</div>
                    <div className="admin-stat-value">{stats.totalCategories}</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">Inquiries Received</div>
                    <div className="admin-stat-value">{stats.totalOrders}</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">Reviews Moderated</div>
                    <div className="admin-stat-value">{stats.totalReviews}</div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '30px' }}>
                  <h3>Recent Store Activity</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Use the sidebar links to manage products, categories, reviews, and social images uploaded to Cloudinary.</p>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="admin-grid animate-fade-up">
                {/* List Categories */}
                <div className="glass-card">
                  <h3 style={{ marginBottom: '20px' }}>Available Categories</h3>
                  {categories.length > 0 ? (
                    <div className="table-responsive">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Image</th>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Order</th>
                            <th style={{ padding: '12px' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat) => (
                            <tr key={cat._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '12px' }}>
                                <img src={cat.image || 'https://placehold.co/50x50?text=Cat'} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                              </td>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{cat.name}</td>
                              <td style={{ padding: '12px' }}>{cat.displayOrder}</td>
                              <td style={{ padding: '12px' }}>
                                <button onClick={() => handleDeleteCategory(cat._id)} style={{ background: 'transparent', border: 'none', color: '#d84f5c', cursor: 'pointer' }}>
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No categories found.</p>
                  )}
                </div>

                {/* Add Category Form */}
                <div className="glass-card" style={{ height: 'fit-content' }}>
                  <h3 style={{ marginBottom: '20px' }}>Add Category</h3>
                  <form onSubmit={handleAddCategory}>
                    <div className="form-group">
                      <label>Category Name *</label>
                      <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} required placeholder="e.g. Whole Spices" />
                    </div>
                    <div className="form-group">
                      <label>Display Order</label>
                      <input type="number" value={catDisplayOrder} onChange={(e) => setCatDisplayOrder(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Min Order</label>
                      <input type="number" value={catMinOrder} onChange={(e) => setCatMinOrder(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Max Order</label>
                      <input type="number" value={catMaxOrder} onChange={(e) => setCatMaxOrder(e.target.value)} />
                    </div>
                    
                    {/* Cloudinary Category Image upload */}
                    <div className="form-group">
                      <label>Category Image</label>
                      <div className="file-upload-wrap">
                        <label htmlFor="cat-img" className="file-upload-btn-label">
                          <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          {uploadingCatImg ? 'Uploading...' : catImage ? 'Uploaded to Cloudinary' : 'Choose Photo'}
                        </label>
                        <input
                          type="file"
                          id="cat-img"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploadingCatImg(true);
                            try {
                              const url = await uploadImageToCloudinary(file);
                              setCatImage(url);
                            } catch (err) {
                              alert(err.message);
                            } finally {
                              setUploadingCatImg(false);
                            }
                          }}
                          accept="image/*"
                        />
                      </div>
                      {catImage && <img src={catImage} alt="preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} />}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                      Add Category
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Products List Tab */}
            {activeTab === 'products-list' && (
              <div className="glass-card animate-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <h3>Products List</h3>
                  <button className="btn btn-premium" onClick={() => setActiveTab('products-form')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={16} /> Add Product
                  </button>
                </div>
                
                {products.length > 0 ? (
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                          <th style={{ padding: '12px' }}>Image</th>
                          <th style={{ padding: '12px' }}>Name</th>
                          <th style={{ padding: '12px' }}>Category</th>
                          <th style={{ padding: '12px' }}>Price</th>
                          <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '12px' }}>
                              <img src={p.image.startsWith('http') ? p.image : `/${p.image}`} alt={p.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} onError={(e)=>{e.target.src="https://placehold.co/50x50?text=Spices"}} />
                            </td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                            <td style={{ padding: '12px', color: 'var(--luxury-gold)', fontWeight: 500 }}>{p.category}</td>
                            <td style={{ padding: '12px', fontWeight: 700 }}>₹{p.price.toFixed(2)}</td>
                            <td style={{ padding: '12px', display: 'flex', gap: '15px' }}>
                              <button onClick={() => startEditProduct(p)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-choco)', cursor: 'pointer' }}>
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'transparent', border: 'none', color: '#d84f5c', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            )}

            {/* Products Form Tab (Add / Edit) */}
            {activeTab === 'products-form' && (
              <div className="glass-card animate-fade-up">
                <h3 style={{ marginBottom: '25px' }}>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                
                <form onSubmit={handleSaveProduct}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select value={prodCat} onChange={(e) => setProdCat(e.target.value)} required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input type="number" step="0.01" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>MRP (₹)</label>
                      <input type="number" step="0.01" value={prodMrp} onChange={(e) => setProdMrp(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Weight (e.g. 1kg, 500ml)</label>
                      <input type="text" value={prodWeight} onChange={(e) => setProdWeight(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
                    </div>
                    
                    {/* Dimensions */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Dimensions (Length x Breadth x Height cm)</label>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <input type="number" placeholder="Length" value={prodLength} onChange={(e) => setProdLength(e.target.value)} />
                        <input type="number" placeholder="Breadth" value={prodBreadth} onChange={(e) => setProdBreadth(e.target.value)} />
                        <input type="number" placeholder="Height" value={prodHeight} onChange={(e) => setProdHeight(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Admin Rating (1.0 to 5.0)</label>
                      <input type="number" step="0.1" min="1" max="5" value={prodRating} onChange={(e) => setProdRating(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Description</label>
                      <textarea rows="4" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)}></textarea>
                    </div>

                    {/* Primary Image Cloudinary Upload */}
                    <div className="form-group">
                      <label>Primary Image *</label>
                      <div className="file-upload-wrap">
                        <label htmlFor="prod-img" className="file-upload-btn-label">
                          <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          {uploadingProdImg ? 'Uploading...' : prodImage ? 'Primary Image Uploaded' : 'Choose Photo'}
                        </label>
                        <input
                          type="file"
                          id="prod-img"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploadingProdImg(true);
                            try {
                              const url = await uploadImageToCloudinary(file);
                              setProdImage(url);
                            } catch (err) {
                              alert(err.message);
                            } finally {
                              setUploadingProdImg(false);
                            }
                          }}
                          accept="image/*"
                        />
                      </div>
                      {prodImage && <img src={prodImage.startsWith('http') ? prodImage : `/${prodImage}`} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} />}
                    </div>

                    {/* Gallery Images Cloudinary Upload */}
                    <div className="form-group">
                      <label>Gallery Images (Max 4)</label>
                      <div className="file-upload-wrap">
                        <label htmlFor="gallery-imgs" className="file-upload-btn-label">
                          <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          {uploadingGalleryImg ? 'Uploading...' : 'Choose Photos'}
                        </label>
                        <input
                          type="file"
                          id="gallery-imgs"
                          style={{ display: 'none' }}
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            if (files.length === 0) return;
                            setUploadingGalleryImg(true);
                            try {
                              const urls = [];
                              for (const file of files) {
                                const url = await uploadImageToCloudinary(file);
                                urls.push(url);
                              }
                              setProdGallery(prev => [...prev, ...urls].slice(0, 4));
                            } catch (err) {
                              alert(err.message);
                            } finally {
                              setUploadingGalleryImg(false);
                            }
                          }}
                          accept="image/*"
                        />
                      </div>
                      {prodGallery.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          {prodGallery.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img src={url.startsWith('http') ? url : `/${url}`} alt="gallery preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                              <button
                                type="button"
                                onClick={() => setProdGallery(prev => prev.filter((_, i) => i !== idx))}
                                style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#d84f5c', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer' }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                      {editingProductId ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('products-list')}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="admin-grid animate-fade-up">
                {/* Write a Review (Admin) */}
                <div className="glass-card">
                  <h3 style={{ marginBottom: '10px' }}>Write a Review</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Add a customer review directly to a product.</p>

                  <form onSubmit={handleAddAdminReview}>
                    <div className="form-group">
                      <label>Select Product *</label>
                      <select value={reviewProdId} onChange={(e) => setReviewProdId(e.target.value)} required>
                        <option value="">-- Select Product --</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Reviewer Name *</label>
                      <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} required placeholder="Anonymous or customer name" />
                    </div>

                    <div className="form-group">
                      <label>Rating *</label>
                      <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                        <option value="5">5 Stars (Excellent)</option>
                        <option value="4">4 Stars (Very Good)</option>
                        <option value="3">3 Stars (Average)</option>
                        <option value="2">2 Stars (Poor)</option>
                        <option value="1">1 Star (Very Poor)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Message *</label>
                      <textarea rows="4" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required placeholder="Write the feedback here..." />
                    </div>

                    {/* Image uploads */}
                    <div className="form-group">
                      <label>Review Photos (Max 3)</label>
                      <div className="file-upload-wrap">
                        <label htmlFor="review-photos" className="file-upload-btn-label">
                          <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          {uploadingReviewImg ? 'Uploading...' : 'Add Photos'}
                        </label>
                        <input
                          type="file"
                          id="review-photos"
                          style={{ display: 'none' }}
                          multiple
                          onChange={handleReviewImagesUpload}
                          accept="image/*"
                          disabled={reviewImages.length >= 3}
                        />
                        {reviewImages.length > 0 && (
                          <div className="review-images" style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                            {reviewImages.map((imgUrl, i) => (
                              <div key={i} style={{ position: 'relative' }}>
                                <img src={imgUrl} alt="uploaded" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                <button
                                  type="button"
                                  onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                                  style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#d84f5c', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }}>
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Moderation List */}
                <div className="glass-card">
                  <h3 style={{ marginBottom: '10px' }}>Customer Reviews Moderation</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Approve or reject customer review comments before they go live on details page.</p>

                  {reviews.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {reviews.map((rev) => (
                        <div key={rev._id} style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--soft-vanilla)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{rev.userName}</span>
                              <span style={{ marginLeft: '10px', fontSize: '0.8rem', background: rev.status === 'approved' ? '#2ecc71' : rev.status === 'rejected' ? '#e74c3c' : '#f39c12', color: 'white', padding: '2px 8px', borderRadius: '50px', fontWeight: 600, textTransform: 'uppercase' }}>
                                {rev.status}
                              </span>
                              <div style={{ color: 'var(--luxury-gold)', display: 'flex', gap: '2px', marginTop: '5px' }}>
                                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                              {rev.status !== 'approved' && (
                                <button onClick={() => handleReviewStatus(rev._id, 'approved')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#2ecc71' }}>
                                  <Check size={14} /> Approve
                                </button>
                              )}
                              {rev.status !== 'rejected' && (
                                <button onClick={() => handleReviewStatus(rev._id, 'rejected')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#e74c3c', borderColor: '#e74c3c' }}>
                                  <X size={14} /> Reject
                                </button>
                              )}
                              <button onClick={() => handleDeleteReview(rev._id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#d84f5c', borderColor: '#d84f5c' }}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>

                          <div style={{ marginTop: '15px' }}>
                            <p style={{ fontWeight: 500 }}>Product: <span style={{ color: 'var(--luxury-gold)' }}>{rev.product?.name || 'Unknown Product'}</span></p>
                            <p style={{ fontStyle: 'italic', marginTop: '5px' }}>"{rev.comment}"</p>
                          </div>

                          {rev.reviewImages && rev.reviewImages.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                              {rev.reviewImages.map((img, idx) => (
                                <img key={idx} src={img} alt="review" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews submitted yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Instagram Tab */}
            {activeTab === 'instagram' && (
              <div className="admin-grid animate-fade-up">
                
                {/* List Photos */}
                <div className="glass-card">
                  <h3 style={{ marginBottom: '20px' }}>Instagram Gallery Images</h3>
                  {instagramPhotos.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                      {instagramPhotos.map((photo) => (
                        <div key={photo._id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1' }}>
                          <img src={photo.imagePath.startsWith('http') ? photo.imagePath : `/${photo.imagePath}`} alt="Instagram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>{e.target.src="https://placehold.co/150x150?text=Insta"}} />
                          <button
                            onClick={() => handleDeleteInstagram(photo._id)}
                            style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(216, 79, 92, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No Instagram images loaded.</p>
                  )}
                </div>

                {/* Add Photo Form */}
                <div className="glass-card" style={{ height: 'fit-content' }}>
                  <h3 style={{ marginBottom: '20px' }}>Add Instagram Photo</h3>
                  <form onSubmit={handleAddInstagram}>
                    
                    {/* Cloudinary Instagram image upload */}
                    <div className="form-group">
                      <label>Photo *</label>
                      <div className="file-upload-wrap">
                        <label htmlFor="insta-img" className="file-upload-btn-label">
                          <Upload size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                          {uploadingInstaImg ? 'Uploading...' : instaPath ? 'Image Uploaded' : 'Choose Photo'}
                        </label>
                        <input
                          type="file"
                          id="insta-img"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploadingInstaImg(true);
                            try {
                              const url = await uploadImageToCloudinary(file);
                              setInstaPath(url);
                            } catch (err) {
                              alert(err.message);
                            } finally {
                              setUploadingInstaImg(false);
                            }
                          }}
                          accept="image/*"
                          required={!instaPath}
                        />
                      </div>
                      {instaPath && <img src={instaPath} alt="preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} />}
                    </div>

                    <div className="form-group">
                      <label>Instagram Link (Optional)</label>
                      <input type="text" value={instaLink} onChange={(e) => setInstaLink(e.target.value)} placeholder="https://instagram.com/p/..." />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={!instaPath || uploadingInstaImg}>
                      Upload Photo
                    </button>
                  </form>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </section>
  );
}
