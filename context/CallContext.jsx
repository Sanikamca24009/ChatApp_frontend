import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { callAudio } from '../src/lib/callAudio';
import toast from 'react-hot-toast';

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { socket, authUser } = useContext(AuthContext);

  // 'idle' | 'outgoing' | 'incoming' | 'connected'
  const [callState, setCallState] = useState('idle');
  const [callType, setCallType] = useState('audio'); // 'audio' | 'video'
  const [caller, setCaller] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const localStreamRef = useRef(null);
  const peerConnRef = useRef(null);
  const timerRef = useRef(null);

  // Format seconds to mm:ss
  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer counter when call connects
  useEffect(() => {
    if (callState === 'connected') {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Clean up media streams
  const stopMediaTracks = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    setRemoteStream(null);
  };

  // ── Initiate Call ──
  const initiateCall = async (targetUser, type = 'audio') => {
    if (!targetUser || !socket) return;
    if (targetUser._id === authUser?._id) {
      toast.error("You cannot call your own Den Den Mushi!");
      return;
    }

    setCallType(type);
    setRecipient(targetUser);
    setCaller(authUser);
    setCallState('outgoing');
    setIsMuted(false);
    setIsVideoOff(false);

    // Play outgoing dial/ring sound
    callAudio.startOutgoingRing();

    // Acquire local media preview if video or audio is requested
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === 'video',
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
      }
    } catch (err) {
      console.warn("Media access warning (fallback to signaling):", err);
    }

    socket.emit("callUser", {
      recipientId: targetUser._id,
      caller: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      callType: type,
    });
  };

  // ── Accept Incoming Call ──
  const acceptCall = async () => {
    if (!caller || !socket) return;

    callAudio.stopAll();
    callAudio.playGachaSound();

    setCallState('connected');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === 'video',
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
      }
    } catch (err) {
      console.warn("Media access warning on accept:", err);
    }

    socket.emit("acceptCall", {
      callerId: caller._id,
      recipient: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      callType,
    });
  };

  // ── Reject Incoming Call ──
  const rejectCall = () => {
    if (caller && socket) {
      socket.emit("rejectCall", { callerId: caller._id });
    }
    callAudio.stopAll();
    callAudio.playGachaSound();
    stopMediaTracks();
    setCallState('idle');
    setCaller(null);
  };

  // ── End Active or Outgoing Call ──
  const endCall = () => {
    callAudio.stopAll();
    callAudio.playGachaSound();

    const targetId = callState === 'outgoing' ? recipient?._id : (caller?._id === authUser?._id ? recipient?._id : caller?._id);
    if (targetId && socket) {
      socket.emit("endCall", { targetUserId: targetId });
    }

    stopMediaTracks();
    setCallState('idle');
    setCaller(null);
    setRecipient(null);
  };

  // ── Mute Toggle ──
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsMuted(!isMuted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  // ── Video Toggle ──
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsVideoOff(!isVideoOff);
    } else {
      setIsVideoOff((prev) => !prev);
    }
  };

  // ── Socket Event Listeners ──
  useEffect(() => {
    if (!socket) return;

    // 1. Another user is calling this client
    socket.on("incomingCall", ({ caller: remoteCaller, callType: incomingType }) => {
      setCaller(remoteCaller);
      setCallType(incomingType || 'audio');
      setCallState('incoming');
      // Play incoming Den Den Mushi musical ringtone
      callAudio.startIncomingRingtone();
    });

    // 2. Caller receives call accepted notification
    socket.on("callAccepted", ({ recipient: remoteRecipient }) => {
      callAudio.stopAll();
      callAudio.playGachaSound();
      setRecipient(remoteRecipient);
      setCallState('connected');
    });

    // 3. Call rejected by recipient
    socket.on("callRejected", () => {
      callAudio.stopAll();
      callAudio.playGachaSound();
      stopMediaTracks();
      setCallState('idle');
      toast("Den Den Mushi call was declined", { icon: '📴' });
    });

    // 4. Remote party ended the call
    socket.on("callEnded", () => {
      callAudio.stopAll();
      callAudio.playGachaSound();
      stopMediaTracks();
      setCallState('idle');
      setCaller(null);
      setRecipient(null);
      toast("Den Den Mushi call ended", { icon: '🐌' });
    });

    // 5. User offline across Grand Line
    socket.on("callUnavailable", ({ message }) => {
      callAudio.stopAll();
      stopMediaTracks();
      setCallState('idle');
      toast.error(message || "User is currently unreachable");
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callRejected");
      socket.off("callEnded");
      socket.off("callUnavailable");
    };
  }, [socket, authUser]);

  const value = {
    callState,
    callType,
    caller,
    recipient,
    callDuration: formatDuration(callDuration),
    isMuted,
    isVideoOff,
    localStream,
    remoteStream,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
