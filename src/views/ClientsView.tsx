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
  avatar: string;
  company: string;
  amount: string;
  status: string;
}

export const ClientsView: React.FC = () => {
  const [clientRows, setClientRows] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newAmount, setNewAmount] = useState('2,000,000');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getClients()
      .then((records) => {
        if (!mounted) return;
        const mapped = records.map((c) => ({
          id: c.id,
          date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : 'Recent',
          name: c.full_name || 'Client Representative',
          avatar: '/assets/dashprofile.jpg',
          company: c.email ? c.email.split('@')[1] : 'Enterprise Client',
          amount: '₦2,000,000',
          status: c.status || 'Active',
        }));
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
        description: `Client onboarded with retainer: ₦${newAmount}`,
      });

      const newEntry: ClientItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
        name: newClientName,
        avatar: '/assets/dashprofile.jpg',
        company: newCompany || 'Enterprise Partner',
        amount: `₦${newAmount}`,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', width: '100%' }} className="tc-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#FFFFFF',
          letterSpacing: '-0.4px',
          margin: 0,
        }}>
          Clients
        </h1>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            height: '40px',
            borderRadius: '9999px',
            backgroundColor: '#dfae32',
            color: '#000000',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 18px',
          }}
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>

      {/* 4 KPI Metric Cards (Card 1 is Solid Gold in Figma) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {/* Card 1: Active Clients (SOLID GOLD #dfae32 in Figma) */}
        <div style={{
          backgroundColor: '#dfae32',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#000000',
          boxShadow: '0 8px 24px rgba(223, 174, 50, 0.25)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>Active Clients</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#000000', marginBottom: '8px', lineHeight: 1 }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>
            Verified enterprise contracts
          </div>
        </div>

        {/* Card 2: Pending Clients */}
        <div style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Pending Clients</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Awaiting contract sign-off
          </div>
        </div>

        {/* Card 3: Total Clients */}
        <div style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Total Clients</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>
            All-time registered accounts
          </div>
        </div>

        {/* Card 4: Total Amount */}
        <div style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Total Amount</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
            }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            ₦{totalAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Gross client commitments
          </div>
        </div>
      </div>

      {/* Clients Table Card (Figma 100%) */}
      <div style={{
        backgroundColor: '#232324',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9CA3AF' }}>
                <th style={{ padding: '12px 14px 16px', fontWeight: '500' }}>Date</th>
                <th style={{ padding: '12px 14px 16px', fontWeight: '500' }}>Clients</th>
                <th style={{ padding: '12px 14px 16px', fontWeight: '500' }}>Company Name</th>
                <th style={{ padding: '12px 14px 16px', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '12px 14px 16px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px 14px 16px', fontWeight: '500', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={18} className="tc-spin" color="#dfae32" />
                      <span>Loading client records...</span>
                    </div>
                  </td>
                </tr>
              ) : clientRows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                    No clients on record yet. Click &quot;Add Client&quot; above to onboard one.
                  </td>
                </tr>
              ) : (
                clientRows.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  {/* Date */}
                  <td style={{ padding: '16px 14px', color: '#9CA3AF' }}>
                    {row.date}
                  </td>

                  {/* Clients */}
                  <td style={{ padding: '16px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={row.avatar}
                        alt={row.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Company Name */}
                  <td style={{ padding: '16px 14px', color: '#D1D5DB' }}>
                    {row.company}
                  </td>

                  {/* Amount */}
                  <td style={{ padding: '16px 14px', color: '#FFFFFF', fontWeight: '600' }}>
                    {row.amount}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '16px 14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      {row.status} <ChevronDown size={12} />
                    </span>
                  </td>

                  {/* Actions (4 icons: copy, chat, mail, more) */}
                  <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopy(row.id, `${row.name} - ${row.company}`)}
                        title="Copy Details"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedId === row.id ? '#10B981' : '#9CA3AF',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Copy size={16} />
                      </button>

                      {/* Chat */}
                      <button
                        type="button"
                        title="Open Chat"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <MessageSquare size={16} />
                      </button>

                      {/* Mail */}
                      <button
                        type="button"
                        title="Send Email"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Mail size={16} />
                      </button>

                      {/* More */}
                      <button
                        type="button"
                        title="More Options"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
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
        <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="tc-label">Client Name</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. John Peter"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="tc-label">Company Name</label>
            <input
              type="text"
              className="tc-input"
              placeholder="e.g. Tesla, Inc. (TSLA)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="tc-label">Amount (NGN)</label>
            <input
              type="text"
              className="tc-input"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              className="tc-btn tc-btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="tc-btn tc-btn-primary">
              Save Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
