import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown, Plane } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Grid animation
      gsap.fromTo(
        '.grid-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      );

      // Tagline typewriter effect
      const tagline = taglineRef.current;
      if (tagline) {
        const text = tagline.textContent || '';
        tagline.textContent = '';
        
        gsap.to(tagline, {
          duration: text.length * 0.05,
          delay: 0.8,
          ease: 'none',
          onUpdate: function() {
            const progress = this.progress();
            const charIndex = Math.floor(progress * text.length);
            tagline.textContent = text.substring(0, charIndex) + (progress < 1 ? '|' : '');
          },
          onComplete: () => {
            tagline.textContent = text;
          }
        });
      }

      // Scroll indicator bounce
      gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // HUD elements fade in
      gsap.fromTo(
        '.hud-element',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 1.2, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById('flight-map');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="grid-overlay absolute inset-0 animated-grid opacity-30" />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0e14]/80" />

      {/* HUD Corner Elements */}
      <div className="hud-element absolute top-24 left-6 w-16 h-16 border-l-2 border-t-2 border-[#00d4ff]/30" />
      <div className="hud-element absolute top-24 right-6 w-16 h-16 border-r-2 border-t-2 border-[#00d4ff]/30" />
      <div className="hud-element absolute bottom-24 left-6 w-16 h-16 border-l-2 border-b-2 border-[#00d4ff]/30" />
      <div className="hud-element absolute bottom-24 right-6 w-16 h-16 border-r-2 border-b-2 border-[#00d4ff]/30" />

      {/* Altitude Ticks (Decorative) */}
      <div className="hud-element absolute left-4 top-1/3 bottom-1/3 flex flex-col justify-between py-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-px bg-[#00d4ff]/30" />
            <span className="font-hud text-[10px] text-[#00d4ff]/40">{8500 - i * 500}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Icon */}
        <div className="hud-element mb-8 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#39ff14]/10 border border-[#00d4ff]/40 flex items-center justify-center">
              <Plane className="w-10 h-10 text-[#00d4ff]" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-[#00d4ff]/20 blur-xl" />
          </div>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-[#e8eef4] mb-6 tracking-tight"
        >
          The Digital{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#39ff14]">
            Logbook
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-mono text-xl md:text-2xl text-[#8b9aae] mb-4"
        >
          I pilot planes and data pipelines.
        </p>

        {/* Subtitle */}
        <p className="text-[#4a5568] max-w-xl mx-auto mb-12">
          Flight hours, telemetry data, and the journey through the skies. 
          Every flight tells a story.
        </p>

        {/* Stats Row */}
        <div className="hud-element flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { value: '847', label: 'Total Hours' },
            { value: '142', label: 'Flights' },
            { value: '38', label: 'Airports' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-hud text-3xl md:text-4xl text-[#00d4ff] text-glow-cyan">
                {stat.value}
              </div>
              <div className="font-mono text-xs text-[#4a5568] uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8b9aae] hover:text-[#00d4ff] transition-colors cursor-pointer"
      >
        <span className="font-mono text-xs uppercase tracking-wider">Explore</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e14] to-transparent" />
    </section>
  );
};

export default Hero;
