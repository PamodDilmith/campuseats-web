import React, { useState, useEffect } from 'react'
import './App.css'

const SAMPLE_MENU = [
  { id: 1, name: 'Crispy Chicken Sub', category: 'Fast Food', price: 'Rs. 850', available: true, rating: '4.8' },
  { id: 2, name: 'Spicy Rice & Curry Box', category: 'Traditional', price: 'Rs. 450', available: true, rating: '4.9' },
  { id: 3, name: 'Iced Caramel Macchiato', category: 'Beverages', price: 'Rs. 600', available: true, rating: '4.7' },
  { id: 4, name: 'Cheese & Veggie Toastie', category: 'Bakery', price: 'Rs. 380', available: true, rating: '4.5' },
  { id: 5, name: 'Classic Beef Burger', category: 'Fast Food', price: 'Rs. 950', available: false, rating: '4.6' },
  { id: 6, name: 'Berry Blast Smoothie', category: 'Beverages', price: 'Rs. 550', available: true, rating: '4.8' }
]

function App() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [apiSource, setApiSource] = useState('Checking API...')

  // Step 3 (Task 01): Read the API base URL from the environment
  const API = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    let isMounted = true

    async function fetchMenu() {
      if (!API) {
        if (isMounted) {
          setMenuItems(SAMPLE_MENU)
          setApiSource('VITE_API_URL not set (Using Mock Menu Data)')
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        setApiSource(`Fetching from ${API}/api/menu...`)
        const response = await fetch(`${API}/api/menu`)
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          setMenuItems(Array.isArray(data) ? data : SAMPLE_MENU)
          setApiSource(`Connected to live API: ${API}`)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Backend API connection failed, falling back to local dataset:', err)
          setMenuItems(SAMPLE_MENU)
          setError(`API offline or cold starting (${err.message}). Showing standby menu.`)
          setApiSource(`Attempted ${API} (Standby Fallback)`)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchMenu()
    return () => { isMounted = false }
  }, [API])

  const addToCart = (item) => {
    setCart((prev) => [...prev, item])
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span className="logo-icon">🍔</span>
          <div>
            <h1>CampusEats</h1>
            <span className="badge">SE3090 • Lab 11 Cloud Deployment</span>
          </div>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          <span>Environment: <strong>Production (Vercel)</strong></span>
        </div>
      </header>

      {/* DevOps Banner */}
      <section className="devops-banner">
        <div className="banner-content">
          <h3>DevOps Architecture & Configuration</h3>
          <p>
            <strong>API Endpoint:</strong> <code>{API || 'VITE_API_URL is undefined (Standalone Client Mode)'}</code>
          </p>
          <p>
            <strong>Status:</strong> <span className="status-pill">{apiSource}</span>
          </p>
          {error && <p className="warning-text">ℹ️ {error}</p>}
        </div>
      </section>

      {/* Main Content */}
      <main className="content">
        <div className="menu-header">
          <h2>Campus Cafeteria Daily Menu</h2>
          <span className="cart-badge">🛒 Cart Items: {cart.length}</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading CampusEats menu...</p>
          </div>
        ) : (
          <div className="grid">
            {menuItems.map((item) => (
              <div key={item.id} className="card">
                <div className="card-top">
                  <span className="category-tag">{item.category}</span>
                  <span className="rating">⭐ {item.rating}</span>
                </div>
                <h3>{item.name}</h3>
                <div className="card-bottom">
                  <span className="price">{item.price}</span>
                  <button
                    className="order-btn"
                    disabled={!item.available}
                    onClick={() => addToCart(item)}
                  >
                    {item.available ? 'Add to Tray' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>SE3090 - Software Engineering Frameworks | Lab Practical 11 (DevOps & Cloud Hosting)</p>
        <p>Frontend deployed on <strong>Vercel</strong> • CI/CD enabled via <strong>GitHub</strong></p>
      </footer>
    </div>
  )
}

export default App
