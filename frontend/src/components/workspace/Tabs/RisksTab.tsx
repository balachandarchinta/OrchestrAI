import { AlertTriangle } from 'lucide-react';
import type { RiskItem } from '../../../types/workspace';

interface RisksTabProps {
  risks: RiskItem[];
}

export default function RisksTab({ risks }: RisksTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Impact</th>
              <th className="px-4 py-3">Mitigation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {risks.map((risk) => (
              <tr key={risk.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                  {risk.impact === 'High' && <AlertTriangle size={14} className="text-red-500" />}
                  {risk.impact === 'Medium' && <AlertTriangle size={14} className="text-amber-500" />}
                  {risk.risk}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                    risk.impact === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                    risk.impact === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {risk.impact}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{risk.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
