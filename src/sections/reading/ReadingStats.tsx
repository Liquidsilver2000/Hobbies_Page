import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, FileText, Layers, Clock, TrendingUp, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const stats: Stat[] = [
  { icon: BookOpen, label: 'Books Read', value: 47, suffix: '', color: '#00d4ff' },
  { icon: FileText, label: 'Papers Analyzed', value: 156, suffix: '', color: '#39ff14' },
  { icon: Layers, label: 'Topics Covered', value: 23, suffix: '', color: '#ffb800' },
  { icon: Clock, label: 'Hours Invested', value: 1247, suffix: '', color: '#ff3860' },
];

const topicBreakdown = [
  { name: 'Deep Learning', percentage: 35, color: '#00d4ff' },
  { name: 'MLOps', percentage: 20, color: '#39ff14' },
  { name: 'Statistics', percentage: 18, color: '#ffb800' },
  { name: 'Computer Vision', percentage: 15, color: '#ff3860' },
  { name: 'NLP', percentage: 12, color: '#a855f7' },
];

const AnimatedCounter = ({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const ReadingStats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Stats cards reveal
      gsap.fromTo(
        '.stat-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
            onEnter: () => setIsVisible(true),
          },
        }
      );

      // Progress bars animation
      gsap.fromTo(
        '.topic-bar',
        { width: 0 },
        {
          width: '100%',
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.topics-section',
            start: 'top 80%',
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
            Statistics
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Reading Analytics
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Tracking my learning journey through numbers.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-card glass-card-elevated p-6 text-center group hover:border-[rgba(0,212,255,0.3)] transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div
                  className="font-hud text-3xl md:text-4xl mb-2"
                  style={{ color: stat.color }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                </div>
                <span className="font-mono text-xs text-[#4a5568] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Distribution */}
          <div className="topics-section glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
              <h3 className="font-mono font-semibold text-[#e8eef4]">
                Topic Distribution
              </h3>
            </div>

            <div className="space-y-4">
              {topicBreakdown.map((topic, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-[#e8eef4]">
                      {topic.name}
                    </span>
                    <span
                      className="font-hud text-sm"
                      style={{ color: topic.color }}
                    >
                      {topic.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[rgba(17,24,32,0.8)] rounded-full overflow-hidden">
                    <div
                      className="topic-bar h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${topic.percentage}%`,
                        background: topic.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Goals */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-[#39ff14]" />
              <h3 className="font-mono font-semibold text-[#e8eef4]">
                2024 Goals
              </h3>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Books', current: 12, target: 15, color: '#00d4ff' },
                { label: 'Papers', current: 45, target: 50, color: '#39ff14' },
                { label: 'Hours/Month', current: 28, target: 30, color: '#ffb800' },
              ].map((goal, i) => {
                const percentage = (goal.current / goal.target) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-[#e8eef4]">
                        {goal.label}
                      </span>
                      <span className="font-hud text-sm text-[#8b9aae]">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <div className="h-3 bg-[rgba(17,24,32,0.8)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}80)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </div>
                    </div>
                    <span
                      className="font-hud text-xs mt-1 block"
                      style={{ color: goal.color }}
                    >
                      {percentage.toFixed(0)}% complete
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Motivation Quote */}
            <div className="mt-6 p-4 rounded-lg bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)]">
              <p className="font-mono text-sm text-[#8b9aae] italic">
                "The more that you read, the more things you will know. 
                The more that you learn, the more places you'll go."
              </p>
              <span className="font-mono text-xs text-[#4a5568] mt-2 block">
                — Dr. Seuss
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadingStats;
