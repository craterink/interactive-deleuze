import React from "react";

interface ControlsProps {
  onBWOSelect: () => void;
  onStrataSelect: (number: number) => void;
  onBecomingSelect: (number: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onBWOSelect,
  onStrataSelect,
  onBecomingSelect,
}) => (
  <div>
    <div>
      <h3>Body without Organs</h3>
      <button onClick={() => onBWOSelect()}>BwO</button>
      <h3>Strata</h3>
      {[0, 1, 2, 3].map((num) => (
        <button key={num} onClick={() => onStrataSelect(num)}>
          Strata-{num}
        </button>
      ))}
    </div>
    <div>
      <h3>Becoming</h3>
      {[0, 1, 2, 3].map((num) => (
        <button key={num} onClick={() => onBecomingSelect(num)}>
          Becoming-{num}
        </button>
      ))}
    </div>
  </div>
);

export default Controls;
