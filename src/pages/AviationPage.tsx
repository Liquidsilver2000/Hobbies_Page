import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/aviation/Hero';
import FlightMap from '../sections/aviation/FlightMap';
import TelemetryDashboard from '../sections/aviation/TelemetryDashboard';
import CockpitGallery from '../sections/aviation/CockpitGallery';
import PreflightChecklist from '../sections/aviation/PreflightChecklist';

gsap.registerPlugin(ScrollTrigger);

const AviationPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Page reveal animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.aviation-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.aviation-section',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0e14]">
      <Hero />
      <div className="aviation-section">
        <FlightMap />
      </div>
      <div className="aviation-section">
        <TelemetryDashboard />
      </div>
      <div className="aviation-section">
        <CockpitGallery />
      </div>
      <div className="aviation-section">
        <PreflightChecklist />
      </div>
    </div>
  );
};

export default AviationPage;
