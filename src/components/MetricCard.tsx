import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'gold' | 'green' | 'blue' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  color = 'gold',
}) => {
  return (
    <div className="tc-card tc-metric-card-inner">
      <div className="tc-metric-header-row">
        <div className="tc-metric-title">
          {title}
        </div>
        <div className={`tc-metric-icon-box tc-metric-icon-box--${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="tc-metric-value">
        {value}
      </div>

      <div className="tc-metric-footer-row">
        {change && (
          <span className={`tc-metric-change ${isPositive ? 'tc-metric-change--positive' : 'tc-metric-change--negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
        {subtitle && (
          <span className="tc-metric-subtitle">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
