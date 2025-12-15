import React, { useState } from 'react';
import { caseStudies } from '../config';
import { X, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const CaseStudies = () => {
  const [selectedCase, setSelectedCase] = useState<typeof caseStudies[0] | null>(null);

  return (
    <div className="bg-maqon-void min-h-screen pt-28 md:pt-40 pb-20 transition-colors duration-500 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-maqon-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Proven Results</span>
          <h1 className="text-5xl md:text-6xl font-serif text-maqon-platinum mb-8 transition-colors">Selected Outcomes</h1>
          <p className="text-xl text-maqon-text font-light leading-relaxed transition-colors">
            Real metrics from real sprints. Due to strict NDAs with our family office and stealth clients, selected details are anonymized.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {caseStudies.map((cs) => (
            <Card key={cs.id} variant="interactive" className="h-full" onClick={() => setSelectedCase(cs)}>
               <div className="p-8 flex flex-col h-full">
                    {/* Metric Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="text-4xl md:text-5xl font-serif text-maqon-platinum transition-colors group-hover:text-maqon-teal">{cs.metric}</div>
                            <div className="text-[10px] uppercase tracking-widest text-maqon-teal font-bold mt-1">{cs.label}</div>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest text-right">{cs.location}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-maqon-platinum mb-4 transition-colors group-hover:text-maqon-teal">{cs.title}</h3>
                    
                    <p className="text-sm text-maqon-text mb-6 leading-relaxed line-clamp-3">
                        {cs.desc}
                    </p>

                    {/* Impact Summary Highlight */}
                    <div className="mb-8 p-3 bg-maqon-teal/5 border-l-2 border-maqon-teal rounded-r-sm">
                        <p className="text-xs text-maqon-text"><span className="font-bold text-maqon-teal uppercase tracking-wider text-[10px] mr-1">Outcome:</span>{cs.results[0]}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        {cs.tags.slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-1 bg-maqon-text/5 text-gray-500 text-[9px] uppercase tracking-wider rounded-sm border border-transparent group-hover:border-maqon-teal/20 transition-colors">
                            {t}
                        </span>
                        ))}
                    </div>

                    <div className="w-full py-4 border border-maqon-border text-maqon-platinum text-xs font-bold uppercase tracking-widest group-hover:bg-maqon-teal group-hover:text-white group-hover:border-maqon-teal transition-all rounded-sm flex items-center justify-center gap-2 group-hover:gap-3">
                        Read Summary <ArrowRight className="w-3 h-3" />
                    </div>
               </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Modal Overlay */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-maqon-void/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedCase(null)}>
          <div 
            className="bg-maqon-obsidian border border-maqon-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative animate-slide-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCase(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-maqon-platinum transition-colors focus:outline-none p-2 hover:bg-maqon-void rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                 <span className="bg-maqon-teal/10 text-maqon-teal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                   Case Study
                 </span>
                 <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                   {selectedCase.location}
                 </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-maqon-platinum mb-6 leading-tight">{selectedCase.title}</h2>
              
              <div className="flex items-center gap-4 mb-10 pb-10 border-b border-maqon-border">
                <div>
                   <div className="text-5xl font-serif text-maqon-gold mb-2">{selectedCase.metric}</div>
                   <div className="text-[10px] uppercase tracking-widest text-maqon-text font-bold flex items-center gap-2">
                     <TrendingUp className="w-3 h-3" /> {selectedCase.label}
                   </div>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-maqon-platinum mb-4 border-l-2 border-maqon-teal pl-3">The Challenge</h3>
                  <p className="text-maqon-text leading-relaxed font-light text-lg">
                    {selectedCase.fullDesc}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-maqon-platinum mb-4 border-l-2 border-maqon-gold pl-3">Key Results</h3>
                  <ul className="grid gap-3">
                    {selectedCase.results.map((result, i) => (
                      <li key={i} className="flex items-center gap-4 bg-maqon-void/50 p-4 rounded-sm border border-maqon-border hover:border-maqon-teal/30 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-maqon-teal/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-3 h-3 text-maqon-teal" />
                        </div>
                        <span className="text-sm text-maqon-platinum font-medium">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-maqon-border flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden md:block">Confidential Client Data</span>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="text-xs font-bold uppercase tracking-widest text-maqon-text hover:text-maqon-platinum transition-colors px-4 py-2 hover:bg-maqon-void rounded-sm"
                >
                  Close Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};