import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sliders, RotateCcw, Save, TrendingDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Preset configurations
const presets = {
  conservative: { lr: 0.0001, batchSize: 64, dropout: 0.5, epochs: 100 },
  aggressive: { lr: 0.01, batchSize: 256, dropout: 0.2, epochs: 50 },
  balanced: { lr: 0.001, batchSize: 128, dropout: 0.3, epochs: 75 },
};

// Generate loss curve based on hyperparameters
const generateLossCurve = (lr: number, batchSize: number, dropout: number, epochs: number) => {
  const data = [];
  let loss = 2.5;
  
  for (let i = 0; i < epochs; i++) {
    // Learning rate affects convergence speed
    const lrFactor = Math.min(lr * 1000, 1);
    
    // Batch size affects noise (smaller = noisier)
    const noise = (Math.random() - 0.5) * (256 / batchSize) * 0.1;
    
    // Dropout affects final loss (higher = higher final loss but less overfit)
    const minLoss = 0.1 + dropout * 0.3;
    
    // Exponential decay with noise
    const decay = Math.exp(-i / (30 / lrFactor));
    loss = minLoss + (2.5 - minLoss) * decay + noise;
    
    data.push({ epoch: i + 1, loss: Math.max(minLoss, loss) });
  }
  
  return data;
};

