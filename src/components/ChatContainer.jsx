import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime, formatPresence, formatCrewTyping, formatDateSeparator, isDifferentCalendarDay } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { CallContext } from '../../context/CallContext';
import toast from 'react-hot-toast';
import EmojiPicker, { Theme } from 'emoji-picker-react';

/* ── Smiley / Emoji SVG ── */
const SmileySVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" stroke="#2C1810" strokeWidth="2" />
    <circle cx="9" cy="10" r="1.3" fill="#2C1810" />
    <circle cx="15" cy="10" r="1.3" fill="#2C1810" />
    <path d="M8 14.5C9.2 16.5 11 17.5 12 17.5C13 17.5 14.8 16.5 16 14.5" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

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
  const { messages, setMessages, selectedUser, setSelectedUser, sendMessage, getMessages, chatThemes, typingUsers, sendTyping, users, crews, setLastMessages, getUsers, getCrews } = useContext(ChatContext);
  const { authUser, onlineUsers, axios } = useContext(AuthContext);
  const { initiateCall } = useContext(CallContext);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const touchTimerRef = useRef(null);

  // Floating Scroll-To-Bottom State & Unread Counter
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isAtBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages.length);
  const activeChatIdRef = useRef(selectedUser?._id);
  const isInitialLoadRef = useRef(true);

  // Emoji Picker State & Popover Refs
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiBtnRef = useRef(null);

  // Edit & Delete State
  const [editingMsg, setEditingMsg] = useState(null);
  const [deletingMsg, setDeletingMsg] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Forward Modal State
  const [forwardingMsg, setForwardingMsg] = useState(null);
  const [forwardTargets, setForwardTargets] = useState([]);
  const [forwardSearch, setForwardSearch] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [activeReactionPopup, setActiveReactionPopup] = useState(null);

  // Scroll event listener for messages container
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNearBottom = distanceFromBottom <= 100;

    isAtBottomRef.current = isNearBottom;

    if (distanceFromBottom > 300) {
      setShowScrollBottom(true);
    } else if (isNearBottom) {
      setShowScrollBottom(false);
      setUnreadCount(0);
    } else if (unreadCount === 0 && distanceFromBottom <= 250) {
      setShowScrollBottom(false);
    }
  };

  const handleScrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    setUnreadCount(0);
    setShowScrollBottom(false);
    isAtBottomRef.current = true;
  };

  // Insert emoji at cursor position and keep focus in input
  const handleEmojiClick = (emojiData) => {
    if (!emojiData || !emojiData.emoji) return;
    const emoji = emojiData.emoji;

    const inputEl = inputRef.current;
    if (inputEl) {
      const start = inputEl.selectionStart ?? input.length;
      const end = inputEl.selectionEnd ?? input.length;
      const updated = input.substring(0, start) + emoji + input.substring(end);
      setInput(updated);
      sendTyping();

      const nextCursor = start + emoji.length;
      requestAnimationFrame(() => {
        inputEl.focus();
        inputEl.setSelectionRange(nextCursor, nextCursor);
      });
    } else {
      setInput((prev) => prev + emoji);
      sendTyping();
    }
  };

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);


  const activeChatTheme = (selectedUser && chatThemes[selectedUser._id]) || null;

  const handleInputChange = (e) => {
    setInput(e.target.value);
    sendTyping();
  };

  const handleStartEdit = (msg) => {
    setEditingMsg(msg);
    setInput(msg.text || '');
    setReplyingTo(null);
    setActiveMenuMsgId(null);
  };

  const handleCancelEdit = () => {
    setEditingMsg(null);
    setInput('');
  };

  const handleOpenDeleteModal = (msg) => {
    setDeletingMsg(msg);
    setActiveMenuMsgId(null);
  };

  const handleReactToMessage = async (msgId, emoji) => {
    setActiveMenuMsgId(null);
    try {
      const { data } = await axios.post(`/api/messages/react/${msgId}`, { emoji });
      if (data.success) {
        setMessages(prev => prev.map(m => m._id === msgId ? { ...m, reactions: data.reactions } : m));
      } else {
        toast.error(data.message || 'Failed to update reaction');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update reaction');
    }
  };

  useEffect(() => {
    const handleCloseReactionPopup = () => {
      setActiveReactionPopup(null);
    };
    window.addEventListener('click', handleCloseReactionPopup);
    return () => window.removeEventListener('click', handleCloseReactionPopup);
  }, []);

  const handleConfirmDelete = async (deleteType) => {
    if (!deletingMsg || isDeleting) return;
    setIsDeleting(true);
    try {
      const { data } = await axios.post(`/api/messages/delete/${deletingMsg._id}`, { deleteType });
      if (data.success) {
        if (deleteType === 'for_me') {
          setMessages(prev => prev.filter(m => m._id !== deletingMsg._id));
          toast.success('Message deleted for you');
        } else {
          setMessages(prev => prev.map(m => m._id === deletingMsg._id
            ? { ...m, text: 'This message was lost at sea', image: null, isDeletedForAll: true }
            : m
          ));
          toast.success('Message deleted for everyone');
        }
        if (getUsers) getUsers();
        if (getCrews) getCrews();
        setDeletingMsg(null);
      } else {
        toast.error(data.message || 'Failed to delete message');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setShowEmojiPicker(false);

    if (editingMsg) {
      const editText = input.trim();
      try {
        const { data } = await axios.put(`/api/messages/edit/${editingMsg._id}`, { text: editText });
        if (data.success) {
          toast.success('Message edited');
          setMessages(prev => prev.map(m => m._id === editingMsg._id
            ? { ...m, text: editText, editedAt: new Date() }
            : m
          ));
          setEditingMsg(null);
          setInput('');
        } else {
          toast.error(data.message || 'Failed to edit message');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to edit message');
      }
      return;
    }

    const currentReply = replyingTo;
    setReplyingTo(null);
    await sendMessage({ text: input.trim(), replyTo: currentReply?._id });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file');
      return;
    }
    if (editingMsg) setEditingMsg(null);
    const currentReply = replyingTo;
    setReplyingTo(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result, replyTo: currentReply?._id });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleScrollToMessage = (targetId) => {
    if (!targetId) {
      toast('Original message unavailable', { icon: '📜' });
      return;
    }
    const idStr = typeof targetId === 'object' ? targetId._id : targetId;
    const targetEl = document.getElementById(`msg-${idStr}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMsgId(idStr);
      setTimeout(() => {
        setHighlightedMsgId((curr) => (curr === idStr ? null : curr));
      }, 1500);
    } else {
      toast('Original message unavailable', { icon: '📜' });
    }
  };

  const handleCopyMessage = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Message copied!');
    setActiveMenuMsgId(null);
  };

  const handleOpenForwardModal = (msg) => {
    setForwardingMsg(msg);
    setForwardTargets([]);
    setForwardSearch('');
    setActiveMenuMsgId(null);
  };

  const handleToggleTarget = (chat) => {
    const isSelected = forwardTargets.some(t => t.id === chat.id);
    if (isSelected) {
      setForwardTargets(prev => prev.filter(t => t.id !== chat.id));
    } else {
      if (forwardTargets.length >= 5) {
        toast.error('You can select at most 5 chats to forward to');
        return;
      }
      setForwardTargets(prev => [...prev, chat]);
    }
  };

  const handleConfirmForward = async () => {
    if (!forwardingMsg || forwardTargets.length === 0 || isForwarding) return;
    setIsForwarding(true);
    try {
      const { data } = await axios.post('/api/messages/forward', {
        sourceMessageId: forwardingMsg._id,
        targets: forwardTargets.map(t => ({ id: t.id, type: t.type }))
      });

      if (data.success) {
        if (data.skippedTargets && data.skippedTargets.length > 0) {
          if (data.forwardedCount > 0) {
            toast.success(`Forwarded to ${data.forwardedCount} chat${data.forwardedCount > 1 ? 's' : ''}`);
            toast.error(`${data.skippedTargets.length} target${data.skippedTargets.length > 1 ? 's were' : ' was'} skipped`);
          } else {
            toast.error(`Could not forward message. ${data.skippedTargets.length} target(s) skipped.`);
          }
        } else {
          toast.success(`Forwarded to ${data.forwardedCount} chat${data.forwardedCount > 1 ? 's' : ''}`);
        }

        // Live update for current chat and previews
        if (data.messages && Array.isArray(data.messages)) {
          data.messages.forEach(m => {
            const chatId = m.crewId || (m.senderId === authUser?._id ? m.receiverId : m.senderId);
            if (chatId && setLastMessages) {
              setLastMessages(prev => ({ ...prev, [chatId]: m }));
            }
            if (selectedUser && (selectedUser._id === m.crewId || selectedUser._id === m.receiverId)) {
              if (setMessages) {
                setMessages(prev => {
                  if (prev.some(existing => existing._id === m._id)) return prev;
                  return [...prev, m];
                });
              }
            }
          });
        }

        setForwardingMsg(null);
        setForwardTargets([]);
      } else {
        toast.error(data.message || 'Failed to forward message');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to forward message';
      toast.error(errorMsg);
    } finally {
      setIsForwarding(false);
    }
  };

  const forwardableChats = [
    ...(users || []).map(u => ({
      id: u._id,
      name: u.fullName,
      type: 'user',
      pic: u.profilePic || assets.avatar_icon,
      badge: '🏴‍☠️ Pirate',
    })),
    ...(crews || []).map(c => ({
      id: c._id,
      name: c.name,
      type: 'crew',
      pic: c.image || null,
      flag: c.flag || '⛵',
      badge: '⛵ Crew',
    })),
  ];

  const filteredChats = forwardableChats.filter(c =>
    c.name?.toLowerCase().includes(forwardSearch.toLowerCase().trim())
  );

  const handleTouchStart = (msgId) => {
    touchTimerRef.current = setTimeout(() => {
      setActiveMenuMsgId(msgId);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  // Close reply preview, edit mode, forward modal, delete modal, or emoji picker on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showEmojiPicker) {
          setShowEmojiPicker(false);
          inputRef.current?.focus();
        } else if (deletingMsg) {
          setDeletingMsg(null);
        } else if (forwardingMsg) {
          setForwardingMsg(null);
          setForwardTargets([]);
        } else if (editingMsg) {
          handleCancelEdit();
        } else if (replyingTo) {
          setReplyingTo(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEmojiPicker, replyingTo, forwardingMsg, editingMsg, deletingMsg]);

  // Reset reply preview, edit mode, delete modal, forward modal, emoji picker, and scroll state when switching chat
  useEffect(() => {
    setReplyingTo(null);
    setEditingMsg(null);
    setDeletingMsg(null);
    setForwardingMsg(null);
    setForwardTargets([]);
    setActiveMenuMsgId(null);
    setShowEmojiPicker(false);
    setShowScrollBottom(false);
    setUnreadCount(0);
    isAtBottomRef.current = true;
    isInitialLoadRef.current = true;
    activeChatIdRef.current = selectedUser?._id;
    prevMessagesLengthRef.current = 0;
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  // Scroll management: initial load scroll, smooth scroll on send / near bottom, and unread counter while scrolled up
  useEffect(() => {
    if (!selectedUser || !messagesContainerRef.current) return;
    const container = messagesContainerRef.current;

    const isChatSwitch = activeChatIdRef.current !== selectedUser._id;
    if (isChatSwitch) {
      activeChatIdRef.current = selectedUser._id;
      isInitialLoadRef.current = true;
      prevMessagesLengthRef.current = 0;
    }

    const prevLen = prevMessagesLengthRef.current;
    const currLen = messages.length;

    if (isInitialLoadRef.current) {
      if (currLen > 0) {
        requestAnimationFrame(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        });
        isInitialLoadRef.current = false;
        isAtBottomRef.current = true;
        setShowScrollBottom(false);
        setUnreadCount(0);
      }
    } else if (currLen > prevLen) {
      const lastMsg = messages[currLen - 1];
      const isMine = lastMsg?.senderId === authUser?._id;

      if (isMine) {
        // Auto-scroll when the user sends a message
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
        isAtBottomRef.current = true;
        setShowScrollBottom(false);
        setUnreadCount(0);
      } else {
        // Auto-scroll only when user is already near bottom
        if (isAtBottomRef.current) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
          setUnreadCount(0);
        } else {
          // Scrolled up: show badge and do NOT force-scroll
          const newCount = currLen - prevLen;
          setUnreadCount((prev) => prev + newCount);
          setShowScrollBottom(true);
        }
      }
    }

    prevMessagesLengthRef.current = currLen;
  }, [messages, selectedUser, authUser]);


  if (!selectedUser) return <WelcomeState />;

  const isOnline = onlineUsers.includes(selectedUser._id);
  const currentChatTyping = typingUsers[selectedUser._id];
  const isTyping = Boolean(currentChatTyping && currentChatTyping.length > 0);

  const presenceText = selectedUser.isGroup
    ? (isTyping
        ? formatCrewTyping(currentChatTyping)
        : `👑 ${selectedUser.captain?._id === authUser?._id ? 'You' : (selectedUser.captain?.fullName || 'Captain')} • ${selectedUser.members?.length || 0} Pirates`)
    : (isTyping
        ? `${selectedUser.fullName?.trim().split(' ')[0] || 'Pirate'} is sharpening swords...`
        : formatPresence(isOnline, selectedUser.lastSeen));

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
            <div className="gl-contact-text-col" style={{ flex: '1 1 auto', minWidth: 0 }}>
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
              <span
                className="gl-contact-sub"
                title={presenceText}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  width: 'max-content',
                  color: isTyping ? 'var(--online)' : '#D6BD86',
                  fontWeight: isTyping ? 600 : 400,
                }}
              >
                {presenceText}
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
        onScroll={handleScroll}
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
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const showDateSeparator = index === 0 || isDifferentCalendarDay(prevMsg?.createdAt, msg.createdAt);
          const dateLabel = showDateSeparator ? formatDateSeparator(msg.createdAt) : null;
          const senderPic = isMine
            ? (authUser?.profilePic || assets.avatar_icon)
            : (msg.senderPic || selectedUser?.profilePic || assets.avatar_icon);

          const isSeen = selectedUser?.isGroup
            ? Boolean(msg.seen || (msg.seenBy && msg.seenBy.some(id => id.toString() !== authUser?._id?.toString())))
            : (msg.status === 'seen' || Boolean(msg.seen));

          const isDelivered = isSeen || (msg.status === 'delivered');
          const isCrewSystemMsg = Boolean(
            msg.crewId && (
              msg.isSystem ||
              msg.senderRole === 'System' ||
              (msg.text && msg.text.includes("assembled!") && msg.text.includes("Let's set sail!"))
            )
          );

          return (
            <React.Fragment key={msg._id || index}>
              {showDateSeparator && dateLabel && (
                <div className="gl-date-separator">
                  <span className="gl-date-separator-pill">{dateLabel}</span>
                </div>
              )}
              <div
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

              {/* Message bubble wrapper */}
              <div
                className={`msg-wrapper ${isMine ? 'msg-wrapper-outgoing' : 'msg-wrapper-incoming'}`}
                id={`msg-${msg._id}`}
                onTouchStart={() => handleTouchStart(msg._id)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
              >
                {/* Floating Action Menu (Reactions row, Reply, Copy, Forward, Edit, Delete) */}
                {!msg.isDeletedForAll && (
                  <div className={`msg-actions-menu ${activeMenuMsgId === msg._id ? 'active' : ''}`}>
                    {/* Quick Reaction Row */}
                    {!isCrewSystemMsg && (
                      <div className="msg-reaction-quick-row">
                        {['🏴‍☠️', '⚔️', '🍖', '🍊', '🔥', '👍', '😂', '❤️'].map((em) => {
                          const myReaction = (msg.reactions || []).find(r => {
                            const uid = r.userId?._id ? r.userId._id.toString() : (r.userId ? r.userId.toString() : '');
                            return uid === authUser?._id;
                          });
                          const isSelected = myReaction?.emoji === em;
                          return (
                            <button
                              key={em}
                              type="button"
                              className={`msg-reaction-quick-btn ${isSelected ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReactToMessage(msg._id, em);
                              }}
                              title={isSelected ? `Remove ${em}` : `React with ${em}`}
                            >
                              {em}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="msg-actions-btn-group">
                      <button
                        type="button"
                        className="msg-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyingTo(msg);
                          setEditingMsg(null);
                          setActiveMenuMsgId(null);
                        }}
                        title="Reply"
                      >
                        ↩ Reply
                      </button>
                      {Boolean(msg.text) && (
                        <button
                          type="button"
                          className="msg-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyMessage(msg.text);
                          }}
                          title="Copy text"
                        >
                          📋 Copy
                        </button>
                      )}
                      {!isCrewSystemMsg && (
                        <button
                          type="button"
                          className="msg-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenForwardModal(msg);
                          }}
                          title="Forward message"
                        >
                          ↪ Forward
                        </button>
                      )}
                      {isMine && Boolean(msg.text) && !isCrewSystemMsg && (Date.now() - new Date(msg.createdAt).getTime() <= 15 * 60 * 1000) && (
                        <button
                          type="button"
                          className="msg-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(msg);
                          }}
                          title="Edit message"
                        >
                          ✏️ Edit
                        </button>
                      )}
                      <button
                        type="button"
                        className="msg-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteModal(msg);
                        }}
                        title="Delete message"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ width: '100%' }}>
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

                  {/* Forwarded label above bubble */}
                  {msg.isForwarded && !msg.isDeletedForAll && (
                    <div
                      className={`msg-forwarded-label ${isMine ? 'outgoing' : 'incoming'}`}
                      style={{
                        fontSize: '0.68rem',
                        fontStyle: 'italic',
                        color: '#D6BD86',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        marginBottom: '3px',
                        paddingLeft: isMine ? '0' : '4px',
                        paddingRight: isMine ? '4px' : '0',
                        justifyContent: isMine ? 'flex-end' : 'flex-start',
                        userSelect: 'none',
                      }}
                    >
                      <span style={{ fontStyle: 'normal', fontSize: '0.72rem' }}>↪</span> Forwarded
                    </div>
                  )}

                  {msg.isDeletedForAll ? (
                    <div
                      className={`msg-bubble msg-bubble-deleted ${isMine ? 'msg-outgoing' : 'msg-incoming'}`}
                      style={{
                        padding: '8px 12px',
                        fontStyle: 'italic',
                        color: '#BDB9AF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isMine ? 'rgba(18, 38, 60, 0.75)' : 'rgba(10, 24, 40, 0.85)',
                        border: '1px dashed rgba(212, 167, 44, 0.4)',
                        borderRadius: '8px',
                      }}
                    >
                      <span style={{ fontSize: '0.88rem' }} aria-hidden="true">🌊</span>
                      <span style={{ fontSize: '0.83rem', color: '#D6BD86' }}>This message was lost at sea</span>
                      <span className="msg-meta-row" style={{ marginLeft: '4px' }}>
                        <span className="msg-time-label">{formatMessageTime(msg.createdAt)}</span>
                      </span>
                    </div>
                  ) : msg.image ? (
                    <div
                      className={`msg-bubble ${isMine ? 'msg-outgoing' : 'msg-incoming'} ${highlightedMsgId === msg._id ? 'msg-bubble-highlighted' : ''}`}
                      style={{ padding: '6px', flexDirection: 'column', gap: '4px' }}
                    >
                      <span className="msg-corner-tab tl" aria-hidden="true" />
                      <span className="msg-corner-tab tr" aria-hidden="true" />
                      <span className="msg-corner-tab bl" aria-hidden="true" />
                      <span className="msg-corner-tab br" aria-hidden="true" />

                      {/* Quoted Reply Block */}
                      {msg.replyTo && (
                        <div
                          className="msg-quote-box"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScrollToMessage(msg.replyTo);
                          }}
                          role="button"
                          tabIndex={0}
                          title="Click to jump to quoted message"
                        >
                          <span className="msg-quote-sender">
                            {typeof msg.replyTo === 'object' && msg.replyTo.senderName
                              ? (msg.replyTo.senderId === authUser?._id || msg.replyTo.senderId?._id === authUser?._id ? 'You' : msg.replyTo.senderName)
                              : (typeof msg.replyTo === 'object' && msg.replyTo.senderId?.fullName
                                  ? (msg.replyTo.senderId._id === authUser?._id ? 'You' : msg.replyTo.senderId.fullName)
                                  : (typeof msg.replyTo === 'object' && msg.replyTo.senderId === authUser?._id ? 'You' : (selectedUser.isGroup ? 'Pirate' : selectedUser.fullName)))}
                          </span>
                          <span className="msg-quote-text">
                            {typeof msg.replyTo === 'object'
                              ? (msg.replyTo.isDeletedForAll || msg.replyTo.text === 'This message was lost at sea'
                                  ? <em>This message was lost at sea</em>
                                  : (msg.replyTo.text
                                      ? (msg.replyTo.text.length > 55 ? msg.replyTo.text.slice(0, 55) + '...' : msg.replyTo.text)
                                      : (msg.replyTo.image ? '📷 Photo' : 'Original message unavailable')))
                              : 'Original message unavailable'}
                          </span>
                        </div>
                      )}

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
                        <span className="msg-time-label">
                          {formatMessageTime(msg.createdAt)}
                          {msg.editedAt && (
                            <span className="msg-edited-tag" title={`Edited ${formatMessageTime(msg.editedAt)}`}> edited</span>
                          )}
                        </span>
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
                      className={`msg-bubble ${isMine ? 'msg-outgoing' : 'msg-incoming'} ${highlightedMsgId === msg._id ? 'msg-bubble-highlighted' : ''}`}
                      role="article"
                      aria-label={`${isMine ? 'You' : selectedUser.fullName}: ${msg.text}`}
                    >
                      {/* 4 Curled Corner Tabs on Parchment Paper */}
                      <span className="msg-corner-tab tl" aria-hidden="true" />
                      <span className="msg-corner-tab tr" aria-hidden="true" />
                      <span className="msg-corner-tab bl" aria-hidden="true" />
                      <span className="msg-corner-tab br" aria-hidden="true" />

                      {/* Quoted Reply Block */}
                      {msg.replyTo && (
                        <div
                          className="msg-quote-box"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScrollToMessage(msg.replyTo);
                          }}
                          role="button"
                          tabIndex={0}
                          title="Click to jump to quoted message"
                        >
                          <span className="msg-quote-sender">
                            {typeof msg.replyTo === 'object' && msg.replyTo.senderName
                              ? (msg.replyTo.senderId === authUser?._id || msg.replyTo.senderId?._id === authUser?._id ? 'You' : msg.replyTo.senderName)
                              : (typeof msg.replyTo === 'object' && msg.replyTo.senderId?.fullName
                                  ? (msg.replyTo.senderId._id === authUser?._id ? 'You' : msg.replyTo.senderId.fullName)
                                  : (typeof msg.replyTo === 'object' && msg.replyTo.senderId === authUser?._id ? 'You' : (selectedUser.isGroup ? 'Pirate' : selectedUser.fullName)))}
                          </span>
                          <span className="msg-quote-text">
                            {typeof msg.replyTo === 'object'
                              ? (msg.replyTo.isDeletedForAll || msg.replyTo.text === 'This message was lost at sea'
                                  ? <em>This message was lost at sea</em>
                                  : (msg.replyTo.text
                                      ? (msg.replyTo.text.length > 55 ? msg.replyTo.text.slice(0, 55) + '...' : msg.replyTo.text)
                                      : (msg.replyTo.image ? '📷 Photo' : 'Original message unavailable')))
                              : 'Original message unavailable'}
                          </span>
                        </div>
                      )}

                      <span className="msg-text-content">{msg.text}</span>
                      <span className="msg-meta-row">
                        <span className="msg-time-label">
                          {formatMessageTime(msg.createdAt)}
                          {msg.editedAt && (
                            <span className="msg-edited-tag" title={`Edited ${formatMessageTime(msg.editedAt)}`}> edited</span>
                          )}
                        </span>
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

                  {/* Reaction Chips Row under the bubble */}
                  {!msg.isDeletedForAll && Boolean(msg.reactions && msg.reactions.length > 0) && (() => {
                    const reactionGroups = (msg.reactions || []).reduce((acc, r) => {
                      if (!acc[r.emoji]) {
                        acc[r.emoji] = {
                          emoji: r.emoji,
                          count: 0,
                          users: [],
                          hasReacted: false,
                        };
                      }
                      acc[r.emoji].count += 1;
                      const uid = r.userId?._id ? r.userId._id.toString() : (r.userId ? r.userId.toString() : '');
                      const isMe = uid === authUser?._id;
                      const userName = isMe ? 'You' : (r.userId?.fullName || 'Pirate');
                      acc[r.emoji].users.push(userName);
                      if (isMe) acc[r.emoji].hasReacted = true;
                      return acc;
                    }, {});

                    const groups = Object.values(reactionGroups);
                    if (groups.length === 0) return null;

                    return (
                      <div
                        className={`gl-reaction-chips-row ${isMine ? 'outgoing' : 'incoming'}`}
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                          marginTop: '3px',
                          justifyContent: isMine ? 'flex-end' : 'flex-start',
                          position: 'relative'
                        }}
                      >
                        {groups.map((group) => {
                          const isPopupOpen = activeReactionPopup?.msgId === msg._id && activeReactionPopup?.emoji === group.emoji;
                          return (
                            <div key={group.emoji} style={{ position: 'relative' }}>
                              <button
                                type="button"
                                className={`gl-reaction-chip ${group.hasReacted ? 'gl-reaction-mine' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReactToMessage(msg._id, group.emoji);
                                }}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveReactionPopup(isPopupOpen ? null : { msgId: msg._id, emoji: group.emoji, users: group.users });
                                }}
                                title={`Reacted by: ${group.users.join(', ')} (Right-click to see pirates)`}
                                aria-label={`${group.emoji} ${group.count} reactions`}
                              >
                                <span className="gl-reaction-emoji">{group.emoji}</span>
                                <span className="gl-reaction-count">{group.count}</span>
                              </button>

                              {/* Themed Popup Plaque listing who reacted */}
                              {isPopupOpen && (
                                <div
                                  className="gl-reaction-popup"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="gl-reaction-popup-header">
                                    <span>{group.emoji} {group.count}</span>
                                    <button
                                      type="button"
                                      className="gl-reaction-popup-close"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveReactionPopup(null);
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <div className="gl-reaction-popup-list">
                                    {group.users.map((uname, idx) => (
                                      <div key={idx} className="gl-reaction-popup-user">
                                        <span className="gl-reaction-user-bullet">⚔️</span>
                                        <span>{uname}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
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
          </React.Fragment>
          );
        })}
      </div>

      {/* ── Floating Scroll-To-Bottom Button ── */}
      <div style={{ position: 'relative', width: '100%', height: 0, zIndex: 12 }}>
        {showScrollBottom && (
          <div className="gl-scroll-bottom-container">
            <button
              id="scroll-to-bottom-btn"
              type="button"
              className="gl-scroll-bottom-btn"
              onClick={handleScrollToBottom}
              aria-label="Scroll to bottom"
              title="Scroll to bottom"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
                <line x1="12" y1="5" x2="12" y2="15" />
              </svg>
              {unreadCount > 0 && (
                <span className="gl-scroll-unread-badge" aria-label={`${unreadCount} unread messages`}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Reply Preview Bar (above Composer) ── */}
      {replyingTo && (
        <div className="gl-reply-preview-bar">
          <div className="gl-reply-preview-left">
            <div className="gl-reply-preview-indicator" />
            <div className="gl-reply-preview-content">
              <span className="gl-reply-preview-author">
                Replying to {replyingTo.senderId === authUser?._id || replyingTo.senderId?._id === authUser?._id
                  ? 'Yourself'
                  : (replyingTo.senderName || selectedUser.fullName)}
              </span>
              <span className="gl-reply-preview-snippet">
                {replyingTo.text
                  ? (replyingTo.text.length > 60 ? replyingTo.text.slice(0, 60) + '...' : replyingTo.text)
                  : (replyingTo.image ? '📷 Photo' : '')}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="gl-reply-preview-close"
            onClick={() => setReplyingTo(null)}
            aria-label="Cancel reply (Esc)"
            title="Cancel reply (Esc)"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Edit Preview Bar (above Composer) ── */}
      {editingMsg && (
        <div className="gl-edit-preview-bar">
          <div className="gl-edit-preview-left">
            <span className="gl-edit-preview-icon" aria-hidden="true">✏️</span>
            <div className="gl-edit-preview-content">
              <span className="gl-edit-preview-title">Editing message</span>
              <span className="gl-edit-preview-snippet">
                {editingMsg.text
                  ? (editingMsg.text.length > 60 ? editingMsg.text.slice(0, 60) + '...' : editingMsg.text)
                  : (editingMsg.image ? '📷 Caption' : '')}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="gl-edit-preview-close"
            onClick={handleCancelEdit}
            aria-label="Cancel edit (Esc)"
            title="Cancel edit (Esc)"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Message Composer (Floating Aged Parchment Bar) ── */}
      <div className="gl-composer" style={{ position: 'relative', zIndex: 10 }}>
        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="gl-emoji-picker-popover"
            onClick={(e) => e.stopPropagation()}
          >
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={handleEmojiClick}
              lazyLoadEmojis={true}
              searchPlaceHolder="Search pirate emojis..."
              width={320}
              height={390}
            />
          </div>
        )}

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

        {/* Smiley / Emoji Button */}
        <button
          ref={emojiBtnRef}
          id="chat-emoji-btn"
          type="button"
          className={`gl-composer-emoji-btn ${showEmojiPicker ? 'active' : ''}`}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          aria-label="Choose emoji"
          title="Choose emoji"
        >
          <SmileySVG />
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          id="message-input"
          type="text"
          className="gl-composer-input"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
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

      {/* ── One Piece Themed Forward Message Modal ── */}
      {forwardingMsg && (
        <div
          className="gl-forward-modal-overlay"
          onClick={() => {
            if (!isForwarding) {
              setForwardingMsg(null);
              setForwardTargets([]);
            }
          }}
        >
          <div
            className="gl-forward-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gl-forward-modal-title"
          >
            {/* Header Plaque */}
            <div className="gl-forward-header">
              <div className="gl-forward-title-wrap">
                <span className="gl-forward-icon" aria-hidden="true">↪</span>
                <h3 id="gl-forward-modal-title" className="gl-forward-title">
                  Forward Message
                </h3>
              </div>
              <button
                type="button"
                className="gl-forward-close-btn"
                onClick={() => {
                  if (!isForwarding) {
                    setForwardingMsg(null);
                    setForwardTargets([]);
                  }
                }}
                aria-label="Close forward modal"
                disabled={isForwarding}
              >
                ✕
              </button>
            </div>

            {/* Message Snippet Preview */}
            <div className="gl-forward-preview-box">
              <span className="gl-forward-preview-label">Message:</span>
              <span className="gl-forward-preview-text">
                {forwardingMsg.text
                  ? (forwardingMsg.text.length > 70 ? forwardingMsg.text.slice(0, 70) + '...' : forwardingMsg.text)
                  : (forwardingMsg.image ? '📷 Photo' : 'Message')}
              </span>
            </div>

            {/* Search Box */}
            <div className="gl-forward-search-wrapper">
              <svg className="gl-forward-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D4A72C" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="gl-forward-search-input"
                placeholder="Search pirates and crews..."
                value={forwardSearch}
                onChange={(e) => setForwardSearch(e.target.value)}
                disabled={isForwarding}
                autoFocus
              />
              {forwardSearch && (
                <button
                  type="button"
                  className="gl-forward-search-clear"
                  onClick={() => setForwardSearch('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Chats List (Pirates and Crews) */}
            <div className="gl-forward-list" role="listbox">
              {filteredChats.length === 0 ? (
                <div className="gl-forward-empty">
                  No matching chats found
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isSelected = forwardTargets.some(t => t.id === chat.id);
                  return (
                    <div
                      key={chat.id}
                      className={`gl-forward-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleTarget(chat)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="gl-forward-item-avatar-wrap">
                        {chat.type === 'crew' ? (
                          chat.pic ? (
                            <img src={chat.pic} alt="" className="gl-forward-avatar" />
                          ) : (
                            <div className="gl-forward-avatar-placeholder">
                              {chat.flag || '⛵'}
                            </div>
                          )
                        ) : (
                          <img src={chat.pic} alt="" className="gl-forward-avatar" />
                        )}
                      </div>

                      <div className="gl-forward-item-info">
                        <div className="gl-forward-item-name">{chat.name}</div>
                        <div className="gl-forward-item-type">{chat.badge}</div>
                      </div>

                      <div className="gl-forward-checkbox-wrap">
                        <div className={`gl-forward-custom-check ${isSelected ? 'checked' : ''}`}>
                          {isSelected ? '✓' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="gl-forward-footer">
              <span className="gl-forward-count-label">
                {forwardTargets.length}/5 selected
              </span>
              <div className="gl-forward-btn-group">
                <button
                  type="button"
                  className="gl-forward-cancel-btn"
                  onClick={() => {
                    if (!isForwarding) {
                      setForwardingMsg(null);
                      setForwardTargets([]);
                    }
                  }}
                  disabled={isForwarding}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-forward-btn"
                  className="gl-forward-confirm-btn"
                  onClick={handleConfirmForward}
                  disabled={forwardTargets.length === 0 || isForwarding}
                >
                  {isForwarding ? 'Forwarding...' : (forwardTargets.length > 0 ? `Forward to ${forwardTargets.length}` : 'Forward (0)')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── One Piece Themed Delete Confirmation Modal ── */}
      {deletingMsg && (() => {
        const isSender = deletingMsg.senderId === authUser?._id || deletingMsg.senderId?._id === authUser?._id;
        const isSystemMsg = deletingMsg.isSystem || deletingMsg.senderRole === 'System';
        const msgAgeHours = (Date.now() - new Date(deletingMsg.createdAt).getTime()) / (1000 * 60 * 60);
        const isWithin1Hour = msgAgeHours <= 1;
        const isCaptain = selectedUser?.isGroup && (
          selectedUser?.captain?._id === authUser?._id ||
          selectedUser?.captain === authUser?._id ||
          selectedUser?.members?.some(m => (m._id === authUser?._id || m.user === authUser?._id) && m.role === 'Captain')
        );
        const canDeleteForEveryone = !isSystemMsg && ((isSender && isWithin1Hour) || (selectedUser?.isGroup && isCaptain));

        return (
          <div
            className="gl-delete-modal-overlay"
            onClick={() => {
              if (!isDeleting) setDeletingMsg(null);
            }}
          >
            <div
              className="gl-delete-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gl-delete-modal-title"
            >
              <div className="gl-delete-modal-header">
                <div className="gl-delete-title-wrap">
                  <span className="gl-delete-modal-skull" aria-hidden="true">☠️</span>
                  <h3 id="gl-delete-modal-title" className="gl-delete-modal-title">
                    Delete Message?
                  </h3>
                </div>
                <button
                  type="button"
                  className="gl-delete-modal-close"
                  onClick={() => {
                    if (!isDeleting) setDeletingMsg(null);
                  }}
                  disabled={isDeleting}
                  aria-label="Close delete modal"
                >
                  ✕
                </button>
              </div>

              <p className="gl-delete-modal-desc">
                Choose whether to cast this message into the sea only for yourself or for everyone aboard.
              </p>

              <div className="gl-delete-modal-preview">
                <span className="gl-delete-preview-snippet">
                  {deletingMsg.text
                    ? (deletingMsg.text.length > 70 ? deletingMsg.text.slice(0, 70) + '...' : deletingMsg.text)
                    : (deletingMsg.image ? '📷 Photo' : 'Message')}
                </span>
              </div>

              <div className="gl-delete-modal-actions">
                {canDeleteForEveryone && (
                  <button
                    type="button"
                    id="delete-for-everyone-btn"
                    className="gl-delete-btn gl-delete-everyone-btn"
                    onClick={() => handleConfirmDelete('for_everyone')}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete for Everyone'}
                  </button>
                )}
                <button
                  type="button"
                  id="delete-for-me-btn"
                  className="gl-delete-btn gl-delete-me-btn"
                  onClick={() => handleConfirmDelete('for_me')}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete for Me'}
                </button>
                <button
                  type="button"
                  className="gl-delete-btn gl-delete-cancel-btn"
                  onClick={() => {
                    if (!isDeleting) setDeletingMsg(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ChatContainer;
