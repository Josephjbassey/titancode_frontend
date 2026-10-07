import React, { useState, useEffect } from 'react';
import {
  Crown,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  Download,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import type { DepartmentInfo } from '../types';
import type { ScreenId } from '../App';

interface CeoDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
}

interface ApprovalItem {
  id: string;
  title: string;
  department: string;
  requestedBy: string;
  amount: string;
  status: string;
}

export const CeoDashboardView: React.FC<CeoDashboardViewProps> = ({ onNavigate }) => {
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    treasuryBalance: 0,
    developerPoolPaid: 0,
    activeProjects: 0,
    totalStaff: 0,
    splitMemberPercent: 70,
    splitTreasuryPercent: 30,
  });

  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    async function loadData() {
      try {
        const [data, depts, withdrawals] = await Promise.all([
          api.getCeoOverview().catch(() => ({
            totalRevenue: 0,
            treasuryBalance: 0,
            developerPoolPaid: 0,
            activeProjects: 0,
            totalStaff: 0,
            splitMemberPercent: 70,
            splitTreasuryPercent: 30,
          })),
          api.getDepartments().catch(() => []),
          api.listWithdrawals({ status: 'pending' }).catch(() => []),
        ]);

        if (!mounted) return;
        setOverview(data);
        setDepartments(depts);

        const mappedApprovals: ApprovalItem[] = (withdrawals || []).map((w: any) => ({
          id: `WTH-${w.id}`,
          title: `Withdrawal Request - ${w.user_name || 'Member Disbursement'}`,
          department: w.bank_name ? `Bank: ${w.bank_name}` : 'Settlement Pool',
          requestedBy: w.user_name || `Member #${w.user_id}`,
          amount: `$${Number(w.amount).toLocaleString()}`,
          status: (w.status || 'pending').toLowerCase(),
        }));
        setApprovals(mappedApprovals);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleApprove = async (id: string) => {
    const numericId = parseInt(id.replace('WTH-', ''), 10);
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    if (!isNaN(numericId)) {
      try {
        await api.processWithdrawal(numericId, 'approve');
      } catch (err: any) {
        alert(err.message || 'Failed to approve withdrawal on server');
      }
    }
  };

  const handleReject = async (id: string) => {
    const numericId = parseInt(id.replace('WTH-', ''), 10);
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    if (!isNaN(numericId)) {
      try {
        await api.processWithdrawal(numericId, 'reject');
      } catch (err: any) {
        alert(err.message || 'Failed to decline withdrawal on server');
      }
    }
  };

  return (
    <div className="tc-view-wrapper tc-fade-in">
      {/* 1. EXECUTIVE HEADER */}
      <div className="tc-page-header">
        <div>
          <div className="tc-live-indicator">
            <span className="tc-badge-executive">
              <Crown size={13} />
              Executive Suite
            </span>
            <span className="tc-badge-healthy">
              System Status: Healthy
            </span>
          </div>
          <h1 className="tc-page-title">
            Chief Executive & Treasury Overview
          </h1>
          <p className="tc-page-subtitle">
            High-level metrics, 70/30 concierge model distributions, corporate cashflow, and department ranking.
          </p>
        </div>

        <div className="tc-header-actions">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('financials')}
            className="tc-btn-secondary"
          >
            <Wallet size={15} />
            Treasury Ledger
          </button>
          <button
            type="button"
            onClick={() => alert('Exporting Executive Board Report PDF...')}
            className="tc-gold-btn"
          >
            <Download size={15} />
            Export Board Deck
          </button>
        </div>
      </div>

      {/* 2. FOUR TOP EXECUTIVE METRICS */}
      <div className="tc-metrics-grid-4">
        {/* Metric 1: Total Gross Revenue */}
        <div className="tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">Total Billed Revenue</span>
            <span className="tc-metric-badge tc-metric-badge--green">
              <ArrowUpRight size={12} /> +28.4%
            </span>
          </div>
          <div className="tc-metric-value">
            ${(overview.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="tc-metric-subtext">
            Across {overview.activeProjects} enterprise client contracts
          </div>
        </div>

        {/* Metric 2: 70% Developer Escrow Pool */}
        <div className="tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">Developer Escrow Pool (70%)</span>
            <span className="tc-metric-badge tc-metric-badge--gold">
              Active Escrow
            </span>
          </div>
          <div className="tc-metric-value">
            ${(overview.developerPoolPaid / 1000000).toFixed(1)}M
          </div>
          <div className="tc-metric-subtext">
            Distributed to {overview.totalStaff} verified engineers
          </div>
        </div>

        {/* Metric 3: 30% Platform Treasury Reserves */}
        <div className="tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">Company Treasury (30%)</span>
            <span className="tc-metric-badge tc-metric-badge--blue">
              Liquid Cash
            </span>
          </div>
          <div className="tc-metric-value">
            ${(overview.treasuryBalance / 1000000).toFixed(1)}M
          </div>
          <div className="tc-metric-subtext">
            Operating budget & corporate reserves
          </div>
        </div>

        {/* Metric 4: Net Operating Runway */}
        <div className="tc-metric-card">
          <div className="tc-metric-header">
            <span className="tc-metric-label">Corporate Runway</span>
            <span className="tc-metric-badge tc-metric-badge--purple">
              Calculated
            </span>
          </div>
          <div className="tc-metric-value">
            {overview.treasuryBalance > 0 ? '36.8 Mos' : 'Self-Funded'}
          </div>
          <div className="tc-metric-subtext">
            Zero external debt obligations
          </div>
        </div>
      </div>

      {/* 3. 70/30 CONCIERGE MODEL VISUAL BREAKDOWN */}
      <div className="tc-split-card">
        <div className="tc-split-header">
          <div>
            <h3 className="tc-split-title">
              70/30 Concierge Capital Split Model
            </h3>
            <p className="tc-split-desc">
              TitanCode guarantees that 70% of every invoiced dollar is reserved exclusively for the delivery engineers, while 30% funds platform operations, corporate profit, and global infrastructure.
            </p>
          </div>
          <div className="tc-split-legend">
            <span className="tc-split-legend-item tc-split-legend-item--gold">
              ■ Developer Pool: {overview.splitMemberPercent}%
            </span>
            <span className="tc-split-legend-item tc-split-legend-item--blue">
              ■ Company Treasury: {overview.splitTreasuryPercent}%
            </span>
          </div>
        </div>

        {/* Split Bar */}
        <div className="tc-split-bar">
          <div className="tc-split-segment-dev">
            <span>Engineering Payout Pool (70%)</span>
          </div>
          <div className="tc-split-segment-treasury">
            <span>Treasury (30%)</span>
          </div>
        </div>
      </div>

      {/* 4. DEPARTMENT LEADERBOARD & PERFORMANCE TABLE */}
      <div className="tc-workspace-card tc-card-section">
        <div className="tc-card-header-row">
          <div>
            <h2 className="tc-card-section-title">
              Startup Tech Firm Department Performance & ROI Ranking
            </h2>
            <p className="tc-card-section-desc">
              Revenue contribution, headcount, and budget efficiency across all 17 core business departments.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('departments')}
            className="tc-card-link-btn tc-split-legend-item--gold"
          >
            Manage Departments →
          </button>
        </div>

        <div className="tc-table-container">
          <table className="tc-data-table">
            <thead>
              <tr className="tc-table-head-row">
                <th className="tc-table-th">Department</th>
                <th className="tc-table-th">Category</th>
                <th className="tc-table-th">Department Head</th>
                <th className="tc-table-th">Headcount</th>
                <th className="tc-table-th">Active Projects</th>
                <th className="tc-table-th">Monthly Budget</th>
                <th className="tc-table-th">Profit Pool Share</th>
                <th className="tc-table-th tc-table-th--right">Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, idx) => (
                <tr key={dept.id} className="tc-table-row">
                  <td className="tc-table-td">
                    <div className="tc-table-user-cell">
                      <span className="tc-dept-rank">
                        #{idx + 1}
                      </span>
                      <span className="tc-table-td--title">
                        {dept.name}
                      </span>
                    </div>
                  </td>
                  <td className="tc-table-td">
                    <span className="tc-priority-badge tc-priority-badge--low">
                      {dept.category}
                    </span>
                  </td>
                  <td className="tc-table-td">
                    <div className="tc-table-user-cell">
                      {dept.manager_avatar ? (
                        <img
                          src={dept.manager_avatar}
                          alt={dept.manager_name}
                          className="tc-table-avatar"
                        />
                      ) : (
                        <div className="tc-table-avatar-placeholder">
                          {dept.manager_name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )}
                      <span>
                        {dept.manager_name}
                      </span>
                    </div>
                  </td>
                  <td className="tc-table-td">
                    <span className="tc-table-td--title">
                      {dept.member_count} staff
                    </span>
                  </td>
                  <td className="tc-table-td">
                    <span>
                      {dept.active_projects_count} active
                    </span>
                  </td>
                  <td className="tc-table-td">
                    <span className="tc-budget-val">
                      ${(dept.monthly_budget / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="tc-table-td">
                    <span className="tc-status-badge tc-status-badge--completed">
                      {dept.profit_pool_share_percent}%
                    </span>
                  </td>
                  <td className="tc-table-td tc-table-td--right">
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('manager_dashboard')}
                      className="tc-btn-view-dept"
                    >
                      View Dept →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. LOWER 2-COLUMN GRID: CAPITAL APPROVALS & COMPLIANCE HEALTH */}
      <div className="tc-2col-grid">
        {/* Left Card: Executive Capital Approvals Queue */}
        <div className="tc-panel-card">
          <div className="tc-panel-header">
            <div>
              <h3 className="tc-panel-title">
                Executive Capital Sign-Off Queue
              </h3>
              <p className="tc-panel-desc">
                Pending department head budget expansions & procurement requests.
              </p>
            </div>
            <Wallet size={18} className="tc-icon-gold" />
          </div>

          <div className="tc-list-stack">
            {isLoading ? (
              <div className="tc-table-empty">
                <div className="tc-table-loading">
                  <Loader2 size={16} className="tc-spin" color="#dfae32" />
                  <span>Loading capital sign-off requests...</span>
                </div>
              </div>
            ) : approvals.length === 0 ? (
              <div className="tc-table-empty">
                No pending capital requests or withdrawals awaiting executive sign-off.
              </div>
            ) : (
              approvals.map((app) => (
                <div key={app.id} className="tc-approval-item">
                  <div className="tc-approval-info">
                    <div>
                      <div className="tc-approval-title">
                        {app.title}
                      </div>
                      <div className="tc-approval-meta">
                        {app.department} • Requested by {app.requestedBy}
                      </div>
                    </div>
                    <div className="tc-approval-amount">
                      {app.amount}
                    </div>
                  </div>

                  <div className="tc-approval-actions">
                    {app.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          className="tc-btn-decline"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(app.id)}
                          className="tc-btn tc-btn-primary tc-btn-authorize"
                        >
                          Authorize
                        </button>
                      </>
                    ) : (
                      <span
                        className={`tc-badge-status ${
                          app.status === 'approved' ? 'tc-badge-status--approved' : 'tc-badge-status--declined'
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Card: Corporate Governance, SOC2 & Regulatory Scorecard */}
        <div className="tc-panel-card">
          <div className="tc-panel-header">
            <div>
              <h3 className="tc-panel-title">
                Corporate Governance & Audit Scorecard
              </h3>
              <p className="tc-panel-desc">
                Verified regulatory, security, and employee KYC health.
              </p>
            </div>
            <ShieldCheck size={18} className="tc-icon-green" />
          </div>

          <div className="tc-list-stack">
            {[
              {
                title: 'Employee Identity Verification Rate',
                value: '98.2%',
                desc: `All ${overview.totalStaff > 0 ? overview.totalStaff : 'registered'} staff identities verified before escrow payouts`,
                status: 'Optimal',
              },
              {
                title: 'SOC2 Type II Readiness Gate',
                value: '94.0%',
                desc: 'Access controls, encrypted audit trails & secrets rotation',
                status: 'Optimal',
              },
              {
                title: 'IP Scaffolding & Mutual NDA Coverage',
                value: '100%',
                desc: 'Every contracted project has signed IP assignment docs',
                status: 'Optimal',
              },
              {
                title: 'PCI-DSS Payment Gateway Escrow Compliance',
                value: '100%',
                desc: 'Zero-token cardholder exposure via secure payment webhooks',
                status: 'Optimal',
              },
            ].map((gov, i) => (
              <div key={i} className="tc-scorecard-item">
                <div>
                  <div className="tc-scorecard-title">
                    {gov.title}
                  </div>
                  <div className="tc-scorecard-desc">
                    {gov.desc}
                  </div>
                </div>
                <div className="tc-scorecard-right">
                  <div className="tc-scorecard-value">
                    {gov.value}
                  </div>
                  <div className="tc-scorecard-status">
                    {gov.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
