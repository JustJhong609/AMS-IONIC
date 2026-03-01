import React from 'react';
import { IonItem, IonInput } from '@ionic/react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
  readonly?: boolean;
  inputmode?: 'text' | 'numeric' | 'decimal' | 'tel';
}

const FormInput: React.FC<Props> = ({
  label, value, onChange, type = 'text', placeholder,
  required, error, readonly, inputmode,
}) => (
  <div className="form-group">
    <label className={`form-label${required ? ' form-label-required' : ''}`}>{label}</label>
    <IonItem fill="outline" style={{ '--border-radius': '10px' } as React.CSSProperties}>
      <IonInput
        value={value}
        type={type}
        placeholder={placeholder}
        onIonInput={e => onChange(e.detail.value!)}
        readonly={readonly}
        inputmode={inputmode}
        style={{ '--padding-start': '12px' } as React.CSSProperties}
      />
    </IonItem>
    {error && <div className="error-text">{error}</div>}
  </div>
);

export default FormInput;
