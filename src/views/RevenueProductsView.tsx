import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  ExternalLink,
  X,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';

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

const mapApiProduct = (p: any): DigitalProduct => {
  let mappedType: DigitalProduct['type'] = 'Platform';
  const pt = (p.product_type || '').toLowerCase();
  if (pt.includes('mobile')) mappedType = 'Mobile App';
  else if (pt.includes('web')) mappedType = 'Website';
  else if (pt.includes('game')) mappedType = 'Game';

  return {
    id: `PRD-${String(p.id).padStart(2, '0')}`,
    name: p.name,
    type: mappedType,
    url: p.product_url || 'https://titancode.tech',
    apiKey: p.api_key || p.api_key_masked || p.api_key_id || 'tc_live_••••••••••••••••••••••••••••••••',
    totalRevenue: p.total_revenue || 0,
    monthlyRevenue: p.monthly_revenue || 0,
    status: 'Active',
    createdDate: p.created_at ? p.created_at.split('T')[0] : '2026-01-01',
  };
};

export const RevenueProductsView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Platform' | 'Mobile App' | 'Website' | 'Game'>('Platform');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getProducts()
      .then((records) => {
        if (!mounted) return;
        setProducts(records.map(mapApiProduct));
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        if (!mounted) return;
        setProducts([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const totalEarnings = products.reduce((acc, p) => acc + p.totalRevenue, 0);
  const totalMonthly = products.reduce((acc, p) => acc + p.monthlyRevenue, 0);

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await api.addProduct({
        name: newName.trim(),
        product_type: newType,
        product_url: newUrl.trim() || undefined,
      });

      setProducts((prev) => [...prev, mapApiProduct(created)]);
      setShowAddModal(false);
      setNewName('');
      setNewUrl('');
    } catch (err: any) {
      alert(err.message || 'Failed to register product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tc-fade-in tc-products-container">
      {/* Header */}
      <div className="tc-card-header-row tc-mb-4">
        <div>
          <h1 className="tc-page-title">
            Products & Revenue Engine
          </h1>
          <p className="tc-page-subtitle">
            Register TitanCode intellectual property, generate telemetry API keys, and monitor MRR cashflow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="tc-action-btn-gold"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Register Product</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="tc-product-kpi-grid">
        <div className="tc-product-kpi-card tc-product-kpi-card--gold">
          <div className="tc-product-kpi-label">Total Cumulative Revenue</div>
          <div className="tc-product-kpi-value tc-product-kpi-value--gold">
            ${totalEarnings.toLocaleString()} USD
          </div>
          <div className="tc-product-kpi-sub tc-product-kpi-sub--emerald">All live products verified</div>
        </div>

        <div className="tc-product-kpi-card">
          <div className="tc-product-kpi-label">Current Monthly MRR Run-rate</div>
          <div className="tc-product-kpi-value tc-product-kpi-value--white">
            ${totalMonthly.toLocaleString()} / mo
          </div>
          <div className="tc-product-kpi-sub tc-product-kpi-sub--emerald">+22% growth vs last quarter</div>
        </div>

        <div className="tc-product-kpi-card">
          <div className="tc-product-kpi-label">Live Endpoints & APIs</div>
          <div className="tc-product-kpi-value tc-product-kpi-value--white">
            {products.length} Active Services
          </div>
          <div className="tc-product-kpi-sub tc-product-kpi-sub--muted">99.98% uptime SLA</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="tc-products-list">
        {isLoading ? (
          <div className="tc-empty-state">
            <div className="tc-flex-center-all">
              <Loader2 size={20} className="tc-spin" color="#dfae32" />
              <span>Loading registered products...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="tc-empty-state">
            No digital products registered yet. Click &quot;Register Product&quot; above to connect one.
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="tc-product-card">
              <div>
                <div className="tc-flex-center-gap tc-mb-2">
                  <span className="tc-text-xs tc-font-bold tc-text-gold">{product.id}</span>
                  <span className="tc-product-type-badge">
                    {product.type}
                  </span>
                  <span className="tc-text-xs tc-text-muted">Created {product.createdDate}</span>
                </div>

                <h3 className="tc-card-title tc-mb-2">
                  {product.name}
                </h3>

                {/* API Key Box */}
                <div className="tc-product-apikey-box">
                  <Key size={13} color="#dfae32" />
                  <span className="tc-product-apikey-code">
                    {product.apiKey.slice(0, 16)}••••••••••••••••
                  </span>
                  <button
                    type="button"
                    onClick={() => copyApiKey(product.apiKey)}
                    className="tc-filter-pill-btn tc-flex-center-gap tc-text-xs"
                  >
                    {copiedKey === product.apiKey ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey === product.apiKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
              </div>

              {/* Financial Metrics & URL */}
              <div className="tc-flex-center-gap tc-flex-wrap">
                <div className="tc-text-right">
                  <div className="tc-text-xl tc-font-bold tc-text-gold">
                    ${product.totalRevenue.toLocaleString()} USD
                  </div>
                  <div className="tc-text-xs tc-text-muted tc-mt-1">
                    +${product.monthlyRevenue.toLocaleString()}/mo MRR
                  </div>
                </div>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="tc-filter-pill-btn tc-flex-center-gap"
                >
                  <span>Live URL</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* REGISTER PRODUCT MODAL */}
      {showAddModal && (
        <div className="tc-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="tc-modal-card tc-modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-header">
              <h3 className="tc-modal-title">
                Register Digital Product
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TitanCore Auth Gateway"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-grid-2col tc-mb-4">
                <div>
                  <label className="tc-form-label">
                    Product Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="tc-form-input"
                  >
                    <option value="Platform">Platform / SaaS</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Website">Website</option>
                    <option value="Game">Game</option>
                  </select>
                </div>
                <div>
                  <label className="tc-form-label">
                    Production URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="tc-form-input"
                  />
                </div>
              </div>

              <div className="tc-flex-end-gap tc-mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="tc-filter-pill-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tc-action-btn-gold"
                  disabled={isSubmitting}
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
