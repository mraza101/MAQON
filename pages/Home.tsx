import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, ChevronDown, Rocket, BarChart, Globe, Zap, LayoutGrid, Hexagon, Plus, Minus, Clock, FileText } from 'lucide-react';
import { siteConfig, methodology, insights } from '../config';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// --- Assets ---
const insightImages: Record<string, string> = {
  "pitch-deck-mistakes": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop", 
  "growth-stack-2024": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop", 
  "valuation-defense": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop"
};

// --- Visual Primitives ---

const MaqonCosmicObject = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-96 h-96 flex items-center justify-center">
       
       {/* 1. Volumetric Glow (Back) */}
       <div className="absolute w-64 h-64 bg-maqon-teal/20 blur-[80px] rounded-full animate-pulse-slow"></div>

       {/* 2. The Signature Mark (Animated) */}
       <div className="relative w-48 h-48 animate-breathe z-10">
          {/* Main Diamond Container */}
          <div className="absolute inset-0 border border-maqon-teal/40 bg-maqon-teal/5 backdrop-blur-sm rotate-45 overflow-hidden shadow-[0_0_30px_rgba(0,95,107,0.15)] rounded-sm">
             {/* Internal Architecture Lines (Negative Space Cube Illusion) */}
             <div className="absolute inset-0 border-[0.5px] border-maqon-platinum/10"></div>
             
             {/* The "Cut" - creating dimension */}
             <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-maqon-platinum/5 to-transparent border-l border-b border-maqon-teal/30"></div>
             <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-maqon-void/40 to-transparent border-r border-t border-maqon-teal/30"></div>
             
             {/* Noise Texture Overlay */}
             <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] mix-blend-overlay"></div>
          </div>
          
          {/* Accent Corners for Precision Feel */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-maqon-gold/80"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-maqon-gold/80"></div>
       </div>

       {/* 3. Orbital Rings (The "Cosmic" aspect) */}
       <div className="absolute w-[130%] h-[130%] border border-dashed border-maqon-border rounded-full opacity-30 animate-spin-slow-reverse pointer-events-none"></div>
       <div className="absolute w-[160%] h-[160%] border border-maqon-border/60 rounded-full opacity-20 animate-spin-slow pointer-events-none"></div>

    </div>
  </div>
);

const SectionHeading = ({ kicker, title }: { kicker: string, title: string }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-8 bg-maqon-gold"></div>
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-maqon-gold">{kicker}</span>
    </div>
    <h2 className="font-serif text-3xl md:text-5xl text-maqon-platinum leading-tight transition-colors">{title}</h2>
  </div>
);

// --- Sections ---

