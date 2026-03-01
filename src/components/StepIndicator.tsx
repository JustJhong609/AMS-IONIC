import React from 'react';
import { FORM_SECTIONS } from '../../utils/constants';

interface Props {
  currentStep: number;
}

const ICONS = ['👤', '🎓', '🏠', '👨‍👩‍👧', '🚌'];

const StepIndicator: React.FC<Props> = ({ currentStep }) => (
  <div className="step-bar">
    {FORM_SECTIONS.map((label, i) => {
      const cls = i < currentStep ? 'step-item done' : i === currentStep ? 'step-item active' : 'step-item';
      return (
        <div key={i} className={cls}>
          <div className="step-circle">
            {i < currentStep ? '✓' : ICONS[i]}
          </div>
          <div className="step-label">{label}</div>
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
