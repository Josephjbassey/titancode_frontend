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
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          border: '1px solid var(--tc-figma-input-border, #FFFFFF59)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--tc-figma-gold, #DFAE32)',
          border: 'none',
        };
      case 'gold':
      default:
        return {
          backgroundColor: 'var(--tc-figma-gold, #DFAE32)',
          color: '#0B0B0C',
          border: 'none',
        };
    }
  };

  return (
    <button
      className={`figma-button figma-button-${variant} ${className}`}
      style={{
        fontWeight: '700',
        fontSize: '15px',
        padding: '12px 32px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Poppins', sans-serif",
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...getStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
