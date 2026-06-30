import { Sparkles, ArrowRight } from 'lucide-react';

interface WhyPanelProps {
  confidence: number;
  description: string;
}

export default function WhyPanel({ confidence, description }: WhyPanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-md shadow-lg overflow-hidden mt-8 text-slate-300">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">AI Confidence</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-white">{confidence}%</span>
          </div>
          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded border border-slate-700">
            Human Review Required
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-sm leading-relaxed mb-4 text-slate-300">
          {description}
        </p>
        
        <div className="flex gap-4">
          <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider flex items-center gap-1 transition-colors">
            View Source Documents <ArrowRight size={14} />
          </button>
          <button className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
            Provide Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
