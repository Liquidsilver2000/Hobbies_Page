import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Compass, Wind } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: '/cockpit-sunset.jpg',
    alt: 'Cockpit at sunset over Bay Area',
    hud: {
      altitude: '2,400',
      speed: '115',
      heading: '285°',
    },
  },
  {
    src: '/above-clouds.jpg',
    alt: 'Flying above the clouds',
    hud: {
      altitude: '8,500',
      speed: '124',
      heading: '340°',
    },
  },
  {
    src: '/night-flight.jpg',
    alt: 'Night flight over city lights',
    hud: {
      altitude: '5,200',
      speed: '118',
      heading: '120°',
    },
  },
];

const CockpitGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Gallery items reveal
      gsap.fromTo(
        '.gallery-item',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Parallax effect on images
      gsap.utils.toArray<HTMLElement>('.gallery-image').forEach((img) => {
        gsap.to(img, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // HUD overlay fade in
      gsap.fromTo(
        '.hud-overlay',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.5,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Gallery
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Cockpit Views
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Moments captured from the flight deck. Each image tells a story of altitude and attitude.
        </p>
      </div>

      {/* Gallery Grid */}
      <div ref={galleryRef} className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-item relative group overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.15)]"
              style={{ aspectRatio: '16/10' }}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="gallery-image w-full h-full object-cover scale-110 transition-transform duration-700 group-hover:scale-100"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14]/90 via-[#0a0e14]/30 to-transparent" />

              {/* HUD Overlay */}
              <div className="hud-overlay absolute inset-0 p-4 flex flex-col justify-between opacity-80">
                {/* Top HUD */}
                <div className="flex justify-between items-start">
                  <div className="hud-panel px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <Camera className="w-3 h-3 text-[#00d4ff]" />
                      <span className="font-hud text-xs text-[#00d4ff]">GOPRO</span>
                    </div>
                  </div>
                  <div className="hud-panel px-3 py-1.5">
                    <span className="font-hud text-xs text-[#ffb800]">REC ●</span>
                  </div>
                </div>

                {/* Center - Artificial Horizon Indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-24 rounded-full border-2 border-[#00d4ff]/30 flex items-center justify-center">
                    <div className="w-20 h-0.5 bg-[#00d4ff]/50" />
                  </div>
                </div>

                {/* Bottom HUD */}
                <div className="flex justify-between items-end">
                  {/* Altitude */}
                  <div className="glass-panel px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUpIcon className="w-3 h-3 text-[#39ff14]" />
                      <span className="font-hud text-[10px] text-[#4a5568]">ALT</span>
                    </div>
                    <span className="font-hud text-xl text-[#39ff14]">
                      {image.hud.altitude}
                    </span>
                    <span className="font-hud text-xs text-[#4a5568] ml-1">ft</span>
                  </div>

                  {/* Speed */}
                  <div className="glass-panel px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Wind className="w-3 h-3 text-[#00d4ff]" />
                      <span className="font-hud text-[10px] text-[#4a5568]">SPD</span>
                    </div>
                    <span className="font-hud text-xl text-[#00d4ff]">
                      {image.hud.speed}
                    </span>
                    <span className="font-hud text-xs text-[#4a5568] ml-1">kts</span>
                  </div>

                  {/* Heading */}
                  <div className="glass-panel px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Compass className="w-3 h-3 text-[#ffb800]" />
                      <span className="font-hud text-[10px] text-[#4a5568]">HDG</span>
                    </div>
                    <span className="font-hud text-xl text-[#ffb800]">
                      {image.hud.heading}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-mono text-sm text-[#e8eef4]">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Corner Brackets Decoration */}
        <div className="relative mt-8 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
      </div>
    </section>
  );
};

// Helper icon component
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default CockpitGallery;
