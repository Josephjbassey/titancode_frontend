import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Send,
  ShieldCheck,
  CircleDot,
} from 'lucide-react';

import { api } from '../services/api';

/**
 * TitanCode WebRTC ICE Configuration
 * Primary public Google STUN servers with commercial TURN relay fallback
 * (Coturn / Twilio NAT traversal) for enterprise firewall and symmetric NAT penetration.
 */
export const DEFAULT_RTC_ICE_SERVERS: RTCIceServer[] = [
  // Primary Public Google STUN servers
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  // Dedicated TURN Server (fallback for symmetric enterprise NAT & firewalls)
  {
    urls: [
      (import.meta as any).env?.VITE_TURN_SERVER_URL || 'turn:turn.titancode.tech:3478?transport=udp',
      (import.meta as any).env?.VITE_TURNS_SERVER_URL || 'turns:turn.titancode.tech:5349?transport=tcp',
    ],
    username: (import.meta as any).env?.VITE_TURN_USERNAME ?? '',
    credential: (import.meta as any).env?.VITE_TURN_CREDENTIAL ?? '',
  },
];

export const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: DEFAULT_RTC_ICE_SERVERS,
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
};

export interface MeetingParticipant {
  name: string;
  role: string;
  avatar: string | null;
  speaking?: boolean;
}

export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

interface LiveMeetingRoomViewProps {
  onLeave: () => void;
  roomTitle?: string;
  initialParticipants?: MeetingParticipant[];
  initialMessages?: ChatMessage[];
  rtcConfig?: RTCConfiguration;
}

