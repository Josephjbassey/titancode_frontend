import React, { useState } from 'react';
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
} from 'lucide-react';

interface LiveMeetingRoomViewProps {
  onLeave: () => void;
  roomTitle?: string;
}

export const LiveMeetingRoomView: React.FC<LiveMeetingRoomViewProps> = ({
  onLeave,
  roomTitle = 'Aurelia FinTech Sprint 14 Architecture Sync',
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Munis Samuel', text: 'Hey team, reviewing the WebRTC latency graphs now.', time: '3:02 PM' },
    { sender: 'Joseph John', text: 'Signaling server is holding stable at ~42ms round-trip.', time: '3:04 PM' },
    { sender: 'Benedicta Atagamen', text: 'I updated the dark mode wallet cards in Figma.', time: '3:05 PM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const participants = [
    { name: 'Joseph John (You)', role: 'Lead Fullstack', avatar: '/assets/joseph.jpg', speaking: true },
    { name: 'Munis Samuel', role: 'Product Architect', avatar: '/assets/munis.jpg', speaking: false },
    { name: 'Benedicta Atagamen', role: 'UI/UX Designer', avatar: '/assets/benedicta.png', speaking: false },
    { name: 'Olukayode Tioluwanimi', role: 'Product Manager', avatar: '/assets/blessing.jpg', speaking: false },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      {
        sender: 'Joseph John (You)',
        text: inputMessage,
        time: 'Just now',
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
            <span className="tc-live-rec-dot" />
            <h2 className="tc-meeting-title">{roomTitle}</h2>
            <div className="tc-meeting-badge-encrypted">
              <ShieldCheck size={13} />
              <span>E2E ENCRYPTED (WEBRTC)</span>
            </div>
          </div>

          <div className="tc-meeting-header-meta">
            <span>Rec: 00:24:18</span>
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
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="tc-meeting-muted-avatar"
                  />
                  <div className="tc-meeting-muted-label">Camera is muted</div>
                </div>
              ) : (
                /* Video participant stream */
                <div className="tc-meeting-stream-wrap">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="tc-meeting-stream-img"
                  />
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
