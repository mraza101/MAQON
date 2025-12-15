import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { insights } from '../config';
import { Clock, ArrowLeft, Linkedin, Twitter, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const InsightDetail = () => {
  const { insightId } = useParams();
  const post = insights.find(p => p.id === insightId);

  if (!post) {
    return <Navigate to="/insights" />;
  }

  return (
    <div className="bg-maqon-void min-h-screen transition-colors duration-500">
      
      {/* Progress Bar (Sticky Top) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-maqon-border z-50">
        <div className="h-full bg-maqon-gold w-full animate-slide-up origin-left"></div>
      </div>

      <article className="pt-28 md:pt-32 pb-24">
        
        {/* Navigation & Header */}
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/insights" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-maqon-platinum transition-colors mb-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm px-1 -ml-1">
            <ArrowLeft className="w-3 h-3" /> Back to Log
          </Link>

          <header className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-maqon-teal/10 text-maqon-teal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                {post.tag}
              </span>
              <span className="text-maqon-text text-[10px] font-bold uppercase tracking-widest">
                {post.date}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-maqon-platinum mb-8 leading-tight transition-colors">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between border-y border-maqon-border py-6">
               <div className="flex items-center gap-2 text-xs font-bold text-maqon-platinum uppercase tracking-widest">
                 <Clock className="w-4 h-4 text-maqon-gold" /> {post.readTime} Read
               </div>
               <div className="flex gap-4">
                 <button className="text-gray-400 hover:text-maqon-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm p-1">
                   <Share2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </header>

          {/* Body Content */}
          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-maqon-platinum prose-p:text-maqon-text prose-p:leading-relaxed prose-strong:text-maqon-platinum prose-li:text-maqon-text max-w-none mb-20 transition-colors">
            {post.content?.map((block, idx) => {
              if (block.type === 'paragraph') {
                return <p key={idx} className="mb-6 font-light">{block.text}</p>;
              }
              if (block.type === 'heading') {
                return <h2 key={idx} className="text-2xl md:text-3xl mt-12 mb-6 font-medium">{block.text}</h2>;
              }
              if (block.type === 'callout') {
                return (
                  <div key={idx} className="my-10 p-8 bg-maqon-midnight border-l-2 border-maqon-gold rounded-r-sm shadow-sm transition-colors">
                    <p className="text-maqon-platinum italic font-serif text-xl m-0">"{block.text}"</p>
                  </div>
                );
              }
              if (block.type === 'list' && Array.isArray(block.items)) {
                return (
                  <ul key={idx} className="space-y-3 my-6 list-none pl-0">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 pl-2">
                        <span className="w-1.5 h-1.5 bg-maqon-teal rounded-full mt-2.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Author Footer */}
          <div className="bg-maqon-obsidian border border-maqon-border rounded-sm p-8 flex items-center gap-6 mb-20 transition-colors">
            <div className="w-16 h-16 bg-maqon-teal text-white font-serif text-2xl flex items-center justify-center rounded-full">
              M
            </div>
            <div>
              <h4 className="font-bold text-maqon-platinum text-sm uppercase tracking-widest mb-1">Written by the Partners</h4>
              <p className="text-xs text-maqon-text leading-relaxed">
                Insights derived from actual operator experience in Dubai, Melbourne, and Frankfurt. We only write about what we have built.
              </p>
            </div>
          </div>

        </div>
      </article>

      {/* Final CTA */}
      <section className="py-20 bg-maqon-midnight text-center border-t border-maqon-border transition-colors">
        <div className="container mx-auto px-6">
           <h2 className="text-3xl font-serif text-maqon-platinum mb-6 transition-colors">Apply these insights to your business.</h2>
           <Button to="/contact" variant="secondary">
              Book a Diagnostic
           </Button>
        </div>
      </section>

    </div>
  );
};