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
  const colorMap = {
    gold: {
      bg: 'var(--tc-brand-gold-light)',
      text: 'var(--tc-brand-gold)',
      border: 'rgba(229, 168, 59, 0.25)',
    },
    green: {
      bg: 'var(--tc-status-green-bg)',
      text: 'var(--tc-status-green)',
      border: 'rgba(16, 185, 129, 0.25)',
    },
    blue: {
      bg: 'var(--tc-status-blue-bg)',
      text: 'var(--tc-status-blue)',
      border: 'rgba(59, 130, 246, 0.25)',
    },
    purple: {
      bg: 'var(--tc-status-purple-bg)',
      text: 'var(--tc-status-purple)',
      border: 'rgba(139, 92, 246, 0.25)',
    },
  }[color];

  return (
    <div className="tc-card" style={{ padding: '20px 22px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'var(--tc-text-secondary)',
        }}>
          {title}
        </div>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--tc-radius-md)',
          backgroundColor: colorMap.bg,
          color: colorMap.text,
          border: `1px solid ${colorMap.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={20} />
        </div>
      </div>

      <div style={{
        fontSize: '26px',
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: '-0.5px',
        lineHeight: 1.1,
        marginBottom: '8px',
      }}>
        {value}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
      }}>
        {change && (
          <span style={{
            color: isPositive ? 'var(--tc-status-green)' : 'var(--tc-status-red)',
            fontWeight: '600',
          }}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
        {subtitle && (
          <span style={{ color: 'var(--tc-text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
