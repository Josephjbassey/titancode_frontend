import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { offlineSync, type SyncState } from '../services/offlineSync';

export const OfflineSyncBanner: React.FC = () => {
  const [syncState, setSyncState] = useState<SyncState>(offlineSync.getState());
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineSync.subscribe((state) => {
      setSyncState(state);
      // Reset dismissed state whenever going offline or new items queue
      if (!state.isOnline || state.queue.length > 0) {
        setDismissed(false);
      }
    });
    return unsubscribe;
  }, []);

  const pendingCount = syncState.queue.filter((m) => m.status === 'pending' || m.status === 'failed').length;

  // Don't render banner if online, nothing pending, and nothing recently synced
  if (syncState.isOnline && pendingCount === 0 && syncState.recentlySyncedCount === 0) {
    return null;
  }

  if (dismissed && syncState.isOnline) {
    return null;
  }

  const isOffline = !syncState.isOnline;
  const isSyncing = syncState.isSyncing;
  const isSuccess = syncState.isOnline && syncState.recentlySyncedCount > 0 && pendingCount === 0;

  let bannerClass = 'tc-offline-banner';
  if (isOffline) bannerClass += ' tc-offline-banner--offline';
  else if (isSyncing) bannerClass += ' tc-offline-banner--syncing';
  else if (isSuccess) bannerClass += ' tc-offline-banner--success';

  return (
    <div className={bannerClass}>
      <div className="tc-offline-header">
        <div className="tc-offline-status-left">
          <div
            className={`tc-offline-dot ${
              isOffline ? 'tc-offline-dot--amber' : isSyncing ? 'tc-offline-dot--blue' : 'tc-offline-dot--green'
            }`}
          />
          <div>
            <div className="tc-offline-title">
              {isOffline ? (
                <>Offline Mode</>
              ) : isSyncing ? (
                <>Syncing to Cloud...</>
              ) : isSuccess ? (
                <>Synchronized</>
              ) : (
                <>Online</>
              )}
            </div>
            <div className="tc-offline-subtitle">
              {isOffline ? (
                pendingCount > 0 ? (
                  `${pendingCount} change${pendingCount > 1 ? 's' : ''} saved locally`
                ) : (
                  'Your work will be saved locally'
                )
              ) : isSyncing ? (
                `Pushing ${pendingCount} pending item${pendingCount > 1 ? 's' : ''} to database`
              ) : isSuccess ? (
                `${syncState.recentlySyncedCount} item${syncState.recentlySyncedCount > 1 ? 's' : ''} uploaded to cloud database`
              ) : (
                'All changes up to date'
              )}
            </div>
          </div>
        </div>

        <div className="tc-flex-center-gap">
          {pendingCount > 0 && (
            <span className="tc-offline-badge">
              {pendingCount}
            </span>
          )}

          {!isOffline && pendingCount > 0 && (
            <button
              type="button"
              className="tc-offline-btn-sync"
              onClick={() => offlineSync.syncQueue()}
              disabled={isSyncing}
            >
              <RefreshCw size={13} className={isSyncing ? 'tc-spin' : ''} />
              <span>{isSyncing ? 'Syncing' : 'Sync'}</span>
            </button>
          )}

          {pendingCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="tc-offline-btn-icon"
              aria-label={expanded ? 'Collapse queue' : 'Expand queue'}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          )}

          {isSuccess && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="tc-offline-btn-icon"
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {expanded && pendingCount > 0 && (
        <div className="tc-offline-queue-list">
          {syncState.queue.map((item) => (
            <div key={item.id} className="tc-offline-queue-item">
              <div className="tc-offline-item-header">
                {item.status === 'syncing' ? (
                  <RefreshCw size={13} color="#3B82F6" className="tc-spin" />
                ) : item.status === 'failed' ? (
                  <AlertTriangle size={13} color="#EF4444" />
                ) : (
                  <CheckCircle2 size={13} color="#F59E0B" />
                )}
                <span className="tc-offline-item-title">{item.title}</span>
              </div>
              <span className="tc-offline-item-time">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
