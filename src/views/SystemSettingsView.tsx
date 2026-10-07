import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Loader2,
  DollarSign,
  Users,
  Plus,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';
import type { SalaryProjection, PricingTier } from '../types';

export const SystemSettingsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [companyName, setCompanyName] = useState('TitanCode Technologies Ltd.');
  const [supportEmail, setSupportEmail] = useState('support@titancode.tech');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC+01:00 (Lagos / Paris)');

  // Company Profile fields
  const [phone, setPhone] = useState('+233(0)546606807');
  const [address, setAddress] = useState('Remote');
  const [websiteUrl, setWebsiteUrl] = useState('https://titancode.tech');
  const [whatsappNumber, setWhatsappNumber] = useState('+233(0)546606807');
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [emailSignature, setEmailSignature] = useState('— TitanCode Finance Team');
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear());
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [itGithubUrl, setItGithubUrl] = useState('https://github.com/titancode/titancode/issues');
  const [itSlackUrl, setItSlackUrl] = useState('https://slack.com/app_redirect?channel=it-support');
  const [splitModel, setSplitModel] = useState<'three_tier_60_15_25' | 'standard_70_30' | 'custom'>('three_tier_60_15_25');
  const [platformSplit, setPlatformSplit] = useState(25);
  const [overheadSplit, setOverheadSplit] = useState(15);
  const [memberSplit, setMemberSplit] = useState(60);
  const [notifyOnMilestone, setNotifyOnMilestone] = useState(true);
  const [notifyOnWithdrawal, setNotifyOnWithdrawal] = useState(true);

  // Role Pay Weights & Withdrawal Limits
  const [roleWeights, setRoleWeights] = useState<Record<string, number>>({
    CEO: 2.0,
    Admin: 1.8,
    Manager: 1.5,
    'Team Lead': 1.3,
    Member: 1.0,
    Assistant: 0.8,
    HR: 1.0,
  });
  const [minWithdrawal, setMinWithdrawal] = useState(50);
  const [maxWithdrawal, setMaxWithdrawal] = useState<number | ''>('');

  // Dynamic Pricing Tiers
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);

  // Salary from Profit Split Logic Calculator state
  const [calcBudget, setCalcBudget] = useState(50000);
  const [calcMemberCount, setCalcMemberCount] = useState(5);
  const [salaryProjection, setSalaryProjection] = useState<SalaryProjection | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Status & Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    api.getFinancialSettings()
      .then((settings) => {
        if (!mounted) return;
        setCompanyName(settings.company_name);
        setSupportEmail(settings.support_email);
        setCurrency(settings.currency);
        setTimezone(settings.timezone);
        setSplitModel(settings.split_model || 'three_tier_60_15_25');
        setPlatformSplit(settings.platform_split_percent);
        setOverheadSplit(settings.overhead_split_percent ?? 15);
        setMemberSplit(settings.member_split_percent);
        setNotifyOnMilestone(settings.notify_on_milestone);
        setNotifyOnWithdrawal(settings.notify_on_withdrawal);
        if (settings.pricing_tiers) {
          setPricingTiers(settings.pricing_tiers);
        }
        const cp = settings.company_profile;
        if (cp) {
          if (cp.phone) setPhone(cp.phone);
          if (cp.address) setAddress(cp.address);
          if (cp.website_url) setWebsiteUrl(cp.website_url);
          if (cp.whatsapp_number) setWhatsappNumber(cp.whatsapp_number);
          if (cp.calendly_url !== undefined) setCalendlyUrl(cp.calendly_url);
          if (cp.email_signature) setEmailSignature(cp.email_signature);
          if (cp.copyright_year) setCopyrightYear(cp.copyright_year);
          if (cp.it_github_issues_url) setItGithubUrl(cp.it_github_issues_url);
          if (cp.it_slack_channel_url) setItSlackUrl(cp.it_slack_channel_url);
          if (cp.socials) {
            if (cp.socials.linkedin !== undefined) setLinkedinUrl(cp.socials.linkedin);
            if (cp.socials.twitter !== undefined) setTwitterUrl(cp.socials.twitter);
            if (cp.socials.instagram !== undefined) setInstagramUrl(cp.socials.instagram);
            if (cp.socials.tiktok !== undefined) setTiktokUrl(cp.socials.tiktok);
            if (cp.socials.github !== undefined) setGithubUrl(cp.socials.github);
          }
        }
        if (settings.role_weights) setRoleWeights(settings.role_weights);
        if (settings.min_withdrawal_amount !== undefined) setMinWithdrawal(settings.min_withdrawal_amount);
        if (settings.max_withdrawal_amount !== undefined && settings.max_withdrawal_amount !== null) setMaxWithdrawal(settings.max_withdrawal_amount);
        setIsLoading(false);
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Update salary projection when budget, member count, or split changes
  useEffect(() => {
    let mounted = true;
    setIsCalculating(true);

    api.calculateSalarySplit(calcBudget, calcMemberCount, {
      platform: platformSplit,
      overhead: overheadSplit,
      member: memberSplit,
      split_model: splitModel,
    })
      .then((res) => {
        if (!mounted) return;
        const pShare = Math.round(((calcBudget * platformSplit) / 100) * 100) / 100;
        const oShare = Math.round(((calcBudget * overheadSplit) / 100) * 100) / 100;
        const mShare = Math.round(((calcBudget * memberSplit) / 100) * 100) / 100;
        const perMember = calcMemberCount > 0 ? Math.round((mShare / calcMemberCount) * 100) / 100 : 0;
        setSalaryProjection({
          ...res,
          split_model: splitModel,
          platform_split_percent: platformSplit,
          overhead_split_percent: overheadSplit,
          member_split_percent: memberSplit,
          platform_treasury_share: pShare,
          overhead_pool_share: oShare,
          team_pool_share: mShare,
          projected_salary_per_member: perMember,
        });
        setIsCalculating(false);
      })
      .catch(() => {
        if (!mounted) return;
        const pShare = Math.round(((calcBudget * platformSplit) / 100) * 100) / 100;
        const oShare = Math.round(((calcBudget * overheadSplit) / 100) * 100) / 100;
        const mShare = Math.round(((calcBudget * memberSplit) / 100) * 100) / 100;
        const perMember = calcMemberCount > 0 ? Math.round((mShare / calcMemberCount) * 100) / 100 : 0;
        setSalaryProjection({
          total_budget: calcBudget,
          split_model: splitModel,
          platform_split_percent: platformSplit,
          overhead_split_percent: overheadSplit,
          member_split_percent: memberSplit,
          platform_treasury_share: pShare,
          overhead_pool_share: oShare,
          team_pool_share: mShare,
          member_count: calcMemberCount,
          projected_salary_per_member: perMember,
        });
        setIsCalculating(false);
      });

    return () => {
      mounted = false;
    };
  }, [calcBudget, calcMemberCount, platformSplit, overheadSplit, memberSplit, splitModel]);

  const applyModelPreset = (model: 'three_tier_60_15_25' | 'standard_70_30') => {
    setSplitModel(model);
    if (model === 'three_tier_60_15_25') {
      setMemberSplit(60);
      setOverheadSplit(15);
      setPlatformSplit(25);
    } else {
      setMemberSplit(70);
      setOverheadSplit(0);
      setPlatformSplit(30);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const total = platformSplit + overheadSplit + memberSplit;
    if (total !== 100) {
      setSaveError(`Split percentages must total exactly 100%. Currently: ${total}%.`);
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      await api.updateFinancialSettings({
        company_name: companyName.trim(),
        support_email: supportEmail.trim(),
        currency,
        timezone,
        split_model: splitModel,
        platform_split_percent: platformSplit,
        overhead_split_percent: overheadSplit,
        member_split_percent: memberSplit,
        notify_on_milestone: notifyOnMilestone,
        notify_on_withdrawal: notifyOnWithdrawal,
        pricing_tiers: pricingTiers,
        role_weights: roleWeights,
        min_withdrawal_amount: minWithdrawal,
        max_withdrawal_amount: maxWithdrawal === '' ? null : maxWithdrawal,
        company_profile: {
          legal_name: companyName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          website_url: websiteUrl.trim(),
          payment_redirect_url: '',
          email_from_name: companyName.trim(),
          email_signature: emailSignature.trim(),
          socials: {
            linkedin: linkedinUrl.trim(),
            twitter: twitterUrl.trim(),
            instagram: instagramUrl.trim(),
            tiktok: tiktokUrl.trim(),
            github: githubUrl.trim(),
          },
          it_github_issues_url: itGithubUrl.trim(),
          it_slack_channel_url: itSlackUrl.trim(),
          calendly_url: calendlyUrl.trim(),
          whatsapp_number: whatsappNumber.trim(),
          copyright_year: copyrightYear,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update system settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="tc-settings-loading">
        <div className="tc-settings-loading-inner">
          <Loader2 size={20} className="tc-spin" color="#dfae32" />
          <span>Loading system and financial settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tc-settings-container tc-fade-in">
      {/* Header */}
      <div className="tc-settings-header">
        <h1 className="tc-settings-title">
          System & Enterprise Settings
        </h1>
        <p className="tc-settings-subtitle">
          Global agency configuration, escrow profit split schedules, member salary logic, and real-time alerts.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Company Profile */}
        <div className="tc-settings-card">
          <h3 className="tc-settings-section-title">
            Organization Entity & Branding
          </h3>

          <div className="tc-settings-grid-2">
            <div className="tc-settings-field">
              <label className="tc-settings-label">
                Legal Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="tc-settings-input"
              />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">
                Support / Billing Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                className="tc-settings-input"
              />
            </div>
          </div>

          {/* Contact & Social Links sub-section */}
          <h4 className="tc-settings-section-title" style={{ fontSize: '0.85rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Contact &amp; Social Links
          </h4>
          <div className="tc-settings-grid-2">
            <div className="tc-settings-field">
              <label className="tc-settings-label">Phone / WhatsApp</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="tc-settings-input" />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="tc-settings-input" />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Website URL</label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="tc-settings-input" />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Calendly URL</label>
              <input type="url" value={calendlyUrl} onChange={(e) => setCalendlyUrl(e.target.value)} className="tc-settings-input" placeholder="https://calendly.com/..." />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Email Signature</label>
              <input type="text" value={emailSignature} onChange={(e) => setEmailSignature(e.target.value)} className="tc-settings-input" />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Copyright Year</label>
              <input type="number" value={copyrightYear} onChange={(e) => setCopyrightYear(Number(e.target.value))} className="tc-settings-input" min={2020} max={2100} />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">IT GitHub Issues URL</label>
              <input type="url" value={itGithubUrl} onChange={(e) => setItGithubUrl(e.target.value)} className="tc-settings-input" />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">IT Slack Channel URL</label>
              <input type="url" value={itSlackUrl} onChange={(e) => setItSlackUrl(e.target.value)} className="tc-settings-input" />
            </div>
          </div>

          <h4 className="tc-settings-section-title" style={{ fontSize: '0.85rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Social Profiles
          </h4>
          <div className="tc-settings-grid-2">
            <div className="tc-settings-field">
              <label className="tc-settings-label">LinkedIn URL</label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="tc-settings-input" placeholder="https://linkedin.com/company/..." />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Twitter / X URL</label>
              <input type="url" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className="tc-settings-input" placeholder="https://x.com/..." />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Instagram URL</label>
              <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="tc-settings-input" placeholder="https://instagram.com/..." />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">TikTok URL</label>
              <input type="url" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} className="tc-settings-input" placeholder="https://tiktok.com/@..." />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">GitHub URL</label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="tc-settings-input" placeholder="https://github.com/..." />
            </div>
          </div>
        </div>

        {/* Section 2: Financial Settlement & Escrow Profit Split */}
        <div className="tc-settings-card">
          <div className="tc-flex-between tc-mb-3">
            <h3 className="tc-settings-section-title tc-mb-0">
              Escrow & Profit Split Model
            </h3>
            <div className="tc-tab-pill-group">
              <button
                type="button"
                onClick={() => applyModelPreset('three_tier_60_15_25')}
                className={`tc-tab-pill-btn ${splitModel === 'three_tier_60_15_25' ? 'tc-tab-pill-btn--active' : ''}`}
              >
                3-Tier Model (60 / 15 / 25)
              </button>
              <button
                type="button"
                onClick={() => applyModelPreset('standard_70_30')}
                className={`tc-tab-pill-btn ${splitModel === 'standard_70_30' ? 'tc-tab-pill-btn--active' : ''}`}
              >
                Standard (70 / 30)
              </button>
            </div>
          </div>

          <p className="tc-dashboard-subtitle tc-mb-3">
            TitanCode settles client milestone payments automatically. The 3-Tier model provisions 60% to project engineers, 15% to non-billable staff overhead pool (marketing, sales, ops), and 25% to Corporate Treasury.
          </p>

          <div className="tc-settings-grid-2">
            <div className="tc-settings-field">
              <label className="tc-settings-label">
                Settlement Base Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="tc-settings-select"
              >
                <option value="USD">USD ($) — United States Dollar (Subunit: Cents)</option>
                <option value="NGN">NGN (₦) — Nigerian Naira (Subunit: Kobo)</option>
                <option value="GHS">GHS (GH₵) — Ghanaian Cedi (Subunit: Pesewas)</option>
                <option value="KES">KES (KSh) — Kenyan Shilling (Subunit: Cents)</option>
                <option value="EUR">EUR (€) — Euro (Subunit: Cents)</option>
                <option value="GBP">GBP (£) — British Pound (Subunit: Pence)</option>
              </select>
            </div>

            <div className="tc-settings-field">
              <label className="tc-settings-label">
                System Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="tc-settings-select"
              >
                <option value="UTC+01:00 (Lagos / Paris)">UTC+01:00 (Lagos / Paris)</option>
                <option value="UTC+00:00 (London / Accra)">UTC+00:00 (London / Accra)</option>
                <option value="UTC-05:00 (New York / EST)">UTC-05:00 (New York / EST)</option>
                <option value="UTC-08:00 (San Francisco / PST)">UTC-08:00 (San Francisco / PST)</option>
              </select>
            </div>
          </div>

          {/* Profit Split Sliders (3 Tiers) */}
          <div className="tc-settings-grid-3">
            <div className="tc-settings-card tc-mb-0">
              <div className="tc-settings-slider-header">
                <span className="tc-settings-slider-label">
                  Project Squad Pool
                </span>
                <span className="tc-settings-slider-val tc-settings-slider-val--emerald">
                  {memberSplit}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={memberSplit}
                onChange={(e) => {
                  setMemberSplit(Number(e.target.value));
                  setSplitModel('custom');
                }}
                className="tc-settings-range tc-settings-range--emerald"
              />
              <div className="tc-settings-helper-text">
                Distributed to billable developers, designers, and tech leads.
              </div>
            </div>

            <div className="tc-settings-card tc-mb-0">
              <div className="tc-settings-slider-header">
                <span className="tc-settings-slider-label">
                  Staff Overhead Pool
                </span>
                <span className="tc-settings-slider-val tc-text-info">
                  {overheadSplit}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={overheadSplit}
                onChange={(e) => {
                  setOverheadSplit(Number(e.target.value));
                  setSplitModel('custom');
                }}
                className="tc-settings-range"
              />
              <div className="tc-settings-helper-text">
                Covers non-billable staff, project managers, marketing & ops.
              </div>
            </div>

            <div className="tc-settings-card tc-mb-0">
              <div className="tc-settings-slider-header">
                <span className="tc-settings-slider-label">
                  Platform Treasury
                </span>
                <span className="tc-settings-slider-val tc-settings-slider-val--gold">
                  {platformSplit}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={platformSplit}
                onChange={(e) => {
                  setPlatformSplit(Number(e.target.value));
                  setSplitModel('custom');
                }}
                className="tc-settings-range tc-settings-range--gold"
              />
              <div className="tc-settings-helper-text">
                Corporate reserves, cloud infrastructure, and risk contingency.
              </div>
            </div>
          </div>

          {memberSplit + overheadSplit + platformSplit !== 100 && (
            <div className="tc-alert-banner-error tc-mt-2">
              <AlertCircle size={15} />
              <span>
                Total split must equal 100%. Currently: {memberSplit + overheadSplit + platformSplit}%.
              </span>
            </div>
          )}
        </div>

        {/* Section 3: Dynamic Client Project Pricing Tiers */}
        <div className="tc-settings-card">
          <div className="tc-pricing-tiers-header">
            <div className="tc-flex-center-gap">
              <DollarSign size={18} color="#dfae32" />
              <h3 className="tc-modal-title">
                Client Project Pricing Tiers
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTier({
                  id: `tier-${Date.now()}`,
                  label: '',
                  min_amount: 0,
                  max_amount: null,
                  description: '',
                  is_active: true,
                });
              }}
              className="tc-action-btn-gold"
            >
              <Plus size={14} /> Add Tier
            </button>
          </div>
          <p className="tc-dashboard-subtitle tc-mb-3">
            Configure the budget tiers clients select when requesting projects. Admin can adjust ranges, labels, and descriptions anytime.
          </p>

          {editingTier && (
            <div className="tc-pricing-tier-edit-box">
              <h4 className="tc-tier-edit-title">
                {editingTier.id.startsWith('tier-') ? 'Create New Tier' : 'Edit Tier'}
              </h4>
              <div className="tc-settings-grid-3">
                <div className="tc-settings-field">
                  <label className="tc-settings-label tc-settings-label--small">Tier Label</label>
                  <input
                    type="text"
                    value={editingTier.label}
                    onChange={(e) => setEditingTier({ ...editingTier, label: e.target.value })}
                    placeholder="e.g. Starter, Standard, Professional"
                    className="tc-settings-input"
                  />
                </div>
                <div className="tc-settings-field">
                  <label className="tc-settings-label tc-settings-label--small">Minimum Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingTier.min_amount}
                    onChange={(e) => setEditingTier({ ...editingTier, min_amount: Number(e.target.value) })}
                    className="tc-settings-input"
                  />
                </div>
                <div className="tc-settings-field">
                  <label className="tc-settings-label tc-settings-label--small">Maximum Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingTier.max_amount ?? ''}
                    onChange={(e) => setEditingTier({ ...editingTier, max_amount: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Unlimited"
                    className="tc-settings-input"
                  />
                </div>
              </div>
              <div className="tc-mb-3">
                <label className="tc-settings-label tc-settings-label--small">Description</label>
                <textarea
                  rows={2}
                  value={editingTier.description}
                  onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                  placeholder="What's included in this tier..."
                  className="tc-settings-textarea"
                />
              </div>
              <div className="tc-flex-center-gap tc-mb-3">
                <label className="tc-checkbox-row tc-text-white">
                  <input
                    type="checkbox"
                    checked={editingTier.is_active}
                    onChange={(e) => setEditingTier({ ...editingTier, is_active: e.target.checked })}
                    className="tc-checkbox-gold-sm"
                  />
                  Active
                </label>
              </div>
              <div className="tc-flex-end-gap">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="tc-btn-subtle-edit"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingTier.id.startsWith('tier-')) {
                      setPricingTiers([...pricingTiers, editingTier]);
                    } else {
                      setPricingTiers(pricingTiers.map((t) => (t.id === editingTier.id ? editingTier : t)));
                    }
                    setEditingTier(null);
                  }}
                  disabled={!editingTier.label.trim() || editingTier.min_amount === null || editingTier.min_amount < 0}
                  className="tc-action-btn-gold"
                >
                  {editingTier.id.startsWith('tier-') ? 'Add Tier' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          <div className="tc-pricing-tiers-list">
            {pricingTiers.length === 0 ? (
              <div className="tc-tier-empty-state">
                No pricing tiers configured. Click "Add Tier" to create your first tier.
              </div>
            ) : (
              pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`tc-pricing-tier-row ${tier.is_active ? 'tc-pricing-tier-row--active' : ''}`}
                >
                  <div className="tc-flex-1-min-0">
                    <div className="tc-flex-center-gap tc-flex-wrap tc-mb-1">
                      <span className="tc-font-bold tc-text-white">{tier.label}</span>
                      <span className={`tc-tier-badge ${tier.is_active ? 'tc-tier-badge--active' : 'tc-tier-badge--inactive'}`}>
                        {tier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="tc-text-gold tc-font-semibold tc-text-xs">
                      ${tier.min_amount.toLocaleString()}
                      {tier.max_amount !== null ? ` - $${tier.max_amount.toLocaleString()}` : '+'}
                    </div>
                    <div className="tc-text-muted tc-tier-desc-truncate">
                      {tier.description}
                    </div>
                  </div>
                  <div className="tc-flex-center-gap">
                    <button
                      type="button"
                      onClick={() => setEditingTier(tier)}
                      className="tc-btn-subtle-edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingTiers(pricingTiers.filter((t) => t.id !== tier.id))}
                      className="tc-btn-subtle-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Role Pay Weights */}
        <div className="tc-settings-card">
          <h3 className="tc-settings-section-title">Role Pay Weights</h3>
          <p className="tc-dashboard-subtitle tc-mb-3">
            Multipliers applied to each role's share of the project squad pool. A weight of 2.0 means that role earns twice the base share.
          </p>
          <div className="tc-settings-grid-3">
            {Object.entries(roleWeights).map(([role, weight]) => (
              <div key={role} className="tc-settings-field">
                <label className="tc-settings-label">{role}</label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setRoleWeights(prev => ({ ...prev, [role]: Number(e.target.value) }))}
                  className="tc-settings-input"
                />
              </div>
            ))}
          </div>
          {/* Min/Max Withdrawal */}
          <div className="tc-settings-grid-2 tc-mt-3">
            <div className="tc-settings-field">
              <label className="tc-settings-label">Minimum Withdrawal Amount</label>
              <input type="number" min="0" step="1" value={minWithdrawal} onChange={(e) => setMinWithdrawal(Number(e.target.value))} className="tc-settings-input" />
            </div>
            <div className="tc-settings-field">
              <label className="tc-settings-label">Maximum Withdrawal Amount (leave blank for no limit)</label>
              <input type="number" min="0" step="1" value={maxWithdrawal} onChange={(e) => setMaxWithdrawal(e.target.value === '' ? '' : Number(e.target.value))} className="tc-settings-input" />
            </div>
          </div>
        </div>

        {/* Section 4: Simulator */}
        <div className="tc-settings-card tc-settings-card--highlight">
          <div className="tc-flex-center-gap tc-mb-3">
            <Calculator size={18} color="#dfae32" />
            <h3 className="tc-modal-title">
              Salary from Profit Split Simulator
            </h3>
          </div>
          <p className="tc-dashboard-subtitle tc-mb-4">
            Simulate real take-home member salary and agency earnings dynamically from project budget and roster size using the live profit-split engine.
          </p>

          <div className="tc-settings-grid-2">
            <div className="tc-settings-field">
              <label className="tc-settings-label">
                Project Total Contract Budget ($)
              </label>
              <div className="tc-input-icon-wrapper">
                <span className="tc-input-icon">
                  <DollarSign size={14} />
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Math.max(0, Number(e.target.value)))}
                  className="tc-settings-input tc-settings-input-with-icon"
                />
              </div>
            </div>

            <div className="tc-settings-field">
              <label className="tc-settings-label">
                Assigned Team Members Count
              </label>
              <div className="tc-input-icon-wrapper">
                <span className="tc-input-icon">
                  <Users size={14} />
                </span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={calcMemberCount}
                  onChange={(e) => setCalcMemberCount(Math.max(1, Number(e.target.value)))}
                  className="tc-settings-input tc-settings-input-with-icon"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="tc-simulator-results-grid">
            <div className="tc-simulator-result-card">
              <div className="tc-text-muted tc-mb-1 tc-text-xs">Squad Pool ({memberSplit}%)</div>
              <div className="tc-font-extrabold tc-text-xl tc-text-success">
                ${(salaryProjection?.team_pool_share || 0).toLocaleString()}
              </div>
            </div>

            <div className="tc-simulator-result-card">
              <div className="tc-text-muted tc-mb-1 tc-text-xs">Staff Overhead ({overheadSplit}%)</div>
              <div className="tc-font-extrabold tc-text-xl tc-text-info">
                ${(salaryProjection?.overhead_pool_share || 0).toLocaleString()}
              </div>
            </div>

            <div className="tc-simulator-result-card">
              <div className="tc-text-muted tc-mb-1 tc-text-xs">Platform Treasury ({platformSplit}%)</div>
              <div className="tc-font-extrabold tc-text-xl tc-text-gold">
                ${(salaryProjection?.platform_treasury_share || 0).toLocaleString()}
              </div>
            </div>

            <div className="tc-simulator-result-card tc-simulator-result-card--highlight">
              <div className="tc-font-semibold tc-mb-1 tc-text-xs tc-text-gold">Projected Salary / Member</div>
              <div className="tc-font-extrabold tc-text-xl tc-text-white">
                ${(salaryProjection?.projected_salary_per_member || 0).toLocaleString()}
              </div>
            </div>
          </div>
          {isCalculating && (
            <div className="tc-text-muted tc-flex-center-gap tc-mt-2 tc-text-2xs">
              <Loader2 size={12} className="tc-spin" />
              <span>Syncing with backend payout engine...</span>
            </div>
          )}
        </div>

        {/* Section 5: Real-Time Notification Policies */}
        <div className="tc-settings-card">
          <h3 className="tc-settings-section-title">
            Notification Triggers & Webhooks
          </h3>

          <div className="tc-notification-triggers-list">
            <label className="tc-checkbox-row">
              <input
                type="checkbox"
                checked={notifyOnMilestone}
                onChange={(e) => setNotifyOnMilestone(e.target.checked)}
                className="tc-checkbox-gold"
              />
              <div>
                <div className="tc-font-semibold tc-text-white tc-text-sm">
                  Auto-broadcast WebSocket alert on Project Milestone Complete
                </div>
                <div className="tc-text-muted tc-text-xs">
                  Notifies all contributing engineering members and clients immediately.
                </div>
              </div>
            </label>

            <label className="tc-checkbox-row">
              <input
                type="checkbox"
                checked={notifyOnWithdrawal}
                onChange={(e) => setNotifyOnWithdrawal(e.target.checked)}
                className="tc-checkbox-gold"
              />
              <div>
                <div className="tc-font-semibold tc-text-white tc-text-sm">
                  Notify Admin on Member Bank Withdrawal Submission
                </div>
                <div className="tc-text-muted tc-text-xs">
                  Dispatches high-priority alert to the executive treasury team for wire clearance.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Section 6: Ecosystem Integrations & Support Rails */}
        <div className="tc-settings-card">
          <h3 className="tc-settings-section-title">
            Ecosystem Integrations & Support Rails
          </h3>
          <p className="tc-dashboard-subtitle tc-mb-4">
            Production adapters for CRM sync, workspace notifications, customer live support, and IT help desk.
          </p>

          <div className="tc-settings-grid-2">
            {/* 1. HubSpot CRM */}
            <div className="tc-simulator-result-card">
              <div className="tc-flex-between tc-mb-2">
                <span className="tc-font-bold tc-text-white tc-text-sm">HubSpot CRM Ingestion</span>
                <span className="tc-badge-status tc-badge-status--approved">Operational</span>
              </div>
              <p className="tc-text-muted-xs tc-mb-2">
                Inbound client inquiries and leads auto-sync directly into HubSpot CRM Contacts API v3.
              </p>
              <div className="tc-text-2xs tc-text-gold font-mono">
                API: POST /crm/v3/objects/contacts
              </div>
            </div>

            {/* 2. Slack Workspace Webhook */}
            <div className="tc-simulator-result-card">
              <div className="tc-flex-between tc-mb-2">
                <span className="tc-font-bold tc-text-white tc-text-sm">Slack Workspace Webhook</span>
                <span className="tc-badge-status tc-badge-status--approved">Operational</span>
              </div>
              <p className="tc-text-muted-xs tc-mb-2">
                Dispatches milestone completion alerts and project discussion streams to #projects and #dev-alerts.
              </p>
              <div className="tc-text-2xs tc-text-gold font-mono">
                Channels: #projects & #it-support
              </div>
            </div>

            {/* 3. Customer Support Widget (Crisp / Intercom) */}
            <div className="tc-simulator-result-card">
              <div className="tc-flex-between tc-mb-2">
                <span className="tc-font-bold tc-text-white tc-text-sm">Crisp Live Chat Support</span>
                <span className="tc-badge-status tc-badge-status--approved">Embedded</span>
              </div>
              <p className="tc-text-muted-xs tc-mb-3">
                Zero-code live support concierge widget embedded for visitors and clients.
              </p>
              <button
                type="button"
                onClick={() => {
                  if ((window as any).$crisp) {
                    (window as any).$crisp.push(['do', 'chat:open']);
                  } else {
                    alert('Crisp live chat script loaded. Click the chat bubble in the bottom right corner.');
                  }
                }}
                className="tc-btn-subtle-edit tc-w-full tc-text-center"
              >
                Launch Live Support Chat
              </button>
            </div>

            {/* 4. IT Support & Help Desk */}
            <div className="tc-simulator-result-card">
              <div className="tc-flex-between tc-mb-2">
                <span className="tc-font-bold tc-text-white tc-text-sm">IT Support & DevOps Desk</span>
                <span className="tc-badge-muted-pill">Strategy: Defer</span>
              </div>
              <p className="tc-text-muted-xs tc-mb-3">
                Zero bloat ticketing — internal technical requests route to GitHub Issues or Slack #it-support.
              </p>
              <div className="tc-flex-center-gap">
                <a
                  href="https://github.com/titancode/titancode/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-btn-subtle-edit tc-flex-1 tc-text-center"
                >
                  GitHub Issues
                </a>
                <a
                  href="https://slack.com/app_redirect?channel=it-support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-btn-subtle-edit tc-flex-1 tc-text-center"
                >
                  Slack #it-support
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* Error message */}
        {saveError && (
          <div className="tc-alert-banner-error">
            <AlertCircle size={16} />
            <span>{saveError}</span>
          </div>
        )}

        {/* Save CTA */}
        <div className="tc-save-actions-row">
          <button
            type="submit"
            disabled={isSaving}
            className="tc-action-btn-gold tc-btn-save-settings"
          >
            {isSaving ? <Loader2 size={16} className="tc-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Saving...' : 'Save System Settings'}</span>
          </button>
          {saved && (
            <span className="tc-save-success-msg">
              <CheckCircle2 size={16} />
              <span>Settings successfully updated</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

