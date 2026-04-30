import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Plot from 'react-plotly.js';
import { Activity, TrendingUp, Gauge } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Sample telemetry data
const timePoints = Array.from({ length: 50 }, (_, i) => i * 2); // 0 to 98 minutes

const altitudeData = [
  800, 850, 920, 1100, 1500, 2200, 3200, 4500, 5800, 7200,
  8000, 8400, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8400,
  8200, 7800, 7200, 6500, 5800, 5000, 4200, 3500, 2800, 2200,
  1800, 1500, 1200, 1000, 850, 750, 680, 620, 580, 550,
  530, 520, 510, 505, 500, 495, 490, 485, 480, 475,
];

const speedData = [
  0, 45, 65, 85, 95, 105, 110, 115, 118, 120,
  122, 123, 124, 124, 124, 123, 123, 124, 124, 123,
  122, 120, 118, 115, 112, 110, 108, 105, 100, 95,
  90, 85, 80, 75, 70, 65, 60, 55, 50, 45,
  40, 35, 30, 25, 20, 15, 12, 10, 8, 5,
];

const verticalSpeedData = [
  0, 500, 800, 1000, 1200, 1400, 1200, 1000, 800, 500,
  200, 100, 50, 0, 0, 0, 0, 0, -50, -100,
  -200, -400, -600, -800, -1000, -1200, -1000, -800, -600, -400,
  -300, -200, -150, -100, -80, -60, -50, -40, -30, -20,
  -15, -10, -8, -5, -3, -2, -1, 0, 0, 0,
];

const TelemetryDashboard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [chartsVisible, setChartsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setChartsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Cards stagger reveal
      gsap.fromTo(
        '.telemetry-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Trigger chart animations
      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: 'top 60%',
        onEnter: () => setChartsVisible(true),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const chartLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { family: 'JetBrains Mono, monospace', color: '#8b9aae', size: 11 },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: {
      gridcolor: 'rgba(0, 212, 255, 0.1)',
      linecolor: 'rgba(0, 212, 255, 0.2)',
      title: { text: 'Time (min)', font: { size: 11 } },
    },
    yaxis: {
      gridcolor: 'rgba(0, 212, 255, 0.1)',
      linecolor: 'rgba(0, 212, 255, 0.2)',
    },
    showlegend: false,
    hovermode: 'x unified' as const,
  };

  const chartConfig = { displayModeBar: false, responsive: true };

  const charts = [
    {
      title: 'Altitude',
      icon: TrendingUp,
      color: '#00d4ff',
      data: [{
        x: timePoints,
        y: altitudeData,
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: '#00d4ff', width: 2, shape: 'spline' },
        fill: 'tozeroy',
        fillcolor: 'rgba(0, 212, 255, 0.1)',
      }],
      yaxisTitle: 'ft MSL',
    },
    {
      title: 'Ground Speed',
      icon: Activity,
      color: '#39ff14',
      data: [{
        x: timePoints,
        y: speedData,
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: '#39ff14', width: 2, shape: 'spline' },
        fill: 'tozeroy',
        fillcolor: 'rgba(57, 255, 20, 0.1)',
      }],
      yaxisTitle: 'knots',
    },
    {
      title: 'Vertical Speed',
      icon: Gauge,
      color: '#ffb800',
      data: [{
        x: timePoints,
        y: verticalSpeedData,
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: '#ffb800', width: 2, shape: 'spline' },
        fill: 'tozeroy',
        fillcolor: 'rgba(255, 184, 0, 0.1)',
      }],
      yaxisTitle: 'ft/min',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Telemetry
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Flight Data Analysis
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Real-time telemetry from recent flights. Every data point tells part of the story.
        </p>
      </div>

      {/* Charts Grid */}
      <div ref={cardsRef} className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {charts.map((chart, index) => {
            const Icon = chart.icon;
            return (
              <div
                key={index}
                className="telemetry-card glass-card p-6 hud-corners"
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${chart.color}20`, border: `1px solid ${chart.color}40` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: chart.color }} />
                  </div>
                  <div>
                    <h3 className="font-mono font-semibold text-[#e8eef4]">
                      {chart.title}
                    </h3>
                    <span className="font-hud text-xs text-[#4a5568]">
                      {chart.yaxisTitle}
                    </span>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-64">
                  {chartsVisible && (
                    <Plot
                      data={chart.data}
                      layout={{
                        ...chartLayout,
                        yaxis: { ...chartLayout.yaxis, title: { text: chart.yaxisTitle, font: { size: 10 } } },
                      }}
                      config={chartConfig}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-[rgba(0,212,255,0.1)] flex justify-between">
                  <div>
                    <span className="font-hud text-xs text-[#4a5568]">MAX</span>
                    <p className="font-mono text-lg" style={{ color: chart.color }}>
                      {Math.max(...(chart.data[0].y as number[])).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-hud text-xs text-[#4a5568]">AVG</span>
                    <p className="font-mono text-lg text-[#e8eef4]">
                      {Math.round(
                        (chart.data[0].y as number[]).reduce((a, b) => a + b, 0) /
                          (chart.data[0].y as number[]).length
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 glass-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Flight Time', value: '1:24', unit: 'hrs' },
              { label: 'Max Altitude', value: '8,500', unit: 'ft' },
              { label: 'Cruise Speed', value: '124', unit: 'kts' },
              { label: 'Fuel Burn', value: '8.2', unit: 'gph' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className="font-hud text-xs text-[#4a5568] uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="mt-1">
                  <span className="font-mono text-2xl text-[#00d4ff]">{stat.value}</span>
                  <span className="font-mono text-sm text-[#8b9aae] ml-1">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TelemetryDashboard;
