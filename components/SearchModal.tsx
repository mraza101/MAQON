import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, ArrowRight, FileText, BarChart3, Rocket, Hash } from 'lucide-react';
import { siteConfig, caseStudies, insights } from '../config';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const services = siteConfig.services.filter(s => 
      s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    ).map(s => ({ type: 'Service', title: s.title, path: s.path, desc: s.shortDesc, icon: Rocket }));

    const studies = caseStudies.filter(c => 
      c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))
    ).map(c => ({ type: 'Case Study', title: c.title, path: '/case-studies', desc: c.metric + ' ' + c.label, icon: BarChart3 }));

    const posts = insights.filter(i => 
      i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q)
    ).map(i => ({ type: 'Insight', title: i.title, path: `/insights/${i.id}`, desc: i.tag, icon: FileText }));

    const pages = [
      { title: 'About Firm', path: '/about', desc: 'Team & Philosophy' },
      { title: 'Contact', path: '/contact', desc: 'Get in touch' },
    ].filter(p => p.title.toLowerCase().includes(q)).map(p => ({ type: 'Page', ...p, icon: Hash }));

    return [...services, ...studies, ...posts, ...pages];
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-10 md:pt-24 px-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-maqon-void/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-maqon-obsidian border border-maqon-border rounded-lg shadow-2xl overflow-hidden animate-slide-up ring-1 ring-maqon-platinum/10">
            
            {/* Search Input */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-maqon-border">
                <Search className="w-5 h-5 text-maqon-teal" />
                <input 
                    autoFocus
                    type="text" 
                    placeholder="Search services, insights, or case studies..." 
                    className="flex-1 bg-transparent border-none text-maqon-platinum placeholder:text-gray-500 focus:ring-0 text-lg outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={onClose} className="p-2 hover:bg-maqon-void rounded-sm text-gray-500 hover:text-maqon-platinum transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                {results.length > 0 ? (
                    <div className="space-y-1">
                        {results.map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleSelect(item.path)}
                                className="w-full flex items-center gap-4 p-4 rounded-sm hover:bg-maqon-void group text-left transition-colors focus:bg-maqon-void focus:outline-none border border-transparent hover:border-maqon-border/50"
                            >
                                <div className="w-10 h-10 rounded-full bg-maqon-teal/10 flex items-center justify-center text-maqon-teal group-hover:bg-maqon-teal group-hover:text-white transition-colors flex-shrink-0">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-maqon-platinum truncate">{item.title}</h4>
                                    <p className="text-xs text-maqon-text mt-0.5 truncate">{item.desc}</p>
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-maqon-teal whitespace-nowrap hidden sm:block">
                                    {item.type}
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                ) : (
                    query && (
                        <div className="p-12 text-center text-gray-500">
                            <p>No results found for <span className="text-maqon-platinum">"{query}"</span></p>
                            <p className="text-xs mt-2">Try searching for "Fundraising", "Growth", or "Dubai"</p>
                        </div>
                    )
                )}
                {!query && (
                    <div className="p-12 text-center text-gray-500/50">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-xs uppercase tracking-widest">Type to search the platform...</p>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="bg-maqon-void border-t border-maqon-border px-6 py-3 flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex gap-4">
                   <span className="hidden sm:inline"><span className="font-bold text-maqon-platinum bg-maqon-border/20 px-1 rounded">Enter</span> to Select</span>
                   <span><span className="font-bold text-maqon-platinum bg-maqon-border/20 px-1 rounded">Esc</span> to Close</span>
                </div>
            </div>
        </div>
    </div>
  );
};