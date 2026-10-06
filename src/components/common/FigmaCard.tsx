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
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
