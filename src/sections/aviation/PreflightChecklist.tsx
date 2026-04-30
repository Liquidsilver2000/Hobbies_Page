import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Circle, RotateCcw, Plane } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

const initialChecklist: ChecklistCategory[] = [
  {
    name: 'Preflight Inspection',
    items: [
      { id: 'p1', text: 'Fuel quantity and quality check', completed: false },
      { id: 'p2', text: 'Oil level verification', completed: false },
      { id: 'p3', text: 'Control surfaces free and correct', completed: false },
      { id: 'p4', text: 'Landing gear and tires inspection', completed: false },
      { id: 'p5', text: 'Propeller condition check', completed: false },
    ],
  },
  {
    name: 'Cockpit Setup',
    items: [
      { id: 'c1', text: 'Passenger briefing completed', completed: false },
      { id: 'c2', text: 'Seats and belts secured', completed: false },
      { id: 'c3', text: 'Avionics master ON', completed: false },
      { id: 'c4', text: 'ATIS/Weather obtained', completed: false },
      { id: 'c5', text: 'Flight plan filed and activated', completed: false },
    ],
  },
  {
    name: 'Engine Start',
    items: [
      { id: 'e1', text: 'Brakes set and held', completed: false },
      { id: 'e2', text: 'Mixture rich, throttle slightly open', completed: false },
      { id: 'e3', text: 'Master switch ON', completed: false },
      { id: 'e4', text: 'Fuel pump ON (if required)', completed: false },
      { id: 'e5', text: 'Engine instruments in green', completed: false },
    ],
  },
  {
    name: 'Before Takeoff',
    items: [
      { id: 't1', text: 'Flight controls free and correct', completed: false },
      { id: 't2', text: 'Instruments and avionics checked', completed: false },
      { id: 't3', text: 'Fuel selector on both', completed: false },
      { id: 't4', text: 'Mixture rich (as required)', completed: false },
      { id: 't5', text: 'Lights ON as required', completed: false },
    ],
  },
];

const PreflightChecklist = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(initialChecklist);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
    const completed = checklist.reduce(
      (acc, cat) => acc + cat.items.filter((item) => item.completed).length,
      0
    );
    setProgress(Math.round((completed / total) * 100));
  }, [checklist]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.checklist-category',
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

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[categoryIndex].items[itemIndex].completed =
        !newChecklist[categoryIndex].items[itemIndex].completed;
      return newChecklist;
    });
  };

  const resetChecklist = () => {
    setChecklist((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, completed: false })),
      }))
    );
  };

  const allComplete = progress === 100;

  return (
    <section ref={sectionRef} className="py-24 px-6">
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00d4ff]" />
          <span className="font-mono text-sm text-[#00d4ff] uppercase tracking-wider">
            Pre-Flight
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-[#e8eef4]">
              C172 Checklist
            </h2>
            <p className="text-[#8b9aae] mt-2 max-w-xl">
              Interactive pre-flight checklist. Safety first, always.
            </p>
          </div>

          {/* Progress Card */}
          <div className="glass-card px-6 py-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-[#8b9aae]">Completion</span>
              <span
                className={`font-hud text-2xl ${
                  allComplete ? 'text-[#39ff14]' : 'text-[#00d4ff]'
                }`}
              >
                {progress}%
              </span>
            </div>
            <div className="progress-glass h-2">
              <div
                className="progress-glass-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            {allComplete && (
              <div className="mt-3 flex items-center gap-2 text-[#39ff14]">
                <Plane className="w-4 h-4" />
                <span className="font-mono text-sm">Ready for takeoff!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {checklist.map((category, catIndex) => (
            <div
              key={category.name}
              className="checklist-category glass-card p-6 hud-corners"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[rgba(0,212,255,0.1)]">
                <h3 className="font-mono font-semibold text-[#e8eef4]">
                  {category.name}
                </h3>
                <span className="font-hud text-xs text-[#4a5568]">
                  {category.items.filter((i) => i.completed).length}/{category.items.length}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      item.completed
                        ? 'bg-[rgba(57,255,20,0.1)]'
                        : 'hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(catIndex, itemIndex)}
                      className="checkbox-glass"
                    />
                    <span
                      className={`flex-1 font-mono text-sm transition-all duration-300 ${
                        item.completed
                          ? 'text-[#39ff14] line-through opacity-70'
                          : 'text-[#e8eef4]'
                      }`}
                    >
                      {item.text}
                    </span>
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#39ff14] flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#4a5568] flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={resetChecklist}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[rgba(0,212,255,0.2)] text-[#8b9aae] hover:text-[#e8eef4] hover:border-[rgba(0,212,255,0.4)] transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-mono text-sm">Reset Checklist</span>
          </button>
        </div>

        {/* Safety Note */}
        <div className="mt-12 glass-card p-6 border-l-4 border-l-[#ffb800]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,184,0,0.1)] flex items-center justify-center flex-shrink-0">
              <span className="text-[#ffb800] text-lg">⚠</span>
            </div>
            <div>
              <h4 className="font-mono font-semibold text-[#e8eef4] mb-2">
                Safety Reminder
              </h4>
              <p className="text-[#8b9aae] text-sm leading-relaxed">
                This checklist is for demonstration purposes. Always use the official 
                aircraft checklist and follow your flight instructor's guidance. 
                Safety is the pilot's primary responsibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreflightChecklist;
