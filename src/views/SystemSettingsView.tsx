import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Loader2,
  DollarSign,
  Users,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';
import type { SalaryProjection } from '../types';

export const SystemSettingsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [companyName, setCompanyName] = useState('TitanCode Technologies Ltd.');
  const [supportEmail, setSupportEmail] = useState('support@titancode.tech');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC+01:00 (Lagos / Paris)');
  const [platformSplit, setPlatformSplit] = useState(30);
  const [memberSplit, setMemberSplit] = useState(70);
  const [notifyOnMilestone, setNotifyOnMilestone] = useState(true);
  const [notifyOnWithdrawal, setNotifyOnWithdrawal] = useState(true);

  // Status & Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Salary from Profit Split Logic Calculator state
  const [calcBudget, setCalcBudget] = useState(50000);
  const [calcMemberCount, setCalcMemberCount] = useState(5);
  const [salaryProjection, setSalaryProjection] = useState<SalaryProjection | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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
        setPlatformSplit(settings.platform_split_percent);
        setMemberSplit(settings.member_split_percent);
        setNotifyOnMilestone(settings.notify_on_milestone);
        setNotifyOnWithdrawal(settings.notify_on_withdrawal);
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

    api.calculateSalarySplit(calcBudget, calcMemberCount)
      .then((res) => {
        if (!mounted) return;
        // Overwrite split percentages with local inputs if customized
        const pShare = Math.round((calcBudget * platformSplit) / 100 * 100) / 100;
        const mShare = Math.round((calcBudget * memberSplit) / 100 * 100) / 100;
        const perMember = calcMemberCount > 0 ? Math.round((mShare / calcMemberCount) * 100) / 100 : 0;
        setSalaryProjection({
          ...res,
          platform_split_percent: platformSplit,
          member_split_percent: memberSplit,
          platform_treasury_share: pShare,
          team_pool_share: mShare,
          projected_salary_per_member: perMember,
        });
        setIsCalculating(false);
      })
      .catch(() => {
        if (!mounted) return;
        const pShare = Math.round((calcBudget * platformSplit) / 100 * 100) / 100;
        const mShare = Math.round((calcBudget * memberSplit) / 100 * 100) / 100;
        const perMember = calcMemberCount > 0 ? Math.round((mShare / calcMemberCount) * 100) / 100 : 0;
        setSalaryProjection({
          total_budget: calcBudget,
          platform_split_percent: platformSplit,
          member_split_percent: memberSplit,
          platform_treasury_share: pShare,
          team_pool_share: mShare,
          member_count: calcMemberCount,
          projected_salary_per_member: perMember,
        });
        setIsCalculating(false);
      });

    return () => {
      mounted = false;
    };
  }, [calcBudget, calcMemberCount, platformSplit, memberSplit]);

  const handlePlatformSplitChange = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setPlatformSplit(clamped);
    setMemberSplit(100 - clamped);
  };

  const handleMemberSplitChange = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setMemberSplit(clamped);
    setPlatformSplit(100 - clamped);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (platformSplit + memberSplit !== 100) {
      setSaveError('Split percentages must total exactly 100%.');
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
        platform_split_percent: platformSplit,
        member_split_percent: memberSplit,
        notify_on_milestone: notifyOnMilestone,
        notify_on_withdrawal: notifyOnWithdrawal,
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
      <div style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Loader2 size={20} className="tc-spin" color="#dfae32" />
          <span style={{ fontSize: '14px' }}>Loading system and financial settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tc-fade-in" style={{ color: '#FFFFFF', maxWidth: '840px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
          System & Enterprise Settings
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
          Global agency configuration, escrow profit split schedules, member salary logic, and real-time alerts.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Company Profile */}
        <div
          style={{
            backgroundColor: '#232324',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#dfae32' }}>
            Organization Entity & Branding
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                Legal Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                Support / Billing Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Escrow Profit Split */}
        <div
          style={{
            backgroundColor: '#232324',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#dfae32' }}>
            Financial Settlement & Escrow Profit Split (70 / 30 Standard)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                Settlement Base Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option value="USD">USD ($) United States Dollar</option>
                <option value="NGN">NGN (₦) Nigerian Naira</option>
                <option value="GBP">GBP (£) British Pound</option>
                <option value="EUR">EUR (€) Euro</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                System Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option value="UTC+01:00 (Lagos / Paris)">UTC+01:00 (Lagos / Paris)</option>
                <option value="UTC+00:00 (London / Accra)">UTC+00:00 (London / Accra)</option>
                <option value="UTC-05:00 (New York / EST)">UTC-05:00 (New York / EST)</option>
                <option value="UTC-08:00 (San Francisco / PST)">UTC-08:00 (San Francisco / PST)</option>
              </select>
            </div>
          </div>

          {/* Profit Split Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '16px', backgroundColor: '#181819', borderRadius: '10px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB', fontWeight: 600 }}>
                  Team Member Pool Share
                </span>
                <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>
                  {memberSplit}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={memberSplit}
                onChange={(e) => handleMemberSplitChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Allocated to participating engineers, designers, and contributors.
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB', fontWeight: 600 }}>
                  Platform Treasury Reserve
                </span>
                <span style={{ fontSize: '13px', color: '#dfae32', fontWeight: 700 }}>
                  {platformSplit}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={platformSplit}
                onChange={(e) => handlePlatformSplitChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#dfae32', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Retained for platform operations, infrastructure, and buffer reserves.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Salary from Profit Split Logic Calculator (Interactive) */}
        <div
          style={{
            backgroundColor: '#232324',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid rgba(223, 174, 50, 0.25)',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calculator size={18} color="#dfae32" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Salary from Profit Split Simulator
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 20px', lineHeight: 1.5 }}>
            Simulate real take-home member salary and agency earnings dynamically from project budget and roster size using the live profit-split engine.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '6px' }}>
                Project Total Contract Budget ($)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                  <DollarSign size={14} />
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Math.max(0, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px 10px 32px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '6px' }}>
                Assigned Team Members Count
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                  <Users size={14} />
                </span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={calcMemberCount}
                  onChange={(e) => setCalcMemberCount(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px 10px 32px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Total Developer Pool ({memberSplit}%)</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>
                ${(salaryProjection?.team_pool_share || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Platform Treasury ({platformSplit}%)</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#dfae32' }}>
                ${(salaryProjection?.platform_treasury_share || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(223, 174, 50, 0.1)', border: '1px solid rgba(223, 174, 50, 0.3)' }}>
              <div style={{ fontSize: '12px', color: '#ECC046', fontWeight: 600, marginBottom: '4px' }}>Projected Salary / Member</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                ${(salaryProjection?.projected_salary_per_member || 0).toLocaleString()}
              </div>
            </div>
          </div>
          {isCalculating && (
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Loader2 size={12} className="tc-spin" />
              <span>Syncing with backend payout engine...</span>
            </div>
          )}
        </div>

        {/* Section 4: Real-Time Notification Policies */}
        <div
          style={{
            backgroundColor: '#232324',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '28px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#dfae32' }}>
            Notification Triggers & Webhooks
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifyOnMilestone}
                onChange={(e) => setNotifyOnMilestone(e.target.checked)}
                style={{ accentColor: '#dfae32', width: '18px', height: '18px' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                  Auto-broadcast WebSocket alert on Project Milestone Complete
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  Notifies all contributing engineering members and clients immediately.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifyOnWithdrawal}
                onChange={(e) => setNotifyOnWithdrawal(e.target.checked)}
                style={{ accentColor: '#dfae32', width: '18px', height: '18px' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                  Notify Admin on Member Bank Withdrawal Submission
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  Dispatches high-priority alert to the executive treasury team for wire clearance.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Error message */}
        {saveError && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}>
            <AlertCircle size={16} />
            <span>{saveError}</span>
          </div>
        )}

        {/* Save CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="tc-action-btn-gold"
            style={{
              fontSize: '14px',
              padding: '12px 28px',
              height: 'auto',
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isSaving ? <Loader2 size={16} className="tc-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Saving...' : 'Save System Settings'}</span>
          </button>
          {saved && (
            <span style={{ color: '#10B981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} />
              <span>Settings successfully updated</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
