import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Upload, Check, ChevronRight, MessageSquare, Plus, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [lightboxImg, setLightboxImg] = useState('');
  
  // Checkout form state
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch product details
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate('/shop');
      });

    // Fetch approved reviews
    fetch(`${API_BASE_URL}/api/reviews/product/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '150px 0' }}>
        <div className="chocolate-loader" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  // Handle Payment Screenshot Upload to Cloudinary
  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingScreenshot(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setPaymentScreenshot(data.url);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed. Try again.');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  // Submit Order via WhatsApp
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !customerAddress || !customerPincode) {
      alert('Please fill in all required fields.');
      return;
    }

    const orderData = {
      productName: product.name,
      productId: product._id,
      phone: customerPhone,
      price: product.price,
      quantity: quantity,
      address: customerAddress,
      pincode: customerPincode,
      email: customerEmail,
      paymentScreenshot: paymentScreenshot
    };

    try {
      // Save order in MongoDB
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const result = await res.json();

      if (result.success) {
        // Build WhatsApp text
        let msg = `🛒 *New Order — Love Melt*\n\n`;
        msg += `📦 *Product:* ${product.name}\n`;
        msg += `🔢 *Quantity:* ${quantity}\n`;
        msg += `💰 *Total Price:* ₹${(product.price * quantity).toFixed(2)}\n\n`;
        msg += `👤 *Customer Details:*\n`;
        msg += `• *Name:* ${customerName}\n`;
        msg += `• *Phone:* ${customerPhone}\n`;
        if (customerEmail) msg += `• *Email:* ${customerEmail}\n`;
        msg += `• *Address:* ${customerAddress}\n`;
        msg += `• *Pincode:* ${customerPincode}\n`;
        msg += `\n📎 *Note:* I will send the payment screenshot now.\nPlease confirm my order. 🙏`;

        const waUrl = `https://wa.me/919581108448?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
      } else {
        alert('Failed to place order in system.');
      }
    } catch (error) {
      console.error(error);
      alert('Error placing order.');
    }
  };



  const imagesList = [product.image, ...(product.galleryImages || [])].filter(Boolean);
  const isSaved = product.mrp > product.price;

  return (
    <section className="section bg-details">
      <div className="container">
        
        {/* Main Product Info grid */}
        <div className="detail-grid">
          {/* Gallery */}
          <div className="gallery-container">
            <div className="gallery-main-img-wrap" onClick={() => setLightboxImg(activeImage)} style={{ cursor: 'zoom-in' }}>
              <img
                src={activeImage.startsWith('http') ? activeImage : `/${activeImage}`}
                alt={product.name}
                className="gallery-main-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x600?text=Spices+Gallery";
                }}
              />
            </div>
            {imagesList.length > 1 && (
              <div className="gallery-thumbs">
                {imagesList.map((img, i) => (
                  <div
                    key={i}
                    className={`gallery-thumb-item ${activeImage === img ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img
                      src={img.startsWith('http') ? img : `/${img}`}
                      alt="thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100?text=Thumb";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Meta */}
          <div className="detail-info">
            <span className="detail-badge">Munnar Premium Sourced</span>
            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.adminRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                ({reviews.length} Customer Reviews)
              </span>
            </div>

            <div className="detail-price-box">
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="detail-price">₹{product.price.toFixed(2)}</span>
                {isSaved && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '15px', fontSize: '1.2rem' }}>
                    ₹{product.mrp.toFixed(2)}
                  </span>
                )}
                {isSaved && (
                  <span className="detail-save">
                    Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                  </span>
                )}
              </div>
              
              <div style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {product.weight && <span>⚖️ Weight: <strong>{product.weight}</strong></span>}
                {product.length && <span>📏 Size: <strong>{product.length}x{product.breadth}x{product.height} cm</strong></span>}
                {product.stockQuantity > 0 ? (
                  <span style={{ color: '#2ecc71', fontWeight: 600 }}>✅ In Stock ({product.stockQuantity} items)</span>
                ) : (
                  <span style={{ color: '#e74c3c', fontWeight: 600 }}>❌ Out of Stock</span>
                )}
              </div>
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Buy/Inquiry Button */}
            {!showInquiryForm && (
              <button className="btn btn-premium" onClick={() => setShowInquiryForm(true)} style={{ alignSelf: 'flex-start' }}>
                Buy on WhatsApp
              </button>
            )}

            {/* Inline WhatsApp Checkout Form */}
            {showInquiryForm && (
              <div className="inquiry-panel animate-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.4rem' }}>Quick Wholesale Inquiry</h3>
                  <button onClick={() => setShowInquiryForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={20} />
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Scan the QR below to pay, and send the payment screenshot along with your order on WhatsApp.</p>
                
                {/* QR Section */}
                <div className="qr-section">
                  <p className="qr-title">Scan & Pay</p>
                  <div className="qr-wrap">
                    <img src="/images/qr.jpeg" className="qr-img" alt="QR Code" onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/200x200?text=Payment+QR";
                    }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay total amount: <strong>₹{(product.price * quantity).toFixed(2)}</strong></p>
                </div>

                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Enter your full name" />
                  </div>
                  
                  <div className="form-group">
                    <label>WhatsApp Mobile *</label>
                    <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required maxLength="10" placeholder="10-digit mobile number" />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="your@email.com" />
                  </div>
                  
                  <div className="form-group">
                    <label>Delivery Address *</label>
                    <textarea rows="3" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required placeholder="House No, Street, City, State" />
                  </div>
                  
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" value={customerPincode} onChange={(e) => setCustomerPincode(e.target.value)} required maxLength="6" placeholder="6-digit pincode" />
                  </div>

                  <div className="form-group">
                    <label>Quantity *</label>
                    <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <button type="submit" className="btn btn-whatsapp" style={{ flexGrow: 1 }}>
                      Send Order via WhatsApp
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowInquiryForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '80px', borderTop: '1px solid var(--border-light)', paddingTop: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Customer Reviews</h2>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {reviews.length > 0 ? (
              <div>
                {reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    <div className="review-header">
                      <span className="review-user">
                        {rev.userName}
                        {rev.isAdmin && (
                          <span className="official-review-badge">★ Official Review</span>
                        )}
                      </span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">"{rev.comment}"</p>
                    {rev.reviewImages && rev.reviewImages.length > 0 && (
                      <div className="review-images">
                        {rev.reviewImages.map((imgUrl, idx) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt="review upload"
                            className="review-img-thumb"
                            onClick={() => setLightboxImg(imgUrl)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--soft-vanilla)', borderRadius: '15px', color: 'var(--text-muted)' }}>
                <MessageSquare size={36} style={{ marginBottom: '15px', opacity: 0.3 }} />
                <p>No reviews yet for this product.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg('')}>
          <span className="lightbox-close">&times;</span>
          <img src={lightboxImg} className="lightbox-img" alt="Enlarged" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
