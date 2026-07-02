import React from 'react';
import { RaciItem } from '../types';
import { motion } from 'motion/react';
import { Users, ShieldCheck, HelpCircle, Info, Activity } from 'lucide-react';

interface RaciViewProps {
  raci: RaciItem[];
}

const RaciView: React.FC<RaciViewProps> = ({ raci }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">RACI Matrix</h2>
            <p className="text-slate-500 text-sm">Responsibility Assignment Matrix for project activities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 text-blue-700 font-bold mb-1">
              <Activity size={16} />
              <span>Responsible (R)</span>
            </div>
            <p className="text-xs text-blue-600">The person who performs the work to achieve the task.</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold mb-1">
              <ShieldCheck size={16} />
              <span>Accountable (A)</span>
            </div>
            <p className="text-xs text-emerald-600">The person ultimately answerable for the correct completion.</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center space-x-2 text-amber-700 font-bold mb-1">
              <HelpCircle size={16} />
              <span>Consulted (C)</span>
            </div>
            <p className="text-xs text-amber-600">Those whose opinions are sought; two-way communication.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 text-slate-700 font-bold mb-1">
              <Info size={16} />
              <span>Informed (I)</span>
            </div>
            <p className="text-xs text-slate-600">Those kept up-to-date on progress; one-way communication.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">R</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">A</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-amber-600 uppercase tracking-wider">C</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">I</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {raci.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">{item.activity}</td>
                  <td className="px-4 py-4 text-sm text-center text-slate-600">{item.responsible}</td>
                  <td className="px-4 py-4 text-sm text-center text-slate-600 font-semibold">{item.accountable}</td>
                  <td className="px-4 py-4 text-sm text-center text-slate-600">{item.consulted}</td>
                  <td className="px-4 py-4 text-sm text-center text-slate-600">{item.informed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default RaciView;
