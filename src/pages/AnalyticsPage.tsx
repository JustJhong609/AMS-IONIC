import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAppContext } from '../context/AppContext';
import { BARANGAY_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartDatum = { label: string; value: number; color: string };
type SectionKey =
  | 'overview'
  | 'study'
  | 'age'
  | 'socio'
  | 'pwd'
  | 'barangay'
  | 'education'
  | 'civil'
  | 'tongue'
  | 'transport';

type ReportMode = 'summary' | 'individual' | 'byBarangay' | 'byEducation';

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

const HEADING_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: '#1e293b',
  padding: '16px 16px 4px',
  letterSpacing: 0.2,
};

const PIE_OPTIONS: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
      },
    },
  },
};

const PiePane: React.FC<{ title: string; data: ChartDatum[] }> = ({ title, data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <>
      <div style={HEADING_STYLE}>{title}</div>
      <IonCard>
        <IonCardContent>
          <div className="analytics-pane">
            <div className="analytics-legends">
              {data.length === 0 ? (
                <IonText color="medium">
                  <p style={{ margin: 0 }}>No data available.</p>
                </IonText>
              ) : (
                data.map(item => {
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={item.label} className="legend-row">
                      <div className="legend-left">
                        <span className="legend-dot" style={{ background: item.color }} />
                        <span className="legend-label">{item.label}</span>
                      </div>
                      <div className="legend-right">{item.value} ({pct}%)</div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="analytics-chart-wrap">
              {data.length > 0 ? (
                <div className="analytics-chart-inner">
                  <Pie data={chartData} options={PIE_OPTIONS} />
                </div>
              ) : (
                <div className="analytics-empty">No chart data</div>
              )}
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

const AnalyticsPage: React.FC = () => {
  const { learners } = useAppContext();
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [reportMode, setReportMode] = useState<ReportMode>('summary');

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
    let total = 0;
    let male = 0;
    let female = 0;
    let fourPs = 0;
    let ip = 0;
    let pwd = 0;
    let studying = 0;
    let notStudying = 0;
    let interested = 0;
    let youth = 0;
    let adult = 0;
    let senior = 0;
    let elementary = 0;
    let jhs = 0;
    let blp = 0;

    const byBarangay: Record<string, number> = {};
    const gradeMap: Record<string, number> = {};
    const tongueMap: Record<string, number> = {};
    const civilMap: Record<string, number> = {};
    const transportMap: Record<string, number> = {};
    const pwdTypeMap: Record<string, number> = {};

    learners.forEach(l => {
      total += 1;
      if (l.sex === 'Male') male += 1;
      if (l.sex === 'Female') female += 1;
      if (l.is4PsMember) fourPs += 1;
      if (l.isIP) ip += 1;
      if (l.isPwd) pwd += 1;
      if (l.currentlyStudying === 'Yes') studying += 1;
      if (l.currentlyStudying === 'No') notStudying += 1;
      if (l.interestedInALS === 'Yes') interested += 1;

      if (l.age <= 24) youth += 1;
      else if (l.age <= 59) adult += 1;
      else senior += 1;

      if (l.isBlp) blp += 1;
      else if (l.lastGradeCompleted === 'G1 – G6 (Elementary)') elementary += 1;
      else if (
        l.lastGradeCompleted?.includes('1st Year HS') ||
        l.lastGradeCompleted?.includes('2nd Year HS') ||
        l.lastGradeCompleted?.includes('3rd Year HS')
      ) jhs += 1;

      if (l.barangay) byBarangay[l.barangay] = (byBarangay[l.barangay] || 0) + 1;
      const edKey = l.isBlp ? 'Basic Literacy Program (BLP)' : (l.lastGradeCompleted || 'Not specified');
      gradeMap[edKey] = (gradeMap[edKey] || 0) + 1;
      if (l.motherTongue) tongueMap[l.motherTongue] = (tongueMap[l.motherTongue] || 0) + 1;
      if (l.civilStatus) civilMap[l.civilStatus] = (civilMap[l.civilStatus] || 0) + 1;
      if (l.transportMode) transportMap[l.transportMode] = (transportMap[l.transportMode] || 0) + 1;
      if (l.isPwd && l.pwdType) pwdTypeMap[l.pwdType] = (pwdTypeMap[l.pwdType] || 0) + 1;
    });

    const barangayEntries = BARANGAY_OPTIONS
      .map(b => [b, byBarangay[b] || 0] as [string, number])
      .filter(([, value]) => value > 0);

    return {
      total,
      male,
      female,
      fourPs,
      ip,
      pwd,
      studying,
      notStudying,
      interested,
      youth,
      adult,
      senior,
      elementary,
      jhs,
      blp,
      barangayEntries,
      gradeEntries: Object.entries(gradeMap).sort((a, b) => b[1] - a[1]),
      topTongues: Object.entries(tongueMap).sort((a, b) => b[1] - a[1]).slice(0, 8),
      civilEntries: Object.entries(civilMap).sort((a, b) => b[1] - a[1]),
      transportEntries: Object.entries(transportMap).sort((a, b) => b[1] - a[1]),
      pwdTypeEntries: Object.entries(pwdTypeMap).sort((a, b) => b[1] - a[1]),
    };
  }, [learners]);

  const colorSets = {
    blue: ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1e3a8a', '#0ea5e9', '#0f766e'],
    warm: ['#e11d48', '#f43f5e', '#fb7185', '#f59e0b', '#f97316', '#ea580c', '#facc15', '#ef4444'],
    cool: ['#0f766e', '#14b8a6', '#2dd4bf', '#22c55e', '#84cc16', '#65a30d', '#16a34a', '#15803d'],
    purple: ['#7c3aed', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#6d28d9', '#581c87', '#4c1d95'],
  };

  const toChart = (entries: [string, number][], colors: string[]): ChartDatum[] =>
    entries
      .filter(([, value]) => value > 0)
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length],
      }));

  const sectionData: Record<SectionKey, { title: string; data: ChartDatum[] }> = {
    overview: {
      title: 'Overview: Education Level Focus',
      data: toChart([
        ['Elementary', stats.elementary],
        ['JHS', stats.jhs],
        ['BLP', stats.blp],
      ], colorSets.warm),
    },
    study: {
      title: 'Study and ALS Interest',
      data: toChart([
        ['Studying', stats.studying],
        ['Not Studying', stats.notStudying],
        ['Interested in ALS', stats.interested],
      ], colorSets.warm),
    },
    age: {
      title: 'Age Groups',
      data: toChart([
        ['Youth (<=24)', stats.youth],
        ['Adult (25-59)', stats.adult],
        ['Senior (60+)', stats.senior],
      ], colorSets.cool),
    },
    socio: {
      title: 'Socio-Economic Indicators',
      data: toChart([
        ['IP', stats.ip],
        ["4P's", stats.fourPs],
        ['PWD', stats.pwd],
      ], colorSets.purple),
    },
    pwd: {
      title: 'PWD by Type',
      data: toChart(stats.pwdTypeEntries, colorSets.purple),
    },
    barangay: {
      title: 'By Barangay',
      data: toChart(stats.barangayEntries, colorSets.blue),
    },
    education: {
      title: 'By Educational Attainment',
      data: toChart(stats.gradeEntries, colorSets.cool),
    },
    civil: {
      title: 'By Civil Status',
      data: toChart(stats.civilEntries, colorSets.warm),
    },
    tongue: {
      title: 'Top Mother Tongues',
      data: toChart(stats.topTongues, colorSets.blue),
    },
    transport: {
      title: 'By Transport Mode',
      data: toChart(stats.transportEntries, colorSets.cool),
    },
  };

  const downloadPDF = (mode: ReportMode) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const title = 'ALS Learner Analytics Report';
    const subtitle = `Generated: ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    const addHeader = () => {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 14, 16);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
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
      return;
    }

    if (mode === 'byBarangay') {
      addHeader();
      const grouped: Record<string, ReportRow[]> = {};
      reportRows.forEach(l => {
        if (!grouped[l.barangay]) grouped[l.barangay] = [];
        grouped[l.barangay].push(l);
      });
      let y = 28;
      Object.entries(grouped).forEach(([brgy, list]) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        if (y > 170) {
          doc.addPage();
          y = 14;
        }
        doc.text(`Barangay: ${brgy} (${list.length} learners)`, 14, y);
        y += 3;
        autoTable(doc, {
          startY: y,
          head: [['Full Name', 'Sex', 'Age', 'Education', 'PWD', 'Date Mapped']],
          body: list.map(l => [
            `${l.lastName}, ${l.firstName}`,
            l.sex,
            l.age,
            l.isBlp ? 'BLP' : (l.lastGradeCompleted || '—'),
            l.isPwd ? 'Yes' : 'No',
            formatDate(l.dateMapped),
          ]),
          styles: { fontSize: 7 },
          headStyles: { fillColor: [21, 101, 192] },
          margin: { top: 28 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      });
      doc.save('als-learners-by-barangay.pdf');
      return;
    }

    if (mode === 'byEducation') {
      addHeader();
      const grouped: Record<string, ReportRow[]> = {};
      reportRows.forEach(l => {
        const key = l.isBlp ? 'Basic Literacy Program (BLP)' : (l.lastGradeCompleted || 'Not Specified');
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(l);
      });
      let y = 28;
      Object.entries(grouped).forEach(([grade, list]) => {
        if (y > 170) {
          doc.addPage();
          y = 14;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${grade} (${list.length} learners)`, 14, y);
        y += 3;
        autoTable(doc, {
          startY: y,
          head: [['Full Name', 'Sex', 'Age', 'Barangay', 'School/Course', 'Date Mapped']],
          body: list.map(l => [
            `${l.lastName}, ${l.firstName}`,
            l.sex,
            l.age,
            l.barangay,
            l.schoolName || '—',
            formatDate(l.dateMapped),
          ]),
          styles: { fontSize: 7 },
          headStyles: { fillColor: [0, 137, 123] },
          margin: { top: 28 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      });
      doc.save('als-learners-by-education.pdf');
      return;
    }

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
        ['Youth (<=24)', stats.youth],
        ['Adult (25-59)', stats.adult],
        ['Senior (60+)', stats.senior],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [21, 101, 192] },
      columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
    });
    let y = (doc as any).lastAutoTable.finalY + 10;

    if (stats.barangayEntries.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('By Barangay', 14, y);
      y += 2;
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

    if (stats.gradeEntries.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('By Educational Attainment', 14, y);
      y += 2;
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
  };

  const current = sectionData[activeSection];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <style>
          {`
            .analytics-pane {
              display: flex;
              flex-direction: column;
              gap: 14px;
            }
            .analytics-legends {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 10px;
              order: 1;
            }
            .legend-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 10px;
              padding: 6px 2px;
              border-bottom: 1px dashed #e2e8f0;
            }
            .legend-row:last-child { border-bottom: 0; }
            .legend-left {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              min-width: 0;
            }
            .legend-dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              flex-shrink: 0;
            }
            .legend-label {
              font-size: 12px;
              font-weight: 600;
              color: #334155;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .legend-right {
              font-size: 12px;
              font-weight: 800;
              color: #0f172a;
              flex-shrink: 0;
            }
            .analytics-chart-wrap {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 12px;
              min-height: 280px;
              display: flex;
              align-items: center;
              justify-content: center;
              order: 2;
            }
            .analytics-chart-inner {
              width: 100%;
              max-width: 420px;
              height: 280px;
            }
            .analytics-empty {
              color: #64748b;
              font-size: 13px;
              font-weight: 600;
            }
            @media (min-width: 992px) {
              .analytics-pane {
                flex-direction: row;
                align-items: stretch;
              }
              .analytics-chart-wrap {
                flex: 1 1 65%;
                min-height: 360px;
                order: 1;
              }
              .analytics-chart-inner {
                max-width: 640px;
                height: 340px;
              }
              .analytics-legends {
                flex: 1 1 35%;
                max-width: 360px;
                order: 2;
                max-height: 360px;
                overflow: auto;
              }
            }
          `}
        </style>

        <div style={HEADING_STYLE}>Download PDF Reports</div>
        <IonCard>
          <IonCardContent>
            <IonItem lines="none" style={{ '--background': '#F8FAFC', borderRadius: 12 } as React.CSSProperties}>
              <IonLabel position="stacked">Report Type</IonLabel>
              <IonSelect
                value={reportMode}
                interface="popover"
                onIonChange={e => setReportMode(e.detail.value as ReportMode)}
              >
                <IonSelectOption value="summary">Summary</IonSelectOption>
                <IonSelectOption value="individual">Individual</IonSelectOption>
                <IonSelectOption value="byBarangay">By Barangay</IonSelectOption>
                <IonSelectOption value="byEducation">By Education</IonSelectOption>
              </IonSelect>
            </IonItem>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <IonButton onClick={() => downloadPDF(reportMode)} style={{ '--border-radius': '14px' } as React.CSSProperties}>
                <IonIcon slot="start" icon={downloadOutline} />
                Download PDF
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <div style={HEADING_STYLE}>View Section</div>
        <IonCard>
          <IonCardContent>
            <IonItem lines="none" style={{ '--background': '#F8FAFC', borderRadius: 12 } as React.CSSProperties}>
              <IonLabel position="stacked">Analytics Category</IonLabel>
              <IonSelect
                value={activeSection}
                interface="popover"
                onIonChange={e => setActiveSection(e.detail.value as SectionKey)}
              >
                <IonSelectOption value="overview">Overview</IonSelectOption>
                <IonSelectOption value="study">Study and Interest</IonSelectOption>
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

        <PiePane title={current.title} data={current.data} />

        <div style={{ height: 28 }} />
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsPage;
