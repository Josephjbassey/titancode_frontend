import React from 'react';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  size = 180,
  thickness = 22,
  centerLabel = 'Completed',
  centerValue = '68%',
}) => {
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>
      <div style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--tc-border-subtle)"
            strokeWidth={thickness}
          />
          {slices.map((slice, index) => {
            const strokeDasharray = `${(slice.value / total) * circumference} ${circumference}`;
            const accumulatedPercent = slices
              .slice(0, index)
              .reduce((sum, previousSlice) => sum + previousSlice.value / total, 0);
            const strokeDashoffset = -accumulatedPercent * circumference;

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div style={{
          position: 'absolute',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#FFFFFF',
            lineHeight: 1.1,
          }}>
            {centerValue}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--tc-text-muted)',
            marginTop: '2px',
            fontWeight: '500',
          }}>
            {centerLabel}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '14px',
        width: '100%',
      }}>
        {slices.map((slice, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: slice.color,
            }} />
            <span style={{ fontSize: '12px', color: 'var(--tc-text-secondary)' }}>
              {slice.label} <strong style={{ color: '#FFFFFF', marginLeft: '2px' }}>{slice.value}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
