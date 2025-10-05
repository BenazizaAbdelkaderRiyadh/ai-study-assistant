import React from 'react';
import { LightbulbIcon } from './Icons';

interface SummaryViewProps {
  summary: string;
  nextSteps: string[];
}


const formatSummary = (text: string) => {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    const heading2Class = "text-xl font-semibold mt-4 mb-2 text-cyan-600";
    const heading3Class = "text-lg font-semibold mt-3 mb-1 text-cyan-700";
    const listItemClass = "text-slate-600";
    const paragraphClass = "text-slate-600 mb-3";

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            html += `<h2 class="${heading2Class}">${line.substring(2)}</h2>`;
        } else if (line.startsWith('## ')) {
            html += `<h3 class="${heading3Class}">${line.substring(3)}</h3>`;
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            if (!inList) {
                html += '<ul class="list-disc list-inside space-y-1 pl-4">';
                inList = true;
            }
            html += `<li class="${listItemClass}">${line.substring(2)}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (line.trim() !== '') {
                html += `<p class="${paragraphClass}">${line}</p>`;
            }
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
};


const SummaryView: React.FC<SummaryViewProps> = ({ summary, nextSteps }) => {
  const formattedSummary = formatSummary(summary);
  return (
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Summary</h2>
        <div className="bg-white rounded-lg p-4 border border-slate-200"
          dangerouslySetInnerHTML={{ __html: formattedSummary }}
        />
      </div>

      {nextSteps && nextSteps.length > 0 && (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <LightbulbIcon className="w-6 h-6 text-cyan-500" />
                Suggestions for Further Study
            </h3>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
                <ul className="list-disc list-inside space-y-2">
                    {nextSteps.map((step, index) => (
                        <li key={index} className="text-slate-600">{step}</li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default SummaryView;