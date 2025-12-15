import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  variant?: 'default' | 'interactive' | 'glass';
  className?: string;
  children: React.ReactNode;
  to?: string; // If provided, wraps in Link
  onClick?: () => void;
}

export const Card = ({
  variant = 'default',
  className = '',
  children,
  to,
  onClick
}: CardProps) => {

  const baseStyles = "relative overflow-hidden rounded-sm transition-all duration-300 border motion-reduce:transition-none motion-reduce:hover:transform-none";
  
  const variants = {
    default: "bg-maqon-obsidian border-maqon-border",
    glass: "glass-panel border-maqon-border/50",
    interactive: "bg-maqon-obsidian/30 border-maqon-border hover:border-maqon-teal/50 hover:bg-maqon-obsidian/60 hover:shadow-[0_20px_40px_-15px_rgba(0,95,107,0.3),0_0_20px_-5px_rgba(0,95,107,0.2)] hover:-translate-y-1 group backdrop-blur-sm cursor-pointer",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
         {/* Hover Gradient Overlay for interactive cards */}
         {variant === 'interactive' && (
            <div className="absolute inset-0 bg-gradient-to-br from-maqon-teal/15 via-maqon-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
         )}
         <div className="relative z-10 h-full">
            {children}
         </div>
      </Link>
    );
  }

  return (
    <div className={combinedClasses} onClick={onClick}>
       {variant === 'interactive' && onClick && (
          <div className="absolute inset-0 bg-gradient-to-br from-maqon-teal/15 via-maqon-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
       )}
       <div className="relative z-10 h-full">
         {children}
       </div>
    </div>
  );
};