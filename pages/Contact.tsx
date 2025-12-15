import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, MapPin, ChevronDown, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config';
import { Button } from '../components/ui/Button';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const ALLOWED_STAGES = [
  "Pre-Seed", 
  "Seed", 
  "Series A+", 
  "SME ($10k–$50k MRR)", 
  "SME ($50k–$250k MRR)", 
  "Enterprise", 
  "Not sure"
];

interface FormData {
  full_name: string;
  work_email: string;
  phone_whatsapp: string;
  company_name: string;
  current_stage: string;
  primary_goal: string;
  deck_or_website: string;
  _gotcha: string; // Honeypot
}

const INITIAL_DATA: FormData = {
  full_name: '',
  work_email: '',
  phone_whatsapp: '',
  company_name: '',
  current_stage: ALLOWED_STAGES[0],
  primary_goal: '',
  deck_or_website: '',
  _gotcha: ''
};

export const Contact = () => {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [utmParams, setUtmParams] = useState<any>({});

  // Capture UTM parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: any = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      if (params.get(key)) utm[key] = params.get(key);
    });
    setUtmParams(utm);
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'full_name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name is too short';
        if (value.length > 80) return 'Name is too long';
        return '';
      case 'work_email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        return '';
      case 'company_name':
        return value.trim().length === 0 ? 'Company name is required' : '';
      case 'primary_goal':
        if (!value) return 'Please specify your goal';
        if (value.length < 15) return 'Please provide more detail (min 15 chars)';
        return '';
      case 'phone_whatsapp':
        if (value) {
           const clean = value.replace(/[^\d+]/g, '');
           if (clean.length < 7 || clean.length > 15) return 'Invalid phone number';
        }
        return '';
      case 'deck_or_website':
        if (value) {
          try {
            const u = new URL(value);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') return 'Must start with http:// or https://';
          } catch {
            return 'Invalid URL';
          }
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate immediately if already touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate All Fields
    const newErrors: Record<string, string> = {};
    let hasError = false;
    
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      if (key === '_gotcha') return;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    });

    setTouched(Object.keys(formData).reduce((acc, k) => ({...acc, [k]: true}), {}));
    setErrors(newErrors);

    if (hasError) {
      setErrorMessage("Please correct the highlighted errors.");
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const payload = {
        ...formData,
        request_type: 'Diagnostic',
        source_page: window.location.pathname,
        utm_params: utmParams
      };

      const response = await fetch('/.netlify/functions/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.errors) {
            setErrors(data.errors);
            const firstError = Object.values(data.errors)[0] as string;
            throw new Error(firstError || "Validation failed.");
        }
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : "Connection failed.");
    }
  };

  const getInputClasses = (fieldName: string) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full bg-maqon-void border rounded-sm px-4 py-4 text-base md:text-sm text-maqon-platinum 
    placeholder:text-gray-400 placeholder:font-light
    transition-all duration-300 ease-out
    focus:outline-none focus:bg-maqon-void
    disabled:opacity-50 disabled:cursor-not-allowed appearance-none
    ${hasError 
      ? 'border-red-500/50 text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-red-500/5' 
      : 'border-maqon-border hover:border-maqon-platinum/40 hover:bg-maqon-platinum/[0.02] focus:border-maqon-teal focus:ring-1 focus:ring-maqon-teal/30 focus:shadow-[0_0_20px_rgba(0,95,107,0.15)]'
    }`;
  };

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-maqon-void px-6 pt-24 transition-colors duration-500">
        <div className="glass-panel p-12 rounded-xl text-center max-w-md w-full border border-maqon-teal/30 animate-fade-in shadow-[0_0_50px_rgba(0,95,107,0.2)]">
          <div className="w-20 h-20 bg-maqon-teal/10 text-maqon-teal rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-maqon-teal/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif text-maqon-platinum mb-4 transition-colors">Request Received</h2>
          <div className="text-sm text-gray-500 space-y-4 mb-8">
            <p>Thank you, {formData.full_name.split(' ')[0]}. We have securely recorded your details.</p>
            <p className="p-3 bg-maqon-teal/5 border border-maqon-teal/20 rounded-sm text-maqon-teal text-xs font-bold uppercase tracking-wide">
                Confirmation Email Sent to {formData.work_email}
            </p>
            <p>Our partners will review your diagnostic request and reach out within 24 hours.</p>
          </div>
          <button 
            onClick={() => { setStatus('idle'); setFormData(INITIAL_DATA); setTouched({}); setErrors({}); }} 
            className="text-maqon-platinum text-xs font-bold uppercase tracking-widest hover:text-maqon-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-maqon-gold rounded-sm px-2 py-1 transition-colors"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 md:py-32 bg-maqon-void min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 md:mb-20 animate-slide-up">
          <h1 className="font-serif text-4xl md:text-5xl text-maqon-platinum mb-6 transition-colors">Start Your Diagnostic</h1>
          <p className="text-maqon-text font-light transition-colors px-4">Tell us a bit about your business. We'll tell you if we can help.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Contact Info Sidebar */}
          <div className="md:col-span-4 space-y-12 animate-slide-up order-2 md:order-1" style={{ animationDelay: '0.1s' }}>
            <div>
              <h3 className="text-lg font-bold text-maqon-platinum mb-6 transition-colors">Global Offices</h3>
              <div className="space-y-8">
                {siteConfig.locations.map(loc => (
                  <div key={loc.city} className="group">
                    <div className="flex items-center gap-2 mb-2">
                       <MapPin className="w-4 h-4 text-maqon-gold" />
                       <h4 className="font-bold text-maqon-platinum text-sm transition-colors">{loc.city}</h4>
                    </div>
                    <p className="text-xs text-gray-500 pl-6 mb-1">{loc.address}</p>
                    <a href={`mailto:${loc.email}`} className="text-xs text-maqon-teal pl-6 hover:text-maqon-platinum transition-colors">{loc.email}</a>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-maqon-midnight rounded-lg border border-maqon-border transition-colors">
              <h4 className="font-bold text-maqon-platinum text-sm mb-2 transition-colors">Note on Discretion</h4>
              <p className="text-xs text-maqon-text leading-relaxed transition-colors">
                We regularly work with stealth startups and family offices. All information submitted here is treated with strict confidentiality.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8 animate-slide-up order-1 md:order-2" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-maqon-obsidian p-6 md:p-12 rounded-sm border border-maqon-border transition-colors hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] duration-500 relative overflow-hidden" noValidate>
              
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-maqon-gold/30 to-transparent opacity-50"></div>

              {/* Honeypot Field (Hidden from humans) */}
              <input 
                type="text" 
                name="_gotcha" 
                value={formData._gotcha} 
                onChange={handleChange} 
                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }} 
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Error Alert */}
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm flex items-start gap-3 mb-6 animate-fade-in">
                   <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                   <div>
                     <h4 className="text-sm font-bold text-red-500 mb-1">Submission Failed</h4>
                     <p className="text-xs text-red-400">{errorMessage}</p>
                   </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Full Name <span className="text-maqon-gold">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={getInputClasses('full_name')} 
                      placeholder="John Doe" 
                      disabled={status === 'submitting'}
                    />
                    {touched.full_name && errors.full_name && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  {touched.full_name && errors.full_name && <p className="text-[10px] text-red-500 mt-1">{errors.full_name}</p>}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Work Email <span className="text-maqon-gold">*</span></label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="work_email" 
                      value={formData.work_email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={getInputClasses('work_email')} 
                      placeholder="john@company.com" 
                      disabled={status === 'submitting'}
                    />
                     {touched.work_email && errors.work_email && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  {touched.work_email && errors.work_email && <p className="text-[10px] text-red-500 mt-1">{errors.work_email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Phone / WhatsApp <span className="text-[9px] text-gray-600">(Optional)</span></label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="phone_whatsapp" 
                      value={formData.phone_whatsapp}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={getInputClasses('phone_whatsapp')} 
                      placeholder="+1 ..." 
                      disabled={status === 'submitting'}
                    />
                  </div>
                  {touched.phone_whatsapp && errors.phone_whatsapp && <p className="text-[10px] text-red-500 mt-1">{errors.phone_whatsapp}</p>}
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Company Name <span className="text-maqon-gold">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="company_name" 
                      value={formData.company_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className={getInputClasses('company_name')} 
                      placeholder="Acme Inc." 
                      disabled={status === 'submitting'}
                    />
                    {touched.company_name && errors.company_name && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  {touched.company_name && errors.company_name && <p className="text-[10px] text-red-500 mt-1">{errors.company_name}</p>}
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Current Stage <span className="text-maqon-gold">*</span></label>
                <div className="relative">
                  <select 
                    name="current_stage" 
                    value={formData.current_stage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${getInputClasses('current_stage')} cursor-pointer`}
                    disabled={status === 'submitting'}
                  >
                    {ALLOWED_STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none group-hover:text-maqon-platinum transition-colors" />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Primary Goal (Min 15 chars) <span className="text-maqon-gold">*</span></label>
                <div className="relative">
                  <textarea 
                    name="primary_goal" 
                    rows={3} 
                    value={formData.primary_goal}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={getInputClasses('primary_goal')} 
                    placeholder="e.g. Raising $500k in 3 months OR Need to fix funnel conversion to reach $100k MRR..." 
                    disabled={status === 'submitting'}
                  ></textarea>
                   {touched.primary_goal && errors.primary_goal && (
                      <AlertCircle className="absolute right-4 top-6 w-4 h-4 text-red-500 animate-pulse" />
                    )}
                </div>
                {touched.primary_goal && errors.primary_goal && <p className="text-[10px] text-red-500 mt-1">{errors.primary_goal}</p>}
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-maqon-teal transition-colors">Link to Deck or Website <span className="text-[9px] text-gray-600">(Optional)</span></label>
                <input 
                  type="url" 
                  name="deck_or_website" 
                  value={formData.deck_or_website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('deck_or_website')} 
                  placeholder="https://..." 
                  disabled={status === 'submitting'}
                />
                {touched.deck_or_website && errors.deck_or_website && <p className="text-[10px] text-red-500 mt-1">{errors.deck_or_website}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 mt-4"
              >
                 {status === 'submitting' ? <><Loader2 className="animate-spin w-4 h-4" /> Processing...</> : <>Request Diagnostic <ArrowRight className="w-4 h-4" /></>}
              </Button>
              
              <p className="text-[10px] text-center text-gray-500">
                  By clicking Request, you agree to our Terms.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};