import React, { useEffect, useState } from 'react';

interface SplashAnimationProps {
  onComplete: () => void;
}

const SplashAnimation: React.FC<SplashAnimationProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Duration: 6 seconds total
    const exitTimer = setTimeout(() => setIsExiting(true), 5000);
    const finishTimer = setTimeout(onComplete, 6000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // SVG Path representing a stylized but recognizable world map for rotation
  const continentsPath = "M120,80 Q140,70 160,85 T200,80 Q220,90 230,120 Q210,150 180,160 T140,180 Q110,170 100,140 T120,80 M350,100 Q380,90 410,110 T440,140 Q430,180 390,200 T340,180 Q320,150 350,100 M600,120 Q640,110 680,130 T720,160 Q700,220 650,240 T580,210 Q560,170 600,120 M850,150 Q880,140 910,160 T940,190 Q920,240 870,260 T820,230 Q810,190 850,150";

  return (
    <div className={`fixed inset-0 z-[2000] flex items-center justify-center bg-[#010409] overflow-hidden transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* INSTITUTIONAL BACKGROUND */}
      <div className="absolute inset-0 bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)] opacity-80"></div>
      </div>

      {/* THE FINANCIAL GLOBE */}
      <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px] flex items-center justify-center animate-globe-zoom">
        
        {/* ATMOSPHERIC GLOW (Rim Light) */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_120px_rgba(30,64,175,0.15)] border border-blue-500/5"></div>
        
        {/* GLOBE CONTAINER (The Sphere) */}
        <div className="relative w-full h-full rounded-full overflow-hidden mask-sphere shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
          
          {/* BASE SPHERE MATERIAL */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a22] via-[#0f172a] to-[#020617]"></div>

          {/* ROTATING CONTENT (Maps + Data) */}
          <div className="absolute inset-0 flex animate-globe-rotation">
            {/* Layer Section 1 */}
            <div className="w-full h-full flex-shrink-0 relative">
              {/* CONTINENTS MAP */}
              <svg viewBox="0 0 1000 400" className="absolute top-1/2 -translate-y-1/2 w-full h-auto opacity-20 text-blue-300">
                <path d={continentsPath} fill="currentColor" fillRule="evenodd" />
              </svg>

              {/* EMBEDDED MARKET DATA (Lines & Candlesticks) */}
              <svg viewBox="0 0 1000 400" className="absolute top-1/2 -translate-y-1/2 w-full h-auto">
                {/* Horizontal Market Lines */}
                <path d="M50,150 Q150,130 250,160 T450,120 T650,180 T850,140" fill="none" stroke="#22d3ee" strokeWidth="0.7" opacity="0.4" />
                <path d="M50,250 Q200,270 350,230 T550,260 T750,210 T950,240" fill="none" stroke="#60a5fa" strokeWidth="0.5" opacity="0.3" />
                
                {/* Candlestick Clusters */}
                {[100, 300, 500, 700, 900].map((x) => (
                  <g key={x} className="opacity-40">
                    <rect x={x} y={150} width="2" height="20" fill="#22d3ee" />
                    <rect x={x+4} y={140} width="2" height="40" fill="#22d3ee" />
                    <rect x={x+8} y={160} width="2" height="15" fill="#60a5fa" />
                  </g>
                ))}
              </svg>
            </div>

            {/* Layer Section 2 (Looping) */}
            <div className="w-full h-full flex-shrink-0 relative">
              <svg viewBox="0 0 1000 400" className="absolute top-1/2 -translate-y-1/2 w-full h-auto opacity-20 text-blue-300">
                <path d={continentsPath} fill="currentColor" fillRule="evenodd" />
              </svg>
              <svg viewBox="0 0 1000 400" className="absolute top-1/2 -translate-y-1/2 w-full h-auto">
                <path d="M50,150 Q150,130 250,160 T450,120 T650,180 T850,140" fill="none" stroke="#22d3ee" strokeWidth="0.7" opacity="0.4" />
                {[150, 350, 550, 750, 950].map((x) => (
                  <g key={x} className="opacity-40">
                    <rect x={x} y={220} width="2" height="25" fill="#60a5fa" />
                    <rect x={x+4} y={210} width="2" height="45" fill="#60a5fa" />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* 3D SHADING & LIGHTING OVERLAYS */}
          {/* Front Highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,0.1)_0%,transparent_60%)]"></div>
          {/* Depth Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,transparent_0%,rgba(2,6,23,0.9)_90%)]"></div>
          {/* Rim Highlight */}
          <div className="absolute inset-0 rounded-full border border-blue-400/10"></div>
        </div>

        {/* EXTERNAL DATA PULSES (Subtle depth particles) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-700"></div>
        </div>
      </div>

      {/* FOREGROUND BRANDING */}
      <div className="relative z-[50] text-center opacity-0 animate-brand-reveal">
        <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter leading-none select-none">
          FreshLabs
        </h1>
        <div className="mt-8 flex flex-col items-center">
          <div className="h-[1px] w-48 bg-blue-500/20"></div>
          <p className="mt-6 text-blue-400/40 text-xs font-bold uppercase tracking-[0.8em] italic">
            Global Financial Intelligence
          </p>
        </div>
      </div>

      <style>{`
        .mask-sphere {
          -webkit-mask-image: radial-gradient(circle, white 100%, black 100%);
          mask-image: radial-gradient(circle, white 100%, black 100%);
        }

        @keyframes globe-rotation {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes globe-zoom {
          0% { transform: scale(0.95); }
          100% { transform: scale(1.05); }
        }

        @keyframes brand-reveal {
          0% { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .animate-globe-rotation {
          animation: globe-rotation 60s linear infinite;
        }

        .animate-globe-zoom {
          animation: globe-zoom 15s ease-out forwards;
        }

        .animate-brand-reveal {
          animation: brand-reveal 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashAnimation;
