import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Copy,
  MessageSquare,
  Mail,
  MoreHorizontal,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { Modal } from '../components/Modal';

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
  const [clientRows, setClientRows] = useState<ClientItem[]>([
    { id: 1, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
    { id: 2, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
    { id: 3, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
    { id: 4, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
    { id: 5, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
    { id: 6, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
    { id: 7, date: '10 May, 26', name: 'John Peter', avatar: '/assets/dashprofile.jpg', company: 'Tesla, Inc. (TSLA)', amount: '₦2,000,000', status: 'Active' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newAmount, setNewAmount] = useState('2,000,000');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const newEntry: ClientItem = {
      id: Date.now(),
      date: '10 May, 26',
      name: newClientName,
      avatar: '/assets/dashprofile.jpg',
      company: newCompany || 'Tesla, Inc. (TSLA)',
      amount: `₦${newAmount}`,
      status: 'Active',
    };

    setClientRows([newEntry, ...clientRows]);
    setIsAddModalOpen(false);
    setNewClientName('');
    setNewCompany('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }} className="tc-fade-in">
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
            24
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>
            +3 New since past 7 days
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
            13
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            since last month
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
            30
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>
            +7 New since last month
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
            ₦2,700,000
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            since last month
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
              {clientRows.map((row) => (
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
              ))}
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
