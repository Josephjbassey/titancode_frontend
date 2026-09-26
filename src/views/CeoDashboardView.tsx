import React, { useState, useEffect } from 'react';
import {
  Crown,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import { api, MOCK_DEPARTMENTS } from '../services/api';
import type { DepartmentInfo } from '../types';
import type { ScreenId } from '../App';

interface CeoDashboardViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const CeoDashboardView: React.FC<CeoDashboardViewProps> = ({ onNavigate }) => {
  const [departments, setDepartments] = useState<DepartmentInfo[]>(MOCK_DEPARTMENTS);
  const [overview, setOverview] = useState({
    totalRevenue: 84500000,
    treasuryBalance: 25350000,
    developerPoolPaid: 59150000,
    activeProjects: 18,
    totalStaff: 78,
    splitMemberPercent: 70,
    splitTreasuryPercent: 30,
  });

  const [approvals, setApprovals] = useState([
    {
      id: 'APP-01',
      title: 'H100 GPU Cluster Reservation for R&D AI Labs',
      department: 'Research & Development (R&D / AI)',
      requestedBy: 'Dr. Chinedu Eze',
      amount: '₦4,800,000',
      status: 'pending',
    },
    {
      id: 'APP-02',
      title: 'Enterprise ISO-27001 & SOC2 Type II Lead Auditor Retainer',
      department: 'Internal Audit, Compliance & Legal',
      requestedBy: 'Barr. Ngozi Okeke',
      amount: '₦3,500,000',
      status: 'pending',
    },
    {
      id: 'APP-03',
      title: 'Global Tech Talent Summit & DevRel Sponsorship',
      department: 'Strategic Partnerships & DevRel',
      requestedBy: 'Damian Clarke',
      amount: '₦2,200,000',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const data = await api.getCeoOverview();
      setOverview(data);
      const depts = await api.getDepartments();
      setDepartments(depts);
    }
    loadData();
  }, []);

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  return (
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* 1. EXECUTIVE HEADER */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(223, 174, 50, 0.15)',
                color: '#dfae32',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Crown size={13} />
              Executive Suite
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              System Status: Healthy
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Chief Executive & Treasury Overview
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            High-level metrics, 70/30 concierge model distributions, corporate cashflow, and department ranking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('financials')}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Wallet size={15} />
            Treasury Ledger
          </button>
          <button
            type="button"
            onClick={() => alert('Exporting Executive Board Report PDF...')}
            className="tc-btn tc-btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={15} />
            Export Board Deck
          </button>
        </div>
      </div>

      {/* 2. FOUR TOP EXECUTIVE METRICS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Metric 1: Total Gross Revenue */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Total Billed Revenue</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <ArrowUpRight size={12} /> +28.4%
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            ₦{(overview.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            Across {overview.activeProjects} enterprise client contracts
          </div>
        </div>

        {/* Metric 2: 70% Member Developer Pool */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>70% Developer Escrow Pool</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#dfae32',
                backgroundColor: 'rgba(223, 174, 50, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              70% Payout SLA
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#dfae32' }}>
            ₦{(overview.developerPoolPaid / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            Directly distributed to engineers & specialists
          </div>
        </div>

        {/* Metric 3: 30% Corporate Treasury Reserves */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>30% Treasury Reserves</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Company Equity
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            ₦{(overview.treasuryBalance / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            Retained for infra, sales, operations & expansion
          </div>
        </div>

        {/* Metric 4: Cash Runway & Net Burn */}
        <div
          style={{
            backgroundColor: '#FFFFFF1A',
            border: '1px solid #FFFFFF26',
            borderRadius: '16px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Runway & Capital Health</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Self-Sustaining
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            24.5 Months
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            Net monthly burn: ₦6.4M • Cash flow positive
          </div>
        </div>
      </div>

      {/* 3. 70/30 CONCIERGE SPLIT VISUAL BREAKDOWN */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              The 70/30 Concierge Model Distribution Ratio
            </h3>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '2px 0 0' }}>
              Every client payment automatically splits: 70% locked to executing project squad, 30% to corporate treasury.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ color: '#dfae32', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#dfae32' }} />
              Developer Squad Pool (70%)
            </span>
            <span style={{ color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
              TitanCode Treasury (30%)
            </span>
          </div>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div
          style={{
            height: '24px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '9999px',
            display: 'flex',
            overflow: 'hidden',
            padding: '2px',
          }}
        >
          <div
            style={{
              width: '70%',
              height: '100%',
              backgroundColor: '#dfae32',
              borderRadius: '9999px 0 0 9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.05em',
            }}
          >
            70% DEVELOPERS (₦59.15M)
          </div>
          <div
            style={{
              width: '30%',
              height: '100%',
              backgroundColor: '#3B82F6',
              borderRadius: '0 9999px 9999px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.05em',
            }}
          >
            30% TREASURY (₦25.35M)
          </div>
        </div>
      </div>

      {/* 4. DEPARTMENT PERFORMANCE & REVENUE CONTRIBUTION TABLE */}
      <div
        style={{
          backgroundColor: '#232324',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Startup Tech Firm Department Performance & ROI Ranking
            </h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '2px 0 0' }}>
              Revenue contribution, headcount, and budget efficiency across all 17 core business departments.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('departments')}
            style={{
              background: 'none',
              border: 'none',
              color: '#dfae32',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Manage Departments →
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Department
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Category
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Department Head
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Headcount
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Active Projects
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Monthly Budget
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                  Profit Pool Share
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, idx) => (
                <tr
                  key={dept.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#dfae32', fontWeight: 700 }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                        {dept.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#D1D5DB',
                        fontWeight: 600,
                      }}
                    >
                      {dept.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={dept.manager_avatar}
                        alt={dept.manager_name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '13px', color: '#E5E7EB', fontWeight: 500 }}>
                        {dept.manager_name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                      {dept.member_count} staff
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#D1D5DB' }}>
                      {dept.active_projects_count} active
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#dfae32' }}>
                      ₦{(dept.monthly_budget / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {dept.profit_pool_share_percent}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('manager_dashboard')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Left Card: Executive Capital Approvals Queue */}
        <div
          style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                Executive Capital Sign-Off Queue
              </h3>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>
                Pending department head budget expansions & procurement requests.
              </p>
            </div>
            <Wallet size={18} style={{ color: '#dfae32' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {approvals.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    {app.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {app.department} • Req by {app.requestedBy}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#dfae32', marginTop: '4px' }}>
                    {app.amount}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {app.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReject(app.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#EF4444',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(app.id)}
                        className="tc-btn tc-btn-primary"
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        Authorize
                      </button>
                    </>
                  ) : (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor:
                          app.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: app.status === 'approved' ? '#10B981' : '#EF4444',
                      }}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Corporate Governance, SOC2 & Regulatory Scorecard */}
        <div
          style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                Corporate Governance & Audit Scorecard
              </h3>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>
                Verified regulatory, security, and employee KYC health.
              </p>
            </div>
            <ShieldCheck size={18} style={{ color: '#10B981' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                title: 'Sumsub Employee KYC Verification Rate',
                value: '98.2%',
                desc: 'All 78 staff identities verified before escrow payouts',
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
                desc: 'Zero-token cardholder exposure via Stripe webhooks',
                status: 'Optimal',
              },
            ].map((gov, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    {gov.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {gov.desc}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>
                    {gov.value}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
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
