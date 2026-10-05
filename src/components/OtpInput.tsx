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

  const isWide = length <= 4;

  return (
    <div className={`tc-otp-container ${isWide ? 'tc-otp-container--wide' : ''}`}>
      {digits.map((digit, index) => {
        const isFilled = Boolean(digit);
        return (
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
            className={`tc-otp-digit-box ${isWide ? 'tc-otp-digit-box--large' : ''} ${
              hasError ? 'tc-otp-digit-box--error' : isFilled ? 'tc-otp-digit-box--filled' : ''
            }`}
          />
        );
      })}
    </div>
  );
};
