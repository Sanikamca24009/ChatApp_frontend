import React, { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { formatPresence, formatChatTime, formatMessagePreview } from '../lib/utils';
import toast from 'react-hot-toast';

/* ── Straw Hat Jolly Roger SVG Emblem ── */
const StrawHatJollyRogerSVG = ({ size = 38 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))' }}
    aria-hidden="true"
  >
    {/* Crossed Bones */}
    <path d="M16 16 L84 84 M84 16 L16 84" stroke="#FFF7E6" strokeWidth="8" strokeLinecap="round" />
    <circle cx="14" cy="12" r="5" fill="#FFF7E6" />
    <circle cx="12" cy="18" r="5" fill="#FFF7E6" />
    <circle cx="86" cy="12" r="5" fill="#FFF7E6" />
    <circle cx="88" cy="18" r="5" fill="#FFF7E6" />
    <circle cx="14" cy="88" r="5" fill="#FFF7E6" />
    <circle cx="12" cy="82" r="5" fill="#FFF7E6" />
    <circle cx="86" cy="88" r="5" fill="#FFF7E6" />
    <circle cx="88" cy="82" r="5" fill="#FFF7E6" />
    {/* Skull Cranium */}
    <ellipse cx="50" cy="54" rx="22" ry="20" fill="#FFF7E6" />
    <path d="M40 68 L40 76 Q50 78 60 76 L60 68 Z" fill="#FFF7E6" />
    {/* Eye holes */}
    <ellipse cx="42" cy="54" rx="5.5" ry="6.5" fill="#0C1B2C" />
    <ellipse cx="58" cy="54" rx="5.5" ry="6.5" fill="#0C1B2C" />
    {/* Nose hole */}
    <path d="M50 60 L48 64 L52 64 Z" fill="#0C1B2C" />
    {/* Teeth */}
    <line x1="45" y1="70" x2="45" y2="76" stroke="#0C1B2C" strokeWidth="1.5" />
    <line x1="50" y1="70" x2="50" y2="76" stroke="#0C1B2C" strokeWidth="1.5" />
    <line x1="55" y1="70" x2="55" y2="76" stroke="#0C1B2C" strokeWidth="1.5" />
    {/* Straw Hat Crown */}
    <path d="M30 38 Q50 20 70 38 Z" fill="#E5B93F" stroke="#B88B22" strokeWidth="1.5" />
    {/* Red Ribbon */}
    <path d="M31 38 Q50 35 69 38 L68 41 Q50 38 32 41 Z" fill="#C72B32" />
    {/* Straw Hat Brim */}
    <ellipse cx="50" cy="41" rx="34" ry="6" fill="#E5B93F" stroke="#B88B22" strokeWidth="1.5" />
  </svg>
);