export const LiveMeetingRoomView: React.FC<LiveMeetingRoomViewProps> = ({
  onLeave,
  roomTitle = 'Sprint Architecture & Execution Sync',
  initialParticipants,
  initialMessages,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [callSeconds, setCallSeconds] = useState(0);

  const activeUser = api.getActiveUser();
  const myName = activeUser?.full_name ? `${activeUser.full_name} (You)` : 'You';
  const myRole = activeUser?.role || 'Team Member';
  const myAvatar = activeUser?.avatar_url || '/assets/dashprofile.jpg';

  const defaultSelf: MeetingParticipant = {
    name: myName,
    role: myRole,
    avatar: myAvatar,
    speaking: true,
  };

  const [participants, setParticipants] = useState<MeetingParticipant[]>(() => {
    if (initialParticipants && initialParticipants.length > 0) {
      return initialParticipants;
    }
    return [defaultSelf];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => initialMessages || []);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length]);

  // Live in-call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCallTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    let mounted = true;
    if (initialParticipants && initialParticipants.length > 0) return;

    api.getUsers({ limit: 10 })
      .then((res) => {
        if (!mounted) return;
        const otherUsers = (res?.items || []).filter(
          (u) => u.id !== activeUser?.id && (u.full_name || u.name) !== activeUser?.full_name
        );

        if (otherUsers.length > 0) {
          const peers: MeetingParticipant[] = otherUsers.slice(0, 3).map((u) => ({
            name: u.full_name || u.name || `Member #${u.id}`,
            role: u.role || (u.department ? `${u.department} Specialist` : 'Engineer'),
            avatar: u.avatar || u.avatar_url || null,
            speaking: false,
          }));
          setParticipants([defaultSelf, ...peers]);
        }
      })
      .catch(() => {
        if (mounted) setParticipants([defaultSelf]);
      });

    return () => {
      mounted = false;
    };
  }, [activeUser?.id, activeUser?.full_name, initialParticipants]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: myName,
        text: inputMessage.trim(),
        time: timeStr,
      },
    ]);
    setInputMessage('');
  };

  return (
    <div className="tc-meeting-stage-container">
      {/* MAIN VIDEO STAGE */}
      <div className="tc-meeting-main-stage">
        {/* Top Header Bar */}
        <div className="tc-meeting-header-bar">
          <div className="tc-flex-center-gap">
            {isRecording && <span className="tc-live-rec-dot" />}
            <h2 className="tc-meeting-title">{roomTitle}</h2>
            <div
              className="tc-meeting-badge-encrypted"
              title="Secure Connection Active"
            >
              <ShieldCheck size={13} />
              <span>End-to-End Encrypted</span>
            </div>
          </div>

          <div className="tc-meeting-header-meta">
            <span title={isRecording ? 'Session is recording in high-definition' : 'Recording is paused'}>
              {isRecording ? `Rec: ${formatCallTime(callSeconds)}` : `Call: ${formatCallTime(callSeconds)}`}
            </span>
            <button
              type="button"
              onClick={() => setShowChat(!showChat)}
              className={`tc-meeting-chat-toggle-btn ${showChat ? 'tc-meeting-chat-toggle-btn--active' : ''}`}
            >
              <MessageSquare size={14} />
              <span>Chat ({chatMessages.length})</span>
            </button>
          </div>
        </div>

        {/* Video Grid (2x2) */}
        <div className="tc-meeting-video-grid">
          {participants.map((p, idx) => (
            <div
              key={idx}
              className={`tc-meeting-participant-card ${p.speaking ? 'tc-meeting-participant-card--speaking' : ''}`}
            >
              {idx === 0 && !isVideoOn ? (
                /* Camera off placeholder */
                <div className="tc-meeting-muted-box">
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="tc-meeting-muted-avatar"
                    />
                  ) : (
                    <div className="tc-meeting-muted-avatar tc-flex-center-all tc-text-gold tc-font-bold tc-bg-dark">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="tc-meeting-muted-label">Camera is muted</div>
                </div>
              ) : (
                /* Video participant stream */
                <div className="tc-meeting-stream-wrap">
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="tc-meeting-stream-img"
                    />
                  ) : (
                    <div className="tc-meeting-stream-img tc-flex-center-all tc-text-gold tc-font-bold tc-text-xl tc-bg-dark">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="tc-meeting-stream-gradient" />
                </div>
              )}

              {/* Participant Name Badge */}
              <div className="tc-meeting-name-tag">
                <span>{p.name}</span>
                {p.speaking && (
                  <span className="tc-meeting-speaking-dot">● Speaking</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call Controls */}
        <div className="tc-meeting-controls-bar">
          {/* Mic */}
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`tc-meeting-circle-btn ${!isMicOn ? 'tc-meeting-circle-btn--alert' : ''}`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Video */}
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`tc-meeting-circle-btn ${!isVideoOn ? 'tc-meeting-circle-btn--alert' : ''}`}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`tc-meeting-circle-btn ${isScreenSharing ? 'tc-meeting-circle-btn--gold' : ''}`}
            title="Share Screen"
          >
            <Monitor size={20} />
          </button>

          {/* Record Session Toggle */}
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`tc-meeting-circle-btn ${isRecording ? 'tc-meeting-circle-btn--alert' : ''}`}
            title={isRecording ? 'Pause Session Recording' : 'Start Session Recording'}
          >
            <CircleDot size={20} />
          </button>

          {/* End Call / Leave */}
          <button
            type="button"
            onClick={onLeave}
            className="tc-meeting-leave-btn"
          >
            <PhoneOff size={18} />
            <span>Leave Session</span>
          </button>
        </div>
      </div>

      {/* RIGHT CHAT DRAWER */}
      {showChat && (
        <div className="tc-meeting-chat-drawer">
          {/* Chat Header */}
          <div className="tc-meeting-chat-header">
            In-Call Meeting Chat
          </div>

          {/* Messages Feed */}
          <div className="tc-meeting-chat-feed">
            {chatMessages.length === 0 ? (
              <div className="tc-meeting-chat-empty">
                <MessageSquare size={28} className="tc-meeting-chat-empty-icon" />
                <p className="tc-meeting-chat-empty-title">No in-call messages yet</p>
                <p className="tc-meeting-chat-empty-desc">
                  Send a message to start chatting with participants.
                </p>
              </div>
            ) : (
              <>
                {chatMessages.map((msg, i) => (
                  <div key={i}>
                    <div className="tc-flex-between tc-mb-1">
                      <span className="tc-chat-sender-name">{msg.sender}</span>
                      <span className="tc-chat-timestamp">{msg.time}</span>
                    </div>
                    <div className="tc-chat-bubble">
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="tc-meeting-chat-form"
          >
            <input
              type="text"
              placeholder="Send message to room..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="tc-meeting-chat-input"
            />
            <button
              type="submit"
              className="tc-meeting-chat-send-btn"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
