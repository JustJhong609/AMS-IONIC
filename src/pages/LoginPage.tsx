import React, { useState } from 'react';
import {
  IonPage, IonContent, IonInput, IonButton, IonText,
  IonSpinner, IonIcon, IonInputPasswordToggle,
} from '@ionic/react';
import { personOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { useAppContext } from '../context/AppContext';
import { DISTRICT, DIVISION, REGION } from '../utils/constants';

const STORED_ACCOUNTS: { email: string; name: string }[] = [];

const LoginPage: React.FC = () => {
  const { setUser } = useAppContext();
  const [isSignUp, setIsSignUp]   = useState(false);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = () => {
    setError('');
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (isSignUp) {
      STORED_ACCOUNTS.push({ email: trimmedEmail, name: name.trim() });
    }
    const account = STORED_ACCOUNTS.find(a => a.email === trimmedEmail);
    const displayName = account ? account.name : (name.trim() || trimmedEmail.split('@')[0]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ name: displayName, email: trimmedEmail });
    }, 600);
  };

  const switchMode = () => { setIsSignUp(!isSignUp); setError(''); };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} style={{ '--background': 'transparent' } as React.CSSProperties}>
        {/* Background gradient */}
        <div style={s.bg}>
          {/* Decorative blobs */}
          <div style={{ ...s.blob, width: 280, height: 280, top: -80, left: -80, animationDelay: '0s' }} />
          <div style={{ ...s.blob, width: 180, height: 180, top: 60, right: -60, background: 'rgba(255,255,255,0.07)', animationDelay: '1.5s' }} />
          <div style={{ ...s.blob, width: 140, height: 140, bottom: 160, left: 40, background: 'rgba(255,255,255,0.05)', animationDelay: '0.8s' }} />

          <div style={s.outer}>
            {/* Brand */}
            <div style={s.brand}>
              <img src="/logo.png" alt="ALS Mapping System Logo" style={s.logoImg} />
              <div style={s.appName}>ALS Mapping System</div>
              <div style={s.tagline}>Community Mapping Tool</div>
              <div style={s.districtBadge}>
                <span style={s.districtText}>{DISTRICT}</span>
                <span style={s.districtSub}>{DIVISION} &nbsp;•&nbsp; {REGION}</span>
              </div>
            </div>

            {/* Card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>{isSignUp ? 'Create Account' : 'Welcome Back!'}</div>
                <div style={s.cardSub}>
                  {isSignUp
                    ? 'Fill in your details to get started'
                    : 'Sign in to continue mapping learners'}
                </div>
              </div>

              <div style={s.cardBody}>
                {isSignUp && (
                  <div style={s.inputWrap}>
                    <IonIcon icon={personOutline} style={s.inputIcon} />
                    <IonInput
                      fill="outline"
                      label="Full Name"
                      labelPlacement="floating"
                      value={name}
                      onIonInput={e => setName(e.detail.value!)}
                      autocomplete="name"
                      style={s.input as React.CSSProperties}
                    />
                  </div>
                )}

                <div style={s.inputWrap}>
                  <IonIcon icon={mailOutline} style={s.inputIcon} />
                  <IonInput
                    fill="outline"
                    label="Email Address"
                    labelPlacement="floating"
                    type="email"
                    value={email}
                    onIonInput={e => setEmail(e.detail.value!)}
                    autocomplete="email"
                    style={s.input as React.CSSProperties}
                  />
                </div>

                <div style={s.inputWrap}>
                  <IonIcon icon={lockClosedOutline} style={s.inputIcon} />
                  <IonInput
                    fill="outline"
                    label="Password"
                    labelPlacement="floating"
                    type="password"
                    value={password}
                    onIonInput={e => setPassword(e.detail.value!)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    style={s.input as React.CSSProperties}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </div>

                {error && (
                  <div style={s.errorBox}>
                    <span style={{ fontSize: 14 }}>⚠️</span>
                    <IonText color="danger"><span style={{ fontSize: 13, fontWeight: 600 }}>{error}</span></IonText>
                  </div>
                )}

                <IonButton
                  expand="block"
                  style={s.btn}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? <IonSpinner name="crescent" style={{ color: '#fff' }} />
                    : (isSignUp ? '🚀  Create Account' : 'Sign In  →')}
                </IonButton>

                <div style={s.divider}>
                  <span style={s.dividerLine} />
                  <span style={s.dividerText}>or</span>
                  <span style={s.dividerLine} />
                </div>

                <div style={s.switchRow}>
                  <span style={{ color: '#6B7280', fontSize: 14 }}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                  <button style={s.switchLink} onClick={switchMode}>
                    {isSignUp ? ' Sign In' : ' Sign Up'}
                  </button>
                </div>
              </div>
            </div>

            <div style={s.footer}>ALS Mapping System • DepEd Region X</div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const s: Record<string, React.CSSProperties> = {
  bg: {
    minHeight: '100%',
    background: 'linear-gradient(160deg, #1565C0 0%, #0d47a1 55%, #1a237e 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    animation: 'float 6s ease-in-out infinite',
  },
  outer: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    gap: 8,
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    animation: 'fadeSlideUp 0.5s ease both',
  },
  logoImg: {
    width: 200,
    maxWidth: '70vw',
    objectFit: 'contain' as const,
    marginBottom: 14,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
    animation: 'float 4s ease-in-out infinite',
  },
  appName: {
    fontSize: 24,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: 0.3,
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  districtBadge: {
    marginTop: 14,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 50,
    padding: '7px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  districtText: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  districtSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 24px 64px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.12)',
    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both 0.1s',
    overflow: 'hidden',
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #F1F5F9, #fff)',
    padding: '24px 24px 18px',
    borderBottom: '1px solid #F1F5F9',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  cardSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: 500,
  },
  cardBody: {
    padding: '20px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  inputWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
    fontSize: 16,
    zIndex: 10,
    display: 'none', // icons handled by label
  } as React.CSSProperties,
  input: {
    '--border-radius': '12px',
    marginBottom: 8,
  } as any,
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: 10,
    padding: '10px 14px',
    marginTop: 4,
    marginBottom: 4,
    animation: 'shake 0.35s ease',
  },
  btn: {
    '--border-radius': '50px',
    '--background': 'linear-gradient(135deg, #1976d2 0%, #1565C0 60%, #0d47a1 100%)',
    '--box-shadow': '0 8px 28px rgba(21,101,192,0.42)',
    fontWeight: 800,
    fontSize: 16,
    letterSpacing: 0.3,
    marginTop: 8,
    height: 54,
  } as React.CSSProperties,
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '8px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#E2E8F0',
    display: 'block',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  switchRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: 'var(--ion-color-primary)',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: 14,
    padding: 0,
    fontFamily: 'inherit',
  },
  footer: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 20,
    letterSpacing: 0.5,
  },
};

export default LoginPage;
