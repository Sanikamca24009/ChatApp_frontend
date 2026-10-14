import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

/* ══════════════════════════════════════════════════════════════
   STRAWCHAT NAUTICAL ICONS & SVGS
   ══════════════════════════════════════════════════════════════ */

/* ── Authentic Luffy's Straw Hat Accent Icon ── */
const StrawHatAccent = ({ size = 52 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-2px' }}>
    <svg
      width={size}
      height={Math.round(size * 0.56)}
      viewBox="0 0 92 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 3px 6px rgba(25,12,4,0.55))',
        transform: 'rotate(-2.5deg)',
      }}
      aria-hidden="true"
    >
      {/* Crown */}
      <path
        d="M26 31 C24 16 34 7 46 7 C58 7 68 16 66 31 Z"
        fill="url(#hatCrownRefGrad)"
      />
      {/* Subtle straw grain highlights */}
      <path d="M30 25 Q46 29 62 25" stroke="#9E6B20" strokeWidth="1.2" opacity="0.5" />
      <path d="M34 17 Q46 21 58 17" stroke="#9E6B20" strokeWidth="1.2" opacity="0.5" />
      <circle cx="42" cy="14" r="1" fill="#FFE294" opacity="0.6" />
      <circle cx="51" cy="20" r="1.2" fill="#FFE294" opacity="0.6" />

      {/* Vibrant Red Ribbon */}
      <path
        d="M25 28 C33 32 46 33 67 28 L67.5 33.5 C46 38.5 32 37.5 24.5 33 Z"
        fill="url(#hatRibbonRefGrad)"
      />

      {/* Brim */}
      <ellipse cx="46" cy="36.5" rx="42" ry="11" fill="url(#hatBrimUnderGrad)" />
      <ellipse cx="46" cy="35" rx="42" ry="9.5" fill="url(#hatBrimTopGrad)" />
      {/* Dark rim underside shadow */}
      <ellipse cx="46" cy="37.5" rx="38" ry="4.5" fill="#241304" opacity="0.45" />

      <defs>
        <linearGradient id="hatCrownRefGrad" x1="46" y1="7" x2="46" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6E441D" />
          <stop offset="35%" stopColor="#4A2A0F" />
          <stop offset="100%" stopColor="#2A1608" />
        </linearGradient>
        <linearGradient id="hatRibbonRefGrad" x1="24" y1="30" x2="68" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BA1722" />
          <stop offset="50%" stopColor="#E62C36" />
          <stop offset="100%" stopColor="#960E16" />
        </linearGradient>
        <linearGradient id="hatBrimUnderGrad" x1="46" y1="28" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A3514" />
          <stop offset="100%" stopColor="#241406" />
        </linearGradient>
        <linearGradient id="hatBrimTopGrad" x1="46" y1="26" x2="46" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#683E18" />
          <stop offset="70%" stopColor="#44260C" />
          <stop offset="100%" stopColor="#241304" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/* ── Vintage Nautical Compass Rose (Top-Right Parchment Card Watermark) ── */
const VintageCompassRose = ({ size = 78, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="-14 -14 128 128"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.78 }}
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
      background: 'radial-gradient(circle at 35% 35%, #FFF4B0 0%, #D4A72C 55%, #7D5610 100%)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
      ...style,
    }}
  />
);

