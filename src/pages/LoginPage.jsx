import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

/* ══════════════════════════════════════════════════════════════
   GRAND LINE SVGS & ICONS
   ══════════════════════════════════════════════════════════════ */



/* ── Vintage Nautical Compass Rose (Top-Right Card Watermark with W N E S) ── */
const VintageCompassRose = ({ size = 78, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="-14 -14 128 128"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.88 }}
    aria-hidden="true"
  >
    {/* Concentric rings */}
    <circle cx="50" cy="50" r="46" stroke="#3D2614" strokeWidth="1.2" opacity="0.8" />
    <circle cx="50" cy="50" r="41" stroke="#3D2614" strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.65" />
    <circle cx="50" cy="50" r="33" stroke="#3D2614" strokeWidth="0.8" opacity="0.65" />
    <circle cx="50" cy="50" r="14" stroke="#3D2614" strokeWidth="0.6" opacity="0.5" />

    {/* Primary 4-point star points */}
    {/* North */}
    <polygon points="50,4 53,42 50,50" fill="#3D2614" />
    <polygon points="50,4 47,42 50,50" fill="#8C5C35" />
    {/* South */}
    <polygon points="50,96 47,58 50,50" fill="#3D2614" />
    <polygon points="50,96 53,58 50,50" fill="#8C5C35" />
    {/* East */}
    <polygon points="96,50 58,53 50,50" fill="#3D2614" />
    <polygon points="96,50 58,47 50,50" fill="#8C5C35" />
    {/* West */}
    <polygon points="4,50 42,47 50,50" fill="#3D2614" />
    <polygon points="4,50 42,53 50,50" fill="#8C5C35" />

    {/* Secondary 4-point star points (Diagonal) */}
    <polygon points="81,19 56,44 50,50" fill="#5A3A1F" opacity="0.8" />
    <polygon points="81,19 50,50 44,56" fill="#8C5C35" opacity="0.7" />
    <polygon points="81,81 50,50 56,56" fill="#5A3A1F" opacity="0.8" />
    <polygon points="81,81 44,44 50,50" fill="#8C5C35" opacity="0.7" />
    <polygon points="19,81 44,56 50,50" fill="#5A3A1F" opacity="0.8" />
    <polygon points="19,81 50,50 56,44" fill="#8C5C35" opacity="0.7" />
    <polygon points="19,19 50,50 44,44" fill="#5A3A1F" opacity="0.8" />
    <polygon points="19,19 56,56 50,50" fill="#8C5C35" opacity="0.7" />

    {/* Cardinal Direction Letters matching Reference Image */}
    <text x="50" y="-3" textAnchor="middle" fill="#3D2614" fontFamily="'Cinzel', serif" fontWeight="800" fontSize="11">N</text>
    <text x="50" y="111" textAnchor="middle" fill="#3D2614" fontFamily="'Cinzel', serif" fontWeight="800" fontSize="11">S</text>
    <text x="107" y="54" textAnchor="middle" fill="#3D2614" fontFamily="'Cinzel', serif" fontWeight="800" fontSize="11">E</text>
    <text x="-7" y="54" textAnchor="middle" fill="#3D2614" fontFamily="'Cinzel', serif" fontWeight="800" fontSize="11">W</text>

    {/* Center Boss */}
    <circle cx="50" cy="50" r="4.5" fill="#3D2614" />
    <circle cx="50" cy="50" r="2.2" fill="#E8D2A0" />
  </svg>
);

/* ── Golden Corner Rivet for SET SAIL button ── */
const Rivet = ({ style }) => (
  <span
    aria-hidden="true"
    style={{
      position: 'absolute',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #FFF2A8 0%, #D4A72C 55%, #7D5610 100%)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
      ...style,
    }}
  />
);

/* ── Golden Ship's Helm / Wheel (Sub-header divider) ── */
const ShipsWheel = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="20" cy="20" r="10" stroke="#D4A72C" strokeWidth="2.5" />
    <circle cx="20" cy="20" r="4" fill="#D4A72C" />
    <line x1="20" y1="2" x2="20" y2="38" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="20" x2="38" y2="20" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
    <line x1="7.3" y1="7.3" x2="32.7" y2="32.7" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
    <line x1="7.3" y1="32.7" x2="32.7" y2="7.3" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ── Pirate Ship Silhouette for SET SAIL button ── */
