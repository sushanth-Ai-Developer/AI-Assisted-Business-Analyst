import React from 'react';
import { SummaryIcon, EpicsIcon, DiagramsIcon, ApiIcon } from './icons/NavIcons';

const FeatureCard: React.FC<{icon: React.ElementType, title: string, children: React.ReactNode}> = ({icon: Icon, title, children}) => (
    <div className="flex items-start space-x-4 p-2 -m-2 rounded-lg hover:bg-slate-100/80 transition-colors">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100/80 flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-slate-500 text-sm">{children}</p>
        </div>
    </div>
)

export const Welcome: React.FC = () => (
    <div className="mt-8 p-8 bg-white/50 border-2 border-dashed border-slate-300/80 rounded-xl">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Ready to Build Your Next Product?</h2>
            <div className="mt-4 text-slate-600 max-w-3xl mx-auto space-y-4">
                <p className="font-medium">
                    This application was developed by Sushanth to demonstrate AI-assisted business analysis and document-processing capabilities.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                    <p className="font-bold mb-1">⚠️ Important Security Note</p>
                    <p className="mb-2">
                        Please do not upload confidential, sensitive, personal, financial, or production documents. 
                        Data uploaded here may not be fully secured or intended for real business use.
                    </p>
                </div>
                <p className="text-sm italic">
                    For testing and evaluation, please use only the sample files and test data provided by Sushanth.
                </p>
            </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={SummaryIcon} title="Summary & Insights">
                Get a clear overview, KPIs, assumptions, and open questions.
            </FeatureCard>
            <FeatureCard icon={EpicsIcon} title="Epics & User Stories">
                Generate structured epics with BDD-style user stories.
            </FeatureCard>
            <FeatureCard icon={DiagramsIcon} title="Visual Diagrams">
                Visualize workflows with Gantt, Flow, and Sequence diagrams.
            </FeatureCard>
            <FeatureCard icon={ApiIcon} title="API Specifications">
                Create OpenAPI 3.0 specs with examples and error catalogs.
            </FeatureCard>
        </div>
    </div>
);