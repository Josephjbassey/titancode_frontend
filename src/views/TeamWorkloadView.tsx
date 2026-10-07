import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { TeamMemberWorkload } from '../types';
import type { ScreenId } from '../App';

export const TeamWorkloadView: React.FC<{ onNavigate?: (view: ScreenId) => void }> = () => {
  const [members, setMembers] = useState<TeamMemberWorkload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getTeamWorkload()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="tc-fade-in tc-view-container">
      <div className="tc-page-header">
        <div>
          <h1 className="tc-page-title">Team Workload</h1>
          <p className="tc-dashboard-subtitle">Current task and project load per team member.</p>
        </div>
      </div>
      {isLoading ? (
        <div className="tc-loading-state">
          <Loader2 size={20} className="tc-spin" />
          <span>Loading workload...</span>
        </div>
      ) : (
        <div className="tc-settings-card tc-p-0">
          <div style={{ overflowX: 'auto' }}>
            <table className="tc-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Active Tasks</th>
                  <th>Completed Tasks</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={6} className="tc-table-empty">No workload data available.</td></tr>
                ) : members.map(m => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td><span className="tc-badge">{m.role}</span></td>
                    <td>{m.department}</td>
                    <td><span className="tc-badge">{m.allocation_status}</span></td>
                    <td>{m.active_tasks_count}</td>
                    <td>{m.completed_tasks_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