const PirateShipIcon = () => (
  <svg width="24" height="20" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Hull */}
    <path
      d="M2 15 C4 19 8 20.5 13 20.5 C18 20.5 22 19 24 15 L22 13 L4 13 Z"
      fill="#FFF8E7"
    />
    {/* Main Mast & Sails */}
    <line x1="13" y1="2" x2="13" y2="14" stroke="#FFF8E7" strokeWidth="1.8" />
    <path d="M13 3 Q19 5.5 13 8.5 Z" fill="#FFF8E7" opacity="0.95" />
    <path d="M13 9 Q20 11.5 13 14.5 Z" fill="#FFF8E7" opacity="0.95" />
    {/* Fore Mast */}
    <line x1="7" y1="5.5" x2="7" y2="14" stroke="#FFF8E7" strokeWidth="1.5" />
    <path d="M7 6.5 Q11 8.5 7 11.5 Z" fill="#FFF8E7" opacity="0.9" />
    {/* Mizzen Mast */}
    <line x1="19" y1="6.5" x2="19" y2="14" stroke="#FFF8E7" strokeWidth="1.5" />
    <path d="M19 7.5 Q22.5 9.5 19 12.5 Z" fill="#FFF8E7" opacity="0.9" />
    {/* Golden Pennant on Main Mast */}
    <path d="M13 2 L16.5 3.3 L13 4.6 Z" fill="#E5B93F" />
  </svg>
);

/* ── Form Input Icons ── */
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT: LOGIN / SIGNUP PAGE
   ══════════════════════════════════════════════════════════════ */

