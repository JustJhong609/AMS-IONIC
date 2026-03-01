import React from 'react';
import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormSelect: React.FC<Props> = ({ label, value, onChange, options, placeholder, required, error }) => (
  <div className="form-group">
    <label className={`form-label${required ? ' form-label-required' : ''}`}>{label}</label>
    <IonItem fill="outline" style={{ '--border-radius': '10px' } as React.CSSProperties}>
      <IonSelect
        value={value || undefined}
        placeholder={placeholder || `-- Select ${label} --`}
        onIonChange={e => onChange(e.detail.value)}
        interface="action-sheet"
        style={{ width: '100%' }}
      >
        {options.map(opt => (
          <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
    {error && <div className="error-text">{error}</div>}
  </div>
);

export default FormSelect;
