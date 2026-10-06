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
  centerValue,
}) => {
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const displayValue = centerValue ?? `${Math.round(((slices[0]?.value ?? 0) / total) * 100)}%`;

  return (
    <div className="tc-donut-container">
      <div
        className="tc-donut-svg-wrap"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="tc-donut-svg">
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
                className="tc-donut-slice"
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div className="tc-donut-center">
          <div className="tc-donut-value">
            {displayValue}
          </div>
          <div className="tc-donut-label">
            {centerLabel}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="tc-donut-legend">
        {slices.map((slice, idx) => (
          <div key={idx} className="tc-donut-legend-item">
            <span
              className="tc-donut-legend-dot"
              style={{ backgroundColor: slice.color }}
            />
            <span className="tc-donut-legend-text">
              {slice.label} <strong className="tc-donut-legend-strong">{slice.value}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
