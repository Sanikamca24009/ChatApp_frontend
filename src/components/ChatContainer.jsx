import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { CallContext } from '../../context/CallContext';
import toast from 'react-hot-toast';

/* ── Paper Plane SVG ── */
const PaperPlaneSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22 2L11 13" stroke="#FFF7E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#FFF7E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Gallery SVG ── */
const GallerySVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#D4A72C" strokeWidth="1.8"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="#D4A72C"/>
    <path d="M3 16L8 11L12 15L16 10L21 16" stroke="#D4A72C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Welcome / Empty State with Sunset Pirate Ship & Crew Background ── */
const WelcomeState = () => (
  <div
    className="gl-welcome-sunset-screen"
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundImage: "url('/sunset_crew_bg.jpg?v=2')",
      backgroundSize: 'cover',
      backgroundPosition: 'center 45%',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#1C101A',
    }}
  />
);

/* ── Pirate Ship Control-Panel Helm Button ── */
const HelmControlButton = ({ id, label, onClick, children }) => (
  <div className="gl-helm-btn-wrapper">
    <button
      id={id}
      type="button"
      className="gl-helm-control-btn"
      aria-label={label}
      onClick={onClick}
    >
      <svg
        className="gl-helm-svg"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`goldHelmGrad-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4BC" />
            <stop offset="28%" stopColor="#E5B93F" />
            <stop offset="70%" stopColor="#D4A72C" />
            <stop offset="100%" stopColor="#8A6314" />
          </linearGradient>
          <radialGradient id={`navyDialGrad-${id}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#10253E" />
            <stop offset="55%" stopColor="#081729" />
            <stop offset="100%" stopColor="#030913" />
          </radialGradient>
          <linearGradient id={`goldIconGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF7CA" />
            <stop offset="40%" stopColor="#F5D37B" />
            <stop offset="100%" stopColor="#D4A72C" />
          </linearGradient>
        </defs>

        {/* 8 Ship Helm Spokes with Turned Brass Handles */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 23 23)`}>
            <line
              x1="23"
              y1="7.5"
              x2="23"
              y2="1.8"
              stroke={`url(#goldHelmGrad-${id})`}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle
              cx="23"
              cy="1.8"
              r="1.6"
              fill="#F5D37B"
              stroke="#8A6314"
              strokeWidth="0.6"
            />
          </g>
        ))}

        {/* Outer Metallic Brass Rim */}
        <circle
          cx="23"
          cy="23"
          r="17"
          stroke={`url(#goldHelmGrad-${id})`}
          strokeWidth="2.2"
          fill="none"
        />

        {/* Inner Brass Bevel Ring */}
        <circle
          cx="23"
          cy="23"
          r="15.2"
          stroke="#7A5612"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Dark Navy Circular Control Panel Disc */}
        <circle
          cx="23"
          cy="23"
          r="14.6"
          fill={`url(#navyDialGrad-${id})`}
        />

        {/* Specular Highlight Arc */}
        <path
          d="M 12.5 18 A 14.6 14.6 0 0 1 33.5 18"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gold Nautical Action Icon */}
        {children(`url(#goldIconGrad-${id})`)}
      </svg>
    </button>

    {/* Floating Dark Navy Gold-Bordered Tooltip */}
    <span className="gl-helm-tooltip" role="tooltip">
      {label}
    </span>
  </div>
);

