import type { ActionItem } from '../../../types/workspace';

interface ActionPlanTabProps {
  items: ActionItem[];
}

export default function ActionPlanTab({ items }: ActionPlanTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs font-medium border border-slate-200">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{item.task}</td>
                <td className="px-4 py-3">{item.owner}</td>
                <td className="px-4 py-3">{item.due}</td>
                <td className="px-4 py-3 text-slate-400">{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
