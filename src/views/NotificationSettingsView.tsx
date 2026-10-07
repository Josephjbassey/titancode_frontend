import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';

export const NotificationSettingsView: React.FC = () => {
  const [notifyMilestone, setNotifyMilestone] = useState(true);
  const [notifyWithdrawal, setNotifyWithdrawal] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getFinancialSettings()
      .then((s) => {
        setNotifyMilestone((s as any).notify_on_milestone ?? true);
        setNotifyWithdrawal((s as any).notify_on_withdrawal ?? true);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateFinancialSettings({
        notify_on_milestone: notifyMilestone,
        notify_on_withdrawal: notifyWithdrawal,
      } as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    finally { setIsSaving(false); }
  };

  if (isLoading) {
    return (
      <div className="tc-settings-loading">
        <Loader2 size={18} className="tc-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="tc-fade-in">
      <div className="tc-settings-card">
        <h3 className="tc-settings-section-title">Notification Preferences</h3>
        <p className="tc-dashboard-subtitle tc-mb-3">Control which events trigger system notifications.</p>
        <div className="tc-settings-toggle-list">
          <label className="tc-settings-toggle-row">
            <div>
              <div className="tc-settings-label">Project Milestone Notifications</div>
              <div className="tc-settings-helper-text">Receive alerts when a project milestone is completed or approved.</div>
            </div>
            <input type="checkbox" checked={notifyMilestone} onChange={(e) => setNotifyMilestone(e.target.checked)} className="tc-toggle-input" />
          </label>
          <label className="tc-settings-toggle-row">
            <div>
              <div className="tc-settings-label">Withdrawal Request Notifications</div>
              <div className="tc-settings-helper-text">Receive alerts when a team member requests a payout withdrawal.</div>
            </div>
            <input type="checkbox" checked={notifyWithdrawal} onChange={(e) => setNotifyWithdrawal(e.target.checked)} className="tc-toggle-input" />
          </label>
        </div>
        <div className="tc-settings-actions">
          <button type="button" onClick={handleSave} disabled={isSaving} className="tc-btn-save">
            {isSaving ? <Loader2 size={16} className="tc-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? 'Saved' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
