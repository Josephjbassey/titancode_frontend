/**
 * TitanCode Technologies - Offline-First Synchronization Service
 * 
 * Provides transparent offline storage, network status monitoring,
 * pending mutation queueing in localStorage, and automated cloud sync
 * with retry logic and conflict-resilient FIFO processing.
 */

export interface QueuedMutation {
  id: string;
  timestamp: number;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body: any;
  title: string;
  category: 'contact' | 'hire' | 'applicant' | 'profile' | 'task' | 'general';
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'success';
  errorMessage?: string;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  queue: QueuedMutation[];
  lastSyncTime: number | null;
  lastSyncError: string | null;
  recentlySyncedCount: number;
}

type SyncListener = (state: SyncState) => void;

const QUEUE_STORAGE_KEY = 'tc_offline_mutation_queue';
const LAST_SYNC_KEY = 'tc_offline_last_sync_time';

class OfflineSyncService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSyncing: boolean = false;
  private queue: QueuedMutation[] = [];
  private listeners: Set<SyncListener> = new Set();
  private lastSyncTime: number | null = null;
  private lastSyncError: string | null = null;
  private recentlySyncedCount: number = 0;

  constructor() {
    this.loadQueue();
    this.lastSyncTime = this.loadLastSyncTime();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);

      // Periodic check for stale queue if online
      setInterval(() => {
        if (this.isOnline && this.hasPending() && !this.isSyncing) {
          this.syncQueue();
        }
      }, 30000);
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.notify();
    // Auto-trigger sync when connectivity is restored
    if (this.hasPending()) {
      this.syncQueue();
    }
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.notify();
  };

  private loadQueue(): void {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch (err) {
      console.error('[OfflineSync] Failed to load queue from storage:', err);
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (err) {
      console.error('[OfflineSync] Failed to save queue to storage:', err);
    }
  }

  private loadLastSyncTime(): number | null {
    try {
      const val = localStorage.getItem(LAST_SYNC_KEY);
      return val ? parseInt(val, 10) : null;
    } catch {
      return null;
    }
  }

  private saveLastSyncTime(time: number): void {
    try {
      localStorage.setItem(LAST_SYNC_KEY, time.toString());
      this.lastSyncTime = time;
    } catch {
      // ignore
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('[OfflineSync] Error in sync listener:', err);
      }
    });
  }

  public getState(): SyncState {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      queue: [...this.queue],
      lastSyncTime: this.lastSyncTime,
      lastSyncError: this.lastSyncError,
      recentlySyncedCount: this.recentlySyncedCount,
    };
  }

  public getPendingCount(): number {
    return this.queue.filter((m) => m.status === 'pending' || m.status === 'failed').length;
  }

  public hasPending(): boolean {
    return this.getPendingCount() > 0;
  }

  /**
   * Enqueue a mutation to be synchronized once online.
   */
  public enqueue(item: Omit<QueuedMutation, 'id' | 'timestamp' | 'retryCount' | 'status'>): QueuedMutation {
    const mutation: QueuedMutation = {
      ...item,
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    this.queue.push(mutation);
    this.saveQueue();
    this.notify();

    // If online right now, attempt immediate flush
    if (this.isOnline && !this.isSyncing) {
      this.syncQueue();
    }

    return mutation;
  }

  /**
   * Remove a mutation from the queue manually.
   */
  public remove(id: string): void {
    this.queue = this.queue.filter((m) => m.id !== id);
    this.saveQueue();
    this.notify();
  }

  /**
   * Clear all completed or failed items.
   */
  public clearCompleted(): void {
    this.queue = this.queue.filter((m) => m.status === 'pending' || m.status === 'syncing');
    this.saveQueue();
    this.notify();
  }

  /**
   * Attempt to flush and synchronize the mutation queue with the remote API.
   */
  public async syncQueue(): Promise<{ successCount: number; failedCount: number }> {
    if (this.isSyncing || this.queue.length === 0) {
      return { successCount: 0, failedCount: 0 };
    }

    this.isSyncing = true;
    this.lastSyncError = null;
    this.notify();

    let successCount = 0;
    let failedCount = 0;

    const token = localStorage.getItem('tc_access_token');

    // Clone pending items to process in order
    const pendingItems = this.queue.filter((m) => m.status === 'pending' || m.status === 'failed');

    for (const item of pendingItems) {
      item.status = 'syncing';
      this.notify();

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(item.headers || {}),
        };

        if (token && !headers['Authorization']) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(item.endpoint, {
          method: item.method,
          headers,
          body: typeof item.body === 'string' ? item.body : JSON.stringify(item.body),
        });

        if (response.ok) {
          // Mutation processed successfully by cloud DB
          item.status = 'success';
          successCount++;
          // Remove from queue
          this.queue = this.queue.filter((m) => m.id !== item.id);
          this.saveQueue();
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.detail || `Server returned ${response.status}`;

          item.retryCount += 1;
          item.status = 'failed';
          item.errorMessage = errMsg;
          failedCount++;

          // If client error (4xx) other than 401/408/429, don't continually retry
          if (response.status >= 400 && response.status < 500 && ![401, 408, 429].includes(response.status)) {
            console.warn(`[OfflineSync] Item ${item.id} rejected with client error: ${errMsg}`);
          }
        }
      } catch (networkErr: any) {
        // Still offline or connection dropped
        console.warn(`[OfflineSync] Network error during sync of ${item.id}:`, networkErr);
        item.status = 'pending';
        item.retryCount += 1;
        item.errorMessage = networkErr.message || 'Network disconnected';
        failedCount++;
        // Break loop if network completely dropped
        if (!navigator.onLine) {
          this.isOnline = false;
          break;
        }
      }

      this.saveQueue();
      this.notify();
    }

    this.isSyncing = false;
    if (successCount > 0) {
      this.saveLastSyncTime(Date.now());
      this.recentlySyncedCount = successCount;
      setTimeout(() => {
        this.recentlySyncedCount = 0;
        this.notify();
      }, 5000);
    }

    this.notify();
    return { successCount, failedCount };
  }

  /**
   * Helper that either executes a network call or queues it if offline.
   */
  public async executeOrQueue<T>(
    mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retryCount' | 'status'>,
    executeOnline: () => Promise<T>
  ): Promise<{ data?: T; queued: boolean; message?: string }> {
    if (!this.isOnline) {
      this.enqueue(mutation);
      return {
        queued: true,
        message: 'You are currently offline. Your submission has been saved locally and will automatically upload when your internet reconnects.',
      };
    }

    try {
      const result = await executeOnline();
      return { data: result, queued: false };
    } catch (err: any) {
      // Check if the failure is a network drop (Failed to fetch / network error)
      const isNetworkError =
        err?.name === 'TypeError' ||
        err?.message?.includes('Failed to fetch') ||
        err?.message?.includes('NetworkError') ||
        !navigator.onLine;

      if (isNetworkError) {
        this.isOnline = false;
        this.enqueue(mutation);
        return {
          queued: true,
          message: 'Network connection lost. Your work was securely saved locally and will sync when back online.',
        };
      }

      // Legitimate business error (e.g., 400 validation, duplicate record) -> propagate
      throw err;
    }
  }
}

export const offlineSync = new OfflineSyncService();
