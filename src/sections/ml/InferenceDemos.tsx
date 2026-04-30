import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Image, MessageSquare, Scan, Zap, Upload, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Simulated inference demos
const demos = [
  {
    id: 'image-classification',
    name: 'Image Classification',
    description: 'ResNet-50 trained on ImageNet',
    icon: Image,
    color: '#00d4ff',
    placeholder: 'Upload an image or use sample...',
    sampleInput: '🐕 Dog playing in park',
    sampleOutput: ['Golden Retriever: 94%', 'Labrador: 3%', 'Beagle: 2%'],
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'BERT-based sentiment classifier',
    icon: MessageSquare,
    color: '#39ff14',
    placeholder: 'Enter text to analyze...',
    sampleInput: 'This product exceeded all my expectations!',
    sampleOutput: ['Positive: 96%', 'Neutral: 3%', 'Negative: 1%'],
  },
  {
    id: 'object-detection',
    name: 'Object Detection',
    description: 'YOLOv8 for real-time detection',
    icon: Scan,
    color: '#ffb800',
    placeholder: 'Upload an image...',
    sampleInput: 'Street scene with cars and pedestrians',
    sampleOutput: ['Car: 98%', 'Person: 87%', 'Traffic Light: 92%'],
  },
];

const InferenceDemos = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [outputs, setOutputs] = useState<Record<string, string[] | null>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.demo-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
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

  const handleInputChange = (demoId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [demoId]: value }));
  };

  const runInference = (demoId: string) => {
    const demo = demos.find((d) => d.id === demoId);
    if (!demo) return;

    setProcessing((prev) => ({ ...prev, [demoId]: true }));
    setOutputs((prev) => ({ ...prev, [demoId]: null }));

    // Simulate processing delay
    setTimeout(() => {
      setProcessing((prev) => ({ ...prev, [demoId]: false }));
      setOutputs((prev) => ({ ...prev, [demoId]: demo.sampleOutput }));
    }, 1500);
  };

  return (
    <section id="inference-demos" ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Live Demos
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Inference Playground
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Try out trained models in real-time. See how different architectures handle various tasks.
        </p>
      </div>

      {/* Demos Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {demos.map((demo) => {
            const Icon = demo.icon;
            const isProcessing = processing[demo.id];
            const output = outputs[demo.id];

            return (
              <div
                key={demo.id}
                className="demo-card glass-card-elevated overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-6 border-b border-[rgba(0,212,255,0.1)]"
                  style={{ background: `linear-gradient(135deg, ${demo.color}10, transparent)` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${demo.color}20`, border: `1px solid ${demo.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: demo.color }} />
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-[#e8eef4]">
                        {demo.name}
                      </h3>
                      <p className="font-mono text-xs text-[#4a5568]">
                        {demo.description}
                      </p>
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: demo.color }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ background: demo.color }}
                      />
                    </span>
                    <span className="font-hud text-xs" style={{ color: demo.color }}>
                      MODEL READY
                    </span>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6">
                  <div className="mb-4">
                    <label className="font-mono text-xs text-[#4a5568] uppercase tracking-wider mb-2 block">
                      Input
                    </label>
                    <div className="relative">
                      <textarea
                        value={inputs[demo.id] || ''}
                        onChange={(e) => handleInputChange(demo.id, e.target.value)}
                        placeholder={demo.placeholder}
                        className="w-full h-24 bg-[rgba(10,14,20,0.8)] border border-[rgba(0,212,255,0.2)] rounded-lg p-3 font-mono text-sm text-[#e8eef4] placeholder:text-[#4a5568] resize-none focus:outline-none focus:border-[rgba(0,212,255,0.4)] transition-colors"
                      />
                      <button
                        onClick={() => handleInputChange(demo.id, demo.sampleInput)}
                        className="absolute bottom-3 right-3 text-[#4a5568] hover:text-[#00d4ff] transition-colors"
                        title="Use sample input"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Run Button */}
                  <button
                    onClick={() => runInference(demo.id)}
                    disabled={isProcessing || !inputs[demo.id]}
                    className="w-full btn-glass flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: `${demo.color}15`,
                      borderColor: `${demo.color}40`,
                      color: demo.color,
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="w-4 h-4 animate-pulse" />
                        <span className="font-mono text-sm">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="font-mono text-sm">Run Inference</span>
                      </>
                    )}
                  </button>

                  {/* Output Area */}
                  {output && (
                    <div className="mt-4 pt-4 border-t border-[rgba(0,212,255,0.1)]">
                      <label className="font-mono text-xs text-[#4a5568] uppercase tracking-wider mb-2 block">
                        Results
                      </label>
                      <div className="space-y-2">
                        {output.map((result, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-lg"
                            style={{ background: `${demo.color}10` }}
                          >
                            <span className="font-mono text-sm text-[#e8eef4]">
                              {result.split(':')[0]}
                            </span>
                            <span
                              className="font-hud text-sm"
                              style={{ color: demo.color }}
                            >
                              {result.split(':')[1]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-8 glass-card p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.1)] flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <p className="font-mono text-sm text-[#8b9aae]">
            These demos run simulated inference for demonstration. 
            Production models are deployed on GPU clusters with &lt;100ms latency.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InferenceDemos;
