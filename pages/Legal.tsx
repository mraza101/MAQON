import React from 'react';

export const Legal = ({ type }: { type: 'privacy' | 'terms' }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl font-bold text-maqon-dark mb-8 capitalize">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        
        <div className="prose prose-slate max-w-none text-gray-600">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-maqon-dark mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to MAQON. This document outlines our policies regarding {type === 'privacy' ? 'data collection and privacy' : 'terms of use'}.
            By accessing our services, you agree to these terms.
          </p>

          <h2 className="text-xl font-bold text-maqon-dark mt-8 mb-4">2. {type === 'privacy' ? 'Data Collection' : 'Services'}</h2>
          <p className="mb-4">
            {type === 'privacy' 
              ? 'We collect information you provide directly to us, such as when you fill out a form, request a diagnostic, or communicate with us. This includes your name, email, and company details.' 
              : 'MAQON provides consultancy services including investment readiness sprints and revenue engine optimization. All services are subject to a separate Statement of Work.'}
          </p>

          <h2 className="text-xl font-bold text-maqon-dark mt-8 mb-4">3. {type === 'privacy' ? 'GDPR Compliance' : 'Limitation of Liability'}</h2>
          <p className="mb-4">
            {type === 'privacy' 
             ? 'For users in the European Union, we adhere to GDPR standards. You have the right to access, rectify, or erase your personal data. Contact our Data Protection Officer for requests.' 
             : 'MAQON is not liable for any indirect, incidental, or consequential damages arising from the use of our services. We do not guarantee funding outcomes.'}
          </p>

          {/* Placeholder for remaining legalese */}
          <p className="italic mt-8 text-sm">
            [This is a placeholder for the full legal text. Please consult with legal counsel to draft the complete document tailored to UAE, Australian, and German laws.]
          </p>
        </div>
      </div>
    </div>
  );
};
