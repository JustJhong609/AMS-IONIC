import React from 'react';
import { IonText } from '@ionic/react';
import { LearnerFormData, ValidationErrors } from '../../types';
import {
  CIVIL_STATUS_OPTIONS, MOTHER_TONGUE_OPTIONS, SEX_OPTIONS, YES_NO_OPTIONS,
} from '../../utils/constants';
import { calculateAge } from '../../utils/helpers';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import RadioGroup from '../RadioGroup';

interface Props {
  data: LearnerFormData;
  errors: ValidationErrors;
  onChange: (field: keyof LearnerFormData, value: string) => void;
}

const PersonalInfoSection: React.FC<Props> = ({ data, errors, onChange }) => {
  const handleBirthdate = (v: string) => {
    onChange('birthdate', v);
    if (v) {
      const age = calculateAge(v);
      onChange('age', String(age));
    }
  };

  return (
    <div>
      <IonText><h3 style={sectionStyle}>👤 Personal Information</h3></IonText>

      <FormInput label="Mapped By" value={data.mappedBy} onChange={v => onChange('mappedBy', v)}
        placeholder="Facilitator name" required error={errors.mappedBy} />

      <FormInput label="Last Name" value={data.lastName} onChange={v => onChange('lastName', v)}
        required error={errors.lastName} />
      <FormInput label="First Name" value={data.firstName} onChange={v => onChange('firstName', v)}
        required error={errors.firstName} />
      <FormInput label="Middle Name" value={data.middleName} onChange={v => onChange('middleName', v)}
        required error={errors.middleName} />
      <FormInput label="Name Extension" value={data.nameExtension}
        onChange={v => onChange('nameExtension', v)} placeholder="Jr., Sr., III…" />

      <RadioGroup label="Sex *" options={SEX_OPTIONS as unknown as string[]}
        value={data.sex} onChange={v => onChange('sex', v)} error={errors.sex} />

      <FormSelect label="Civil Status" value={data.civilStatus}
        onChange={v => onChange('civilStatus', v)}
        options={CIVIL_STATUS_OPTIONS} required error={errors.civilStatus} />

      <FormInput label="Birthdate" value={data.birthdate}
        onChange={handleBirthdate} type="date" required error={errors.birthdate} />

      {data.age && (
        <FormInput label="Age (auto-calculated)" value={data.age}
          onChange={() => {}} readonly />
      )}

      <FormSelect label="Mother Tongue" value={data.motherTongue}
        onChange={v => onChange('motherTongue', v)}
        options={MOTHER_TONGUE_OPTIONS} required error={errors.motherTongue} />

      <RadioGroup label="Indigenous Peoples (IP) *" options={['Yes', 'No']}
        value={data.isIP} onChange={v => onChange('isIP', v)} error={errors.isIP} />

      {data.isIP === 'Yes' && (
        <FormInput label="Tribe / Ethnic Group" value={data.ipTribe}
          onChange={v => onChange('ipTribe', v)} required error={errors.ipTribe} />
      )}

      <FormInput label="Religion (optional)" value={data.religion}
        onChange={v => onChange('religion', v)} />

      <RadioGroup label="4Ps Member *" options={YES_NO_OPTIONS as unknown as string[]}
        value={data.is4PsMember} onChange={v => onChange('is4PsMember', v)} error={errors.is4PsMember} />
    </div>
  );
};

const sectionStyle: React.CSSProperties = {
  fontWeight: 800, color: 'var(--ion-color-primary)', marginBottom: 12,
};

export default PersonalInfoSection;
