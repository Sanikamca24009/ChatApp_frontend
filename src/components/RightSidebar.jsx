import React, { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import assets from '../assets/assets';
import { formatPresence } from '../lib/utils';
import { ChatContext, PRESET_THEMES } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { CallContext } from '../../context/CallContext';
import toast from 'react-hot-toast';

/* ── Brass Rivet for Parchment Corners ── */
const BrassRivet = ({ style }) => (
  <div style={{
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 35%, #F2D477, #B88B22 60%, #5B3F0E 100%)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.5)',
    border: '1px solid #7A5515',
    zIndex: 5,
    pointerEvents: 'none',
    ...style,
  }}>
    <div style={{
      position: 'absolute',
      top: '4px',
      left: '2px',
      right: '2px',
      height: '1px',
      background: '#3A2005',
    }} />
  </div>
);

const RightSidebar = ({ onClose }) => {
  const { selectedUser, messages, chatThemes, setChatTheme } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const { initiateCall } = useContext(CallContext);
  const [msgImages, setMsgImages] = useState([]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themeSearch, setThemeSearch] = useState('');

  useEffect(() => {
    setMsgImages(messages.filter(m => m.image).map(m => m.image));
  }, [messages]);

  const activeTheme = selectedUser ? PRESET_THEMES.find(t => t.url === chatThemes[selectedUser._id]) : null;

  const filteredThemes = PRESET_THEMES.filter(t => {
    if (!themeSearch.trim()) return true;
    return t.name.toLowerCase().includes(themeSearch.toLowerCase().trim());
  });

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div
      className="gl-right-panel"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
    >
      {/* 4 Corner Brass Rivets */}
      <BrassRivet style={{ top: '8px', left: '8px' }} />
      <BrassRivet style={{ top: '8px', right: '8px' }} />
      <BrassRivet style={{ bottom: '8px', left: '8px' }} />
      <BrassRivet style={{ bottom: '8px', right: '8px' }} />

      {/* ── Contact or Crew Info Title ── */}
      <div style={{
        padding: '8px 16px 12px',
        borderBottom: '1.5px solid rgba(140,106,26,0.35)',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p className="font-cinzel" style={{
          margin: 0,
          fontWeight: 700,
          fontSize: '0.88rem',
          letterSpacing: '0.15em',
          color: '#201408',
          textTransform: 'uppercase',
        }}>
          {selectedUser.isGroup ? 'Crew Info' : 'Contact Info'}
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#8C5824',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 700,
              padding: '4px 6px',
              lineHeight: 1,
              borderRadius: '4px',
            }}
            title="Close Contact Info"
            aria-label="Close Contact Info"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Avatar & Name ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '18px 16px 14px', gap: '8px',
        borderBottom: '1.5px solid rgba(140,106,26,0.25)',
      }}>
        {selectedUser.isGroup ? (
          /* Crew Flag Avatar */
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            border: '3px solid #8C6A1A',
            background: 'linear-gradient(135deg, rgba(140,24,33,0.9), rgba(12,27,44,0.95))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}>
            {selectedUser.flag || '🏴‍☠️'}
          </div>
        ) : (
          /* Avatar with gold ring */
          <div style={{ position: 'relative' }}>
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="gl-avatar-lg"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                border: '3px solid #8C6A1A',
                objectFit: 'cover',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
            />
            {isOnline && (
              <span style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '12px', height: '12px',
                background: 'var(--online)', borderRadius: '50%',
                border: '2px solid #D6BD86',
                animation: 'onlinePulse 2.5s ease-in-out infinite',
              }} />
            )}
          </div>
        )}

        {/* Name */}
        <h3
          className="font-cinzel"
          style={{
            margin: 0, fontSize: '1.05rem', fontWeight: 700,
            color: '#201408', textAlign: 'center', letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {selectedUser.fullName}
        </h3>

        {/* Status */}
        <p style={{
          margin: 0, fontSize: '0.76rem',
          color: '#66503A',
          fontStyle: 'italic',
        }}>
          {selectedUser.isGroup
            ? `Pirate Fleet • ${selectedUser.members?.length || 0} Members`
            : formatPresence(isOnline, selectedUser.lastSeen)}
        </p>

        {/* Captain banner / Bio */}
        {selectedUser.isGroup ? (
          <div style={{
            width: '100%',
            background: 'rgba(140, 106, 26, 0.15)',
            border: '1px solid rgba(140, 106, 26, 0.4)',
            borderRadius: '8px',
            padding: '8px 10px',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '1.2rem' }}>👑</span>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: '#664510', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CREW CAPTAIN
              </p>
              <p style={{ margin: '1px 0 0', fontSize: '0.82rem', fontWeight: 700, color: '#201408' }}>
                {selectedUser.captain?.fullName || 'Captain'}
              </p>
            </div>
          </div>
        ) : (
          <p
            className="font-crimson"
            style={{
              margin: 0, fontSize: '0.88rem', fontStyle: 'italic',
              color: '#4A3724', textAlign: 'center',
              padding: '0 8px', lineHeight: 1.4,
              maxWidth: '220px',
            }}
          >
            "{selectedUser.bio || selectedUser.fullName}"
          </p>
        )}

        {/* Emerald Green Audio / Video call buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button
            className="gl-btn-green"
            id="contact-audio-call-btn"
            aria-label="Audio call"
            onClick={() => initiateCall(selectedUser, 'audio')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Audio
          </button>
          <button
            className="gl-btn-green"
            id="contact-video-call-btn"
            aria-label="Video call"
            onClick={() => initiateCall(selectedUser, 'video')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Video
          </button>
        </div>
      </div>

      {/* ── Chat Theme Control (Opens full Theme Gallery Modal) ── */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1.5px solid rgba(140,106,26,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p className="font-cinzel" style={{
            margin: 0, fontWeight: 700, fontSize: '0.78rem',
            letterSpacing: '0.1em', color: '#201408', textTransform: 'uppercase',
          }}>
            🎨 Chat Theme
          </p>
          <span style={{ fontSize: '0.66rem', color: '#66503A', fontStyle: 'italic' }}>
            {activeTheme ? 'Custom Active' : 'Default Navy'}
          </span>
        </div>

        {activeTheme ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Active theme banner */}
            <div
              onClick={() => setShowThemeModal(true)}
              role="button"
              tabIndex={0}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1.5px solid #8C1821',
                position: 'relative',
                height: '62px',
                backgroundImage: `url('${activeTheme.preview}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '6px 8px',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,17,31,0.1) 0%, rgba(6,17,31,0.85) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.74rem', fontWeight: 700, color: '#FFF7E6',
                  fontFamily: 'Cinzel, serif', textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px'
                }}>
                  ✓ {activeTheme.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#F2D477', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  Change ➜
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setShowThemeModal(true)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: 'linear-gradient(135deg, #16537E 0%, #0F3854 100%)',
                  border: '1px solid #D4A72C',
                  borderRadius: '6px',
                  color: '#F2D477',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                Browse Themes
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatTheme(selectedUser._id, null);
                  toast.success('Reset to default wallpaper');
                }}
                style={{
                  padding: '6px 8px',
                  background: 'rgba(140, 24, 33, 0.15)',
                  border: '1px solid rgba(199, 43, 50, 0.4)',
                  borderRadius: '6px',
                  color: '#8C1821',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Reset to default background"
              >
                ✕ Reset
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowThemeModal(true)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'linear-gradient(135deg, rgba(140,24,33,0.12) 0%, rgba(20,52,88,0.2) 100%)',
              border: '1.5px dashed rgba(140,106,26,0.6)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#201408',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >
            <span>🖼️</span>
            <span>Choose Wallpaper ({PRESET_THEMES.length} Themes)</span>
          </button>
        )}
      </div>

      {/* ── Crew Members Roster (if Group) ── */}
      {selectedUser.isGroup && (
        <div style={{ padding: '12px 14px', borderBottom: '1.5px solid rgba(140,106,26,0.25)', maxHeight: '180px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p className="font-cinzel" style={{
              margin: 0, fontWeight: 700, fontSize: '0.78rem',
              letterSpacing: '0.1em', color: '#201408', textTransform: 'uppercase',
            }}>
              Crew Roster ({selectedUser.members?.length || 0})
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedUser.members?.map((member, idx) => {
              const isCap = member._id === selectedUser.captain?._id;
              const isMemOnline = onlineUsers.includes(member._id);
              return (
                <div
                  key={member._id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={member.profilePic || assets.avatar_icon}
                      alt={member.fullName}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: isCap ? '1.5px solid #8C6A1A' : '1px solid rgba(140,106,26,0.4)',
                        objectFit: 'cover',
                      }}
                    />
                    {isMemOnline && (
                      <span style={{
                        position: 'absolute', bottom: '-1px', right: '-1px',
                        width: '7px', height: '7px',
                        background: 'var(--online)', borderRadius: '50%',
                        border: '1.5px solid #D6BD86',
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#201408',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {member.fullName}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: isCap ? '#8C6A1A' : 'rgba(140,106,26,0.15)',
                    color: isCap ? '#FFF7E6' : '#5A3D12',
                  }}>
                    {isCap ? '👑 Captain' : '⚓ Crewmate'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Shared Media ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p className="font-cinzel" style={{
            margin: 0, fontWeight: 700, fontSize: '0.78rem',
            letterSpacing: '0.1em', color: '#201408', textTransform: 'uppercase',
          }}>
            Shared Media
          </p>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#201408' }}>
            {msgImages.length}
          </span>
        </div>

        {msgImages.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '24px 12px',
            background: 'rgba(8, 20, 32, 0.95)',
            border: '1.5px solid rgba(184, 139, 34, 0.5)',
            borderRadius: '8px',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
          }}>
            <p style={{ color: '#A9A79F', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>
              No photos shared yet
            </p>
          </div>
        ) : (
          <div className="gl-media-grid">
            {msgImages.map((url, i) => (
              <div
                key={i}
                className="gl-media-item"
                onClick={() => window.open(url)}
                role="button"
                tabIndex={0}
                aria-label={`Shared image ${i + 1}`}
                onKeyDown={e => e.key === 'Enter' && window.open(url)}
              >
                <img src={url} alt={`Shared ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Logout button ── */}
      <div style={{ padding: '12px 14px 14px' }}>
        <button
          id="right-sidebar-logout-btn"
          className="gl-btn-logout"
          onClick={() => logout()}
          aria-label="Logout"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>LOGOUT</span>
        </button>
      </div>

      {/* ── CHAT THEME GALLERY MODAL ── */}
      {showThemeModal && createPortal(
        <div
          className="gl-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowThemeModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-theme-modal-title"
        >
          <div className="gl-modal-card" style={{ maxWidth: '820px', width: '94vw', maxHeight: '88vh' }}>
            {/* Modal Header */}
            <div className="gl-modal-header">
              <div>
                <h3 id="chat-theme-modal-title" className="gl-modal-title" style={{ fontSize: '1.08rem' }}>
                  <span>🎨</span>
                  <span>GRAND LINE CHAT WALLPAPERS</span>
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#D6BD86' }}>
                  Select a wallpaper for your chat with <strong style={{ color: '#F2D477' }}>{selectedUser.fullName}</strong> ({PRESET_THEMES.length} exclusive designs)
                </p>
              </div>
              <button
                type="button"
                className="gl-modal-close"
                onClick={() => setShowThemeModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="gl-modal-body" style={{ gap: '14px', maxHeight: '72vh' }}>
              {/* Search filter for wallpapers */}
              <div className="gl-search" style={{ margin: 0, background: 'rgba(6, 17, 31, 0.95)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Filter wallpapers by name (e.g., Chopper, Nami, Voyage)..."
                  value={themeSearch}
                  onChange={e => setThemeSearch(e.target.value)}
                  style={{ width: '100%' }}
                />
                {themeSearch && (
                  <button
                    type="button"
                    onClick={() => setThemeSearch('')}
                    style={{ background: 'none', border: 'none', color: '#A9A79F', cursor: 'pointer', padding: '0 4px', fontSize: '0.9rem' }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Wallpaper Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
                gap: '12px',
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: '48vh',
                paddingRight: '4px',
                paddingBottom: '4px',
              }}>
                {filteredThemes.map((theme) => {
                  const isSelected = chatThemes[selectedUser._id] === theme.url;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setChatTheme(selectedUser._id, theme.url);
                        toast.success(`Wallpaper set: ${theme.name}`);
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: isSelected ? '2.5px solid #2ECC71' : '1.5px solid rgba(212,167,44,0.3)',
                        boxShadow: isSelected ? '0 0 14px rgba(46,204,113,0.5), 0 4px 12px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.4)',
                        transition: 'all 0.2s ease',
                        background: 'rgba(8, 22, 36, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#F2D477';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(212,167,44,0.3)';
                          e.currentTarget.style.transform = 'none';
                        }
                      }}
                    >
                      {/* Image Preview */}
                      <div style={{
                        height: '110px',
                        backgroundImage: `url('${theme.preview}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        backgroundColor: '#06111F',
                      }}>
                        {/* Selected Indicator Badge */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: '#2ECC71',
                            color: '#06111F',
                            borderRadius: '999px',
                            padding: '2px 8px',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                          }}>
                            ✓ APPLIED
                          </div>
                        )}
                      </div>

                      {/* Title & Action */}
                      <div style={{
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isSelected ? 'rgba(46,204,113,0.12)' : 'rgba(6,17,31,0.7)',
                        borderTop: isSelected ? '1px solid rgba(46,204,113,0.3)' : '1px solid rgba(212,167,44,0.15)',
                      }}>
                        <p style={{
                          margin: 0,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: isSelected ? '#2ECC71' : '#FFF7E6',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Outfit, sans-serif',
                          flex: 1,
                        }}>
                          {theme.name}
                        </p>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: isSelected ? '#2ECC71' : '#D4A72C',
                          marginLeft: '6px',
                          flexShrink: 0,
                        }}>
                          {isSelected ? 'Active' : 'Apply'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="gl-modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {chatThemes[selectedUser._id] ? (
                <button
                  type="button"
                  onClick={() => {
                    setChatTheme(selectedUser._id, null);
                    toast.success('Reset to default navy wallpaper');
                  }}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(140, 24, 33, 0.25)',
                    border: '1px solid rgba(199, 43, 50, 0.6)',
                    color: '#FF6B6B',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 700,
                  }}
                >
                  ✕ Reset to Default
                </button>
              ) : <div />}

              <button
                type="button"
                className="gl-modal-cancel-btn"
                onClick={() => setShowThemeModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RightSidebar;