import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  
  // Base styles: Transition, Focus, Disabled states
  const baseStyles = "inline-flex items-center justify-center rounded-sm font-bold tracking-[0.2em] uppercase transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-maqon-void disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  // Variants
  const variants = {
    primary: "bg-maqon-platinum text-maqon-void hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-px focus-visible:ring-maqon-gold",
    secondary: "bg-maqon-teal text-white hover:bg-maqon-tealDim hover:shadow-[0_0_20px_rgba(0,95,107,0.4)] hover:-translate-y-px focus-visible:ring-maqon-gold shadow-lg shadow-maqon-teal/20",
    outline: "border border-maqon-border text-maqon-platinum bg-transparent hover:border-maqon-platinum hover:bg-maqon-platinum/5 hover:-translate-y-px focus-visible:ring-maqon-gold backdrop-blur-sm",
    ghost: "text-maqon-platinum hover:bg-maqon-platinum/10 hover:text-white focus-visible:ring-maqon-gold",
    link: "text-maqon-platinum hover:text-maqon-gold underline-offset-4 hover:underline p-0 h-auto font-normal tracking-normal normal-case",
  };

  // Sizes
  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-8 py-4 text-xs",
    lg: "px-10 py-5 text-sm",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${variant !== 'link' ? sizes[size] : ''} ${className}`;

  // Render as React Router Link
  if (to) {
    return (
      <Link to={to} className={combinedClasses} aria-label={typeof children === 'string' ? children : 'Navigate'}>
        {children}
      </Link>
    );
  }

  // Render as External Link
  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  // Render as Button
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};