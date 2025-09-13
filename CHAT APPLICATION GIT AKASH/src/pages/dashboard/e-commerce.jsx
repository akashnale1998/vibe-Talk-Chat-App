import React, { useState } from 'react';

const ECommerceApp = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      price: 134900,
      originalPrice: 149900,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      rating: 4.5,
      reviews: 1250,
      discount: 10,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 124999,
      originalPrice: 139999,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop",
      rating: 4.3,
      reviews: 892,
      discount: 11,
      category: "Electronics"
    },
    {
      id: 3,
      name: "Nike Air Max 270 Sneakers",
      price: 8995,
      originalPrice: 12995,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      rating: 4.4,
      reviews: 567,
      discount: 31,
      category: "Fashion"
    },
    {
      id: 4,
      name: "MacBook Pro 14\" M3 Chip",
      price: 194900,
      originalPrice: 209900,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
      rating: 4.7,
      reviews: 324,
      discount: 7,
      category: "Electronics"
    },
    {
      id: 5,
      name: "Sony WH-1000XM5 Headphones",
      price: 29990,
      originalPrice: 34990,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      rating: 4.6,
      reviews: 789,
      discount: 14,
      category: "Electronics"
    },
    {
      id: 6,
      name: "Adidas Ultraboost 22 Running",
      price: 11999,
      originalPrice: 16999,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      rating: 4.2,
      reviews: 445,
      discount: 29,
      category: "Fashion"
    },
    {
      id: 7,
      name: "Canon EOS R5 Mirrorless Camera",
      price: 329990,
      originalPrice: 359990,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
      rating: 4.8,
      reviews: 156,
      discount: 8,
      category: "Electronics"
    },
    {
      id: 8,
      name: "Levi's 511 Slim Fit Jeans",
      price: 3999,
      originalPrice: 5499,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
      rating: 4.1,
      reviews: 923,
      discount: 27,
      category: "Fashion"
    }
  ];

  const categories = [
    { name: "Electronics", icon: "💻", color: "#1976d2" },
    { name: "Fashion", icon: "👕", color: "#9c27b0" },
    { name: "Mobile", icon: "📱", color: "#2e7d32" },
    { name: "Home", icon: "🏠", color: "#ed6c02" },
    { name: "Books", icon: "📚", color: "#d32f2f" },
    { name: "Gaming", icon: "🎮", color: "#7b1fa2" }
  ];

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const StarRating = ({ rating, size = "16px" }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{color: "#ffa726", fontSize: size}}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{color: "#ffa726", fontSize: size}}>☆</span>);
      } else {
        stars.push(<span key={i} style={{color: "#ddd", fontSize: size}}>☆</span>);
      }
    }
    return <span>{stars}</span>;
  };

  const styles = {
    // Base styles
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    body: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f1f3f6'
    },
    
    // Header styles
    header: {
      backgroundColor: '#2874f0',
      color: 'white',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    headerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      textDecoration: 'none',
      color: 'white'
    },
    searchContainer: {
      flex: 1,
      maxWidth: '500px',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '12px 48px 12px 16px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none'
    },
    searchBtn: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      color: '#666'
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userBtn: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'background-color 0.2s'
    },
    cartBtn: {
      position: 'relative',
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px'
    },
    cartBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '8px',
      fontSize: '18px'
    },

    // Categories bar
    categoriesBar: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      padding: '16px 0'
    },
    categoriesContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '16px'
    },
    categoryItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background-color 0.2s',
      textDecoration: 'none',
      color: 'inherit'
    },
    categoryIcon: {
      fontSize: '24px',
      marginBottom: '8px'
    },
    categoryName: {
      fontSize: '12px',
      fontWeight: '500',
      textAlign: 'center'
    },

    // Main content
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    banner: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '48px 32px',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '32px'
    },
    bannerTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    bannerSubtitle: {
      fontSize: '18px',
      marginBottom: '24px',
      opacity: 0.9
    },
    bannerBtn: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '12px 32px',
      fontSize: '16px',
      fontWeight: '500',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },

    // Layout
    mainLayout: {
      display: 'flex',
      gap: '24px'
    },
    sidebar: {
      width: '250px',
      flexShrink: 0
    },
    content: {
      flex: 1
    },

    // Filters
    filterCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    },
    filterTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    filterSection: {
      marginBottom: '24px'
    },
    filterSubtitle: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '12px'
    },
    priceRange: {
      marginBottom: '8px'
    },
    rangeInput: {
      width: '100%',
      marginBottom: '8px'
    },
    rangeValues: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#666'
    },
    filterCheckbox: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      cursor: 'pointer'
    },
    checkbox: {
      marginRight: '8px'
    },

    // Product grid
    productHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    productTitle: {
      fontSize: '24px',
      fontWeight: '600'
    },
    sortControls: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    sortBtn: {
      padding: '8px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px'
    },
    filterBtn: {
      padding: '8px 16px',
      border: '1px solid #2874f0',
      borderRadius: '4px',
      backgroundColor: 'white',
      color: '#2874f0',
      cursor: 'pointer',
      fontSize: '14px'
    },

    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },

    // Product card
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      height: 'fit-content'
    },
    productImageContainer: {
      position: 'relative',
      height: '200px',
      overflow: 'hidden'
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    wishlistBtn: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    discountBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    productInfo: {
      padding: '16px'
    },
    productCategory: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '8px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },
    reviewCount: {
      fontSize: '12px',
      color: '#666'
    },
    productPricing: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    currentPrice: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#212121'
    },
    originalPrice: {
      fontSize: '14px',
      color: '#666',
      textDecoration: 'line-through'
    },
    addToCartBtn: {
      width: '100%',
      backgroundColor: '#ff9f00',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },

    // Mobile drawer
    drawer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease',
      zIndex: 2000,
      overflow: 'auto'
    },
    drawerOpen: {
      transform: 'translateX(0)'
    },
    drawerOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1500,
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease'
    },
    drawerOverlayOpen: {
      opacity: 1,
      visibility: 'visible'
    },
    drawerHeader: {
      padding: '24px',
      backgroundColor: '#2874f0',
      color: 'white'
    },
    drawerContent: {
      padding: '16px'
    },
    drawerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'background-color 0.2s'
    },

    // Footer
    footer: {
      backgroundColor: '#172337',
      color: 'white',
      marginTop: '64px',
      padding: '48px 0 24px'
    },
    footerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },
    footerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px'
    },
    footerLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    footerLink: {
      color: '#ccc',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s'
    },
    footerDivider: {
      height: '1px',
      backgroundColor: '#333',
      margin: '32px 0'
    },
    footerCopyright: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#ccc'
    },

    // Responsive styles
    '@media (max-width: 768px)': {
      headerContainer: {
        flexWrap: 'wrap'
      },
      searchContainer: {
        order: 3,
        width: '100%',
        marginTop: '12px'
      },
      categoriesContainer: {
        display: 'none'
      },
      mainLayout: {
        flexDirection: 'column'
      },
      sidebar: {
        display: 'none'
      },
      productGrid: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      },
      banner: {
        padding: '32px 16px'
      },
      bannerTitle: {
        fontSize: '28px'
      },
      bannerSubtitle: {
        fontSize: '16px'
      }
    }
  };

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              style={styles.menuBtn}
              onClick={() => setDrawerOpen(true)}
              className="mobile-only"
            >
              ☰
            </button>
            <a href="#" style={styles.logo}>ShopKart</a>
          </div>

          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              style={styles.searchInput}
            />
            <button style={styles.searchBtn}>🔍</button>
          </div>

          <div style={styles.headerActions}>
            <button
              style={styles.userBtn}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="desktop-only"
            >
              👤 Login
            </button>
            <button style={styles.cartBtn}>
              🛒
              <span style={styles.cartBadge}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Categories Bar (Desktop) */}
      <div style={styles.categoriesBar} className="desktop-only">
        <div style={styles.categoriesContainer}>
          {categories.map((category) => (
            <a key={category.name} style={styles.categoryItem} href="#">
              <div style={{ ...styles.categoryIcon, color: category.color }}>
                {category.icon}
              </div>
              <div style={styles.categoryName}>{category.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Banner */}
        <div style={styles.banner}>
          <h1 style={styles.bannerTitle}>Big Shopping Days</h1>
          <p style={styles.bannerSubtitle}>Up to 80% OFF on Electronics & Fashion</p>
          <button style={styles.bannerBtn}>Shop Now</button>
        </div>

        <div style={styles.mainLayout}>
          {/* Sidebar Filters (Desktop) */}
          <div style={styles.sidebar} className="desktop-only">
            <div style={styles.filterCard}>
              <h3 style={styles.filterTitle}>Filters</h3>
              
              <div style={styles.filterSection}>
                <h4 style={styles.filterSubtitle}>Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  style={styles.rangeInput}
                />
                <div style={styles.rangeValues}>
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterSubtitle}>Categories</h4>
                {categories.map((category) => (
                  <label key={category.name} style={styles.filterCheckbox}>
                    <input type="checkbox" style={styles.checkbox} />
                    {category.name}
                  </label>
                ))}
              </div>

              <div style={styles.filterSection}>
                <h4 style={styles.filterSubtitle}>Customer Ratings</h4>
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} style={styles.filterCheckbox}>
                    <input type="checkbox" style={styles.checkbox} />
                    <StarRating rating={rating} /> & up
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={styles.content}>
            {/* Product Header */}
            <div style={styles.productHeader}>
              <h2 style={styles.productTitle}>Featured Products ({products.length})</h2>
              <div style={styles.sortControls}>
                <button
                  style={styles.filterBtn}
                  className="mobile-only"
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  🔧 Filters
                </button>
                <button style={styles.sortBtn}>Sort by: Popularity ⌄</button>
              </div>
            </div>

            {/* Product Grid */}
            <div style={styles.productGrid}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={styles.productCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={styles.productImageContainer}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    <button style={styles.wishlistBtn}>♡</button>
                    {product.discount > 0 && (
                      <span style={styles.discountBadge}>
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div style={styles.productInfo}>
                    <div style={styles.productCategory}>{product.category}</div>
                    <h3 style={styles.productName}>{product.name}</h3>
                    
                    <div style={styles.productRating}>
                      <StarRating rating={product.rating} />
                      <span style={styles.reviewCount}>({product.reviews})</span>
                    </div>

                    <div style={styles.productPricing}>
                      <span style={styles.currentPrice}>
                        {formatPrice(product.price)}
                      </span>
                      <span style={styles.originalPrice}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>

                    <button
                      style={styles.addToCartBtn}
                      onClick={() => handleAddToCart(product)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e68900';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ff9f00';
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        style={{
          ...styles.drawerOverlay,
          ...(drawerOpen ? styles.drawerOverlayOpen : {})
        }}
        onClick={() => setDrawerOpen(false)}
      />
      <div
        style={{
          ...styles.drawer,
          ...(drawerOpen ? styles.drawerOpen : {})
        }}
      >
        <div style={styles.drawerHeader}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>👤 Hello User</div>
        </div>
        <div style={styles.drawerContent}>
          {categories.map((category) => (
            <a key={category.name} href="#" style={styles.drawerItem}>
              <span style={{ fontSize: '20px' }}>{category.icon}</span>
              {category.name}
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div>
              <h4 style={styles.footerTitle}>About</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>Contact Us</a>
                <a href="#" style={styles.footerLink}>About Us</a>
                <a href="#" style={styles.footerLink}>Careers</a>
                <a href="#" style={styles.footerLink}>Stories</a>
                <a href="#" style={styles.footerLink}>Press</a>
              </div>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Help</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>Payments</a>
                <a href="#" style={styles.footerLink}>Shipping</a>
                <a href="#" style={styles.footerLink}>Cancellation & Returns</a>
                <a href="#" style={styles.footerLink}>FAQ</a>
                <a href="#" style={styles.footerLink}>Report Infringement</a>
              </div>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Policy</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>Return Policy</a>
                <a href="#" style={styles.footerLink}>Terms Of Use</a>
                <a href="#" style={styles.footerLink}>Security</a>
                <a href="#" style={styles.footerLink}>Privacy</a>
                <a href="#" style={styles.footerLink}>Sitemap</a>
              </div>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Social</h4>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink}>Facebook</a>
                <a href="#" style={styles.footerLink}>Twitter</a>
                <a href="#" style={styles.footerLink}>YouTube</a>
                <a href="#" style={styles.footerLink}>Instagram</a>
                <a href="#" style={styles.footerLink}>LinkedIn</a>
              </div>
            </div>
          </div>
          <div style={styles.footerDivider}></div>
          <div style={styles.footerCopyright}>
            © 2025 ShopKart. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .mobile-only {
          display: none;
        }
        .desktop-only {
          display: block;
        }
        
        @media (max-width: 768px) {
          .mobile-only {
            display: block;
          }
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ECommerceApp;