const PathSelector = () => {
    return (
        <div className="grid md:grid-cols-2 gap-4 animate-slide-up mt-8 mb-16" style={{ animationDelay: '0.3s' }}>
            <Card to="/services#investment-readiness" variant="interactive" className="p-5 md:p-6 bg-maqon-midnight/80 border-maqon-border/80 hover:border-maqon-teal hover:bg-maqon-midnight hover:shadow-[0_0_30px_rgba(0,95,107,0.15)] group transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-maqon-void border border-maqon-border rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-maqon-teal group-hover:border-maqon-teal transition-all duration-300 shadow-sm">
                        <FileText className="w-5 h-5 text-maqon-gold group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-serif font-medium text-maqon-platinum mb-1 group-hover:text-white transition-colors">Investor Readiness</h3>
                        <p className="text-[10px] font-medium text-maqon-text/80 uppercase tracking-wider mb-3 group-hover:text-maqon-platinum/90 transition-colors">Model • Deck • Data Room</p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-maqon-teal flex items-center gap-2 group-hover:gap-3 group-hover:text-maqon-gold transition-all">
                            Explore <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </Card>

            <Card to="/services#revenue-engine" variant="interactive" className="p-5 md:p-6 bg-maqon-midnight/80 border-maqon-border/80 hover:border-maqon-teal hover:bg-maqon-midnight hover:shadow-[0_0_30px_rgba(0,95,107,0.15)] group transition-all duration-300 transform hover:-translate-y-1">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-maqon-void border border-maqon-border rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-maqon-teal group-hover:border-maqon-teal transition-all duration-300 shadow-sm">
                        <BarChart className="w-5 h-5 text-maqon-teal group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-serif font-medium text-maqon-platinum mb-1 group-hover:text-white transition-colors">Growth Systems</h3>
                        <p className="text-[10px] font-medium text-maqon-text/80 uppercase tracking-wider mb-3 group-hover:text-maqon-platinum/90 transition-colors">Funnel • CRM • Automation</p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-maqon-teal flex items-center gap-2 group-hover:gap-3 group-hover:text-maqon-gold transition-all">
                            Explore <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const Hero = () => {
  const navigate = useNavigate();

  // Premium Logo component
  const TrustLogo = ({ name, className }: { name: string, className?: string }) => (
    <div className="group relative flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-500 cursor-default grayscale hover:grayscale-0">
      <span className={`text-sm md:text-base font-bold tracking-tight text-maqon-platinum drop-shadow-sm ${className}`}>
        {name}
      </span>
    </div>
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-24 overflow-hidden bg-cosmic-gradient perspective-[2000px] transition-colors duration-500">
      {/* Volumetric Lighting Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-maqon-teal/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-float-slow"></div>
      
      {/* Isometric Grid Overlay (Subtle) */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '60px 60px', color: 'var(--color-platinum)' }}>
      </div>
      
      {/* Cosmic Object - Repositioned further right/top and lowered opacity */}
      <div className="absolute right-[-15%] top-[10%] lg:right-[-10%] lg:top-[15%] w-[600px] h-[600px] hidden lg:block pointer-events-none z-0 opacity-60">
        <MaqonCosmicObject />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-screen-xl">
        <div className="max-w-3xl"> 
          
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
             <div className="h-px w-12 bg-maqon-gold"></div>
             <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-maqon-platinum transition-colors">International Operators. Not Marketers.</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-7xl text-maqon-platinum leading-[1.1] mb-6 animate-slide-up drop-shadow-2xl transition-colors">
            Investor-ready companies. <br/>
            <span className="text-maqon-text/60 italic font-light tracking-wide text-4xl md:text-6xl block mt-2">Predictable growth systems.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-maqon-text font-light leading-relaxed max-w-xl mb-10 animate-slide-up transition-colors" style={{ animationDelay: '0.1s' }}>
            We build VC-grade fundraising assets and install revenue infrastructure so teams stop guessing—and start compounding.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
                to="/contact"
                variant="primary"
                className="w-full sm:w-auto"
            >
                Book Diagnostic Call
            </Button>
          </div>
          
          <div className="mt-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium flex items-center gap-2">
                 <span className="w-1 h-1 bg-maqon-teal rounded-full"></span> 15 min 
                 <span className="opacity-50">•</span> NDA-first 
                 <span className="opacity-50">•</span> Partner-led
              </p>
          </div>

          <PathSelector />

        </div>

        {/* TRUST MODULE (World-Class Polish) */}
        <div className="animate-fade-in mt-12" style={{ animationDelay: '0.4s' }}>
            
            {/* Divider Line */}
            <div className="w-full h-px bg-maqon-platinum opacity-[0.08] mb-10"></div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                
                {/* Text Block - High Contrast & Hierarchy */}
                <div className="max-w-2xl">
                   <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-maqon-platinum/60 mb-4">
                     Institutional-Grade Operator Experience
                   </p>
                   <p className="text-xl md:text-2xl text-maqon-platinum font-light leading-relaxed mb-3">
                     Operator work across VC/PE diligence, D2C growth, and high-compliance trade.
                   </p>
                   <p className="text-[10px] font-bold text-maqon-gold uppercase tracking-[0.15em] opacity-90 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-maqon-gold rounded-full"></span>
                     Evidence-first deliverables. NDA-first execution.
                   </p>
                </div>
                
                {/* Unified Premium Ribbon - Mobile Responsive */}
                <div>
                    <div className="group flex flex-wrap md:flex-nowrap items-center px-6 py-4 md:py-3 rounded-xl md:rounded-full border border-maqon-border bg-white/5 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-maqon-platinum/20 hover:bg-white/10 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-default gap-y-3 md:gap-y-0">
                       {/* Left Part */}
                       <div className="flex items-center gap-2 w-full md:w-auto">
                          <ShieldCheck className="w-4 h-4 text-maqon-gold flex-shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-maqon-platinum whitespace-nowrap">
                              Institutional Standards
                          </span>
                       </div>
                       
                       {/* Subtle Divider (Desktop) */}
                       <div className="hidden md:block w-px h-3 bg-maqon-border/50 mx-4"></div>

                        {/* Subtle Divider (Mobile) */}
                       <div className="block md:hidden w-full h-px bg-maqon-border/20"></div>
                       
                       {/* Right Part (Locations) */}
                       <div className="flex items-center gap-2 text-[10px] font-medium text-maqon-text/70 uppercase tracking-[0.15em] w-full md:w-auto">
                           <span>Dubai</span> <span className="text-maqon-border/50">•</span>
                           <span>Melbourne</span> <span className="text-maqon-border/50">•</span>
                           <span>Frankfurt</span>
                       </div>
                    </div>
                </div>
            </div>
            
            {/* Logo Grid with Fade Edges */}
            <div className="relative">
               {/* Fade Masks */}
               <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-maqon-void to-transparent z-10 pointer-events-none"></div>
               <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-maqon-void to-transparent z-10 pointer-events-none"></div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 md:gap-x-12 md:gap-y-10 items-center">
                  <TrustLogo name="IJK Capital" className="font-serif tracking-tight" />
                  <TrustLogo name="NEXEA" className="font-sans !font-normal tracking-[0.3em]" />
                  <TrustLogo name="camal" className="lowercase font-serif italic" />
                  <TrustLogo name="Mega Foods" className="font-sans font-bold text-maqon-platinum/80" />
                  <TrustLogo name="IMM Group" className="font-mono font-bold tracking-widest" />
                  <TrustLogo name="ABLE C&C" className="font-serif font-semibold" />
               </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export const Home = () => {
  return (
    <div className="bg-maqon-void">
      <Hero />
      
      {/* Methodology Section */}
      <section className="py-24 md:py-32 bg-maqon-obsidian border-b border-maqon-border relative">
        <div className="container mx-auto px-6 max-w-5xl">
            <SectionHeading kicker="Protocol" title="MAQON Methodology" />
            
            <div className="relative mt-20">
                {/* Continuous Vertical Line */}
                <div className="absolute left-[23px] md:left-[29px] top-4 bottom-12 w-px bg-gradient-to-b from-maqon-border via-maqon-border to-transparent"></div>

                <div className="space-y-16 md:space-y-24">
                    {methodology.map((step, idx) => (
                        <div key={idx} className="relative pl-20 md:pl-28 group">
                            
                            {/* Icon Container - Timeline Node */}
                            <div className="absolute left-0 top-0">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-maqon-obsidian border border-maqon-border group-hover:border-maqon-teal/60 rounded-sm flex items-center justify-center transition-all duration-500 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-maqon-teal opacity-70 group-hover:opacity-100 transition-all duration-500" strokeWidth={1.5} />
                                    {/* Soft Inner Glow */}
                                    <div className="absolute inset-0 bg-maqon-teal/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-1 md:pt-2 transition-transform duration-500 group-hover:-translate-y-1">
                                <span className="text-[10px] font-bold tracking-[0.25em] text-maqon-text/40 uppercase mb-3 block">Step 0{idx + 1}</span>
                                
                                <h3 className="text-2xl md:text-3xl font-serif text-maqon-platinum mb-4 group-hover:text-white transition-colors">
                                    {step.title}
                                </h3>
                                
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                                    <span className="text-xs font-bold text-maqon-gold uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1 h-1 bg-maqon-gold rounded-full"></span>
                                        Outcome: {step.outcome}
                                    </span>
                                </div>
                                
                                <p className="text-sm md:text-base text-maqon-text leading-relaxed max-w-xl font-light">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Insights Preview */}
      <section className="py-24 bg-maqon-void relative">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
               <SectionHeading kicker="Intel" title="Recent Briefings" />
               <Link to="/insights" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-maqon-platinum hover:text-maqon-gold transition-colors mb-4">
                 View All <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {insights.slice(0,3).map(post => (
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

                        <h3 className="text-xl font-serif text-maqon-platinum mb-3 group-hover:text-maqon-teal transition-colors leading-tight">{post.title}</h3>
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
            
            <div className="mt-8 md:hidden">
               <Link to="/insights" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-maqon-platinum hover:text-maqon-gold transition-colors">
                 View All <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};