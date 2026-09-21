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
    { name: 'Joseph John (You)', role: 'Lead Fullstack', avatar: '/assets/team_joseph.png', speaking: true },
    { name: 'Munis Samuel', role: 'Product Architect', avatar: '/assets/team_munis.png', speaking: false },
    { name: 'Benedicta Atagamen', role: 'UI/UX Designer', avatar: '/assets/team_benedicta.png', speaking: false },
    { name: 'Olukayode Tioluwanimi', role: 'Product Manager', avatar: '/assets/team_olukayode.png', speaking: false },
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
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 120px)',
        backgroundColor: '#07090D',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(229, 168, 59, 0.2)',
        color: '#FFFFFF',
      }}
    >
      {/* MAIN VIDEO STAGE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#0E1118',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{roomTitle}</h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={13} />
              <span>E2E ENCRYPTED (WEBRTC)</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#9CA3AF' }}>
            <span>Rec: 00:24:18</span>
            <button
              type="button"
              onClick={() => setShowChat(!showChat)}
              style={{
                backgroundColor: showChat ? '#E5A83B' : 'rgba(255, 255, 255, 0.08)',
                color: showChat ? '#0A0D14' : '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <MessageSquare size={14} />
              <span>Chat ({chatMessages.length})</span>
            </button>
          </div>
        </div>

        {/* Video Grid (2x2) */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '16px',
            backgroundColor: '#0B0E14',
          }}
        >
          {participants.map((p, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                backgroundColor: '#11151F',
                borderRadius: '12px',
                overflow: 'hidden',
                border: p.speaking ? '2px solid #E5A83B' : '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {idx === 0 && !isVideoOn ? (
                /* Camera off placeholder */
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
                  />
                  <div style={{ color: '#9CA3AF', fontSize: '13px' }}>Camera is muted</div>
                </div>
              ) : (
                /* Mock live stream with portrait */
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.9)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.85) 100%)',
                    }}
                  />
                </div>
              )}

              {/* Participant Name Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>{p.name}</span>
                {p.speaking && (
                  <span style={{ color: '#10B981', fontSize: '10px' }}>● Speaking</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call Controls */}
        <div
          style={{
            height: '80px',
            backgroundColor: '#0E1118',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {/* Mic */}
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isMicOn ? 'rgba(255, 255, 255, 0.1)' : '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Video */}
          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isVideoOn ? 'rgba(255, 255, 255, 0.1)' : '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isScreenSharing ? '#E5A83B' : 'rgba(255, 255, 255, 0.1)',
              color: isScreenSharing ? '#0A0D14' : '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Share Screen"
          >
            <Monitor size={20} />
          </button>

          {/* End Call / Leave */}
          <button
            type="button"
            onClick={onLeave}
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: '999px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
            }}
          >
            <PhoneOff size={18} />
            <span>Leave Session</span>
          </button>
        </div>
      </div>

      {/* RIGHT CHAT DRAWER */}
      {showChat && (
        <div
          style={{
            width: '320px',
            backgroundColor: '#0E1118',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            In-Call Meeting Chat
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#E5A83B', fontSize: '12px' }}>{msg.sender}</span>
                  <span style={{ color: '#6B7280', fontSize: '11px' }}>{msg.time}</span>
                </div>
                <div style={{ backgroundColor: '#11151F', padding: '10px 12px', borderRadius: '8px', color: '#D1D5DB', lineHeight: 1.4 }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Send message to room..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#11151F',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#FFFFFF',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#E5A83B',
                color: '#0A0D14',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
