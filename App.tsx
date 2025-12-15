import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown, CheckCircle2 } from 'lucide-react';
import { siteConfig } from './config';
import { Home } from './pages/Home';
import { ServiceDetail } from './pages/ServiceDetail';
import { Services } from './pages/Services';
import { CaseStudies } from './pages/CaseStudies';
import { Insights } from './pages/Insights';
import { InsightDetail } from './pages/InsightDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { Button } from './components/ui/Button';

// --- Theme Logic ---
const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maqon-theme');
      if (saved) return saved as 'dark' | 'light';
      return 'dark'; // Default premium dark
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('maqon-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};

// --- Scroll Logic ---
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Services page handles its own hash scrolling
      if (pathname === '/services') return;
      
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

// --- Components ---

const Header = ({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'About', path: '/about' },
    { name: 'Insights', path: '/insights' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const headerBg = isOpen || scrolled ? 'bg-maqon-void/95 backdrop-blur-xl border-maqon-border shadow-sm' : 'bg-transparent border-transparent';
  const headerPadding = isOpen ? 'py-4' : (scrolled ? 'py-4 md:py-3' : 'py-5 md:py-6');

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 border-b ${headerBg} ${headerPadding}`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative z-50">
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => setIsOpen(false)}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm p-1"
        >
           <h1 className={`font-serif font-bold tracking-tight text-maqon-platinum transition-all duration-300 ${scrolled || isOpen ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
             MAQON<span className={`text-maqon-gold leading-none transition-all duration-300 ${scrolled || isOpen ? 'text-xl' : 'text-2xl'}`}>.</span>
           </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${scrolled ? 'gap-6 lg:gap-8' : 'gap-8 lg:gap-12'}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              aria-current={isActive(link.path) ? 'page' : undefined}
              className={`text-[10px] font-bold tracking-[0.25em] uppercase transition-all relative group py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm ${isActive(link.path) ? 'text-maqon-platinum' : 'text-maqon-text/70 hover:text-maqon-platinum'}`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-maqon-gold transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
            </Link>
          ))}
        </nav>

        {/* Right Action */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-maqon-text hover:text-maqon-gold hover:bg-maqon-text/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <Button
             to="/contact"
             variant="primary"
             className={scrolled ? 'px-5 py-2.5 text-[10px]' : 'px-6 py-3 text-[10px]'}
          >
             Book Diagnostic
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-maqon-platinum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-full"
          >
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            className="text-maqon-platinum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm p-1 active:scale-95 transition-transform" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-maqon-void z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'}`}
        style={{ top: '0', height: '100dvh' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-maqon-teal/20 blur-[100px] rounded-full"></div>
        </div>

        <nav className="flex flex-col items-center gap-6 relative z-10 w-full px-6 pt-20">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              aria-current={isActive(link.path) ? 'page' : undefined}
              className={`text-3xl font-serif transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm px-6 py-3 relative group
                ${isActive(link.path) ? 'text-maqon-platinum' : 'text-maqon-text/60 hover:text-maqon-platinum'}
              `}
            >
              <span className="relative z-10">{link.name}</span>
              {isActive(link.path) && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-maqon-gold rounded-full shadow-[0_0_10px_rgba(255,182,0,0.8)]"></span>
              )}
            </Link>
          ))}
          <Button 
             to="/contact"
             variant="secondary"
             className="w-full max-w-xs py-4 text-xs font-bold tracking-widest uppercase mt-8"
             onClick={() => setIsOpen(false)}
          >
            Book Diagnostic Call
          </Button>
        </nav>
      </div>
    </header>
  );
};

