import React from 'react';
import { Link } from 'react-router-dom';
import { insights } from '../config';
import { ArrowRight, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';

const insightImages: Record<string, string> = {
  "pitch-deck-mistakes": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop", 
  "growth-stack-2024": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", 
  "valuation-defense": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop"
};

export const Insights = () => {
  return (
    <div className="bg-maqon-void min-h-screen pt-28 md:pt-40 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-maqon-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Operator Insights</span>
          <h1 className="text-5xl md:text-6xl font-serif text-maqon-platinum mb-8 transition-colors">The Operator's Log</h1>
          <p className="text-xl text-maqon-text font-light leading-relaxed transition-colors">
            No fluff. Just breakdowns of what's working in capital raising and growth systems right now.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {insights.map((post) => (
             <Card key={post.id} to={`/insights/${post.id}`} variant="interactive">
                
                {/* Card Image Container */}
                <div className="relative overflow-hidden mb-6 aspect-[4/3] border-b border-maqon-border/30">
                   <div className="absolute inset-0 bg-maqon-teal/20 mix-blend-multiply z-10 transition-opacity duration-700 group-hover:opacity-0"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-maqon-obsidian/90 via-transparent to-transparent z-10"></div>
                   <img 
                     src={insightImages[post.id] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2670"} 
                     alt={post.title}
                     className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                   />
                   
                   <div className="absolute top-4 left-4 z-20">
                      <span className="relative overflow-hidden px-3 py-1 bg-white/90 dark:bg-maqon-obsidian/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-maqon-teal border border-maqon-border shadow-sm group-hover:text-maqon-gold transition-colors block">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></span>
                        {post.tag}
                      </span>
                   </div>
                </div>
                
                <div className="px-6 pb-6">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>

                    <h3 className="text-2xl font-serif text-maqon-platinum mb-3 group-hover:text-maqon-teal transition-colors leading-tight">{post.title}</h3>
                    <p className="text-sm text-maqon-text leading-relaxed mb-4 transition-colors line-clamp-2">
                    {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-maqon-platinum uppercase tracking-widest group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
};