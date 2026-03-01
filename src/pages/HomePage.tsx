import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonIcon, IonButton, IonButtons,
  IonModal, IonText, IonList, IonItem, IonLabel,
} from '@ionic/react';
import {
  personAddOutline, listOutline, barChartOutline, informationCircleOutline,
  chevronForwardOutline, logOutOutline, schoolOutline, peopleOutline,
  personOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DISTRICT, DIVISION, REGION, BARANGAY_OPTIONS } from '../utils/constants';

const HomePage: React.FC = () => {
  const { learners, user, setUser } = useAppContext();
  const history = useHistory();
  const [showAbout, setShowAbout] = useState(false);
  const currentYear = new Date().getFullYear();
  const total   = learners.length;
  const males   = learners.filter(l => l.sex === 'Male').length;
  const females = learners.filter(l => l.sex === 'Female').length;
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const initials  = user?.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  const menuItems = [
    { icon: personAddOutline,         label: 'Add New Learner',  desc: 'Map a new ALS learner using Form 1',              color: '#2E7D32', grad: 'linear-gradient(135deg,#43A047,#2E7D32)', path: '/learners/new' },
    { icon: listOutline,              label: 'View All Learners', desc: `Browse & search ${total} mapped learner${total !== 1 ? 's' : ''}`, color: '#1565C0', grad: 'linear-gradient(135deg,#1976D2,#1565C0)', path: '/learners' },
    { icon: barChartOutline,          label: 'Analytics',         desc: 'View charts, breakdowns & insights',             color: '#7B1FA2', grad: 'linear-gradient(135deg,#9C27B0,#7B1FA2)', path: '/analytics' },
    { icon: informationCircleOutline, label: 'About This App',    desc: 'App details, district info & coverage',          color: '#0277BD', grad: 'linear-gradient(135deg,#039BE5,#0277BD)', path: null  },
  ];

  return (
    <IonPage>
      {/* ── Header ── */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8 }}>
              <div style={s.logoCircle}>
                <IonIcon icon={schoolOutline} style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 0.2 }}>ALS Mapping System</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Community Mapping Tool</div>
              </div>
            </div>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setUser(null)} title="Sign out">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <div style={s.ribbon}>
          {DISTRICT} &nbsp;&bull;&nbsp; {DIVISION} &nbsp;&bull;&nbsp; CY {currentYear}
        </div>
      </IonHeader>

      <IonContent style={{ '--background': '#F1F5F9' } as React.CSSProperties}>

        {/* ── Welcome banner ── */}
        <div style={s.welcomeBanner}>
          <div style={s.avatarCircle}>{initials}</div>
          <div>
            <div style={s.greeting}>Hello, {firstName}! 👋</div>
            <div style={s.subGreeting}>
              {total > 0
                ? `You have ${total} mapped learner${total !== 1 ? 's' : ''} so far.`
                : 'Get started by mapping your first learner.'}
            </div>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div style={s.statsRow}>
          {[
            { icon: peopleOutline,  val: total,   label: 'Total',  color: '#1565C0' },
            { icon: personOutline,  val: males,   label: 'Male',   color: '#1976D2' },
            { icon: personOutline,  val: females, label: 'Female', color: '#7B1FA2' },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <div style={{ ...s.statIcon, background: `${st.color}18` }}>
                <IonIcon icon={st.icon} style={{ color: st.color, fontSize: 18 }} />
              </div>
              <div style={{ ...s.statNum, color: st.color }}>{st.val}</div>
              <div style={s.statCap}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* ── Menu ── */}
        <div className="section-title">Quick Actions</div>
        {menuItems.map((item, idx) => (
          <IonCard
            key={item.label}
            button
            style={{ ...s.menuCard, animationDelay: `${idx * 0.07}s` }}
            onClick={() => item.path ? history.push(item.path) : setShowAbout(true)}
          >
            <IonCardContent style={{ padding: '14px 16px' }}>
              <div style={s.menuRow}>
                <div style={{ ...s.iconBox, background: item.grad }}>
                  <IonIcon icon={item.icon} style={{ color: '#fff', fontSize: 22 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={s.menuLabel}>{item.label}</div>
                  <div style={s.menuDesc}>{item.desc}</div>
                </div>
                <div style={s.chevronWrap}>
                  <IonIcon icon={chevronForwardOutline} style={{ color: '#64748B', fontSize: 14 }} />
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        <div style={{ height: 40 }} />
      </IonContent>

      {/* ── About modal ── */}
      <IonModal isOpen={showAbout} onDidDismiss={() => setShowAbout(false)} breakpoints={[0, 0.8]} initialBreakpoint={0.8} handle handleBehavior="cycle">
        <IonHeader>
          <IonToolbar>
            <IonTitle>About This App</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAbout(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText>
            <p>
              The <strong>ALS Mapping System</strong> is a mobile-first tool designed for ALS
              facilitators to efficiently map out-of-school youth (OSY) and adults in their
              communities using the official ALS Form 1 data fields.
            </p>
          </IonText>
          <IonList lines="none">
            <IonItem>
              <IonLabel>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#757575', textTransform: 'uppercase' }}>District</p>
                <h3 style={{ fontWeight: 700 }}>{DISTRICT}</h3>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#757575', textTransform: 'uppercase' }}>Division</p>
                <h3 style={{ fontWeight: 700 }}>{DIVISION}</h3>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#757575', textTransform: 'uppercase' }}>Region</p>
                <h3 style={{ fontWeight: 700 }}>{REGION}</h3>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#757575', textTransform: 'uppercase' }}>Barangays Covered</p>
                <p style={{ marginTop: 4, lineHeight: '1.6' }}>{BARANGAY_OPTIONS.join(', ')}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

const s: Record<string, React.CSSProperties> = {
  logoCircle: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  ribbon: {
    background: 'var(--ion-color-primary-shade)',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11, fontWeight: 700, textAlign: 'center',
    padding: '5px 16px', letterSpacing: 0.5,
  },
  welcomeBanner: {
    margin: '16px 16px 0',
    background: 'linear-gradient(135deg, #1565C0 0%, #0d47a1 100%)',
    borderRadius: 20,
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 8px 24px rgba(21,101,192,0.35)',
  },
  avatarCircle: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'rgba(255,255,255,0.22)',
    border: '2px solid rgba(255,255,255,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 900, fontSize: 18,
    flexShrink: 0,
  },
  greeting: { fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.3 },
  subGreeting: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3, fontWeight: 500 },
  statsRow: {
    display: 'flex', gap: 10, padding: '12px 16px',
  },
  statCard: {
    flex: 1, background: '#fff', borderRadius: 16,
    padding: '14px 8px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    border: '1px solid rgba(0,0,0,0.04)',
    animation: 'fadeSlideUp 0.3s ease both',
  },
  statIcon: {
    width: 32, height: 32, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  statNum: { fontSize: 26, fontWeight: 900, lineHeight: 1, letterSpacing: -1 },
  statCap: { fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.6 },
  menuCard: {
    margin: '0 16px 10px',
    borderRadius: 18,
    cursor: 'pointer',
    animation: 'fadeSlideUp 0.3s ease both',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  menuRow: { display: 'flex', alignItems: 'center', gap: 14 },
  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  menuLabel: { fontSize: 15, fontWeight: 800, color: '#1e293b', letterSpacing: 0.1 },
  menuDesc:  { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: 500 },
  chevronWrap: {
    width: 26, height: 26, borderRadius: '50%',
    background: '#E2E8F0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
};

export default HomePage;
