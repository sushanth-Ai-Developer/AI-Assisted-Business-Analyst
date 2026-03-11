import React from 'react';
import type { Story, Task } from '../types';

interface StoryCardProps {
  story: Story;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-blue-600 text-sm">{title}</h4>
    <div className="mt-1 text-slate-600 text-sm prose prose-sm prose-slate max-w-none">{children}</div>
  </div>
);

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200/80">
      <h3 className="font-bold text-slate-800">{story.id}: {story.title}</h3>
      <p className="text-sm text-slate-500 mt-1 mb-4 italic">"{story.user_story}"</p>

      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <Section title="Acceptance Criteria (BDD)">
          <div className="space-y-3">
            {story.acceptance_criteria_bdd.map((ac, index) => (
              <div key={index} className="bg-slate-50 p-2 rounded border-l-2 border-blue-400">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {ac}
                </pre>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Definition of Done">
          <ul className="list-disc pl-5">
            {story.definition_of_done.map((dod, index) => (
              <li key={index}>{dod}</li>
            ))}
          </ul>
        </Section>
        <Section title="Tasks">
           <ul className="list-disc pl-5">
            {story.tasks.map((task: Task) => (
              <li key={task.id}>
                {task.task} ({task.estimate_points} pts)
              </li>
            ))}
          </ul>
        </Section>
         <Section title="Details">
          <p><strong>Estimate:</strong> {story.estimate_points} points</p>
          {story.non_functional_requirements.length > 0 && <p><strong>NFRs:</strong> {story.non_functional_requirements.join(', ')}</p>}
          {story.dependencies.length > 0 && <p><strong>Dependencies:</strong> {story.dependencies.join(', ')}</p>}
          {story.risks.length > 0 && <p><strong>Risks:</strong> {story.risks.join(', ')}</p>}
        </Section>
      </div>
    </div>
  );
};

export default StoryCard;