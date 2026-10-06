import React from 'react';

export interface FigmaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const FigmaButton: React.FC<FigmaButtonProps> = ({
  variant = 'gold',
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <button
      className={`figma-button figma-button-${variant} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};
