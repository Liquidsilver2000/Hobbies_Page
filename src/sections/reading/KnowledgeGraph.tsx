import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network, Info, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Knowledge nodes
const nodes = [
  // Core ML Concepts
  { id: 1, label: 'Machine\nLearning', group: 'core', size: 40 },
  { id: 2, label: 'Deep\nLearning', group: 'core', size: 35 },
  { id: 3, label: 'Reinforcement\nLearning', group: 'core', size: 30 },
  { id: 4, label: 'NLP', group: 'core', size: 32 },
  { id: 5, label: 'Computer\nVision', group: 'core', size: 32 },
  
  // Algorithms
  { id: 6, label: 'Neural\nNetworks', group: 'algorithms', size: 28 },
  { id: 7, label: 'Transformers', group: 'algorithms', size: 30 },
  { id: 8, label: 'CNN', group: 'algorithms', size: 26 },
  { id: 9, label: 'RNN/LSTM', group: 'algorithms', size: 24 },
  { id: 10, label: 'GANs', group: 'algorithms', size: 22 },
  { id: 11, label: 'Random\nForest', group: 'algorithms', size: 20 },
  { id: 12, label: 'SVM', group: 'algorithms', size: 18 },
  
  // Mathematics
  { id: 13, label: 'Linear\nAlgebra', group: 'math', size: 28 },
  { id: 14, label: 'Calculus', group: 'math', size: 26 },
  { id: 15, label: 'Probability', group: 'math', size: 28 },
  { id: 16, label: 'Statistics', group: 'math', size: 26 },
  { id: 17, label: 'Optimization', group: 'math', size: 24 },
  
  // Engineering
  { id: 18, label: 'MLOps', group: 'engineering', size: 26 },
  { id: 19, label: 'Data\nPipelines', group: 'engineering', size: 24 },
  { id: 20, label: 'Distributed\nSystems', group: 'engineering', size: 22 },
  { id: 21, label: 'Cloud\nComputing', group: 'engineering', size: 22 },
  
  // Tools
  { id: 22, label: 'PyTorch', group: 'tools', size: 24 },
  { id: 23, label: 'TensorFlow', group: 'tools', size: 22 },
  { id: 24, label: 'JAX', group: 'tools', size: 18 },
  { id: 25, label: 'Scikit-learn', group: 'tools', size: 20 },
];

// Connections (edges)
const edges = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 2, to: 6 },
  { from: 2, to: 7 },
  { from: 2, to: 8 },
  { from: 2, to: 9 },
  { from: 2, to: 10 },
  { from: 4, to: 7 },
  { from: 5, to: 8 },
  { from: 6, to: 13 },
  { from: 6, to: 14 },
  { from: 6, to: 17 },
  { from: 1, to: 15 },
  { from: 1, to: 16 },
  { from: 2, to: 22 },
  { from: 2, to: 23 },
  { from: 2, to: 24 },
  { from: 1, to: 25 },
  { from: 18, to: 19 },
  { from: 18, to: 20 },
  { from: 18, to: 21 },
  { from: 2, to: 18 },
  { from: 13, to: 15 },
  { from: 15, to: 16 },
];

const groupColors: Record<string, string> = {
  core: '#00d4ff',
  algorithms: '#39ff14',
  math: '#ffb800',
  engineering: '#ff3860',
  tools: '#a855f7',
};

const KnowledgeGraph = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<typeof nodes[0] | null>(null);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number | null>(null);
  const nodePositions = useRef<Map<number, { x: number; y: number; vx: number; vy: number }>>(new Map());

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.graph-container',
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

  // Initialize node positions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 100 + Math.random() * 150;
      nodePositions.current.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      });
    });
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw edges
      edges.forEach((edge) => {
        const fromPos = nodePositions.current.get(edge.from);
        const toPos = nodePositions.current.get(edge.to);
        if (!fromPos || !toPos) return;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        const color = groupColors[node.group];
        const isHovered = hoveredNode?.id === node.id;

        // Node glow
        if (isHovered) {
          const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, node.size * 1.5);
          gradient.addColorStop(0, `${color}40`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, node.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isHovered ? node.size * 0.6 : node.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${color}30`;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#e8eef4';
        ctx.font = `${isHovered ? 'bold' : 'normal'} 11px "JetBrains Mono"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = node.label.split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, pos.x, pos.y + (i - (lines.length - 1) / 2) * 14);
        });
      });

      // Apply gentle forces
      nodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        // Center attraction
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const dx = centerX - pos.x;
        const dy = centerY - pos.y;
        pos.vx += dx * 0.0001;
        pos.vy += dy * 0.0001;

        // Repulsion from other nodes
        nodes.forEach((other) => {
          if (other.id === node.id) return;
          const otherPos = nodePositions.current.get(other.id);
          if (!otherPos) return;

          const odx = pos.x - otherPos.x;
          const ody = pos.y - otherPos.y;
          const dist = Math.sqrt(odx * odx + ody * ody);
          if (dist < 100 && dist > 0) {
            pos.vx += (odx / dist) * 0.05;
            pos.vy += (ody / dist) * 0.05;
          }
        });

        // Damping
        pos.vx *= 0.95;
        pos.vy *= 0.95;

        // Update position
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Boundary constraints
        pos.x = Math.max(node.size, Math.min(rect.width - node.size, pos.x));
        pos.y = Math.max(node.size, Math.min(rect.height - node.size, pos.y));
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find hovered node
    let found = null;
    for (const node of nodes) {
      const pos = nodePositions.current.get(node.id);
      if (!pos) continue;

      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.size * 0.6) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.5));
  const handleReset = () => setScale(1);

  return (
    <section id="knowledge-graph" ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Knowledge Map
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Connected Concepts
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Hover over nodes to explore connections. Each concept links to resources that helped me understand it.
        </p>
      </div>

      {/* Graph Container */}
      <div className="graph-container max-w-[1400px] mx-auto">
        <div className="glass-card-elevated p-1 relative">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-[#8b9aae] hover:text-[#00d4ff] transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-[#8b9aae] hover:text-[#00d4ff] transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-[#8b9aae] hover:text-[#00d4ff] transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute top-4 left-4 z-10 glass-panel p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#00d4ff]" />
              <span className="font-mono text-sm text-[#e8eef4]">Categories</span>
            </div>
            <div className="space-y-2">
              {Object.entries(groupColors).map(([group, color]) => (
                <div key={group} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="font-mono text-xs text-[#8b9aae] capitalize">
                    {group}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredNode(null)}
            className="w-full h-[500px] md:h-[600px] rounded-xl cursor-crosshair"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />

          {/* Node Info Panel */}
          {hoveredNode && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 glass-card-elevated p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${groupColors[hoveredNode.group]}20` }}
                >
                  <Network
                    className="w-5 h-5"
                    style={{ color: groupColors[hoveredNode.group] }}
                  />
                </div>
                <div>
                  <h4 className="font-mono font-semibold text-[#e8eef4]">
                    {hoveredNode.label.replace('\n', ' ')}
                  </h4>
                  <span
                    className="font-hud text-xs uppercase"
                    style={{ color: groupColors[hoveredNode.group] }}
                  >
                    {hoveredNode.group}
                  </span>
                </div>
              </div>
              <p className="font-mono text-sm text-[#8b9aae]">
                Connected to {edges.filter((e) => e.from === hoveredNode.id || e.to === hoveredNode.id).length} concepts
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeGraph;
