import React, { useContext, useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../../context/ChatContext';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('gl_sidebar_width');
      return saved ? Math.max(220, Math.min(380, parseInt(saved, 10))) : 270;
    } catch {
      return 270;
    }
  });

  const [rightPanelWidth, setRightPanelWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('gl_right_width');
      return saved ? Math.max(220, Math.min(360, parseInt(saved, 10))) : 260;
    } catch {
      return 260;
    }
  });

  const [showRightSidebar, setShowRightSidebar] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1180;
    }
    return true;
  });

  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const containerRef = useRef(null);

  // Drag handler for left sidebar divider
  useEffect(() => {
    if (!isResizingLeft) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(220, Math.min(480, e.clientX - rect.left));
      setSidebarWidth(newWidth);
      try { localStorage.setItem('gl_sidebar_width', newWidth); } catch {}
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft]);

  // Drag handler for right panel divider
  useEffect(() => {
    if (!isResizingRight) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(220, Math.min(420, rect.right - e.clientX));
      setRightPanelWidth(newWidth);
      try { localStorage.setItem('gl_right_width', newWidth); } catch {}
    };

    const handleMouseUp = () => {
      setIsResizingRight(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingRight]);

  return (
    <div className="gl-home" style={{ backgroundColor: '#06111F' }}>
      {/* Solid deep ocean background */}
      <div className="gl-home-bg" aria-hidden="true" />

      {/* Main chat layout */}
      <div
        ref={containerRef}
        className="gl-home-layout"
        style={{
          userSelect: isResizingLeft || isResizingRight ? 'none' : 'auto',
        }}
      >
        {/* Left Sidebar */}
        <div
          className={`gl-sidebar-wrapper ${selectedUser ? 'max-md:hidden' : ''}`}
          style={{
            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${sidebarWidth}px` : undefined,
            flexShrink: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Sidebar />
        </div>

        {/* Interactive Adjustment Line between Sidebar and Chatbox */}
        <div
          className={`gl-adjust-line gl-adjust-line-left ${isResizingLeft ? 'active' : ''} ${selectedUser ? 'max-md:hidden' : 'max-md:hidden'}`}
          onMouseDown={() => setIsResizingLeft(true)}
          onDoubleClick={() => { setSidebarWidth(310); try { localStorage.setItem('gl_sidebar_width', 310); } catch {} }}
          title="Drag to adjust sidebar width (double-click to reset)"
          role="separator"
          aria-orientation="vertical"
        >
          <div className="gl-adjust-handle" />
        </div>

        {/* Center ChatContainer */}
        <div
          className="gl-chat-wrapper"
          style={{
            flex: 1,
            minWidth: typeof window !== 'undefined' && window.innerWidth >= 768 ? '340px' : 0,
            height: '100%',
            maxHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ChatContainer
            onToggleRightSidebar={() => setShowRightSidebar(prev => !prev)}
            isRightSidebarOpen={showRightSidebar}
          />
        </div>

        {/* Interactive Adjustment Line between Chatbox and Right User Panel */}
        {selectedUser && showRightSidebar && (
          <div
            className={`gl-adjust-line gl-adjust-line-right ${isResizingRight ? 'active' : ''} max-md:hidden`}
            onMouseDown={() => setIsResizingRight(true)}
            onDoubleClick={() => { setRightPanelWidth(260); try { localStorage.setItem('gl_right_width', 260); } catch {} }}
            title="Drag to adjust contact info width (double-click to reset)"
            role="separator"
            aria-orientation="vertical"
          >
            <div className="gl-adjust-handle" />
          </div>
        )}

        {/* Right Sidebar (Contact Info) */}
        {selectedUser && showRightSidebar && (
          <div
            className="gl-right-wrapper max-md:hidden"
            style={{
              width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${rightPanelWidth}px` : undefined,
              flexShrink: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RightSidebar onClose={() => setShowRightSidebar(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;