import React, { useState, useEffect } from "react";
import Display from "./components/Display";
import Controls from "./components/Controls";
import TransformationButtons from "./components/TransformationButtons";

const MAX_NOISE_LAYERS = 6;

const App: React.FC = () => {
  const [mode, setMode] = useState<"strata" | "bwo" | undefined>(undefined);
  const [mnistData, setMnistData] = useState<{
    [key: string]: number[][];
  } | null>(null);
  const [imageData, setImageData] = useState<number[] | null>(null);
  const [originalImage, setOriginalImage] = useState<number[] | null>(null); // To keep the original image for reterritorialization
  const [noiseLayerCount, setNoiseLayerCount] = useState(0);
  const [faceSize, setFaceSize] = useState(28);

  useEffect(() => {
    const loadMnistData = async () => {
      const response = await fetch("/mnist_subset.json");
      const data = await response.json();
      setMnistData(data);
    };
    loadMnistData();
  }, []);

  const loadImage = (digit: number) => {
    if (mnistData) {
      const digitImages = mnistData[digit.toString()];
      const randomImage =
        digitImages[Math.floor(Math.random() * digitImages.length)];
      setOriginalImage(randomImage.flat()); // Store the original image
      setImageData(randomImage.flat());
      setNoiseLayerCount(0); // Reset noise layers
    }
  };

  const handleStrataSelect = (digit: number) => {
    setMode("strata");
    setNoiseLayerCount(0); // Reset noise layers
    loadImage(digit);
  };

  const handleBWOSelect = () => {
    // Returns a random noise image
    setMode("bwo");
    const noiseImage = Array.from({ length: 784 }, () =>
      Math.floor(Math.random() * 256)
    );
    setOriginalImage(noiseImage); // Store the original image
    setImageData(noiseImage);
  };

  const noiseFactor = 20; // Adjust this to control the intensity of each noise layer

  const addNoise = () => {
    if (imageData && noiseLayerCount < MAX_NOISE_LAYERS) {
      const noisyImage = imageData.map((pixel) => {
        const noise = Math.floor((Math.random() - 0.5) * noiseFactor * 2); // Range: -noiseFactor to +noiseFactor
        return Math.round(Math.min(255, Math.max(0, pixel + noise)));
      });
      setImageData(noisyImage);
      setNoiseLayerCount(noiseLayerCount + 1);
    }
  };

  const removeNoise = () => {
    if (originalImage && noiseLayerCount > 0) {
      const adjustedImage = imageData!.map((pixel, index) => {
        const originalPixel = originalImage[index];
        const difference = pixel - originalPixel;
        const adjustment = difference / noiseLayerCount ** 2; // Remove 1/n of the difference
        return Math.round(originalPixel + adjustment);
      });
      setImageData(adjustedImage);
      setNoiseLayerCount(noiseLayerCount - 1);
    }
  };

  return (
    <div className="App">
      <Display imageData={imageData} />
      <Controls
        onBWOSelect={handleBWOSelect}
        onStrataSelect={handleStrataSelect}
        onBecomingSelect={() => {}}
      />
      <TransformationButtons
        onDeterritorialize={addNoise}
        onReterritorialize={removeNoise}
        disableDeterritorialize={
          mode !== "strata" || noiseLayerCount >= MAX_NOISE_LAYERS
        }
        disableReterritorialize={mode !== "strata" || noiseLayerCount <= 0}
      />
    </div>
  );
};

export default App;
