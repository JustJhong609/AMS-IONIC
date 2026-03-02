import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon, IonCard, IonCardContent,
} from '@ionic/react';
import { pencilOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/helpers';

const InfoRow: React.FC<{ label: string; value?: string | number | boolean | null }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{display}</span>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <IonCard>
    <IonCardContent>
      <div style={{ fontWeight: 800, color: 'var(--ion-color-primary)', marginBottom: 12, fontSize: 15 }}>{title}</div>
      {children}
    </IonCardContent>
  </IonCard>
);

const LearnerDetailPage: React.FC = () => {
  const { learners } = useAppContext();
  const { id }       = useParams<{ id: string }>();
  const history      = useHistory();
  const learner      = learners.find(l => l.id === id);

  if (!learner) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start"><IonBackButton defaultHref="/learners" /></IonButtons>
            <IonTitle>Learner Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p style={{ color: '#757575', textAlign: 'center', marginTop: 60 }}>Learner not found.</p>
        </IonContent>
      </IonPage>
    );
  }

  const fullName = `${learner.firstName} ${learner.middleName} ${learner.lastName}${learner.nameExtension ? ` ${learner.nameExtension}` : ''}`;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/learners" /></IonButtons>
          <IonTitle>Learner Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push(`/learners/edit/${learner.id}`)}>
              <IonIcon slot="icon-only" icon={pencilOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Header card */}
        <div style={{
          background: 'var(--ion-color-primary)',
          padding: '20px 16px 24px',
          color: '#fff',
        }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{fullName}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            {learner.age} yrs old &nbsp;|&nbsp; {learner.sex}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            Mapped: {formatDate(learner.dateMapped)}
          </div>
        </div>

        <SectionCard title="🗂 Administrative">
          <InfoRow label="Region"        value={learner.region} />
          <InfoRow label="Division"      value={learner.division} />
          <InfoRow label="District"      value={learner.district} />
          <InfoRow label="Calendar Year" value={learner.calendarYear} />
          <InfoRow label="Mapped By"     value={learner.mappedBy} />
        </SectionCard>

        <SectionCard title="👤 Personal Information">
          <InfoRow label="Last Name"      value={learner.lastName} />
          <InfoRow label="First Name"     value={learner.firstName} />
          <InfoRow label="Middle Name"    value={learner.middleName} />
          <InfoRow label="Name Extension" value={learner.nameExtension} />
          <InfoRow label="Sex"            value={learner.sex} />
          <InfoRow label="Civil Status"   value={learner.civilStatus} />
          <InfoRow label="Birthdate"      value={formatDate(learner.birthdate)} />
          <InfoRow label="Age"            value={learner.age} />
          <InfoRow label="Mother Tongue"  value={learner.motherTongue} />
          <InfoRow label="IP"             value={learner.isIP} />
          {learner.isIP && <InfoRow label="Tribe"         value={learner.ipTribe} />}
          <InfoRow label="Religion"       value={learner.religion} />
          <InfoRow label="4Ps / IP"       value={learner.is4PsMember || learner.isIP ? 'Yes' : 'No'} />
          {(learner.is4PsMember || learner.isIP) && <InfoRow label="Type" value={learner.fourPsOrIp} />}
          <InfoRow label="Person w/ Disability" value={learner.isPwd} />
          {learner.isPwd && <InfoRow label="Disability Type" value={learner.pwdType === 'Others (Please Specify)' ? learner.pwdTypeOther : learner.pwdType} />}
        </SectionCard>

        <SectionCard title="🏠 Address">
          <InfoRow label="Barangay"         value={learner.barangay} />
          <InfoRow label="Complete Address" value={learner.completeAddress} />
        </SectionCard>

        <SectionCard title="👨‍👩‍👧 Family">
          <InfoRow label="Role in Family"       value={learner.roleInFamily} />
          <InfoRow label="Father's Name"        value={learner.fatherName} />
          <InfoRow label="Mother's Name"        value={learner.motherName} />
          <InfoRow label="Guardian's Name"      value={learner.guardianName} />
          <InfoRow label="Guardian Occupation"  value={learner.guardianOccupation} />
        </SectionCard>

        <SectionCard title="🎓 Education Background">
          <InfoRow label="School / Course / Degree" value={learner.schoolName} />
          <InfoRow label="Currently Studying"     value={learner.currentlyStudying} />
          <InfoRow label="Last Grade Completed"   value={learner.lastGradeCompleted} />
          <InfoRow label="Reason Not Attending"   value={learner.reasonForNotAttending} />
          <InfoRow label="BLP"                    value={learner.isBlp} />
          <InfoRow label="Occupation Type"        value={learner.occupationType} />
          <InfoRow label="Employment Status"      value={learner.employmentStatus} />
          <InfoRow label="Monthly Income"         value={learner.monthlyIncome} />
          <InfoRow label="Interested in ALS"      value={learner.interestedInALS} />
          <InfoRow label="Contact Number"         value={learner.contactNumber} />
        </SectionCard>

        <SectionCard title="🚌 Logistics & Schedule">
          <InfoRow label="Distance (km)"          value={learner.distanceKm} />
          <InfoRow label="Travel Time"            value={learner.travelTime} />
          <InfoRow label="Transport Mode"         value={learner.transportMode} />
          <InfoRow label="Preferred Session Time" value={learner.preferredSessionTime} />
          <InfoRow label="Date Mapped"            value={formatDate(learner.dateMapped)} />
        </SectionCard>

        <div style={{ height: 32 }} />
      </IonContent>
    </IonPage>
  );
};

export default LearnerDetailPage;
