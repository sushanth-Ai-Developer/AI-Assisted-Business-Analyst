import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, HelpCircle, BookOpen, FileText, Code, Download } from 'lucide-react';

interface QA {
  question: string;
  answer: string;
  keywords: string[];
}

const KNOWLEDGE_BASE: QA[] = [
  {
    question: "What is a BRD?",
    answer: "A Business Requirements Document (BRD) describes the high-level business needs and goals of a project. It focuses on 'what' the business wants to achieve rather than 'how' it will be technically implemented.",
    keywords: ["brd", "business", "requirements", "document"]
  },
  {
    question: "What is an Epic?",
    answer: "An Epic is a large body of work that can be broken down into smaller, more manageable tasks called User Stories. It represents a significant feature or functionality in the product.",
    keywords: ["epic", "feature", "large"]
  },
  {
    question: "What is a User Story?",
    answer: "A User Story is an informal, general explanation of a software feature written from the perspective of the end user. It typically follows the format: 'As a [user], I want [goal] so that [benefit]'.",
    keywords: ["story", "user story", "invest"]
  },
  {
    question: "What is INVEST?",
    answer: "INVEST is a mnemonic for the qualities of a good user story: Independent, Negotiable, Valuable, Estimable, Small, and Testable.",
    keywords: ["invest", "quality", "criteria"]
  },
  {
    question: "How do I export data?",
    answer: "You can export your analysis results using the 'Download' buttons in the Dashboard. We support Excel (.xlsx) and ZIP formats containing all generated artifacts.",
    keywords: ["export", "download", "excel", "zip", "csv"]
  },
  {
    question: "What is Mermaid.js?",
    answer: "Mermaid.js is a JavaScript-based diagramming and charting tool that uses Markdown-like text definitions to create and modify diagrams dynamically. This app uses it to generate your process flows and dependency graphs.",
    keywords: ["mermaid", "diagram", "flow", "chart"]
  },
  {
    question: "What is an OpenAPI spec?",
    answer: "An OpenAPI Specification (formerly Swagger) is a standard for defining RESTful APIs. It allows both humans and computers to discover and understand the capabilities of a service without access to source code.",
    keywords: ["api", "openapi", "swagger", "spec", "rest"]
  },
  {
    question: "Who created this app?",
    answer: "This application was developed by Sushanth to demonstrate AI-assisted business analysis and document-processing capabilities.",
    keywords: ["sushanth", "author", "creator", "who"]
  }
];

export const SupportBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hi! I'm your Business Analysis Assistant. How can I help you today?" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    // Simple matching logic
    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      let bestMatch: QA | null = null;
      let maxMatches = 0;

      KNOWLEDGE_BASE.forEach(qa => {
        let matches = 0;
        qa.keywords.forEach(kw => {
          if (lowerMsg.includes(kw)) matches++;
        });
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = qa;
        }
      });

      if (bestMatch) {
        setMessages(prev => [...prev, { role: 'bot', text: (bestMatch as QA).answer }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: "I'm not sure about that. Try asking about BRDs, Epics, User Stories, or how to export data." 
        }]);
      }
    }, 500);
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
    // We could trigger send immediately but let's just fill the input for better UX
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            style={{ maxHeight: '500px' }}
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HelpCircle size={20} />
                <span className="font-bold">Support Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 min-h-[300px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
                {["What is a BRD?", "What is an Epic?", "How to export?"].map(q => (
                  <button 
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                onClick={handleSend}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};