/* ── Ship's Steering Wheel / Helm SVG ── */
const ShipHelmSVG = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, opacity: 0.9 }}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="32" stroke="#D4A72C" strokeWidth="3" />
    <circle cx="50" cy="50" r="14" stroke="#D4A72C" strokeWidth="2.5" fill="rgba(212,167,44,0.15)" />
    <circle cx="50" cy="50" r="4" fill="#D4A72C" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 50 50)`}>
        <line x1="50" y1="14" x2="50" y2="36" stroke="#D4A72C" strokeWidth="2.5" />
        <line x1="50" y1="50" x2="50" y2="50" stroke="#D4A72C" strokeWidth="2.5" />
        <line x1="50" y1="18" x2="50" y2="6" stroke="#D4A72C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="5" r="2.5" fill="#D4A72C" />
      </g>
    ))}
  </svg>
);

/* ── Brand Logo Header ── */
const BrandLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img
      src="/icon.png"
      alt="QuickChat Logo"
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        objectFit: 'cover',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.45), 0 0 10px rgba(212, 167, 44, 0.25)',
        border: '1px solid rgba(212, 167, 44, 0.35)',
        flexShrink: 0,
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
      <p className="gl-brand-title">QuickChat</p>
      <p className="gl-brand-sub">GRAND LINE</p>
    </div>
  </div>
);

const Sidebar = () => {
  const {
    getUsers, users, allUsers, getAllUsers, toggleFollowUser,
    crews, createCrew, selectedUser, setSelectedUser,
    unseenMessages, setUnseenMessages, lastMessages, typingUsers,
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser, axios } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('direct'); // 'crews' | 'direct'
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [showCreateCrewModal, setShowCreateCrewModal] = useState(false);
  const [showFindPiratesModal, setShowFindPiratesModal] = useState(false);
  const [pirateSearchQuery, setPirateSearchQuery] = useState('');
  const [crewName, setCrewName] = useState('');
  const [selectedCrewmates, setSelectedCrewmates] = useState([]);
  const [crewEmblem, setCrewEmblem] = useState('🏴‍☠️');
  const [isSubmittingCrew, setIsSubmittingCrew] = useState(false);
  const navigate = useNavigate();

  const handleOpenFindPirates = () => {
    setPirateSearchQuery('');
    getAllUsers();
    setShowFindPiratesModal(true);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const timeA = new Date(lastMessages[a._id]?.createdAt || a.updatedAt || 0).getTime();
    const timeB = new Date(lastMessages[b._id]?.createdAt || b.updatedAt || 0).getTime();
    return timeB - timeA;
  });

  const filteredUsers = input
    ? sortedUsers.filter(u => u.fullName.toLowerCase().includes(input.toLowerCase()))
    : sortedUsers;

  const sortedCrews = [...(crews || [])].sort((a, b) => {
    const timeA = new Date(lastMessages[a._id]?.createdAt || a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(lastMessages[b._id]?.createdAt || b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const filteredCrews = input
    ? sortedCrews.filter(c => c.fullName.toLowerCase().includes(input.toLowerCase()))
    : sortedCrews;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const handleSelectUser = (item) => {
    setSelectedUser(item);
    setUnseenMessages(prev => ({ ...prev, [item._id]: 0 }));
  };

  const handleOpenCreateCrew = () => {
    setCrewName('');
    // By default, select all available users or empty
    setSelectedCrewmates(users.length > 0 ? [users[0]] : []);
    setShowCreateCrewModal(true);
  };

  const toggleCrewmate = (user) => {
    setSelectedCrewmates(prev => {
      const exists = prev.some(u => u._id === user._id);
      if (exists) {
        return prev.filter(u => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleSelectAllCrewmates = () => {
    if (selectedCrewmates.length === users.length) {
      setSelectedCrewmates([]);
    } else {
      setSelectedCrewmates([...users]);
    }
  };

  const handleAssembleCrew = async () => {
    const finalCrewName = crewName.trim() || 'Grand Line Fleet';

    if (selectedCrewmates.length === 0) {
      toast.error('Select at least 1 crewmate to assemble your crew!');
      return;
    }

    setIsSubmittingCrew(true);
    try {
      const captainObj = {
        _id: authUser?._id,
        fullName: authUser?.fullName || 'Captain',
        profilePic: authUser?.profilePic || null,
        role: 'Captain',
      };

      const membersList = [
        captainObj,
        ...selectedCrewmates.map(m => ({
          _id: m._id,
          fullName: m.fullName,
          profilePic: m.profilePic,
          role: 'Crewmate',
        })),
      ];

      await createCrew({
        fullName: finalCrewName,
        name: finalCrewName,
        flag: crewEmblem,
        emblem: crewEmblem,
        captain: captainObj,
        members: membersList,
      });

      setActiveTab('crews');
      toast.success(`Crew "${finalCrewName}" assembled under Captain ${captainObj.fullName}!`, { icon: crewEmblem });
      setShowCreateCrewModal(false);
    } catch (err) {
      console.error('Error assembling crew:', err);
      toast.error('Failed to assemble crew');
    } finally {
      setIsSubmittingCrew(false);
    }
  };

  const userInitial = authUser?.fullName?.trim()?.charAt(0)?.toUpperCase() || '?';
  const displayUserName = authUser?.fullName?.trim() ? authUser.fullName.trim().toUpperCase().split(' ')[0] : 'CAPTAIN';

  return (
    <div className="gl-sidebar">
      {/* ── Top Header Bar ── */}
      <div style={{ padding: '16px 16px 14px', borderBottom: '1.5px solid rgba(212,167,44,0.3)' }}>
        {/* Row 1: Brand Logo & User Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <BrandLogo />

          {/* User profile dropdown button */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              id="profile-menu-btn"
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              className="gl-bottle-ui"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="User Profile Menu"
            >
              {/* Glass Bottle Body */}
              <div className="gl-bottle-glass" style={{ padding: '3px 10px 3px 6px' }}>
                <div className="gl-bottle-glare" />
                <div className="gl-bottle-inner-content" style={{ gap: '8px' }}>
                  {/* Circular Avatar */}
                  <div className="gl-bottle-avatar-slot">
                    {authUser?.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt={authUser.fullName}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '2px solid #D4A72C',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8C1821, #C72B32)',
                        border: '2px solid #D4A72C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#FFF7E6',
                        fontFamily: 'Cinzel, serif',
                      }}>
                        {userInitial}
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#FFF7E6',
                      fontFamily: 'Cinzel, serif',
                      letterSpacing: '0.04em',
                      maxWidth: '70px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {displayUserName}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#D6BD86', fontStyle: 'italic' }}>
                      Captain
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottle Neck & Cork */}
              <div className="gl-bottle-neck-wrapper" aria-hidden="true">
                <div className="gl-bottle-neck" style={{ height: '20px', width: '8px' }}>
                  <div className="gl-bottle-collar" style={{ height: '24px' }} />
                </div>
                <div className="gl-bottle-cork" style={{ height: '16px', width: '11px' }}>
                  <span className="gl-cork-notch" />
                </div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {menuOpen && (
              <div
                className="gl-dropdown"
                style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: '150px', zIndex: 50 }}
                role="menu"
              >
                <button
                  type="button"
                  className="gl-dropdown-item"
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ✦ Edit Profile
                </button>
                <div className="gl-divider" />
                <button
                  type="button"
                  className="gl-dropdown-item danger"
                  role="menuitem"
                  onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ⚓ Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Action Buttons (CREATE CREW & FIND PIRATES) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <button
            id="create-crew-btn"
            className="gl-create-crew"
            onClick={handleOpenCreateCrew}
            style={{ width: '100%', padding: '9px 6px', fontSize: '0.74rem' }}
            aria-label="Create a new crew"
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>+</span>
            <span>CREATE CREW</span>
          </button>
          <button
            id="find-pirates-btn"
            className="gl-find-pirates-btn"
            onClick={handleOpenFindPirates}
            style={{ width: '100%', padding: '9px 6px', fontSize: '0.74rem' }}
            aria-label="Find and follow pirates"
          >
            <span style={{ fontSize: '0.85rem' }}>🔍</span>
            <span>FIND PIRATES</span>
          </button>
        </div>

        {/* Row 3: Search Bar with Steering Helm */}
        <div className="gl-search" role="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="search-conversations"
            type="text"
            placeholder="Search conversations..."
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="Search conversations"
          />
          <ShipHelmSVG size={20} />
        </div>
      </div>

      {/* ── Navigation Tabs: Pirates / Crews ── */}
      <div className="gl-tabs-bar" style={{
        display: 'flex',
        padding: '8px 12px 6px',
        gap: '8px',
        borderBottom: '1px solid rgba(212,167,44,0.2)',
        background: 'rgba(6, 17, 31, 0.4)'
      }}>
        <button
          type="button"
          className={`gl-filter-tab ${activeTab === 'direct' ? 'active' : ''}`}
          onClick={() => setActiveTab('direct')}
        >
          👤 PIRATES ({filteredUsers.length})
        </button>
        <button
          type="button"
          className={`gl-filter-tab ${activeTab === 'crews' ? 'active' : ''}`}
          onClick={() => setActiveTab('crews')}
        >
          🏴‍☠️ CREWS ({filteredCrews.length})
        </button>
      </div>

      {/* ── Conversation List ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
        {/* ── CREWS / GROUPS TAB ── */}
        {activeTab === 'crews' && (
          <div>
            {filteredCrews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏴‍☠️</div>
                <p className="font-cinzel" style={{ color: '#F2D477', fontSize: '0.82rem', margin: 0, fontWeight: 700 }}>
                  NO CREWS ASSEMBLED YET
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.74rem', margin: '4px 0 14px', fontStyle: 'italic' }}>
                  Form a crew to chat with multiple pirates together!
                </p>
                <button
                  type="button"
                  className="gl-create-crew"
                  onClick={handleOpenCreateCrew}
                  style={{ maxWidth: '200px', margin: '0 auto', fontSize: '0.75rem', padding: '8px 14px' }}
                >
                  + ASSEMBLE CREW
                </button>
              </div>
            ) : (
              filteredCrews.map((crew) => {
                const isSelected = selectedUser?._id === crew._id;
                const isCaptainOfCrew = crew.captain?._id === authUser?._id;
                const lastMsg = lastMessages[crew._id];
                const unseen = unseenMessages[crew._id];
                const timeText = lastMsg?.createdAt ? formatChatTime(lastMsg.createdAt) : null;
                const crewTyping = typingUsers[crew._id];
                const isCrewTyping = Boolean(crewTyping && crewTyping.length > 0);
                const previewText = isCrewTyping
                  ? "typing..."
                  : (lastMsg
                      ? formatMessagePreview(lastMsg, authUser?._id, true)
                      : `👑 Captain: ${isCaptainOfCrew ? 'You' : (crew.captain?.fullName || 'Captain')} • ${crew.members?.length || 0} Pirates`);

                return (
                  <div
                    key={crew._id}
                    id={`crew-${crew._id}`}
                    className={`gl-conv-card gl-crew-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectUser(crew)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Crew ${crew.fullName}`}
                    onKeyDown={e => e.key === 'Enter' && handleSelectUser(crew)}
                  >
                    {/* Flag Emblem Badge */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(140,24,33,0.9), rgba(12,27,44,0.9))',
                      border: isSelected ? '2px solid #F2D477' : '1.5px solid rgba(212,167,44,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}>
                      {crew.flag || '🏴‍☠️'}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <p style={{
                          margin: 0, fontSize: '0.92rem', fontWeight: 700,
                          color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          fontFamily: 'Outfit, sans-serif',
                        }}>
                          {crew.fullName}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {timeText && (
                            <span style={{ fontSize: '0.68rem', color: '#8E9EAB', fontWeight: 500 }}>
                              {timeText}
                            </span>
                          )}
                          <span style={{
                            fontSize: '0.62rem',
                            background: 'rgba(212,167,44,0.2)',
                            color: '#F2D477',
                            border: '1px solid rgba(212,167,44,0.4)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                          }}>
                            CREW
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '3px' }}>
                        <p style={{
                          margin: 0, fontSize: '0.74rem',
                          color: isCrewTyping
                            ? 'var(--online)'
                            : (lastMsg ? '#D6BD86' : (isSelected ? '#D6BD86' : '#C9AA72')),
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          fontStyle: (isCrewTyping || !lastMsg) ? 'italic' : 'normal',
                          fontWeight: isCrewTyping ? 600 : 400,
                          flex: 1, minWidth: 0,
                        }}>
                          {previewText}
                        </p>
                        {unseen > 0 && (
                          <div className="unseen-badge" style={{ marginLeft: '4px' }}>
                            {unseen > 99 ? '99+' : unseen}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── DIRECT PIRATES TAB ── */}
        {activeTab === 'direct' && (
          <div>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '34px 14px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🧭</div>
                <p className="font-cinzel" style={{ color: '#F2D477', fontSize: '0.86rem', margin: 0, fontWeight: 700, letterSpacing: '0.08em' }}>
                  {input ? 'NO MATCHING PIRATES' : 'NO MUTUAL CREWMATES YET'}
                </p>
                <p style={{ color: '#A9A79F', fontSize: '0.75rem', margin: '8px 0 16px', lineHeight: 1.45, fontStyle: 'italic' }}>
                  {input
                    ? `No mutual pirates match "${input}".`
                    : 'Pirates only appear here after you follow each other mutually! Explore the fleet registry to find & follow pirates.'}
                </p>
                {!input && (
                  <button
                    type="button"
                    className="gl-find-pirates-btn"
                    onClick={handleOpenFindPirates}
                    style={{ maxWidth: '210px', margin: '0 auto', fontSize: '0.74rem', padding: '8px 14px' }}
                  >
                    🔍 FIND PIRATES
                  </button>
                )}
              </div>
            ) : (
              filteredUsers.map((user, index) => {
                const isSelected = selectedUser?._id === user._id;
                const isOnline = onlineUsers.includes(user._id);
                const unseen = unseenMessages[user._id];
                const lastMsg = lastMessages[user._id];
                const timeText = lastMsg?.createdAt ? formatChatTime(lastMsg.createdAt) : null;
                const userTyping = typingUsers[user._id];
                const isUserTyping = Boolean(userTyping && userTyping.length > 0);
                const previewText = isUserTyping
                  ? "typing..."
                  : (lastMsg
                      ? formatMessagePreview(lastMsg, authUser?._id, false)
                      : formatPresence(isOnline, user.lastSeen));

                return (
                  <div
                    key={user._id || index}
                    id={`conv-${user._id}`}
                    className={`gl-conv-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectUser(user)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Chat with ${user.fullName}`}
                    onKeyDown={e => e.key === 'Enter' && handleSelectUser(user)}
                  >
                    {/* Circular Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={user.profilePic || assets.avatar_icon}
                        alt={user.fullName}
                        className="gl-avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #D4A72C' : '1.5px solid rgba(212,167,44,0.45)',
                        }}
                      />
                      {isOnline && (
                        <span
                          style={{
                            position: 'absolute', bottom: '1px', right: '1px',
                            width: '9px', height: '9px',
                            background: 'var(--online)', borderRadius: '50%',
                            border: '2px solid var(--ocean-darkest)',
                            animation: 'onlinePulse 2.5s ease-in-out infinite',
                          }}
                        />
                      )}
                    </div>

                    {/* Info: Name & Status / Preview */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Top Row: Name + Time */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <p style={{
                          margin: 0, fontSize: '0.92rem', fontWeight: 700,
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          fontFamily: 'Outfit, sans-serif',
                        }}>
                          {user.fullName}
                        </p>
                        {timeText && (
                          <span style={{ fontSize: '0.68rem', color: '#8E9EAB', fontWeight: 500, flexShrink: 0 }}>
                            {timeText}
                          </span>
                        )}
                      </div>

                      {/* Bottom Row: Preview / Presence + Unread Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '3px' }}>
                        <p style={{
                          margin: 0, fontSize: '0.74rem',
                          color: isUserTyping
                            ? 'var(--online)'
                            : (lastMsg
                                ? '#D6BD86'
                                : (isSelected ? '#D6BD86' : (isOnline ? 'var(--online)' : 'var(--text-muted)'))),
                          fontStyle: (isUserTyping || !lastMsg) ? 'italic' : 'normal',
                          fontWeight: isUserTyping ? 600 : 400,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          flex: 1, minWidth: 0,
                        }}>
                          {previewText}
                        </p>
                        {unseen > 0 && (
                          <div className="unseen-badge" style={{ marginLeft: '4px' }}>
                            {unseen > 99 ? '99+' : unseen}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Bottom gold frame highlight line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(212,167,44,0.3), transparent)' }} />

      {/* ── CREATE CREW MODAL ── */}
      {showCreateCrewModal && createPortal(
        <div
          className="gl-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateCrewModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-crew-modal-title"
        >
          <div className="gl-modal-card">
            {/* Modal Header */}
            <div className="gl-modal-header">
              <h3 id="create-crew-modal-title" className="gl-modal-title">
                <StrawHatJollyRogerSVG size={26} />
                <span>ASSEMBLE A CREW</span>
              </h3>
              <button
                type="button"
                className="gl-modal-close"
                onClick={() => setShowCreateCrewModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="gl-modal-body">
              {/* Captain / Creator Display */}
              <div>
                <label className="gl-modal-label">Crew Captain (Admin / Creator)</label>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(140,24,33,0.35) 0%, rgba(8,23,39,0.85) 100%)',
                  border: '1.5px solid #D4A72C',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: 'inset 0 0 12px rgba(212,167,44,0.15)'
                }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={authUser?.profilePic || assets.avatar_icon}
                      alt={authUser?.fullName}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '2px solid #F2D477',
                        objectFit: 'cover'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      fontSize: '1rem',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
                    }}>
                      👑
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: '#F2D477',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: 'rgba(212,167,44,0.2)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(212,167,44,0.4)'
                      }}>
                        👑 CAPTAIN
                      </span>
                    </div>
                    <p style={{
                      margin: '3px 0 0',
                      fontWeight: 700,
                      fontSize: '0.94rem',
                      color: '#FFF7E6',
                      fontFamily: 'Cinzel, serif',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {authUser?.fullName || 'Captain'} (You)
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#D6BD86', fontStyle: 'italic' }}>
                      Fleet Commander & Ship Admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Crew Name Field */}
              <div>
                <label htmlFor="crew-name-input" className="gl-modal-label">
                  Crew Name / Ship
                </label>
                <input
                  id="crew-name-input"
                  type="text"
                  className="gl-modal-input"
                  placeholder="e.g. Straw Hat Pirates"
                  value={crewName}
                  onChange={(e) => setCrewName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Pirate Flag / Emblem Picker */}
              <div>
                <label className="gl-modal-label">Choose Pirate Flag</label>
                <div className="gl-emblem-picker">
                  {['🏴‍☠️', '⚔️', '⚓', '⛵', '🧭', '🔥', '👑', '🪙'].map((emblem) => (
                    <button
                      key={emblem}
                      type="button"
                      className={`gl-emblem-btn ${crewEmblem === emblem ? 'active' : ''}`}
                      onClick={() => setCrewEmblem(emblem)}
                    >
                      {emblem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crewmates Selection (Multi-select for Group Chat) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="gl-modal-label" style={{ margin: 0 }}>
                    Select Crewmates ({selectedCrewmates.length} Selected)
                  </label>
                  {users.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllCrewmates}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#F2D477',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textDecoration: 'underline'
                      }}
                    >
                      {selectedCrewmates.length === users.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>

                {users.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', margin: '4px 0' }}>
                    No other pirates currently available in port.
                  </p>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '190px',
                    overflowY: 'auto',
                    paddingRight: '2px'
                  }}>
                    {users.map((u) => {
                      const isSel = selectedCrewmates.some(c => c._id === u._id);
                      const isOnline = onlineUsers.includes(u._id);
                      return (
                        <div
                          key={u._id}
                          className={`gl-crewmate-card ${isSel ? 'selected' : ''}`}
                          onClick={() => toggleCrewmate(u)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && toggleCrewmate(u)}
                        >
                          <img
                            src={u.profilePic || assets.avatar_icon}
                            alt={u.fullName}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              border: isSel ? '2px solid #F2D477' : '1.5px solid rgba(212,167,44,0.4)',
                              objectFit: 'cover',
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                              {u.fullName}
                            </p>
                            <span style={{ fontSize: '0.7rem', color: isOnline ? 'var(--online)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {formatPresence(isOnline, u.lastSeen)}
                            </span>
                          </div>
                          <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            border: isSel ? '2px solid #F2D477' : '1.5px solid rgba(212,167,44,0.4)',
                            background: isSel ? '#D4A72C' : 'rgba(6, 17, 31, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1A0F05',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            transition: 'all 0.15s ease'
                          }}>
                            {isSel ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="gl-modal-footer">
              <button
                type="button"
                className="gl-modal-cancel-btn"
                onClick={() => setShowCreateCrewModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="gl-modal-submit-btn"
                onClick={handleAssembleCrew}
                disabled={isSubmittingCrew || selectedCrewmates.length === 0}
                style={{
                  opacity: selectedCrewmates.length === 0 ? 0.6 : 1,
                  cursor: selectedCrewmates.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <span>{crewEmblem}</span>
                <span>
                  {isSubmittingCrew
                    ? 'Setting Sail...'
                    : `Assemble & Set Sail (${selectedCrewmates.length + 1} Pirates)`}
                </span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── FIND PIRATES / FLEET REGISTRY MODAL ── */}
      {showFindPiratesModal && createPortal(
        <div
          className="gl-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFindPiratesModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="find-pirates-modal-title"
        >
          <div className="gl-modal-card" style={{ maxWidth: '560px', width: '92vw' }}>
            {/* Modal Header */}
            <div className="gl-modal-header">
              <h3 id="find-pirates-modal-title" className="gl-modal-title">
                <StrawHatJollyRogerSVG size={26} />
                <span>GRAND LINE FLEET REGISTRY</span>
              </h3>
              <button
                type="button"
                className="gl-modal-close"
                onClick={() => setShowFindPiratesModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="gl-modal-body" style={{ gap: '14px', maxHeight: '72vh' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#D6BD86', lineHeight: 1.45 }}>
                Find pirates across the Grand Line by <strong style={{ color: '#F2D477' }}>Username</strong> or <strong style={{ color: '#F2D477' }}>Email</strong>.
                Direct chat unlocks once both pirates follow each other! ⚔️
              </p>

              {/* Real-time Search Box */}
              <div className="gl-search" style={{ margin: 0, background: 'rgba(6, 17, 31, 0.95)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  id="search-pirates-directory"
                  type="text"
                  placeholder="Search by pirate name or email..."
                  value={pirateSearchQuery}
                  onChange={e => setPirateSearchQuery(e.target.value)}
                  autoFocus
                  aria-label="Search pirates by name or email"
                  style={{ width: '100%' }}
                />
                {pirateSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setPirateSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#A9A79F', cursor: 'pointer', padding: '0 4px', fontSize: '0.9rem' }}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Directory List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', overflowX: 'hidden', maxHeight: '46vh', paddingRight: '4px' }}>
                {(() => {
                  const q = pirateSearchQuery.toLowerCase().trim();
                  const results = allUsers.filter(u => {
                    if (!q) return true;
                    const nameMatch = u.fullName?.toLowerCase().includes(q);
                    const emailMatch = u.email?.toLowerCase().includes(q);
                    return nameMatch || emailMatch;
                  });

                  if (allUsers.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '30px 10px', color: '#A9A79F', fontSize: '0.8rem' }}>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>Loading Grand Line Fleet Registry...</p>
                      </div>
                    );
                  }

                  if (results.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '30px 10px', color: '#A9A79F', fontSize: '0.8rem' }}>
                        <p className="font-cinzel" style={{ color: '#F2D477', margin: '0 0 4px', fontWeight: 700 }}>NO PIRATES FOUND</p>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>No pirate matches "{pirateSearchQuery}". Check spelling or try email.</p>
                      </div>
                    );
                  }

                  return results.map((user) => {
                    const isOnline = onlineUsers.includes(user._id);

                    return (
                      <div key={user._id} className="gl-directory-card">
                        {/* Left: Avatar + User Details */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                          {/* Avatar */}
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <img
                              src={user.profilePic || assets.avatar_icon}
                              alt={user.fullName}
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                border: user.isMutual ? '2px solid #2ECC71' : '1.5px solid #D4A72C',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            {isOnline && (
                              <span
                                style={{
                                  position: 'absolute', bottom: '1px', right: '1px',
                                  width: '10px', height: '10px',
                                  background: 'var(--online)', borderRadius: '50%',
                                  border: '2px solid var(--ocean-darkest)',
                                }}
                              />
                            )}
                          </div>

                          {/* User Details */}
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{
                                margin: 0, fontSize: '0.92rem', fontWeight: 700,
                                color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                fontFamily: 'Outfit, sans-serif'
                              }}>
                                {user.fullName}
                              </span>
                              {/* Badges */}
                              {user.isMutual ? (
                                <span className="gl-badge-mutual">⚔️ MUTUAL</span>
                              ) : user.isFollower ? (
                                <span className="gl-badge-follower">⚓ FOLLOWS YOU</span>
                              ) : user.isFollowing ? (
                                <span className="gl-badge-following">⏳ FOLLOWING</span>
                              ) : (
                                <span className="gl-badge-unmet">🌊 UNMET</span>
                              )}
                            </div>

                            {/* Email Address */}
                            <span style={{
                              margin: 0, fontSize: '0.74rem', color: '#D6BD86',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                              <span style={{ opacity: 0.8 }}>✉️</span> {user.email}
                            </span>

                            {user.bio && (
                              <span style={{
                                margin: 0, fontSize: '0.7rem', color: '#A9A79F',
                                fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                              }}>
                                "{user.bio}"
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          {user.isMutual && (
                            <button
                              type="button"
                              className="gl-btn-chat"
                              onClick={() => {
                                handleSelectUser(user);
                                setActiveTab('direct');
                                setShowFindPiratesModal(false);
                              }}
                              title="Start chatting with this mutual pirate"
                            >
                              💬 Chat
                            </button>
                          )}

                          {user.isFollowing ? (
                            <button
                              type="button"
                              className="gl-btn-unfollow"
                              onClick={() => toggleFollowUser(user._id)}
                              title="Unfollow this pirate"
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="gl-btn-follow"
                              onClick={() => toggleFollowUser(user._id)}
                              title={user.isFollower ? "Follow back to unlock mutual chat!" : "Follow pirate"}
                            >
                              {user.isFollower ? '+ Follow Back' : '+ Follow'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="gl-modal-footer">
              <button
                type="button"
                className="gl-modal-cancel-btn"
                onClick={() => setShowFindPiratesModal(false)}
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Sidebar;
