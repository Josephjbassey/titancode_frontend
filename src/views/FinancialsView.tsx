import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';

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

interface WalletTransaction {
  ref: string;
  project: string;
  type: string;
  date: string;
  amount: string;
  isCredit: boolean;
}

const mapApiWithdrawal = (w: any): Withdrawal => ({
  id: `WTH-${w.id}`,
  member: `Member #${w.user_id}`,
  amount: Number(w.amount),
  bankName: w.bank_info || 'Bank Wire',
  account: '•••• ••••',
  status: w.status === 'approved' ? 'Approved' : w.status === 'rejected' ? 'Rejected' : 'Pending',
  requestedDate: w.created_at ? w.created_at.split('T')[0] : '2026-09-20',
});

export const FinancialsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [activeTab, setActiveTab] = useState<'my_wallet' | 'admin_payouts' | 'payout_invoices' | 'company_treasury'>('my_wallet');
  
  // My Wallet State
  const [myBalance, setMyBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Admin Payouts State
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  // Company Treasury Metrics
  const [treasury, setTreasury] = useState({
    totalRevenue: 98400,
    treasuryBalance: 29500,
    developerPoolPaid: 68900,
  });

  // Payout Invoices
  const [invoices, setInvoices] = useState<PayoutInvoice[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    Promise.all([
      api.getWallet().catch(() => null),
      api.listWithdrawals().catch(() => []),
      api.getCeoOverview().catch(() => null),
      api.getProjects().catch(() => []),
      api.getFinancialSettings().catch(() => null),
    ]).then(([wallet, withdrawalList, overview, fetchedProjects, financialSettings]) => {
      if (!mounted) return;
      if (wallet) {
        setMyBalance(Number(wallet.balance ?? 0));
      }
      if (withdrawalList && withdrawalList.length > 0) {
        setWithdrawals(withdrawalList.map(mapApiWithdrawal));
      }
      if (overview) {
        setTreasury({
          totalRevenue: overview.totalRevenue,
          treasuryBalance: overview.treasuryBalance,
          developerPoolPaid: overview.developerPoolPaid,
        });
      }
      if (fetchedProjects && fetchedProjects.length > 0) {
        const pSplit = financialSettings?.platform_split_percent ?? 30;
        const mSplit = financialSettings?.member_split_percent ?? 70;
        const dynamicInvoices: PayoutInvoice[] = fetchedProjects.map((p: any) => {
          const budget = p.budget ? Number(p.budget) : 15000;
          const devShare = Math.round((budget * mSplit) / 100);
          const treasuryShare = budget - devShare;
          const team = p.team && p.team.length > 0 ? p.team : ['Lead Engineer', 'UI/UX Designer'];
          const perMemberShare = Math.round(mSplit / team.length);
          const perMemberAmount = Math.round(devShare / team.length);

          return {
            id: `INV-${String(p.id).padStart(3, '0')}`,
            project: p.name || p.project_name || 'Sprint Deliverable',
            totalPayout: budget,
            status: p.progress === 100 ? 'Settled' : 'Pending Approval',
            generatedDate: p.created_at ? p.created_at.split('T')[0] : '2026-09-20',
            split: [
              ...team.map((m: string) => ({
                role: 'Contributor',
                member: m,
                share: perMemberShare,
                amount: perMemberAmount,
              })),
              { role: 'TitanCode Platform Treasury', member: 'Reserve Fund', share: pSplit, amount: treasuryShare },
            ],
          };
        });
        setInvoices(dynamicInvoices);

        // Build dynamic transactions
        const txns: WalletTransaction[] = [];
        (withdrawalList || []).slice(0, 5).forEach((w: any) => {
          txns.push({
            ref: `TXN-WTH-${w.id}`,
            project: `Bank Wire Withdrawal (${w.bank_info || 'Bank Wire'})`,
            type: 'Settlement Debit',
            date: w.created_at ? w.created_at.split('T')[0] : '2026-09-20',
            amount: `-$${Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            isCredit: false,
          });
        });
        fetchedProjects.slice(0, 5).forEach((p: any) => {
          const budget = p.budget ? Number(p.budget) : 12000;
          const share = Math.round((budget * mSplit) / 100);
          txns.push({
            ref: `TXN-PRJ-${p.id}`,
            project: p.name || p.project_name || 'Active Project',
            type: 'Milestone Credit',
            date: p.created_at ? p.created_at.split('T')[0] : '2026-09-15',
            amount: `+$${share.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            isCredit: true,
          });
        });
        setTransactions(txns.sort((a, b) => b.date.localeCompare(a.date)));
      } else {
        // Fallback default transactions
        setTransactions([
          { ref: 'TXN-991', project: 'OmniTrade Crypto Arbitrage Bot', type: 'Milestone Credit', date: '2026-09-18', amount: '+$7,400.00', isCredit: true },
          { ref: 'TXN-942', project: 'Bank Wire Withdrawal (GTBank)', type: 'Settlement Debit', date: '2026-09-12', amount: '-$5,000.00', isCredit: false },
          { ref: 'TXN-880', project: 'Aurelia FinTech Milestone 2', type: 'Milestone Credit', date: '2026-09-08', amount: '+$5,400.00', isCredit: true },
        ]);
        setInvoices([
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
      }
    }).finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(withdrawAmount);
    if (!val || val <= 0 || val > myBalance) return;

    try {
      await api.requestWithdrawal(val, 'Personal Bank Account');
      setMyBalance((prev) => prev - val);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit withdrawal request');
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    const numericId = parseInt(id.replace('WTH-', ''), 10);
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'Approved' } : w))
    );
    if (!isNaN(numericId)) {
      try {
        await api.processWithdrawal(numericId, 'approve');
      } catch {
        // Fallback
      }
    }
  };

  const handleApproveInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Settled' } : inv))
    );
  };

  return (
    <div className="tc-financials-container tc-fade-in">
      {/* Top Header */}
      <div className="tc-dashboard-header">
        <div>
          <h1 className="tc-dashboard-title">
            Financials & Treasury Hub
          </h1>
          <p className="tc-dashboard-subtitle">
            Manage escrow milestone settlements, member wallets, payout splits, and corporate cashflow.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tc-tab-pill-group">
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
              className={`tc-tab-pill-btn ${activeTab === tab.id ? 'tc-tab-pill-btn--active' : ''}`}
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
          <div className="tc-wallet-card">
            <div>
              <div className="tc-wallet-label">
                Available Settlement Balance
              </div>
              <div className="tc-wallet-amount">
                ${myBalance.toLocaleString()} <span className="tc-wallet-unit">USD</span>
              </div>
              <div className="tc-wallet-status">
                <CheckCircle2 size={14} />
                <span>KYC Bank Verified: GTBank •••• 6789</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWithdrawModal(true)}
              className="tc-action-btn-gold"
            >
              <ArrowUpRight size={18} strokeWidth={2.5} />
              <span>Withdraw Funds</span>
            </button>
          </div>

          {/* Transaction Ledger */}
          <div className="tc-tx-table-card">
            <div className="tc-tx-table-header">
              Recent Payout Settlements & Disbursals
            </div>
            <table className="tc-tx-table">
              <thead>
                <tr>
                  <th className="tc-tx-table-th">Reference</th>
                  <th className="tc-tx-table-th">Project Milestone</th>
                  <th className="tc-tx-table-th">Type</th>
                  <th className="tc-tx-table-th">Date</th>
                  <th className="tc-tx-table-th tc-tx-table-th--right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((row, i) => (
                  <tr key={i} className="tc-tx-table-tr">
                    <td className="tc-tx-table-td tc-tx-table-td--gold">{row.ref}</td>
                    <td className="tc-tx-table-td tc-tx-table-td--white">{row.project}</td>
                    <td className="tc-tx-table-td tc-tx-table-td--muted">{row.type}</td>
                    <td className="tc-tx-table-td tc-tx-table-td--muted">{row.date}</td>
                    <td className={`tc-tx-table-td tc-tx-table-td--right tc-tx-table-td--amount ${row.isCredit ? 'tc-text-success' : 'tc-text-white'}`}>
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
        <div className="tc-tx-table-card">
          <div className="tc-tx-table-header">
            Pending Member Withdrawal Requests
          </div>
          <table className="tc-tx-table">
            <thead>
              <tr>
                <th className="tc-tx-table-th">Request ID</th>
                <th className="tc-tx-table-th">Member</th>
                <th className="tc-tx-table-th">Settlement Bank</th>
                <th className="tc-tx-table-th">Account</th>
                <th className="tc-tx-table-th">Amount</th>
                <th className="tc-tx-table-th">Status</th>
                <th className="tc-tx-table-th tc-tx-table-th--right">Authorization</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="tc-tx-table-td tc-text-center tc-text-muted">
                    <div className="tc-flex-center-all">
                      <Loader2 size={16} className="tc-spin" color="#dfae32" />
                      <span>Loading withdrawal authorizations...</span>
                    </div>
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="tc-tx-table-td tc-text-center tc-text-muted tc-text-sm">
                    No withdrawal requests submitted yet.
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="tc-tx-table-tr">
                    <td className="tc-tx-table-td tc-tx-table-td--gold">{w.id}</td>
                    <td className="tc-tx-table-td tc-tx-table-td--white">{w.member}</td>
                    <td className="tc-tx-table-td tc-tx-table-td--muted">{w.bankName}</td>
                    <td className="tc-tx-table-td tc-tx-table-td--muted">{w.account}</td>
                    <td className="tc-tx-table-td tc-font-bold tc-text-gold">${w.amount.toLocaleString()}</td>
                    <td className="tc-tx-table-td">
                      <span className={`tc-tier-badge ${w.status === 'Approved' ? 'tc-tier-badge--active' : 'tc-tier-badge--inactive'}`}>
                        ● {w.status}
                      </span>
                    </td>
                    <td className="tc-tx-table-td tc-tx-table-td--right">
                      {w.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => handleApproveWithdrawal(w.id)}
                          className="tc-btn-subtle-edit"
                        >
                          Approve Payout
                        </button>
                      ) : (
                        <span className="tc-text-muted tc-text-xs">Wire Transferred</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. PAYOUT INVOICES SPLIT TAB */}
      {activeTab === 'payout_invoices' && (
        <div className="tc-pricing-tiers-list">
          {invoices.map((inv) => (
            <div key={inv.id} className="tc-settings-card">
              <div className="tc-pricing-tiers-header">
                <div>
                  <span className="tc-text-gold tc-text-xs tc-font-bold">{inv.id}</span>
                  <h3 className="tc-text-lg tc-font-extrabold tc-text-white tc-mt-1">{inv.project}</h3>
                  <div className="tc-text-muted tc-text-xs tc-mt-1">Generated: {inv.generatedDate}</div>
                </div>

                <div className="tc-text-right">
                  <div className="tc-text-xl tc-font-extrabold tc-text-gold">
                    ${inv.totalPayout.toLocaleString()} USD
                  </div>
                  <span className={`tc-tier-badge ${inv.status === 'Settled' ? 'tc-tier-badge--active' : 'tc-tier-badge--inactive'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>

              {/* Split Breakdown */}
              <div className="tc-user-detail-box tc-mb-3">
                <div className="tc-text-muted tc-text-xs tc-font-semibold tc-mb-2">
                  Escrow Contract Split Breakdown:
                </div>
                <div className="tc-notification-triggers-list">
                  {inv.split.map((s, idx) => (
                    <div key={idx} className="tc-flex-between">
                      <span className="tc-text-muted tc-text-sm">
                        <span className="tc-font-bold tc-text-white">{s.member}</span> ({s.role}) — {s.share}%
                      </span>
                      <span className="tc-font-bold tc-text-gold">${s.amount.toLocaleString()} USD</span>
                    </div>
                  ))}
                </div>
              </div>

              {inv.status === 'Pending Approval' && (
                <div className="tc-flex-end-gap">
                  <button
                    type="button"
                    onClick={() => handleApproveInvoice(inv.id)}
                    className="tc-action-btn-gold"
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
        <div className="tc-treasury-grid">
          <div className="tc-treasury-card tc-treasury-card--gold">
            <div className="tc-treasury-card-label">Corporate Vault Balance</div>
            <div className="tc-treasury-card-amount tc-treasury-card-amount--gold">
              ${treasury.treasuryBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="tc-treasury-card-note tc-treasury-card-note--emerald">30% Platform Treasury Split</div>
          </div>

          <div className="tc-treasury-card">
            <div className="tc-treasury-card-label">Total Platform Revenue</div>
            <div className="tc-treasury-card-amount tc-treasury-card-amount--white">
              ${treasury.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="tc-treasury-card-note tc-treasury-card-note--muted">Gross milestone billings</div>
          </div>

          <div className="tc-treasury-card">
            <div className="tc-treasury-card-label">Total Developer Pool Paid</div>
            <div className="tc-treasury-card-amount tc-treasury-card-amount--white">
              ${treasury.developerPoolPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="tc-treasury-card-note tc-treasury-card-note--muted">70% distributed to engineering staff</div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="tc-modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="tc-modal-card tc-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-header">
              <h3 className="tc-modal-title">
                Withdraw to Bank Account
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="tc-text-center tc-py-4">
                <CheckCircle2 size={48} color="#10B981" className="tc-mx-auto tc-mb-4" />
                <h4 className="tc-text-lg tc-font-bold tc-text-white tc-mb-2">
                  Withdrawal Request Submitted
                </h4>
                <p className="tc-text-muted tc-text-sm">
                  Wire transfer is being processed and will hit your bank within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit}>
                <div className="tc-form-group">
                  <label className="tc-form-label">
                    Withdrawal Amount (USD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Enter amount..."
                    max={myBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="tc-form-input"
                  />
                  <div className="tc-text-gold tc-text-xs tc-mt-1">
                    Available: ${myBalance.toLocaleString()} USD
                  </div>
                </div>

                <div className="tc-user-detail-box tc-mb-4">
                  <div className="tc-text-muted tc-text-2xs">Destination Account:</div>
                  <div className="tc-font-bold tc-text-white tc-text-sm tc-mt-1">
                    Guaranty Trust Bank (0123456789)
                  </div>
                </div>

                <div className="tc-flex-end-gap">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="tc-btn-subtle-edit"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tc-action-btn-gold"
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
