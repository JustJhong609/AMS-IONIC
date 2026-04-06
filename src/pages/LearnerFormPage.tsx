import React, { useState, useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonAlert, IonFooter, IonLoading,
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
import { BARANGAY_OPTIONS, MOTHER_TONGUE_OPTIONS } from '../utils/constants';
import { createLearner, fetchLearners, updateLearner } from '../utils/learnerApi';

const TOTAL_STEPS = 5;

const LearnerFormPage: React.FC = () => {
  const { learners, user, setLearners } = useAppContext();
  const history  = useHistory();
  const { id }   = useParams<{ id?: string }>();

  // If editing, pre-fill from existing learner
  const existingLearner = id ? learners.find(l => l.id === id) : undefined;
  const canEditLearner = !existingLearner || existingLearner.createdBy === user?.id;

  const getInitialData = (): LearnerFormData => {
    if (existingLearner) {
      const OTHER_OPTION = 'Others (Please Specify)';
      const isCustomMotherTongue =
        !!existingLearner.motherTongue && !MOTHER_TONGUE_OPTIONS.includes(existingLearner.motherTongue as any);
      const isCustomBarangay =
        !!existingLearner.barangay && !BARANGAY_OPTIONS.includes(existingLearner.barangay as any);

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
        motherTongue: isCustomMotherTongue ? OTHER_OPTION : existingLearner.motherTongue,
        motherTongueOther: isCustomMotherTongue ? existingLearner.motherTongue : '',
        isIP: existingLearner.isIP ? 'Yes' : 'No',
        ipTribe: existingLearner.ipTribe || '',
        religion: existingLearner.religion || '',
        is4PsMember: existingLearner.is4PsMember ? 'Yes' : 'No',
        fourPsOrIp: existingLearner.fourPsOrIp || '',
        isPwd: existingLearner.isPwd ? 'Yes' : 'No',
        pwdType: existingLearner.pwdType || '',
        pwdTypeOther: existingLearner.pwdTypeOther || '',
        barangay: isCustomBarangay ? OTHER_OPTION : existingLearner.barangay,
        barangayOther: isCustomBarangay ? existingLearner.barangay : '',
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
        schoolName: existingLearner.schoolName || '',
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
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    if (!canEditLearner) {
      setShowSaveAlert(false);
      setSaveError('You can only edit learner records that you added.');
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    const OTHER_OPTION = 'Others (Please Specify)';
    const resolvedMotherTongue =
      formData.motherTongue === OTHER_OPTION && formData.motherTongueOther.trim()
        ? formData.motherTongueOther.trim()
        : formData.motherTongue;
    const resolvedBarangay =
      formData.barangay === OTHER_OPTION && formData.barangayOther.trim()
        ? formData.barangayOther.trim()
        : formData.barangay;
    const resolvedCurrentlyStudying = formData.currentlyStudying || 'No';
    const resolvedInterestedInALS = formData.interestedInALS || 'No';

    const learner: Learner = {
      id: existingLearner?.id || generateId(),
      createdBy: existingLearner?.createdBy || user?.id,
      updatedAt: existingLearner?.updatedAt,
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
      motherTongue: resolvedMotherTongue,
      isIP: formData.isIP === 'Yes',
      ipTribe: formData.ipTribe.trim() || undefined,
      religion: formData.religion.trim() || undefined,
      is4PsMember: formData.is4PsMember === 'Yes' && formData.fourPsOrIp === "4P's",
      fourPsOrIp: formData.fourPsOrIp || undefined,
      isPwd: formData.isPwd === 'Yes',
      pwdType: formData.pwdType || undefined,
      pwdTypeOther: formData.pwdTypeOther.trim() || undefined,
      barangay: resolvedBarangay,
      completeAddress: formData.completeAddress.trim(),
      roleInFamily: formData.roleInFamily,
      fatherName: formData.fatherName.trim() || undefined,
      motherName: formData.motherName.trim() || undefined,
      guardianName: formData.guardianName.trim() || undefined,
      guardianOccupation: formData.guardianOccupation.trim() || undefined,
      currentlyStudying: resolvedCurrentlyStudying,
      lastGradeCompleted: formData.lastGradeCompleted,
      reasonForNotAttending: formData.reasonForNotAttending,
      reasonForNotAttendingOther: formData.reasonForNotAttendingOther.trim() || undefined,
      isBlp: formData.isBlp === 'Yes',
      schoolName: formData.schoolName.trim() || undefined,
      occupationType: formData.occupationType || undefined,
      employmentStatus: formData.employmentStatus || undefined,
      monthlyIncome: formData.monthlyIncome.trim() || undefined,
      interestedInALS: resolvedInterestedInALS,
      contactNumber: formData.contactNumber.trim() || undefined,
      distanceKm: parseFloat(formData.distanceKm),
      travelTime: formData.travelTime.trim(),
      transportMode: formData.transportMode,
      preferredSessionTime: formData.preferredSessionTime,
      dateMapped: formData.dateMapped,
    };

    try {
      if (existingLearner) {
        await updateLearner(learner);
      } else {
        await createLearner(learner);
      }

      // Refresh global learner list immediately so list page reflects latest data without app restart.
      const latestLearners = await fetchLearners();
      setLearners(latestLearners);

      setShowSaveAlert(false);
      history.replace('/learners');
    } catch (error: any) {
      setShowSaveAlert(false);
      setSaveError(error?.message || 'Failed to save learner. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sectionProps = { data: formData, errors, onChange: handleChange };
  const sections = [
    <PersonalInfoSection {...sectionProps} />,
    <EducationSection   {...sectionProps} />,
    <AddressSection     {...sectionProps} />,
    <FamilySection      {...sectionProps} />,
    <LogisticsSection   {...sectionProps} />,
  ];

  if (id && existingLearner && !canEditLearner) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/learners" />
            </IonButtons>
            <IonTitle>Edit Learner</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p style={{ color: '#757575', textAlign: 'center', marginTop: 48 }}>
            You can only edit learner records that you created.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <IonButton onClick={() => history.replace('/learners')}>
              Go Back to Learners
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

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
              disabled={isSaving}
              style={{ flex: 1, '--border-radius': '50px', '--border-color': '#CBD5E1', '--color': '#374151', '--background': '#F8FAFC', height: 48, fontWeight: 700 } as any}
            >
              <IonIcon slot="start" icon={chevronBackOutline} />
              {step === 0 ? 'Cancel' : 'Back'}
            </IonButton>
            <IonButton
              expand="block"
              onClick={goNext}
              disabled={isSaving}
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

      <IonAlert
        isOpen={!!saveError}
        onDidDismiss={() => setSaveError('')}
        header="Save Failed"
        message={saveError}
        buttons={['OK']}
      />

      <IonLoading
        isOpen={isSaving}
        message={existingLearner ? 'Updating learner record...' : 'Saving learner record...'}
        spinner="crescent"
      />
    </IonPage>
  );
};

export default LearnerFormPage;
