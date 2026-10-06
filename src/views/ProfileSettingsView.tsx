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
    <div className="tc-settings-panel tc-fade-in">
      <h2 className="tc-card-title tc-mb-4">
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit} className="tc-flex-col-gap">
        {/* Profile Avatar with Yellow Edit Pencil Badge (Figma) */}
        <div className="tc-avatar-upload-box">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Profile Avatar"
              className="tc-avatar-upload-img"
            />
          ) : (
            <div className="tc-avatar-upload-placeholder">
              {user.full_name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
          )}
          <button
            type="button"
            title="Change Avatar"
            className="tc-avatar-upload-btn"
          >
            <Pencil size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Row 1: First Name * & Last Name * */}
        <div className="tc-form-row">
          <div>
            <label className="tc-form-label">
              First Name *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="tc-form-input"
            />
          </div>

          <div>
            <label className="tc-form-label">
              Last Name *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="tc-form-input"
            />
          </div>
        </div>

        {/* Row 2: Email * & Mobile Number * */}
        <div className="tc-form-row">
          <div>
            <label className="tc-form-label">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@titancode.tech"
              required
              className="tc-form-input"
            />
          </div>

          <div>
            <label className="tc-form-label">
              Mobile Number *
            </label>
            <div className="tc-phone-input-wrapper">
              {/* Nigeria Flag prefix */}
              <div className="tc-phone-prefix">
                <span>🇳🇬</span>
                <ChevronDown size={14} color="#9CA3AF" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080 1234 5678"
                className="tc-phone-input"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Gender & ID (Figma Sumsub Trigger) */}
        <div className="tc-form-row">
          <div>
            <label className="tc-form-label">
              Gender
            </label>
            <div className="tc-radio-group">
              <label className="tc-radio-label">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === 'Male'}
                  onChange={() => setGender('Male')}
                  className="tc-cursor-pointer"
                />
                Male
              </label>
              <label className="tc-radio-label">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === 'Female'}
                  onChange={() => setGender('Female')}
                  className="tc-cursor-pointer"
                />
                Female
              </label>
            </div>
          </div>

          <div>
            <div className="tc-flex-between tc-mb-1">
              <label className="tc-form-label tc-mb-0">
                ID
              </label>
              <button
                type="button"
                onClick={() => setShowKycModal(true)}
                className="tc-kyc-verify-btn"
              >
                Sumsub KYC Verified
              </button>
            </div>
            <input
              type="text"
              value={idNumber}
              readOnly
              className="tc-input-readonly"
            />
          </div>
        </div>

        {/* Row 4: Address * & Date of Birth * */}
        <div className="tc-form-row">
          <div>
            <label className="tc-form-label">
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Marina, Lagos Island, Lagos"
              required
              className="tc-form-input"
            />
          </div>

          <div>
            <label className="tc-form-label">
              Date of Birth *
            </label>
            <div className="tc-relative">
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="YYYY-MM-DD"
                required
                className="tc-form-input tc-input-with-icon"
              />
              <span className="tc-calendar-icon-pos">
                <Calendar size={18} />
              </span>
            </div>
          </div>
        </div>

        {/* Buttons: Cancel (outline pill) & Save Changes (solid gold pill) */}
        <div className="tc-form-actions">
          <button
            type="button"
            className="tc-btn-pill-cancel"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="tc-action-btn-gold"
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
    </div>
  );
};
