import React, { useState } from 'react';
import {
  Video,
  Mic,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  X,
} from 'lucide-react';
import type { ScreenId } from '../App';

interface Meeting {
  id: string;
  title: string;
  type: 'Video' | 'Audio';
  status: 'Upcoming' | 'Live Now' | 'Ended';
  date: string;
  time: string;
  duration: string;
  roomUrl: string;
  participants: { name: string; avatar: string }[];
}

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'MTG-301',
    title: 'Aurelia FinTech Sprint 14 Architecture Sync',
    type: 'Video',
    status: 'Live Now',
    date: 'Today',
    time: '3:00 PM - 3:45 PM',
    duration: '45 mins',
    roomUrl: 'room_aurelia_sprint14',
    participants: [
      { name: 'Munis Samuel', avatar: '/assets/munis.jpg' },
      { name: 'Joseph John', avatar: '/assets/joseph.jpg' },
      { name: 'Benedicta Atagamen', avatar: '/assets/benedicta.png' },
      { name: 'Olukayode Tioluwanimi', avatar: '/assets/blessing.jpg' },
    ],
  },
  {
    id: 'MTG-302',
    title: 'Apex Global Financials — Bi-weekly Client Demo',
    type: 'Video',
    status: 'Upcoming',
    date: 'Tomorrow',
    time: '11:00 AM - 12:00 PM',
    duration: '60 mins',
    roomUrl: 'room_apex_demo',
    participants: [
      { name: 'Munis Samuel', avatar: '/assets/munis.jpg' },
      { name: 'Benedicta Atagamen', avatar: '/assets/benedicta.png' },
    ],
  },
  {
    id: 'MTG-303',
    title: 'Digital Products Revenue & Arbitrage Engine Review',
    type: 'Audio',
    status: 'Upcoming',
    date: '2026-09-24',
    time: '4:00 PM - 4:30 PM',
    duration: '30 mins',
    roomUrl: 'room_audio_products',
    participants: [
      { name: 'Joseph John', avatar: '/assets/joseph.jpg' },
      { name: 'Munis Samuel', avatar: '/assets/munis.jpg' },
    ],
  },
  {
    id: 'MTG-304',
    title: 'TitanCore Infrastructure Scaling Postmortem',
    type: 'Video',
    status: 'Ended',
    date: '2026-09-17',
    time: '2:00 PM - 3:00 PM',
    duration: '60 mins',
    roomUrl: 'room_postmortem',
    participants: [
      { name: 'Joseph John', avatar: '/assets/joseph.jpg' },
      { name: 'Olukayode Tioluwanimi', avatar: '/assets/blessing.jpg' },
    ],
  },
];

interface MeetingsViewProps {
  onNavigate?: (view: ScreenId) => void;
  onJoinRoom?: (roomId: string) => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({ onNavigate, onJoinRoom }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Video' | 'Audio'>('All');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New meeting form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Video' | 'Audio'>('Video');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const filteredMeetings = meetings.filter((m) => {
    return typeFilter === 'All' || m.type === typeFilter;
  });

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMeeting: Meeting = {
      id: `MTG-${Math.floor(300 + Math.random() * 700)}`,
      title: newTitle,
      type: newType,
      status: 'Upcoming',
      date: newDate || '2026-09-25',
      time: newTime || '10:00 AM - 11:00 AM',
      duration: '60 mins',
      roomUrl: `room_${newTitle.toLowerCase().replace(/\s+/g, '_')}`,
      participants: [
        { name: 'Munis Samuel', avatar: '/assets/munis.jpg' },
        { name: 'Joseph John', avatar: '/assets/joseph.jpg' },
      ],
    };

    setMeetings([newMeeting, ...meetings]);
    setShowScheduleModal(false);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
  };

  return (
    <div className="tc-fade-in" style={{ color: '#FFFFFF', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      {/* Top Header */}
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
            Meetings & WebRTC Rooms
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0' }}>
            Instant peer-to-peer encrypted audio and video huddles with client stakeholders and team leads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="tc-action-btn-gold"
          style={{ fontSize: '14px', padding: '11px 22px', height: 'auto' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {(['All', 'Video', 'Audio'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: typeFilter === t ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
              backgroundColor: typeFilter === t ? 'rgba(223, 174, 50, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: typeFilter === t ? '#dfae32' : '#9CA3AF',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {t} Calls
          </button>
        ))}
      </div>

      {/* Meetings Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredMeetings.map((meeting) => {
          const isLive = meeting.status === 'Live Now';

          return (
            <div
              key={meeting.id}
              style={{
                backgroundColor: '#FFFFFF1A',
                borderRadius: '14px',
                padding: '24px',
                border: isLive ? '1px solid #dfae32' : '1px solid #FFFFFF26',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '300px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    backgroundColor: isLive
                      ? '#dfae32'
                      : meeting.type === 'Video'
                      ? 'rgba(59, 130, 246, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                    color: isLive ? '#0A0D14' : meeting.type === 'Video' ? '#3B82F6' : '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {meeting.type === 'Video' ? <Video size={24} /> : <Mic size={24} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{meeting.id}</span>
                    {isLive && (
                      <span
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          letterSpacing: '0.05em',
                          animation: 'pulse 2s infinite',
                        }}
                      >
                        ● LIVE NOW
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {meeting.type}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px' }}>
                    {meeting.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#9CA3AF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#dfae32" />
                      <span>{meeting.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#dfae32" />
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Participants & Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Avatars */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {meeting.participants.map((p, i) => (
                    <img
                      key={i}
                      src={p.avatar}
                      alt={p.name}
                      title={p.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid #11151F',
                        marginLeft: i > 0 ? '-8px' : '0',
                        objectFit: 'cover',
                      }}
                    />
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
                    style={{
                      backgroundColor: isLive ? '#dfae32' : 'rgba(255, 255, 255, 0.08)',
                      color: isLive ? '#0A0D14' : '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: '11px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: isLive ? '0 4px 14px rgba(223, 174, 50, 0.3)' : 'none',
                    }}
                  >
                    <span>{isLive ? 'Join Room Now' : 'Enter Waiting Room'}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <span style={{ fontSize: '13px', color: '#9CA3AF', fontStyle: 'italic' }}>
                    Meeting concluded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {showScheduleModal && (
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
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            style={{
              backgroundColor: '#1C1C1E',
              border: '1px solid rgba(223, 174, 50, 0.3)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Schedule WebRTC Session
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleMeeting}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Meeting Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aurelia FinTech Design Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
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
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{
                      width: '100%',
                      backgroundColor: '#161617',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Video">Video Call (WebRTC)</option>
                    <option value="Audio">Audio Huddle (Voice Only)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#161617',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>
                  Time Window
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2:00 PM - 2:45 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#161617',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
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
                    backgroundColor: '#dfae32',
                    color: '#0A0D14',
                    fontWeight: 700,
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
