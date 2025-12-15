import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { siteConfig } from '../config';
import { CheckCircle2, ArrowRight, Clock, DollarSign, Plus, Minus, Download, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = siteConfig.services.find(s => s.id === serviceId);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  if (!service) {
    return <Navigate to="/services" />;
  }

  const isInvestment = serviceId === 'investment-readiness';

  return (
    <div className="bg-maqon-void min-h-screen transition-colors duration-500">
      {/* 1. Hero */}
      <section className="pt-28 md:pt-40 pb-20 relative overflow-hidden border-b border-maqon-border">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-maqon-teal/5 blur-3xl pointer-events-none"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <span className="text-maqon-gold text-xs font-bold uppercase tracking-[0.2em] mb-6 block">{service.tagline}</span>
              <h1 className="text-5xl md:text-6xl font-serif text-maqon-platinum mb-8 leading-tight transition-colors">{service.title}</h1>
              <p className="text-xl text-maqon-text mb-10 max-w-2xl font-light leading-relaxed transition-colors">{service.description}</p>
              
              <ul className="space-y-4 mb-12">
                {service.deliverables.slice(0,3).map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-maqon-platinum transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-maqon-teal" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button to="/contact" variant="primary">
                  Book Diagnostic Call
                </Button>
                <Button variant="outline" className="gap-3">
                  <Download className="w-4 h-4" /> Capabilities PDF
                </Button>
              </div>
            </div>
         </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-20">
            
            {/* 2. Qualification */}
            <section>
              <h2 className="text-2xl font-serif text-maqon-platinum mb-8 transition-colors">Who This Is For</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {service.bestFor?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-maqon-midnight rounded border border-maqon-border transition-colors">
                    <div className="w-1.5 h-1.5 bg-maqon-gold rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-400 dark:text-gray-300 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Deliverables */}
            <section>
              <h2 className="text-2xl font-serif text-maqon-platinum mb-8 transition-colors">Hard Deliverables</h2>
              <div className="bg-maqon-midnight border border-maqon-border rounded-lg p-8 transition-colors">
                 <ul className="grid gap-6">
                   {service.deliverables.map((item, i) => (
                     <li key={i} className="flex items-start gap-4">
                       <CheckCircle2 className="w-5 h-5 text-maqon-teal mt-0.5 flex-shrink-0" />
                       <span className="text-gray-400 dark:text-gray-300 text-sm transition-colors">{item}</span>
                     </li>
                   ))}
                 </ul>
              </div>
            </section>

            {/* 4. Process & 5. Timeline */}
            <section>
               <h2 className="text-2xl font-serif text-maqon-platinum mb-8 transition-colors">The Sprint Timeline</h2>
               <div className="space-y-4">
                 {service.timeline?.map((step, i) => (
                   <div key={i} className="border border-maqon-border rounded-lg bg-maqon-obsidian overflow-hidden transition-colors">
                     <button 
                       onClick={() => setOpenAccordion(openAccordion === step.week ? null : step.week)}
                       className="w-full flex items-center justify-between p-6 text-left hover:bg-maqon-platinum/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-maqon-gold"
                     >
                       <div className="flex items-center gap-6">
                         <span className="text-xs font-bold uppercase tracking-widest text-maqon-gold w-16">{step.week}</span>
                         <span className="font-bold text-maqon-platinum transition-colors">{step.title}</span>
                       </div>
                       {openAccordion === step.week ? <Minus className="w-4 h-4 text-maqon-teal" /> : <Plus className="w-4 h-4 text-gray-500" />}
                     </button>
                     {openAccordion === step.week && (
                       <div className="px-6 pb-6 pl-28 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-maqon-border/50 pt-4 transition-colors">
                         {step.desc}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </section>

            {/* 7. FAQs */}
            <section>
              <h2 className="text-2xl font-serif text-maqon-platinum mb-8 transition-colors">Common Questions</h2>
              <div className="space-y-6">
                {service.faqs?.map((faq, i) => (
                  <div key={i}>
                    <h3 className="text-maqon-platinum font-bold text-sm mb-2 transition-colors">{faq.q}</h3>
                    <p className="text-maqon-text text-sm leading-relaxed transition-colors">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (Sticky Summary) */}
          <div className="lg:col-span-1">
             <div className="sticky top-32 space-y-8">
                <div className="glass-panel p-8 rounded-lg border border-maqon-teal/20">
                   <div className="flex items-center justify-between mb-8 pb-6 border-b border-maqon-border">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Duration</div>
                        <div className="text-maqon-platinum font-bold flex items-center gap-2 transition-colors">
                           <Clock className="w-4 h-4 text-maqon-teal" /> {service.duration}
                        </div>
                      </div>
                      <div className="text-right">
                         {service.priceStart && (
                            <>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Engagement</div>
                                <div className="text-maqon-platinum text-xs font-bold flex items-center gap-2 justify-end transition-colors max-w-[120px] ml-auto">
                                {service.priceStart}
                                </div>
                            </>
                         )}
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                     <Button to="/contact" variant="secondary" className="w-full">
                       Book Diagnostic
                     </Button>
                     <p className="text-center text-[10px] text-gray-500">
                       Strictly limited capacity per month.
                     </p>
                   </div>
                </div>

                {isInvestment && (
                   <div className="p-6 rounded-lg bg-gradient-to-br from-maqon-gold/10 to-transparent border border-maqon-gold/20">
                      <h4 className="text-maqon-gold font-bold text-sm mb-2">Investor Intros?</h4>
                      <p className="text-xs text-maqon-text leading-relaxed transition-colors">
                        We offer selective introductions to our Dubai & Frankfurt network for clients who pass our readiness audit. This is merit-based and never guaranteed.
                      </p>
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* 8. Final CTA Band */}
      <section className="py-24 bg-maqon-midnight text-center border-t border-maqon-border transition-colors">
        <div className="container mx-auto px-6">
           <h2 className="text-3xl font-serif text-maqon-platinum mb-8 transition-colors">Ready to build?</h2>
           <Button to="/contact" variant="primary">
             Start {service.title}
           </Button>
        </div>
      </section>
    </div>
  );
};