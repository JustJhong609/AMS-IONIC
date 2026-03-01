import React, { useMemo } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonGrid,
  IonRow, IonCol, IonText,
} from '@ionic/react';
import { useAppContext } from '../context/AppContext';
import { BARANGAY_OPTIONS } from '../utils/constants';

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

  const stats = useMemo(() => {
    let total = 0, male = 0, female = 0, fourPs = 0, ip = 0;
    let studying = 0, notStudying = 0, interested = 0;
    let youth = 0, adult = 0, senior = 0;
    const byBarangay: Record<string, number> = {};
    const gradeMap:   Record<string, number> = {};
    const tongueMap:  Record<string, number> = {};
    const civilMap:   Record<string, number> = {};
    const transportMap: Record<string, number> = {};

    learners.forEach(l => {
      total++;
      if (l.sex === 'Male')   male++;
      if (l.sex === 'Female') female++;
      if (l.is4PsMember)      fourPs++;
      if (l.isIP)             ip++;
      if (l.currentlyStudying === 'Yes') studying++;
      if (l.currentlyStudying === 'No')  notStudying++;
      if (l.interestedInALS  === 'Yes')  interested++;

      const age = l.age;
      if (age <= 24)       youth++;
      else if (age <= 59)  adult++;
      else                 senior++;

      if (l.barangay)          byBarangay[l.barangay]      = (byBarangay[l.barangay]      || 0) + 1;
      if (l.lastGradeCompleted) gradeMap[l.lastGradeCompleted] = (gradeMap[l.lastGradeCompleted] || 0) + 1;
      if (l.motherTongue)      tongueMap[l.motherTongue]   = (tongueMap[l.motherTongue]   || 0) + 1;
      if (l.civilStatus)       civilMap[l.civilStatus]     = (civilMap[l.civilStatus]     || 0) + 1;
      if (l.transportMode)     transportMap[l.transportMode] = (transportMap[l.transportMode] || 0) + 1;
    });

    const barangayEntries = BARANGAY_OPTIONS
      .map(b => [b, byBarangay[b] || 0] as [string, number])
      .filter(([, v]) => v > 0);

    const gradeEntries = Object.entries(gradeMap).sort((a, b) => b[1] - a[1]);
    const topTongues   = Object.entries(tongueMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const civilEntries = Object.entries(civilMap).sort((a, b) => b[1] - a[1]);
    const transportEntries = Object.entries(transportMap).sort((a, b) => b[1] - a[1]);

    return {
      total, male, female, fourPs, ip,
      studying, notStudying, interested,
      youth, adult, senior,
      barangayEntries, gradeEntries, topTongues, civilEntries, transportEntries,
    };
  }, [learners]);

  const {
    total, male, female, fourPs, ip,
    studying, notStudying, interested,
    youth, adult, senior,
  } = stats;

  const toBarData = (entries: [string, number][], colors: string[]) =>
    entries.map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));

  const BLUE_SHADES  = ['#1565C0','#0288D1','#00897B','#558B2F','#F57F17','#6A1B9A'];
  const PINK_SHADES  = ['#1565C0','#E91E63','#FF6F00','#2E7D32','#7B1FA2'];
  const LIGHT_BLUES  = ['#1565C0','#1E88E5','#42A5F5','#90CAF9','#BBDEFB'];
  const TEAL_SHADES  = ['#00897B','#00ACC1','#26A69A','#009688','#4DB6AC'];

  const barangayData  = toBarData(stats.barangayEntries, BLUE_SHADES);
  const gradeData     = toBarData(stats.gradeEntries,    TEAL_SHADES);
  const topTongueData = toBarData(stats.topTongues,      PINK_SHADES);
  const civilData     = toBarData(stats.civilEntries,    PINK_SHADES);
  const transportData = toBarData(stats.transportEntries, LIGHT_BLUES);

  const maxOf = (arr: { value: number }[]) => Math.max(...arr.map(d => d.value), 1);

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
        <Heading>Study &amp; Interest</Heading>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><StatCard label="Studying" value={studying} color="var(--ion-color-success)" /></IonCol>
                <IonCol><StatCard label="Not Studying" value={notStudying} color="var(--ion-color-danger)" /></IonCol>
                <IonCol><StatCard label="ALS Interest" value={interested} color="#FF6F00" /></IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ── Age Groups ── */}
        <Heading>Age Groups</Heading>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><StatCard label="Youth (≤24)" value={youth} color="#1565C0" /></IonCol>
                <IonCol><StatCard label="Adult (25–59)" value={adult} color="#00897B" /></IonCol>
                <IonCol><StatCard label="Senior (60+)" value={senior} color="#7B1FA2" /></IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ── Age Groups ── */}
        <Heading>Age Groups</Heading>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><StatCard label="Youth (≤24)" value={youth} color="#1565C0" /></IonCol>
                <IonCol><StatCard label="Adult (25–59)" value={adult} color="#00897B" /></IonCol>
                <IonCol><StatCard label="Senior (60+)" value={senior} color="#7B1FA2" /></IonCol>
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
                <BarChart data={barangayData} max={maxOf(barangayData)} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Last Grade Completed ── */}
        {gradeData.length > 0 && (
          <>
            <Heading>Last Grade Completed</Heading>
            <IonCard>
              <IonCardContent>
                <BarChart data={gradeData} max={maxOf(gradeData)} />
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
                <BarChart data={civilData} max={maxOf(civilData)} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Mother Tongue ── */}
        {topTongueData.length > 0 && (
          <>
            <Heading>Top Mother Tongues</Heading>
            <IonCard>
              <IonCardContent>
                <BarChart data={topTongueData} max={maxOf(topTongueData)} />
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
                <BarChart data={transportData} max={maxOf(transportData)} />
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
