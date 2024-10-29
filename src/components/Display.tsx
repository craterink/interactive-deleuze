import React from "react";

interface DisplayProps {
  imageData: number[] | null;
}

const Display: React.FC<DisplayProps> = ({ imageData }) => {
  const canvasSize = 140; // The displayed size for the canvas (larger than 28x28)

  return (
    <div>
      {imageData ? (
        <canvas
          width={28} // Keep the internal canvas resolution at 28x28
          height={28}
          style={{
            width: canvasSize, // Display the canvas at a larger size
            height: canvasSize,
            imageRendering: "pixelated",
          }}
          ref={(canvas) => {
            if (canvas && imageData) {
              const ctx = canvas.getContext("2d");
              if (ctx) {
                // Create a 28x28 image data object for the original resolution
                const imgData = ctx.createImageData(28, 28);

                // Set the pixel data (RGBA) for each pixel, ensuring 0-255 range
                imgData.data.set(
                  new Uint8ClampedArray(
                    imageData.flatMap((val) => [val, val, val, 255])
                  )
                );

                // Draw the image data onto the 28x28 canvas
                ctx.putImageData(imgData, 0, 0);
              }
            }
          }}
        />
      ) : (
        <p>No image loaded</p>
      )}
    </div>
  );
};

export default Display;
