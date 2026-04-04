import React, { useMemo, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonGrid,
  IonRow, IonCol, IonButton, IonIcon, IonItem, IonLabel,
  IonSelect, IonSelectOption,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAppContext } from '../context/AppContext';
import { BARANGAY_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type BarDatum = { label: string; value: number; color: string };

/* ── Chart.js bar chart ──────────────────────────────────────────────────────── */
const ChartBar: React.FC<{ data: BarDatum[] }> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Count',
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
      },
      y: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div style={{ height: Math.max(220, data.length * 42) }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

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

type ReportRow = {
  firstName: string;
  lastName: string;
  middleName: string;
  sex: 'Male' | 'Female';
  age: number;
  barangay: string;
  civilStatus: string;
  isBlp: boolean;
  lastGradeCompleted: string;
  schoolName: string;
  is4PsMember: boolean;
  isIP: boolean;
  isPwd: boolean;
  pwdType: string;
  dateMapped: string;
};

const AnalyticsPage: React.FC = () => {
  const { learners } = useAppContext();
  const [activeSection, setActiveSection] = useState('overview');

  const reportRows = useMemo<ReportRow[]>(() => {
    return learners.map(l => ({
      firstName: l.firstName,
      lastName: l.lastName,
      middleName: l.middleName,
      sex: l.sex,
      age: l.age,
      barangay: l.barangay,
      civilStatus: l.civilStatus,
      isBlp: l.isBlp,
      lastGradeCompleted: l.lastGradeCompleted,
      schoolName: l.schoolName || '',
      is4PsMember: l.is4PsMember,
      isIP: l.isIP,
      isPwd: l.isPwd,
      pwdType: l.pwdType || '',
      dateMapped: l.dateMapped,
    }));
  }, [learners]);

  const stats = useMemo(() => {
    let total = 0, male = 0, female = 0, fourPs = 0, ip = 0, pwd = 0;
    let studying = 0, notStudying = 0, interested = 0;
    let youth = 0, adult = 0, senior = 0;
    const byBarangay: Record<string, number> = {};
    const gradeMap:   Record<string, number> = {};
    const tongueMap:  Record<string, number> = {};
    const civilMap:   Record<string, number> = {};
    const transportMap: Record<string, number> = {};
    const pwdTypeMap:  Record<string, number> = {};

    learners.forEach(l => {
      total++;
      if (l.sex === 'Male')   male++;
      if (l.sex === 'Female') female++;
      if (l.is4PsMember)      fourPs++;
      if (l.isIP)             ip++;
      if (l.isPwd)            pwd++;
      if (l.currentlyStudying === 'Yes') studying++;
      if (l.currentlyStudying === 'No')  notStudying++;
      if (l.interestedInALS  === 'Yes')  interested++;

      const age = l.age;
      if (age <= 24)       youth++;
      else if (age <= 59)  adult++;
      else                 senior++;

      if (l.barangay)           byBarangay[l.barangay]      = (byBarangay[l.barangay]      || 0) + 1;
      const edKey = l.isBlp ? 'Basic Literacy Program (BLP)' : (l.lastGradeCompleted || '');
      if (edKey) gradeMap[edKey] = (gradeMap[edKey] || 0) + 1;
      if (l.motherTongue)       tongueMap[l.motherTongue]   = (tongueMap[l.motherTongue]   || 0) + 1;
      if (l.civilStatus)        civilMap[l.civilStatus]     = (civilMap[l.civilStatus]     || 0) + 1;
      if (l.transportMode)      transportMap[l.transportMode] = (transportMap[l.transportMode] || 0) + 1;
      if (l.isPwd && l.pwdType) pwdTypeMap[l.pwdType]       = (pwdTypeMap[l.pwdType]       || 0) + 1;
    });

    const barangayEntries = BARANGAY_OPTIONS
      .map(b => [b, byBarangay[b] || 0] as [string, number])
      .filter(([, v]) => v > 0);

    const gradeEntries = Object.entries(gradeMap).sort((a, b) => b[1] - a[1]);
    const topTongues   = Object.entries(tongueMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const civilEntries = Object.entries(civilMap).sort((a, b) => b[1] - a[1]);
    const transportEntries = Object.entries(transportMap).sort((a, b) => b[1] - a[1]);
    const pwdTypeEntries   = Object.entries(pwdTypeMap).sort((a, b) => b[1] - a[1]);

    return {
      total, male, female, fourPs, ip, pwd,
      studying, notStudying, interested,
      youth, adult, senior,
      barangayEntries, gradeEntries, topTongues, civilEntries, transportEntries, pwdTypeEntries,
    };
  }, [learners]);

  /* ── PDF Export ─────────────────────────────────────────────────────────── */
  const downloadPDF = (mode: 'summary' | 'individual' | 'byBarangay' | 'byEducation') => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const title = 'ALS Learner Analytics Report';
    const subtitle = `Generated: ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    const addHeader = () => {
      doc.setFontSize(16); doc.setFont('helvetica', 'bold');
      doc.text(title, 14, 16);
      doc.setFontSize(9); doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 14, 23);
    };

    if (mode === 'individual') {
      addHeader();
      autoTable(doc, {
        startY: 28,
        head: [['#', 'Full Name', 'Sex', 'Age', 'Barangay', 'Civil Status', 'Education', 'School/Course', '4Ps/IP', 'PWD', 'Date Mapped']],
        body: reportRows.map((l, i) => [
          i + 1,
          `${l.lastName}, ${l.firstName} ${l.middleName}`,
          l.sex,
          l.age,
          l.barangay,
          l.civilStatus,
          l.isBlp ? 'Basic Literacy Program (BLP)' : (l.lastGradeCompleted || '—'),
          l.isBlp ? '—' : (l.schoolName || '—'),
          l.is4PsMember ? "4P's" : l.isIP ? 'IP' : 'No',
          l.isPwd ? (l.pwdType || 'Yes') : 'No',
          formatDate(l.dateMapped),
        ]),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [21, 101, 192] },
        alternateRowStyles: { fillColor: [240, 248, 255] },
      });
      doc.save('als-learners-individual.pdf');

    } else if (mode === 'byBarangay') {
      addHeader();
      const grouped: Record<string, ReportRow[]> = {};
      reportRows.forEach(l => { if (!grouped[l.barangay]) grouped[l.barangay] = []; grouped[l.barangay].push(l); });
      let y = 28;
      Object.entries(grouped).forEach(([brgy, list]) => {
        doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        if (y > 170) { doc.addPage(); y = 14; }
        doc.text(`Barangay: ${brgy} (${list.length} learners)`, 14, y); y += 3;
        autoTable(doc, {
          startY: y,
          head: [['Full Name', 'Sex', 'Age', 'Education', 'PWD', 'Date Mapped']],
          body: list.map(l => [`${l.lastName}, ${l.firstName}`, l.sex, l.age, l.isBlp ? 'BLP' : (l.lastGradeCompleted || '—'), l.isPwd ? 'Yes' : 'No', formatDate(l.dateMapped)]),
          styles: { fontSize: 7 },
          headStyles: { fillColor: [21, 101, 192] },
          margin: { top: 28 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      });
      doc.save('als-learners-by-barangay.pdf');

    } else if (mode === 'byEducation') {
      addHeader();
      const grouped: Record<string, ReportRow[]> = {};
      reportRows.forEach(l => { const k = l.isBlp ? 'Basic Literacy Program (BLP)' : (l.lastGradeCompleted || 'Not Specified'); if (!grouped[k]) grouped[k] = []; grouped[k].push(l); });
      let y = 28;
      Object.entries(grouped).forEach(([grade, list]) => {
        if (y > 170) { doc.addPage(); y = 14; }
        doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(`${grade} (${list.length} learners)`, 14, y); y += 3;
        autoTable(doc, {
          startY: y,
          head: [['Full Name', 'Sex', 'Age', 'Barangay', 'School/Course', 'Date Mapped']],
          body: list.map(l => [`${l.lastName}, ${l.firstName}`, l.sex, l.age, l.barangay, l.schoolName || '—', formatDate(l.dateMapped)]),
          styles: { fontSize: 7 },
          headStyles: { fillColor: [0, 137, 123] },
          margin: { top: 28 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      });
      doc.save('als-learners-by-education.pdf');

    } else {
      // Summary PDF
      addHeader();
      autoTable(doc, {
        startY: 28,
        head: [['Category', 'Value']],
        body: [
          ['Total Learners', stats.total],
          ['Male', stats.male],
          ['Female', stats.female],
          ["4Ps Members", stats.fourPs],
          ['IP', stats.ip],
          ['PWD', stats.pwd],
          ['Studying', stats.studying],
          ['Not Studying', stats.notStudying],
          ['Interested in ALS', stats.interested],
          ['Youth (≤24)', stats.youth],
          ['Adult (25–59)', stats.adult],
          ['Senior (60+)', stats.senior],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [21, 101, 192] },
        columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
      });
      let y = (doc as any).lastAutoTable.finalY + 10;
      // By Barangay table
      if (stats.barangayEntries.length > 0) {
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.text('By Barangay', 14, y); y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Barangay', 'Count']],
          body: stats.barangayEntries.map(([k, v]) => [k, v]),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [0, 137, 123] },
          columnStyles: { 1: { halign: 'center' } },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }
      // By Education
      if (stats.gradeEntries.length > 0) {
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.text('By Educational Attainment', 14, y); y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Grade / Level', 'Count']],
          body: stats.gradeEntries.map(([k, v]) => [k, v]),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [123, 31, 162] },
          columnStyles: { 1: { halign: 'center' } },
        });
      }
      doc.save('als-analytics-summary.pdf');
    }
  };

  const {
    total, male, female, fourPs, ip, pwd,
    studying, notStudying, interested,
    youth, adult, senior,
  } = stats;

  const toBarData = (entries: [string, number][], colors: string[]) =>
    entries.map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));

  const BLUE_SHADES  = ['#1565C0','#0288D1','#00897B','#558B2F','#F57F17','#6A1B9A'];
  const PINK_SHADES  = ['#1565C0','#E91E63','#FF6F00','#2E7D32','#7B1FA2'];
  const LIGHT_BLUES  = ['#1565C0','#1E88E5','#42A5F5','#90CAF9','#BBDEFB'];
  const TEAL_SHADES  = ['#00897B','#00ACC1','#26A69A','#009688','#4DB6AC'];
  const PURPLE_SHADES = ['#7B1FA2','#9C27B0','#AB47BC','#CE93D8','#E1BEE7','#F3E5F5','#6A1B9A'];

  const barangayData  = toBarData(stats.barangayEntries, BLUE_SHADES);
  const gradeData     = toBarData(stats.gradeEntries,    TEAL_SHADES);
  const topTongueData = toBarData(stats.topTongues,      PINK_SHADES);
  const civilData     = toBarData(stats.civilEntries,    PINK_SHADES);
  const transportData = toBarData(stats.transportEntries, LIGHT_BLUES);
  const pwdTypeData   = toBarData(stats.pwdTypeEntries,  PURPLE_SHADES);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* ── Download Buttons ── */}
        <Heading>Download PDF Reports</Heading>
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <IonButton size="small" onClick={() => downloadPDF('summary')} style={{ '--border-radius': '20px' } as any}>
                <IonIcon slot="start" icon={downloadOutline} />Summary
              </IonButton>
              <IonButton size="small" fill="outline" onClick={() => downloadPDF('individual')} style={{ '--border-radius': '20px' } as any}>
                <IonIcon slot="start" icon={downloadOutline} />Individual
              </IonButton>
              <IonButton size="small" fill="outline" onClick={() => downloadPDF('byBarangay')} style={{ '--border-radius': '20px' } as any}>
                <IonIcon slot="start" icon={downloadOutline} />By Barangay
              </IonButton>
              <IonButton size="small" fill="outline" onClick={() => downloadPDF('byEducation')} style={{ '--border-radius': '20px' } as any}>
                <IonIcon slot="start" icon={downloadOutline} />By Education
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <Heading>View Section</Heading>
        <IonCard>
          <IonCardContent>
            <IonItem lines="none" style={{ '--background': '#F8FAFC', borderRadius: 12 } as React.CSSProperties}>
              <IonLabel position="stacked">Analytics Category</IonLabel>
              <IonSelect value={activeSection} interface="popover" onIonChange={e => setActiveSection(e.detail.value)}>
                <IonSelectOption value="overview">Overview</IonSelectOption>
                <IonSelectOption value="study">Study &amp; Interest</IonSelectOption>
                <IonSelectOption value="age">Age Groups</IonSelectOption>
                <IonSelectOption value="socio">Socio-Economic</IonSelectOption>
                <IonSelectOption value="pwd">PWD by Type</IonSelectOption>
                <IonSelectOption value="barangay">By Barangay</IonSelectOption>
                <IonSelectOption value="education">By Educational Attainment</IonSelectOption>
                <IonSelectOption value="civil">By Civil Status</IonSelectOption>
                <IonSelectOption value="tongue">Top Mother Tongues</IonSelectOption>
                <IonSelectOption value="transport">By Transport Mode</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* ── Overview ── */}
        {activeSection === 'overview' && (
          <>
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
          </>
        )}

        {/* ── Study / Interest ── */}
        {activeSection === 'study' && (
          <>
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
          </>
        )}

        {/* ── Age Groups ── */}
        {activeSection === 'age' && (
          <>
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
          </>
        )}

        {/* ── Socio-economic ── */}
        {activeSection === 'socio' && (
          <>
            <Heading>Socio-Economic</Heading>
            <IonCard>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol><StatCard label="IP" value={ip} color="#7B1FA2" /></IonCol>
                    <IonCol><StatCard label="4Ps Member" value={fourPs} color="#0288D1" /></IonCol>
                    <IonCol><StatCard label="PWD" value={pwd} color="#E65100" /></IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── PWD Breakdown ── */}
        {activeSection === 'pwd' && pwdTypeData.length > 0 && (
          <>
            <Heading>PWD by Type</Heading>
            <IonCard>
              <IonCardContent>
                <ChartBar data={pwdTypeData} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Barangay breakdown ── */}
        {activeSection === 'barangay' && barangayData.length > 0 && (
          <>
            <Heading>By Barangay</Heading>
            <IonCard>
              <IonCardContent>
                <ChartBar data={barangayData} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Last Grade Completed ── */}
        {activeSection === 'education' && gradeData.length > 0 && (
          <>
            <Heading>By Educational Attainment</Heading>
            <IonCard>
              <IonCardContent>
                <ChartBar data={gradeData} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Civil status ── */}
        {activeSection === 'civil' && civilData.length > 0 && (
          <>
            <Heading>By Civil Status</Heading>
            <IonCard>
              <IonCardContent>
                <ChartBar data={civilData} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Mother Tongue ── */}
        {activeSection === 'tongue' && topTongueData.length > 0 && (
          <>
            <Heading>Top Mother Tongues</Heading>
            <IonCard>
              <IonCardContent>
                <ChartBar data={topTongueData} />
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* ── Transport ── */}
        {activeSection === 'transport' && transportData.length > 0 && (
          <>
            <Heading>By Transport Mode</Heading>
            <IonCard>
              <IonCardContent>
                <ChartBar data={transportData} />
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
