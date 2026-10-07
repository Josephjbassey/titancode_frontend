import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Copy, Check, Plus, Loader2, ExternalLink } from 'lucide-react';
import type { ScreenId } from '../App';

interface ClientInvoice {
  id: number;
  invoice_id: string;
  project_id: number;
  client_email: string;
  total_amount: string;
  currency: string;
  provider: string | null;
  payment_url: string | null;
  status: string;
  created_at: string;
}

export const BillingView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);

  // Generate form state
  const [genProjectId, setGenProjectId] = useState('');
  const [genEmail, setGenEmail] = useState('');
  const [genClientName, setGenClientName] = useState('');
  const [genAmount, setGenAmount] = useState('');
  const [genDesc, setGenDesc] = useState('');
  const [genMethod, setGenMethod] = useState<'paystack' | 'flutterwave'>('paystack');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const load = () => {
    setIsLoading(true);
    api.listInvoices().then(setInvoices).catch(() => setInvoices([])).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerateError('');
    try {
      await api.generateInvoice({
        project_id: Number(genProjectId),
        email: genEmail,
        client_name: genClientName,
        items: [{ description: genDesc, amount: Number(genAmount) }],
        payment_method: genMethod,
      });
      setShowGenerate(false);
      setGenProjectId(''); setGenEmail(''); setGenClientName(''); setGenAmount(''); setGenDesc('');
      load();
    } catch (err: any) {
      setGenerateError(err.message || 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === 'paid') return 'tc-badge tc-badge--success';
    if (s === 'cancelled' || s === 'failed') return 'tc-badge tc-badge--error';
    return 'tc-badge tc-badge--warning';
  };

  return (
    <div className="tc-fade-in tc-view-container">
      <div className="tc-page-header">
        <div>
          <h1 className="tc-page-title">Client Invoices</h1>
          <p className="tc-dashboard-subtitle">Manage all client invoices and payment links.</p>
        </div>
        <button type="button" className="tc-btn-primary" onClick={() => setShowGenerate(true)}>
          <Plus size={16} /> Generate Invoice
        </button>
      </div>

      {isLoading ? (
        <div className="tc-loading-state"><Loader2 size={20} className="tc-spin" /><span>Loading invoices...</span></div>
      ) : (
        <div className="tc-settings-card tc-p-0">
          <div style={{ overflowX: 'auto' }}>
            <table className="tc-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client Email</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} className="tc-table-empty">No invoices yet.</td></tr>
                ) : invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="tc-monospace">{inv.invoice_id.slice(0, 16)}…</td>
                    <td>{inv.client_email}</td>
                    <td>{inv.currency} {Number(inv.total_amount).toLocaleString()}</td>
                    <td><span className={statusColor(inv.status)}>{inv.status}</span></td>
                    <td>{inv.created_at.split('T')[0]}</td>
                    <td className="tc-table-actions">
                      {inv.payment_url && (
                        <>
                          <button
                            type="button"
                            title="Copy payment link"
                            onClick={() => copyLink(inv.payment_url!, inv.invoice_id)}
                            className="tc-icon-btn"
                          >
                            {copiedId === inv.invoice_id ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <a
                            href={inv.payment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tc-icon-btn"
                            title="Open payment link"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showGenerate && (
        <div className="tc-modal-overlay" onClick={() => setShowGenerate(false)}>
          <div className="tc-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="tc-settings-section-title">Generate Invoice</h3>
            {generateError && <div className="tc-error-banner">{generateError}</div>}
            <form onSubmit={handleGenerate}>
              <div className="tc-settings-grid-2">
                <div className="tc-settings-field">
                  <label className="tc-settings-label">Project ID</label>
                  <input required type="number" value={genProjectId} onChange={e => setGenProjectId(e.target.value)} className="tc-settings-input" />
                </div>
                <div className="tc-settings-field">
                  <label className="tc-settings-label">Client Email</label>
                  <input required type="email" value={genEmail} onChange={e => setGenEmail(e.target.value)} className="tc-settings-input" />
                </div>
                <div className="tc-settings-field">
                  <label className="tc-settings-label">Client Name</label>
                  <input required value={genClientName} onChange={e => setGenClientName(e.target.value)} className="tc-settings-input" />
                </div>
                <div className="tc-settings-field">
                  <label className="tc-settings-label">Amount (USD)</label>
                  <input required type="number" min="1" step="0.01" value={genAmount} onChange={e => setGenAmount(e.target.value)} className="tc-settings-input" />
                </div>
              </div>
              <div className="tc-settings-field">
                <label className="tc-settings-label">Description</label>
                <input required value={genDesc} onChange={e => setGenDesc(e.target.value)} className="tc-settings-input" />
              </div>
              <div className="tc-settings-field">
                <label className="tc-settings-label">Payment Method</label>
                <select value={genMethod} onChange={e => setGenMethod(e.target.value as 'paystack' | 'flutterwave')} className="tc-settings-select">
                  <option value="paystack">Paystack</option>
                  <option value="flutterwave">Flutterwave</option>
                </select>
              </div>
              <div className="tc-modal-actions">
                <button type="button" className="tc-btn-outline" onClick={() => setShowGenerate(false)}>Cancel</button>
                <button type="submit" className="tc-btn-primary" disabled={isGenerating}>
                  {isGenerating ? <Loader2 size={14} className="tc-spin" /> : null} Generate & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
