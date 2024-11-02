import React from 'react'

interface TransformationButtonsProps {
  onDeterritorialize: () => void
  onReterritorialize: () => void
  disableDeterritorialize: boolean
  disableReterritorialize: boolean
}

const TransformationButtons: React.FC<TransformationButtonsProps> = ({
  onDeterritorialize,
  onReterritorialize,
  disableDeterritorialize,
  disableReterritorialize,
}) => (
  <div>
    <button onClick={onDeterritorialize} disabled={disableDeterritorialize}>
      Deterritorialize
    </button>
    <button onClick={onReterritorialize} disabled={disableReterritorialize}>
      Reterritorialize
    </button>
  </div>
)

export default TransformationButtons