/* ── Golden Ships Wheel for SET SAIL button ── */
const ButtonHelmIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
  >
    <circle cx="12" cy="12" r="5.5" stroke="#FFF7E6" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2" fill="#FFF7E6" />
    <line x1="12" y1="2" x2="12" y2="22" stroke="#FFF7E6" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2" y1="12" x2="22" y2="12" stroke="#FFF7E6" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="4.9" y1="19.1" x2="19.1" y2="4.9" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ── Form Input Icons (Golden Outline) ── */
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT: STRAWCHAT SIGNUP / LOGIN PAGE
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
    const bio = 'Sailor of the Straw Hat Crew';

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
      {/* Cinematic Sunset Pirate Harbor Background Layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/strawchat_clean_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          imageRendering: '-webkit-optimize-contrast',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Scoped CSS for StrawChat Layout and Components */}
      <style>{`
        .sc-page-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1540px;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 24px clamp(20px, 5.5vw, 85px);
          box-sizing: border-box;
        }

        .sc-parchment-card {
          position: relative;
          width: 100%;
          max-width: 450px;
          background: url('/parchment_card.png') no-repeat center center;
          background-size: 100% 100%;
          padding: 42px 40px 34px 40px;
          box-sizing: border-box;
          filter: drop-shadow(0 20px 48px rgba(0, 0, 0, 0.88)) drop-shadow(0 4px 14px rgba(0, 0, 0, 0.6));
        }

        .sc-input-field {
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

        .sc-input-field::placeholder {
          color: #7E91A6;
          opacity: 0.9;
        }

        .sc-input-field:focus {
          border-color: #D4A72C;
          box-shadow: 0 0 0 2px rgba(212, 167, 44, 0.25), inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .sc-submit-btn {
          width: 100%;
          height: 48px;
          background: linear-gradient(180deg, #961821 0%, #6E0D14 100%);
          border: 1.5px solid #D4A72C;
          border-radius: 8px;
          color: #FFF8E7;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 0.96rem;
          letter-spacing: 0.15em;
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

        .sc-submit-btn:hover {
          background: linear-gradient(180deg, #BA1E28 0%, #88121A 100%);
          border-color: #F5D37B;
          box-shadow: 0 7px 24px rgba(186, 30, 40, 0.7), 0 0 14px rgba(229, 185, 63, 0.4), inset 0 1px 0 rgba(255, 230, 160, 0.5);
          transform: translateY(-2px);
        }

        .sc-submit-btn:active {
          transform: translateY(1px) scale(0.99);
        }

        @media (max-width: 900px) {
          .sc-page-container {
            justify-content: center;
            padding: 30px 18px;
          }
          .sc-parchment-card {
            max-width: 440px;
          }
        }

        @media (max-width: 480px) {
          .sc-parchment-card {
            padding: 34px 20px 26px 20px;
          }
        }
      `}</style>

      {/* Atmospheric vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 110% 110% at 50% 50%, rgba(5,13,24,0) 45%, rgba(3,8,16,0.38) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main Page Container */}
      <main className="sc-page-container">
        {/* Parchment-style Signup/Login Panel on the Right */}
        <section className="sc-parchment-card" aria-label="StrawChat Authentication Form">
          {/* Vintage Nautical Compass Rose (Top Right) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              pointerEvents: 'none',
              filter: 'drop-shadow(0 2px 4px rgba(45, 25, 10, 0.25))',
            }}
          >
            <VintageCompassRose size={72} />
          </div>

          {/* StrawChat Header Branding with Straw Hat Accent */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: '10px' }}>
            {/* Straw Hat Accent */}
            <StrawHatAccent size={50} />

            {/* Brand Title: StrawChat */}
            <h1
              style={{
                fontFamily: "'Kaushan Script', 'Caveat', cursive",
                fontSize: 'clamp(2.5rem, 3.3vw, 2.95rem)',
                fontWeight: 700,
                color: '#241308',
                margin: '2px 0 0 0',
                lineHeight: 1.05,
                letterSpacing: '0.01em',
                textShadow: '0 1px 1px rgba(255,255,255,0.4)',
                transform: 'rotate(-0.5deg)',
              }}
            >
              StrawChat
            </h1>

            {/* Tagline: "Set Sail. Stay Connected." with vintage line dividers */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                margin: '3px 0 8px 0',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #6E4522)',
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#3A2412',
                  letterSpacing: '0.02em',
                }}
              >
                Set Sail. Stay Connected.
              </span>
              <span
                style={{
                  width: '24px',
                  height: '1px',
                  background: 'linear-gradient(90deg, #6E4522, transparent)',
                  opacity: 0.6,
                }}
              />
            </div>

            {/* Classic Serif Form Title */}
            <h2
              style={{
                fontFamily: "'Cinzel', 'Crimson Text', serif",
                fontSize: 'clamp(1.1rem, 1.35vw, 1.28rem)',
                fontWeight: 700,
                color: '#2A180C',
                letterSpacing: '0.08em',
                margin: '2px 0 10px 0',
                textTransform: 'uppercase',
                textShadow: '0 1px 1px rgba(255,255,255,0.3)',
              }}
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </h2>
          </div>

          {/* The Registration / Login Form */}
          <form
            onSubmit={onSubmitHandler}
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '13px',
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
                  className="sc-input-field"
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
                className="sc-input-field"
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
                className="sc-input-field"
              />
            </div>

            {/* Primary Action Button (SET SAIL) with Nautical Wheel and Brass Rivets */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="sc-submit-btn"
            >
              {/* Corner Brass Rivets */}
              <Rivet style={{ top: '4px', left: '6px' }} />
              <Rivet style={{ top: '4px', right: '6px' }} />
              <Rivet style={{ bottom: '4px', left: '6px' }} />
              <Rivet style={{ bottom: '4px', right: '6px' }} />

              <ButtonHelmIcon size={18} />
              <span>{isSignUp ? 'SET SAIL' : 'LOGIN'}</span>
            </button>

            {/* Terms and Privacy Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '1px',
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
            <div style={{ textAlign: 'center', marginTop: '3px' }}>
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
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
