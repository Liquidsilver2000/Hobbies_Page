import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Plot from 'react-plotly.js';
import { Play, Pause, RotateCcw, TrendingDown, Clock, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Generate sample training data
const generateTrainingData = () => {
  const epochs = Array.from({ length: 100 }, (_, i) => i + 1);
  
  // Training loss (decreasing with noise)
  const trainLoss = epochs.map((e) => {
    const base = 2.5 * Math.exp(-e / 30);
    const noise = (Math.random() - 0.5) * 0.1;
    return Math.max(0.1, base + noise);
  });
  
  // Validation loss (decreasing then slight overfit)
  const valLoss = epochs.map((e) => {
    const base = 2.7 * Math.exp(-e / 35);
    const overfit = e > 70 ? (e - 70) * 0.002 : 0;
    const noise = (Math.random() - 0.5) * 0.08;
    return Math.max(0.15, base + overfit + noise);
  });
  
  // Accuracy (increasing)
  const accuracy = epochs.map((e) => {
    const base = 0.6 + 0.35 * (1 - Math.exp(-e / 25));
    const noise = (Math.random() - 0.5) * 0.02;
    return Math.min(0.98, base + noise);
  });
  
  return { epochs, trainLoss, valLoss, accuracy };
};

const data = generateTrainingData();

const TrainingVisualizer = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(100);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.visualizer-container',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentEpoch((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    setProgress((currentEpoch / 100) * 100);
  }, [currentEpoch]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentEpoch(0);
  };

  const chartLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { family: 'JetBrains Mono, monospace', color: '#8b9aae', size: 11 },
    margin: { l: 50, r: 20, t: 40, b: 50 },
    xaxis: {
      gridcolor: 'rgba(0, 212, 255, 0.1)',
      linecolor: 'rgba(0, 212, 255, 0.2)',
      title: { text: 'Epoch', font: { size: 11 } },
      range: [0, 100],
    },
    yaxis: {
      gridcolor: 'rgba(0, 212, 255, 0.1)',
      linecolor: 'rgba(0, 212, 255, 0.2)',
      title: { text: 'Loss', font: { size: 11 } },
    },
    showlegend: true,
    legend: {
      x: 0.7,
      y: 1,
      font: { size: 10 },
      bgcolor: 'rgba(10, 14, 20, 0.8)',
    },
    hovermode: 'x unified' as const,
  };

  const chartConfig = { displayModeBar: false, responsive: true };

  const currentData = [
    {
      x: data.epochs.slice(0, currentEpoch),
      y: data.trainLoss.slice(0, currentEpoch),
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: 'Training Loss',
      line: { color: '#00d4ff', width: 2, shape: 'spline' },
    },
    {
      x: data.epochs.slice(0, currentEpoch),
      y: data.valLoss.slice(0, currentEpoch),
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: 'Validation Loss',
      line: { color: '#ffb800', width: 2, shape: 'spline', dash: 'dash' },
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Training
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Loss Visualizer
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Watch the model learn. Training loss decreases as the network finds patterns in the data.
        </p>
      </div>

      {/* Visualizer Container */}
      <div className="visualizer-container max-w-[1400px] mx-auto">
        <div className="glass-card-elevated p-6">
          {/* Controls Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            {/* Epoch Counter */}
            <div className="flex items-center gap-6">
              <div>
                <span className="font-hud text-xs text-[#4a5568] uppercase tracking-wider block mb-1">
                  Epoch
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-hud text-4xl text-[#00d4ff]">
                    {currentEpoch.toString().padStart(3, '0')}
                  </span>
                  <span className="font-hud text-lg text-[#4a5568]">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 min-w-[150px]">
                <span className="font-hud text-xs text-[#4a5568] uppercase tracking-wider block mb-2">
                  Progress
                </span>
                <div className="progress-glass h-3 w-full">
                  <div
                    className="progress-glass-fill h-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-glass flex items-center gap-2 px-6"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="font-mono text-sm">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="font-mono text-sm">Play</span>
                  </>
                )}
              </button>
              <button
                onClick={reset}
                className="p-3 rounded-lg border border-[rgba(0,212,255,0.2)] text-[#8b9aae] hover:text-[#e8eef4] hover:border-[rgba(0,212,255,0.4)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[400px] mb-6">
            <Plot
              data={currentData}
              layout={chartLayout}
              config={chartConfig}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[rgba(0,212,255,0.1)]">
            {[
              {
                icon: TrendingDown,
                label: 'Current Loss',
                value: data.trainLoss[currentEpoch - 1]?.toFixed(3) || '2.500',
                color: '#00d4ff',
              },
              {
                icon: Target,
                label: 'Val Loss',
                value: data.valLoss[currentEpoch - 1]?.toFixed(3) || '2.700',
                color: '#ffb800',
              },
              {
                icon: Clock,
                label: 'Time/Epoch',
                value: '2.3s',
                color: '#39ff14',
              },
              {
                icon: TrendingDown,
                label: 'LR',
                value: '1e-4',
                color: '#e8eef4',
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-panel p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="font-hud text-xs text-[#4a5568] uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <span className="font-mono text-xl" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Model', value: 'ResNet-50' },
            { label: 'Dataset', value: 'ImageNet-1K' },
            { label: 'Batch Size', value: '256' },
            { label: 'Optimizer', value: 'AdamW' },
            { label: 'Initial LR', value: '1e-3' },
            { label: 'Hardware', value: '4x A100' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]"
            >
              <span className="font-mono text-sm text-[#4a5568]">{item.label}</span>
              <span className="font-mono text-sm text-[#e8eef4]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingVisualizer;
