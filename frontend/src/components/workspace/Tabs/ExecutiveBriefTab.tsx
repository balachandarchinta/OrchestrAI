import type { DecisionBriefSection } from '../../../types/workspace';

interface ExecutiveBriefTabProps {
  sections: DecisionBriefSection[];
}

export default function ExecutiveBriefTab({ sections }: ExecutiveBriefTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
            <h3 className="text-sm font-bold text-slate-800 mb-2">{section.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
