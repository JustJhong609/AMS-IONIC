import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonGrid,
  IonRow, IonCol, IonText,
} from '@ionic/react';
import { useAppContext } from '../context/AppContext';

/* ── Mini bar chart ──────────────────────────────────────────────────────────── */
const BarChart: React.FC<{ data: { label: string; value: number; color: string }[]; max: number }> = ({ data, max }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {data.map(item => (
      <div key={item.label}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#424242' }}>{item.label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: '#F5F5F5', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: 4,
            background: item.color,
            width: max > 0 ? `${(item.value / max) * 100}%` : '0%',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
    ))}
  </div>
);

/* ── Stat card ───────────────────────────────────────────────────────────────── */
const StatCard: React.FC<{ label: string; value: number; color?: string }> = ({
  label, value, color = 'var(--ion-color-primary)'
}) => (
  <div className="stat-card">
    <div className="stat-value" style={{ color }}>{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

/* ── Section heading ─────────────────────────────────────────────────────────── */
const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 14, fontWeight: 800, color: '#212121',
    padding: '16px 16px 4px', letterSpacing: 0.2,
  }}>{children}</div>
);

/* ═══════════════════════════════════════════════════════════════════════════════ */

const AnalyticsPage: React.FC = () => {
  const { learners } = useAppContext();
  const total   = learners.length;
  const male    = learners.filter(l => l.sex === 'Male').length;
  const female  = learners.filter(l => l.sex === 'Female').length;
  const studying    = learners.filter(l => l.currentlyStudying === 'Yes').length;
  const notStudying = learners.filter(l => l.currentlyStudying === 'No').length;
  const ip      = learners.filter(l => l.isIP).length;
  const fourPs  = learners.filter(l => l.is4PsMember).length;
  const interested = learners.filter(l => l.interestedInALS === 'Yes').length;

  // Civil status breakdown
  const civilMap: Record<string, number> = {};
  learners.forEach(l => { civilMap[l.civilStatus] = (civilMap[l.civilStatus] || 0) + 1; });
  const civilData = Object.entries(civilMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label, value,
      color: ['#1565C0','#E91E63','#FF6F00','#2E7D32','#7B1FA2'][i % 5],
    }));

  // Barangay breakdown
  const barangayMap: Record<string, number> = {};
  learners.forEach(l => { barangayMap[l.barangay] = (barangayMap[l.barangay] || 0) + 1; });
  const barangayData = Object.entries(barangayMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label, value,
      color: ['#1565C0','#0288D1','#00897B','#558B2F','#F57F17','#6A1B9A'][i % 6],
    }));

  // Transport breakdown
  const transportMap: Record<string, number> = {};
  learners.forEach(l => { transportMap[l.transportMode] = (transportMap[l.transportMode] || 0) + 1; });
  const transportData = Object.entries(transportMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label, value,
      color: ['#1565C0','#1E88E5','#42A5F5','#90CAF9','#BBDEFB'][i % 5],
    }));

  const maxBarangay  = Math.max(...barangayData.map(d => d.value), 1);
  const maxCivil     = Math.max(...civilData.map(d => d.value), 1);
  const maxTransport = Math.max(...transportData.map(d => d.value), 1);

  if (total === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
            <IonTitle>Analytics</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <IonText color="medium"><h2>No Data Yet</h2><p>Map some learners first to see analytics.</p></IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* ── Overview ── */}
        <Heading>Overview</Heading>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><StatCard label="Total" value={total} /></IonCol>
                <IonCol><StatCard label="Male" value={male} color="#1E88E5" /></IonCol>
                <IonCol><StatCard label="Female" value={female} color="#E91E63" /></IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ── Study / Interest ── */}
        <Heading>Study & Interest</Heading>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><StatCard label="Studying" value={studying} color="var(--ion-color-success)" /></IonCol>
                <IonCol><StatCard label="Not Studying" value={notStudying} color="var(--ion-color-danger)" /></IonCol>
                <IonCol><StatCard label="Interested in ALS" value={interested} color="#FF6F00" /></IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ── Socio-economic ── */}
        <Heading>Socio-Economic</Heading>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><StatCard label="IP" value={ip} color="#7B1FA2" /></IonCol>
                <IonCol><StatCard label="4Ps Member" value={fourPs} color="#0288D1" /></IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ── Barangay breakdown ── */}
        {barangayData.length > 0 && (
          <>
            <Heading>By Barangay</Heading>
            <IonCard>
              <IonCardContent>
                <BarChart data={barangayData} max={maxBarangay} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Civil status ── */}
        {civilData.length > 0 && (
          <>
            <Heading>By Civil Status</Heading>
            <IonCard>
              <IonCardContent>
                <BarChart data={civilData} max={maxCivil} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Transport ── */}
        {transportData.length > 0 && (
          <>
            <Heading>By Transport Mode</Heading>
            <IonCard>
              <IonCardContent>
                <BarChart data={transportData} max={maxTransport} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        <div style={{ height: 32 }} />
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsPage;
