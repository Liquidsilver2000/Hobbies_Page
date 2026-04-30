import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AviationPage from './pages/AviationPage';
import MLModelsPage from './pages/MLModelsPage';
import ReadingPage from './pages/ReadingPage';
import Navigation from './components/Navigation';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Initialize GSAP defaults
      gsap.defaults({
        ease: 'power3.out',
        duration: 0.6
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0e14] text-[#e8eef4]">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/aviation" replace />} />
          <Route path="/aviation" element={<AviationPage />} />
          <Route path="/models" element={<MLModelsPage />} />
          <Route path="/reading" element={<ReadingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
