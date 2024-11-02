import React, { useState, useEffect, useMemo } from 'react'
import Display from './components/Display'
import Controls, { SupportedDigit } from './components/Controls'
import TransformationButtons from './components/TransformationButtons'

const MAX_NOISE_LAYERS = 6

export type StrataMode = {
  type: 'strata'
  digit: SupportedDigit
  noise: number[]
  noiseLayerCount: number
  currentProbStep: number
  currentBecomingDigit: SupportedDigit | null
}

export type AppMode = StrataMode | { type: 'bwo' } | { type: 'unloaded' }

type AppState = {
  mode: AppMode
  digitSimilarityData: {
    [digitX: string]: {
      [digitY: string]: { image_values: number[]; probability: number }[]
    }
  } | null
  mnistData: { [key: string]: number[][] } | null
  originalImage: number[] | null
  faceSize: number
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: { type: 'unloaded' },
    digitSimilarityData: null,
    mnistData: null,
    originalImage: null,
    faceSize: 28,
  })

  useEffect(() => {
    const loadDigitSimilarityData = async () => {
      const response = await fetch('/digit_similarity.json')
      const data = await response.json()
      setState((prevState) => ({ ...prevState, digitSimilarityData: data }))
    }

    const loadMnistData = async () => {
      const response = await fetch('/mnist_subset.json')
      const data = await response.json()
      setState((prevState) => ({ ...prevState, mnistData: data }))
    }

    loadDigitSimilarityData()
    loadMnistData()
  }, [])

  const handleStrataSelect = (digit: SupportedDigit) => {
    if (state.mnistData) {
      const digitImages = state.mnistData[digit.toString()]
      const randomImage =
        digitImages[Math.floor(Math.random() * digitImages.length)]
      const flatImage = randomImage.flat()
      setState({
        ...state,
        originalImage: flatImage,
        mode: {
          type: 'strata',
          digit,
          noise: new Array(flatImage.length).fill(0), // Initialize noise array
          noiseLayerCount: 0,
          currentProbStep: 0,
          currentBecomingDigit: null,
        },
      })
    }
  }

  const handleBWOSelect = () => {
    const noiseImage = Array.from({ length: 784 }, () =>
      Math.floor(Math.random() * 256)
    )
    setState({
      ...state,
      mode: { type: 'bwo' },
      originalImage: noiseImage,
    })
  }

  const handleBecomingSelect = (becomeThisDigit: SupportedDigit) => {
    if (
      state.digitSimilarityData &&
      state.originalImage &&
      state.mode?.type === 'strata'
    ) {
      let probStepToUse = state.mode.currentProbStep
      if (state.mode.currentBecomingDigit !== becomeThisDigit) {
        probStepToUse = 0
      }

      const currentDigit = state.mode.digit
      if (state.digitSimilarityData[currentDigit]) {
        const sortedExamples =
          state.digitSimilarityData[currentDigit][becomeThisDigit]
        const newProbSteps = sortedExamples.map(
          (example) => example.image_values
        )

        if (probStepToUse < newProbSteps.length) {
          setState({
            ...state,
            originalImage: newProbSteps[probStepToUse],
            mode: {
              ...state.mode,
              currentProbStep: probStepToUse + 1,
              currentBecomingDigit: becomeThisDigit,
            },
          })
        }
      }
    }
  }

  const noiseFactor = 20

  const addNoise = () => {
    if (
      state.originalImage &&
      state.mode.type === 'strata' &&
      state.mode.noiseLayerCount < MAX_NOISE_LAYERS
    ) {
      const newNoise = state.mode.noise.map(() =>
        Math.floor((Math.random() - 0.5) * noiseFactor * 2)
      )
      const updatedNoise = state.mode.noise.map(
        (n, index) => n + newNoise[index]
      )

      setState({
        ...state,
        mode: {
          ...state.mode,
          noise: updatedNoise,
          noiseLayerCount: state.mode.noiseLayerCount + 1,
        },
      })
    }
  }

  const removeNoise = () => {
    const { mode } = state
    if (mode.type === 'strata' && mode.noiseLayerCount > 0) {
      const reducedNoise = mode.noise.map((n) => n - n / mode.noiseLayerCount)

      const newStrataMode: StrataMode = {
        ...mode,
        noise: reducedNoise,
        noiseLayerCount: mode.noiseLayerCount - 1,
      }
      setState({
        ...state,
        mode: newStrataMode,
      })
    }
  }

  // Compute the final image with noise applied
  const displayedImage = useMemo(() => {
    const { mode } = state

    if (!state.originalImage || mode.type !== 'strata')
      return state.originalImage

    return state.originalImage.map((pixel, index) =>
      Math.round(Math.min(255, Math.max(0, pixel + mode.noise[index])))
    )
  }, [state.originalImage, state.mode])

  return (
    <div className="App">
      <Display imageData={displayedImage} />
      <Controls
        currentMode={state.mode}
        onBWOSelect={handleBWOSelect}
        onStrataSelect={handleStrataSelect}
        onBecomingSelect={handleBecomingSelect}
      />
      {state.mode?.type === 'strata' && (
        <TransformationButtons
          onDeterritorialize={addNoise}
          onReterritorialize={removeNoise}
          disableDeterritorialize={
            state.mode.noiseLayerCount >= MAX_NOISE_LAYERS
          }
          disableReterritorialize={state.mode.noiseLayerCount <= 0}
        />
      )}
    </div>
  )
}

export default App
