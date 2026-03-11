import React, { useState, useMemo } from 'react';
import type { Epic, Story } from '../types';
import Accordion from './ui/Accordion';
import StoryCard from './StoryCard';
import { SearchIcon } from './icons/SearchIcon';
import { FilterIcon } from './icons/FilterIcon';

interface EpicsViewProps {
  epics: Epic[];
}

const EpicsView: React.FC<EpicsViewProps> = ({ epics }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<('High' | 'Medium' | 'Low' | 'All')>('All');

  const filteredEpics = useMemo(() => {
    if (!searchTerm && priorityFilter === 'All') {
      return epics;
    }

    return epics.map(epic => {
      const filteredStories = epic.stories.filter(story => {
        const matchesPriority = priorityFilter === 'All' || epic.priority === priorityFilter;
        
        const matchesSearch = searchTerm.trim() === '' || 
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.user_story.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.id.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesPriority && matchesSearch;
      });

      // Return a new epic object with filtered stories
      return { ...epic, stories: filteredStories };
    }).filter(epic => epic.stories.length > 0); // Only include epics that still have stories after filtering

  }, [epics, searchTerm, priorityFilter]);

  const PriorityBadge: React.FC<{priority: 'High' | 'Medium' | 'Low'}> = ({priority}) => {
    const styles = {
      High: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20',
      Medium: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
      Low: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[priority]}`}>
        {priority}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search stories by title, ID, or content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
              className="appearance-none w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredEpics.length > 0 ? (
        <div className="space-y-4">
          {filteredEpics.map((epic) => (
            <Accordion 
              key={epic.id} 
              title={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg text-slate-800">{epic.id}: {epic.name}</span>
                    <PriorityBadge priority={epic.priority} />
                  </div>
                  <span className="text-sm text-slate-500 pr-4">{epic.stories.length} stories</span>
                </div>
              }
            >
              <div className="p-4 bg-slate-50/50">
                <div className="mb-4 prose prose-slate prose-sm max-w-none">
                    <p><strong>Business Value:</strong> {epic.business_value}</p>
                    {epic.risks.length > 0 && 
                        <div><strong>Risks:</strong> <ul className="list-disc list-inside">{epic.risks.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
                    }
                    {epic.dependencies.length > 0 && 
                        <div><strong>Dependencies:</strong> <ul className="list-disc list-inside">{epic.dependencies.map((d,i)=><li key={i}>{d}</li>)}</ul></div>
                    }
                </div>

                <h4 className="text-md font-semibold text-slate-600 mb-3 mt-6 border-t border-slate-200 pt-4">User Stories</h4>
                <div className="space-y-4">
                  {epic.stories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </div>
            </Accordion>
          ))}
        </div>
      ) : (
         <div className="mt-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-lg p-12 bg-white">
            <h2 className="text-xl font-semibold text-slate-600">No matching epics or stories</h2>
            <p className="mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EpicsView;