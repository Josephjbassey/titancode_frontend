import React, { useState } from 'react';
import {
  Search,
  CreditCard,
  Globe,
  ExternalLink,
  X,
} from 'lucide-react';
import type { ScreenId } from '../App';

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

const INITIAL_USERS: PlatformUser[] = [
  {
    id: 'USR-001',
    name: 'Munis Samuel',
    email: 'munis@titancode.tech',
    role: 'CEO',
    department: 'Executive / Leadership',
    status: 'Approved',
    country: 'United Kingdom',
    phone: '+44 7911 123456',
    githubUrl: 'https://github.com/munissol',
    portfolioUrl: 'https://titancode.tech/munis',
    bankAccount: 'GB29 NWBK 6016 1331 9268 19',
    bankName: 'NatWest Bank UK',
    totalEarnings: 84200,
    avatar: '/assets/team_munis.png',
    joinedDate: '2024-01-10',
  },
  {
    id: 'USR-002',
    name: 'Joseph John',
    email: 'joseph@titancode.tech',
    role: 'Manager',
    department: 'Fullstack Engineering',
    status: 'Approved',
    country: 'Nigeria',
    phone: '+234 812 345 6789',
    githubUrl: 'https://github.com/josephjohn',
    portfolioUrl: 'https://josephjohn.dev',
    bankAccount: '0123456789',
    bankName: 'Guaranty Trust Bank',
    totalEarnings: 34500,
    avatar: '/assets/team_joseph.png',
    joinedDate: '2024-02-15',
  },
  {
    id: 'USR-003',
    name: 'Benedicta Atagamen',
    email: 'benedicta@titancode.tech',
    role: 'Member',
    department: 'UI/UX Design',
    status: 'Approved',
    country: 'Ghana',
    phone: '+233 54 660 6807',
    githubUrl: 'https://github.com/benedictadesign',
    portfolioUrl: 'https://dribbble.com/benedicta',
    bankAccount: '9876543210',
    bankName: 'Standard Chartered Bank',
    totalEarnings: 28900,
    avatar: '/assets/team_benedicta.png',
    joinedDate: '2024-03-01',
  },
  {
    id: 'USR-004',
    name: 'Olukayode Tioluwanimi Blessing',
    email: 'olukayode@titancode.tech',
    role: 'Admin',
    department: 'Product Management',
    status: 'Approved',
    country: 'Nigeria',
    phone: '+234 901 234 5678',
    githubUrl: 'https://github.com/olukayodepm',
    portfolioUrl: 'https://olukayode.product',
    bankAccount: '4455667788',
    bankName: 'Access Bank PLC',
    totalEarnings: 31200,
    avatar: '/assets/team_olukayode.png',
    joinedDate: '2024-02-01',
  },
  {
    id: 'USR-005',
    name: 'Apex Global Financials (Rep)',
    email: 'contact@apexglobal.com',
    role: 'Client',
    department: 'Client Partner',
    status: 'Approved',
    country: 'United States',
    phone: '+1 415 555 2671',
    githubUrl: '',
    portfolioUrl: 'https://apexglobal.com',
    bankAccount: 'US89 WIRE 0210 0002 1',
    bankName: 'JPMorgan Chase NY',
    totalEarnings: 0,
    avatar: '/assets/admin_avatar.png',
    joinedDate: '2026-01-20',
  },
];

interface UsersManagementViewProps {
  onNavigate?: (view: ScreenId) => void;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({ onNavigate: _onNavigate }) => {
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextStatus = u.status === 'Approved' ? 'Suspended' : 'Approved';
        return { ...u, status: nextStatus };
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, status: prev.status === 'Approved' ? 'Suspended' : 'Approved' } : null
      );
    }
  };

  return (
    <div style={{ color: '#FFFFFF' }}>
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
            backgroundColor: '#11151F',
            border: '1px solid rgba(229, 168, 59, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#E5A83B',
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
                borderColor: roleFilter === r ? '#E5A83B' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: roleFilter === r ? 'rgba(229, 168, 59, 0.15)' : '#11151F',
                color: roleFilter === r ? '#E5A83B' : '#9CA3AF',
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
              backgroundColor: '#11151F',
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
          backgroundColor: '#11151F',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
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
            {filteredUsers.map((user) => (
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
                          ? 'rgba(229, 168, 59, 0.2)'
                          : user.role === 'Admin'
                          ? 'rgba(168, 85, 247, 0.2)'
                          : user.role === 'Manager'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.08)',
                      color:
                        user.role === 'CEO'
                          ? '#E5A83B'
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
                <td style={{ padding: '14px 18px', fontWeight: 700, color: '#E5A83B' }}>
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
            ))}
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
              backgroundColor: '#11151F',
              border: '1px solid rgba(229, 168, 59, 0.3)',
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
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5A83B' }}
                />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    {selectedUser.name}
                  </h3>
                  <div style={{ color: '#E5A83B', fontSize: '13px', fontWeight: 600 }}>
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
              <div style={{ backgroundColor: '#0B0E14', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Contact Email</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedUser.email}
                </div>
              </div>
              <div style={{ backgroundColor: '#0B0E14', padding: '14px', borderRadius: '8px' }}>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Phone / Location</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedUser.phone} ({selectedUser.country})
                </div>
              </div>
            </div>

            {/* Bank KYC Details */}
            <div style={{ backgroundColor: '#0B0E14', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E5A83B', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
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
                    color: '#E5A83B',
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
                  backgroundColor: '#E5A83B',
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
