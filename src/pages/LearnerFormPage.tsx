import React, { useState, useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonAlert, IonFooter,
} from '@ionic/react';
import { checkmarkOutline, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LearnerFormData, Learner } from '../types';
import { createEmptyFormData, generateId, calculateAge } from '../utils/helpers';
import { validateSection } from '../utils/validation';
import StepIndicator from '../components/StepIndicator';
import PersonalInfoSection from '../components/form/PersonalInfoSection';
import EducationSection   from '../components/form/EducationSection';
import AddressSection     from '../components/form/AddressSection';
import FamilySection      from '../components/form/FamilySection';
import LogisticsSection   from '../components/form/LogisticsSection';

const TOTAL_STEPS = 5;

const LearnerFormPage: React.FC = () => {
  const { learners, setLearners, user } = useAppContext();
  const history  = useHistory();
  const { id }   = useParams<{ id?: string }>();

  // If editing, pre-fill from existing learner
  const existingLearner = id ? learners.find(l => l.id === id) : undefined;

  const getInitialData = (): LearnerFormData => {
    if (existingLearner) {
      return {
        region:    existingLearner.region,
        division:  existingLearner.division,
        district:  existingLearner.district,
        calendarYear: existingLearner.calendarYear,
        mappedBy:  existingLearner.mappedBy,
        lastName:  existingLearner.lastName,
        firstName: existingLearner.firstName,
        middleName: existingLearner.middleName,
        nameExtension: existingLearner.nameExtension || '',
        sex: existingLearner.sex,
        civilStatus: existingLearner.civilStatus,
        birthdate: existingLearner.birthdate,
        age: String(existingLearner.age),
        motherTongue: existingLearner.motherTongue,
        isIP: existingLearner.isIP ? 'Yes' : 'No',
        ipTribe: existingLearner.ipTribe || '',
        religion: existingLearner.religion || '',
        is4PsMember: existingLearner.is4PsMember ? 'Yes' : 'No',
        barangay: existingLearner.barangay,
        completeAddress: existingLearner.completeAddress,
        roleInFamily: existingLearner.roleInFamily,
        fatherName: existingLearner.fatherName || '',
        motherName: existingLearner.motherName || '',
        guardianName: existingLearner.guardianName || '',
        guardianOccupation: existingLearner.guardianOccupation || '',
        currentlyStudying: existingLearner.currentlyStudying,
        lastGradeCompleted: existingLearner.lastGradeCompleted,
        reasonForNotAttending: existingLearner.reasonForNotAttending,
        reasonForNotAttendingOther: existingLearner.reasonForNotAttendingOther || '',
        isBlp: existingLearner.isBlp ? 'Yes' : 'No',
        occupationType: existingLearner.occupationType || '',
        employmentStatus: existingLearner.employmentStatus || '',
        monthlyIncome: existingLearner.monthlyIncome || '',
        interestedInALS: existingLearner.interestedInALS,
        contactNumber: existingLearner.contactNumber || '',
        distanceKm: String(existingLearner.distanceKm),
        travelTime: existingLearner.travelTime,
        transportMode: existingLearner.transportMode,
        preferredSessionTime: existingLearner.preferredSessionTime,
        dateMapped: existingLearner.dateMapped,
      };
    }
    const empty = createEmptyFormData();
    empty.mappedBy = user?.name || '';
    return empty;
  };

  const [step, setStep]         = useState(0);
  const [formData, setFormData] = useState<LearnerFormData>(getInitialData);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);

  const handleChange = (field: keyof LearnerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const goNext = () => {
    const result = validateSection(step, formData);
    if (!result.isValid) { setErrors(result.errors); contentRef.current?.scrollToTop(300); return; }
    setErrors({});
    if (step < TOTAL_STEPS - 1) { setStep(step + 1); contentRef.current?.scrollToTop(300); }
    else setShowSaveAlert(true);
  };

  const goBack = () => {
    if (step === 0) { history.goBack(); return; }
    setErrors({});
    setStep(step - 1);
    contentRef.current?.scrollToTop(300);
  };

  const handleSave = () => {
    const birthDate = new Date(formData.birthdate);
    const learner: Learner = {
      id: existingLearner?.id || generateId(),
      region:    formData.region,
      division:  formData.division,
      district:  formData.district,
      calendarYear: formData.calendarYear,
      mappedBy:  formData.mappedBy.trim(),
      lastName:  formData.lastName.trim(),
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim(),
      nameExtension: formData.nameExtension.trim() || undefined,
      sex: formData.sex as 'Male' | 'Female',
      civilStatus: formData.civilStatus,
      birthdate: formData.birthdate,
      age: calculateAge(formData.birthdate),
      motherTongue: formData.motherTongue,
      isIP: formData.isIP === 'Yes',
      ipTribe: formData.ipTribe.trim() || undefined,
      religion: formData.religion.trim() || undefined,
      is4PsMember: formData.is4PsMember === 'Yes',
      barangay: formData.barangay,
      completeAddress: formData.completeAddress.trim(),
      roleInFamily: formData.roleInFamily,
      fatherName: formData.fatherName.trim() || undefined,
      motherName: formData.motherName.trim() || undefined,
      guardianName: formData.guardianName.trim() || undefined,
      guardianOccupation: formData.guardianOccupation.trim() || undefined,
      currentlyStudying: formData.currentlyStudying,
      lastGradeCompleted: formData.lastGradeCompleted,
      reasonForNotAttending: formData.reasonForNotAttending,
      reasonForNotAttendingOther: formData.reasonForNotAttendingOther.trim() || undefined,
      isBlp: formData.isBlp === 'Yes',
      occupationType: formData.occupationType || undefined,
      employmentStatus: formData.employmentStatus || undefined,
      monthlyIncome: formData.monthlyIncome.trim() || undefined,
      interestedInALS: formData.interestedInALS,
      contactNumber: formData.contactNumber.trim() || undefined,
      distanceKm: parseFloat(formData.distanceKm),
      travelTime: formData.travelTime.trim(),
      transportMode: formData.transportMode,
      preferredSessionTime: formData.preferredSessionTime,
      dateMapped: formData.dateMapped,
    };

    if (existingLearner) {
      setLearners(prev => prev.map(l => (l.id === learner.id ? learner : l)));
    } else {
      setLearners(prev => [...prev, learner]);
    }

    setShowSaveAlert(false);
    history.replace('/learners');
  };

  const sectionProps = { data: formData, errors, onChange: handleChange };
  const sections = [
    <PersonalInfoSection {...sectionProps} />,
    <EducationSection   {...sectionProps} />,
    <AddressSection     {...sectionProps} />,
    <FamilySection      {...sectionProps} />,
    <LogisticsSection   {...sectionProps} />,
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/learners" />
          </IonButtons>
          <IonTitle>{existingLearner ? 'Edit Learner' : 'New Learner'}</IonTitle>
        </IonToolbar>
        <StepIndicator currentStep={step} />
      </IonHeader>

      <IonContent ref={contentRef} className="ion-padding">
        {sections[step]}
        <div style={{ height: 24 }} />
      </IonContent>

      <IonFooter>
        <IonToolbar style={{ padding: '10px 16px', '--background': '#fff', '--border-width': '0', boxShadow: '0 -1px 0 #F1F5F9' } as any}>
          <div style={{ display: 'flex', gap: 10 }}>
            <IonButton
              expand="block"
              fill="outline"
              onClick={goBack}
              style={{ flex: 1, '--border-radius': '50px', '--border-color': '#CBD5E1', '--color': '#374151', '--background': '#F8FAFC', height: 48, fontWeight: 700 } as any}
            >
              <IonIcon slot="start" icon={chevronBackOutline} />
              {step === 0 ? 'Cancel' : 'Back'}
            </IonButton>
            <IonButton
              expand="block"
              onClick={goNext}
              style={{ flex: 2, '--border-radius': '50px', '--background': 'linear-gradient(135deg,#1976d2 0%,#1565C0 60%,#0d47a1 100%)', '--box-shadow': '0 6px 20px rgba(21,101,192,0.38)', height: 48, fontWeight: 800 } as any}
            >
              {step === TOTAL_STEPS - 1 ? (
                <><IonIcon slot="start" icon={checkmarkOutline} /> Save Learner</>
              ) : (
                <>Next <IonIcon slot="end" icon={chevronForwardOutline} /></>
              )}
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>

      {/* Save confirm alert */}
      <IonAlert
        isOpen={showSaveAlert}
        onDidDismiss={() => setShowSaveAlert(false)}
        header="Save Learner"
        message={`Save ${formData.firstName} ${formData.lastName}'s record?`}
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Save', handler: handleSave },
        ]}
      />
    </IonPage>
  );
};

export default LearnerFormPage;
