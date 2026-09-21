import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  ExternalLink,
  X,
} from 'lucide-react';
import type { ScreenId } from '../App';

interface DigitalProduct {
  id: string;
  name: string;
  type: 'Platform' | 'Mobile App' | 'Website' | 'Game';
  url: string;
  apiKey: string;
  totalRevenue: number;
  monthlyRevenue: number;
  status: 'Active' | 'Under Development';
  createdDate: string;
}

const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'PRD-01',
    name: 'TitanCore Cloud SaaS',
    type: 'Platform',
    url: 'https://cloud.titancode.tech',
    apiKey: 'tc_live_8f7b2c9a1d3e4f5a6b7c8d9e0f1a2b3c',
    totalRevenue: 54200,
    monthlyRevenue: 12400,
    status: 'Active',
    createdDate: '2025-08-12',
  },
  {
    id: 'PRD-02',
    name: 'OmniTrade Bot Infrastructure',
    type: 'Platform',
    url: 'https://omnitrade.fi',
    apiKey: 'tc_live_7c4d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    totalRevenue: 22400,
    monthlyRevenue: 6800,
    status: 'Active',
    createdDate: '2025-11-20',
  },
  {
    id: 'PRD-03',
    name: 'Aurelia FinTech Mobile SDK',
    type: 'Mobile App',
    url: 'https://aurelia.app',
    apiKey: 'tc_live_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    totalRevenue: 8000,
    monthlyRevenue: 2500,
    status: 'Active',
    createdDate: '2026-02-10',
  },
];

export const RevenueProductsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [products, setProducts] = useState<DigitalProduct[]>(INITIAL_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Platform' | 'Mobile App' | 'Website' | 'Game'>('Platform');
  const [newUrl, setNewUrl] = useState('');

  const totalEarnings = products.reduce((acc, p) => acc + p.totalRevenue, 0);
  const totalMonthly = products.reduce((acc, p) => acc + p.monthlyRevenue, 0);

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: DigitalProduct = {
      id: `PRD-0${products.length + 1}`,
      name: newName,
      type: newType,
      url: newUrl || 'https://titancode.tech',
      apiKey: `tc_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      totalRevenue: 0,
      monthlyRevenue: 0,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setProducts([...products, newProd]);
    setShowAddModal(false);
    setNewName('');
    setNewUrl('');
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
            Products & Revenue Engine
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Register TitanCode intellectual property, generate telemetry API keys, and monitor MRR cashflow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: '#E5A83B',
            color: '#0A0D14',
            fontWeight: 700,
            fontSize: '14px',
            padding: '11px 22px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(229, 168, 59, 0.25)',
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Register Product</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <div style={{ backgroundColor: '#11151F', borderRadius: '14px', padding: '24px', border: '1px solid rgba(229, 168, 59, 0.3)' }}>
          <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Total Cumulative Revenue</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#E5A83B', marginTop: '6px' }}>
            ${totalEarnings.toLocaleString()} USD
          </div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '4px' }}>All live products verified</div>
        </div>

        <div style={{ backgroundColor: '#11151F', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Current Monthly MRR Run-rate</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            ${totalMonthly.toLocaleString()} / mo
          </div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '4px' }}>+22% growth vs last quarter</div>
        </div>

        <div style={{ backgroundColor: '#11151F', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Live Endpoints & APIs</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {products.length} Active Services
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>99.98% uptime SLA</div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: '#11151F',
              borderRadius: '14px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ color: '#E5A83B', fontSize: '12px', fontWeight: 700 }}>{product.id}</span>
                <span
                  style={{
                    backgroundColor: 'rgba(229, 168, 59, 0.15)',
                    color: '#E5A83B',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {product.type}
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Created {product.createdDate}</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px' }}>
                {product.name}
              </h3>

              {/* API Key Box */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0B0E14',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                }}
              >
                <Key size={13} color="#E5A83B" />
                <span style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>
                  {product.apiKey.slice(0, 16)}••••••••••••••••
                </span>
                <button
                  type="button"
                  onClick={() => copyApiKey(product.apiKey)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedKey === product.apiKey ? '#10B981' : '#E5A83B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {copiedKey === product.apiKey ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === product.apiKey ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>
            </div>

            {/* Financial Metrics & URL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#E5A83B' }}>
                  ${product.totalRevenue.toLocaleString()} USD
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                  +${product.monthlyRevenue.toLocaleString()}/mo MRR
                </div>
              </div>

              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                <span>Live URL</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER PRODUCT MODAL */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: '#11151F',
              border: '1px solid rgba(229, 168, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Register Digital Product
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TitanCore Auth Gateway"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B0E14',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Product Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0B0E14',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Platform">Platform / SaaS</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Website">Website</option>
                    <option value="Game">Game</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Production URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0B0E14',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  Generate API Key & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
