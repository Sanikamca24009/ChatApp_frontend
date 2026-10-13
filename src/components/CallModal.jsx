import React, { useContext, useEffect, useRef } from 'react';
import { CallContext } from '../../context/CallContext';
import assets from '../assets/assets';

const CallModal = () => {
  const {
    callState,
    callType,
    caller,
    recipient,
    callDuration,
    isMuted,
    isVideoOff,
    localStream,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useContext(CallContext);

  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callState]);

  if (callState === 'idle') return null;

  const targetUser = callState === 'incoming' ? caller : recipient;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3, 9, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '16px',
        animation: 'fadeInModal 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: callType === 'video' && callState === 'connected' ? '680px' : '420px',
          background: 'linear-gradient(145deg, #0A1E35 0%, #061426 60%, #030A14 100%)',
          border: '2px solid #D4A72C',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.9), 0 0 24px rgba(212, 167, 44, 0.35)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ornate Gold Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            background: 'rgba(212, 167, 44, 0.15)',
            border: '1px solid rgba(212, 167, 44, 0.4)',
            padding: '4px 14px',
            borderRadius: '20px',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🐌</span>
          <span
            className="font-cinzel"
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#F5D37B',
              textTransform: 'uppercase',
            }}
          >
            DEN DEN MUSHI {callType.toUpperCase()} CHANNEL
          </span>
        </div>

        {/* Video stream container (if connected video call) */}
        {callType === 'video' && callState === 'connected' && (
          <div
            style={{
              width: '100%',
              height: '320px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#02060D',
              border: '1.5px solid rgba(212, 167, 44, 0.5)',
              position: 'relative',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {localStream && !isVideoOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#D4A72C' }}>
                <img
                  src={targetUser?.profilePic || assets.avatar_icon}
                  alt={targetUser?.fullName}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #D4A72C', marginBottom: '8px' }}
                />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Camera is muted</p>
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                background: 'rgba(6, 17, 31, 0.8)',
                padding: '3px 10px',
                borderRadius: '12px',
                border: '1px solid #D4A72C',
                color: '#FFF7E6',
                fontSize: '0.75rem',
              }}
            >
              {targetUser?.fullName}
            </div>
          </div>
        )}

        {/* Avatar with Pulsing Rings (when ringing or audio connected) */}
        {!(callType === 'video' && callState === 'connected') && (
          <div style={{ position: 'relative', marginBottom: '18px' }}>
            {/* Animated Golden Pulse Rings */}
            {(callState === 'incoming' || callState === 'outgoing') && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    inset: '-12px',
                    borderRadius: '50%',
                    border: '2px solid rgba(212, 167, 44, 0.6)',
                    animation: 'pulseRing 1.8s ease-out infinite',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '-24px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(212, 167, 44, 0.3)',
                    animation: 'pulseRing 1.8s ease-out infinite 0.6s',
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}

            <img
              src={targetUser?.profilePic || assets.avatar_icon}
              alt={targetUser?.fullName || 'Pirate'}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #F5D37B',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 167, 44, 0.45)',
                display: 'block',
              }}
            />

            {/* Snail Shell Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: '#061325',
                border: '2px solid #D4A72C',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              {callType === 'video' ? '📹' : '📞'}
            </div>
          </div>
        )}

        {/* Target Name */}
        <h3
          className="font-cinzel"
          style={{
            margin: '0 0 6px',
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#FFF7E6',
            letterSpacing: '0.04em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
            textAlign: 'center',
          }}
        >
          {targetUser?.fullName || 'Grand Line Pirate'}
        </h3>

        {/* Call Status Description */}
        <p
          style={{
            margin: '0 0 24px',
            fontSize: '0.85rem',
            color: '#F5D37B',
            fontStyle: 'italic',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
          }}
        >
          {callState === 'incoming' && 'Incoming Den Den Mushi signal... Puru-puru-puru 🎵'}
          {callState === 'outgoing' && 'Calling across the Grand Line... Ringing 📞'}
          {callState === 'connected' && `Connected • ${callDuration}`}
        </p>

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'center' }}>
          {/* Incoming Call: Accept (Green) & Decline (Red) */}
          {callState === 'incoming' && (
            <>
              <button
                type="button"
                onClick={acceptCall}
                style={{
                  flex: 1,
                  maxWidth: '150px',
                  height: '48px',
                  borderRadius: '24px',
                  border: '1.5px solid #2ECC71',
                  background: 'linear-gradient(135deg, #27AE60 0%, #1E8449 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(46, 204, 113, 0.4)',
                  transition: 'transform 0.18s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>📞</span>
                <span>ANSWER</span>
              </button>

              <button
                type="button"
                onClick={rejectCall}
                style={{
                  flex: 1,
                  maxWidth: '150px',
                  height: '48px',
                  borderRadius: '24px',
                  border: '1.5px solid #E74C3C',
                  background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(231, 76, 60, 0.4)',
                  transition: 'transform 0.18s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>✕</span>
                <span>DECLINE</span>
              </button>
            </>
          )}

          {/* Outgoing Call: Cancel (Red) */}
          {callState === 'outgoing' && (
            <button
              type="button"
              onClick={endCall}
              style={{
                width: '160px',
                height: '48px',
                borderRadius: '24px',
                border: '1.5px solid #E74C3C',
                background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(231, 76, 60, 0.4)',
                transition: 'transform 0.18s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span>✕</span>
              <span>CANCEL</span>
            </button>
          )}

          {/* Connected Call: Mute, Video Toggle, and End Call */}
          {callState === 'connected' && (
            <>
              {/* Mute Mic Button */}
              <button
                type="button"
                onClick={toggleMute}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: isMuted ? '1.5px solid #E74C3C' : '1.5px solid #D4A72C',
                  background: isMuted ? 'rgba(231, 76, 60, 0.25)' : 'rgba(212, 167, 44, 0.2)',
                  color: isMuted ? '#E74C3C' : '#F5D37B',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.18s ease',
                }}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? '🔇' : '🎙️'}
              </button>

              {/* Video Toggle Button (if video call) */}
              {callType === 'video' && (
                <button
                  type="button"
                  onClick={toggleVideo}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: isVideoOff ? '1.5px solid #E74C3C' : '1.5px solid #D4A72C',
                    background: isVideoOff ? 'rgba(231, 76, 60, 0.25)' : 'rgba(212, 167, 44, 0.2)',
                    color: isVideoOff ? '#E74C3C' : '#F5D37B',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.18s ease',
                  }}
                  title={isVideoOff ? 'Enable camera' : 'Disable camera'}
                >
                  {isVideoOff ? '🚫' : '📹'}
                </button>
              )}

              {/* End Call Button */}
              <button
                type="button"
                onClick={endCall}
                style={{
                  height: '46px',
                  padding: '0 24px',
                  borderRadius: '24px',
                  border: '1.5px solid #E74C3C',
                  background: 'linear-gradient(135deg, #C0392B 0%, #922B21 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(231, 76, 60, 0.4)',
                  transition: 'transform 0.18s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>✕</span>
                <span>HANG UP</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallModal;