const HyperparameterPlayground = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lr, setLr] = useState(0.001);
  const [batchSize, setBatchSize] = useState(128);
  const [dropout, setDropout] = useState(0.3);
  const [epochs, setEpochs] = useState(75);
  const [lossData, setLossData] = useState(generateLossCurve(0.001, 128, 0.3, 75));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.playground-container',
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
    setLossData(generateLossCurve(lr, batchSize, dropout, epochs));
  }, [lr, batchSize, dropout, epochs]);

  const applyPreset = (preset: keyof typeof presets) => {
    const config = presets[preset];
    setLr(config.lr);
    setBatchSize(config.batchSize);
    setDropout(config.dropout);
    setEpochs(config.epochs);
  };

  const reset = () => {
    applyPreset('balanced');
  };

  // Simple SVG line chart
  const maxLoss = Math.max(...lossData.map((d) => d.loss));
  const minLoss = Math.min(...lossData.map((d) => d.loss));
  const chartWidth = 100;
  const chartHeight = 100;

  const points = lossData.map((d, i) => {
    const x = (i / (lossData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.loss - minLoss) / (maxLoss - minLoss)) * chartHeight * 0.8 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <section ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Interactive
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Hyperparameter Playground
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Experiment with different configurations and see how they affect training dynamics.
        </p>
      </div>

      {/* Playground Container */}
      <div className="playground-container max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls Panel */}
          <div className="glass-card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-5 h-5 text-[#00d4ff]" />
              <h3 className="font-mono font-semibold text-[#e8eef4]">Parameters</h3>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <span className="font-hud text-xs text-[#4a5568] uppercase tracking-wider block mb-3">
                Quick Presets
              </span>
              <div className="flex gap-3">
                {Object.keys(presets).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset as keyof typeof presets)}
                    className="px-4 py-2 rounded-lg border border-[rgba(0,212,255,0.2)] text-[#8b9aae] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.4)] transition-all font-mono text-sm capitalize"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              {/* Learning Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-sm text-[#e8eef4]">Learning Rate</label>
                  <span className="font-hud text-sm text-[#00d4ff]">{lr.toExponential(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.00001"
                  max="0.1"
                  step="0.00001"
                  value={lr}
                  onChange={(e) => setLr(parseFloat(e.target.value))}
                  className="slider-glass"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-hud text-xs text-[#4a5568]">1e-5</span>
                  <span className="font-hud text-xs text-[#4a5568]">1e-1</span>
                </div>
              </div>

              {/* Batch Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-sm text-[#e8eef4]">Batch Size</label>
                  <span className="font-hud text-sm text-[#00d4ff]">{batchSize}</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="512"
                  step="16"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="slider-glass"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-hud text-xs text-[#4a5568]">16</span>
                  <span className="font-hud text-xs text-[#4a5568]">512</span>
                </div>
              </div>

              {/* Dropout */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-sm text-[#e8eef4]">Dropout Rate</label>
                  <span className="font-hud text-sm text-[#00d4ff]">{(dropout * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={dropout}
                  onChange={(e) => setDropout(parseFloat(e.target.value))}
                  className="slider-glass"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-hud text-xs text-[#4a5568]">0%</span>
                  <span className="font-hud text-xs text-[#4a5568]">80%</span>
                </div>
              </div>

              {/* Epochs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-sm text-[#e8eef4]">Epochs</label>
                  <span className="font-hud text-sm text-[#00d4ff]">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={epochs}
                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                  className="slider-glass"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-hud text-xs text-[#4a5568]">10</span>
                  <span className="font-hud text-xs text-[#4a5568]">200</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[rgba(0,212,255,0.2)] text-[#8b9aae] hover:text-[#e8eef4] hover:border-[rgba(0,212,255,0.4)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-mono text-sm">Reset</span>
              </button>
              <button className="flex-1 btn-glass flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                <span className="font-mono text-sm">Save Config</span>
              </button>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="glass-card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-5 h-5 text-[#39ff14]" />
              <h3 className="font-mono font-semibold text-[#e8eef4]">Predicted Loss Curve</h3>
            </div>

            {/* SVG Chart */}
            <div className="relative h-64 bg-[rgba(10,14,20,0.5)] rounded-lg border border-[rgba(0,212,255,0.1)] p-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="rgba(0, 212, 255, 0.1)"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Loss curve */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Area under curve */}
                <polygon
                  points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                  fill="url(#gradient)"
                  opacity="0.2"
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Axis labels */}
              <div className="absolute bottom-2 left-4 right-4 flex justify-between">
                <span className="font-hud text-xs text-[#4a5568]">0</span>
                <span className="font-hud text-xs text-[#4a5568]">Epoch {epochs}</span>
              </div>
              <div className="absolute top-4 left-2 bottom-8 flex flex-col justify-between">
                <span className="font-hud text-xs text-[#4a5568]">{maxLoss.toFixed(2)}</span>
                <span className="font-hud text-xs text-[#4a5568]">{minLoss.toFixed(2)}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="glass-panel p-4 rounded-lg text-center">
                <span className="font-hud text-xs text-[#4a5568] uppercase block mb-1">
                  Final Loss
                </span>
                <span className="font-mono text-xl text-[#00d4ff]">
                  {lossData[lossData.length - 1]?.loss.toFixed(3)}
                </span>
              </div>
              <div className="glass-panel p-4 rounded-lg text-center">
                <span className="font-hud text-xs text-[#4a5568] uppercase block mb-1">
                  Convergence
                </span>
                <span className="font-mono text-xl text-[#39ff14]">
                  {((1 - lossData[lossData.length - 1]?.loss / 2.5) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="glass-panel p-4 rounded-lg text-center">
                <span className="font-hud text-xs text-[#4a5568] uppercase block mb-1">
                  Est. Time
                </span>
                <span className="font-mono text-xl text-[#ffb800]">
                  {((epochs * batchSize) / 1000).toFixed(1)}h
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]">
              <span className="font-hud text-xs text-[#00d4ff] uppercase tracking-wider block mb-2">
                Insight
              </span>
              <p className="font-mono text-sm text-[#8b9aae]">
                {lr > 0.01
                  ? 'High learning rate may cause instability. Consider gradient clipping.'
                  : lr < 0.0001
                  ? 'Very low learning rate will take longer to converge.'
                  : batchSize < 32
                  ? 'Small batches give noisy gradients but better generalization.'
                  : dropout > 0.5
                  ? 'High dropout may prevent the model from learning complex patterns.'
                  : 'This configuration looks balanced for most tasks.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HyperparameterPlayground;