const ChatContainer = ({ onToggleRightSidebar, isRightSidebarOpen }) => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, chatThemes } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { initiateCall } = useContext(CallContext);
  const messagesContainerRef = useRef(null);
  const [input, setInput] = useState('');

  const activeChatTheme = (selectedUser && chatThemes[selectedUser._id]) || null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (!selectedUser) return <WelcomeState />;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div
      className={`gl-chat-area ${activeChatTheme ? 'has-theme' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#06111F',
      }}
    >
      {/* ── Active Chat Theme Wallpaper Layer ── */}
      {activeChatTheme && (
        <div
          className="gl-chat-theme-layer"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${activeChatTheme}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Subtle dark backdrop overlay so chat bubbles are crisp and legible */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(6, 17, 31, 0.45)',
            }}
          />
        </div>
      )}

      {/* ── Floating Header ── */}
      <div className="gl-chat-header" style={{ position: 'relative', zIndex: 2 }}>
        {/* Back button (mobile) */}
        <button
          id="chat-back-btn"
          onClick={() => setSelectedUser(null)}
          style={{
            display: 'none',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--gold-bright)', fontSize: '1.2rem', padding: '4px',
          }}
          className="md:hidden"
          aria-label="Back to conversation list"
        >
          ←
        </button>

        {/* ── Grand Line Contact Plaque (Resilient & Responsive) ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <div
            className="gl-contact-plaque"
            role="region"
            aria-label={`Active chat: ${selectedUser.fullName}`}
          >
            {/* Avatar Slot with Ornate Gold Ring */}
            <div className="gl-contact-avatar-slot">
              {selectedUser.isGroup ? (
                <div className="gl-contact-avatar-group">
                  {selectedUser.flag || '⚔️'}
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt={selectedUser.fullName}
                    className="gl-contact-avatar-img"
                  />
                  {isOnline && <span className="gl-bottle-online-dot" />}
                </div>
              )}
            </div>

            {/* Name & Online / Crew Status */}
            <div className="gl-contact-text-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span className="gl-contact-title">
                  {selectedUser.fullName}
                </span>
                {selectedUser.isGroup && (
                  <span className="gl-bottle-crew-badge">
                    CREW
                  </span>
                )}
              </div>
              <span className="gl-contact-sub">
                {selectedUser.isGroup
                  ? `👑 ${selectedUser.captain?._id === authUser?._id ? 'You' : (selectedUser.captain?.fullName || 'Captain')} • ${selectedUser.members?.length || 0} Pirates`
                  : (isOnline ? '● Online' : '⚓ Offline')}
              </span>
            </div>
          </div>
        </div>

        {/* Pirate Ship Control-Panel Header Actions (Audio Call, Video Call, Search, Crew Info) */}
        <div className="gl-helm-control-cluster" role="toolbar" aria-label="Chat header actions">
          {/* Audio Call */}
          <HelmControlButton
            id="header-audio-call-btn"
            label="Audio Call"
            onClick={() => initiateCall(selectedUser, 'audio')}
          >
            {(goldGrad) => (
              <path
                d="M29.5 24.8v2.4a1.6 1.6 0 0 1-1.75 1.6 15.5 15.5 0 0 1-6.7-2.4 15.3 15.3 0 0 1-4.65-4.65 15.5 15.5 0 0 1-2.4-6.7A1.6 1.6 0 0 1 15.6 13.3h2.4a1.6 1.6 0 0 1 1.6 1.37c.1.75.28 1.48.55 2.18a1.6 1.6 0 0 1-.36 1.68l-1.02 1.02a12.4 12.4 0 0 0 4.75 4.75l1.02-1.02a1.6 1.6 0 0 1 1.68-.36c.7.27 1.43.45 2.18.55a1.6 1.6 0 0 1 1.3 1.6z"
                fill={goldGrad}
                stroke="#B8860B"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            )}
          </HelmControlButton>

          {/* Video Call */}
          <HelmControlButton
            id="header-video-call-btn"
            label="Video Call"
            onClick={() => initiateCall(selectedUser, 'video')}
          >
            {(goldGrad) => (
              <g>
                <rect x="14" y="17.5" width="11" height="11" rx="2" fill={goldGrad} stroke="#B8860B" strokeWidth="0.5" />
                <polygon points="26.5 20 32 16.5 32 29.5 26.5 26" fill={goldGrad} stroke="#B8860B" strokeWidth="0.5" />
                <circle cx="19.5" cy="23" r="2.4" stroke="#081729" strokeWidth="0.9" fill="none" />
                <circle cx="19.5" cy="23" r="0.9" fill="#FFF7CA" />
              </g>
            )}
          </HelmControlButton>

          {/* Search */}
          <HelmControlButton
            id="header-search-btn"
            label="Search"
            onClick={() => toast('Log Pose searching logs...', { icon: '🔍' })}
          >
            {(goldGrad) => (
              <g>
                <circle cx="21.5" cy="21.5" r="5.8" stroke={goldGrad} strokeWidth="2.2" fill="none" />
                <line x1="25.8" y1="25.8" x2="31" y2="31" stroke={goldGrad} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="21.5" y1="18.5" x2="21.5" y2="24.5" stroke="#F5D37B" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
                <line x1="18.5" y1="21.5" x2="24.5" y2="21.5" stroke="#F5D37B" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
                <circle cx="21.5" cy="21.5" r="1.1" fill="#FFF7CA" />
              </g>
            )}
          </HelmControlButton>

          {/* Crew Info */}
          <HelmControlButton
            id="header-crew-info-btn"
            label="Crew Info"
            onClick={() => {
              if (onToggleRightSidebar) {
                onToggleRightSidebar();
              } else {
                toast(`${selectedUser.isGroup ? 'Grand Line Fleet' : selectedUser.fullName} info`, { icon: '📜' });
              }
            }}
          >
            {(goldGrad) => (
              <g>
                <circle cx="23" cy="23" r="8.2" stroke={goldGrad} strokeWidth="1.6" fill="none" />
                <circle cx="23" cy="18.6" r="1.3" fill="#FFF7CA" stroke="#B8860B" strokeWidth="0.4" />
                <path
                  d="M21.6 22 h2.4 v5.2 h1.8"
                  stroke={goldGrad}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <line x1="21" y1="27.2" x2="25.8" y2="27.2" stroke={goldGrad} strokeWidth="1.2" strokeLinecap="round" />
              </g>
            )}
          </HelmControlButton>
        </div>
      </div>

      {/* ── Messages stream (Transparent backdrop to scenic harbor/wallpaper) ── */}
      <div
        ref={messagesContainerRef}
        className="gl-messages-container"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px 12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          zIndex: 1,
        }}
        aria-live="polite"
        aria-label="Messages"
      >
        {messages.map((msg, index) => {
          const isMine = msg.senderId === authUser._id;
          const senderPic = isMine
            ? (authUser?.profilePic || assets.avatar_icon)
            : (msg.senderPic || selectedUser?.profilePic || assets.avatar_icon);

          const isRecipientOnline = selectedUser?.isGroup
            ? selectedUser.members?.some(m => m._id !== authUser?._id && onlineUsers.includes(m._id))
            : onlineUsers.includes(selectedUser?._id);

          const isSeen = Boolean(msg.seen);
          const isDelivered = isSeen || isRecipientOnline;

          return (
            <div
              key={msg._id || index}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                marginBottom: '2px',
              }}
            >
              {/* Avatar (incoming) */}
              {!isMine && (
                <img
                  src={senderPic}
                  alt=""
                  className="gl-avatar-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1.5px solid #D4A72C',
                    flexShrink: 0,
                    marginBottom: '2px',
                  }}
                />
              )}

              {/* Message bubble */}
              <div style={{ maxWidth: 'min(78%, 460px)' }}>
                {/* Sender Name & Captain / Crewmate Badge for Group chat */}
                {selectedUser.isGroup && !isMine && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '3px',
                    paddingLeft: '2px',
                  }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#F2D477' }}>
                      {msg.senderName || 'Crewmate'}
                    </span>
                    {msg.senderRole === 'Captain' ? (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: '#FFE28A',
                        background: 'rgba(212,167,44,0.25)',
                        border: '1px solid #D4A72C',
                        padding: '0 5px',
                        borderRadius: '4px',
                      }}>
                        👑 Captain
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.62rem',
                        color: '#A9A79F',
                        background: 'rgba(255,255,255,0.06)',
                        padding: '0 5px',
                        borderRadius: '4px',
                      }}>
                        ⚓ Crewmate
                      </span>
                    )}
                  </div>
                )}

                {selectedUser.isGroup && isMine && msg.senderRole === 'Captain' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    marginBottom: '3px',
                    paddingRight: '2px',
                  }}>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: '#FFE28A',
                      background: 'rgba(212,167,44,0.25)',
                      border: '1px solid #D4A72C',
                      padding: '0 5px',
                      borderRadius: '4px',
                    }}>
                      👑 Captain (You)
                    </span>
                  </div>
                )}

                {msg.image ? (
                  <div
                    className={`msg-bubble ${isMine ? 'msg-outgoing' : 'msg-incoming'}`}
                    style={{ padding: '6px', flexDirection: 'column', gap: '4px' }}
                  >
                    <span className="msg-corner-tab tl" aria-hidden="true" />
                    <span className="msg-corner-tab tr" aria-hidden="true" />
                    <span className="msg-corner-tab bl" aria-hidden="true" />
                    <span className="msg-corner-tab br" aria-hidden="true" />

                    <img
                      src={msg.image}
                      alt="Shared image"
                      style={{
                        maxWidth: '240px',
                        borderRadius: '6px',
                        border: isMine ? '1.5px solid rgba(212,167,44,0.5)' : '1.5px solid rgba(140,106,26,0.4)',
                        display: 'block',
                      }}
                    />
                    <div className="msg-meta-row" style={{ width: '100%', justifyContent: 'flex-end', padding: '2px 4px 0' }}>
                      <span className="msg-time-label">{formatMessageTime(msg.createdAt)}</span>
                      {isMine && (
                        <span
                          className={`msg-checks-label ${isSeen ? 'seen' : isDelivered ? 'delivered' : 'sent'}`}
                          title={isSeen ? 'Seen' : isDelivered ? 'Delivered' : 'Sent (User Offline)'}
                        >
                          {isDelivered ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`msg-bubble ${isMine ? 'msg-outgoing' : 'msg-incoming'}`}
                    role="article"
                    aria-label={`${isMine ? 'You' : selectedUser.fullName}: ${msg.text}`}
                  >
                    {/* 4 Curled Corner Tabs on Parchment Paper */}
                    <span className="msg-corner-tab tl" aria-hidden="true" />
                    <span className="msg-corner-tab tr" aria-hidden="true" />
                    <span className="msg-corner-tab bl" aria-hidden="true" />
                    <span className="msg-corner-tab br" aria-hidden="true" />

                    <span className="msg-text-content">{msg.text}</span>
                    <span className="msg-meta-row">
                      <span className="msg-time-label">{formatMessageTime(msg.createdAt)}</span>
                      {isMine && (
                        <span
                          className={`msg-checks-label ${isSeen ? 'seen' : isDelivered ? 'delivered' : 'sent'}`}
                          title={isSeen ? 'Seen' : isDelivered ? 'Delivered' : 'Sent (User Offline)'}
                        >
                          {isDelivered ? '✓✓' : '✓'}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Avatar (outgoing) */}
              {isMine && (
                <img
                  src={senderPic}
                  alt=""
                  className="gl-avatar-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1.5px solid #D4A72C',
                    flexShrink: 0,
                    marginBottom: '2px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Message Composer (Floating Aged Parchment Bar) ── */}
      <div className="gl-composer" style={{ position: 'relative', zIndex: 2 }}>
        {/* Gallery Image Attachment */}
        <label htmlFor="chat-image-upload" className="gl-composer-upload-btn" title="Share image">
          <GallerySVG />
        </label>
        <input
          id="chat-image-upload"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          hidden
          onChange={handleSendImage}
          aria-label="Upload image"
        />

        {/* Text input */}
        <input
          id="message-input"
          type="text"
          className="gl-composer-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
          aria-label="Type a message"
        />

        {/* Voice Microphone Icon */}
        <button
          type="button"
          className="gl-composer-mic-btn"
          aria-label="Voice message"
          title="Voice message"
          onClick={() => toast('Voice recording ready', { icon: '🎙️' })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        {/* Circular Crimson Send Button */}
        <button
          id="send-message-btn"
          className="gl-send-btn"
          onClick={handleSendMessage}
          aria-label="Send message"
          title="Send"
        >
          <PaperPlaneSVG />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
