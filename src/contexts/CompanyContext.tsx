import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface CompanySocials {
  linkedin: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  github: string;
}

export interface CompanyProfile {
  legal_name: string;
  phone: string;
  address: string;
  website_url: string;
  email_from_name: string;
  email_signature: string;
  support_email: string;
  socials: CompanySocials;
  it_github_issues_url: string;
  it_slack_channel_url: string;
  calendly_url: string;
  whatsapp_number: string;
  copyright_year: number;
}

const DEFAULT_PROFILE: CompanyProfile = {
  legal_name: 'TitanCode Technologies Inc.',
  phone: '+233(0)546606807',
  address: 'Remote',
  website_url: 'https://titancode.tech',
  email_from_name: 'TitanCode Technologies',
  email_signature: '— TitanCode Finance Team',
  support_email: 'support@titancode.tech',
  socials: { linkedin: '', twitter: '', instagram: '', tiktok: '', github: '' },
  it_github_issues_url: 'https://github.com/titancode/titancode/issues',
  it_slack_channel_url: 'https://slack.com/app_redirect?channel=it-support',
  calendly_url: '',
  whatsapp_number: '+233(0)546606807',
  copyright_year: new Date().getFullYear(),
};

const CompanyContext = createContext<CompanyProfile>(DEFAULT_PROFILE);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    api.getFinancialSettings()
      .then((settings: any) => {
        const merged: CompanyProfile = { ...DEFAULT_PROFILE };
        if (settings?.company_profile) {
          Object.assign(merged, settings.company_profile);
        }
        if (settings?.support_email) {
          merged.support_email = settings.support_email;
        }
        setProfile(merged);
      })
      .catch(() => {}); // Fail silently — use defaults
  }, []);

  return <CompanyContext.Provider value={profile}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => useContext(CompanyContext);
