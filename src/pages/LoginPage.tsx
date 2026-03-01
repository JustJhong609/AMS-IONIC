import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonInput, IonButton, IonText,
  IonSpinner, IonIcon, IonInputPasswordToggle,
} from '@ionic/react';
import { personCircleOutline, mailOutline, lockClosedOutline, schoolOutline } from 'ionicons/icons';
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
    }, 500);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{ '--background': 'var(--ion-color-primary)' }}>
        <div style={styles.outer}>
          {/* ── Branding ── */}
          <div style={styles.brand}>
            <div style={styles.logoCircle}>
              <IonIcon icon={schoolOutline} style={{ fontSize: 36, color: '#fff' }} />
            </div>
            <div style={styles.appName}>ALS Mapping System</div>
            <div style={styles.tagline}>Community Mapping Tool</div>
            <div style={styles.adminBadge}>
              <div style={styles.adminBadgeText}>{DISTRICT}</div>
              <div style={styles.adminBadgeSub}>{DIVISION} | {REGION}</div>
            </div>
          </div>

          {/* ── Form card ── */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </div>
            <div style={styles.cardSubtitle}>
              {isSignUp ? 'Sign up to start mapping learners' : 'Sign in to continue'}
            </div>

            {isSignUp && (
              <IonItem fill="outline" style={styles.item}>
                <IonIcon slot="start" icon={personCircleOutline} />
                <IonInput
                  label="Full Name"
                  labelPlacement="floating"
                  value={name}
                  onIonInput={e => setName(e.detail.value!)}
                  autocomplete="name"
                />
              </IonItem>
            )}

            <IonItem fill="outline" style={styles.item}>
              <IonIcon slot="start" icon={mailOutline} />
              <IonInput
                label="Email Address"
                labelPlacement="floating"
                type="email"
                value={email}
                onIonInput={e => setEmail(e.detail.value!)}
                autocomplete="email"
              />
            </IonItem>

            <IonItem fill="outline" style={styles.item}>
              <IonIcon slot="start" icon={lockClosedOutline} />
              <IonInput
                label="Password"
                labelPlacement="floating"
                type="password"
                value={password}
                onIonInput={e => setPassword(e.detail.value!)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>

            {error && (
              <IonText color="danger">
                <p style={{ fontSize: 13, margin: '4px 16px 0' }}>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              style={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </IonButton>

            <div style={styles.switchRow}>
              <span style={styles.switchText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button style={styles.switchLink} onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                {isSignUp ? ' Sign In' : ' Sign Up'}
              </button>
            </div>
          </div>

          <div style={styles.footer}>ALS Mapping System v1.0</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outer: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  adminBadge: {
    marginTop: 16,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: '8px 20px',
    textAlign: 'center',
  },
  adminBadgeText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
  },
  adminBadgeSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '24px 20px 20px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#212121',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
  },
  item: {
    marginBottom: 12,
    '--border-radius': '10px',
  } as React.CSSProperties,
  submitBtn: {
    marginTop: 16,
    '--border-radius': '10px',
    fontWeight: 700,
    fontSize: 16,
  } as React.CSSProperties,
  switchRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 14,
    fontSize: 14,
    color: '#757575',
    gap: 4,
  },
  switchText: { color: '#757575' },
  switchLink: {
    background: 'none',
    border: 'none',
    color: 'var(--ion-color-primary)',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14,
    padding: 0,
  },
  footer: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 24,
  },
};

export default LoginPage;
