import React, { useState } from 'react';
import {
  FolderGit2,
  CheckSquare,
  Video,
  Wallet,
  TrendingUp,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { DonutChart } from '../components/DonutChart';

export const TeamDashboardView: React.FC = () => {
  const [taskRows] = useState([
    { id: 1, name: 'Design Memb...', project: 'TitanCode Website', due: 'Aug 12, 2024', priority: 'High', status: 'In Progress' },
    { id: 2, name: 'Design Memb...', project: 'TitanCode Website', due: 'Aug 12, 2024', priority: 'High', status: 'In Progress' },
    { id: 3, name: 'Design Memb...', project: 'TitanCode Website', due: 'Aug 12, 2024', priority: 'High', status: 'In Progress' },
  ]);

  const donutSlices = [
    { label: 'Completed', value: 5, color: '#10B981' },
    { label: 'In Progress', value: 4, color: '#3B82F6' },
    { label: 'Pending', value: 3, color: '#dfae32' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }} className="tc-fade-in">
      {/* Top Greeting Header (Figma) */}
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#FFFFFF',
          letterSpacing: '-0.4px',
          marginBottom: '4px',
        }}>
          Welcome back, Benedicta! 👋
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#9CA3AF',
          margin: 0,
        }}>
          Here's what's happening with your work today.
        </p>
      </div>

      {/* 4 Metric Cards (Figma 100%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {/* Card 1: My Projects */}
        <div
          className="figma-card"
          style={{
            borderTop: '3px solid #DDC998',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>My Projects</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#DFAE324D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DDC998',
            }}>
              <FolderGit2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            04
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981' }}>
            <TrendingUp size={14} />
            <span>+ 1 since last month</span>
          </div>
        </div>

        {/* Card 2: My Tasks */}
        <div
          className="figma-card"
          style={{
            borderTop: '3px solid #DDC998',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>My Tasks</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#DFAE324D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DDC998',
            }}>
              <CheckSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            12
          </div>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#DFAE32',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            View all tasks &gt;
          </button>
        </div>

        {/* Card 3: Upcoming Meetings */}
        <div
          className="figma-card"
          style={{
            borderTop: '3px solid #DDC998',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Upcoming Meetings</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#DFAE324D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DDC998',
            }}>
              <Video size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            12
          </div>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#DFAE32',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            View all meetings &gt;
          </button>
        </div>

        {/* Card 4: Wallet Balance */}
        <div
          className="figma-card"
          style={{
            borderTop: '3px solid #DDC998',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>Wallet Balance</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#DFAE324D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DDC998',
            }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px', lineHeight: 1 }}>
            ₦125,000
          </div>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#DFAE32',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            View all payments &gt;
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Column 62% / Right Column 38% */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
        gap: '20px',
      }}
      className="tc-dashboard-split"
      >
        {/* LEFT COLUMN: My Tasks + My Project Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card: My Tasks */}
          <div style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                  My Tasks
                </h3>
              </div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                View All
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9CA3AF' }}>
                    <th style={{ padding: '10px 12px 12px', fontWeight: '500' }}>Task</th>
                    <th style={{ padding: '10px 12px 12px', fontWeight: '500' }}>Project</th>
                    <th style={{ padding: '10px 12px 12px', fontWeight: '500' }}>Due Date</th>
                    <th style={{ padding: '10px 12px 12px', fontWeight: '500' }}>Priority</th>
                    <th style={{ padding: '10px 12px 12px', fontWeight: '500' }}>Status</th>
                    <th style={{ padding: '10px 12px 12px', fontWeight: '500', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskRows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 12px', color: '#FFFFFF', fontWeight: '500' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dfae32' }} />
                          {row.name}
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px', color: '#D1D5DB' }}>
                        {row.project}
                      </td>
                      <td style={{ padding: '14px 12px', color: '#9CA3AF' }}>
                        {row.due}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {row.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(223, 174, 50, 0.15)',
                          color: '#dfae32',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <button
                          type="button"
                          style={{
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Update <ChevronDown size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: My Project Progress */}
          <div style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                My Project Progress
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                View All
              </button>
            </div>

            {/* Two Progress Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* Project 1 */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>
                  TitanCode Website
                </div>
                <div style={{ fontSize: '12px', color: '#dfae32', marginBottom: '10px' }}>
                  UI/UX Design
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>
                  My Role: UI/UX Designer
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
                  Deadline: Aug 30, 2024
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', backgroundColor: '#10B981', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>80%</span>
                </div>
              </div>

              {/* Project 2 */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>
                  GreenPace App
                </div>
                <div style={{ fontSize: '12px', color: '#3B82F6', marginBottom: '10px' }}>
                  Mobile Application
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>
                  My Role: UI Designer
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
                  Deadline: Aug 30, 2024
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', backgroundColor: '#10B981', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600' }}>60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Upcoming Meeting, Task Overview Donut, Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card: Upcoming Meeting */}
          <div style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                Upcoming Meeting
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                View All
              </button>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
              TitanCode Weekly Sync
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '14px' }}>
              Today | 2:00 PM - 3:00 PM
            </div>

            {/* Overlapping Attendee Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              {['dashprofile.jpg', 'joseph.jpg', 'blessing.jpg'].map((imgName, i) => (
                <img
                  key={i}
                  src={`/assets/${imgName}`}
                  alt="Attendee"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #232324',
                    marginLeft: i === 0 ? 0 : '-8px',
                    objectFit: 'cover',
                  }}
                />
              ))}
            </div>

            {/* Solid Gold Pill Button: Join Meeting */}
            <button
              type="button"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '9999px',
                backgroundColor: '#dfae32',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <Video size={16} />
              Join Meeting
            </button>

            {/* Next Meeting Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              fontSize: '12px',
              color: '#9CA3AF',
            }}>
              <div>
                <span style={{ color: '#FFFFFF', fontWeight: '600' }}>Design Review</span>
                <span style={{ marginLeft: '6px' }}>Tomorrow, 10:00 AM - 11:00 AM</span>
              </div>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card: Task Overview (Circular Donut Chart) */}
          <div style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                Task Overview
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                View All
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <DonutChart
                slices={donutSlices}
                size={140}
                thickness={16}
                centerValue="12"
                centerLabel="Total Tasks"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ color: '#FFFFFF' }}>Completed</span>
                  </div>
                  <span style={{ color: '#9CA3AF', fontWeight: '600' }}>5 (41.7%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                    <span style={{ color: '#FFFFFF' }}>In Progress</span>
                  </div>
                  <span style={{ color: '#9CA3AF', fontWeight: '600' }}>4 (33.3%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dfae32' }} />
                    <span style={{ color: '#FFFFFF' }}>Pending</span>
                  </div>
                  <span style={{ color: '#9CA3AF', fontWeight: '600' }}>3 (25.0%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Recent Activity */}
          <div style={{
            backgroundColor: '#232324',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                Recent Activity
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Item 1 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CheckSquare size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '500' }}>
                    You were assigned a new task
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
                    10 minutes ago
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    "Design Member Dashboard"
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(223, 174, 50, 0.15)',
                  color: '#dfae32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <FolderGit2 size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '500' }}>
                    Sarah added you to a project
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
                    2 hours ago
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    "TitanCode Web Application"
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Wallet size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '500' }}>
                    Payment received
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
                    Yesterday
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    ₦35,000 was added to your wallet
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#8B5CF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Video size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '500' }}>
                    Meeting scheduled
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
                    Yesterday
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    "Project Review Meeting" - Aug 11, 2:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .tc-dashboard-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
