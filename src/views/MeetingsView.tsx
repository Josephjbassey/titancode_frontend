import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  X,
  Loader2,
} from 'lucide-react';
import type { ScreenId } from '../App';
import { api } from '../services/api';

interface Meeting {
  id: string;
  title: string;
  type: 'Video' | 'Audio';
  status: 'Upcoming' | 'Live Now' | 'Ended';
  date: string;
  time: string;
  duration: string;
  roomUrl: string;
  participants: { name: string; avatar: string | null }[];
}

const mapApiMeeting = (m: any): Meeting => ({
  id: `MTG-${m.id}`,
  title: m.title,
  type: 'Video',
  status: 'Upcoming',
  date: m.date || 'Today',
  time: m.time || '10:00 AM',
  duration: `${m.duration_minutes || 45} mins`,
  roomUrl: m.meet_url || `room_${m.id}`,
  participants: m.attendees?.length > 0 ? m.attendees.map((a: any) => ({
    name: a.name || a.full_name || `Attendee #${a.id}`,
    avatar: a.avatar_url || a.avatar || null,
  })) : [
    { name: 'Joseph John', avatar: null },
    { name: 'Benedicta Atagamen', avatar: null },
  ],
});

interface MeetingsViewProps {
  onNavigate?: (view: ScreenId) => void;
  onJoinRoom?: (roomId: string) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({ onNavigate, onJoinRoom }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Video' | 'Audio'>('All');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New meeting form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Video' | 'Audio'>('Video');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    api.getMeetings()
      .then((items) => {
        if (!mounted) return;
        setMeetings((items || []).map(mapApiMeeting));
      })
      .catch(() => {
        if (!mounted) return;
        setMeetings([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    return typeFilter === 'All' || m.type === typeFilter;
  });

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const scheduledDateTime = newDate && newTime 
        ? new Date(`${newDate}T${newTime}`).toISOString() 
        : new Date(Date.now() + 3600000).toISOString();

      const created = await api.createMeeting({
        title: newTitle,
        scheduled_at: scheduledDateTime,
        duration_minutes: 45,
      });
      setMeetings([mapApiMeeting(created), ...meetings]);
    } catch {
      const newMeeting: Meeting = {
        id: `MTG-${Math.floor(300 + Math.random() * 700)}`,
        title: newTitle,
        type: newType,
        status: 'Upcoming',
        date: newDate || 'Today',
        time: newTime || '10:00 AM',
        duration: '45 mins',
        roomUrl: `room_${newTitle.toLowerCase().replace(/\s+/g, '_')}`,
        participants: [
          { name: 'Joseph John', avatar: '/assets/joseph.jpg' },
        ],
      };
      setMeetings([newMeeting, ...meetings]);
    } finally {
      setShowScheduleModal(false);
      setNewTitle('');
      setNewDate('');
      setNewTime('');
    }
  };

  return (
    <div className="tc-fade-in tc-dept-view-container">
      {/* Top Header */}
      <div className="tc-page-header-row">
        <div>
          <h1 className="tc-page-title">
            Meetings & WebRTC Rooms
          </h1>
          <p className="tc-page-subtitle">
            Instant peer-to-peer encrypted audio and video huddles with client stakeholders and team leads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="tc-gold-btn"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tc-tab-pill-group tc-mb-4">
        {(['All', 'Video', 'Audio'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={`tc-tab-pill-btn ${typeFilter === t ? 'tc-tab-pill-btn--active' : ''}`}
          >
            {t} Calls
          </button>
        ))}
      </div>

      {/* Meetings Grid */}
      <div className="tc-flex-col-gap">
        {isLoading ? (
          <div className="tc-dept-empty-box">
            <Loader2 size={36} className="tc-spin tc-text-gold tc-mx-auto tc-mb-2" />
            <p>Loading scheduled meetings...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="tc-dept-empty-box">
            <p className="tc-font-bold tc-mb-1 tc-text-white">No meetings scheduled</p>
            <p className="tc-text-muted-sm">Schedule a new sync or client briefing above to generate an encrypted room.</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const isLive = meeting.status === 'Live Now';

            const iconBoxClass = isLive
              ? 'tc-meeting-icon-box tc-meeting-icon-box--live'
              : meeting.type === 'Video'
              ? 'tc-meeting-icon-box tc-meeting-icon-box--video'
              : 'tc-meeting-icon-box tc-meeting-icon-box--audio';

            return (
              <div
                key={meeting.id}
                className={`tc-meeting-card ${isLive ? 'tc-meeting-card--live' : ''}`}
              >
                {/* Left Details */}
                <div className="tc-flex-center-gap">
                  <div className={iconBoxClass}>
                    {meeting.type === 'Video' ? <Video size={24} /> : <Mic size={24} />}
                  </div>

                  <div>
                    <div className="tc-flex-center-gap tc-mb-1">
                      <span className="tc-text-muted-xs">{meeting.id}</span>
                      {isLive && (
                        <span className="tc-badge-live">
                          ● LIVE NOW
                        </span>
                      )}
                      <span className="tc-badge-muted-pill">
                        {meeting.type}
                      </span>
                    </div>

                    <h3 className="tc-dept-card-title">
                      {meeting.title}
                    </h3>

                    <div className="tc-flex-center-gap tc-text-muted-sm">
                      <div className="tc-flex-center-gap">
                        <Calendar size={14} className="tc-text-gold" />
                        <span>{meeting.date}</span>
                      </div>
                      <div className="tc-flex-center-gap">
                        <Clock size={14} className="tc-text-gold" />
                        <span>{meeting.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Participants & Action */}
                <div className="tc-flex-center-gap">
                  {/* Avatars */}
                  <div className="tc-flex-center-gap">
                    {meeting.participants.map((p, i) => (
                      p.avatar ? (
                        <img
                          key={i}
                          src={p.avatar}
                          alt={p.name}
                          title={p.name}
                          className="tc-avatar-sm"
                        />
                      ) : (
                        <div
                          key={i}
                          className="tc-avatar-fallback"
                          title={p.name}
                        >
                          {p.name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                      )
                    ))}
                  </div>

                  {/* Join CTA */}
                  {meeting.status !== 'Ended' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (onJoinRoom) {
                          onJoinRoom(meeting.roomUrl);
                        } else if (onNavigate) {
                          onNavigate('meeting_room' as any);
                        }
                      }}
                      className={`tc-btn-join-meeting ${isLive ? 'tc-btn-join-meeting--live' : ''}`}
                    >
                      <span>{isLive ? 'Join Room Now' : 'Enter Waiting Room'}</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <span className="tc-text-muted-xs">
                      Meeting concluded
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {showScheduleModal && (
        <div
          className="tc-modal-backdrop"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="tc-task-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tc-card-header-row tc-mb-4">
              <h3 className="tc-card-title">
                Schedule WebRTC Huddle
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="tc-modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleMeeting}>
              <div className="tc-form-group">
                <label className="tc-form-label">
                  Meeting Topic / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint Review & Architecture Q&A"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-grid-2col tc-mb-3">
                <div>
                  <label className="tc-form-label">
                    Format
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="tc-form-select"
                  >
                    <option value="Video">Video & Screen Sharing</option>
                    <option value="Audio">Audio Huddle</option>
                  </select>
                </div>

                <div>
                  <label className="tc-form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="tc-form-input"
                  />
                </div>
              </div>

              <div className="tc-form-group">
                <label className="tc-form-label">
                  Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="tc-form-input"
                />
              </div>

              <div className="tc-actions-end">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="tc-modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tc-gold-btn"
                >
                  Create Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
