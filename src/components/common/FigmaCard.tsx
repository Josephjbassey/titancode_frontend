import React from 'react';

export interface FigmaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

export const FigmaCard: React.FC<FigmaCardProps> = ({
  children,
  className = '',
  style,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`figma-card ${hoverable ? 'figma-card-hover' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--tc-figma-card-bg, #FFFFFF1A)',
        border: '1px solid var(--tc-figma-card-border, #FFFFFF26)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '32px',
        transition: hoverable ? 'all 0.25s ease' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
