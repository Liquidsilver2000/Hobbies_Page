import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/ml/Hero';
import InferenceDemos from '../sections/ml/InferenceDemos';
import TrainingVisualizer from '../sections/ml/TrainingVisualizer';
import FailureLog from '../sections/ml/FailureLog';
import HyperparameterPlayground from '../sections/ml/HyperparameterPlayground';

gsap.registerPlugin(ScrollTrigger);

const MLModelsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ml-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.ml-section',
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
      <div className="ml-section">
        <InferenceDemos />
      </div>
      <div className="ml-section">
        <TrainingVisualizer />
      </div>
      <div className="ml-section">
        <FailureLog />
      </div>
      <div className="ml-section">
        <HyperparameterPlayground />
      </div>
    </div>
  );
};

export default MLModelsPage;
