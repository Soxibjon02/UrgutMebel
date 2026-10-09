import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { RoleSwitcher } from './components/RoleSwitcher';

// Pages
import { Home } from './pages/Home';
import { FurnitureCatalog } from './pages/FurnitureCatalog';
import { ProductDetail } from './pages/ProductDetail';
import { CategoriesPage } from './pages/CategoriesPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { CraftsmenDirectory } from './pages/CraftsmenDirectory';
import { CraftsmanDetail } from './pages/CraftsmanDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerAccount } from './pages/CustomerAccount';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navbar />
                  
                  <main style={{ flex: 1 }}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/furniture" element={<FurnitureCatalog />} />
                      <Route path="/furniture/:id" element={<ProductDetail />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/custom-order" element={<CustomOrderPage />} />
                      <Route path="/craftsmen" element={<CraftsmenDirectory />} />
                      <Route path="/craftsmen/:id" element={<CraftsmanDetail />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />

                      {/* E-commerce & Customer routes */}
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/account" element={<CustomerAccount />} />

                      {/* Dedicated Manager Panel */}
                      <Route path="/manager" element={<ManagerDashboard />} />

                      {/* Hidden Protected Admin Panel */}
                      <Route path="/admin" element={<AdminDashboard />} />

                      {/* Fallback */}
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </main>

                  <Footer />
                  
                  {/* Floating Elements & Overlays */}
                  <Toast />
                  <AuthModal />
                </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
