import React from 'react';
import { siteConfig } from '../config';
import { MapPin, Linkedin, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const About = () => {
  return (
    <div className="bg-maqon-void min-h-screen pb-24 transition-colors duration-500">
       {/* Hero */}
       <section className="pt-28 md:pt-40 pb-20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-maqon-teal/5 blur-[100px] pointer-events-none"></div>
         <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
           <span className="text-maqon-gold text-xs font-bold uppercase tracking-[0.2em] mb-6 block">Our Philosophy</span>
           <h1 className="text-5xl md:text-6xl font-serif text-maqon-platinum mb-10 leading-tight transition-colors">International Operators. <br/>Not Marketers.</h1>
           <p className="text-xl text-maqon-text leading-relaxed font-light transition-colors">
             We founded MAQON because we saw a gap in emerging markets: great founders being held back by "local" standards of operation and capital raising. We bring the rigor of global venture capital and operational excellence to teams in Dubai, Melbourne, and beyond.
           </p>
         </div>
       </section>

       {/* Team Section */}
       <section className="py-20 border-t border-maqon-border bg-maqon-obsidian transition-colors duration-500">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl font-serif text-maqon-platinum mb-16 text-center transition-colors">The Partnership</h2>
           <div className="grid md:grid-cols-3 gap-8">
             {siteConfig.team.map((member) => (
               <div key={member.name} className="group">
                 <div className="bg-maqon-void rounded-sm p-10 h-full border border-maqon-border hover:border-maqon-platinum/20 transition-all hover:-translate-y-1 flex flex-col">
                   <div className="mb-8">
                     <h3 className="text-2xl font-serif text-maqon-platinum mb-2 transition-colors">{member.name}</h3>
                     <span className="text-maqon-teal font-bold text-xs uppercase tracking-widest block mb-4">{member.role}</span>
                     <div className="text-sm font-medium text-maqon-platinum/90 border-l-2 border-maqon-gold pl-3 mb-6 italic">
                       {member.identity}
                     </div>
                   </div>
                   
                   {/* Proof Bullets */}
                   <ul className="space-y-4 mb-8 flex-grow">
                     {member.bullets.map((bullet, idx) => (
                       <li key={idx} className="flex items-start gap-3 text-xs text-maqon-text leading-relaxed">
                         <CheckCircle2 className="w-3.5 h-3.5 text-maqon-teal/70 flex-shrink-0 mt-0.5" />
                         <span>{bullet}</span>
                       </li>
                     ))}
                   </ul>

                   <a href={member.linkedin} className="inline-flex items-center gap-2 text-gray-400 hover:text-maqon-platinum transition-colors text-xs font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm px-1 -ml-1 mt-auto">
                     <Linkedin className="w-4 h-4" /> LinkedIn
                   </a>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="text-center mt-16">
              <p className="text-sm font-serif italic text-maqon-text/60">"We don't sell hype. We ship systems."</p>
           </div>
         </div>
       </section>

       {/* Locations */}
       <section className="py-20 bg-maqon-void transition-colors duration-500">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl font-serif text-maqon-platinum mb-16 text-center transition-colors">Global Presence</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {siteConfig.locations.map((loc) => (
                <div key={loc.city} className="border border-maqon-border rounded-sm p-10 hover:border-maqon-teal/50 transition-colors group">
                  <div className="flex items-center gap-3 mb-6">
                     <MapPin className="w-5 h-5 text-maqon-gold" />
                     <h3 className="text-xl font-serif text-maqon-platinum transition-colors">{loc.city}</h3>
                  </div>
                  <p className="text-maqon-text text-sm mb-6 h-10 transition-colors">{loc.desc}</p>
                  <div className="text-sm text-gray-500 space-y-2 font-mono text-xs">
                    <p>{loc.address}</p>
                    <p className="group-hover:text-maqon-platinum transition-colors">{loc.email}</p>
                    <p>{loc.phone}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
       </section>
       
       {/* CTA */}
       <section className="pt-20 text-center">
          <h3 className="text-2xl font-serif text-maqon-platinum mb-8 transition-colors">Work with the operators.</h3>
          <Button to="/contact" variant="primary">
            Start a Conversation
          </Button>
       </section>
    </div>
  );
};