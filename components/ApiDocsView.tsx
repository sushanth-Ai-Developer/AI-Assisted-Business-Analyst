import React from 'react';
import { ApiDocs } from '../types';
import CodeBlock from './CodeBlock';

interface ApiDocsViewProps {
  apiDocs: ApiDocs;
}

const ApiDocsView: React.FC<ApiDocsViewProps> = ({ apiDocs }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">OpenAPI 3.0 Specification</h3>
        <CodeBlock code={apiDocs.openapi_yaml} language="yaml" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">cURL Examples</h3>
        <div className="space-y-4">
            {apiDocs.examples.curl.map((command, index) => (
                <CodeBlock key={index} code={command} language="bash" />
            ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Error Catalog</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">Code</th>
                        <th scope="col" className="px-6 py-3 font-semibold">HTTP Status</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Message</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Remediation</th>
                    </tr>
                </thead>
                <tbody>
                    {apiDocs.error_catalog.map((error, index) => (
                        <tr key={index} className="bg-white border-b border-slate-200/80 last:border-b-0 hover:bg-blue-50/50 even:bg-slate-50/50">
                            <td className="px-6 py-4 font-mono font-semibold text-slate-800">{error.code}</td>
                            <td className="px-6 py-4">{error.http}</td>
                            <td className="px-6 py-4">{error.message}</td>
                            <td className="px-6 py-4">{error.remediation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsView;