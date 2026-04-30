import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, Lightbulb, Calendar, XCircle, Skull, Brain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const failures = [
  {
    id: 1,
    date: '2024-03-15',
    title: 'The Vanishing Gradient',
    problem: 'Deep LSTM network stopped learning after epoch 5. Loss plateaued at 2.3.',
    cause: 'Gradient vanishing due to poor initialization and no skip connections.',
    solution: 'Switched to GRU with layer normalization. Added residual connections.',
    lesson: 'Always check gradient norms during training. If they drop to near zero, you have a vanishing gradient problem.',
    icon: Brain,
    color: '#ff3860',
  },
  {
    id: 2,
    date: '2024-02-28',
    title: 'Data Leakage Nightmare',
    problem: 'Model achieved 99.2% accuracy on test set. Too good to be true.',
    cause: 'Test samples were accidentally included in the training data augmentation pipeline.',
    solution: 'Implemented strict train/val/test splits before any preprocessing. Added data lineage tracking.',
    lesson: 'If results seem too good, they probably are. Always verify data pipelines end-to-end.',
    icon: XCircle,
    color: '#ffb800',
  },
  {
    id: 3,
    date: '2024-01-20',
    title: 'The Wrong Loss Function',
    problem: 'Segmentation model produced blurry boundaries. IoU stuck at 0.45.',
    cause: 'Using MSE loss for a segmentation task. Does not penalize boundary errors properly.',
    solution: 'Switched to Dice loss + Focal loss combination. Added boundary-aware terms.',
    lesson: 'Choose loss functions that align with your evaluation metrics and task requirements.',
    icon: AlertTriangle,
    color: '#00d4ff',
  },
  {
    id: 4,
    date: '2023-12-10',
    title: 'Overfitting to the Moon',
    problem: 'Training accuracy 98%, validation accuracy 62%. Classic overfit.',
    cause: 'Model too large for dataset size (10M params, 5K samples). Insufficient regularization.',
    solution: 'Reduced model capacity. Added dropout (0.5), data augmentation, early stopping.',
    lesson: 'Start simple. Add complexity only when justified by validation metrics.',
    icon: Skull,
    color: '#39ff14',
  },
  {
    id: 5,
    date: '2023-11-05',
    title: 'Batch Size Blunder',
    problem: 'Training unstable. Loss oscillating wildly between batches.',
    cause: 'Batch size of 4 on a dataset with high variance. Gradients too noisy.',
    solution: 'Increased batch size to 64. Added gradient accumulation for memory constraints.',
    lesson: 'Small batches give noisy gradients. Find the sweet spot between stability and memory.',
    icon: Lightbulb,
    color: '#ffb800',
  },
];

const FailureLog = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Timeline line animation
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards stagger reveal
      gsap.fromTo(
        '.failure-card',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
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
          <div className="w-8 h-px bg-[#ff3860]" />
          <span className="font-mono text-sm text-[#ff3860] uppercase tracking-wider">
            Lessons Learned
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          The Failure Log
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Documenting what went wrong is as important as celebrating successes. 
          Every failure taught me something valuable.
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="max-w-[1400px] mx-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#ff3860] via-[#ffb800] to-[#39ff14] origin-top" />

          {/* Failure Cards */}
          <div className="space-y-8">
            {failures.map((failure, index) => {
              const Icon = failure.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={failure.id}
                  className={`failure-card relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0e14] border-2 z-10"
                    style={{ borderColor: failure.color }}
                  />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="glass-card-elevated p-6 group hover:border-[rgba(255,56,96,0.3)] transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: `${failure.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: failure.color }} />
                          </div>
                          <div>
                            <h3 className="font-mono font-semibold text-[#e8eef4]">
                              {failure.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[#4a5568]">
                              <Calendar className="w-3 h-3" />
                              <span className="font-mono text-xs">{failure.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Problem */}
                      <div className="mb-4">
                        <span className="font-hud text-xs text-[#ff3860] uppercase tracking-wider">
                          The Problem
                        </span>
                        <p className="font-mono text-sm text-[#e8eef4] mt-1">
                          {failure.problem}
                        </p>
                      </div>

                      {/* Root Cause */}
                      <div className="mb-4">
                        <span className="font-hud text-xs text-[#ffb800] uppercase tracking-wider">
                          Root Cause
                        </span>
                        <p className="font-mono text-sm text-[#8b9aae] mt-1">
                          {failure.cause}
                        </p>
                      </div>

                      {/* Solution */}
                      <div className="mb-4">
                        <span className="font-hud text-xs text-[#00d4ff] uppercase tracking-wider">
                          Solution
                        </span>
                        <p className="font-mono text-sm text-[#e8eef4] mt-1">
                          {failure.solution}
                        </p>
                      </div>

                      {/* Key Lesson */}
                      <div className="pt-4 border-t border-[rgba(0,212,255,0.1)]">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-4 h-4 text-[#39ff14] flex-shrink-0 mt-0.5" />
                          <p className="font-mono text-sm text-[#39ff14]">
                            {failure.lesson}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 glass-card p-6 border-l-4 border-l-[#39ff14]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[rgba(57,255,20,0.1)] flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[#39ff14]" />
            </div>
            <div>
              <h4 className="font-mono font-semibold text-[#e8eef4] mb-2">
                The Meta-Lesson
              </h4>
              <p className="font-mono text-sm text-[#8b9aae] leading-relaxed">
                Every failed experiment taught me more than the successes. The key is to 
                document failures systematically, understand the root cause, and build 
                safeguards to prevent recurrence. In ML, failure is not just an option—it's 
                a requirement for growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FailureLog;
