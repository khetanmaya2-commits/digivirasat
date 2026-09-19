import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Monument from './pages/Monument';
import ElementDetail from './pages/ElementDetail';
import Preserve from './pages/Preserve';
import Analysis from './pages/Analysis';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ConservationLogin from './pages/ConservationLogin';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#FBF8F2] text-[#1F1813]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/monument/:monumentId" element={<Monument />} />
            <Route path="/monument/:monumentId/element/:elementId" element={<ElementDetail />} />
            <Route path="/preserve" element={<Preserve />} />
            <Route path="/analysis/:analysisId" element={<Analysis />} />

            <Route path="/dashboard/login" element={<ConservationLogin />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            {/* Catch-all redirects to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