const FooterAccordionItem = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-maqon-border/50 md:border-none">
      <button 
        onClick={onToggle}
        className="w-full py-4 md:py-0 flex items-center justify-between text-left group md:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm"
      >
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-maqon-gold transition-colors">{title}</h4>
        <ChevronDown 
          className={`w-4 h-4 text-maqon-text transition-transform duration-300 md:hidden ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </button>
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out md:max-h-none md:overflow-visible"
      >
        <div className="pb-6 md:pb-0 pt-2 md:pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Default to all open on desktop (handled via CSS media queries for layout, but JS logic for mobile)
  const handleToggle = (section: string) => {
    // Check if we are on mobile to enforce accordion behavior
    if (window.innerWidth < 768) {
      setOpenSection(openSection === section ? null : section);
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenSection('all'); // A dummy value or null, css handles visibility
      } else {
        setOpenSection(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const getIsOpen = (section: string) => isDesktop || openSection === section;

  return (
    <footer className="bg-maqon-obsidian text-maqon-text pt-16 pb-[calc(24px+env(safe-area-inset-bottom))] md:py-20 border-t border-maqon-border relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-maqon-border to-transparent"></div>
      
      <div className="container mx-auto px-6">
        
        {/* Mobile Primary CTA */}
        <div className="block md:hidden mb-12 animate-slide-up">
           <Button
             to="/contact"
             variant="primary"
             className="w-full mb-3"
           >
             Book Diagnostic
           </Button>
           <p className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1.5">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
             Response within 24 hours
           </p>
        </div>

        <div className="grid md:grid-cols-4 gap-x-12 gap-y-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 mb-8 md:mb-0">
            <h3 className="font-serif text-2xl font-bold mb-6 text-maqon-platinum transition-colors">MAQON<span className="text-maqon-gold">.</span></h3>
            <p className="text-xs text-maqon-text leading-relaxed mb-6 max-w-xs transition-colors">
              Bridging high-potential businesses to global standards of capital, growth, and operations.
            </p>
          </div>

          {/* Accordion Sections */}
          <div>
            <FooterAccordionItem 
              title="Offices" 
              isOpen={getIsOpen('offices')} 
              onToggle={() => handleToggle('offices')}
            >
              <ul className="space-y-6 text-xs text-maqon-text">
                {siteConfig.locations.map(loc => (
                  <li key={loc.city} className="cursor-default">
                    <span className="text-maqon-platinum block font-bold mb-1.5 transition-colors">{loc.city}</span>
                    <p className="leading-relaxed opacity-80">{loc.address}</p>
                  </li>
                ))}
              </ul>
            </FooterAccordionItem>
          </div>

          <div>
            <FooterAccordionItem 
              title="Sitemap" 
              isOpen={getIsOpen('sitemap')} 
              onToggle={() => handleToggle('sitemap')}
            >
              <ul className="space-y-0 md:space-y-3 flex flex-col">
                <li><Link to="/services" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors border-b border-maqon-border/30 md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Services</Link></li>
                <li><Link to="/case-studies" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors border-b border-maqon-border/30 md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Case Studies</Link></li>
                <li><Link to="/about" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors border-b border-maqon-border/30 md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">About Firm</Link></li>
                <li><Link to="/insights" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors border-b border-maqon-border/30 md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Insights</Link></li>
                <li><Link to="/contact" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Contact</Link></li>
              </ul>
            </FooterAccordionItem>
          </div>

          <div>
             <FooterAccordionItem 
              title="Legal" 
              isOpen={getIsOpen('legal')} 
              onToggle={() => handleToggle('legal')}
            >
              <ul className="space-y-0 md:space-y-3 flex flex-col">
                <li><Link to="/privacy" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors border-b border-maqon-border/30 md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="block py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors border-b border-maqon-border/30 md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Terms of Service</Link></li>
                <li><button className="block w-full text-left py-3 md:py-0 text-xs text-maqon-text hover:text-maqon-platinum transition-colors md:border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">Cookie Preferences</button></li>
                <li>
                  <button className="block w-full text-left py-3 md:py-0 text-xs font-bold text-maqon-teal hover:text-maqon-platinum transition-colors mt-2 md:mt-4 uppercase tracking-wider focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-maqon-gold rounded-sm">
                    Client Portal (Login)
                  </button>
                </li>
              </ul>
            </FooterAccordionItem>
          </div>
        </div>

        <div className="border-t border-maqon-border pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest transition-colors gap-4">
          <p>&copy; {new Date().getFullYear()} MAQON Group.</p>
          <p>Dubai • Melbourne • Frankfurt</p>
        </div>
        <div className="text-center mt-4 text-[9px] text-gray-500/80">
          Disclaimer: MAQON provides consultancy services. We do not guarantee funding outcomes or specific investment results.
        </div>
      </div>
    </footer>
  );
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('maqon-cookie-consent');
    if (!consent) {
      setTimeout(() => setVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('maqon-cookie-consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm w-full bg-maqon-void/90 backdrop-blur-md border border-maqon-border shadow-2xl z-50 p-6 rounded-lg animate-slide-up">
      <p className="font-serif text-lg font-bold text-maqon-platinum mb-2">Privacy Choice</p>
      <p className="text-xs text-maqon-text mb-4 leading-relaxed">
        We use cookies to analyze traffic and enhance your experience. 
      </p>
      <div className="flex gap-3">
        <button onClick={() => setVisible(false)} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-maqon-text hover:text-maqon-platinum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm">Customize</button>
        <Button onClick={handleAccept} size="sm" variant="secondary" className="flex-1">
            Accept
        </Button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <HashRouter>
      <ScrollToTop />
      <div className={`min-h-screen flex flex-col font-sans bg-maqon-void selection:bg-maqon-teal/30 selection:text-white transition-colors duration-500`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:insightId" element={<InsightDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Legal type="privacy" />} />
            <Route path="/terms" element={<Legal type="terms" />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </HashRouter>
  );
}