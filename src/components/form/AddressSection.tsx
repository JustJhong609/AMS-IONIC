import React from 'react';
import { IonText, IonTextarea } from '@ionic/react';
import { LearnerFormData, ValidationErrors } from '../../types';
import { BARANGAY_OPTIONS } from '../../utils/constants';
import FormSelect from '../FormSelect';

interface Props {
  data: LearnerFormData;
  errors: ValidationErrors;
  onChange: (field: keyof LearnerFormData, value: string) => void;
}

const AddressSection: React.FC<Props> = ({ data, errors, onChange }) => (
  <div>
    <IonText><h3 style={sectionStyle}>🏠 Address</h3></IonText>

    <FormSelect label="Barangay" value={data.barangay}
      onChange={v => onChange('barangay', v)}
      options={BARANGAY_OPTIONS} required error={errors.barangay} />

    <div className="form-group">
      <IonTextarea
        label="Complete Address *"
        labelPlacement="floating"
        fill="outline"
        value={data.completeAddress}
        placeholder="House No., Street, Barangay, Municipality…"
        rows={4}
        onIonInput={e => onChange('completeAddress', e.detail.value!)}
        autoGrow
        style={{ '--border-radius': '10px' } as React.CSSProperties}
      />
      {errors.completeAddress && <div className="error-text">{errors.completeAddress}</div>}
    </div>
  </div>
);

const sectionStyle: React.CSSProperties = { fontWeight: 800, color: 'var(--ion-color-primary)', marginBottom: 12 };
export default AddressSection;
