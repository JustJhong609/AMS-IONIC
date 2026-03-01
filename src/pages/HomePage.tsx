import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonIcon, IonButton, IonButtons,
  IonModal, IonText, IonList, IonItem, IonLabel,
} from '@ionic/react';
import {
  personAddOutline, listOutline, barChartOutline, informationCircleOutline,
  chevronForwardOutline, logOutOutline, schoolOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DISTRICT, DIVISION, REGION, BARANGAY_OPTIONS } from '../utils/constants';

const HomePage: React.FC = () => {
  const { learners, user, setUser } = useAppContext();
  const history = useHistory();
  const [showAbout, setShowAbout] = useState(false);
  const currentYear = new Date().getFullYear();
  const total  = learners.length;
  const males  = learners.filter(l => l.sex === 'Male').length;
  const females = learners.filter(l => l.sex === 'Female').length;

  const menuItems = [
    { icon: personAddOutline,  label: 'Add New Learner',  desc: 'Map a new ALS learner using Form 1',             color: '#2E7D32', path: '/learners/new' },
    { icon: listOutline,       label: 'View All Learners', desc: `Browse & search ${total} mapped learner${total !== 1 ? 's' : ''}`, color: '#1565C0', path: '/learners' },
    { icon: barChartOutline,   label: 'Analytics',         desc: 'View charts, breakdowns & insights',            color: '#7B1FA2', path: '/analytics' },
    { icon: informationCircleOutline, label: 'About This App', desc: 'App details, district info & coverage',     color: '#0288D1', path: null },
  ];

  return (
    <IonPage>
      {/* ── Header ── */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8 }}>
              <div style={styles.logoCircle}>
                <IonIcon icon={schoolOutline} style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>ALS Mapping System</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Community Mapping Tool</div>
              </div>
            </div>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setUser(null)}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {/* Admin ribbon */}
        <div style={styles.ribbon}>
          {DISTRICT} &nbsp;|&nbsp; {DIVISION} &nbsp;|&nbsp; CY {currentYear}
        </div>
      </IonHeader>

      <IonContent>
        {/* ── Welcome ── */}
        <div style={styles.welcome}>
          <div style={styles.greeting}>Hello, {user?.name.split(' ')[0]}</div>
          <div style={styles.subGreeting}>
            {total > 0
              ? `You have ${total} mapped learner${total !== 1 ? 's' : ''} so far.`
              : 'Get started by mapping your first learner.'}
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <IonCard style={styles.statBanner}>
          <IonCardContent>
            <div style={styles.statRow}>
              <div style={styles.statItem}>
                <div style={styles.statNum}>{total}</div>
                <div style={styles.statCap}>Total</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <div style={styles.statNum}>{males}</div>
                <div style={styles.statCap}>Male</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <div style={styles.statNum}>{females}</div>
                <div style={styles.statCap}>Female</div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* ── Menu ── */}
        <div className="section-title">Menu</div>
        {menuItems.map(item => (
          <IonCard
            key={item.label}
            style={styles.menuCard}
            onClick={() => item.path ? history.push(item.path) : setShowAbout(true)}
            button
          >
            <IonCardContent>
              <div style={styles.menuRow}>
                <div style={{ ...styles.iconBox, background: `${item.color}18` }}>
                  <IonIcon icon={item.icon} style={{ color: item.color, fontSize: 24 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.menuLabel}>{item.label}</div>
                  <div style={styles.menuDesc}>{item.desc}</div>
                </div>
                <IonIcon icon={chevronForwardOutline} style={{ color: '#9E9E9E' }} />
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        <div style={{ height: 32 }} />
      </IonContent>

      {/* ── About modal ── */}
      <IonModal isOpen={showAbout} onDidDismiss={() => setShowAbout(false)} breakpoints={[0, 0.75]} initialBreakpoint={0.75}>
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

const styles: Record<string, React.CSSProperties> = {
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbon: {
    background: 'var(--ion-color-primary-shade)',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: 600,
    textAlign: 'center',
    padding: '5px 16px',
    letterSpacing: 0.3,
  },
  welcome: { padding: '20px 16px 8px' },
  greeting: { fontSize: 24, fontWeight: 800, color: '#212121' },
  subGreeting: { fontSize: 14, color: '#757575', marginTop: 4 },
  statBanner: { margin: '8px 16px', borderRadius: 14 },
  statRow: { display: 'flex', alignItems: 'center' },
  statItem: { flex: 1, textAlign: 'center', padding: '4px 0' },
  statNum: { fontSize: 28, fontWeight: 900, color: 'var(--ion-color-primary)', lineHeight: '1' },
  statCap: { fontSize: 11, fontWeight: 600, color: '#757575', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
  statDivider: { width: 1, height: 40, background: '#E0E0E0' },
  menuCard: { cursor: 'pointer' },
  menuRow: { display: 'flex', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuLabel: { fontSize: 15, fontWeight: 700, color: '#212121' },
  menuDesc: { fontSize: 13, color: '#757575', marginTop: 2 },
};

export default HomePage;
