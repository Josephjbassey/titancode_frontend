import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Copy,
  MessageSquare,
  Mail,
  MoreHorizontal,
  ChevronDown,
  Plus,
  Loader2,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { api } from '../services/api';

interface ClientItem {
  id: number;
  date: string;
  name: string;
  avatar: string | null;
  company: string;
  amount: string;
  status: string;
  email?: string;
  phone?: string;
}

export const ClientsView: React.FC = () => {
  const [clientRows, setClientRows] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newAmount, setNewAmount] = useState('25,000');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getClients()
      .then((records) => {
        if (!mounted) return;
        const mapped = records.map((c) => {
          const val = c.contract_value ?? 0;
          return {
            id: c.id,
            date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : 'Recent',
            name: c.name || c.full_name || 'Client Representative',
            avatar: null,
            company: c.company || (c.email ? c.email.split('@')[1] : 'Enterprise Client'),
            amount: val > 0 ? `$${val.toLocaleString()}` : '$0.00',
            status: c.status || 'Active',
            email: c.email,
            phone: c.phone,
          };
        });
        setClientRows(mapped);
      })
      .catch((err) => {
        console.error('Failed to load clients:', err);
        if (!mounted) return;
        setClientRows([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.submitHireUs({
        name: newClientName.trim(),
        email: `${newClientName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@client.titan`,
        company: newCompany.trim() || undefined,
        project_type: 'Enterprise Retainer',
        description: `Client onboarded with retainer: $${newAmount}`,
      });

      const newEntry: ClientItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
        name: newClientName,
        avatar: null,
        company: newCompany || 'Enterprise Partner',
        amount: `$${newAmount}`,
        status: 'Active',
      };

      setClientRows((prev) => [newEntry, ...prev]);
      setIsAddModalOpen(false);
      setNewClientName('');
      setNewCompany('');
    } catch (err: any) {
      alert(err.message || 'Failed to save client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = clientRows.filter((r) => r.status.toLowerCase() === 'active').length;
  const pendingCount = clientRows.filter((r) => r.status.toLowerCase() === 'pending').length;
  const totalCount = clientRows.length;
  const totalAmount = clientRows.reduce((sum, r) => {
    const num = parseInt(r.amount.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="tc-fade-in tc-dept-view-container tc-gap-4">
      {/* Top Header */}
      <div className="tc-page-header-row">
        <div>
          <h1 className="tc-page-title">
            Clients
          </h1>
          <p className="tc-page-subtitle">
            Enterprise client accounts, project engagements, and gross contract commitments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="tc-gold-btn"
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>

      {/* 4 KPI Metric Cards (Card 1 is Solid Gold in Figma) */}
      <div className="tc-projects-stats-grid">
        {/* Card 1: Active Clients (SOLID GOLD #dfae32 in Figma) */}
        <div className="tc-card-kpi-gold">
          <div className="tc-card-header-row tc-mb-3">
            <span className="tc-font-semibold tc-text-dark">Active Clients</span>
            <div className="tc-kpi-icon-circle--gold">
              <Users size={18} />
            </div>
          </div>
          <div className="tc-kpi-val-hero--dark">
            {activeCount}
          </div>
          <div className="tc-text-xs tc-font-semibold tc-text-dark">
            Verified enterprise contracts
          </div>
        </div>

        {/* Card 2: Pending Clients */}
        <div className="tc-card-kpi-dark">
          <div className="tc-card-header-row tc-mb-3">
            <span className="tc-text-muted-xs">Pending Clients</span>
            <div className="tc-kpi-icon-circle">
              <Users size={18} />
            </div>
          </div>
          <div className="tc-kpi-val-hero">
            {pendingCount}
          </div>
          <div className="tc-text-muted-xs">
            Awaiting contract sign-off
          </div>
        </div>

        {/* Card 3: Total Clients */}
        <div className="tc-card-kpi-dark">
          <div className="tc-card-header-row tc-mb-3">
            <span className="tc-text-muted-xs">Total Clients</span>
            <div className="tc-kpi-icon-circle">
              <Users size={18} />
            </div>
          </div>
          <div className="tc-kpi-val-hero">
            {totalCount}
          </div>
          <div className="tc-text-success tc-text-xs tc-font-semibold">
            All-time registered accounts
          </div>
        </div>

        {/* Card 4: Total Amount */}
        <div className="tc-card-kpi-dark">
          <div className="tc-card-header-row tc-mb-3">
            <span className="tc-text-muted-xs">Total Amount</span>
            <div className="tc-kpi-icon-circle">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="tc-kpi-val-hero">
            ${totalAmount.toLocaleString()}
          </div>
          <div className="tc-text-muted-xs">
            Gross client commitments
          </div>
        </div>
      </div>

      {/* Clients Table Card (Figma 100%) */}
      <div className="tc-clients-table-card">
        <div className="tc-overflow-x-auto">
          <table className="tc-table">
            <thead>
              <tr className="tc-table-header-dark">
                <th>Date</th>
                <th>Clients</th>
                <th>Company Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="tc-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="tc-dept-empty-box">
                    <div className="tc-flex-center-gap tc-justify-center">
                      <Loader2 size={18} className="tc-spin tc-text-gold" />
                      <span>Loading client records...</span>
                    </div>
                  </td>
                </tr>
              ) : clientRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tc-dept-empty-box">
                    No clients on record yet. Click &quot;Add Client&quot; above to onboard one.
                  </td>
                </tr>
              ) : (
                clientRows.map((row) => (
                  <tr key={row.id} className="tc-table-row-hover">
                    {/* Date */}
                    <td className="tc-text-muted">
                      {row.date}
                    </td>

                    {/* Clients */}
                    <td>
                      <div className="tc-flex-center-gap">
                        {row.avatar ? (
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="tc-avatar-sm"
                          />
                        ) : (
                          <div className="tc-avatar-fallback">
                            {row.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        )}
                        <span className="tc-font-semibold tc-text-white">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Company Name */}
                    <td className="tc-text-muted">
                      {row.company}
                    </td>

                    {/* Amount */}
                    <td className="tc-font-semibold tc-text-white">
                      {row.amount}
                    </td>

                    {/* Status */}
                    <td>
                      <span className="tc-badge-status tc-badge-status--approved tc-flex-center-gap">
                        {row.status} <ChevronDown size={12} />
                      </span>
                    </td>

                    {/* Actions (4 icons: copy, chat, mail, more) */}
                    <td className="tc-text-right">
                      <div className="tc-flex-center-gap tc-justify-end">
                        {/* Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopy(row.id, `${row.name} - ${row.company}`)}
                          title="Copy Details"
                          className={`tc-action-icon-btn ${copiedId === row.id ? 'tc-action-icon-btn--success' : ''}`}
                        >
                          <Copy size={16} />
                        </button>

                        {/* WhatsApp / Chat */}
                        <a
                          href={api.getClientConciergeWhatsAppUrl({ clientName: row.name, projectName: row.company })}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat with Client on WhatsApp"
                          className="tc-action-icon-btn"
                        >
                          <MessageSquare size={16} />
                        </a>

                        {/* Mail */}
                        <a
                          href={row.email ? `mailto:${row.email}` : undefined}
                          onClick={(e) => {
                            if (!row.email) {
                              e.preventDefault();
                              alert(`No email configured for ${row.name}`);
                            }
                          }}
                          title={row.email ? `Email ${row.email}` : 'No email available'}
                          className="tc-action-icon-btn"
                        >
                          <Mail size={16} />
                        </a>

                        {/* More */}
                        <button
                          type="button"
                          title="More Options"
                          onClick={() => alert(`Client Profile: ${row.name} (${row.company}) - Status: ${row.status}`)}
                          className="tc-action-icon-btn"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client"
        maxWidth="460px"
      >
        <form onSubmit={handleAddClient} className="tc-flex-col-gap">
          <div className="tc-form-group">
            <label className="tc-form-label">Client Name</label>
            <input
              type="text"
              className="tc-form-input"
              placeholder="e.g. John Peter"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              required
            />
          </div>

          <div className="tc-form-group">
            <label className="tc-form-label">Company Name</label>
            <input
              type="text"
              className="tc-form-input"
              placeholder="e.g. Tesla, Inc. (TSLA)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              required
            />
          </div>

          <div className="tc-form-group">
            <label className="tc-form-label">Amount (USD)</label>
            <input
              type="text"
              className="tc-form-input"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />
          </div>

          <div className="tc-actions-end tc-mt-3">
            <button
              type="button"
              className="tc-modal-cancel-btn"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="tc-gold-btn">
              Save Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
