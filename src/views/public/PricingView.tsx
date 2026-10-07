import React, { useState, useEffect } from 'react';
import type { ScreenId } from '../../App';
import { api } from '../../services/api';
import '../../styles/public.css';

interface PricingTier {
  id: string;
  label: string;
  min_amount: number;
  max_amount: number | null;
  description: string;
  is_active: boolean;
}

interface PricingViewProps {
  onNavigate: (view: ScreenId) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPublicPricingTiers()
      .then(setTiers)
      .catch(() => setTiers([]))
      .finally(() => setIsLoading(false));
  }, []);

  const formatPrice = (tier: PricingTier) => {
    const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
    if (!tier.max_amount) return `${fmt(tier.min_amount)}+`;
    return `${fmt(tier.min_amount)} – ${fmt(tier.max_amount)}`;
  };

  return (
    <div className="tc-page-root tc-pricing-root">
      <section className="tc-subpage-hero tc-subpage-hero--pricing">
        <div className="tc-subpage-hero__content">
          <h1 className="tc-hero-title">Our <span className="tc-gold">Pricing</span></h1>
          <p className="tc-hero-subtitle">Transparent, project-based pricing with no hidden fees.</p>
        </div>
      </section>

      <section className="tc-section">
        <div className="tc-section-inner">
          {isLoading ? (
            <div className="tc-pricing-skeleton-grid">
              {[1, 2, 3, 4].map(i => <div key={i} className="tc-pricing-skeleton-card" />)}
            </div>
          ) : (
            <div className="tc-pricing-cards-grid">
              {tiers.map((tier) => (
                <div key={tier.id} className="tc-public-card tc-pricing-card">
                  <div className="tc-pricing-label">{tier.label}</div>
                  <div className="tc-pricing-range tc-gold">{formatPrice(tier)}</div>
                  <p className="tc-body-text tc-body-text--sm tc-pricing-desc">{tier.description}</p>
                  <button
                    type="button"
                    className="tc-btn-gold tc-pricing-cta"
                    onClick={() => onNavigate('hire_us')}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
