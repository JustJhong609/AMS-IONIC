import React from 'react';

interface Props {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const RadioGroup: React.FC<Props> = ({ label, options, value, onChange, error }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '4px 0' }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: '8px 18px',
            borderRadius: 8,
            border: `2px solid ${value === opt ? 'var(--ion-color-primary)' : '#E0E0E0'}`,
            background: value === opt ? 'var(--ion-color-primary)' : '#fff',
            color: value === opt ? '#fff' : '#212121',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
    {error && <div className="error-text">{error}</div>}
  </div>
);

export default RadioGroup;
