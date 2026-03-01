import React from 'react';
import { IonText, IonItem, IonTextarea } from '@ionic/react';
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
      <label className="form-label form-label-required">Complete Address</label>
      <IonItem fill="outline" style={{ '--border-radius': '10px', '--padding-start': '12px' } as React.CSSProperties}>
        <IonTextarea
          value={data.completeAddress}
          placeholder="House No., Street, Barangay, Municipality…"
          rows={4}
          onIonInput={e => onChange('completeAddress', e.detail.value!)}
          autoGrow
        />
      </IonItem>
      {errors.completeAddress && <div className="error-text">{errors.completeAddress}</div>}
    </div>
  </div>
);

const sectionStyle: React.CSSProperties = { fontWeight: 800, color: 'var(--ion-color-primary)', marginBottom: 12 };
export default AddressSection;
