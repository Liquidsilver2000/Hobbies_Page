import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { MapPin, Navigation, Clock, Ruler } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'leaflet/dist/leaflet.css';

gsap.registerPlugin(ScrollTrigger);

// Sample flight path: San Carlos (KSQL) to Truckee (KTRK)
const flightPath = [
  [37.5119, -122.2495], // KSQL
  [37.6, -122.15],
  [37.75, -121.9],
  [38.0, -121.5],
  [38.2, -121.2],
  [38.4, -120.9],
  [38.6, -120.6],
  [38.8, -120.3],
  [39.0, -120.0],
  [39.15, -119.7],
  [39.3, -120.15], // KTRK
];

const FlightMap = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [pathVisible, setPathVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPathVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Card slide in
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Trigger path animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => setPathVisible(true),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="flight-map"
      ref={sectionRef}
      className="relative py-24 px-6"
    >
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Flight Tracking
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Recent Flight Path
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          KSQL → KTRK · San Carlos to Truckee Tahoe
        </p>
      </div>

      {/* Map Container */}
      <div className="relative max-w-[1400px] mx-auto">
        {/* Map */}
        <div className="relative h-[60vh] min-h-[500px] rounded-2xl overflow-hidden border border-[rgba(0,212,255,0.2)]">
          <MapContainer
            center={[38.4, -121.2]}
            zoom={8}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', background: '#0a0e14' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Flight Path */}
            <Polyline
              positions={flightPath}
              pathOptions={{
                color: '#00d4ff',
                weight: 3,
                opacity: pathVisible ? 0.8 : 0,
                dashArray: pathVisible ? undefined : '10, 10',
              }}
            />
            
            {/* Start Point */}
            <CircleMarker
              center={flightPath[0]}
              radius={8}
              pathOptions={{
                fillColor: '#39ff14',
                color: '#39ff14',
                fillOpacity: 0.8,
              }}
            >
              <Popup className="glass-panel">
                <div className="font-mono text-sm">
                  <strong className="text-[#39ff14]">KSQL</strong>
                  <br />
                  <span className="text-[#8b9aae]">San Carlos Airport</span>
                </div>
              </Popup>
            </CircleMarker>
            
            {/* End Point */}
            <CircleMarker
              center={flightPath[flightPath.length - 1]}
              radius={8}
              pathOptions={{
                fillColor: '#ffb800',
                color: '#ffb800',
                fillOpacity: 0.8,
              }}
            >
              <Popup className="glass-panel">
                <div className="font-mono text-sm">
                  <strong className="text-[#ffb800]">KTRK</strong>
                  <br />
                  <span className="text-[#8b9aae]">Truckee Tahoe Airport</span>
                </div>
              </Popup>
            </CircleMarker>
          </MapContainer>

          {/* HUD Overlay Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#00d4ff]/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#00d4ff]/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[#00d4ff]/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#00d4ff]/40 pointer-events-none" />

          {/* Scale Indicator */}
          <div className="absolute bottom-6 left-6 glass-panel px-3 py-2 rounded">
            <span className="font-hud text-xs text-[#00d4ff]/60">50 NM</span>
            <div className="w-24 h-0.5 bg-[#00d4ff]/40 mt-1" />
          </div>
        </div>

        {/* Flight Info Card */}
        <div
          ref={cardRef}
          className="absolute top-6 right-6 w-72 glass-card-elevated p-6 z-[400]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="w-5 h-5 text-[#00d4ff]" />
            <span className="font-mono font-semibold text-[#e8eef4]">Flight Details</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#8b9aae]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Route</span>
              </div>
              <span className="font-mono text-[#e8eef4]">KSQL → KTRK</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#8b9aae]">
                <Ruler className="w-4 h-4" />
                <span className="text-sm">Distance</span>
              </div>
              <span className="font-mono text-[#e8eef4]">142 NM</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#8b9aae]">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <span className="font-mono text-[#e8eef4]">1.2 hrs</span>
            </div>

            <div className="pt-4 border-t border-[rgba(0,212,255,0.1)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#8b9aae]">Aircraft</span>
                <span className="font-mono text-[#e8eef4]">C172S</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b9aae]">Altitude</span>
                <span className="font-mono text-[#00d4ff]">8,500 ft</span>
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]" />
            </span>
            <span className="font-hud text-xs text-[#39ff14]">TRACKED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightMap;
