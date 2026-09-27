import React, { useState } from 'react';
import { Pencil, Calendar, ChevronDown } from 'lucide-react';
import { NotificationModal } from '../components/NotificationModal';
import type { User } from '../types';
import { api } from '../services/api';

interface ProfileSettingsViewProps {
  user: User;
  onUpdateUser: (updated: User) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onUpdateUser,
}) => {
  const initialFirst = user.first_name || (user.full_name ? user.full_name.split(' ')[0] : '');
  const initialLast = user.last_name || (user.full_name ? user.full_name.split(' ').slice(1).join(' ') : '');
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone_number ? user.phone_number.replace(/^\+234\s*/, '') : '');
  const [gender, setGender] = useState<'Male' | 'Female'>((user.gender as 'Male' | 'Female') || 'Female');
  const [idNumber] = useState(user.id ? `TC-${String(user.id).padStart(4, '0')}-KYC` : 'TC-KYC-PENDING');
  const [address, setAddress] = useState(user.address || '');
  const [dob, setDob] = useState(user.dob || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        phone_number: phone.trim() ? `+234 ${phone.trim()}` : undefined,
        gender,
        address: address.trim() || undefined,
        dob: dob.trim() || undefined,
      });
      onUpdateUser(updated);
      setShowSuccessModal(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#232324',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '28px',
    }}
    className="tc-fade-in"
    >
      <h2 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '24px',
      }}>
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Benedicta Avatar with Yellow Edit Pencil Badge (Figma) */}
        <div style={{ position: 'relative', width: '76px', height: '76px' }}>
          <img
            src={user.avatar_url || '/assets/benedicta.png'}
            alt="Profile Avatar"
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <button
            type="button"
            title="Change Avatar"
            style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#dfae32',
              color: '#000000',
              border: '2px solid #232324',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Pencil size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Row 1: First Name * & Last Name * */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="tc-form-row">
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              First Name *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 16px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              Last Name *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 16px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Row 2: Email * & Mobile Number * */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="tc-form-row">
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="examples@gmail.com"
              required
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 16px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              Mobile Number *
            </label>
            <div style={{
              display: 'flex',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
            }}>
              {/* Nigeria Flag prefix */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 12px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '13px',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: '16px' }}>🇳🇬</span>
                <ChevronDown size={14} color="#9CA3AF" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="800 000 0000"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0 14px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Gender & ID (Figma Sumsub Trigger) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="tc-form-row">
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              Gender
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', height: '44px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#FFFFFF' }}>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === 'Male'}
                  onChange={() => setGender('Male')}
                  style={{ accentColor: '#dfae32', cursor: 'pointer' }}
                />
                Male
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#FFFFFF' }}>
                <input
                  type="radio"
                  name="gender"
                  checked={gender === 'Female'}
                  onChange={() => setGender('Female')}
                  style={{ accentColor: '#dfae32', cursor: 'pointer' }}
                />
                Female
              </label>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', color: '#D1D5DB' }}>
                ID
              </label>
              <button
                type="button"
                onClick={() => setShowKycModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dfae32',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Sumsub KYC Verified
              </button>
            </div>
            <input
              type="text"
              value={idNumber}
              readOnly
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 16px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Row 4: Address * & Date of Birth * */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="tc-form-row">
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              required
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0 16px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#D1D5DB', marginBottom: '8px' }}>
              Date of Birth *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="YYYY-MM-DD"
                required
                style={{
                  width: '100%',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  padding: '0 40px 0 16px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <span style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none',
                display: 'flex',
              }}>
                <Calendar size={18} />
              </span>
            </div>
          </div>
        </div>

        {/* Buttons: Cancel (outline pill) & Save Changes (solid gold pill) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '16px' }}>
          <button
            type="button"
            style={{
              height: '44px',
              padding: '0 24px',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              height: '44px',
              padding: '0 28px',
              borderRadius: '9999px',
              backgroundColor: '#dfae32',
              color: '#000000',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(223, 174, 50, 0.3)',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* KYC Modal */}
      <NotificationModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        type="kyc"
        title="Sumsub Employee KYC Verification"
        message="For TitanCode team members and contractors, identity proofing is handled exclusively via Sumsub. Government ID (NIN, passport) is verified directly without storing raw national ID numbers in our database."
        actionText="Sumsub Sandbox Verified"
      />

      {/* Success Modal */}
      <NotificationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Profile Settings Updated"
        message="Your personal profile settings have been updated successfully."
        actionText="Done"
      />

      <style>{`
        @media (max-width: 640px) {
          .tc-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
