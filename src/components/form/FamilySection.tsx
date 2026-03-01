import React from 'react';
import { IonText } from '@ionic/react';
import { LearnerFormData, ValidationErrors } from '../../types';
import { FAMILY_ROLE_OPTIONS } from '../../utils/constants';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';

interface Props {
  data: LearnerFormData;
  errors: ValidationErrors;
  onChange: (field: keyof LearnerFormData, value: string) => void;
}

const FamilySection: React.FC<Props> = ({ data, errors, onChange }) => (
  <div>
    <IonText><h3 style={sectionStyle}>👨‍👩‍👧 Family Information</h3></IonText>
    <IonText><p style={{ color: '#757575', fontSize: 14, marginBottom: 16 }}>
      Role in the family is required. Other fields are optional.
    </p></IonText>

    <FormSelect label="Role in the Family" value={data.roleInFamily}
      onChange={v => onChange('roleInFamily', v)}
      options={FAMILY_ROLE_OPTIONS} required error={errors.roleInFamily} />

    <FormInput label="Father's Name (optional)" value={data.fatherName}
      onChange={v => onChange('fatherName', v)} placeholder="Full name" />

    <FormInput label="Mother's Name (optional)" value={data.motherName}
      onChange={v => onChange('motherName', v)} placeholder="Full name" />

    <FormInput label="Guardian's Name (optional)" value={data.guardianName}
      onChange={v => onChange('guardianName', v)} placeholder="Full name" />

    <FormInput label="Guardian's Occupation (optional)" value={data.guardianOccupation}
      onChange={v => onChange('guardianOccupation', v)} placeholder="e.g. Farmer" />
  </div>
);

const sectionStyle: React.CSSProperties = { fontWeight: 800, color: 'var(--ion-color-primary)', marginBottom: 12 };
export default FamilySection;
