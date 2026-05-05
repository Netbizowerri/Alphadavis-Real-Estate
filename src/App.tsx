import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import Navbar from './components/Navbar';
import MobileFooter from './components/MobileFooter';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AboutPage from './pages/About';
import Listings from './pages/Listings';
import RequestProperty from './pages/RequestProperty';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import PropertyEditor from './pages/admin/PropertyEditor';
import ListingManager from './pages/admin/ListingManager';
import CategoryManager from './pages/admin/CategoryManager';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative antialiased selection:bg-brand-accent selection:text-black bg-brand-light min-h-screen">
        {/* Atmospheric Background Glows */}
        <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Reading progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-brand-accent z-[60] origin-left"
          style={{ scaleX }}
        />

        <Navbar />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/request-property" element={<RequestProperty />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties" element={
              <ProtectedRoute>
                <ListingManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute>
                <CategoryManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties/add" element={
              <ProtectedRoute>
                <PropertyEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties/edit/:id" element={
              <ProtectedRoute>
                <PropertyEditor />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />
        <MobileFooter />
      </div>
    </BrowserRouter>
  );
}
