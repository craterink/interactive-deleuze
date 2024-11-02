import React from 'react'
import { AppMode } from '../App'

export const allSupportedDigits: SupportedDigit[] = [0, 1, 2, 3] //, 4, 5, 6, 7, 8, 9];
export type SupportedDigit = 0 | 1 | 2 | 3 // | 4 | 5 | 6 | 7 | 8 | 9;
interface ControlsProps {
  currentMode: AppMode
  onBWOSelect: () => void
  onStrataSelect: (number: SupportedDigit) => void
  onBecomingSelect: (number: SupportedDigit) => void
}

const Controls: React.FC<ControlsProps> = ({
  currentMode,
  onBWOSelect,
  onStrataSelect,
  onBecomingSelect,
}) => {
  const strataDigits = allSupportedDigits
  const becomingDigits = allSupportedDigits.filter(
    (digit) => currentMode.type !== 'strata' || digit !== currentMode.digit
  )
  return (
    <div>
      <div>
        <h3>Body without Organs</h3>
        <button onClick={() => onBWOSelect()}>BwO</button>
        <h3>Jump to Strata</h3>
        {strataDigits.map((num) => (
          <button key={num} onClick={() => onStrataSelect(num)}>
            Strata-{num}
          </button>
        ))}
      </div>
      {currentMode.type === 'strata' && (
        <div>
          <h3>Becoming</h3>
          {becomingDigits.map((num) => (
            <button key={num} onClick={() => onBecomingSelect(num)}>
              Becoming-{num}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Controls
