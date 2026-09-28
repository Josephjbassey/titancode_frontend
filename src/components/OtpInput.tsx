import React, { useRef } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  hasError?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  hasError = false,
}) => {
  const digits = (() => {
    const arr = value.split('').slice(0, length);
    while (arr.length < length) arr.push('');
    return arr;
  })();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) {
      const newDigits = [...digits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    const char = val[val.length - 1];
    const newDigits = [...digits];
    newDigits[index] = char;
    onChange(newDigits.join(''));

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (!pasted) return;

    const newDigits = pasted.split('');
    while (newDigits.length < length) newDigits.push('');
    onChange(newDigits.join(''));

    const nextFocusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[nextFocusIdx]?.focus();
  };

  const boxWidth = length > 4 ? '46px' : '54px';
  const boxHeight = length > 4 ? '52px' : '56px';
  const boxGap = length > 4 ? '8px' : '12px';
  const fontSize = length > 4 ? '20px' : '22px';

  return (
    <div style={{
      display: 'flex',
      gap: boxGap,
      justifyContent: 'center',
      margin: '24px 0',
      flexWrap: 'nowrap',
    }}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          style={{
            width: boxWidth,
            height: boxHeight,
            fontSize: fontSize,
            fontWeight: '700',
            textAlign: 'center',
            backgroundColor: digit ? '#54461B' : 'rgba(255, 255, 255, 0.05)',
            color: '#FFFFFF',
            border: `1.5px solid ${hasError ? '#EF4444' : digit ? '#dfae32' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '12px',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: hasError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
          }}
          onFocus={(e) => {
            if (!hasError) {
              e.target.style.borderColor = '#dfae32';
              e.target.style.backgroundColor = '#54461B';
            }
          }}
          onBlur={(e) => {
            if (!hasError) {
              e.target.style.borderColor = digit ? '#dfae32' : 'rgba(255, 255, 255, 0.15)';
              e.target.style.backgroundColor = digit ? '#54461B' : 'rgba(255, 255, 255, 0.05)';
            }
          }}
        />
      ))}
    </div>
  );
};
