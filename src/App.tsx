import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
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
import { SOCIAL_LINKS } from './constants';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <HelmetProvider>
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
        
        {/* WhatsApp Floating Icon with Welcome Note */}
        <div className="fixed bottom-4 left-4 group" style={{ zIndex: 9999 }}>
          {/* Welcome Note Tooltip */}
          <div className="absolute bottom-16 left-0 bg-white text-gray-800 text-sm rounded-xl shadow-xl p-4 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-2">
            <div className="font-semibold text-brand-heading mb-1">💬 Chat with us</div>
            <p className="text-gray-600 text-xs leading-relaxed">
              Tap the icon and we'll have this message ready for you:
            </p>
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 italic">
              "Hello Alphadavis Real Estate, I am interested in your services."
            </div>
            {/* Arrow pointing down to icon */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
          </div>
          <a
            href={`${SOCIAL_LINKS.whatsapp}?text=Hello%20Alphadavis%20Real%20Estate%2C%20I%20am%20interested%20in%20your%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110"
            aria-label="WhatsApp Chat"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
REPLACE
      </div>
    </BrowserRouter>
  </HelmetProvider>
);
}
