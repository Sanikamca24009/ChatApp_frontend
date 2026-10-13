import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preview & memory cleanup for selected image
  useEffect(() => {
    if (!selectedImage) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio });
        navigate('/');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        await updateProfile({ profilePic: reader.result, fullName: name, bio });
        navigate('/');
      };
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', zIndex: 1,
    }}>
      <div
        className="gl-profile-card"
        style={{
          width: 'min(90vw, 680px)',
          display: 'flex',
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
          overflow: 'hidden',
          animation: 'fadeSlideUp 0.4s ease',
        }}
      >
        {/* ── Preview Panel ── */}
        <div style={{
          flex: '0 0 220px',
          background: 'rgba(6,17,31,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 20px',
          borderLeft: '1px solid rgba(212,167,44,0.15)',
          gap: '12px',
        }}>
          {/* Avatar preview */}
          <div style={{
            position: 'relative',
            animation: 'avatarFloat 4s ease-in-out infinite',
          }}>
            <img
              src={previewUrl || authUser?.profilePic || assets.avatar_icon}
              alt="Profile preview"
              style={{
                width: '110px', height: '110px', borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(212,167,44,0.6)',
                boxShadow: '0 0 20px rgba(212,167,44,0.2)',
              }}
            />
          </div>
          <p className="font-cinzel" style={{ color: 'var(--gold-bright)', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', margin: 0 }}>
            {name || authUser?.fullName || 'Sailor'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic', textAlign: 'center', margin: 0, maxWidth: '160px' }}>
            {bio || authUser?.bio || 'No bio yet...'}
          </p>

          {/* Compass decoration */}
          <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            style={{ opacity: 0.4, animation: 'compassSpin 25s linear infinite', marginTop: '8px' }}>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#D4A72C" strokeWidth="2"/>
            <circle cx="50" cy="50" r="36" fill="none" stroke="#D4A72C" strokeWidth="0.8" opacity="0.5"/>
            <polygon points="50,8 54,48 50,50 46,48" fill="#C72B32"/>
            <polygon points="50,92 54,52 50,50 46,52" fill="#D4A72C"/>
            <polygon points="8,50 48,46 50,50 48,54" fill="#D4A72C"/>
            <polygon points="92,50 52,46 50,50 52,54" fill="#D4A72C" opacity="0.7"/>
            <circle cx="50" cy="50" r="4" fill="#D4A72C"/>
          </svg>
        </div>

        {/* ── Form Panel ── */}
        <div style={{ flex: '1 1 280px', padding: '32px 28px' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <button
                id="profile-back-btn"
                onClick={() => navigate('/')}
                style={{
                  background: 'rgba(18,52,77,0.5)',
                  border: '1px solid rgba(212,167,44,0.3)',
                  color: 'var(--gold-bright)', borderRadius: '6px',
                  width: '28px', height: '28px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', flexShrink: 0,
                }}
                aria-label="Go back"
              >
                ←
              </button>
              <h2
                className="font-cinzel"
                style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-bright)', letterSpacing: '0.08em' }}
              >
                Profile Details
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, paddingLeft: '38px', fontStyle: 'italic' }}>
              Update your crew identity
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Avatar upload */}
            <label
              htmlFor="profile-avatar-upload"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer',
                background: 'rgba(18,52,77,0.3)',
                border: '1px dashed rgba(212,167,44,0.35)',
                borderRadius: '10px', padding: '12px 14px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,167,44,0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,167,44,0.35)'}
            >
              <input
                id="profile-avatar-upload"
                onChange={e => setSelectedImage(e.target.files[0])}
                type="file"
                accept=".jpg,.jpeg,.png"
                hidden
              />
              <img
                src={previewUrl || authUser?.profilePic || assets.avatar_icon}
                alt="Current avatar"
                style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  border: '2px solid rgba(212,167,44,0.4)', objectFit: 'cover',
                }}
              />
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--gold-bright)', fontWeight: 600 }}>
                  Upload Profile Image
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  JPG, JPEG, PNG supported
                </p>
              </div>
            </label>

            {/* Name */}
            <div>
              <label htmlFor="profile-name" style={{
                display: 'block', fontSize: '0.68rem', fontWeight: 600,
                color: 'var(--gold-dim)', marginBottom: '5px',
                fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name, sailor..."
                className="gl-input"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="profile-bio" style={{
                display: 'block', fontSize: '0.68rem', fontWeight: 600,
                color: 'var(--gold-dim)', marginBottom: '5px',
                fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Bio / Legend
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell the crew your story..."
                required
                rows={3}
                className="gl-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Save button */}
            <button
              id="profile-save-btn"
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(140,24,33,0.5)'
                  : 'linear-gradient(135deg, #8C1821 0%, #C72B32 100%)',
                border: '1.5px solid rgba(212,167,44,0.5)',
                color: '#FFF7E6',
                borderRadius: '10px', padding: '12px 20px',
                fontFamily: 'Cinzel, serif', fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '0.15em',
                cursor: loading ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.25s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(140,24,33,0.4)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? '⚓ Saving...' : '⚓ SAVE PROFILE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
