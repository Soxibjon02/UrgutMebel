import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { PwaProvider } from './context/PwaContext';

import { LanguageProvider } from './context/LanguageContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallPromptModal } from './components/InstallPromptModal';
import { ScrollToTop } from './components/ScrollToTop';
import { RealtimeListener } from './components/RealtimeListener';

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
import { CraftsmanDashboard } from './pages/CraftsmanDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { StoresPage } from './pages/StoresPage';
import { StoreDetailPage } from './pages/StoreDetailPage';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <PwaProvider>
                <LanguageProvider>
                  <Router>
                  <ScrollToTop />
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    
                    <main style={{ flex: 1 }}>
                      <Routes>
                        {/* Public routes matching Figma */}
                        <Route path="/" element={<Home />} />
                        <Route path="/furniture" element={<FurnitureCatalog />} />
                        <Route path="/furniture/:id" element={<ProductDetail />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/custom-order" element={<CustomOrderPage />} />
                        <Route path="/craftsmen" element={<CraftsmenDirectory />} />
                        <Route path="/craftsmen/:id" element={<CraftsmanDetail />} />
                        <Route path="/stores" element={<StoresPage />} />
                        <Route path="/stores/:id" element={<StoreDetailPage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:id" element={<BlogDetailPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* E-commerce & Customer routes */}
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/account" element={<CustomerAccount />} />

                        {/* Dedicated Craftsman Panel */}
                        <Route path="/craftsman-dashboard" element={<CraftsmanDashboard />} />
                        <Route path="/craftsman" element={<CraftsmanDashboard />} />

                        {/* Dedicated Manager Panel */}
                        <Route path="/manager" element={<ManagerDashboard />} />

                        {/* Hidden Protected Admin Panel */}
                        <Route path="/admin" element={<AdminDashboard />} />

                        {/* Fallback */}
                        <Route path="*" element={<Home />} />
                      </Routes>
                    </main>

                    <Footer />
                    
                    {/* Floating Elements, Bottom Nav & Overlays */}
                    <MobileBottomNav />
                    <RealtimeListener />
                    <Toast />
                    <AuthModal />
                    <InstallPromptModal />
                  </div>
                </Router>
              </LanguageProvider>
            </PwaProvider>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
