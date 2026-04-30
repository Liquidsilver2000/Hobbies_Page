import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/reading/Hero';
import KnowledgeGraph from '../sections/reading/KnowledgeGraph';
import FeaturedResources from '../sections/reading/FeaturedResources';
import ReadingStats from '../sections/reading/ReadingStats';

gsap.registerPlugin(ScrollTrigger);

const ReadingPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reading-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.reading-section',
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
      <div className="reading-section">
        <KnowledgeGraph />
      </div>
      <div className="reading-section">
        <FeaturedResources />
      </div>
      <div className="reading-section">
        <ReadingStats />
      </div>
    </div>
  );
};

export default ReadingPage;
