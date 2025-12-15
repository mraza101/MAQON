import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Services = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Wait slightly for routing/render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight animation class
          element.classList.add('ring-2', 'ring-maqon-gold', 'ring-offset-4', 'ring-offset-maqon-void', 'transition-all', 'duration-1000');
          // Remove it after a few seconds
          setTimeout(() => {
             element.classList.remove('ring-2', 'ring-maqon-gold', 'ring-offset-4', 'ring-offset-maqon-void');
          }, 2000);
        }, 100);
      }
    } else {
        window.scrollTo(0,0);
    }
  }, [location]);

  return (
    <div className="bg-maqon-void min-h-screen pt-28 md:pt-40 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
          <span className="text-maqon-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Our Expertise</span>
          <h1 className="text-5xl md:text-6xl font-serif text-maqon-platinum mb-8 transition-colors">Outcomes. Not Hours.</h1>
          <p className="text-xl text-maqon-text font-light leading-relaxed transition-colors">
            We don't do "retainers for advice". We execute sprints that deliver tangible assets: fundable decks, defensible models, and automated revenue engines.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {siteConfig.services.map((service) => (
            <div key={service.id} id={service.id} className="scroll-mt-32 rounded-sm">
                <Card to={service.path} variant="interactive" className="h-full">
                     <div className="p-10 md:p-14 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                           <div className="w-16 h-16 bg-maqon-void border border-maqon-border rounded-full flex items-center justify-center group-hover:border-maqon-teal/50 group-hover:bg-maqon-teal/10 transition-colors shadow-lg">
                             <service.icon className="w-7 h-7 text-gray-400 group-hover:text-maqon-teal transition-colors" />
                           </div>
                           <span className="text-maqon-gold text-[10px] font-bold uppercase tracking-widest bg-maqon-gold/5 px-4 py-1.5 rounded-full border border-maqon-gold/10">{service.duration}</span>
                        </div>
                        
                        <h2 className="text-3xl font-serif text-maqon-platinum mb-4 transition-colors">{service.title}</h2>
                        <p className="text-maqon-text mb-8 leading-relaxed h-20 transition-colors">{service.description}</p>
                        
                        <div className="space-y-6 mb-12 flex-grow">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-maqon-text/60 mb-4 opacity-70">Best For</h4>
                            <p className="text-sm text-maqon-text">{service.target}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-maqon-text/60 mb-4 opacity-70">You Get</h4>
                            <ul className="space-y-3">
                              {service.deliverables.slice(0,4).map((d, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-maqon-text transition-colors">
                                  <CheckCircle2 className="w-4 h-4 text-maqon-teal/70 group-hover:text-maqon-teal" /> {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-maqon-border group-hover:border-maqon-teal/20 transition-colors flex items-center justify-between">
                          <div>
                             {service.priceStart && (
                                <>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Engagement</div>
                                    <div className="text-maqon-platinum text-xs font-medium transition-colors">{service.priceStart}</div>
                                </>
                             )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-maqon-platinum hover:text-maqon-teal transition-colors group-hover:gap-4">
                            View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                     </div>
                </Card>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};