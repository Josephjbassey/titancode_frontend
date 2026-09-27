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
    avatar: u.avatar || '/assets/dashprofile.jpg',
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
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* Header */}
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
            User & Staff Management
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            System-wide member registry, role authorizations, KYC bank settlement records, and accounts.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(223, 174, 50, 0.1)',
            border: '1px solid rgba(223, 174, 50, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#dfae32',
            fontWeight: 700,
          }}
        >
          {users.length} Active System Accounts
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['All', 'CEO', 'Admin', 'Manager', 'Member', 'Client'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: roleFilter === r ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: roleFilter === r ? 'rgba(223, 174, 50, 0.15)' : '#11151F',
                color: roleFilter === r ? '#dfae32' : '#9CA3AF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search
            size={16}
            color="#9CA3AF"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          backgroundColor: '#232324',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0E121B', color: '#9CA3AF', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '14px 18px' }}>Member / User</th>
              <th style={{ padding: '14px 18px' }}>Role</th>
              <th style={{ padding: '14px 18px' }}>Department</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Country</th>
              <th style={{ padding: '14px 18px' }}>Earnings</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={18} className="tc-spin" color="#dfae32" />
                    <span>Loading system accounts...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                  No accounts found matching the current criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor:
                        user.role === 'CEO'
                          ? 'rgba(223, 174, 50, 0.2)'
                          : user.role === 'Admin'
                          ? 'rgba(168, 85, 247, 0.2)'
                          : user.role === 'Manager'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.08)',
                      color:
                        user.role === 'CEO'
                          ? '#dfae32'
                          : user.role === 'Admin'
                          ? '#C084FC'
                          : user.role === 'Manager'
                          ? '#60A5FA'
                          : '#FFFFFF',
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: '#9CA3AF' }}>{user.department}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor:
                        user.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: user.status === 'Approved' ? '#10B981' : '#EF4444',
                    }}
                  >
                    ● {user.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: '#9CA3AF' }}>{user.country}</td>
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#dfae32' }}>
                  ${user.totalEarnings.toLocaleString()}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                    }}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Profile
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* USER DETAIL MODAL */}
      {selectedUser && (
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
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              padding: '32px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #dfae32' }}
                />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    {selectedUser.name}
                  </h3>
                  <div style={{ color: '#dfae32', fontSize: '13px', fontWeight: 600 }}>
                    {selectedUser.role} ● {selectedUser.department}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '2px' }}>
                    Member since {selectedUser.joinedDate}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#161617', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Contact Email</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedUser.email}
                </div>
              </div>
              <div style={{ backgroundColor: '#161617', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Phone / Location</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedUser.phone} ({selectedUser.country})
                </div>
              </div>
            </div>

            {/* Bank KYC Details */}
            <div style={{ backgroundColor: '#161617', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dfae32', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                <CreditCard size={16} />
                <span>Settlement Bank Details (KYC Verified)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#9CA3AF' }}>Bank: </span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedUser.bankName}</span>
                </div>
                <div>
                  <span style={{ color: '#9CA3AF' }}>Account / IBAN: </span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedUser.bankAccount}</span>
                </div>
              </div>
            </div>

            {/* Portfolio links */}
            {selectedUser.githubUrl && (
              <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
                <a
                  href={selectedUser.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#dfae32',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                  }}
                >
                  <Globe size={14} />
                  <span>GitHub Profile</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleUserStatus(selectedUser.id)}
                style={{
                  backgroundColor: selectedUser.status === 'Approved' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: selectedUser.status === 'Approved' ? '#EF4444' : '#10B981',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {selectedUser.status === 'Approved' ? 'Suspend Account' : 'Reactivate Account'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{
                  backgroundColor: '#dfae32',
                  color: '#0A0D14',
                  fontWeight: 700,
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
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