const LoginPage = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!agreed) return;

    // Default bio ensures backend Mongoose validation passes seamlessly
    const bio = 'Sailor of the Grand Line';

    if (currentState === 'Sign Up') {
      login('signup', { fullName, email, password, bio });
    } else {
      login('login', { email, password });
    }
  };

  const switchToLogin = () => setCurrentState('Login');
  const switchToSignup = () => setCurrentState('Sign Up');

  const isSignUp = currentState === 'Sign Up';

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050D18',
      }}
    >
      {/* High-definition fixed background layer to prevent stretch blur and preserve 100% crystal clarity */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/grand_line_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          imageRendering: '-webkit-optimize-contrast',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Scoped CSS for layout matching Reference Image */}
      <style>{`
        .gl-page-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1540px;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px clamp(24px, 3.5vw, 64px);
          box-sizing: border-box;
          gap: 30px;
        }

        .gl-left-branding {
          flex: 0 1 auto;
          margin-left: clamp(10px, 22vw, 360px);
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 6px;
          user-select: none;
          background: radial-gradient(ellipse 90% 75% at 50% 50%, rgba(3, 8, 16, 0.72) 0%, rgba(3, 8, 16, 0.25) 65%, transparent 100%);
          padding: 18px 24px;
          border-radius: 20px;
        }

        .gl-right-form-wrapper {
          flex: 1 1 44%;
          max-width: 480px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .gl-parchment-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: url('/parchment_card.png') no-repeat center center;
          background-size: 100% 100%;
          padding: 44px 42px 38px 42px;
          box-sizing: border-box;
          filter: drop-shadow(0 24px 55px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.65));
        }

        .gl-input-field {
          width: 100%;
          height: 48px;
          padding: 12px 18px 12px 46px;
          box-sizing: border-box;
          background-color: #111C28;
          border: 1.5px solid rgba(212, 167, 44, 0.35);
          border-radius: 9px;
          color: #FFF7E6;
          font-family: 'Outfit', sans-serif;
          font-size: 0.94rem;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .gl-input-field::placeholder {
          color: #7E91A6;
          opacity: 0.9;
        }

        .gl-input-field:focus {
          border-color: #D4A72C;
          box-shadow: 0 0 0 2px rgba(212, 167, 44, 0.25), inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .gl-submit-btn {
          width: 100%;
          height: 48px;
          background: linear-gradient(180deg, #961821 0%, #6E0D14 100%);
          border: 1.5px solid #D4A72C;
          border-radius: 8px;
          color: #FFF8E7;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 0.98rem;
          letter-spacing: 0.14em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 4px;
          box-shadow: 0 5px 18px rgba(110, 13, 20, 0.6), inset 0 1px 0 rgba(255, 220, 140, 0.35);
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .gl-submit-btn:hover {
          background: linear-gradient(180deg, #BA1E28 0%, #88121A 100%);
          border-color: #F5D37B;
          box-shadow: 0 7px 24px rgba(186, 30, 40, 0.7), 0 0 14px rgba(229, 185, 63, 0.4), inset 0 1px 0 rgba(255, 230, 160, 0.5);
          transform: translateY(-2px);
        }

        .gl-submit-btn:active {
          transform: translateY(1px) scale(0.99);
        }

        @media (max-width: 980px) {
          .gl-page-container {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 30px 20px;
            gap: 36px;
            min-height: auto;
          }
          .gl-left-branding {
            flex: none;
            margin-left: 0;
            max-width: 100%;
          }
          .gl-right-form-wrapper {
            flex: none;
            justify-content: center;
            max-width: 460px;
          }
        }

        @media (max-width: 480px) {
          .gl-parchment-card {
            padding: 38px 24px 30px 24px;
          }
        }
      `}</style>

      {/* Subtle atmospheric vignette overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 110% 110% at 50% 50%, rgba(5,13,24,0) 35%, rgba(3,8,16,0.55) 100%), linear-gradient(180deg, rgba(4,10,20,0.3) 0%, rgba(4,10,20,0.05) 40%, rgba(4,10,20,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main 2-Section Content Container */}
      <main className="gl-page-container">
        {/* ══════════════════════════════════════════════════════
            LEFT SECTION: QUICKCHAT GRAND LINE BRANDING
            ══════════════════════════════════════════════════════ */}
        <section className="gl-left-branding" aria-label="QuickChat Grand Line Branding">
          {/* QuickChat Title matching exact Reference Artwork */}
          <h1
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              fontSize: 'clamp(2.7rem, 3.6vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1,
              margin: 0,
              letterSpacing: '0.01em',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FCE8A6 30%, #E5B93F 65%, #A87A14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,1)) drop-shadow(0 4px 14px rgba(0,0,0,0.95)) drop-shadow(0 0 24px rgba(229,185,63,0.5))',
            }}
          >
            QuickChat
          </h1>

          {/* Subtitle: GRAND LINE with Nautical Wheel Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              maxWidth: '320px',
              margin: '2px 0 0',
            }}
          >
            {/* Left gold accent line */}
            <div
              style={{
                flex: 1,
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent 0%, #D4A72C 70%, #F2D477 100%)',
                opacity: 0.9,
              }}
            />

            <span
              className="font-cinzel"
              style={{
                fontSize: 'clamp(0.85rem, 1.05vw, 0.98rem)',
                fontWeight: 700,
                letterSpacing: '0.36em',
                color: '#F5D37B',
                textTransform: 'uppercase',
                textShadow: '0 2px 4px #000000, 0 3px 10px rgba(0,0,0,0.95), 0 0 12px rgba(245,211,123,0.6)',
                paddingLeft: '0.36em',
                whiteSpace: 'nowrap',
              }}
            >
              GRAND LINE
            </span>

            {/* Right gold accent line */}
            <div
              style={{
                flex: 1,
                height: '1.5px',
                background: 'linear-gradient(90deg, #F2D477 0%, #D4A72C 30%, transparent 100%)',
                opacity: 0.9,
              }}
            />
          </div>

          {/* Golden Helm Icon */}
          <div style={{ marginTop: '-2px', opacity: 0.95, filter: 'drop-shadow(0 2px 4px #000000)' }}>
            <ShipsWheel size={22} />
          </div>

          {/* Tagline: "Set Sail. Stay Connected." (Script Cursive with Gold Underline Swoosh) */}
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 'clamp(2.1rem, 2.7vw, 2.7rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: '6px 0 0',
              textShadow: '0 2px 4px #000000, 0 4px 14px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.9)',
              transform: 'rotate(-2deg)',
              display: 'inline-block',
              position: 'relative',
            }}
          >
            <div style={{ textAlign: 'left', paddingLeft: '4px' }}>Set Sail.</div>
            <div style={{ textAlign: 'right', paddingLeft: '22px', position: 'relative' }}>
              Stay Connected.
              <svg
                width="180"
                height="12"
                viewBox="0 0 180 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-6px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                }}
                aria-hidden="true"
              >
                <path
                  d="M2 10 Q90 2 178 6"
                  stroke="url(#goldSwooshGrad)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="goldSwooshGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D4A72C" stopOpacity="0.2" />
                    <stop offset="35%" stopColor="#F5D37B" stopOpacity="1" />
                    <stop offset="100%" stopColor="#D4A72C" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            RIGHT SECTION: AGED PARCHMENT SIGNUP CARD
            ══════════════════════════════════════════════════════ */}
        <section className="gl-right-form-wrapper" aria-label="Account Registration Form">
          <div className="gl-parchment-card">
            {/* Vintage Compass Rose with W N E S (Top Right) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '18px',
                right: '22px',
                opacity: 0.88,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 4px rgba(45, 25, 10, 0.25))',
              }}
            >
              <VintageCompassRose size={78} />
            </div>

            {/* Form Header: Title Case "Sign Up" matching Reference Image */}
            <div style={{ position: 'relative', zIndex: 2, marginBottom: '20px' }}>
              <h2
                style={{
                  fontFamily: "'Crimson Text', Georgia, serif",
                  fontSize: 'clamp(2rem, 2.7vw, 2.35rem)',
                  fontWeight: 700,
                  color: '#160E08',
                  margin: 0,
                  letterSpacing: '0.01em',
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                }}
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </h2>
            </div>

            {/* The Authentication Form */}
            <form
              onSubmit={onSubmitHandler}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              {/* Full Name Input (Only on Sign Up) */}
              {isSignUp && (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      zIndex: 3,
                    }}
                  >
                    <UserIcon />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className="gl-input-field"
                  />
                </div>
              )}

              {/* Email Address Input */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                >
                  <MailIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  autoComplete="email"
                  className="gl-input-field"
                />
              </div>

              {/* Password Input */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                >
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="gl-input-field"
                />
              </div>

              {/* Primary Action Button (SET SAIL / LOGIN NOW) with 6 Brass Rivets */}
              <button
                id="auth-submit-btn"
                type="submit"
                className="gl-submit-btn"
              >
                {/* 6 Decorative Corner & Edge Rivets matching Reference Image */}
                <Rivet style={{ top: '4px', left: '6px' }} />
                <Rivet style={{ top: '4px', right: '6px' }} />
                <Rivet style={{ bottom: '4px', left: '6px' }} />
                <Rivet style={{ bottom: '4px', right: '6px' }} />
                <Rivet style={{ top: '4px', left: '50%', transform: 'translateX(-50%)' }} />
                <Rivet style={{ bottom: '4px', left: '50%', transform: 'translateX(-50%)' }} />

                <PirateShipIcon />
                <span>{isSignUp ? 'SET SAIL' : 'LOGIN NOW'}</span>
              </button>

              {/* Terms and Privacy Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '2px',
                  userSelect: 'none',
                }}
              >
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#111C28',
                    cursor: 'pointer',
                    borderRadius: '3px',
                  }}
                />
                <label
                  htmlFor="terms"
                  style={{
                    fontSize: '0.82rem',
                    color: '#2A180C',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Agree to the terms of use & privacy policy
                </label>
              </div>

              {/* Switch between Sign Up and Login */}
              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                {isSignUp ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      color: '#2A180C',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Already have an account?{' '}
                    <span
                      onClick={switchToLogin}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && switchToLogin()}
                      style={{
                        color: '#9E1720',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      Login here
                    </span>
                  </p>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      color: '#2A180C',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Don't have an account?{' '}
                    <span
                      onClick={switchToSignup}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && switchToSignup()}
                      style={{
                        color: '#9E1720',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      Create an account Click here
                    </span>
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;

