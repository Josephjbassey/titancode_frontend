import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '460px',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="tc-modal-backdrop" onClick={onClose}>
      <div
        className="tc-modal-container tc-fade-in"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: 'var(--tc-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: 'var(--tc-radius-sm)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--tc-text-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--tc-text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {title && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--tc-text-primary)',
              letterSpacing: '-0.3px',
            }}>
              {title}
            </h2>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
