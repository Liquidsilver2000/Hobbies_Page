import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, ExternalLink, Star, ChevronDown, ChevronUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const resources = [
  {
    id: 1,
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    type: 'Book',
    rating: 5,
    category: 'Deep Learning',
    color: '#00d4ff',
    tldr: [
      'Comprehensive foundation covering all major deep learning concepts',
      'Heavy on math - requires linear algebra and calculus background',
      'The definitive reference, not a gentle introduction',
    ],
    link: '#',
  },
  {
    id: 2,
    title: 'Attention Is All You Need',
    author: 'Vaswani et al. (Google Brain)',
    type: 'Paper',
    rating: 5,
    category: 'NLP',
    color: '#39ff14',
    tldr: [
      'Introduced the Transformer architecture that revolutionized NLP',
      'Self-attention mechanism replaces RNNs for parallelization',
      'The foundation for GPT, BERT, and modern LLMs',
    ],
    link: '#',
  },
  {
    id: 3,
    title: 'Pattern Recognition and Machine Learning',
    author: 'Christopher Bishop',
    type: 'Book',
    rating: 5,
    category: 'ML Theory',
    color: '#ffb800',
    tldr: [
      'Rigorous treatment of probabilistic machine learning',
      'Excellent for understanding the statistical foundations',
      'Challenging but rewarding for serious practitioners',
    ],
    link: '#',
  },
  {
    id: 4,
    title: 'ResNet: Deep Residual Learning',
    author: 'He et al. (Microsoft Research)',
    type: 'Paper',
    rating: 5,
    category: 'Computer Vision',
    color: '#ff3860',
    tldr: [
      'Skip connections solve the vanishing gradient problem in deep networks',
      'Enabled training of networks with 100+ layers',
      'Standard architecture for image classification tasks',
    ],
    link: '#',
  },
  {
    id: 5,
    title: 'Designing Machine Learning Systems',
    author: 'Chip Huyen',
    type: 'Book',
    rating: 4,
    category: 'MLOps',
    color: '#a855f7',
    tldr: [
      'Practical guide to production ML system design',
      'Covers data engineering, deployment, and monitoring',
      'Essential for ML engineers moving to production',
    ],
    link: '#',
  },
  {
    id: 6,
    title: 'The Elements of Statistical Learning',
    author: 'Hastie, Tibshirani, Friedman',
    type: 'Book',
    rating: 5,
    category: 'Statistics',
    color: '#00d4ff',
    tldr: [
      'The bible of statistical learning theory',
      'Covers everything from linear regression to random forests',
      'Mathematically rigorous but incredibly insightful',
    ],
    link: '#',
  },
];

const FeaturedResources = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.resource-card',
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
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Curated
          </span>
        </div>
        <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
          Featured Resources
        </h2>
        <p className="text-[#8b9aae] mt-2 max-w-xl">
          Books and papers that fundamentally changed how I think about machine learning.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const isExpanded = expandedId === resource.id;

            return (
              <div
                key={resource.id}
                className="resource-card glass-card overflow-hidden group hover:border-[rgba(0,212,255,0.3)] transition-all duration-300"
              >
                {/* Card Header */}
                <div
                  className="p-6 border-b border-[rgba(0,212,255,0.1)]"
                  style={{ background: `linear-gradient(135deg, ${resource.color}10, transparent)` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${resource.color}20` }}
                    >
                      <BookOpen className="w-5 h-5" style={{ color: resource.color }} />
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(resource.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#ffb800] text-[#ffb800]"
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-mono font-semibold text-[#e8eef4] mb-1 group-hover:text-[#00d4ff] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="font-mono text-xs text-[#8b9aae] mb-2">
                    {resource.author}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs font-mono"
                      style={{ background: `${resource.color}20`, color: resource.color }}
                    >
                      {resource.type}
                    </span>
                    <span className="font-hud text-xs text-[#4a5568]">
                      {resource.category}
                    </span>
                  </div>
                </div>

                {/* TL;DR Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-hud text-xs text-[#00d4ff] uppercase tracking-wider">
                      TL;DR
                    </span>
                    <button
                      onClick={() => toggleExpand(resource.id)}
                      className="text-[#4a5568] hover:text-[#00d4ff] transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <ul className={`space-y-2 ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {resource.tldr.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#8b9aae]"
                      >
                        <span className="text-[#00d4ff] mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Link */}
                  <a
                    href={resource.link}
                    className="mt-4 flex items-center gap-2 text-[#00d4ff] hover:text-[#39ff14] transition-colors font-mono text-sm"
                  >
                    <span>View Resource</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <button className="btn-glass inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-mono text-sm">View Full Library</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;
