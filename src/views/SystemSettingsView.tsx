import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
} from 'lucide-react';
import type { ScreenId } from '../App';

export const SystemSettingsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [companyName, setCompanyName] = useState('TitanCode Technologies Ltd.');
  const [supportEmail, setSupportEmail] = useState('support@titancode.tech');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC+00:00 (London / Accra)');
  const [escrowSplitPlatform, setEscrowSplitPlatform] = useState('10');
  const [notifyOnMilestone, setNotifyOnMilestone] = useState(true);
  const [notifyOnWithdrawal, setNotifyOnWithdrawal] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ color: '#FFFFFF', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
          System & Enterprise Settings
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
          Global agency configuration, escrow commission schedules, default currency, and webhooks.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Company Profile */}
        <div
          style={{
            backgroundColor: '#11151F',
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

        {/* Section 2: Financial & Localization */}
        <div
          style={{
            backgroundColor: '#11151F',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#dfae32' }}>
            Financial Settlement & Escrow Commission
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                <option value="UTC+00:00 (London / Accra)">UTC+00:00 (London / Accra)</option>
                <option value="UTC+01:00 (Lagos / Paris)">UTC+01:00 (Lagos / Paris)</option>
                <option value="UTC-05:00 (New York / EST)">UTC-05:00 (New York / EST)</option>
                <option value="UTC-08:00 (San Francisco / PST)">UTC-08:00 (San Francisco / PST)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
              Platform Treasury Reserve Cut (%)
            </label>
            <input
              type="number"
              value={escrowSplitPlatform}
              onChange={(e) => setEscrowSplitPlatform(e.target.value)}
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

        {/* Section 3: Real-Time Notification Policies */}
        <div
          style={{
            backgroundColor: '#0f121bff',
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

        {/* Save CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#dfae32',
              color: '#0A0D14',
              fontWeight: 700,
              fontSize: '14px',
              padding: '12px 28px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(223, 174, 50, 0.25)',
            }}
          >
            <Save size={16} />
            <span>Save System Settings</span>
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
