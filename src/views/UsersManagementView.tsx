import React, { useState, useEffect } from 'react';
import {
  Search,
  CreditCard,
  Globe,
  ExternalLink,
  X,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'CEO' | 'Admin' | 'Manager' | 'Assistant' | 'Member' | 'Client';
  department: string;
  status: 'Approved' | 'Pending' | 'Suspended';
  country: string;
  phone: string;
  githubUrl: string;
  portfolioUrl: string;
  bankAccount: string;
  bankName: string;
  totalEarnings: number;
  avatar: string;
  joinedDate: string;
}

const mapApiUser = (u: any): PlatformUser => {
  const roleMap: Record<string, PlatformUser['role']> = {
    ceo: 'CEO',
    admin: 'Admin',
    manager: 'Manager',
    assistant: 'Assistant',
    member: 'Member',
    client: 'Client',
  };
  const normalizedRole = roleMap[(u.role || '').toLowerCase()] || 'Member';

  let normalizedStatus: PlatformUser['status'] = 'Approved';
  if ((u.status || '').toLowerCase() === 'suspended') {
    normalizedStatus = 'Suspended';
  } else if ((u.status || '').toLowerCase() === 'pending') {
    normalizedStatus = 'Pending';
  }

  return {
    id: `USR-${u.id}`,
    name: u.full_name || u.name || 'Platform Member',
    email: u.email || '',
    role: normalizedRole,
    department: u.department_name || (u.department_id ? `Department #${u.department_id}` : 'General'),
    status: normalizedStatus,
    country: u.country || 'Global',
    phone: u.phone_number || 'N/A',
    githubUrl: u.github_url || '',
    portfolioUrl: u.portfolio_url || '',
    bankAccount: u.bank_account_number || '•••• •••• ••••',
    bankName: u.bank_name || 'Bank on file',
    totalEarnings: u.total_earnings || 0,
    avatar: u.avatar || null,
    joinedDate: u.created_at ? u.created_at.split('T')[0] : '2026-01-01',
  };
};

