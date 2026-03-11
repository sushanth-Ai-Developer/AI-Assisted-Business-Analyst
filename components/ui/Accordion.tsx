import React, { useState } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  startOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-expanded={isOpen}
      >
        <div className="flex-grow">{title}</div>
        <ChevronDownIcon
          className={`h-6 w-6 text-slate-500 transition-transform transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <div className="border-t border-slate-200">{children}</div>}
    </div>
  );
};

export default Accordion;