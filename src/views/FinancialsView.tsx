import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { ScreenId } from '../App';

interface Withdrawal {
  id: string;
  member: string;
  amount: number;
  bankName: string;
  account: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedDate: string;
}

interface PayoutInvoice {
  id: string;
  project: string;
  totalPayout: number;
  split: { role: string; member: string; share: number; amount: number }[];
  status: 'Pending Approval' | 'Settled';
  generatedDate: string;
}

export const FinancialsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [activeTab, setActiveTab] = useState<'my_wallet' | 'admin_payouts' | 'payout_invoices' | 'company_treasury'>('my_wallet');
  
  // My Wallet State
  const [myBalance, setMyBalance] = useState(14850);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Admin Payouts State
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: 'WTH-801',
      member: 'Joseph John',
      amount: 4500,
      bankName: 'Guaranty Trust Bank',
      account: '0123456789',
      status: 'Pending',
      requestedDate: '2026-09-20',
    },
    {
      id: 'WTH-802',
      member: 'Benedicta Atagamen',
      amount: 3200,
      bankName: 'Standard Chartered Ghana',
      account: '9876543210',
      status: 'Pending',
      requestedDate: '2026-09-19',
    },
    {
      id: 'WTH-803',
      member: 'Olukayode Tioluwanimi',
      amount: 5000,
      bankName: 'Access Bank PLC',
      account: '4455667788',
      status: 'Approved',
      requestedDate: '2026-09-15',
    },
  ]);

  // Payout Invoices
  const [invoices, setInvoices] = useState<PayoutInvoice[]>([
    {
      id: 'INV-901',
      project: 'OmniTrade Crypto Arbitrage Bot',
      totalPayout: 18500,
      status: 'Pending Approval',
      generatedDate: '2026-09-18',
      split: [
        { role: 'Algorithm Lead', member: 'Munis Samuel', share: 50, amount: 9250 },
        { role: 'Systems Engineer', member: 'Joseph John', share: 40, amount: 7400 },
        { role: 'TitanCode Platform Treasury', member: 'Reserve Fund', share: 10, amount: 1850 },
      ],
    },
    {
      id: 'INV-902',
      project: 'Aurelia FinTech Milestone 2',
      totalPayout: 12000,
      status: 'Settled',
      generatedDate: '2026-09-08',
      split: [
        { role: 'Lead Developer', member: 'Joseph John', share: 45, amount: 5400 },
        { role: 'UI/UX Designer', member: 'Benedicta Atagamen', share: 45, amount: 5400 },
        { role: 'Company Reserve', member: 'Reserve Fund', share: 10, amount: 1200 },
      ],
    },
  ]);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(withdrawAmount);
    if (!val || val <= 0 || val > myBalance) return;

    setMyBalance((prev) => prev - val);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSuccess(false);
      setWithdrawAmount('');
    }, 1500);
  };

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'Approved' } : w))
    );
  };

  const handleApproveInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Settled' } : inv))
    );
  };

  return (
    <div style={{ color: '#FFFFFF' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Financials & Treasury Hub
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Manage escrow milestone settlements, member wallets, payout splits, and corporate cashflow.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#11151F',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {[
            { id: 'my_wallet', label: 'My Wallet' },
            { id: 'admin_payouts', label: 'Withdrawal Approvals' },
            { id: 'payout_invoices', label: 'Project Invoices' },
            { id: 'company_treasury', label: 'Company Treasury' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#E5A83B' : 'transparent',
                color: activeTab === tab.id ? '#0A0D14' : '#9CA3AF',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. MY WALLET TAB */}
      {activeTab === 'my_wallet' && (
        <div>
          {/* Balance Hero Card */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '16px',
              padding: '36px',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
                Available Settlement Balance
              </div>
              <div style={{ fontSize: '42px', fontWeight: 800, color: '#E5A83B', letterSpacing: '-0.02em' }}>
                ${myBalance.toLocaleString()} <span style={{ fontSize: '20px', color: '#FFFFFF' }}>USD</span>
              </div>
              <div style={{ color: '#10B981', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} />
                <span>KYC Bank Verified: GTBank •••• 6789</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWithdrawModal(true)}
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 32px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(229, 168, 59, 0.35)',
              }}
            >
              <ArrowUpRight size={18} strokeWidth={2.5} />
              <span>Withdraw Funds</span>
            </button>
          </div>

          {/* Transaction Ledger */}
          <div
            style={{
              backgroundColor: '#11151F',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontWeight: 700, fontSize: '15px' }}>
              Recent Payout Settlements & Disbursals
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0E121B', color: '#9CA3AF' }}>
                  <th style={{ padding: '14px 20px' }}>Reference</th>
                  <th style={{ padding: '14px 20px' }}>Project Milestone</th>
                  <th style={{ padding: '14px 20px' }}>Type</th>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: 'TXN-991', project: 'OmniTrade Crypto Arbitrage Bot', type: 'Milestone Credit', date: '2026-09-18', amount: '+$7,400.00', isCredit: true },
                  { ref: 'TXN-942', project: 'Bank Wire Withdrawal (GTBank)', type: 'Settlement Debit', date: '2026-09-12', amount: '-$5,000.00', isCredit: false },
                  { ref: 'TXN-880', project: 'Aurelia FinTech Milestone 2', type: 'Milestone Credit', date: '2026-09-08', amount: '+$5,400.00', isCredit: true },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 20px', color: '#E5A83B', fontWeight: 600 }}>{row.ref}</td>
                    <td style={{ padding: '14px 20px', color: '#FFFFFF', fontWeight: 600 }}>{row.project}</td>
                    <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{row.type}</td>
                    <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{row.date}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: row.isCredit ? '#10B981' : '#FFFFFF' }}>
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ADMIN WITHDRAWAL APPROVALS TAB */}
      {activeTab === 'admin_payouts' && (
        <div
          style={{
            backgroundColor: '#11151F',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontWeight: 700, fontSize: '15px' }}>
            Pending Member Withdrawal Requests
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0E121B', color: '#9CA3AF' }}>
                <th style={{ padding: '14px 20px' }}>Request ID</th>
                <th style={{ padding: '14px 20px' }}>Member</th>
                <th style={{ padding: '14px 20px' }}>Settlement Bank</th>
                <th style={{ padding: '14px 20px' }}>Account</th>
                <th style={{ padding: '14px 20px' }}>Amount</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Authorization</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 20px', color: '#E5A83B', fontWeight: 600 }}>{w.id}</td>
                  <td style={{ padding: '14px 20px', color: '#FFFFFF', fontWeight: 700 }}>{w.member}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{w.bankName}</td>
                  <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{w.account}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#E5A83B' }}>${w.amount.toLocaleString()}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: w.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(229, 168, 59, 0.15)',
                        color: w.status === 'Approved' ? '#10B981' : '#E5A83B',
                      }}
                    >
                      ● {w.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {w.status === 'Pending' ? (
                      <button
                        type="button"
                        onClick={() => handleApproveWithdrawal(w.id)}
                        style={{
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Approve Payout
                      </button>
                    ) : (
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Wire Transferred</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. PAYOUT INVOICES SPLIT TAB */}
      {activeTab === 'payout_invoices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                backgroundColor: '#11151F',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ color: '#E5A83B', fontSize: '12px', fontWeight: 700 }}>{inv.id}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0 0' }}>{inv.project}</h3>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '2px' }}>Generated: {inv.generatedDate}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#E5A83B' }}>
                    ${inv.totalPayout.toLocaleString()} USD
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: inv.status === 'Settled' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(229, 168, 59, 0.15)',
                      color: inv.status === 'Settled' ? '#10B981' : '#E5A83B',
                    }}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>

              {/* Split Breakdown */}
              <div style={{ backgroundColor: '#0B0E14', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px', fontWeight: 600 }}>
                  Escrow Contract Split Breakdown:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {inv.split.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#D1D5DB' }}>
                        <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{s.member}</span> ({s.role}) — {s.share}%
                      </span>
                      <span style={{ fontWeight: 700, color: '#E5A83B' }}>${s.amount.toLocaleString()} USD</span>
                    </div>
                  ))}
                </div>
              </div>

              {inv.status === 'Pending Approval' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleApproveInvoice(inv.id)}
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Authorize & Disburse Invoices
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. COMPANY TREASURY TAB */}
      {activeTab === 'company_treasury' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            <div style={{ backgroundColor: '#11151F', borderRadius: '14px', padding: '24px', border: '1px solid rgba(229, 168, 59, 0.3)' }}>
              <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Corporate Vault Balance</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#E5A83B', marginTop: '6px' }}>$194,250.00</div>
              <div style={{ color: '#10B981', fontSize: '12px', marginTop: '4px' }}>+$18,400 this month</div>
            </div>

            <div style={{ backgroundColor: '#11151F', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Digital Product Revenue In</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>$84,600.00</div>
              <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>Across 4 SaaS products</div>
            </div>

            <div style={{ backgroundColor: '#11151F', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Total Payouts Debited Out</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>$68,900.00</div>
              <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>To engineering staff</div>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            style={{
              backgroundColor: '#11151F',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Withdraw to Bank Account
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {withdrawSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px' }}>
                  Withdrawal Request Submitted
                </h4>
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                  Wire transfer is being processed and will hit your bank within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Withdrawal Amount (USD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Enter amount..."
                    max={myBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0B0E14',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#E5A83B', marginTop: '4px' }}>
                    Available: ${myBalance.toLocaleString()} USD
                  </div>
                </div>

                <div style={{ backgroundColor: '#0B0E14', padding: '14px', borderRadius: '8px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Destination Account:</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    Guaranty Trust Bank (0123456789)
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#9CA3AF',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#E5A83B',
                      color: '#0A0D14',
                      fontWeight: 700,
                      padding: '10px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