interface UsersManagementViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({ onNavigate: _onNavigate }) => {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getUsers()
      .then((res) => {
        if (!mounted) return;
        setUsers(res.items.map(mapApiUser));
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        if (!mounted) return;
        setUsers([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleUserStatus = async (userId: string) => {
    const numericId = parseInt(userId.replace('USR-', ''), 10);
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const nextStatus = targetUser.status === 'Approved' ? 'Suspended' : 'Approved';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return { ...u, status: nextStatus };
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, status: nextStatus } : null
      );
    }

    if (!isNaN(numericId)) {
      try {
        const nextStatusEnum = (nextStatus.toLowerCase() === 'active' ? 'active' : nextStatus.toLowerCase() === 'inactive' ? 'inactive' : 'pending') as 'active' | 'inactive' | 'pending';
        await api.updateUser(numericId, { status: nextStatusEnum });
      } catch (err: any) {
        alert(err.message || 'Failed to update user status on server');
        // Revert on failure
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: targetUser.status } : u))
        );
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser((prev) => (prev ? { ...prev, status: targetUser.status } : null));
        }
      }
    }
  };

  return (
    <div className="tc-fade-in tc-products-container">
      {/* Header */}
      <div className="tc-card-header-row tc-mb-4">
        <div>
          <h1 className="tc-page-title">
            User & Staff Management
          </h1>
          <p className="tc-page-subtitle">
            System-wide member registry, role authorizations, KYC bank settlement records, and accounts.
          </p>
        </div>

        <div className="tc-badge-gold-pill">
          {users.length} Active System Accounts
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="tc-table-filter-bar">
        <div className="tc-flex-center-gap tc-flex-wrap">
          {(['All', 'CEO', 'Admin', 'Manager', 'Member', 'Client'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`tc-filter-pill-btn ${roleFilter === r ? 'tc-filter-pill-btn--active' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="tc-users-search-box">
          <Search
            size={16}
            color="#9CA3AF"
            className="tc-search-icon-pos"
          />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tc-form-input tc-search-input-padded"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="tc-tx-table-card">
        <table className="tc-tx-table">
          <thead>
            <tr className="tc-tx-table-tr">
              <th className="tc-tx-table-th">Member / User</th>
              <th className="tc-tx-table-th">Role</th>
              <th className="tc-tx-table-th">Department</th>
              <th className="tc-tx-table-th">Status</th>
              <th className="tc-tx-table-th">Country</th>
              <th className="tc-tx-table-th">Earnings</th>
              <th className="tc-tx-table-th tc-tx-table-th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="tc-tx-table-td tc-text-center tc-text-muted">
                  <div className="tc-flex-center-all">
                    <Loader2 size={18} className="tc-spin" color="#dfae32" />
                    <span>Loading system accounts...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="tc-tx-table-td tc-text-center tc-text-muted">
                  No accounts found matching the current criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="tc-tx-table-tr tc-cursor-pointer"
                >
                  <td className="tc-tx-table-td">
                    <div className="tc-flex-center-gap">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="tc-user-avatar-circle"
                        />
                      ) : (
                        <div className="tc-user-avatar-circle">
                          {user.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="tc-font-bold tc-text-white">{user.name}</div>
                        <div className="tc-text-muted tc-text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="tc-tx-table-td">
                    <span
                      className={
                        user.role === 'CEO'
                          ? 'tc-badge-role-ceo'
                          : user.role === 'Admin'
                          ? 'tc-badge-role-admin'
                          : user.role === 'Manager'
                          ? 'tc-badge-role-manager'
                          : 'tc-badge-role-default'
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="tc-tx-table-td tc-text-muted">{user.department}</td>
                  <td className="tc-tx-table-td">
                    <span
                      className={
                        user.status === 'Approved'
                          ? 'tc-badge-status-approved'
                          : 'tc-badge-status-declined'
                      }
                    >
                      ● {user.status}
                    </span>
                  </td>
                  <td className="tc-tx-table-td tc-text-muted">{user.country}</td>
                  <td className="tc-tx-table-td tc-font-bold tc-text-gold">
                    ${user.totalEarnings.toLocaleString()}
                  </td>
                  <td className="tc-tx-table-td tc-tx-table-th--right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                      }}
                      className="tc-filter-pill-btn tc-text-xs"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="tc-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="tc-modal-card tc-modal-md" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="tc-modal-header">
              <div className="tc-flex-center-gap">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="tc-user-avatar-circle tc-user-avatar-circle--lg"
                  />
                ) : (
                  <div className="tc-user-avatar-circle tc-user-avatar-circle--lg">
                    {selectedUser.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="tc-modal-title">
                    {selectedUser.name}
                  </h3>
                  <div className="tc-text-gold tc-text-sm tc-font-semibold">
                    {selectedUser.role} ● {selectedUser.department}
                  </div>
                  <div className="tc-text-muted tc-text-xs tc-mt-1">
                    Member since {selectedUser.joinedDate}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info Cards */}
            <div className="tc-grid-2col tc-mb-4">
              <div className="tc-user-detail-box">
                <div className="tc-user-detail-box-label">Contact Email</div>
                <div className="tc-user-detail-box-val">
                  {selectedUser.email}
                </div>
              </div>
              <div className="tc-user-detail-box">
                <div className="tc-user-detail-box-label">Phone / Location</div>
                <div className="tc-user-detail-box-val">
                  {selectedUser.phone} ({selectedUser.country})
                </div>
              </div>
            </div>

            {/* Bank KYC Details */}
            <div className="tc-user-detail-box tc-mb-4">
              <div className="tc-flex-center-gap tc-text-gold tc-text-sm tc-font-bold tc-mb-2">
                <CreditCard size={16} />
                <span>Settlement Bank Details (KYC Verified)</span>
              </div>
              <div className="tc-grid-2col tc-text-sm">
                <div>
                  <span className="tc-text-muted">Bank: </span>
                  <span className="tc-text-white tc-font-semibold">{selectedUser.bankName}</span>
                </div>
                <div>
                  <span className="tc-text-muted">Account / IBAN: </span>
                  <span className="tc-text-white tc-font-semibold">{selectedUser.bankAccount}</span>
                </div>
              </div>
            </div>

            {/* Portfolio links */}
            {selectedUser.githubUrl && (
              <div className="tc-flex-center-gap tc-mb-4">
                <a
                  href={selectedUser.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tc-filter-pill-btn tc-flex-center-gap tc-text-xs"
                >
                  <Globe size={14} />
                  <span>GitHub Profile</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="tc-flex-between tc-mt-4">
              <button
                type="button"
                onClick={() => toggleUserStatus(selectedUser.id)}
                className={selectedUser.status === 'Approved' ? 'tc-btn-danger' : 'tc-btn-success'}
              >
                {selectedUser.status === 'Approved' ? 'Suspend Account' : 'Reactivate Account'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="tc-action-btn-gold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
